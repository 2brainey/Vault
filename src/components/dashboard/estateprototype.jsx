import React, { useState, useMemo } from 'react';
import { 
  Layout, Hammer, Plus, Lock, CheckCircle, 
  ArrowUpRight, MousePointer, Move, X,
  Dumbbell, Monitor, Book, Camera, Sprout,
  Shield, TrendingUp, DollarSign, Activity, 
  Home, Layers, Circle, AlertTriangle, 
  User, Trophy, Zap, Star, Code, Cpu, Pickaxe, 
  Sparkles, Briefcase, Sword, Heart, Target, 
  Users, LayoutDashboard, ArrowRight, ArrowLeft, Flame, 
  Edit3, Eye, EyeOff, Save, HelpCircle, 
  Grid as GridIcon, List as ListIcon, 
  BookOpen, ChevronRight, Lock as LockIcon, Unlock, Droplet, 
  Brain, Smile, Package, Coffee, Smartphone, CreditCard, Map, 
  Scroll, FileKey, PenTool, Car, ShoppingBag, 
  Headphones, Armchair, HardDrive, Glasses, Coins, Tag, 
  Box, Dna, Hexagon, Server, Globe, Wifi, Database, Key, 
  GripVertical, Settings, Sliders, Crown, Gift, 
  Building, Landmark, Gavel, Filter, Watch, Mic, Library, Archive, 
  Trash2, AlertCircle, Bed, Bath, Utensils, Expand, Maximize, Construction,
  ChevronLeft, ChevronRight as ChevronRightIcon, PanelRightClose, PanelRightOpen
} from 'lucide-react';
import { RenderIcon } from './dashboardutils'; 
import { ESTATE_ROOMS } from '../../data/gamedata'; // Corrected import

const PLOT_COST = 1000;
const MAX_GRID_DIMENSION = 10;

