import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '../../store/gamestore'; 
import { SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, INVENTORY_SLOTS, USER_NAME } from '../../data/gamedata'; 
import { WellnessBar, InventoryGrid, ContractWidget, CollectionBinder, SkillCard, MasteryModal, MasteryLogWidget, AssetBar, InputGroup, InputField } from './dashboardui'; 
import { RenderIcon } from './dashboardutils';
import ShopFullPage from './shopfullpage'; 
import EstatePrototype from './estateprototype';
import ProductivityTimerWidget from './productivitytimerwidget'; 
import TaskCommandCenterWidget from './taskcommandcenterwidget'; 
import LogisticsDashboard from './logisticsdashboard';
import TodoList from './todo_list'; 
import StatisticsTab from './statisticstab';
import InventoryView from './inventoryprototype'; 

export default function VaultDashboard() {
  const { 
    data, loading, loadGame, saveGame, updateWellness, setDiscipline, 
    updateNestedData, manualGrind, updateData, purchaseItemAction, 
    handleUseItemAction, handleSellCardAction, toggleAchievementAction, 
    handleClaimMasteryRewardAction, pendingPackOpen, getSkillData
  } = useGameStore();

  useEffect(() => { loadGame(); setInterval(saveGame, 60000); }, []);
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => { updateWellness('energy', -1); updateWellness('hydration', -1); updateWellness('focus', -1); }, 30000);
    return () => clearInterval(timer);
  }, [loading, updateWellness]);

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('dynamic'); 
  const [isTodoCollapsed, setIsTodoCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isKanbanExpanded, setIsKanbanExpanded] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState('skills');
  const [leftPanelWidth, setLeftPanelWidth] = useState(288);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [skillModal, setSkillModal] = useState(null); 
  const [masteryLogOpen, setMasteryLogOpen] = useState(false); 
  const [toast, setToast] = useState(null);
  const [packOpening, setPackOpening] = useState(null);
  const [dragItem, setDragItem] = useState(null);

  const [vaultSubTab, setVaultSubTab] = useState('profile');
  const [analyticsSubTab, setAnalyticsSubTab] = useState('stats');

  const colors = { bg: '#2b3446', border: '#404e6d', accent: '#e1b542' };

  // --- HANDLERS ---
  const showToast = useCallback((msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }, []);
  const handleSetDiscipline = (val) => setDiscipline(val);
  const purchaseItem = (i, c) => { const r = purchaseItemAction(i, c); if(r.success && (i.type==='Pack'||i.type==='Box')) setPackOpening(null); showToast(r.message, r.success?'success':'error'); };
  const handleUseItem = (i, idx, cId) => { const r = handleUseItemAction(i, idx, cId); if(r.success && i.type==='Pack') setPackOpening(pendingPackOpen); showToast(r.message, r.success?'success':'error'); };
  const handleSellCard = (id, val) => { const r = handleSellCardAction(id, val); showToast(r.message, r.success?'success':'error'); };
  const toggleAchievement = (id) => { const r = toggleAchievementAction(id, !data.achievements.find(a=>a.id===id).completed); if(r.success) showToast(r.rewardMsg || 'Updated', 'success'); };
  const handleClaimMasteryReward = (sId, lvl, rwd) => { const r = handleClaimMasteryRewardAction(sId, lvl, rwd); if(r.success) { setSkillModal(null); showToast(r.message, 'success'); } else showToast(r.message, 'error'); };
  
  const handleMaintainVital = (type) => {
      const result = updateWellness(type, 20);
      if (result && result.message) showToast(result.message, 'success');
  };

  const updateAsset = (key, value) => {
    const val = parseInt(value) || 0;
    const oldVal = data.assets[key] || 0;
    updateNestedData(`assets.${key}`, val);
    if (val > oldVal) updateData(prev => ({ lifetime: { ...prev.lifetime, totalAssetAcquisitionCost: prev.lifetime.totalAssetAcquisitionCost + (val - oldVal) } }));
  };
  const updateLiability = (key, value) => {
    const val = parseInt(value) || 0;
    const oldVal = data.liabilities[key] || 0;
    updateNestedData(`liabilities.${key}`, val);
    if (oldVal > val) updateData(prev => ({ lifetime: { ...prev.lifetime, totalDebtPrincipalPaid: prev.lifetime.totalDebtPrincipalPaid + (oldVal - val) } }));
  };
  const handleInfoClick = (widgetId) => {
      const info = {
          productivity_timer: "A Pomodoro-style timer to track deep work sessions. Initiating a session earns Brain Matter and has a chance for pack rewards.",
          task_command_center: "Your horizontally expanded Kanban board. Add new tasks and drag them between columns (To Do, Active, Done).",
          todo_list: "Your collapsible multi-list task manager, saving data to LocalStorage.",
      }[widgetId] || "Information about this widget is not yet available.";
      showToast(info, 'info');
  };

  // --- MEMOIZED DATA ---
  const financials = useMemo(() => {
      const ta = Object.values(data.assets || {}).reduce((a,b)=>Number(a)+Number(b),0)+Number(data.cash||0);
      const tl = Object.values(data.liabilities || {}).reduce((a,b)=>Number(a)+Number(b),0);
      return { netWorth: ta-tl, monthlyCashFlow: data.monthlyIncome-data.monthlyExpenses };
  }, [data]);
  const { calculatedSkills: playerSkills, totalXPs } = useMemo(() => getSkillData(), [data, getSkillData]);
  const combatStats = useMemo(() => ({ totalLevel: playerSkills.reduce((s,x)=>s+x.level,0), combatLevel: Math.floor(playerSkills.reduce((s,x)=>s+x.level,0)/4) }), [playerSkills]);

  // --- RESIZING/DRAG LOGIC (omitted for brevity) ---
  useEffect(() => {
    const handleMouseMove = (e) => {
        if (!isResizing) return;
        if (isResizing === 'left') setLeftPanelWidth(Math.max(200, Math.min(450, e.clientX)));
        else if (isResizing === 'right') setRightPanelWidth(Math.max(200, Math.min(450, window.innerWidth - e.clientX)));
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [isResizing]);

  const cycleWidgetSize = (id) => {
      const sizes = ['col-span-1', 'col-span-2', 'col-span-3'];
      const current = data.layout.home.widgetSizes?.[id] || 'col-span-1';
      const nextSize = sizes[(sizes.indexOf(current) + 1) % sizes.length];
      updateData(prev => ({ layout: { ...prev.layout, home: { ...prev.layout.home, widgetSizes: { ...prev.layout.home.widgetSizes, [id]: nextSize } } } }));
  };

  const handleDragStart = (e, wId) => { if(editMode) { e.dataTransfer.setData("wId", wId); } };
  const handleDrop = (e, tCol, tIdx) => {
      e.preventDefault();
      const wId = e.dataTransfer.getData("wId");
      if(!wId) return;
      updateData(prev => {
          const list = prev.layout.home.center.filter(x => x !== wId);
          list.splice(tIdx, 0, wId);
          return { layout: { ...prev.layout, home: { ...prev.layout.home, center: list } } };
      });
  };

  if (loading) return <div className="min-h-screen bg-[#2b3446] flex items-center justify-center text-white">Loading...</div>;
  if (isKanbanExpanded) return <div className="fixed inset-0 z-50 bg-[#0f1219] p-6 flex flex-col">{/* Kanban Modal Content */}</div>;

  const renderWidget = (widgetId, location) => {
    const isVisible = data.widgetConfig?.[widgetId];
    if (!isVisible && !editMode) return null;
    const sizeClass = location === 'center' ? (data.layout.home.widgetSizes?.[widgetId] || 'col-span-1') : '';
    const baseClass = `rounded-xl border shadow-lg relative transition-all flex flex-col mb-4 overflow-hidden ${editMode ? 'border-dashed border-slate-500 hover:bg-slate-800/50 cursor-move' : 'bg-[#1e1e1e] border-[#404e6d]'} ${sizeClass}`;
    
    const WidgetWrapper = ({ children, widgetId }) => (
        <div 
            className={`${baseClass} h-fit min-h-[100px] mb-4 ${!isVisible && editMode ? 'opacity-50' : ''}`}
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, widgetId)}
        >
            <button onClick={(e) => { e.stopPropagation(); handleInfoClick(widgetId); }} className="absolute top-2 left-2 p-1 bg-black/50 rounded z-20 text-white hover:bg-black" title="Widget Information"><RenderIcon name="HelpCircle" size={12} /></button>
            
            {editMode && (
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                    {location === 'center' && (
                        <button onClick={(e) => { e.stopPropagation(); cycleWidgetSize(widgetId); }} className="p-1 bg-black/50 rounded text-white hover:bg-black" title="Resize Widget (Cycle Width)"><RenderIcon name="Maximize" size={12}/></button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); updateData(p => ({ widgetConfig: { ...p.widgetConfig, [widgetId]: !p.widgetConfig[widgetId] } })); }} className="p-1 bg-black/50 rounded text-white hover:bg-black" title="Toggle Visibility"><RenderIcon name={isVisible ? "Eye" : "EyeOff"} size={12}/></button>
                </div>
            )}
            {children}
        </div>
    );

    switch(widgetId) {
        case 'todo_list': return <div className={`${baseClass} h-full`}><TodoList /></div>;
        case 'productivity_timer': return <WidgetWrapper widgetId={widgetId}><ProductivityTimerWidget /></WidgetWrapper>;
        case 'task_command_center': return <WidgetWrapper widgetId={widgetId}><TaskCommandCenterWidget /></WidgetWrapper>;
        case 'player_card': return <WidgetWrapper widgetId={widgetId}><div className="p-4 flex items-center gap-3"><div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl">🧙‍♂️</div><div><div className="font-bold text-white">Lvl {combatStats.totalLevel} Architect</div><div className="text-xs text-amber-500 font-mono">Combat: {combatStats.combatLevel}</div></div></div></WidgetWrapper>;
        case 'active_contracts': return <WidgetWrapper widgetId={widgetId}><div className="p-0 h-full"><ContractWidget contracts={data.achievements} onToggle={toggleAchievement} /></div></WidgetWrapper>;
        default: return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans bg-vault-dark flex flex-col">
      {toast && <div className="fixed top-20 right-4 z-50 bg-[#232a3a] border border-amber-500 text-white px-4 py-3 rounded shadow-xl"><RenderIcon name="Zap" size={16} className="text-amber-500" /> <span className="text-sm font-bold">{toast.msg}</span></div>}
      
      {/* Mastery Modal */}
      {skillModal && <MasteryModal skill={skillModal} onClose={() => setSkillModal(null)} onClaimReward={handleClaimMasteryReward} claimedLevels={data.lifetime.claimedMasteryRewards[skillModal.id] || []}/>}

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#2b3446] border-b border-[#404e6d] shadow-xl">
          
          {/* Row 1: Title, Currency, Tabs */}
          <header className="w-full max-w-6xl mx-auto p-4 flex justify-between items-center">
             <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('dynamic')}>
                <RenderIcon name="Shield" size={28} className="text-amber-500" />
                <div>
                    <div className="font-bold text-white leading-none">THE VAULT</div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold bg-black/30 px-2 py-0.5 rounded"><RenderIcon name="DollarSign" size={10} /> {data.cash.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-pink-400 font-bold bg-black/30 px-2 py-0.5 rounded"><RenderIcon name="Brain" size={10} /> {data.discipline.toLocaleString()} BM</span>
                    </div>
                </div>
             </div>

             <nav className="flex p-1 rounded-lg bg-[#232a3a] border border-[#404e6d]">
                {[{id:'dynamic', l:'HOME', i:'Home'}, {id:'vault', l:'VAULT', i:'Lock'}, {id:'analytics', l:'ANALYTICS', i:'Activity'}, {id:'shop', l:'SHOP', i:'ShoppingBag'}].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition-all ${activeTab===t.id ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}><RenderIcon name={t.i} size={16}/> <span className="hidden md:inline">{t.l}</span></button>
                ))}
             </nav>
          </header>

          {/* Row 2: Vitals Monitor (Centered) */}
          <div className="w-full bg-[#131313] border-t border-[#404e6d] py-2">
              <div className="w-full max-w-6xl mx-auto flex justify-center px-4">
                  <div className="flex items-center space-x-4">
                      {[{l:'Energy', i:'Zap', c:'text-yellow-400', k:'energy'}, {l:'Hydration', i:'Droplet', c:'text-blue-400', k:'hydration'}, {l:'Focus', i:'Brain', c:'text-purple-400', k:'focus'}]
                       .map(v => (
                           <div key={v.k} className="flex items-center space-x-2">
                               <RenderIcon name={v.i} size={16} className={v.c} />
                               <span className="text-sm font-mono text-white font-bold">{data.wellness[v.k]}%</span>
                               <button 
                                 onClick={() => handleMaintainVital(v.k)} 
                                 className="bg-slate-700 hover:bg-slate-600 rounded px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-slate-600 transition"
                               >
                                 +20
                               </button>
                           </div>
                       ))}
                  </div>
              </div>
          </div>

      </div>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'dynamic' && (
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                {/* 1. LEFT: COLLAPSIBLE TODO */}
                <div className={`transition-colors duration-100 border-r border-slate-700 bg-[#161b22] relative flex flex-col shrink-0 ${isTodoCollapsed ? 'w-12' : ''}`} style={{ width: isTodoCollapsed ? '3rem' : `${leftPanelWidth}px` }}>
                    <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-slate-600/50 z-20" onMouseDown={(e)=>{e.preventDefault(); setIsResizing('left')}}/>
                    <button onClick={() => setIsTodoCollapsed(!isTodoCollapsed)} className="absolute -right-3 top-4 bg-slate-700 text-white p-1 rounded-full z-10 border border-slate-500"><RenderIcon name={isTodoCollapsed ? "ChevronRight" : "ChevronLeft"} size={12}/></button>
                    <div className={`flex-1 overflow-y-auto ${isTodoCollapsed ? 'opacity-0' : 'p-4'}`}>
                        <div className="h-full flex flex-col"><h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><RenderIcon name="List" size={14}/> Operations</h3>{data.layout.home.left_sidebar.map(w => <div key={w} className="h-full">{renderWidget(w, 'left')}</div>)}</div>
                    </div>
                </div>

                {/* 2. CENTER: GRID */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#0f1219]">
                    <div className="flex justify-end mb-4"><button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border ${editMode ? 'bg-amber-500 text-black' : 'bg-transparent text-slate-400'}`}><RenderIcon name="Edit3" size={14}/> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {data.layout.home.center.map((w, i) => <div key={i} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>handleDrop(e, 'center', i)}>{renderWidget(w, 'center')}</div>)}
                    </div>
                </div>

                {/* 3. RIGHT: COLLAPSIBLE & RESIZABLE PANEL */}
                <div className={`bg-[#1a1a1a] border-l border-slate-700 flex flex-col shrink-0 relative transition-all duration-100 z-30 ${isRightCollapsed ? 'w-12' : ''}`} style={{ width: isRightCollapsed ? '3rem' : `${rightPanelWidth}px` }}>
                    <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-slate-600/50 z-20" onMouseDown={(e)=>{e.preventDefault(); setIsResizing('right')}}/>
                    <button onClick={() => setIsRightCollapsed(!isRightCollapsed)} className="absolute -left-3 top-4 bg-slate-700 text-white p-1 rounded-full z-30 border border-slate-500"><RenderIcon name={isRightCollapsed ? "ChevronLeft" : "ChevronRight"} size={12}/></button>
                    <div className={`flex-1 flex flex-col overflow-hidden ${isRightCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="p-2 border-b border-slate-800 bg-[#131313] flex justify-center sticky top-0 z-10 gap-1">{['skills', 'inventory'].map(t => <button key={t} onClick={() => setRightPanelTab(t)} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${rightPanelTab===t ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}>{t}</button>)}</div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                            {rightPanelTab === 'skills' && playerSkills.map(skill => (
                                <div 
                                    key={skill.id} 
                                    // FIXED: Merge static SKILL_DETAILS with dynamic data/XP before setting modal
                                    onClick={() => setSkillModal({ ...SKILL_DETAILS[skill.id], ...skill, currentXP: totalXPs[skill.id] })} 
                                    className="flex justify-between items-center text-xs p-2 bg-black/40 rounded border border-slate-800 cursor-pointer hover:bg-slate-700">
                                        <div className="flex items-center gap-2 text-slate-300"><RenderIcon name={skill.iconName} size={14} className={skill.color}/> {skill.name}</div><div className="font-mono">Lvl {skill.level}</div>
                                </div>
                            ))}
                            {rightPanelTab === 'inventory' && <InventoryGrid slots={data.inventory} mp={data.discipline} onUseItem={handleUseItem} containerId="inventory" />}
                        </div>
                    </div>
                    {isRightCollapsed && <div className="pt-4 flex flex-col items-center gap-4 text-slate-500"><RenderIcon name="Layers" size={24} /></div>}
                </div>
            </div>
        )}

        {/* VAULT TAB */}
        {activeTab === 'vault' && (
            <div className="flex h-full">
                <div className="w-56 bg-[#131313] border-r border-slate-700 p-2 flex flex-col gap-1">
                    {[{id:'profile', l:'Profile', i:'User'}, {id:'inventory', l:'Inventory', i:'Package'}, {id:'estate', l:'Estate', i:'Home'}].map(t => (
                        <button key={t.id} onClick={() => setVaultSubTab(t.id)} className={`w-full text-left p-3 rounded flex items-center gap-3 text-sm font-bold ${vaultSubTab===t.id ? 'bg-[#2b3446] text-white border-r-4 border-amber-500' : 'text-slate-400 hover:bg-[#1e1e1e]'}`}><RenderIcon name={t.i}/> {t.l}</button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#0f1219]">
                    {vaultSubTab === 'profile' && <div className="grid grid-cols-2 gap-6"><div className="rounded-xl border border-slate-700 bg-[#1e1e1e] p-6"><h3 className="text-xl font-bold text-white mb-4">Player Status</h3><div className="flex gap-4 items-center"><div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl">🧙‍♂️</div><div><div className="text-2xl font-bold text-white">Lvl {combatStats.totalLevel} Architect</div><div className="text-amber-500 font-mono">Combat Lvl: {combatStats.combatLevel}</div></div></div></div> <div className="rounded-xl border border-slate-700 bg-[#1e1e1e] p-0 overflow-hidden"><ContractWidget contracts={data.achievements} onToggle={toggleAchievement} /></div></div>}
                    {vaultSubTab === 'inventory' && <InventoryView inventory={data.inventory} bank={data.bank} discipline={data.discipline} onUseItem={handleUseItem} />}
                    {vaultSubTab === 'estate' && <EstatePrototype discipline={data.discipline} setDiscipline={handleSetDiscipline} />}
                </div>
            </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
            <div className="flex h-full">
                <div className="w-56 bg-[#131313] border-r border-slate-700 p-2 flex flex-col gap-1">
                    {[{id:'stats', l:'Statistics', i:'PieChart'}, {id:'logistics', l:'Logistics', i:'Map'}, {id:'inputs', l:'Data Entry', i:'Edit3'}].map(t => (
                        <button key={t.id} onClick={() => setAnalyticsSubTab(t.id)} className={`w-full text-left p-3 rounded flex items-center gap-3 text-sm font-bold ${analyticsSubTab===t.id ? 'bg-[#2b3446] text-white border-r-4 border-emerald-500' : 'text-slate-400 hover:bg-[#1e1e1e]'}`}><RenderIcon name={t.i}/> {t.l}</button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#0f1219]">
                    {analyticsSubTab === 'stats' && <StatisticsTab stats={data.statistics} />}
                    {analyticsSubTab === 'logistics' && <LogisticsDashboard />}
                    {analyticsSubTab === 'inputs' && <div className="max-w-4xl mx-auto space-y-6"><InputGroup title="Liquid & Income"><InputField label="Cash ($)" value={data.cash} onChange={(v)=>updateNestedData('cash',v)} /><InputField label="Monthly Income" value={data.monthlyIncome} onChange={(v)=>updateNestedData('monthlyIncome',v)} /></InputGroup><InputGroup title="Assets"><InputField label="Real Estate" value={data.assets.realEstate} onChange={(v)=>updateAsset('realEstate',v)} /><InputField label="Crypto" value={data.assets.crypto} onChange={(v)=>updateAsset('crypto',v)} /></InputGroup></div>}
                </div>
            </div>
        )}

        {activeTab === 'shop' && <ShopFullPage onPurchase={purchaseItem} discipline={data.discipline} />}
      </main>
    </div>
  );
}