import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '../../store/gamestore'; 
import { SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, WIDGET_DATABASE, CONSTANTS } from '../../data/gamedata'; 
import { 
  InventoryGrid, 
  ContractWidget, 
  MasteryModal, 
  InputGroup, 
  InputField,  
} from './dashboardui';
import { RenderIcon } from './dashboardutils';
import ShopFullPage from './shopfullpage'; 
import EstatePrototype from './estateprototype';
import ProductivityTimerWidget from './productivitytimerwidget'; 
import TaskCommandCenterWidget from './taskcommandcenterwidget'; 
import LogisticsDashboard from './logisticsdashboard';
import TodoList from './todo_list'; 
import StatisticsTab from './statisticstab';
import InventoryView from './inventoryprototype'; 

const PlayerCardWidget = ({ combatStats }) => (
    <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl">🧙‍♂️</div>
        <div>
            <div className="font-bold text-white">Lvl {combatStats.totalLevel} Architect</div>
            <div className="text-xs text-amber-500 font-mono">Combat: {combatStats.combatLevel}</div>
        </div>
    </div>
);

const WIDGET_REGISTRY = {
    'todo_list': TodoList,
    'productivity_timer': ProductivityTimerWidget,
    'task_command_center': TaskCommandCenterWidget,
    'player_card': PlayerCardWidget,
    'active_contracts': ({ data, toggleAchievement }) => (
        <div className="p-0 h-full"><ContractWidget contracts={data.achievements} onToggle={toggleAchievement} /></div>
    ),
};