// --- MAIN COMPONENT ---
export default function EstatePrototype({ discipline: parentDiscipline = 5000, setDiscipline: parentSetDiscipline = () => {} }) {
  
  const [localDiscipline, setLocalDiscipline] = useState(parentDiscipline);
  const isControlled = parentDiscipline !== undefined;
  const discipline = isControlled ? parentDiscipline : localDiscipline;
  const setDiscipline = (valOrFn) => {
      const newVal = typeof valOrFn === 'function' ? valOrFn(discipline) : valOrFn;
      if (isControlled && parentSetDiscipline) parentSetDiscipline(newVal); else setLocalDiscipline(newVal);
  };

  const [gridDimension, setGridDimension] = useState(5);
  const [grid, setGrid] = useState(() => {
      const initial = new Array(5 * 5).fill(null);
      const center = Math.floor(initial.length / 2);
      initial[center] = 'empty'; 
      return initial;
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pendingBuildItem, setPendingBuildItem] = useState(null); 
  const [isSidebarOpen, setSidebarOpen] = useState(true); 
  const [sidebarTab, setSidebarTab] = useState('shop'); 
  const [bonusFilter, setBonusFilter] = useState('all'); 

  const expandGrid = () => {
      const oldDim = gridDimension;
      const newDim = oldDim + 1;
      const newGrid = new Array(newDim * newDim).fill(null);
      for(let oldIndex = 0; oldIndex < grid.length; oldIndex++) {
          const row = Math.floor(oldIndex / oldDim); 
          const col = oldIndex % oldDim; 
          const newIndex = (row * newDim) + col;
          newGrid[newIndex] = grid[oldIndex];
      }
      setGrid(newGrid);
      setGridDimension(newDim);
  };

  const handleSelectShopItem = (item) => {
      if (discipline < item.cost) { alert("Insufficient Discipline!"); return; }
      if (item.isExpansion) {
          if (gridDimension >= MAX_GRID_DIMENSION) { alert("Maximum Estate size reached!"); return; }
          expandGrid(); setDiscipline(d => d - item.cost); setPendingBuildItem(null); return;
      }
      setPendingBuildItem(item); setSidebarOpen(false); 
      if (selectedSlot !== null) {
          if (item.isDeed && grid[selectedSlot] === null) buyPlot(selectedSlot);
          else if (!item.isDeed && grid[selectedSlot] === 'empty') finalizeBuild(selectedSlot, item);
      }
  };

  const handleSlotClick = (index) => {
      const slotState = grid[index];
      const isUnowned = slotState === null;
      const isOccupied = typeof slotState === 'object';

      if (isUnowned) {
          if (pendingBuildItem?.isDeed) { buyPlot(index); return; }
          if (pendingBuildItem && !pendingBuildItem.isDeed) { alert("You must own this land before building!"); return; }
          setSelectedSlot(selectedSlot === index ? null : index); return;
      }
      if (isOccupied) { setSelectedSlot(index); setPendingBuildItem(null); return; }
      
      if (pendingBuildItem) {
          if (pendingBuildItem.isDeed) { alert("You already own this plot."); return; }
          finalizeBuild(index, pendingBuildItem);
      } else { setSelectedSlot(index); }
  };

  const buyPlot = (index) => {
      if (discipline < PLOT_COST) { alert("Insufficient Discipline!"); return; }
      const newGrid = [...grid]; newGrid[index] = 'empty'; setGrid(newGrid);
      setDiscipline(d => d - PLOT_COST); setSelectedSlot(null);
  };

  const finalizeBuild = (index, item) => {
      const newGrid = [...grid]; newGrid[index] = { ...item, builtAt: Date.now() }; setGrid(newGrid);
      setDiscipline(d => d - item.cost); setPendingBuildItem(null); setSelectedSlot(null);
  };

  const handleDemolish = (index) => {
      if(window.confirm("Demolish this structure? The land will remain owned.")) {
          const newGrid = [...grid]; newGrid[index] = 'empty'; setGrid(newGrid);
          if(selectedSlot === index) setSelectedSlot(null);
      }
  }

  const safeGrid = Array.isArray(grid) ? grid : [];
  const roomCounts = safeGrid.reduce((acc, room) => { if (room && typeof room === 'object' && room.id) acc[room.id] = (acc[room.id] || 0) + 1; return acc; }, {});
  const filteredBonuses = useMemo(() => ESTATE_ROOMS.filter(item => !item.isExpansion && !item.isBundle && !item.isDeed).filter(room => { const isOwned = roomCounts[room.id] > 0; return bonusFilter === 'owned' ? isOwned : bonusFilter === 'locked' ? !isOwned : true; }), [bonusFilter, roomCounts]);
  const plotsUsed = safeGrid.filter(x => x && typeof x === 'object').length;
  const totalPlots = gridDimension * gridDimension;

  return (
    <div className="h-full flex gap-0 animate-in fade-in overflow-hidden relative p-0">
      <div className={`flex-1 bg-[#1a202c] border-2 border-slate-700 rounded-xl p-6 relative overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${isSidebarOpen ? 'rounded-r-none border-r-0' : ''}`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#404e6d 1px, transparent 1px), linear-gradient(90deg, #404e6d 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

        <div className="relative z-10 flex justify-between items-center px-6 pt-6 pb-4 shrink-0">
            <div><h2 className="text-2xl font-bold text-white flex items-center gap-3"><RenderIcon name="Layout" className="text-blue-400"/> Estate Blueprint</h2><div className="h-6 flex items-center">{pendingBuildItem ? <span className="text-amber-400 text-sm font-bold animate-pulse flex items-center gap-2 bg-black/40 px-2 rounded"><RenderIcon name="Hammer" size={12}/> Select plot for {pendingBuildItem.name}</span> : <span className="text-slate-400 text-sm">Manage your property facilities.</span>}</div></div>
            <div className="flex gap-2">
                 {!isSidebarOpen && <button onClick={() => setSidebarOpen(true)} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg border border-slate-500 transition-colors flex items-center gap-2"><RenderIcon name="PanelRightOpen" size={18}/> <span className="text-xs font-bold">Open Shop</span></button>}
                <div className="bg-black/40 border border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2"><RenderIcon name="Maximize" size={14} className="text-blue-500"/><span className="text-white font-mono font-bold text-xs">{gridDimension}x{gridDimension}</span></div>
                <div className="bg-black/40 border border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2"><RenderIcon name="Home" size={14} className="text-emerald-500"/><span className="text-white font-mono font-bold text-xs">{plotsUsed} / {totalPlots}</span></div>
            </div>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center overflow-auto p-4">
            <div className="grid gap-2 transition-all duration-500 ease-in-out" style={{ gridTemplateColumns: `repeat(${gridDimension}, minmax(0, 1fr))`, width: '100%', maxWidth: isSidebarOpen ? '500px' : '700px', aspectRatio: '1/1' }}>
                {safeGrid.map((plot, i) => {
                    const isSelected = selectedSlot === i;
                    const isBuilt = plot && typeof plot === 'object';
                    const isOwned = plot === 'empty' || isBuilt;
                    
                    return (
                        <div 
                            key={i}
                            onClick={() => handleSlotClick(i)}
                            className={`
                                relative rounded-md border-2 flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden aspect-square
                                ${isBuilt 
                                    ? 'bg-slate-800 border-[#e1b542] shadow-lg z-10 shadow-[#e1b542]/20' 
                                    : isOwned 
                                        ? pendingBuildItem 
                                            ? (pendingBuildItem.isDeed ? 'bg-red-900/20 border-red-500/30' : 'bg-emerald-900/50 border-emerald-500/70 animate-pulse')
                                            : 'bg-emerald-900/40 border-emerald-500/30 hover:bg-emerald-800/50 hover:border-emerald-400'
                                        : pendingBuildItem?.isDeed
                                            ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/40 animate-pulse' 
                                            : 'bg-black/40 border-slate-800/50 hover:border-amber-700/50' 
                                }
                                ${isSelected ? 'ring-2 ring-amber-500 z-20' : ''}
                            `}
                        >
                            {isBuilt ? (
                                <>
                                    <div className="mb-0.5 p-1 bg-black/30 rounded-full text-[#e1b542]"><RenderIcon name={plot.icon} size={gridDimension > 7 ? 12 : 16} /></div>
                                    {gridDimension <= 7 && <div className="text-[8px] font-bold text-white text-center px-1 leading-tight line-clamp-1">{plot.name}</div>}
                                    <button onClick={(e) => { e.stopPropagation(); handleDemolish(i); }} className="absolute top-0.5 right-0.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full p-0.5"><RenderIcon name="X" size={8} /></button>
                                </>
                            ) : isOwned ? (
                                <div className={`flex flex-col items-center ${pendingBuildItem && !pendingBuildItem.isDeed ? 'text-emerald-400' : 'text-emerald-500/50 group-hover:text-emerald-400'}`}>
                                    {pendingBuildItem && !pendingBuildItem.isDeed ? <RenderIcon name="Hammer" size={14} /> : <RenderIcon name="Plus" size={14} />}
                                </div>
                            ) : (
                                isSelected ? (
                                    <button onClick={(e) => { e.stopPropagation(); buyPlot(i); }} className="w-full h-full bg-emerald-600 hover:bg-emerald-500 text-white flex flex-col items-center justify-center animate-in zoom-in duration-200">
                                        <span className="text-[8px] font-bold uppercase">Claim</span>
                                        <span className="text-[7px] font-mono">{PLOT_COST/1000}k</span>
                                    </button>
                                ) : (
                                    <div className={`flex flex-col items-center transition-colors ${pendingBuildItem?.isDeed ? 'text-emerald-500' : 'text-slate-700 group-hover:text-amber-600'}`}>
                                        <span className="text-[8px] font-mono uppercase font-bold">Sale</span>
                                        <span className="text-[8px]">{Math.floor(PLOT_COST/1000)}k</span>
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
        {pendingBuildItem && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-in slide-in-from-bottom-4"><button onClick={() => setPendingBuildItem(null)} className="px-6 py-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-full border border-slate-600 shadow-2xl font-bold flex items-center gap-2 backdrop-blur-md"><RenderIcon name="X" size={16} /> Cancel Construction</button></div>}
      </div>

      <div className={`flex flex-col gap-0 h-full overflow-hidden transition-all duration-300 bg-[#1e1e1e] border-l border-slate-700 shadow-2xl ${isSidebarOpen ? 'w-[400px] translate-x-0 rounded-l-none border-2' : 'w-0 translate-x-full opacity-0 pointer-events-none border-0'}`}>
          <div className="p-4 border-b border-slate-700 bg-[#131313] shrink-0 flex flex-col gap-4">
             <div className="flex justify-between items-center"><h3 className="font-bold text-white flex items-center gap-2"><RenderIcon name="Construction" size={16} className="text-amber-500"/> Estate Management</h3><button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white"><RenderIcon name="PanelRightClose" size={18}/></button></div>
             <div className="flex bg-black/30 p-1 rounded-lg"><button onClick={() => setSidebarTab('shop')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${sidebarTab === 'shop' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}><RenderIcon name="Hammer" size={12}/> Shop</button><button onClick={() => setSidebarTab('bonuses')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${sidebarTab === 'bonuses' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}><RenderIcon name="ArrowUpRight" size={12}/> Bonuses</button></div>
             <div className="flex justify-between items-center text-xs"><span className="text-slate-500 uppercase font-bold">Balance</span><span className="font-mono text-emerald-400 font-bold">{discipline.toLocaleString()} DSC</span></div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
             {sidebarTab === 'shop' && <div className="grid grid-cols-2 gap-3">{ESTATE_ROOMS.map(item => <button key={item.id} onClick={() => handleSelectShopItem(item)} disabled={discipline < item.cost} className={`relative p-3 rounded-lg border flex flex-col items-center text-center gap-2 transition-all group ${pendingBuildItem?.id === item.id ? 'ring-2 ring-amber-500 bg-slate-800' : ''} ${discipline >= item.cost ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500 hover:bg-slate-800' : 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'}`}>{item.isExpansion && <div className="absolute top-1 right-1 text-[8px] bg-purple-900/80 text-purple-200 px-1 rounded uppercase font-bold">Expand</div>}{item.isBundle && <div className="absolute top-1 right-1 text-[8px] bg-blue-900/80 text-blue-200 px-1 rounded uppercase font-bold">Bundle</div>}{item.isDeed && <div className="absolute top-1 right-1 text-[8px] bg-emerald-900/80 text-emerald-200 px-1 rounded uppercase font-bold">Land</div>}<div className={`p-2 rounded-full bg-black/30 ${discipline >= item.cost ? 'text-amber-500 group-hover:text-white' : 'text-slate-600'}`}><RenderIcon name={item.icon} size={20}/></div><div className="w-full"><div className="text-[10px] font-bold text-white truncate">{item.name}</div><div className="text-[9px] text-slate-500 font-mono">{item.cost.toLocaleString()}</div></div><div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg backdrop-blur-sm pointer-events-none"><p className="text-[10px] text-slate-300 leading-tight mb-2">{item.desc}</p><span className="text-[9px] font-bold text-emerald-400">Click to Build</span></div></button>)}</div>}
             {sidebarTab === 'bonuses' && <div className="space-y-2">{filteredBonuses.length > 0 ? filteredBonuses.map(room => { const count = roomCounts[room.id]; return <div key={room.id} className="p-3 rounded border border-slate-700 bg-slate-800/50 flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-1.5 bg-black/30 rounded text-blue-400"><RenderIcon name={room.icon} size={16}/></div><div><div className="text-xs font-bold text-white">{room.name}</div><div className="text-[9px] text-slate-400">{room.desc}</div></div></div><div className="text-xs font-mono font-bold text-emerald-400">x{count}</div></div> }) : <div className="text-center p-8 text-slate-500 text-xs italic border border-dashed border-slate-700 rounded-lg">No active facilities.</div>}</div>}
          </div>
      </div>
    </div>
  );
}