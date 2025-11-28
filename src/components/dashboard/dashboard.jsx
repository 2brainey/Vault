import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '../../store/gamestore'; 

// 1. Data Import (Path Fixed)
import { 
  SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, 
  INVENTORY_SLOTS, USER_NAME, MAX_TOTAL_LEVEL 
} from '../../data/gamedata'; 

// 2. UI Components Import (Path Fixed)
import { 
  WellnessBar, InventoryGrid, ContractWidget, CollectionBinder, 
  SkillCard, MasteryModal, MasteryLogWidget, AssetBar, 
  InputGroup, InputField, SkillDetailModal
} from './dashboardui'; 

// 3. Utils Import (Path Fixed)
import { RenderIcon, IconMap } from './dashboardutils';

// 4. Feature Imports (Paths Fixed)
import InventoryView from './inventoryprototype'; 
import StatisticsTab from './statisticstab'; 
import ShopFullPage from './shopfullpage'; 
import EstatePrototype from './estateprototype';
import ProductivityTimerWidget from './productivitytimerwidget'; 
import TaskCommandCenterWidget from './taskcommandcenterwidget'; // NEW IMPORT
import LogisticsDashboard from './logisticsdashboard';
import TodoList from './todo_list'; // NEW IMPORT

export default function VaultDashboard() {
  
  
  // --- STATE CONNECTION: IMPORTING DATA AND ACTIONS ---
  const { 
    data, 
    loading, 
    loadGame, 
    saveGame, 
    updateWellness, 
    setDiscipline, 
    updateNestedData,
    manualGrind, 
    updateData, 
    purchaseItemAction, 
    handleUseItemAction, 
    handleSellCardAction, 
    toggleAchievementAction, 
    handleClaimMasteryRewardAction, 
    pendingPackOpen,
    getSkillData,
  } = useGameStore();

  // --- LIFECYCLE HOOKS ---
  
  // 1. Load Data and Auto-Save Timer
  useEffect(() => {
      loadGame(); 

      const saveInterval = setInterval(() => {
          saveGame();
      }, 60000); 

      return () => clearInterval(saveInterval);
  }, []); // Run only on mount

  // 2. Vital Decay Loop
  useEffect(() => {
    if (loading) return; 
    
    const timer = setInterval(() => {
        updateWellness('energy', -1);
        updateWellness('hydration', -1);
        updateWellness('focus', -1);
    }, 30000); 
    return () => clearInterval(timer);
  }, [loading, updateWellness]); // Dependency on loading state

  // --- UI State (Local, stays here) ---
  const [activeTab, setActiveTab] = useState('dynamic'); 
  const [homeWidgetTab, setHomeWidgetTab] = useState('skills'); 
  const [profileWidgetTab, setProfileWidgetTab] = useState('skills'); 
  const [dailyOpsTab, setDailyOpsTab] = useState('vitals'); 
  const [miniShopTab, setMiniShopTab] = useState('boosters'); 
  const [questFilter, setQuestFilter] = useState('active'); 
  const [rewardModal, setRewardModal] = useState(null); 
  const [skillModal, setSkillModal] = useState(null); 
  const [masteryLogOpen, setMasteryLogOpen] = useState(false); 
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [packOpening, setPackOpening] = useState(null);
  const [dragItem, setDragItem] = useState(null);

  // NEW (Using the custom names):
const colors = { 
    bg: '#2b3446', // vault-dark
    border: '#404e6d', // vault-border
    accentSecondary: '#78643e', // vault-bronze
    accentPrimary: '#e1b542' // vault-amber
};


  // --- UI HELPERS ---
  const showToast = useCallback((msg, type = 'info') => { 
      setToast({ msg, type }); 
      setTimeout(() => setToast(null), 3000); 
  }, []);

  const handleSetDiscipline = (valOrFn) => {
    setDiscipline(valOrFn);
  };
  
  const toggleWidget = (key) => {
    updateData(prev => {
        // 1. Determine the new visibility state
        const isCurrentlyEnabled = prev.widgetConfig?.[key];
        const newConfig = {
            ...prev.widgetConfig,
            [key]: !isCurrentlyEnabled // Flip the toggle
        };
        
        let newLayout = prev.layout;

        // 2. PLACEMENT CHECK: If we are TURNING THE WIDGET ON (setting to true)
        // AND it's a home widget that isn't placed yet, inject it.
        if (!isCurrentlyEnabled && ['daily_ops', 'contract', 'skills', 'shop', 'productivity_timer', 'task_command_center', 'todo_list'].includes(key)) {
            
            // Check if the widget exists in EITHER the left or right home column
            const isPlaced = newLayout.home.left.includes(key) || newLayout.home.right.includes(key);

            if (!isPlaced) {
                // Force inject the widget into the leftmost column
                newLayout = {
                    ...newLayout,
                    home: {
                        ...newLayout.home,
                        // Append the key to the end of the left column list
                        left: [...newLayout.home.left, key] 
                    }
                };
            }
        }

        return { 
            widgetConfig: newConfig,
            layout: newLayout
        };
    });
  };

  // --- DRAG & DROP LOGIC (Relies on store's updateData) ---

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

    updateData(prev => {
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

        return { layout: newLayout };
    });
    setDragItem(null);
  };

  // --- BUSINESS LOGIC WRAPPERS (Calling Store Actions) ---
  
  // UI wrapper for the manualGrind store action (Calls store, handles toast)
  const handleGrindAction = (skillKey, mpReward, energyCost) => {
    const success = manualGrind(skillKey, mpReward, energyCost);

    if (success) {
      showToast(`+10 ${skillKey.toUpperCase()} XP | +${mpReward} DSC`, 'success');
    } else {
      showToast("Not enough energy!", 'error');
    }
  };


  // Refactored purchaseItem to call the store action
  const purchaseItem = (item, category) => {
    const result = purchaseItemAction(item, category); 
    
    if (result.success && (item.type === 'Pack' || item.type === 'Box')) {
        setPackOpening(null);
    }
    
    showToast(result.message, result.success ? 'success' : 'error');
  };

  // Refactored handleUseItem to call the store action
  const handleUseItem = (item, index, containerId) => {
      const result = handleUseItemAction(item, index, containerId);

      if (result.success && item.type === 'Pack') {
          // Note: pendingPackOpen is a temporary state in the store used only for this UI action
          setPackOpening(pendingPackOpen); 
      }
      
      showToast(result.message, result.success ? 'success' : 'error');
  };

  // NEW: Refactored handleSellCard to call the store action
  const handleSellCard = (cardId, value) => {
      const result = handleSellCardAction(cardId, value);
      showToast(result.message, result.success ? 'success' : 'error');
  };

  // NEW: Refactored toggleAchievement to call the store action
  const toggleAchievement = (id) => {
    const achievement = data.achievements.find(a => a.id === id);
    if(!achievement) return;
    const isCompleting = !achievement.completed;
    
    const result = toggleAchievementAction(id, isCompleting);

    if (result.success) {
      showToast(`${isCompleting ? 'Completed' : 'Reset'}: ${achievement.title}${result.rewardMsg}`, 'success');
    } else {
      showToast("Contract update failed.", 'error'); 
    }
  };
  
  // NEW: Refactored handleClaimMasteryReward to call the store action
  const handleClaimMasteryReward = (skillId, level, reward) => {
    const result = handleClaimMasteryRewardAction(skillId, level, reward);

    if (result.success) {
        setSkillModal(null); 
        showToast(result.message, 'success');
    } else {
        showToast(result.message || "Cannot claim reward.", 'error');
    }
  };

  // --- MEMOIZED CALCULATIONS (Read-Only) ---

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
    const path = `assets.${key}`;
    const oldValue = data.assets[key] || 0;
    let costIncrease = 0;
    
    if (newValue > oldValue) {
        costIncrease = newValue - oldValue;
    }
    
    updateNestedData(path, newValue);
    
    if (costIncrease > 0) {
        updateData(prev => ({
            lifetime: {
                ...prev.lifetime,
                totalAssetAcquisitionCost: prev.lifetime.totalAssetAcquisitionCost + costIncrease
            }
        }));
    }
  };

  const updateLiability = (key, value) => {
    const newValue = parseInt(value) || 0;
    const path = `liabilities.${key}`;
    const oldValue = data.liabilities[key] || 0;
    const debtPaid = Math.max(0, oldValue - newValue);
    
    updateNestedData(path, newValue);

    if (debtPaid > 0) {
        updateData(prev => ({
            lifetime: {
                ...prev.lifetime,
                totalDebtPrincipalPaid: prev.lifetime.totalDebtPrincipalPaid + debtPaid
            }
        }));
    }
  };