export default function VaultDashboard() {
  const { 
    data, loading, loadGame, saveGame, updateWellness, setDiscipline, 
    updateNestedData, updateData, purchaseItemAction, 
    handleUseItemAction, handleSellCardAction, toggleAchievementAction, 
    handleClaimMasteryRewardAction, pendingPackOpen, getSkillData,
    tickFocusSession, claimDailyAction, claimHourlyAction
  } = useGameStore();

  useEffect(() => { loadGame(); setInterval(saveGame, 60000); }, []);
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => { updateWellness('energy', -1); updateWellness('hydration', -1); updateWellness('focus', -1); }, 30000);
    return () => clearInterval(timer);
  }, [loading, updateWellness]);

  const [focusActive, setFocusActive] = useState(false);
  const [focusElapsed, setFocusElapsed] = useState(0);

  useEffect(() => {
      let interval = null;
      if (focusActive) {
          interval = setInterval(() => {
              setFocusElapsed(prev => {
                  const newTime = prev + 1;
                  const multiplier = Math.floor(newTime / 60);
                  tickFocusSession(3, Math.min(7, multiplier)); 
                  return newTime;
              });
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [focusActive, tickFocusSession]);

  const toggleFocus = () => setFocusActive(!focusActive);
  const resetFocus = () => { setFocusActive(false); setFocusElapsed(0); };
  const formatTime = (totalSeconds) => {
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (totalSeconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
  };
  const currentFocusRate = Math.min(10, 3 + Math.floor(focusElapsed / 60));

  const [activeTab, setActiveTab] = useState('dynamic'); 
  const [isTodoCollapsed, setIsTodoCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState('skills');
  const [leftPanelWidth, setLeftPanelWidth] = useState(288);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [skillModal, setSkillModal] = useState(null); 
  const [toast, setToast] = useState(null);
  const [vaultSubTab, setVaultSubTab] = useState('profile');
  const [analyticsSubTab, setAnalyticsSubTab] = useState('stats');

  const showToast = useCallback((msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }, []);

  // --- CRITICAL HANDLER DEFINITIONS (Fixes ReferenceErrors) ---
  const handleSetDiscipline = (val) => setDiscipline(val);
  const handleSetSalvage = (newSalvage) => updateData({ salvage: newSalvage });
  
  const purchaseItem = (i, c) => { 
      const r = purchaseItemAction(i, c); 
      showToast(r.message, r.success ? 'success' : 'error'); 
  };
  
  const handleUseItem = (i, idx, cId) => { 
      const r = handleUseItemAction(i, idx, cId); 
      showToast(r.message, r.success ? 'success' : 'error'); 
  };
  
  const toggleAchievement = (id) => { 
      const r = toggleAchievementAction(id, !data.achievements.find(a => a.id === id).completed); 
      if (r.success) showToast(r.rewardMsg || 'Updated', 'success'); 
  };
  
  const handleClaimMasteryReward = (sId, lvl, rwd) => { 
      const r = handleClaimMasteryRewardAction(sId, lvl, rwd); 
      if (r.success) { setSkillModal(null); showToast(r.message, 'success'); } 
      else showToast(r.message, 'error'); 
  };
  
  const handleClaimDaily = () => { const r = claimDailyAction(); showToast(r.message, r.success ? 'success' : 'error'); };
  const handleClaimHourly = () => { const r = claimHourlyAction(); showToast(r.message, r.success ? 'success' : 'error'); };
  const handleMaintainVital = (type) => { const result = updateWellness(type, 20); if (result && result.message) showToast(result.message, 'success'); };
  const updateAsset = (key, value) => { const val = parseInt(value) || 0; updateNestedData(`assets.${key}`, val); };
  // --- END HANDLER DEFINITIONS ---

  const { calculatedSkills: playerSkills, totalXPs } = useMemo(() => getSkillData(), [data, getSkillData]);
  const combatStats = useMemo(() => ({ totalLevel: playerSkills.reduce((s,x)=>s+x.level,0), combatLevel: Math.floor(playerSkills.reduce((s,x)=>s+x.level,0)/4) }), [playerSkills]);
  const monthlyNetIncome = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
  const dollarsPerSecond = (monthlyNetIncome / CONSTANTS.TIME.SECONDS_IN_MONTH).toFixed(4); 

  useEffect(() => {
    const handleMouseMove = (e) => {
        if (!isResizing) return;
        if (isResizing === 'left') setLeftPanelWidth(Math.max(60, Math.min(450, e.clientX))); 
        else if (isResizing === 'right') setRightPanelWidth(Math.max(60, Math.min(450, window.innerWidth - e.clientX)));
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

  const removeWidget = (id) => {
      updateData(prev => {
          const newCenter = prev.layout.home.center.filter(w => w !== id);
          const newConfig = { ...prev.widgetConfig, [id]: false };
          return {
              layout: { ...prev.layout, home: { ...prev.layout.home, center: newCenter } },
              widgetConfig: newConfig
          };
      });
  };

  const handleDragStart = (e, wId) => { 
      if(editMode) { 
          e.dataTransfer.setData("wId", wId); 
          e.dataTransfer.setData("sourceType", WIDGET_DATABASE.some(w => w.id === wId) ? 'WDB' : 'GRID'); 
      } 
  };
  
  const handleDrop = (e, tCol, tIdx) => {
      e.preventDefault();
      if(!editMode) return;
      const wId = e.dataTransfer.getData("wId");
      const sourceType = e.dataTransfer.getData("sourceType");
      if(!wId) return;

      updateData(prev => {
          let newCenter = [...prev.layout.home.center];
          let newWidgetConfig = { ...prev.widgetConfig };
          if (sourceType === 'GRID') { newCenter = newCenter.filter(x => x !== wId); }
          newCenter.splice(tIdx, 0, wId);
          newWidgetConfig[wId] = true;
          return { 
              layout: { ...prev.layout, home: { ...prev.layout.home, center: newCenter } },
              widgetConfig: newWidgetConfig
          };
      });
  };

  const toggleEditMode = () => { const newMode = !editMode; setEditMode(newMode); if (newMode) setIsTodoCollapsed(false); };

  if (loading) return <div className="min-h-screen bg-[#2b3446] flex items-center justify-center text-white">Loading...</div>;

  const renderWidget = (widgetId, location) => {
    const isVisible = data.widgetConfig?.[widgetId];
    if (!isVisible && !editMode) return null;
    const WidgetComponent = WIDGET_REGISTRY[widgetId];
    if (!WidgetComponent) return null;
    const sizeClass = location === 'center' ? (data.layout.home.widgetSizes?.[widgetId] || 'col-span-1') : '';
    const baseClass = `rounded-xl border shadow-lg relative transition-all flex flex-col mb-4 overflow-hidden ${editMode ? 'border-dashed border-slate-500 hover:bg-slate-800/50 cursor-move' : 'bg-[#1e1e1e] border-[#404e6d]'} ${sizeClass}`;

    return (
        <div 
            className={`${baseClass} h-fit min-h-[100px] mb-4 ${!isVisible && editMode ? 'opacity-50' : ''}`}
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, widgetId)}
        >
            {editMode && (
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                    {location === 'center' && (
                        <button onClick={(e) => { e.stopPropagation(); cycleWidgetSize(widgetId); }} className="p-1 bg-black/80 rounded text-white hover:bg-amber-500 hover:text-black border border-slate-600" title="Resize Widget (Cycle Width)"><RenderIcon name="Maximize" size={14}/></button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); removeWidget(widgetId); }} className="p-1 bg-black/80 rounded text-red-400 hover:bg-red-600 hover:text-white border border-slate-600" title="Remove Widget"><RenderIcon name="Trash2" size={14}/></button>
                </div>
            )}
            <WidgetComponent data={data} combatStats={combatStats} toggleAchievement={toggleAchievement} />
        </div>
    );
  };

  const renderWidgetDatabase = () => (
      <div className="space-y-4 p-4 animate-in fade-in slide-in-from-left-4">
          <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2"><RenderIcon name="Grid" size={14}/> Widget Repository</div>
          <div className="grid grid-cols-2 gap-3">
              {WIDGET_DATABASE.map(item => (
                  <div key={item.id} draggable={editMode} onDragStart={(e) => handleDragStart(e, item.id)} className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-grab flex flex-col items-center text-center hover:border-amber-500 transition-colors group">
                      <div className="p-2 bg-black/30 rounded-full mb-1 group-hover:scale-110 transition-transform"><RenderIcon name={item.icon} size={18} className="text-amber-500"/></div>
                      <span className="text-[10px] font-bold text-white leading-none">{item.name}</span>
                  </div>
              ))}
          </div>
          <div className="text-[10px] text-slate-500 text-center italic mt-4">Drag items to the dashboard grid to add them.</div>
      </div>
  );

  return (
    <div className="min-h-screen text-slate-200 font-sans bg-vault-dark flex flex-col">
      {toast && <div className="fixed top-20 right-4 z-[200] bg-[#232a3a] border border-amber-500 text-white px-4 py-3 rounded shadow-xl"><RenderIcon name="Zap" size={16} className="text-amber-500" /> <span className="text-sm font-bold">{toast.msg}</span></div>}
      {skillModal && <MasteryModal skill={skillModal} onClose={() => setSkillModal(null)} onClaimReward={handleClaimMasteryReward} claimedLevels={data.lifetime.claimedMasteryRewards[skillModal.id] || []}/>}

      <div className="sticky top-0 z-[60] bg-[#2b3446] border-b border-[#404e6d] shadow-xl">
          <header className="w-full max-w-7xl mx-auto p-3 flex justify-between items-center">
             <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('dynamic')}>
                <RenderIcon name="Shield" size={28} className="text-amber-500" />
                <div>
                    <div className="font-bold text-white leading-none">THE VAULT</div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold bg-black/30 px-2 py-0.5 rounded cursor-help" title="Cash Reserves"><RenderIcon name="DollarSign" size={10} /> {data.cash.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-pink-400 font-bold bg-black/30 px-2 py-0.5 rounded cursor-help" title="Brain Matter (Discipline)">
                            <div className="p-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-900/50"><RenderIcon name="Brain" size={10} className="text-white"/></div>
                            {data.discipline.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300 font-bold bg-black/30 px-2 py-0.5 rounded cursor-help" title="Salvage (Crafting)"><RenderIcon name="Wrench" size={10} /> {data.salvage || 0}</span>
                    </div>
                </div>
             </div>
             <div className="hidden md:flex items-center gap-6 text-xs bg-black/20 px-4 py-2 rounded-lg border border-slate-700/50">
                 <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Passive Inc</span><span className="font-mono text-emerald-400 font-bold">${dollarsPerSecond}/s</span></div>
                 <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Active Focus</span><span className="font-mono text-pink-400 font-bold">+{currentFocusRate} BM/s</span></div>
             </div>
             <div className="flex items-center bg-black/40 rounded-lg border border-slate-700 p-1 gap-4 px-4">
                 <div className="flex flex-col items-start"><span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Focus Link</span><span className={`font-mono font-bold text-lg leading-none ${focusActive ? 'text-emerald-400' : 'text-slate-500'}`}>{formatTime(focusElapsed)}</span></div>
                 <div className="flex gap-1"><button onClick={toggleFocus} className={`p-2 rounded ${focusActive ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}><RenderIcon name={focusActive ? "Pause" : "Play"} size={16} fill="currentColor"/></button><button onClick={resetFocus} className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"><RenderIcon name="RotateCcw" size={16}/></button></div>
             </div>
             <nav className="flex p-1 rounded-lg bg-[#232a3a] border border-[#404e6d]">
                {[{id:'dynamic', l:'HOME', i:'Home'}, {id:'vault', l:'VAULT', i:'Lock'}, {id:'analytics', l:'ANALYTICS', i:'Activity'}, {id:'database', l:'DATABASE', i:'Database'}, {id:'shop', l:'SHOP', i:'ShoppingBag'}].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition-all ${activeTab===t.id ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}><RenderIcon name={t.i} size={16}/> <span className="hidden md:inline">{t.l}</span></button>
                ))}
             </nav>
          </header>
          <div className="w-full bg-[#131313] border-t border-[#404e6d] py-2">
              <div className="w-full max-w-6xl mx-auto flex justify-center px-4">
                  <div className="flex items-center space-x-4">
                      {[{l:'Energy', i:'Zap', c:'text-yellow-400', k:'energy'}, {l:'Hydration', i:'Droplet', c:'text-blue-400', k:'hydration'}, {l:'Focus', i:'Brain', c:'text-purple-400', k:'focus'}].map(v => (
                           <div key={v.k} className="flex items-center space-x-2"><RenderIcon name={v.i} size={16} className={v.c} /><span className="text-sm font-mono text-white font-bold">{Math.floor(data.wellness[v.k])}%</span><button onClick={() => handleMaintainVital(v.k)} className="bg-slate-700 hover:bg-slate-600 rounded px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-slate-600 transition hover:scale-105">+20</button></div>
                       ))}
                  </div>
              </div>
          </div>
      </div>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'dynamic' && (
            <div className="flex h-[calc(100vh-100px)] overflow-hidden">
                <div className={`transition-all duration-200 border-r border-slate-700 bg-[#161b22] relative flex flex-col shrink-0 z-[70] ${isTodoCollapsed ? 'w-14 items-center py-4' : ''}`} style={{ width: isTodoCollapsed ? '3.5rem' : `${leftPanelWidth}px` }}>
                    {!isTodoCollapsed && <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-slate-600/50 z-20" onMouseDown={(e)=>{e.preventDefault(); setIsResizing('left')}}/>}
                    {isTodoCollapsed ? (
                        <div className="flex flex-col gap-4 items-center w-full">
                            <button onClick={() => setIsTodoCollapsed(false)} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg border border-slate-500 shadow-md transition-colors" title="Expand Sidebar"><RenderIcon name="ChevronRight" size={16}/></button>
                            <div className="w-8 h-px bg-slate-700"></div>
                            <button onClick={toggleEditMode} className={`group relative p-2 rounded hover:text-white transition-colors ${editMode ? 'bg-amber-500 text-black' : 'hover:bg-slate-700/50 text-slate-400'}`} title={editMode ? "Exit Builder Mode" : "Enter Builder Mode"}><RenderIcon name={editMode ? "Check" : "Edit3"} size={20}/></button>
                        </div>
                    ) : (
                        <div className={`flex-1 overflow-hidden flex flex-col w-full`}>
                            <div className={`flex items-center justify-between p-3 border-b border-slate-700 ${editMode ? 'bg-amber-900/20' : 'bg-[#131313]'}`}>
                                <div className="flex items-center gap-2"><span className={`text-xs font-bold uppercase tracking-wider ${editMode ? 'text-amber-500' : 'text-slate-400'}`}>{editMode ? 'Builder Mode' : 'Command Center'}</span></div>
                                <div className="flex items-center gap-1"><button onClick={toggleEditMode} className={`p-1.5 rounded transition-all flex items-center gap-2 text-xs font-bold border ${editMode ? 'bg-amber-500 text-black border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'}`}><RenderIcon name={editMode ? "Check" : "Edit3"} size={12}/>{editMode ? 'DONE' : 'EDIT'}</button><button onClick={() => setIsTodoCollapsed(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded border border-slate-600 transition-colors ml-2"><RenderIcon name="ChevronLeft" size={14}/></button></div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                {editMode ? renderWidgetDatabase() : <div className="p-4 h-full flex flex-col gap-4">{data.layout.home.left_sidebar.map(w => <div key={w} className="h-full">{renderWidget(w, 'left')}</div>)}</div>}
                            </div>
                        </div>
                    )}
                </div>
                <div className={`flex-1 overflow-y-auto p-6 bg-[#0f1219] relative ${editMode ? 'bg-[radial-gradient(#2b3446_1px,transparent_1px)] [background-size:16px_16px]' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-10">
                        {data.layout.home.center.map((w, i) => <div key={i} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>handleDrop(e, 'center', i)} className={`transition-all ${editMode ? 'min-h-[100px] border-2 border-dashed border-slate-700/50 rounded-xl' : ''}`}>{renderWidget(w, 'center')}</div>)}
                        {editMode && <div onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>handleDrop(e, 'center', data.layout.home.center.length)} className="h-32 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-800/50 transition-colors"><div className="flex flex-col items-center gap-2"><RenderIcon name="Plus" size={24}/><span className="text-xs font-bold uppercase">Add Widget Here</span></div></div>}
                    </div>
                </div>
                <div className={`bg-[#1a1a1a] border-l border-slate-700 flex flex-col shrink-0 relative transition-all duration-200 z-[70] ${isRightCollapsed ? 'w-14 items-center py-4' : ''}`} style={{ width: isRightCollapsed ? '3.5rem' : `${rightPanelWidth}px` }}>
                    {!isRightCollapsed && <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-slate-600/50 z-20" onMouseDown={(e)=>{e.preventDefault(); setIsResizing('right')}}/>}
                    {isRightCollapsed ? (
                        <div className="flex flex-col gap-4 items-center w-full">
                            <button onClick={() => setIsRightCollapsed(false)} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg border border-slate-500 shadow-md transition-colors" title="Expand Resources"><RenderIcon name="ChevronLeft" size={16}/></button>
                            <div className="w-8 h-px bg-slate-700"></div>
                            <button onClick={() => { setIsRightCollapsed(false); setRightPanelTab('skills'); }} className="group relative p-2 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors" title="Skills & Mastery"><RenderIcon name="Scroll" size={20}/></button>
                            <button onClick={() => { setIsRightCollapsed(false); setRightPanelTab('inventory'); }} className="group relative p-2 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors" title="Inventory & Bank"><RenderIcon name="Package" size={20}/></button>
                        </div>
                    ) : (
                        <div className={`flex-1 flex flex-col overflow-hidden opacity-100 w-full`}>
                            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#131313]">
                                <button onClick={() => setIsRightCollapsed(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded border border-slate-600 transition-colors"><RenderIcon name="ChevronRight" size={14}/></button>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resources</span>
                            </div>
                            <div className="p-2 border-b border-slate-800 bg-[#131313] flex justify-center gap-1">
                                {['skills', 'inventory'].map(t => <button key={t} onClick={() => setRightPanelTab(t)} className={`flex-1 py-1.5 text-xs font-bold uppercase rounded transition-colors ${rightPanelTab===t ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}>{t}</button>)}
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                                {rightPanelTab === 'skills' && playerSkills.map(skill => (<div key={skill.id} onClick={() => setSkillModal({ ...SKILL_DETAILS[skill.id], ...skill, currentXP: totalXPs[skill.id] })} className="flex justify-between items-center text-xs p-2 bg-black/40 rounded border border-slate-800 cursor-pointer hover:bg-slate-700"><div className="flex items-center gap-2 text-slate-300"><RenderIcon name={skill.iconName} size={14} className={skill.color}/> {skill.name}</div><div className="font-mono">Lvl {skill.level}</div></div>))}
                                {rightPanelTab === 'inventory' && <InventoryGrid slots={data.inventory} mp={data.discipline} cash={data.cash} salvage={data.salvage} onUseItem={handleUseItem} containerId="inventory" />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
        {activeTab === 'vault' && (
            <div className="flex h-full">
                <div className="w-56 bg-[#131313] border-r border-slate-700 p-2 flex flex-col gap-1">
                    {[{id:'profile', l:'Profile', i:'User'}, {id:'inventory', l:'Inventory', i:'Package'}, {id:'estate', l:'Estate', i:'Home'}].map(t => (
                        <button key={t.id} onClick={() => setVaultSubTab(t.id)} className={`w-full text-left p-3 rounded flex items-center gap-3 text-sm font-bold ${vaultSubTab===t.id ? 'bg-[#2b3446] text-white border-r-4 border-amber-500' : 'text-slate-400 hover:bg-[#1e1e1e]'}`}><RenderIcon name={t.i}/> {t.l}</button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#0f1219]">
                    {vaultSubTab === 'profile' && <div className="grid grid-cols-2 gap-6"><div className="rounded-xl border border-slate-700 bg-[#1e1e1e] p-6"><h3 className="text-xl font-bold text-white mb-4">Player Status</h3><div className="flex gap-4 items-center"><div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl">🧙‍♂️</div><div><div className="text-2xl font-bold text-white">Lvl {combatStats.totalLevel} Architect</div><div className="text-amber-500 font-mono">Combat Lvl: {combatStats.combatLevel}</div></div></div></div> <div className="rounded-xl border border-slate-700 bg-[#1e1e1e] p-0 overflow-hidden"><ContractWidget contracts={data.achievements} onToggle={toggleAchievement} /></div></div>}
                    {vaultSubTab === 'inventory' && <InventoryView inventory={data.inventory} bank={data.bank} bankBalance={data.bankBalance} cards={data.cards} discipline={data.discipline} cash={data.cash} salvage={data.salvage} onUpdateInventory={(inv) => updateData({ inventory: inv })} onUpdateBank={(bank) => updateData({ bank: bank })} onUpdateBankBalance={(bal) => updateData({ bankBalance: bal })} onUpdateCards={(cards) => updateData({ cards: cards })} onUpdateDiscipline={(dsc) => setDiscipline(dsc)} onUseItem={handleUseItem} />}
                    {vaultSubTab === 'estate' && <EstatePrototype discipline={data.discipline} setDiscipline={handleSetDiscipline} salvage={data.salvage} setSalvage={handleSetSalvage} />}
                </div>
            </div>
        )}
        {activeTab === 'analytics' && (
            <div className="flex h-full">
                <div className="w-56 bg-[#131313] border-r border-slate-700 p-2 flex flex-col gap-1">
                    {[{id:'stats', l:'Statistics', i:'PieChart'}, {id:'logistics', l:'Logistics', i:'Map'}, {id:'inputs', l:'Data Entry', i:'Edit3'}].map(t => <button key={t.id} onClick={() => setAnalyticsSubTab(t.id)} className={`w-full text-left p-3 rounded flex items-center gap-3 text-sm font-bold ${analyticsSubTab===t.id ? 'bg-[#2b3446] text-white border-r-4 border-emerald-500' : 'text-slate-400 hover:bg-[#1e1e1e]'}`}><RenderIcon name={t.i}/> {t.l}</button>)}
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#0f1219]">
                    {analyticsSubTab === 'stats' && <StatisticsTab stats={data.statistics} />}
                    {analyticsSubTab === 'logistics' && <LogisticsDashboard />}
                    {analyticsSubTab === 'inputs' && <div className="max-w-4xl mx-auto space-y-6"><InputGroup title="Liquid & Income"><InputField label="Cash ($)" value={data.cash} onChange={(v)=>updateNestedData('cash',v)} /><InputField label="Monthly Income" value={data.monthlyIncome} onChange={(v)=>updateNestedData('monthlyIncome',v)} /></InputGroup><InputGroup title="Assets"><InputField label="Real Estate" value={data.assets.realEstate} onChange={(v)=>updateAsset('realEstate',v)} /><InputField label="Crypto" value={data.assets.crypto} onChange={(v)=>updateAsset('crypto',v)} /></InputGroup></div>}
                </div>
            </div>
        )}
        {activeTab === 'database' && ( 
            <div className="h-full w-full flex items-center justify-center text-slate-500">
                Database Interface Placeholder
            </div>
        )}
        {activeTab === 'shop' && <ShopFullPage onPurchase={purchaseItem} discipline={data.discipline} inventory={data.inventory} lastDailyClaim={data.lastDailyClaim} lastHourlyClaim={data.lastHourlyClaim} onClaimDaily={handleClaimDaily} onClaimHourly={handleClaimHourly}/>}
      </main>
    </div>
  );
}