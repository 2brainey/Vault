// dashboard.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Go up two folders to find 'data'
import { 
  initialData, SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, 
  INVENTORY_SLOTS, USER_NAME, MAX_TOTAL_LEVEL 
} from '../../data/gamedata'; 

// Import siblings (files in the same folder)
import { 
  WellnessBar, InventoryGrid, ContractWidget, CollectionBinder, 
  SkillMatrix, AssetBar, InputGroup, InputField, SkillDetailModal, 
  MasteryLogModal 
} from './dashboardui';

import { RenderIcon, getRarityColor } from './dashboardutils';

// === MAIN CONTROLLER ===
export default function VaultDashboard() {
  // --- STATE ---
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_data_v24.1'); 
      // Helper to ensure all necessary fields exist
      const loaded = saved ? JSON.parse(saved) : initialData;
      const safe = { ...initialData, ...loaded };
      safe.layout = { 
        home: { left: [], right: [], ...loaded.layout?.home },
        profile: { left: [], center: [], right: [], ...loaded.layout?.profile },
        vault: { left: [], center: [], right: [], ...loaded.layout?.vault }
      };
      safe.widgetConfig = { ...initialData.widgetConfig, ...loaded.widgetConfig };
      if (!Array.isArray(safe.inventory)) safe.inventory = initialData.inventory;
      return safe;
    } catch (e) {
      return initialData;
    }
  });
  
  const [activeTab, setActiveTab] = useState('dynamic'); 
  const [homeWidgetTab, setHomeWidgetTab] = useState('skills'); 
  const [profileWidgetTab, setProfileWidgetTab] = useState('skills'); 
  const [dailyOpsTab, setDailyOpsTab] = useState('vitals'); 
  const [shopTab, setShopTab] = useState('boosters');
  const [miniShopTab, setMiniShopTab] = useState('boosters'); 
  const [questFilter, setQuestFilter] = useState('active'); 
  const [rewardModal, setRewardModal] = useState(null); 
  const [skillModal, setSkillModal] = useState(null); 
  const [masteryLogOpen, setMasteryLogOpen] = useState(false); 
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [packOpening, setPackOpening] = useState(null);
  const [dragItem, setDragItem] = useState(null);

  const colors = {
    bg: "#2b3446",
    border: "#404e6d",
    accentSecondary: "#78643e",
    accentPrimary: "#e1b542"
  };

  useEffect(() => {
    localStorage.setItem('vault_data_v24.1', JSON.stringify(data));
  }, [data]);

  // --- VITAL DECAY ---
  useEffect(() => {
    const timer = setInterval(() => {
        setData(prev => ({
            ...prev,
            wellness: {
                energy: Math.max(0, prev.wellness.energy - 1),
                hydration: Math.max(0, prev.wellness.hydration - 1),
                focus: Math.max(0, prev.wellness.focus - 1)
            }
        }));
    }, 30000); 
    return () => clearInterval(timer);
  }, []);

  // --- MEMOIZED CALCULATIONS ---
  // Optimization: Only recalculate these when specific data changes, not on every render
  const financials = useMemo(() => {
      const totalAssets = Object.values(data.assets || {}).reduce((a, b) => Number(a || 0) + Number(b || 0), 0) + Number(data.cash || 0);
      const totalLiabilities = Object.values(data.liabilities || {}).reduce((a, b) => Number(a || 0) + Number(b || 0), 0);
      const netWorth = totalAssets - totalLiabilities;
      const monthlyCashFlow = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
      const runwayMonths = ((data.cash || 0) / (data.monthlyExpenses || 1)).toFixed(1);
      return { totalAssets, totalLiabilities, netWorth, monthlyCashFlow, runwayMonths };
  }, [data.assets, data.cash, data.liabilities, data.monthlyIncome, data.monthlyExpenses]);

  const playerSkills = useMemo(() => {
    const calcLevel = (xp) => Math.max(1, Math.min(Math.floor(25 * Math.log10((xp / 100) + 1)), 99));
    const getXP = (base, id) => (Number(base) || 0) + (data.bonusXP?.[id] || 0);
    const BASE_DEV_XP = 35000; const BASE_SOCIAL_XP = 15000; const BASE_AGE_XP = 85000; 

    return [
      { id: 'inc', name: "Income", iconName: "Sword", level: calcLevel(getXP((data.monthlyIncome || 0) * 12, 'inc')), label: "Active Earnings" },
      { id: 'cod', name: "Code", iconName: "Code", level: calcLevel(getXP(BASE_DEV_XP + ((data.assets.digitalIP || 0) * 5), 'cod')), label: "Dev Skills" },
      { id: 'cnt', name: "Content", iconName: "Target", level: calcLevel(getXP(BASE_SOCIAL_XP + ((data.assets.audience || 0) * 50), 'cnt')), label: "Reach" },
      { id: 'ai', name: "AI Ops", iconName: "Sparkles", level: calcLevel(getXP(40000, 'ai')), label: "Leverage" },
      { id: 'sec', name: "Security", iconName: "Shield", level: calcLevel(getXP((data.cash || 0) + (((data.cash || 0) / (data.monthlyExpenses || 1)) * 5000), 'sec')), label: "Runway" },
      { id: 'vit', name: "Vitality", iconName: "Heart", level: calcLevel(getXP(BASE_AGE_XP, 'vit')), label: "Health" },
      { id: 'wis', name: "Wisdom", iconName: "Star", level: calcLevel(getXP(30000 + (data.achievements.filter(a => a.completed).length * 5000), 'wis')), label: "Future Proofing" },
      { id: 'net', name: "Network", iconName: "Users", level: calcLevel(getXP(BASE_SOCIAL_XP + ((data.assets.audience || 0) * 100), 'net')), label: "Community" },
      { id: 'ast', name: "Assets", iconName: "Pickaxe", level: calcLevel(getXP((data.assets.crypto || 0) + (data.assets.metals || 0), 'ast')), label: "Hard Assets" },
      { id: 'flo', name: "Flow", iconName: "Activity", level: calcLevel(getXP(((data.monthlyIncome || 0) - (data.monthlyExpenses || 0)) * 20, 'flo')), label: "Cash Flow" },
      { id: 'inv', name: "Invest", iconName: "Sprout", level: calcLevel(getXP(Math.max((data.assets.stocks || 0) + (data.assets.crypto || 0), 0), 'inv')), label: "Growth" },
      { id: 'est', name: "Estate", iconName: "Hammer", level: calcLevel(getXP((data.assets.realEstate || 0), 'est')), label: "Real Estate" },
      { id: 'dis', name: "Discipline", iconName: "Flame", level: calcLevel(getXP(0, 'dis')), label: "Willpower" },
    ];
  }, [data.monthlyIncome, data.assets, data.cash, data.monthlyExpenses, data.bonusXP, data.achievements]);

  const combatStats = useMemo(() => {
    const totalLevel = playerSkills.reduce((sum, skill) => sum + skill.level, 0);
    const getSkillLvl = (id) => playerSkills.find(s => s.id === id)?.level || 1;
    const combatLevel = Math.floor(0.25 * (getSkillLvl('sec') + getSkillLvl('vit') + Math.floor(getSkillLvl('wis') / 2)) + 0.325 * (getSkillLvl('inc') + getSkillLvl('cod')));
    return { totalLevel, combatLevel };
  }, [playerSkills]);

  // --- ACTIONS (Callback Optimized) ---
  const showToast = useCallback((msg, type = 'info') => { 
      setToast({ msg, type }); 
      setTimeout(() => setToast(null), 3000); 
  }, []);

  const updateWellness = useCallback((type, amount) => {
    const now = new Date().toDateString();
    setData(prev => {
        const isNewDay = prev.lastMaintenance !== now;
        const newState = {
            ...prev,
            wellness: { ...prev.wellness, [type]: Math.min(100, Math.max(0, (prev.wellness?.[type] || 0) + amount)) },
            discipline: prev.discipline + (amount > 0 ? 5 : 0),
            bonusXP: { ...prev.bonusXP, dis: (prev.bonusXP?.dis || 0) + 50 },
            streak: isNewDay && amount > 0 ? prev.streak + 1 : prev.streak,
            lastMaintenance: now
        };
        return newState;
    });
    if (amount > 0) showToast(`+5 DSC | +50 Discipline XP`, 'success');
  }, [showToast]);

  const manualGrind = (skillKey, mpReward, energyCost) => {
    if (data.wellness.energy >= energyCost) {
      setData(prev => ({
        ...prev,
        wellness: { ...prev.wellness, energy: prev.wellness.energy - energyCost },
        bonusXP: { ...prev.bonusXP, [skillKey]: (prev.bonusXP?.[skillKey] || 0) + 10 },
        discipline: prev.discipline + mpReward
      }));
      showToast(`+10 ${skillKey.toUpperCase()} XP | +${mpReward} DSC`, 'success');
    } else {
      showToast("Not enough energy!", 'error');
    }
  };

  const generatePack = (packId) => {
      const packDef = SHOP_ITEMS.packs.find(p => p.id === packId);
      const weights = packDef ? packDef.weights : { c: 60, u: 30, r: 8, e: 1.9, l: 0.1 };
      const count = packDef ? packDef.cardCount : 3;
      const newCards = [];
      for(let i=0; i<count; i++) {
        const rand = Math.random() * 100;
        let rarity = 'Common';
        if (rand > (100 - weights.l)) rarity = 'Legendary';
        else if (rand > (100 - weights.l - weights.e)) rarity = 'Epic';
        else if (rand > (100 - weights.l - weights.e - weights.r)) rarity = 'Rare';
        else if (rand > (100 - weights.l - weights.e - weights.r - weights.u)) rarity = 'Uncommon';
        const pool = CARD_DATABASE.filter(c => c.rarity === rarity);
        const card = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : CARD_DATABASE[0];
        // Add random instance ID to avoid key conflicts
        newCards.push({ ...card, instanceId: Date.now() + Math.random() });
      }
      return newCards;
  };

  const purchaseItem = (item, category) => {
    if (data.discipline >= item.cost) {
      let newData = { ...data, discipline: data.discipline - item.cost };
      if (category === 'boosters') {
          newData.bonusXP = { ...newData.bonusXP, [item.skillId]: (newData.bonusXP?.[item.skillId] || 0) + item.xpAmount };
          showToast(`Boosted ${item.skillId} by ${item.xpAmount} XP!`, 'success');
      } else if (category === 'gear') {
          if (data.inventory.length >= INVENTORY_SLOTS) { showToast("Inventory Full!", 'error'); return; }
          newData.inventory = [...newData.inventory, { ...item, instanceId: Date.now() }];
          showToast(`Purchased ${item.name}`, 'success');
      } else if (category === 'packs') {
          if (item.type === 'Box') {
             const totalCards = [];
             for(let i=0; i<item.count; i++) { totalCards.push(...generatePack(item.packId)); }
             setPackOpening(totalCards); 
             const currentCards = data.cards || [];
             newData.cards = [...currentCards, ...totalCards.map(c => c.id)]; 
          } else {
             const newCards = generatePack(item.id);
             setPackOpening(newCards);
             const currentCards = data.cards || [];
             newData.cards = [...currentCards, ...newCards.map(c => c.id)]; 
          }
      }
      setData(newData);
    } else {
      showToast("Not enough DSC", 'error');
    }
  };
  
  const sellCard = (cardId, value) => {
      const index = data.cards.indexOf(cardId);
      if (index > -1) {
          const newCards = [...data.cards];
          newCards.splice(index, 1); 
          setData(prev => ({
              ...prev,
              cards: newCards,
              discipline: prev.discipline + value
          }));
          showToast(`Sold card for ${value} DSC`, 'success');
      }
  };

  const updateAsset = (key, value) => setData(prev => ({ ...prev, assets: { ...prev.assets, [key]: parseInt(value) || 0 } }));
  const toggleWidget = (key) => setData(prev => ({ ...prev, widgetConfig: { ...prev.widgetConfig, [key]: !prev.widgetConfig?.[key] } }));
  
  const toggleAchievement = (id) => {
    const achievement = data.achievements.find(a => a.id === id);
    const isCompleting = !achievement.completed;
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    }));
    if (isCompleting) {
      setRewardModal(achievement);
      showToast(`Unlocked: ${achievement.title}`, 'success');
    }
  };

  // Filtered Contracts Logic
  const activeContracts = data.achievements.filter(a => !a.completed);
  const completedContracts = data.achievements.filter(a => a.completed);
  const sortedActive = [...activeContracts].sort((a,b) => a.xp - b.xp); 
  const priorityContract = sortedActive[0] || { title: "All Complete", desc: "You are a legend.", xp: 0 };
  const displayContracts = questFilter === 'active' ? sortedActive : 
                         questFilter === 'completed' ? completedContracts : 
                         [...sortedActive, ...completedContracts];


  // --- DRAG HANDLERS ---
  const handleDragStart = (e, widgetId, column, context) => { 
      if (!editMode) return; 
      setDragItem({ id: widgetId, column, context }); 
      e.dataTransfer.effectAllowed = 'move'; 
  };
  
  const handleDragOver = (e) => { if (!editMode) return; e.preventDefault(); };
  
  const handleDrop = (e, targetColumn, targetIndex, context) => {
    if (!editMode || !dragItem || dragItem.context !== context) return;
    const newLayout = { ...data.layout };
    const layoutKey = context; 
    
    // Ensure layout array exists to prevent crash
    if (!newLayout[layoutKey] || !newLayout[layoutKey][dragItem.column]) return;

    const sourceList = [...newLayout[layoutKey][dragItem.column]];
    const targetList = dragItem.column === targetColumn ? sourceList : [...newLayout[layoutKey][targetColumn]];
    const itemIndex = sourceList.indexOf(dragItem.id);
    
    if (itemIndex === -1) return;
    
    sourceList.splice(itemIndex, 1);
    if (dragItem.column === targetColumn) { targetList.splice(targetIndex, 0, dragItem.id); newLayout[layoutKey][targetColumn] = targetList; }
    else { targetList.splice(targetIndex, 0, dragItem.id); newLayout[layoutKey][dragItem.column] = sourceList; newLayout[layoutKey][targetColumn] = targetList; }
    setData(prev => ({ ...prev, layout: newLayout }));
    setDragItem(null);
  };

  // --- WIDGET RENDERER ---
  const renderWidget = (widgetId) => {
    const isVisible = data.widgetConfig?.[widgetId];
    if (!isVisible && !editMode) return null;
    const commonWrapperClass = `rounded-xl border shadow-lg relative mb-6 transition-all ${editMode ? 'cursor-move border-dashed border-slate-500 hover:bg-slate-800/50' : 'bg-[#1e1e1e] border-[#404e6d]'} ${!isVisible && editMode ? 'opacity-50' : ''}`;
    const toggleBtn = editMode && <button onClick={() => toggleWidget(widgetId)} className="absolute top-2 right-2 p-1 bg-black/50 rounded z-20 text-white hover:bg-black">{isVisible ? <RenderIcon name="Eye" size={14}/> : <RenderIcon name="EyeOff" size={14}/>}</button>;
    const dragHandle = editMode && <div className="absolute top-2 left-2 text-slate-500"><RenderIcon name="GripVertical" size={16}/></div>;

    switch(widgetId) {
      case 'daily_ops': 
        return (
          <div className={`${commonWrapperClass} p-4 h-fit`}>
             {toggleBtn}{dragHandle}
             <div className="flex justify-between items-center mb-4 pl-4">
                <div className="flex gap-4">
                   <button onClick={() => setDailyOpsTab('vitals')} className={`text-xs font-bold uppercase flex items-center gap-2 ${dailyOpsTab === 'vitals' ? 'text-white' : 'text-slate-500'}`}><RenderIcon name="Activity" size={14}/> Vitals</button>
                   <button onClick={() => setDailyOpsTab('grind')} className={`text-xs font-bold uppercase flex items-center gap-2 ${dailyOpsTab === 'grind' ? 'text-white' : 'text-slate-500'}`}><RenderIcon name="MousePointer" size={14}/> Grind</button>
                </div>
                <div className="text-[10px] text-amber-500 font-mono flex items-center gap-1"><RenderIcon name="Flame" size={12}/> Streak: {data.streak}</div>
             </div>
             {dailyOpsTab === 'vitals' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" tasks={["Sleep 8h", "Power Nap", "Sunlight"]} /><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" tasks={["Drink Water", "Electrolytes", "Tea"]} /><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" tasks={["Deep Work", "Meditate", "No Phone"]} /></div>}
             {dailyOpsTab === 'grind' && <div className="grid grid-cols-4 gap-2 animate-in fade-in">{[{k:'cod',l:'Write Code',c:'text-blue-400',i:"Code",e:5,r:10},{k:'net',l:'Network',c:'text-purple-400',i:"Users",e:5,r:10},{k:'cnt',l:'Post Content',c:'text-amber-400',i:"Target",e:5,r:10},{k:'inc',l:'Freelance',c:'text-emerald-400',i:"DollarSign",e:10,r:10}].map((g,i)=><button key={i} onClick={() => manualGrind(g.k, g.r, g.e)} className="p-3 bg-[#2a2a2a] hover:bg-[#333] rounded border border-slate-700 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"><RenderIcon name={g.i} size={20} className={g.c}/><span className="text-[10px] font-bold text-slate-300">{g.l}</span><span className="text-[9px] text-slate-500">-{g.e} NRG</span></button>)}</div>}
          </div>
        );
      case 'contract': 
        return (
           <div className={`${commonWrapperClass} p-0 overflow-hidden bg-[#1e1e1e] h-fit`}>
              {toggleBtn}{dragHandle}
              <div className="p-6 relative" style={{ background: `linear-gradient(90deg, ${colors.accentSecondary}, ${colors.accentPrimary})` }}>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                      <div><div className="text-xs font-bold text-black/60 uppercase tracking-wider">Priority Objective</div><h3 className="text-xl font-bold text-white">{priorityContract.title}</h3></div>
                      <div className="bg-black/30 px-2 py-1 rounded text-white font-mono font-bold text-xs">+{priorityContract.xp} XP</div>
                  </div>
                  <p className="text-white/80 text-sm mb-4 relative z-10">{priorityContract.desc}</p>
              </div>
              <div className="p-0 bg-[#1e1e1e]">
                  <ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" />
              </div>
           </div>
        );
        case 'skills':
        return (
          <div className={`${commonWrapperClass} p-6 h-fit flex flex-col`}>
             {toggleBtn}{dragHandle}
             <div className="flex space-x-2 mb-6 border-b border-slate-700 pb-2 overflow-x-auto pl-4">
                {['skills', 'inventory', 'contracts'].map(tab => (
                   <button key={tab} onClick={() => setHomeWidgetTab(tab)} className={`text-[10px] font-bold uppercase px-3 py-2 rounded transition-all whitespace-nowrap ${homeWidgetTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>{tab}</button>
                ))}
             </div>
             {homeWidgetTab === 'skills' && <SkillMatrix skills={playerSkills} onItemClick={setSkillModal} />}
             {homeWidgetTab === 'inventory' && <InventoryGrid inventory={data.inventory} mp={data.discipline} />}
             {homeWidgetTab === 'contracts' && <ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" />}
          </div>
        );
      case 'shop':
        return (
          <div className={`${commonWrapperClass} p-4 h-fit`}>
             {toggleBtn}{dragHandle}
             <div className="flex justify-between items-center mb-4 pl-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><RenderIcon name="ShoppingBag" size={14}/> Black Market</h3>
                 <div className="flex gap-1">
                    {['boosters', 'gear', 'packs'].map(tab => (
                        <button key={tab} onClick={() => setMiniShopTab(tab)} className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${miniShopTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}>{tab}</button>
                    ))}
                 </div>
             </div>
             <div className="space-y-2 pr-1">
                 {SHOP_ITEMS[miniShopTab].slice(0,3).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded bg-[#2a2a2a] border border-[#333] group hover:border-amber-500 transition-colors">
                       <div className="flex items-center gap-3"><span className={`${item.color}`}><RenderIcon name={item.iconName} /></span><div><div className="text-xs font-bold text-slate-200">{item.name}</div><div className="text-[9px] text-slate-500">{item.effect}</div></div></div>
                       <button onClick={() => purchaseItem(item, miniShopTab)} className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-[10px] rounded border border-emerald-800 hover:bg-emerald-500 hover:text-black transition-colors whitespace-nowrap">{item.cost} DSC</button>
                    </div>
                 ))}
                 <button onClick={() => setActiveTab('shop')} className="w-full py-2 text-xs text-slate-500 hover:text-white mt-2 border-t border-slate-700">VIEW FULL MARKET</button>
             </div>
          </div>
        );
      case 'welcome': return null; 
      
      // --- PROFILE WIDGETS ---
      case 'player_card': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center text-2xl">🧙‍♂️</div><div><div className="font-bold text-white">Lvl {Math.floor(combatStats.totalLevel/3)} Architect</div><div className="text-xs text-amber-500 font-mono">Combat: {combatStats.combatLevel}</div></div></div><div className="text-xs text-slate-400 space-y-1"><div className="flex justify-between"><span>Total Level:</span> <span className="text-white">{combatStats.totalLevel} / {MAX_TOTAL_LEVEL}</span></div><div className="flex justify-between"><span>Contracts:</span> <span className="text-white">{data.achievements.filter(a=>a.completed).length}</span></div></div></div>);
      case 'p_vitals': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Activity" size={14}/> Daily Vitals</h3><div className="space-y-4"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" /><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" /><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" /></div></div>);
      case 'financial_overview': return (<div className={`${commonWrapperClass} p-6 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Lock" size={14}/> Financial War Room</h3><div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">NET WORTH</div><div className="font-mono text-lg text-white">${financials.netWorth.toLocaleString()}</div></div><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">RUNWAY</div><div className="font-mono text-lg text-emerald-400">{financials.runwayMonths}m</div></div></div><div className="space-y-4"><AssetBar label="Real Estate" value={data.assets.realEstate} total={financials.totalAssets} color="#10b981" /><AssetBar label="Digital IP" value={data.assets.digitalIP} total={financials.totalAssets} color="#3b82f6" /><AssetBar label="Metals" value={data.assets.metals} total={financials.totalAssets} color={colors.accentPrimary} /><AssetBar label="Crypto" value={data.assets.crypto} total={financials.totalAssets} color="#a855f7" /></div></div>);
      case 'unified_menu': return (<div className={`${commonWrapperClass} p-6 h-fit flex flex-col`}>{toggleBtn}{dragHandle}<div className="flex space-x-2 mb-6 border-b border-slate-700 pb-2 overflow-x-auto pl-4">{['skills', 'inventory'].map(tab => <button key={tab} onClick={() => setProfileWidgetTab(tab)} className={`text-[10px] font-bold uppercase px-3 py-2 rounded transition-all whitespace-nowrap ${profileWidgetTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>{tab}</button>)}</div>{profileWidgetTab === 'skills' && <SkillMatrix skills={playerSkills} onItemClick={setSkillModal} />}{profileWidgetTab === 'inventory' && <InventoryGrid inventory={data.inventory} mp={data.discipline} />}</div>);
      case 'active_contracts': return (<div className={`${commonWrapperClass} p-0 h-fit`}>{toggleBtn}{dragHandle}<div className="p-4"><h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><RenderIcon name="Flame" size={14}/> Active Contracts</h3><ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" /></div></div>);
      case 'collection': return (<div className={`${commonWrapperClass} p-6 h-fit`}>{toggleBtn}{dragHandle}<CollectionBinder cards={data.cards} onSell={sellCard} /></div>);

      default: return null;
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-[#e1b542] selection:text-black pb-10" style={{ backgroundColor: colors.bg }}>
      {toast && <div className="fixed top-20 right-4 z-[100] bg-[#232a3a] border border-amber-500 text-white px-4 py-3 rounded shadow-xl animate-in slide-in-from-right flex items-center gap-2"><RenderIcon name="Zap" size={16} className="text-amber-500" /> <span className="text-sm font-bold">{toast.msg}</span></div>}
      
      {/* MODALS */}
      {packOpening && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-lg p-8" onClick={() => setPackOpening(null)}>
           <div className="text-center w-full max-w-4xl">
              <h2 className="text-3xl font-bold text-white mb-10 animate-bounce">PACK OPENED!</h2>
              <div className="flex justify-center gap-6 flex-wrap">
                 {packOpening.map((card, i) => (
                    <div key={i} className={`w-48 aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-center p-4 bg-[#1e1e1e] animate-in zoom-in duration-500 delay-${i*200} ${getRarityColor(card.rarity)}`}>
                       <div className="mb-4"><RenderIcon name={card.iconName} size={32} /></div>
                       <div className="font-bold text-lg mb-2">{card.name}</div>
                       <div className="text-xs uppercase tracking-wider opacity-70 mb-4">{card.rarity}</div>
                       <div className="text-xs text-center opacity-80">{card.desc}</div>
                    </div>
                 ))}
              </div>
              <div className="mt-12 text-slate-500 text-sm">Click anywhere to close</div>
           </div>
        </div>
      )}

      {skillModal && <SkillDetailModal skill={skillModal} onClose={() => setSkillModal(null)} colors={colors} />}
      {masteryLogOpen && <MasteryLogModal onClose={() => setMasteryLogOpen(false)} skills={playerSkills} colors={colors} />}

      {/* HEADER */}
      <header className="p-4 sticky top-0 z-50 shadow-xl" style={{ backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dynamic')}>
            <div className="p-2 rounded-lg text-black shadow-lg hover:scale-105 transition-transform" style={{ backgroundColor: colors.accentPrimary, boxShadow: `0 0 15px ${colors.accentPrimary}40` }}><RenderIcon name="Shield" size={24} /></div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">THE VAULT</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-1">
                <span className="text-white font-bold hidden sm:inline">{USER_NAME}</span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold"><RenderIcon name="Sword" size={12} /> {combatStats.combatLevel}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><RenderIcon name="Plus" size={12} /> {data.discipline}</span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-white"><RenderIcon name="Lock" size={12} /> ${financials.netWorth.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-white"><RenderIcon name="DollarSign" size={12} /> ${data.cash.toLocaleString()}</span>
                <span className="flex items-center gap-1" style={{color: financials.monthlyCashFlow > 0 ? '#34d399' : '#fb7185'}}><RenderIcon name="TrendingUp" size={12} /> {financials.monthlyCashFlow > 0 ? '+' : ''}{financials.monthlyCashFlow.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <nav className="flex p-1 rounded-lg" style={{ border: `1px solid ${colors.border}`, backgroundColor: '#232a3a' }}>
            {[ { id: 'dynamic', icon: "LayoutDashboard", label: 'HOME' }, { id: 'profile', icon: "User", label: 'PROFILE' }, { id: 'shop', icon: "ShoppingBag", label: 'SHOP' }, { id: 'inputs', icon: "Code", label: 'INPUTS' } ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2" style={{ backgroundColor: activeTab === tab.id ? colors.accentPrimary : 'transparent', color: activeTab === tab.id ? '#000' : '#94a3b8' }}>
                <RenderIcon name={tab.icon} size={16} /> <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 relative">
        {activeTab === 'dynamic' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex justify-end mb-4">
                {editMode && (
                   <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                      <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Interface Config</div>
                      {['daily_ops', 'contract', 'skills', 'shop'].map(k => (
                         <button key={k} onClick={() => toggleWidget(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{k.replace('_',' ')}</button>
                      ))}
                   </div>
                )}
                <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${editMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-slate-700'}`}><RenderIcon name="Edit3" size={14} /> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COL */}
                <div className="lg:col-span-2 space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'left', 0, 'home')}>
                   {data.layout.home.left.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'left', 'home')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'left', index, 'home'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
                {/* RIGHT COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'right', 0, 'home')}>
                   {data.layout.home.right.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'right', 'home')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'right', index, 'home'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- SHOP TAB --- */}
        {activeTab === 'shop' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex gap-4 mb-6">
                {['boosters', 'gear', 'packs'].map(tab => (
                   <button key={tab} onClick={() => setShopTab(tab)} className={`px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all ${shopTab === tab ? 'bg-amber-500 text-black' : 'bg-[#1e1e1e] text-slate-400 hover:text-white'}`}>{tab}</button>
                ))}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOP_ITEMS[shopTab].map(item => (
                   <div key={item.id} className="bg-[#1e1e1e] rounded-xl p-6 border border-slate-700 hover:border-amber-500 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-900/50 text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-emerald-900">{item.cost} DSC</div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.color} bg-black/30`}><RenderIcon name={item.iconName} size={24} /></div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-400 mb-4">{item.effect}</p>
                      <button onClick={() => purchaseItem(item, shopTab)} className="w-full py-2 rounded bg-slate-800 hover:bg-emerald-600 text-white font-bold transition-colors">PURCHASE</button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- PROFILE TAB (Merged) --- */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-end mb-4">
                {editMode && (
                   <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                      <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Profile Config</div>
                      {['player_card', 'p_vitals', 'financial_overview', 'unified_menu', 'active_contracts', 'collection'].map(k => (
                         <button key={k} onClick={() => toggleWidget(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{k.replace(/_/g,' ')}</button>
                      ))}
                   </div>
                )}
                <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${editMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-slate-700'}`}><RenderIcon name="Edit3" size={14} /> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button>
             </div>
           
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'left', 0, 'profile')}>
                   {data.layout.profile.left.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'left', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'left', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
                {/* CENTER COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'center', 0, 'profile')}>
                   {data.layout.profile.center.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'center', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'center', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
                {/* RIGHT COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'right', 0, 'profile')}>
                   {data.layout.profile.right.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'right', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'right', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- INPUTS TAB --- */}
        {activeTab === 'inputs' && (
          <div className="p-6 rounded-xl max-w-4xl mx-auto bg-[#2b3446] border border-[#404e6d] animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white">Update Vital Signs</h2><div className="text-xs text-slate-500 flex items-center gap-1"><RenderIcon name="Save" size={12}/> Auto-saving active</div></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <InputGroup title="Liquid & Income">
                     <InputField label="Cash on Hand ($)" value={data.cash} onChange={(v) => setData({...data, cash: parseInt(v)||0})} />
                     <InputField label="Monthly Income ($)" value={data.monthlyIncome} onChange={(v) => setData({...data, monthlyIncome: parseInt(v)||0})} />
                     <InputField label="Monthly Expenses ($)" value={data.monthlyExpenses} onChange={(v) => setData({...data, monthlyExpenses: parseInt(v)||0})} />
                 </InputGroup>
                 <InputGroup title="Investments & Assets">
                     <InputField label="Real Estate Equity ($)" value={data.assets.realEstate} onChange={(v) => updateAsset('realEstate', v)} />
                     <InputField label="Stock Portfolio ($)" value={data.assets.stocks} onChange={(v) => updateAsset('stocks', v)} />
                     <InputField label="Crypto Holdings ($)" value={data.assets.crypto} onChange={(v) => updateAsset('crypto', v)} />
                     <InputField label="Precious Metals ($)" value={data.assets.metals} onChange={(v) => updateAsset('metals', v)} />
                     <InputField label="Digital Products/IP ($)" value={data.assets.digitalIP} onChange={(v) => updateAsset('digitalIP', v)} />
                 </InputGroup>
                 <InputGroup title="Liabilities">
                     <InputField label="Mortgage Balance ($)" value={data.liabilities.mortgage} onChange={(v) => setData(prev => ({...prev, liabilities: {...prev.liabilities, mortgage: parseInt(v)||0}}))} />
                     <InputField label="Consumer Debt ($)" value={data.liabilities.debt} onChange={(v) => setData(prev => ({...prev, liabilities: {...prev.liabilities, debt: parseInt(v)||0}}))} />
                 </InputGroup>
                 <InputGroup title="Social Capital">
                    <InputField label="Total Audience Size" value={data.assets.audience} onChange={(v) => updateAsset('audience', v)} />
                 </InputGroup>
             </div>
             <button onClick={() => {
               if(window.confirm("Reset all data?")) {
                 localStorage.removeItem('vault_data_v24.1');
                 setData(initialData);
                 window.location.reload();
               }
             }} className="mt-8 flex items-center gap-2 text-xs text-red-400 hover:text-red-300"><RenderIcon name="Trash2" size={14}/> Factory Reset</button>
          </div>
        )}
      </main>
    </div>
  );
}