// --- MEMOIZED CALCULATIONS (Read-Only) ---

  const playerSkillsMemo = useMemo(() => {
    // This calls the new function in the store
    return getSkillData(); 
    // The dependency array now only needs the core data object, as the store handles the sub-dependencies
  }, [data, getSkillData]);
  
  const { calculatedSkills: playerSkills, totalXPs } = playerSkillsMemo;
  const combatStats = useMemo(() => {
    const totalLevel = playerSkills.reduce((sum, s) => sum + s.level, 0);
    const combatLevel = Math.floor(totalLevel / 4);
    return { totalLevel, combatLevel };
  }, [playerSkills]);
  
  const activeContracts = (data.achievements || []).filter(a => !a.completed);
  const completedContracts = (data.achievements || []).filter(a => a.completed);
  const sortedActive = [...activeContracts].sort((a,b) => a.xp - b.xp); 
  const priorityContract = sortedActive[0] || { title: "All Complete", desc: "You are a legend.", xp: 0 };
  const displayContracts = questFilter === 'active' ? sortedActive : 
                         questFilter === 'completed' ? completedContracts : 
                         [...sortedActive, ...completedContracts];


  // --- UI RENDERERS ---
  
  const toggleWidgetConfig = (key) => toggleWidget(key);
  
  // NOTE: If loading, display spinner instead of dashboard
  if (loading) {
      return (
          <div className="min-h-screen bg-[#2b3446] flex items-center justify-center">
              <div className="flex flex-col items-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  <p className="mt-4 text-lg">Accessing The Vault...</p>
              </div>
          </div>
      );
  }

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
             {dailyOpsTab === 'vitals' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
                <WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" />
                <WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" />
                <WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" />
             </div>}
             {dailyOpsTab === 'grind' && <div className="grid grid-cols-4 gap-2 p-2 bg-[#131313] rounded border border-slate-800 overflow-y-auto custom-scrollbar max-h-[400px] animate-in fade-in">{[{k:'cod',l:'Write Code',c:'text-blue-400',i:"Code",e:5,r:10},{k:'net',l:'Network',c:'text-purple-400',i:"Users",e:5,r:10},{k:'cnt',l:'Post Content',c:'text-amber-400',i:"Target",e:5,r:10},{k:'inc',l:'Freelance',c:'text-emerald-400',i:"DollarSign",e:10,r:10}].map((g,i)=><button key={i} onClick={() => handleGrindAction(g.k, g.r, g.e)} className="p-3 bg-[#2a2a2a] hover:bg-[#333] rounded border border-slate-700 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"><RenderIcon name={g.i} size={20} className={g.c}/><span className="text-[10px] font-bold text-slate-300">{g.l}</span><span className="text-[9px] text-slate-500">-{g.e} NRG</span></button>)}</div>}
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
          <div className={`${commonWrapperClass} p-4 h-fit`}>
             {toggleBtn}{dragHandle}
             <div className="flex justify-between items-center mb-4 pl-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><RenderIcon name="ShoppingBag" size={14}/> Black Market</h3>
                 <div className="flex gap-1">
                    {['boosters', 'gear', 'packs'].map(tab => (
                        <button key={tab} onClick={() => setMiniShopTab(tab)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${miniShopTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}>{tab}</button>
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
      
      case 'player_card': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center text-2xl">🧙‍♂️</div><div><div className="font-bold text-white">Lvl {Math.floor(combatStats.totalLevel/3)} Architect</div><div className="text-xs text-amber-500 font-mono">Combat: {combatStats.combatLevel}</div></div></div><div className="text-xs text-slate-400 space-y-1"><div className="flex justify-between"><span>Total Level:</span> <span className="text-white">{combatStats.totalLevel} / {MAX_TOTAL_LEVEL}</span></div><div className="flex justify-between"><span>Contracts:</span> <span className="text-white">{data.achievements.filter(a=>a.completed).length}</span></div></div></div>);
      case 'p_vitals': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Activity" size={14}/> Daily Vitals</h3><div className="space-y-4"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" /><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" /><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" /></div></div>);
      case 'financial_overview': return (<div className={`${commonWrapperClass} p-6 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Lock" size={14}/> Financial War Room</h3><div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">NET WORTH</div><div className="font-mono text-lg text-white">${financials.netWorth.toLocaleString()}</div></div><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">RUNWAY</div><div className="font-mono text-lg text-emerald-400">{financials.runwayMonths}m</div></div></div><div className="space-y-4"><AssetBar label="Real Estate" value={data.assets.realEstate} total={financials.totalAssets} color="#10b981" /><AssetBar label="Digital IP" value={data.assets.digitalIP} total={financials.totalAssets} color="#3b82f6" /><AssetBar label="Metals" value={data.assets.metals} total={financials.totalAssets} color={colors.accentPrimary} /><AssetBar label="Crypto" value={data.assets.crypto} total={financials.totalAssets} color="#a855f7" /></div></div>);
      
      // MODIFIED: Simplified unified_menu
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
      
      // NEW WIDGET CASE: Mastery Log Overview (Standalone Widget)
      case 'mastery_log_widget': 
        return (
            <div className={`${commonWrapperClass} p-6 flex-1`}>
                {toggleBtn}{dragHandle}
                <div> 
                    <MasteryLogWidget 
                        playerSkills={playerSkills}
                        totalXPs={totalXPs}
                        onItemClick={setSkillModal}
                    />
                </div>
            </div>
        );

        // --- NEW CASE: PRODUCTIVITY TIMER (STEP 5.1 CODE) ---
      case 'productivity_timer': 
        return (
          <div className={`${commonWrapperClass} p-0 h-fit`}>
            {toggleBtn}{dragHandle}
            <ProductivityTimerWidget /> 
          </div>
        );
      // --------------------------------------------------
  

      // --- NEW CASE: TASK COMMAND CENTER ---
      case 'task_command_center': 
        return (
          <div className={`${commonWrapperClass} p-0 h-fit`}>
            {toggleBtn}{dragHandle}
            {/* onLaunchBoard is a placeholder function for the future full Kanban board tab */}
            <TaskCommandCenterWidget onLaunchBoard={() => showToast('Launching Kanban Board...', 'info')} /> 
          </div>
        );
      // ------------------------------------

      case 'todo_list': 
        return (
          <div 
            // Use commonWrapperClass defined above, with a simple class extension
            className={`${commonWrapperClass} p-0 h-fit`}
            // Add required drag/drop props without comments
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, widgetId, 'left', 'home')}
            onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'left', 0, 'home'); }}
            onDragOver={(e) => handleDragOver(e)}
          >
            {toggleBtn}{dragHandle}
            <TodoList /> 
          </div>
        );
      // ----------------------------

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


  // --- RENDER MAIN ---
  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-[#e1b542] selection:text-black pb-10 bg-vault-dark">
      {/* Toast, Modals, Header... (Keep existing) */}
      {toast && <div className="fixed top-20 right-4 z-50 bg-[#232a3a] border border-amber-500 text-white px-4 py-3 rounded shadow-xl"><RenderIcon name="Zap" size={16} className="text-amber-500" /> <span className="text-sm font-bold">{toast.msg}</span></div>}
      
      {/* Modals: Pack Opening (uses local state set by the handleUseItem wrapper) */}
      {packOpening && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6 text-center">
                <h3 className="text-3xl font-bold text-amber-400 mb-6 flex items-center justify-center gap-3">
                    <RenderIcon name="Sparkles" size={32}/> PACK OPENED!
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {packOpening.map((card, index) => (
                        <div key={index} className={`aspect-[2/3] rounded-xl border-2 p-3 flex flex-col items-center justify-center text-center relative animate-in zoom-in-50 duration-500 delay-${index*50}`}>
                            <div className={`p-2 rounded-full ${card.rarity.toLowerCase().includes('legendary') ? 'bg-amber-900/50' : 'bg-black/50'}`}>
                                <RenderIcon name={card.iconName} size={30} className={card.rarity.toLowerCase().includes('legendary') ? 'text-amber-400' : 'text-white'} />
                            </div>
                            <div className="text-[10px] font-bold mt-2 text-white">{card.name}</div>
                            <div className="text-[8px] uppercase opacity-70 text-slate-300">{card.rarity}</div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setPackOpening(null)} className="mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg">
                    Continue to Binder
                </button>
            </div>
        </div>
      )}

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
              { id: 'estate', icon: "Home", label: 'ESTATE' }, 
              { id: 'inputs', icon: "Code", label: 'INPUTS' }, 
              { id: 'logisticsdashboard', icon: "Code", label: 'LOGISTICS' }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2" style={{ backgroundColor: activeTab === tab.id ? colors.accentPrimary : 'transparent', color: activeTab === tab.id ? '#000' : '#94a3b8' }}>
                <RenderIcon name={tab.icon} size={16} /> <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 relative">
         
         {/* DYNAMIC TAB (Home) */}
         {activeTab === 'dynamic' && (
             <div className="animate-in fade-in duration-500">
                <div className="flex justify-end mb-4">
                    {editMode && (
                       <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                          <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Interface Config</div>
                          {['daily_ops', 'contract', 'skills', 'shop', 'productivity_timer', 'todolist', 'task_command_center'].map(k => (
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

         {/* STATS TAB */}
         {activeTab === 'stats' && (
             <StatisticsTab stats={data.statistics} />
         )}

         {/* ESTATE TAB */}
         {activeTab === 'estate' && (
            <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)]">
                <EstatePrototype 
                  discipline={data.discipline} 
                  setDiscipline={(valOrFn) => handleSetDiscipline(valOrFn)} 
                />
            </div>
         )}

         {/* INVENTORY TAB */}
         {activeTab === 'inventory' && (
            <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)]">
                <InventoryView 
                    inventory={data.inventory} 
                    bank={data.bank} 
                    bankBalance={data.bankBalance}
                    cards={data.cards} 
                    discipline={data.discipline} 
                    onUpdateInventory={(inv) => updateData({inventory: inv})}
                    onUpdateBank={(bank) => updateData({bank: bank})}
                    onUpdateBankBalance={(bal) => updateData({bankBalance: bal})}
                    onUpdateCards={(cards) => updateData({cards: cards})}
                    onUpdateDiscipline={(dsc) => handleSetDiscipline(dsc)}
                    onUseItem={handleUseItem}
                    INVENTORY_SLOTS={INVENTORY_SLOTS}
                />
            </div>
         )}

         {/* SHOP TAB (RESTORED FULL PAGE) */}
         {activeTab === 'shop' && (
             <ShopFullPage onPurchase={purchaseItem} discipline={data.discipline} />
         )}

         {/* LOGISTICS TAB (NEW) - STEP 5.2 CODE */}
         {activeTab === 'logisticsdashboard' && ( 
             <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)]">
                 <LogisticsDashboard /> 
             </div>
         )}
         
         {/* PROFILE TAB */}
         {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-end mb-4">
                {editMode && (
                   <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                      <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Profile Config</div>
                      {['player_card', 'p_vitals', 'financial_overview', 'unified_menu', 'active_contracts', 'collection', 'mastery_log_btn', 'mastery_log_widget'].map(k => (
                         <button key={k} onClick={() => toggleWidgetConfig(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{k.replace('_',' ')}</button>
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
                     <InputField label="Cash on Hand ($)" value={data.cash} onChange={(v) => updateNestedData('cash', parseInt(v)||0)} />
                     <InputField label="Monthly Income ($)" value={data.monthlyIncome} onChange={(v) => updateNestedData('monthlyIncome', parseInt(v)||0)} />
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