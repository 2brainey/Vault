import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '../../store/gamestore'; 
import { SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, INVENTORY_SLOTS, USER_NAME, MAX_TOTAL_LEVEL } from '../../data/gamedata'; 
import { WellnessBar, InventoryGrid, ContractWidget, CollectionBinder, SkillCard, MasteryModal, MasteryLogWidget, AssetBar, InputGroup, InputField } from './dashboardui'; 
import { RenderIcon } from './dashboardutils';
import InventoryView from './inventoryprototype'; 
import StatisticsTab from './statisticstab'; 
import ShopFullPage from './shopfullpage'; 
import EstatePrototype from './estateprototype';
import ProductivityTimerWidget from './productivitytimerwidget'; 
import TaskCommandCenterWidget from './taskcommandcenterwidget'; 
import LogisticsDashboard from './logisticsdashboard';
import TodoList from './todo_list'; 

export default function VaultDashboard() {
  const { 
    data, loading, loadGame, saveGame, updateWellness, setDiscipline, 
    updateNestedData, manualGrind, updateData, purchaseItemAction, 
    handleUseItemAction, handleSellCardAction, toggleAchievementAction, 
    handleClaimMasteryRewardAction, pendingPackOpen, getSkillData,
  } = useGameStore();

  useEffect(() => { loadGame(); setInterval(saveGame, 60000); }, []);
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => { updateWellness('energy', -1); updateWellness('hydration', -1); updateWellness('focus', -1); }, 30000);
    return () => clearInterval(timer);
  }, [loading, updateWellness]);

  // UI State
  const [activeTab, setActiveTab] = useState('dynamic'); 
  const [isTodoCollapsed, setIsTodoCollapsed] = useState(false);
  const [isKanbanExpanded, setIsKanbanExpanded] = useState(false);
  const [profileWidgetTab, setProfileWidgetTab] = useState('skills'); 
  const [dailyOpsTab, setDailyOpsTab] = useState('vitals'); 
  const [skillModal, setSkillModal] = useState(null); 
  const [masteryLogOpen, setMasteryLogOpen] = useState(false); 
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [packOpening, setPackOpening] = useState(null);
  const [dragItem, setDragItem] = useState(null);

  const [rightPanelTab, setRightPanelTab] = useState('skills');
  
  // NEW: Resizing State
  const RESIZE_MIN = 200;
  const RESIZE_MAX = 450;
  const [leftPanelWidth, setLeftPanelWidth] = useState(288);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const colors = { bg: '#2b3446', border: '#404e6d', accent: '#e1b542' };

  // --- Resizing Logic ---
  useEffect(() => {
    const handleMouseMove = (e) => {
        if (!isResizing) return;
        
        if (isResizing === 'left') {
            let newWidth = e.clientX;
            newWidth = Math.max(RESIZE_MIN, Math.min(RESIZE_MAX, newWidth));
            setLeftPanelWidth(newWidth);
        } else if (isResizing === 'right') {
            const viewportWidth = window.innerWidth;
            let newWidth = viewportWidth - e.clientX;
            newWidth = Math.max(RESIZE_MIN, Math.min(RESIZE_MAX, newWidth));
            setRightPanelWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    if (isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Handlers (Wrapped actions)
  const showToast = useCallback((msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }, []);
  const handleSetDiscipline = (val) => setDiscipline(val);
  const handleGrindAction = (k, r, e) => { const s = manualGrind(k, r, e); if(s) showToast(`+${r} DSC`, 'success'); else showToast('No Energy', 'error'); };
  const purchaseItem = (i, c) => { const r = purchaseItemAction(i, c); if(r.success && (i.type==='Pack'||i.type==='Box')) setPackOpening(null); showToast(r.message, r.success?'success':'error'); };
  const handleUseItem = (i, idx, cId) => { const r = handleUseItemAction(i, idx, cId); if(r.success && i.type==='Pack') setPackOpening(pendingPackOpen); showToast(r.message, r.success?'success':'error'); };
  const handleSellCard = (id, val) => { const r = handleSellCardAction(id, val); showToast(r.message, r.success?'success':'error'); };
  const toggleAchievement = (id) => { const r = toggleAchievementAction(id, !data.achievements.find(a=>a.id===id).completed); if(r.success) showToast(r.rewardMsg || 'Updated', 'success'); };
  const handleClaimMasteryReward = (sId, lvl, rwd) => { const r = handleClaimMasteryRewardAction(sId, lvl, rwd); if(r.success) { setSkillModal(null); showToast(r.message, 'success'); } else showToast(r.message, 'error'); };

  // Drag & Drop Logic for Center Widgets
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
  
  // Widget Toggle Logic
  const toggleWidgetConfig = (key) => {
    updateData(prev => {
        const isCurrentlyEnabled = prev.widgetConfig?.[key];
        return { 
            widgetConfig: {
                ...prev.widgetConfig,
                [key]: !isCurrentlyEnabled 
            }
        };
    });
  };

  // Memoized Data
  const financials = useMemo(() => {
      const ta = Object.values(data.assets || {}).reduce((a,b)=>Number(a)+Number(b),0)+Number(data.cash||0);
      const tl = Object.values(data.liabilities || {}).reduce((a,b)=>Number(a)+Number(b),0);
      return { netWorth: ta-tl, monthlyCashFlow: data.monthlyIncome-data.monthlyExpenses, runwayMonths: (data.cash/data.monthlyExpenses).toFixed(1) };
  }, [data]);
  
  // FIX: Corrected dependency array to remove invalid reference
  const { calculatedSkills: playerSkills, totalXPs } = useMemo(() => getSkillData(), [data, getSkillData]);
  
  const combatStats = useMemo(() => ({ totalLevel: playerSkills.reduce((s,x)=>s+x.level,0), combatLevel: Math.floor(playerSkills.reduce((s,x)=>s+x.level,0)/4) }), [playerSkills]);

  if (loading) return <div className="min-h-screen bg-[#2b3446] flex items-center justify-center text-white">Loading Vault...</div>;
  
  if (isKanbanExpanded) {
       return (
          <div className="fixed inset-0 z-50 bg-[#0f1219] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3"><RenderIcon name="LayoutDashboard" className="text-amber-500"/> KANBAN PRO</h1>
                  <button onClick={() => setIsKanbanExpanded(false)} className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700">Exit Board</button>
              </div>
              <div className="flex-1 flex gap-4 overflow-x-auto">
                  {['TO DO', 'IN PROGRESS', 'BLOCKED', 'DONE'].map(col => (
                      <div key={col} className="w-80 h-full bg-[#1e1e1e] rounded-xl border border-slate-700 flex flex-col shrink-0">
                          <div className="p-4 font-bold text-white border-b border-slate-800 flex justify-between items-center">{col}<span className="text-xs font-mono text-slate-500">0</span></div>
                          <div className="flex-1 p-2 bg-black/20 overflow-y-auto">
                              <div className="p-3 bg-slate-800 rounded mb-2 text-xs text-slate-300 border border-slate-700">Sample Task</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  const renderWidget = (widgetId) => {
    const isVisible = data.widgetConfig?.[widgetId];
    if (!isVisible && !editMode) return null;
    
    const baseClass = `rounded-xl border shadow-lg relative transition-all flex flex-col mb-4 overflow-hidden ${editMode ? 'border-dashed border-slate-500 hover:bg-slate-800/50 cursor-move' : 'bg-[#1e1e1e] border-[#404e6d]'}`;
    const CenterWidgetWrapper = ({ children, isDraggable = true }) => (
        <div 
            className={`${baseClass} h-fit min-h-[100px] mb-4 ${!isVisible && editMode ? 'opacity-50' : ''}`}
            draggable={isDraggable && editMode}
        >
            {editMode && <button onClick={() => toggleWidgetConfig(widgetId)} className="absolute top-2 right-2 p-1 bg-black/50 rounded z-20 text-white hover:bg-black"><RenderIcon name={isVisible ? "Eye" : "EyeOff"} size={14}/></button>}
            {editMode && isDraggable && <div className="absolute top-2 left-2 text-slate-500"><RenderIcon name="GripVertical" size={16}/></div>}
            {children}
        </div>
    );

    switch(widgetId) {
        case 'todo_list': return <div className={`${baseClass} h-full`}><TodoList /></div>;
        case 'daily_ops': return <CenterWidgetWrapper widgetId={widgetId}>
                <div className={`p-4`}>
                    <div className="flex gap-4 mb-4 border-b border-slate-700 pb-2">
                       <button onClick={() => setDailyOpsTab('vitals')} className={`text-xs font-bold uppercase ${dailyOpsTab==='vitals'?'text-white':'text-slate-500'}`}>Vitals</button>
                       <button onClick={() => setDailyOpsTab('grind')} className={`text-xs font-bold uppercase ${dailyOpsTab==='grind'?'text-white':'text-slate-500'}`}>Grind</button>
                    </div>
                    {dailyOpsTab === 'vitals' && <div className="space-y-3"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={()=>updateWellness('energy',20)} task="Sleep"/><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={()=>updateWellness('hydration',20)} task="Water"/><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={()=>updateWellness('focus',20)} task="Work"/></div>}
                    {dailyOpsTab === 'grind' && <div className="grid grid-cols-2 gap-2">{[{k:'cod',l:'Code',i:"Code",c:'text-blue-400'},{k:'inc',l:'Work',i:"DollarSign",c:'text-emerald-400'}].map((g,i)=><button key={i} onClick={()=>handleGrindAction(g.k,10,5)} className="p-2 bg-black/30 rounded border border-slate-700 flex flex-col items-center"><RenderIcon name={g.i} className={g.c}/><span className="text-[10px] mt-1">{g.l}</span></button>)}</div>}
                </div></CenterWidgetWrapper>;
        case 'productivity_timer': return <CenterWidgetWrapper widgetId={widgetId}><ProductivityTimerWidget /></CenterWidgetWrapper>;
        case 'task_command_center': return <CenterWidgetWrapper widgetId={widgetId}><TaskCommandCenterWidget onLaunchBoard={() => setIsKanbanExpanded(true)} /></CenterWidgetWrapper>;
        case 'active_contracts': return <div className={`${baseClass} p-0 h-fit`}><ContractWidget contracts={data.achievements} onToggle={toggleAchievement} /></div>;
        case 'collection': return <div className={`${baseClass} p-6 h-fit`}><CollectionBinder cards={data.cards} onSell={handleSellCard}/></div>;
        case 'player_card': return <div className={`${baseClass} p-4 h-fit`}>Card Placeholder</div>;
        case 'p_vitals': return <div className={`${baseClass} p-4 h-fit`}><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={()=>updateWellness('energy',20)} task="Sleep"/></div>;
        case 'financial_overview': return <div className={`${baseClass} p-6 h-fit`}>Financial Placeholder</div>;
        case 'mastery_log_widget': return <div className={`${baseClass} p-6 flex-1`}><MasteryLogWidget playerSkills={playerSkills} totalXPs={totalXPs} onItemClick={setSkillModal}/></div>;
        case 'skills': return null; 
        case 'inventory': return null; 
        default: return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans bg-vault-dark flex flex-col">
      {/* Toast, Modals (omitted for brevity) */}
      
      <header className="p-4 sticky top-0 z-40 shadow-xl bg-[#2b3446] border-b border-[#404e6d] flex justify-between">
         <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('dynamic')}>
            <RenderIcon name="Shield" size={28} className="text-amber-500" />
            <div><div className="font-bold text-white leading-none">THE VAULT</div><div className="text-[10px] text-slate-400 font-mono">${data.cash.toLocaleString()} | {data.discipline} DSC</div></div>
         </div>
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
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2" style={{ backgroundColor: activeTab === tab.id ? colors.accent : 'transparent', color: activeTab === tab.id ? '#000' : '#94a3b8' }}>
                <RenderIcon name={tab.icon} size={16} /> <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'dynamic' && (
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                
                {/* 1. LEFT: COLLAPSIBLE & RESIZABLE TODO */}
                <div 
                    className={`transition-colors duration-300 border-r border-slate-700 bg-[#161b22] relative flex flex-col shrink-0 ${isTodoCollapsed ? 'w-12' : 'w-auto'}`} 
                    style={{ width: isTodoCollapsed ? '3rem' : `${leftPanelWidth}px` }}
                >
                    {/* Drag Handle */}
                    {!isTodoCollapsed && (
                        <div 
                            className="absolute right-0 top-0 bottom-0 w-2 group cursor-ew-resize hover:bg-slate-700/50 transition-colors"
                            onMouseDown={(e) => { e.preventDefault(); setIsResizing('left'); }}
                        >
                            <RenderIcon name="GripVertical" size={14} className="absolute left-0.5 top-1/2 -translate-y-1/2 text-slate-500/0 group-hover:text-slate-500/50"/>
                        </div>
                    )}
                    <button onClick={() => setIsTodoCollapsed(!isTodoCollapsed)} className="absolute -right-3 top-4 bg-slate-700 text-white p-1 rounded-full z-10 border border-slate-500 hover:bg-amber-500 hover:text-black transition-colors">
                        <RenderIcon name={isTodoCollapsed ? "ChevronRight" : "ChevronLeft"} size={12} />
                    </button>
                    <div className={`flex-1 overflow-hidden ${isTodoCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 p-4'}`}>
                        <div className="h-full flex flex-col">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><RenderIcon name="List" size={14}/> Operations</h3>
                            <div className="flex-1 overflow-y-auto">{data.layout.home.left_sidebar.map(widgetId => <div key={widgetId} className="h-full">{renderWidget(widgetId)}</div>)}</div>
                        </div>
                    </div>
                    {isTodoCollapsed && <div className="pt-4 flex flex-col items-center gap-4 text-slate-500"><RenderIcon name="List" size={24} /></div>}
                </div>

                {/* 2. CENTER: 3-COLUMN GRID + EDIT MODE CONTROLS */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#0f1219]">
                    {/* EDIT LAYOUT BUTTONS */}
                    <div className="flex justify-end mb-4">
                        {editMode && (
                           <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                              <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Widget Config</div>
                              {data.layout.home.center.map(k => (
                                 <button key={k} onClick={() => toggleWidgetConfig(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{k.replace('_',' ')}</button>
                              ))}
                           </div>
                        )}
                        <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${editMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-slate-700'}`}><RenderIcon name="Edit3" size={14} /> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button>
                    </div>

                    <div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'center', data.layout.home.center.length, 'home')}
                    >
                        {data.layout.home.center.map((widgetId, i) => (
                           <div 
                              key={widgetId} 
                              draggable={editMode && data.widgetConfig[widgetId]} 
                              onDragStart={(e) => { if(editMode) handleDragStart(e, widgetId, 'center', 'home'); else e.preventDefault(); }} 
                              onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'center', i, 'home'); }} 
                              onDragOver={handleDragOver}
                           >
                              {renderWidget(widgetId)}
                           </div>
                        ))}
                    </div>
                </div>

                {/* 3. RIGHT: PERMANENT RESIZABLE PANEL */}
                <div 
                    className="bg-[#1a1a1a] border-l border-slate-700 flex flex-col shrink-0" 
                    style={{ width: `${rightPanelWidth}px` }}
                >
                    {/* Drag Handle */}
                    <div 
                        className="absolute left-0 top-0 bottom-0 w-2 group cursor-ew-resize hover:bg-slate-700/50 transition-colors"
                        onMouseDown={(e) => { e.preventDefault(); setIsResizing('right'); }}
                    >
                         <RenderIcon name="GripVertical" size={14} className="absolute left-0.5 top-1/2 -translate-y-1/2 text-slate-500/0 group-hover:text-slate-500/50"/>
                    </div>

                    {/* Tabbed Header */}
                    <div className="p-2 border-b border-slate-800 bg-[#131313] flex justify-center sticky top-0 z-10">
                        <button 
                            onClick={() => setRightPanelTab('skills')} 
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-colors flex items-center justify-center gap-2 ${rightPanelTab === 'skills' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}
                        >
                            <RenderIcon name="Scroll" size={14}/> Skills
                        </button>
                        <button 
                            onClick={() => setRightPanelTab('inventory')} 
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-colors flex items-center justify-center gap-2 ${rightPanelTab === 'inventory' ? 'bg-emerald-500 text-black' : 'text-slate-500 hover:text-white'}`}
                        >
                            <RenderIcon name="Package" size={14}/> Inventory
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                        
                        {/* Skills Tab Content - Clickable to open MasteryModal */}
                        {rightPanelTab === 'skills' && (
                            <div className="space-y-2 animate-in fade-in">
                                <div className="text-[10px] font-bold text-amber-500 uppercase mb-2">Full Mastery List</div>
                                {playerSkills.map(skill => (
                                    <div 
                                        key={skill.id} 
                                        onClick={() => setSkillModal({ ...skill, currentXP: totalXPs[skill.id] })} 
                                        className="flex justify-between items-center text-xs p-2 bg-black/40 rounded border border-slate-800 cursor-pointer hover:bg-slate-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <RenderIcon name={skill.iconName} size={14} className={skill.color}/> {skill.name}
                                        </div>
                                        <div className="font-mono">Lvl {skill.level}</div>
                                    </div>
                                ))}
                                <button onClick={() => setActiveTab('profile')} className="w-full text-xs font-bold text-slate-500 hover:text-white pt-2 border-t border-slate-800 flex items-center justify-center gap-1">
                                    View Mastery Log <RenderIcon name="ChevronRight" size={12}/>
                                </button>
                            </div>
                        )}

                        {/* Inventory Tab Content - Full 28 Slots */}
                        {rightPanelTab === 'inventory' && (
                            <div className="flex-1 flex flex-col animate-in fade-in">
                                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Backpack ({data.inventory.filter(i => i).length} / {INVENTORY_SLOTS})</div>
                                <div className="bg-black/20 rounded border border-slate-800 p-2 flex-1 min-h-[200px]">
                                    <InventoryGrid slots={data.inventory} mp={data.discipline} onUseItem={handleUseItem} containerId="inventory" />
                                </div>
                                <button onClick={() => setActiveTab('inventory')} className="w-full text-xs font-bold text-slate-500 hover:text-white pt-2 border-t border-slate-800 flex items-center justify-center gap-1">
                                    Open Full Inventory <RenderIcon name="ChevronRight" size={12}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* OTHER TABS (Unchanged) */}
        {activeTab === 'profile' && (
             <div className="p-8 grid grid-cols-3 gap-6 h-full overflow-y-auto">
                 <div className="space-y-6">{data.layout.profile.left.map(widgetId => renderWidget(widgetId))}</div>
                 <div className="space-y-6">{data.layout.profile.center.map(widgetId => renderWidget(widgetId))}</div>
                 <div className="space-y-6">{data.layout.profile.right.map(widgetId => renderWidget(widgetId))}</div>
             </div>
        )}
        
        {activeTab === 'shop' && <ShopFullPage onPurchase={purchaseItem} discipline={data.discipline} />}
        {activeTab === 'inventory' && <InventoryView inventory={data.inventory} bank={data.bank} discipline={data.discipline} onUseItem={handleUseItem} />}
        {activeTab === 'stats' && <StatisticsTab stats={data.statistics} />}
        {activeTab === 'estate' && <EstatePrototype discipline={data.discipline} setDiscipline={handleSetDiscipline} />}
        {activeTab === 'logisticsdashboard' && <LogisticsDashboard />}
      </main>
    </div>
  );
}