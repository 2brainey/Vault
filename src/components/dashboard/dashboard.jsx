import React, { useState, useEffect, useMemo, useCallback } from 'react';

// 1. Data Import
import { 
  initialData, SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, 
  INVENTORY_SLOTS, BANK_SLOTS, USER_NAME, MAX_TOTAL_LEVEL 
} from '../../data/gamedata'; 

// 2. UI Components Import
import { 
  WellnessBar, InventoryGrid, ContractWidget, CollectionBinder, 
  SkillMatrix, AssetBar, InputGroup, InputField, SkillCard, 
  MasteryModal, SkillDetailModal, MasteryLogWidget 
} from './dashboardui';

// 3. Utils Import
import { RenderIcon, getRarityColor, getRarityGradient, IconMap } from './dashboardutils';

// 4. Feature Imports
import InventoryView from './inventoryprototype'; 
import StatisticsTab from './statisticstab'; 
import ShopFullPage from './shopfullpage'; 
import EstatePrototype from './estateprototype'; 

export default function VaultDashboard() {
  // --- STATE INITIALIZATION ---
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_data_v29.1'); 
      const loaded = saved ? JSON.parse(saved) : initialData;
      
      const safe = { 
          ...initialData, 
          ...loaded,
          statistics: { ...initialData.statistics, ...(loaded.statistics || {}) },
          bonusXP: { ...initialData.bonusXP, ...(loaded.bonusXP || {}) },
          wellness: { ...initialData.wellness, ...(loaded.wellness || {}) },
          assets: { ...initialData.assets, ...(loaded.assets || {}) },
          liabilities: { ...initialData.liabilities, ...(loaded.liabilities || {}) },
          inventory: Array.isArray(loaded.inventory) ? loaded.inventory : initialData.inventory,
          bank: Array.isArray(loaded.bank) ? loaded.bank : initialData.bank,
          achievements: Array.isArray(loaded.achievements) ? loaded.achievements : initialData.achievements,
          lifetime: { ...initialData.lifetime, ...(loaded.lifetime || {}) }
      };

      if (!safe.lifetime.claimedMasteryRewards) safe.lifetime.claimedMasteryRewards = initialData.lifetime.claimedMasteryRewards;

      if (safe.inventory.length !== INVENTORY_SLOTS) {
         const fixed = new Array(INVENTORY_SLOTS).fill(null);
         safe.inventory.forEach((item, i) => { if(i<INVENTORY_SLOTS) fixed[i] = item });
         safe.inventory = fixed;
      }

      return safe;
    } catch (e) {
      return initialData;
    }
  });
  
  // Increment Session Count on Mount
  useEffect(() => {
      setData(prev => ({
          ...prev,
          statistics: { ...prev.statistics, sessionsOpened: (prev.statistics?.sessionsOpened || 0) + 1 }
      }));
  }, []);

  // UI State
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

  const colors = { bg: "#2b3446", border: "#404e6d", accentSecondary: "#78643e", accentPrimary: "#e1b542" };

  useEffect(() => {
    localStorage.setItem('vault_data_v29.1', JSON.stringify(data));
  }, [data]);

  // --- VITAL DECAY LOOP ---
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

  // --- HELPERS ---
  const showToast = useCallback((msg, type = 'info') => { 
      setToast({ msg, type }); 
      setTimeout(() => setToast(null), 3000); 
  }, []);

  const handleSetDiscipline = (valOrFn) => {
    setData(prev => {
      const newVal = typeof valOrFn === 'function' ? valOrFn(prev.discipline) : valOrFn;
      return { ...prev, discipline: newVal };
    });
  };

  const toggleWidget = (key) => {
    setData(prev => ({ 
        ...prev,
        widgetConfig: { 
            ...prev.widgetConfig,
            [key]: !prev.widgetConfig?.[key] 
        }
    }));
  };

  const handleDragStart = (e, widgetId, column, tab) => {
    e.dataTransfer.setData("widgetId", widgetId);
    e.dataTransfer.setData("sourceColumn", column);
    e.dataTransfer.setData("sourceTab", tab);
    setDragItem({ widgetId, column, tab });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn, targetIndex, targetTab) => {
    e.preventDefault();
    const widgetId = e.dataTransfer.getData("widgetId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");
    const sourceTab = e.dataTransfer.getData("sourceTab");

    if (!widgetId || !data.layout[targetTab]) return;

    setData(prev => {
        const newLayout = JSON.parse(JSON.stringify(prev.layout)); 
        const sourceList = newLayout[sourceTab][sourceColumn];
        const filteredSource = sourceList.filter(id => id !== widgetId);
        newLayout[sourceTab][sourceColumn] = filteredSource;

        const targetList = newLayout[targetTab][targetColumn];
        if (sourceTab === targetTab && sourceColumn === targetColumn) {
            targetList.splice(targetIndex, 0, widgetId);
        } else {
            targetList.splice(targetIndex, 0, widgetId);
        }

        return { ...prev, layout: newLayout };
    });
    setDragItem(null);
  };

  const addToSlotArray = (slots, item, quantity = 1) => {
      const newSlots = [...slots];
      const existingIndex = newSlots.findIndex(s => s && s.name === item.name && s.rarity === item.rarity);
      if (existingIndex !== -1) {
          newSlots[existingIndex] = { ...newSlots[existingIndex], count: newSlots[existingIndex].count + quantity };
          return newSlots;
      }
      const emptyIndex = newSlots.findIndex(s => s === null);
      if (emptyIndex !== -1) {
          newSlots[emptyIndex] = { ...item, count: quantity, id: Date.now() + Math.random() };
          return newSlots;
      }
      return null;
  };

  const generatePackCards = (packType) => {
      let weights = { c: 60, u: 30, r: 8, e: 1.9, l: 0.1 };
      let cardCount = 3;
      if (packType === 'Epic') { weights = { c: 20, u: 40, r: 30, e: 9, l: 1 }; cardCount = 5; } 
      else if (packType === 'Legendary') { weights = { c: 0, u: 10, r: 40, e: 40, l: 10 }; cardCount = 5; }
      
      const newCards = [];
      for(let i=0; i<cardCount; i++) {
        const rand = Math.random() * 100;
        let cardRarity = 'Common';
        if (rand > (100 - weights.l)) cardRarity = 'Legendary';
        else if (rand > (100 - weights.l - weights.e)) cardRarity = 'Epic';
        else if (rand > (100 - weights.l - weights.e - weights.r)) cardRarity = 'Rare';
        else if (rand > (100 - weights.l - weights.e - weights.r - weights.u)) cardRarity = 'Uncommon';
        
        const pool = CARD_DATABASE.filter(c => c.rarity === cardRarity);
        const card = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : CARD_DATABASE[0];
        newCards.push(card);
      }
      return newCards;
  };

  const updateWellness = (type, amount) => {
    const now = new Date().toDateString();
    setData(prev => {
        const newStats = { ...prev.statistics };
        if (amount > 0) {
            if (!newStats.maintenance) newStats.maintenance = { energy: 0, hydration: 0, focus: 0 };
            newStats.maintenance[type] = (newStats.maintenance[type] || 0) + 1;
        }

        return {
            ...prev,
            statistics: newStats,
            wellness: { ...prev.wellness, [type]: Math.min(100, Math.max(0, prev.wellness[type] + amount)) },
            discipline: prev.discipline + (amount > 0 ? 5 : 0),
            lastMaintenance: now
        };
    });
    if (amount > 0) showToast(`+5 DSC | Tracked: ${type}`, 'success');
  };

  const manualGrind = (skillKey, mpReward, energyCost) => {
    if (data.wellness.energy >= energyCost) {
      setData(prev => {
        const newIncomeBase = (skillKey === 'inc') ? prev.lifetime.totalIncomeBase + (mpReward * 12) : prev.lifetime.totalIncomeBase;
        
        return ({
          ...prev,
          wellness: { ...prev.wellness, energy: prev.wellness.energy - energyCost },
          bonusXP: { ...prev.bonusXP, [skillKey]: (prev.bonusXP?.[skillKey] || 0) + 10 },
          discipline: prev.discipline + mpReward,
          lifetime: { ...prev.lifetime, totalIncomeBase: newIncomeBase }
        });
      });
      showToast(`+10 ${skillKey.toUpperCase()} XP | +${mpReward} DSC`, 'success');
    } else {
      showToast("Not enough energy!", 'error');
    }
  };

  const handleUseItem = (item, index, containerId) => {
      if(containerId !== 'inventory') { showToast("Move to Backpack to use", "error"); return; }

      const incrementPackStat = (prev) => ({ ...prev.statistics, packsOpened: (prev.statistics.packsOpened || 0) + 1 });

      if (item.type === 'Box') {
          const newSlots = [...data.inventory];
          if (newSlots[index].count > 1) newSlots[index].count--; else newSlots[index] = null;
          const pack = { name: "Standard Pack", type: "Pack", desc: "3 Cards", iconName: "Package", rarity: "Uncommon" };
          let updatedSlots = newSlots;
          for(let i=0; i<5; i++) {
              const nextSlots = addToSlotArray(updatedSlots, pack, 1);
              if(nextSlots) updatedSlots = nextSlots;
          }
          setData(prev => ({ ...prev, inventory: updatedSlots }));
          showToast("Box Opened! 5 Packs added.");

      } else if (item.type === 'Pack') {
          const newSlots = [...data.inventory];
          if (newSlots[index].count > 1) newSlots[index].count--; else newSlots[index] = null;
          const newCards = generatePackCards(item.rarity);
          setData(prev => ({
              ...prev,
              statistics: incrementPackStat(prev),
              inventory: newSlots,
              cards: [...prev.cards, ...newCards.map(c => c.id)]
          }));
          setPackOpening(newCards);
      }
  };

  const purchaseItem = (item, category) => {
    if (data.discipline >= item.cost) {
      const incrementBought = (prev) => ({...prev.statistics, itemsBought: (prev.statistics.itemsBought || 0) + 1 });

      if (category === 'gear' || category === 'packs') {
          const updatedInv = addToSlotArray(data.inventory, item, 1);
          if (!updatedInv) { showToast("Inventory Full!", 'error'); return; }
          
          // Check for Estate Deed unlock
          let newInventory = updatedInv;
          if (item.id === 'g1') {
             showToast(`Estate Unlocked! Find your new Deed in Inventory.`, 'success');
          }

          setData(prev => ({ 
              ...prev, 
              statistics: incrementBought(prev),
              discipline: prev.discipline - item.cost, 
              inventory: newInventory 
          }));
      } else {
          setData(prev => ({
              ...prev, 
              statistics: incrementBought(prev),
              discipline: prev.discipline - item.cost,
              bonusXP: { ...prev.bonusXP, [item.skillId]: (prev.bonusXP?.[item.skillId] || 0) + item.xpAmount }
          }));
      }
      showToast(`Purchased ${item.name}`, 'success');
    } else { showToast("Not enough DSC", 'error'); }
  };

  const handleSellCard = (cardId, value) => {
      const index = data.cards.indexOf(cardId);
      if (index > -1) {
          const newCards = [...data.cards];
          newCards.splice(index, 1); 
          setData(prev => ({
              ...prev,
              statistics: { 
                  ...prev.statistics, 
                  cardsSold: (prev.statistics.cardsSold || 0) + 1,
                  totalDisciplineEarned: (prev.statistics.totalDisciplineEarned || 0) + value 
              },
              cards: newCards,
              discipline: prev.discipline + value
          }));
          showToast(`Sold card for ${value} DSC`, 'success');
      }
  };

  const toggleAchievement = (id) => {
    const achievement = data.achievements.find(a => a.id === id);
    if(!achievement) return;
    const isCompleting = !achievement.completed;
    
    let newInventory = [...data.inventory];
    let rewardMsg = "";
    
    if (isCompleting && achievement.rewardItem) {
        const updatedInv = addToSlotArray(newInventory, achievement.rewardItem, achievement.rewardItem.count || 1);
        if (updatedInv) { newInventory = updatedInv; rewardMsg = ` + ${achievement.rewardItem.name}`; } 
        else { showToast("Inventory full! Reward discarded.", "error"); }
    }

    setData(prev => {
        const newStats = { ...prev.statistics };
        if (isCompleting) newStats.contractsCompleted = (newStats.contractsCompleted || 0) + 1;
        return { ...prev, statistics: newStats, inventory: newInventory, achievements: prev.achievements.map(a => a.id === id ? { ...a, completed: !a.completed } : a) };
    });

    if (isCompleting) { showToast(`Completed: ${achievement.title}${rewardMsg}`, 'success'); }
  };
  
  const handleClaimMasteryReward = (skillId, level, reward) => {
      let newInventory = [...data.inventory];
      let newBonusXP = { ...data.bonusXP };
      let newDiscipline = data.discipline;

      if (reward.type === 'Item' || reward.type === 'Gear' || reward.type === 'Trophy' || reward.type === 'Consumable') {
          const updatedInv = addToSlotArray(newInventory, reward, 1);
          if (!updatedInv) { showToast("Inventory Full! Cannot claim reward.", 'error'); return; }
          newInventory = updatedInv;
      } else if (reward.type === 'Discipline') {
          newDiscipline += reward.amount;
      }

      setData(prev => ({
          ...prev,
          discipline: newDiscipline,
          inventory: newInventory,
          bonusXP: newBonusXP,
          lifetime: {
              ...prev.lifetime,
              claimedMasteryRewards: {
                  ...prev.lifetime.claimedMasteryRewards,
                  [skillId]: [...(prev.lifetime.claimedMasteryRewards[skillId] || []), level]
              }
          }
      }));
      setSkillModal(null); 
      showToast(`Reward Claimed: ${reward.name} (+1 item)`, 'success');
  };

  const financials = useMemo(() => {
      const totalAssets = Object.values(data.assets || {}).reduce((a, b) => Number(a || 0) + Number(b || 0), 0) + Number(data.cash || 0);
      const totalLiabilities = Object.values(data.liabilities || {}).reduce((a, b) => Number(a || 0) + Number(b || 0), 0);
      const netWorth = totalAssets - totalLiabilities;
      const monthlyCashFlow = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
      const runwayMonths = ((data.cash || 0) / (data.monthlyExpenses || 1)).toFixed(1);
      return { totalAssets, totalLiabilities, netWorth, monthlyCashFlow, runwayMonths };
  }, [data.assets, data.cash, data.liabilities, data.monthlyIncome, data.monthlyExpenses]);

  const updateAsset = (key, value) => {
    const newValue = parseInt(value) || 0;
    setData(prev => {
      const oldValue = prev.assets[key] || 0;
      let costIncrease = 0;
      
      if (newValue > oldValue) {
          costIncrease = newValue - oldValue;
      }
      
      return { 
          ...prev, 
          assets: { ...prev.assets, [key]: newValue },
          lifetime: {
              ...prev.lifetime,
              totalAssetAcquisitionCost: prev.lifetime.totalAssetAcquisitionCost + costIncrease 
          }
      };
    });
  };

  const updateLiability = (key, value) => {
    const newValue = parseInt(value) || 0;
    setData(prev => {
        const oldValue = prev.liabilities[key] || 0;
        const debtPaid = Math.max(0, oldValue - newValue);

        return {
            ...prev,
            liabilities: { ...prev.liabilities, [key]: newValue },
            lifetime: {
                ...prev.lifetime,
                totalDebtPrincipalPaid: prev.lifetime.totalDebtPrincipalPaid + debtPaid
            }
        };
    });
  };


  const playerSkillsMemo = useMemo(() => {
    const calcLevel = (xp) => Math.max(1, Math.min(Math.floor(25 * Math.log10((xp / 100) + 1)), 99));
    const getXP = (base, id) => (Number(base) || 0) + (data.bonusXP?.[id] || 0);
    
    const incXP = getXP(data.lifetime.totalIncomeBase * 10, 'inc'); 
    const codXP = getXP(35000 + ((data.assets?.digitalIP || 0) * 5), 'cod');
    const cntXP = getXP(15000 + ((data.assets?.audience || 0) * 50), 'cnt');
    
    const secXP = getXP((data.cash || 0) + (data.lifetime.totalDebtPrincipalPaid * 10), 'sec');
    
    const astXP = getXP(data.lifetime.totalAssetAcquisitionCost * 5, 'ast');

    const currentCashFlowValue = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
    const updatedPeakFlow = Math.max(data.lifetime.peakCashFlow, currentCashFlowValue * 20); 
    const floXP = getXP(updatedPeakFlow, 'flo');
    
    const vitXP = getXP(85000, 'vit');
    const wisXP = getXP(30000 + (data.achievements.filter(a => a.completed).length * 5000), 'wis');
    const netXP = getXP(15000 + ((data.assets?.audience || 0) * 100), 'net');
    const invXP = getXP(Math.max((data.assets?.stocks || 0) + (data.assets?.crypto || 0), 0), 'inv');
    const estXP = getXP((data.assets?.realEstate || 0), 'est');
    const disXP = getXP(0, 'dis');
    const aiXP = getXP(40000, 'ai');

    if (updatedPeakFlow > data.lifetime.peakCashFlow) {
        setData(prev => ({ 
            ...prev, 
            lifetime: { ...prev.lifetime, peakCashFlow: updatedPeakFlow } 
        }));
    }

    const skillXpMap = {
        inc: incXP, cod: codXP, cnt: cntXP, ai: aiXP, sec: secXP, vit: vitXP, 
        wis: wisXP, net: netXP, ast: astXP, flo: floXP, inv: invXP, est: estXP, dis: disXP
    };

    const totalXPs = skillXpMap;
    
    const calculatedSkills = Object.keys(SKILL_DETAILS).map(key => {
        let xp = skillXpMap[key] || 0;
        return { ...SKILL_DETAILS[key], id: key, level: calcLevel(xp), iconName: SKILL_DETAILS[key].icon || 'Circle', color: SKILL_DETAILS[key].color };
    });

    return { calculatedSkills, totalXPs };

  }, [data.monthlyIncome, data.assets, data.cash, data.monthlyExpenses, data.bonusXP, data.achievements, data.lifetime]);
  
  const { calculatedSkills: playerSkills, totalXPs } = playerSkillsMemo; 

  const combatStats = useMemo(() => {
    const totalLevel = playerSkills.reduce((sum, s) => sum + s.level, 0);
    const combatLevel = Math.floor(totalLevel / 4);
    return { totalLevel, combatLevel };
  }, [playerSkills]);
  
  const activeContracts = (data.achievements || []).filter(a => !a.completed);
  const completedContracts = (data.achievements || []).filter(a => !a.completed);
  const sortedActive = [...activeContracts].sort((a,b) => a.xp - b.xp); 
  const priorityContract = sortedActive[0] || { title: "All Complete", desc: "You are a legend.", xp: 0 };
  const displayContracts = questFilter === 'active' ? sortedActive : 
                         questFilter === 'completed' ? completedContracts : 
                         [...sortedActive, ...completedContracts];


  // --- UI RENDERERS ---
  
  const toggleWidgetConfig = (key) => toggleWidget(key);
  
  const renderWidget = (widgetId) => {
    const isVisible = data.widgetConfig?.[widgetId];
    if (!isVisible && !editMode) return null;
    const commonWrapperClass = `rounded-xl border shadow-lg relative mb-6 transition-all flex flex-col ${editMode ? 'cursor-move border-dashed border-slate-500 hover:bg-slate-800/50' : 'bg-[#1e1e1e] border-[#404e6d]'} ${!isVisible && editMode ? 'opacity-50' : ''}`;
    const toggleBtn = editMode && <button onClick={() => toggleWidgetConfig(widgetId)} className="absolute top-2 right-2 p-1 bg-black/50 rounded z-20 text-white hover:bg-black">{isVisible ? <RenderIcon name="Eye" size={14}/> : <RenderIcon name="EyeOff" size={14}/>}</button>;
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
             {dailyOpsTab === 'vitals' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" /><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" /><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" /></div>}
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
             {homeWidgetTab === 'skills' && (
                 <div className="grid grid-cols-2 gap-2 p-2 bg-[#131313] rounded border border-slate-800 overflow-y-auto custom-scrollbar max-h-[400px]">
                    {playerSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} onItemClick={setSkillModal} totalXP={totalXPs[skill.id]} />
                    ))}
                 </div>
             )}
             {homeWidgetTab === 'inventory' && <InventoryGrid inventory={data.inventory} mp={data.discipline} onUseItem={handleUseItem} />}
             {homeWidgetTab === 'contracts' && <ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" />}
          </div>
        );
      case 'shop':
        return (
          <div className={`${commonWrapperClass} p-0 overflow-hidden bg-[#1e1e1e]`}>
             {toggleBtn}{dragHandle}
             <ShopFullPage onPurchase={purchaseItem} discipline={data.discipline} />
          </div>
        );
      case 'welcome': return null; 
      
      case 'player_card': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center text-2xl">🧙‍♂️</div><div><div className="font-bold text-white">Lvl {Math.floor(combatStats.totalLevel/3)} Architect</div><div className="text-xs text-amber-500 font-mono">Combat: {combatStats.combatLevel}</div></div></div><div className="text-xs text-slate-400 space-y-1"><div className="flex justify-between"><span>Total Level:</span> <span className="text-white">{combatStats.totalLevel} / {MAX_TOTAL_LEVEL}</span></div><div className="flex justify-between"><span>Contracts:</span> <span className="text-white">{data.achievements.filter(a=>a.completed).length}</span></div></div></div>);
      case 'p_vitals': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Activity" size={14}/> Daily Vitals</h3><div className="space-y-4"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" /><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" /><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" /></div></div>);
      case 'financial_overview': return (<div className={`${commonWrapperClass} p-6 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Lock" size={14}/> Financial War Room</h3><div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">NET WORTH</div><div className="font-mono text-lg text-white">${financials.netWorth.toLocaleString()}</div></div><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">RUNWAY</div><div className="font-mono text-lg text-emerald-400">{financials.runwayMonths}m</div></div></div><div className="space-y-4"><AssetBar label="Real Estate" value={data.assets.realEstate} total={financials.totalAssets} color="#10b981" /><AssetBar label="Digital IP" value={data.assets.digitalIP} total={financials.totalAssets} color="#3b82f6" /><AssetBar label="Metals" value={data.assets.metals} total={financials.totalAssets} color={colors.accentPrimary} /><AssetBar label="Crypto" value={data.assets.crypto} total={financials.totalAssets} color="#a855f7" /></div></div>);
      
      case 'unified_menu': return (<div className={`${commonWrapperClass} p-6 h-fit flex flex-col`}>
             {toggleBtn}{dragHandle}
             <div className="flex space-x-2 mb-6 border-b border-slate-700 pb-2 overflow-x-auto pl-4">
                {['skills', 'inventory'].map(tab => ( 
                   <button key={tab} onClick={() => setProfileWidgetTab(tab)} className={`px-3 py-1.5 rounded transition-all whitespace-nowrap text-[10px] font-bold uppercase ${profileWidgetTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>{tab}</button>
                ))}
             </div>
             {profileWidgetTab === 'skills' && (
                 <div className="grid grid-cols-2 gap-2 p-2 bg-[#131313] rounded border border-slate-800 overflow-y-auto custom-scrollbar max-h-[400px]">
                    {playerSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} onItemClick={setSkillModal} totalXP={totalXPs[skill.id]} />
                    ))}
                 </div>
             )}
             {profileWidgetTab === 'inventory' && <InventoryGrid inventory={data.inventory} mp={data.discipline} onUseItem={handleUseItem} />}
          </div>);
      
      case 'mastery_log_widget': 
        return (
            <div className={`${commonWrapperClass} p-6 flex-1`}>
                {toggleBtn}{dragHandle}
                <div className="flex-1 min-h-[300px]">
                    <MasteryLogWidget 
                        playerSkills={playerSkills}
                        totalXPs={totalXPs}
                        onItemClick={setSkillModal}
                    />
                </div>
            </div>
        );

      case 'active_contracts': return (<div className={`${commonWrapperClass} p-0 h-fit`}>{toggleBtn}{dragHandle}<div className="p-4"><h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><RenderIcon name="Flame" size={14}/> Active Contracts</h3><ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" /></div></div>);
      case 'collection': return (<div className={`${commonWrapperClass} p-6 h-fit`}>{toggleBtn}{dragHandle}<CollectionBinder cards={data.cards} onSell={handleSellCard} /></div>);
      
      case 'mastery_log_btn': 
        return (
            <div className={`${commonWrapperClass} p-4 h-fit flex items-center justify-center`}>
                {toggleBtn}{dragHandle}
                <button onClick={() => setMasteryLogOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-4 rounded flex items-center gap-2">
                    <RenderIcon name="Scroll" size={20}/> Open Global Mastery
                </button>
            </div>
        );

      default: return null;
    }
  };

  const hasEstateDeed = data.inventory.some(item => item && item.id === 'g1');

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-[#e1b542] selection:text-black pb-10" style={{ backgroundColor: colors.bg }}>
      {/* Toast, Modals... */}
      {toast && <div className="fixed top-20 right-4 z-[100] bg-[#232a3a] border border-amber-500 text-white px-4 py-3 rounded shadow-xl"><RenderIcon name="Zap" size={16} className="text-amber-500" /> <span className="text-sm font-bold">{toast.msg}</span></div>}
      
      {skillModal && (
        <MasteryModal 
            skill={skillModal} 
            onClose={() => setSkillModal(null)} 
            onClaimReward={handleClaimMasteryReward}
            claimedLevels={data.lifetime.claimedMasteryRewards[skillModal.id] || []}
        />
      )}
      {masteryLogOpen && (
        <MasteryModal 
            skill={{
                ...playerSkills.find(s => s.id === 'cod'), 
                name: "All Skills Overview", 
                icon: "LayoutDashboard", 
                color: "text-amber-500",
                currentXP: Object.values(totalXPs).reduce((a, b) => a + b, 0)
            }} 
            onClose={() => setMasteryLogOpen(false)} 
            onClaimReward={handleClaimMasteryReward}
            claimedLevels={[]}
        />
      )}

      {/* HEADER */}
      <header className="p-4 sticky top-0 z-50 shadow-xl" style={{ backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
           {/* Title */}
           <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dynamic')}>
            <div className="p-2 rounded-lg text-black bg-amber-500"><RenderIcon name="Shield" size={24} /></div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">THE VAULT</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-1">
                <span className="text-white font-bold hidden sm:inline">{USER_NAME}</span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold"><RenderIcon name="Sword" size={12} /> {combatStats.combatLevel}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><RenderIcon name="Plus" size={12} /> {data.discipline}</span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="flex items-center gap-1 text-white"><RenderIcon name="Lock" size={12} /> ${financials.netWorth.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-white"><RenderIcon name="DollarSign" size={12} /> ${data.cash.toLocaleString()}</span>
              </div>
            </div>
          </div>

           {/* Navigation */}
           <nav className="flex p-1 rounded-lg" style={{ border: `1px solid ${colors.border}`, backgroundColor: '#232a3a' }}>
            {[ 
              { id: 'dynamic', icon: "LayoutDashboard", label: 'HOME' }, 
              { id: 'profile', icon: "User", label: 'PROFILE' }, 
              { id: 'shop', icon: "ShoppingBag", label: 'SHOP' }, 
              { id: 'inventory', icon: "Package", label: 'INVENTORY' },
              { id: 'stats', icon: "Activity", label: 'STATS' }, 
              { id: 'estate', icon: "Home", label: 'ESTATE', restricted: !hasEstateDeed }, // Apply restriction here
              { id: 'inputs', icon: "Code", label: 'INPUTS' } 
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => !tab.restricted && setActiveTab(tab.id)} 
                disabled={tab.restricted}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${tab.restricted ? 'opacity-50 cursor-not-allowed text-slate-600' : ''}`}
                style={{ backgroundColor: activeTab === tab.id ? colors.accentPrimary : 'transparent', color: activeTab === tab.id ? '#000' : '#94a3b8' }}
              >
                {tab.restricted && <RenderIcon name="Lock" size={16} />}
                {!tab.restricted && <RenderIcon name={tab.icon} size={16} />}
                 <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 relative">
         
         {/* FIX: Ensure Home rendering only occurs when 'dynamic' is active */}
         {activeTab === 'dynamic' && (
             <div className="animate-in fade-in duration-500">
                <div className="flex justify-end mb-4">
                    {editMode && (
                       <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                          <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Interface Config</div>
                          {['daily_ops', 'contract', 'skills', 'shop'].map(k => (
                             <button key={k} onClick={() => toggleWidgetConfig(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{k.replace('_',' ')}</button>
                          ))}
                       </div>
                    )}
                    <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${editMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-slate-700'}`}><RenderIcon name="Edit3" size={14} /> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'left', 0, 'home')}>
                        {data.layout.home.left.map((widgetId, i) => (
                           <div key={i} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'left', 'home')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'left', i, 'home'); }} onDragOver={(e) => handleDragOver(e)}>
                              {renderWidget(widgetId)}
                           </div>
                        ))}
                     </div>
                     <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'right', 0, 'home')}>
                        {data.layout.home.right.map((widgetId, i) => (
                           <div key={i} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'right', 'home')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'right', i, 'home'); }} onDragOver={(e) => handleDragOver(e)}>
                              {renderWidget(widgetId)}
                           </div>
                        ))}
                     </div>
                 </div>
             </div>
         )}
         
         {activeTab === 'estate' && (
            <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)]">
                {hasEstateDeed ? (
                    <EstatePrototype 
                        discipline={data.discipline} 
                        setDiscipline={(valOrFn) => handleSetDiscipline(valOrFn)} 
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] border border-slate-700 rounded-xl p-10 text-center">
                        <RenderIcon name="Lock" size={48} className="text-amber-500 mb-4"/>
                        <h2 className="text-2xl font-bold text-white mb-2">Estate Locked</h2>
                        <p className="text-slate-400 max-w-md">Purchase the **Estate Deed** from the Black Market's **Equipment** section to unlock your property and begin construction.</p>
                        <button onClick={() => setActiveTab('shop')} className="mt-6 px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400">Go to Market</button>
                    </div>
                )}
            </div>
         )}
         
         {activeTab === 'stats' && (
             <StatisticsTab stats={data.statistics} />
         )}

         {activeTab === 'inventory' && (
            <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)]">
                <InventoryView 
                    inventory={data.inventory} 
                    bank={data.bank} 
                    bankBalance={data.bankBalance}
                    cards={data.cards} 
                    discipline={data.discipline} 
                    onUpdateInventory={(inv) => setData(p => ({...p, inventory: inv}))}
                    onUpdateBank={(bank) => setData(p => ({...p, bank}))}
                    onUpdateBankBalance={(bal) => setData(p => ({...p, bankBalance: bal}))}
                    onUpdateCards={(cards) => setData(p => ({...p, cards}))}
                    onUpdateDiscipline={(dsc) => setData(p => ({...p, discipline: dsc}))}
                    onUseItem={handleUseItem}
                    INVENTORY_SLOTS={INVENTORY_SLOTS}
                />
            </div>
         )}

         {activeTab === 'shop' && (
             <ShopFullPage onPurchase={purchaseItem} discipline={data.discipline} />
         )}
         
         {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-end mb-4">
                {editMode && (
                   <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                      <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Profile Config</div>
                      {['player_card', 'p_vitals', 'financial_overview', 'unified_menu', 'active_contracts', 'collection', 'mastery_log_btn', 'mastery_log_widget'].map(k => (
                         <button key={k} onClick={() => toggleWidgetConfig(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                           {k === 'mastery_log_btn' ? 'Mastery Btn' : k.replace(/_/g,' ')}
                         </button>
                      ))}
                   </div>
                )}
                <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${editMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-slate-700'}`}><RenderIcon name="Edit3" size={14} /> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button>
             </div>
           
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'left', 0, 'profile')}>
                   {data.layout.profile.left.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'left', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'left', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'center', 0, 'profile')}>
                   {data.layout.profile.center.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'center', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'center', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
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
         {activeTab === 'inputs' && (
             <div className="p-6 rounded-xl max-w-4xl mx-auto bg-[#2b3446] border border-[#404e6d] animate-in fade-in duration-500">
                 <InputGroup title="Liquid & Income">
                     <InputField label="Cash on Hand ($)" value={data.cash} onChange={(v) => setData({...data, cash: parseInt(v)||0})} />
                     <InputField label="Monthly Income ($)" value={data.monthlyIncome} onChange={(v) => setData({...data, monthlyIncome: parseInt(v)||0})} />
                 </InputGroup>
                 <InputGroup title="Investments & Assets">
                     <InputField label="Real Estate Equity ($)" value={data.assets.realEstate} onChange={(v) => updateAsset('realEstate', v)} />
                     <InputField label="Stock Portfolio ($)" value={data.assets.stocks} onChange={(v) => updateAsset('stocks', v)} />
                     <InputField label="Crypto Holdings ($)" value={data.assets.crypto} onChange={(v) => updateAsset('crypto', v)} />
                     <InputField label="Precious Metals ($)" value={data.assets.metals} onChange={(v) => updateAsset('metals', v)} />
                     <InputField label="Digital Products/IP ($)" value={data.assets.digitalIP} onChange={(v) => updateAsset('digitalIP', v)} />
                 </InputGroup>
                 <InputGroup title="Liabilities">
                     <InputField label="Mortgage Balance ($)" value={data.liabilities.mortgage} onChange={(v) => updateLiability('mortgage', v)} />
                     <InputField label="Consumer Debt ($)" value={data.liabilities.debt} onChange={(v) => updateLiability('debt', v)} />
                 </InputGroup>
                 <InputGroup title="Social Capital">
                    <InputField label="Total Audience Size" value={data.assets.audience} onChange={(v) => updateAsset('audience', v)} />
                 </InputGroup>
             </div>
         )}
      </main>
    </div>
  );
}