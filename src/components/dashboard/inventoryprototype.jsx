import React, { useState } from 'react';
import { 
  Package, ShoppingBag, Filter, Sliders, Search, 
  ArrowUpRight, Trash2, RotateCcw,
  Shield, TrendingUp, DollarSign, Lock, Activity, 
  Home, Layers, CheckCircle, Circle, AlertTriangle, 
  User, Trophy, Zap, Star, Code, Cpu, Hammer, Pickaxe, 
  Sprout, Sparkles, Briefcase, X, Sword, Heart, Target, 
  Users, LayoutDashboard, ArrowRight, ArrowLeft, Flame, 
  Edit3, Eye, EyeOff, Save, HelpCircle, Grid, List, 
  BookOpen, ChevronRight, Lock as LockIcon, Unlock, Droplet, 
  Brain, Smile, Coffee, Smartphone, Monitor, CreditCard, Map, 
  Scroll, FileKey, Dumbbell, Camera, PenTool, Car, Plus, 
  Headphones, Armchair, Book, HardDrive, Glasses, Coins, 
  Tag, Box, Dna, Hexagon, Server, Globe, Wifi, Database, Key, 
  MousePointer, GripVertical, Settings, Crown, Gift, Building, 
  Landmark, Gavel, Watch, Mic, Library, Archive, Copy,
  ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react';

// ----------------------------------------------------------------------
// NOTE: INLINED CONSTANTS TO PREVENT BUILD ERRORS IN PREVIEW
// ----------------------------------------------------------------------
const INVENTORY_SLOTS = 28;
const BANK_SLOTS = 50;
const CARDS_PER_PAGE = 100;

const IconMap = {
  Code, AlertTriangle, Coffee, Wifi, Smile, Hexagon, Grid, FileKey, CheckCircle, Sparkles, Server, Lock, Key, Cpu, HardDrive, Brain, Globe, Database, Zap, Dna, Sword, Target, Shield, Heart, Star, Users, Pickaxe, Activity, Sprout, Hammer, Monitor, Dumbbell, Camera, PenTool, Car, Headphones, Armchair, Book, Glasses, Coins, Package, ShoppingBag, Flame, LayoutDashboard, User, MousePointer, Edit3, GripVertical, DollarSign, TrendingUp, Plus, Layers, X, ChevronRight, LockIcon, Unlock, Droplet, Map, Scroll, Settings, Sliders, Crown, Gift, Box, Building, Landmark, Gavel, List, Filter, Circle, ArrowRight, ArrowLeft, Briefcase, Watch, Mic, Library, Archive, Trash2, HelpCircle
};

const RenderIcon = ({ name, size = 16, className = "" }) => {
  const IconComponent = IconMap[name] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};

const getRarityGradient = (rarity) => {
    switch(rarity) {
        case 'Legendary': return 'from-amber-900/50 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-900/20';
        case 'Epic': return 'from-purple-900/50 to-slate-900 border-purple-500/50 shadow-lg shadow-purple-900/20';
        case 'Rare': return 'from-blue-900/50 to-slate-900 border-blue-500/50 shadow-lg shadow-blue-900/20';
        case 'Uncommon': return 'from-emerald-900/50 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-900/20';
        default: return 'from-slate-800 to-slate-900 border-slate-700';
    }
};

const CARD_DATABASE = [
  { id: 'c1', name: "Hello World", rarity: "Common", desc: "Your first line of code.", iconName: "Code", value: 50 },
  { id: 'c2', name: "Syntax Error", rarity: "Common", desc: "A rite of passage.", iconName: "AlertTriangle", value: 50 },
  { id: 'c3', name: "Coffee Stain", rarity: "Common", desc: "Fuel for the machine.", iconName: "Coffee", value: 50 },
  { id: 'c4', name: "Ethernet Cable", rarity: "Common", desc: "Hardline connection.", iconName: "Wifi", value: 50 },
  { id: 'c5', name: "Rubber Duck", rarity: "Common", desc: "Debugging companion.", iconName: "Smile", value: 50 },
  { id: 'c6', name: "Mechanical Key", rarity: "Common", desc: "Click clack.", iconName: "Hexagon", value: 50 },
  { id: 'c7', name: "Pixel", rarity: "Common", desc: "One of many.", iconName: "Grid", value: 50 },
  { id: 'c8', name: "Bug Ticket", rarity: "Common", desc: "It never ends.", iconName: "FileKey", value: 50 },
  { id: 'u1', name: "Git Commit", rarity: "Uncommon", desc: "Save point created.", iconName: "CheckCircle", value: 150 },
  { id: 'u2', name: "Clean Code", rarity: "Uncommon", desc: "Easy to read.", iconName: "Sparkles", value: 150 },
  { id: 'u3', name: "Server Rack", rarity: "Uncommon", desc: "The heavy lifting.", iconName: "Server", value: 150 },
  { id: 'u4', name: "VPN", rarity: "Uncommon", desc: "Hidden tracks.", iconName: "Lock", value: 150 },
  { id: 'u5', name: "API Key", rarity: "Uncommon", desc: "Access granted.", iconName: "Key", value: 150 },
  { id: 'r1', name: "The Algorithm", rarity: "Rare", desc: "It knows what you want.", iconName: "Cpu", value: 400 },
  { id: 'r2', name: "Encrypted Drive", rarity: "Rare", desc: "Secrets within.", iconName: "HardDrive", value: 400 },
  { id: 'r3', name: "Neural Node", rarity: "Rare", desc: "Learning capacity.", iconName: "Brain", value: 400 },
  { id: 'r4', name: "Global Network", rarity: "Rare", desc: "Connected everywhere.", iconName: "Globe", value: 400 },
  { id: 'e1', name: "Mainframe", rarity: "Epic", desc: "Unlimited power.", iconName: "Database", value: 1000 },
  { id: 'e2', name: "Quantum Bit", rarity: "Epic", desc: "0 and 1 simultaneously.", iconName: "Zap", value: 1000 },
  { id: 'l1', name: "The Singularity", rarity: "Legendary", desc: "Intelligence explosion.", iconName: "Dna", value: 5000 },
];
// --- END INLINED SECTION ---


// --- HELPERS ---
const getRarityTextColor = (rarity) => {
  switch(rarity) {
      case 'Legendary': return 'text-amber-400';
      case 'Epic': return 'text-purple-400';
      case 'Rare': return 'text-blue-400';
      case 'Uncommon': return 'text-emerald-400';
      default: return 'text-slate-400';
  }
};

const getRarityBorderColor = (rarity) => {
  switch(rarity) {
      case 'Legendary': return 'border-amber-500/50';
      case 'Epic': return 'border-purple-500/50';
      case 'Rare': return 'border-blue-500/50';
      case 'Uncommon': return 'border-emerald-500/50';
      default: return 'border-slate-700';
  }
};

// --- SUB COMPONENTS ---

const InventoryGrid = ({ slots, containerId, onUseItem, onDragStart, onDrop, onContextMenu, mp }) => {
  const [tooltip, setTooltip] = useState(null);

  // Defensive check for slots
  const safeSlots = Array.isArray(slots) ? slots : new Array(28).fill(null);

  const handleMouseEnter = (e, item) => {
    if(!item) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      item,
      x: rect.left + (rect.width / 2),
      y: rect.top - 8 
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  const handleDragStart = (e, index) => {
    if (!safeSlots[index]) {
        e.preventDefault();
        return;
    }
    setTooltip(null); 
    e.dataTransfer.effectAllowed = "move";
    if (onDragStart) onDragStart(containerId, index);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e, targetIndex) => { e.preventDefault(); if (onDrop) onDrop(containerId, targetIndex); };
  const handleContextMenu = (e, item, index) => { e.preventDefault(); if(item && onContextMenu) onContextMenu(containerId, index); }

  return (
    <div className="flex flex-col h-full">
      {/* Header Pouch - Only show for Inventory */}
      {containerId === 'inventory' && (
        <div className="flex justify-between items-center p-2 bg-[#131313] border border-slate-800 rounded shrink-0 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><RenderIcon name="Coins" size={14}/> Discipline Pouch</div>
            <div className="font-mono text-white text-sm">{mp || 0} DSC</div>
        </div>
      )}

      <div className={`grid ${containerId === 'bank' ? 'grid-cols-5' : 'grid-cols-4'} gap-2 p-2 overflow-y-auto custom-scrollbar flex-1`}>
          {safeSlots.map((item, i) => (
              <div 
                key={i} 
                draggable={!!item}
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, i)}
                onClick={() => item && onUseItem && onUseItem(item, i, containerId)}
                onContextMenu={(e) => handleContextMenu(e, item, i)}
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseLeave={handleMouseLeave}
                className={`aspect-square rounded border flex items-center justify-center relative transition-all 
                    ${item 
                        ? `cursor-grab active:cursor-grabbing hover:text-white group bg-gradient-to-br ${getRarityGradient(item.rarity)} text-slate-400` 
                        : 'bg-[#1a1a1a] border-slate-800/50 border-dashed hover:border-slate-700'
                    }
                `}
              >
                  {item && (
                    <>
                        <RenderIcon name={item.iconName} size={20} />
                        {item.count > 1 && (
                            <div className="absolute -top-1 -right-1 bg-slate-900 border border-slate-600 text-white text-[10px] font-mono font-bold px-1.5 rounded-full shadow-md z-10">
                                x{item.count}
                            </div>
                        )}
                        {item.type === 'Box' && <div className="absolute bottom-1 text-[8px] bg-black/60 px-1 rounded text-amber-500 font-bold uppercase">BOX</div>}
                        {item.type === 'Pack' && <div className="absolute bottom-1 text-[8px] bg-black/60 px-1 rounded text-purple-400 font-bold uppercase">PK</div>}
                    </>
                  )}
              </div>
          ))}
      </div>

      {tooltip && (
        <div 
            className="fixed z-[9999] w-48 bg-[#0a0a0a] p-3 rounded-lg border border-slate-700 text-xs shadow-2xl pointer-events-none animate-in fade-in zoom-in duration-200"
            style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
            <div className={`font-bold text-base mb-1 text-amber-500`}>{tooltip.item.name}</div>
            <div className="text-[10px] leading-tight text-slate-300 mb-2">{tooltip.item.desc}</div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-2 mt-1">
                <span className="text-[9px] uppercase font-bold opacity-70 tracking-wider">{tooltip.item.rarity}</span>
                <span className="text-[9px] text-emerald-400 italic">{containerId === 'bank' ? 'Right-click to Withdraw' : 'Click to Use • Right-click to Bank'}</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-[#0a0a0a] border-r border-b border-slate-700 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const BankInterface = ({ slots, balance, onDragStart, onDrop, onContextMenu, onCurrencyAction }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4 px-4 pt-4 shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><RenderIcon name="Landmark" className="text-amber-500"/> Vault Storage</h2>
                <div className="bg-black/40 px-3 py-1 rounded border border-slate-700 flex items-center gap-2">
                    <RenderIcon name="Lock" size={14} className="text-slate-500"/>
                    <span className="text-amber-500 font-mono font-bold">{(balance || 0).toLocaleString()} DSC</span>
                </div>
            </div>

            {/* Currency Controls */}
            <div className="grid grid-cols-2 gap-4 px-4 mb-4 shrink-0">
                <div className="bg-[#131313] p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex justify-between">
                        <span>Deposit</span>
                        <ArrowDownToLine size={12} className="text-emerald-500"/>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => onCurrencyAction && onCurrencyAction('deposit', 0.1)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">10%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('deposit', 0.5)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">50%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('deposit', 1.0)} className="flex-1 bg-emerald-900/50 hover:bg-emerald-900 text-[10px] py-1 rounded text-emerald-400 border border-emerald-900">ALL</button>
                    </div>
                </div>
                <div className="bg-[#131313] p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex justify-between">
                        <span>Withdraw</span>
                        <ArrowUpFromLine size={12} className="text-red-500"/>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => onCurrencyAction && onCurrencyAction('withdraw', 0.1)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">10%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('withdraw', 0.5)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">50%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('withdraw', 1.0)} className="flex-1 bg-red-900/50 hover:bg-red-900 text-[10px] py-1 rounded text-red-400 border border-red-900">ALL</button>
                    </div>
                </div>
            </div>

            {/* Bank Grid */}
            <div className="flex-1 bg-black/20 rounded-lg border border-slate-800/50 p-2 mx-4 mb-4 overflow-hidden relative">
                <InventoryGrid 
                    slots={slots} 
                    containerId="bank" 
                    onDragStart={onDragStart} 
                    onDrop={onDrop}
                    onContextMenu={onContextMenu}
                    mp={0} // Hide MP in bank grid
                />
            </div>
            
            <div className="px-4 pb-2 text-[10px] text-slate-500 text-center shrink-0">
                Right-click items to quick-transfer • Drag to reorganize
            </div>
        </div>
    )
}

const CollectionBinder = ({ cards, onSell, onSellAll }) => {
    // Defensive default
    const safeCards = Array.isArray(cards) ? cards : [];
    const cardCounts = safeCards.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
    const uniqueOwnedIds = Object.keys(cardCounts);
    
    // Sort cards based on the real DB
    const sortedDb = [...CARD_DATABASE].sort((a, b) => {
        const aOwned = cardCounts[a.id] > 0;
        const bOwned = cardCounts[b.id] > 0;
        if (aOwned && !bOwned) return -1;
        if (!aOwned && bOwned) return 1;
        return 0;
    });

    const stats = CARD_DATABASE.reduce((acc, card) => {
        if (!acc[card.rarity]) acc[card.rarity] = { total: 0, owned: 0 };
        acc[card.rarity].total++;
        if (cardCounts[card.id] > 0) acc[card.rarity].owned++;
        return acc;
    }, {});

    let totalDuplicateValue = 0;
    let totalDuplicatesCount = 0;
    const cardValueMap = CARD_DATABASE.reduce((acc, c) => ({...acc, [c.id]: c.value || 10}), {});
    
    uniqueOwnedIds.forEach(id => {
        const count = cardCounts[id];
        if (count > 1) {
            const extraCopies = count - 1;
            const val = cardValueMap[id] || 0;
            totalDuplicateValue += extraCopies * val;
            totalDuplicatesCount += extraCopies;
        }
    });

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4 pl-4 pr-4 pt-4 shrink-0">
                <h2 className="text-xl font-bold text-white">Collection Binder</h2>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-slate-400">{uniqueOwnedIds.length} / {CARD_DATABASE.length} Collected</div>
                </div>
            </div>
            
            {/* Grid container with padding for hover pop-outs */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 mb-4 flex-1 overflow-y-auto custom-scrollbar p-4">
                {sortedDb.map(card => {
                    const count = cardCounts[card.id] || 0;
                    const isOwned = count > 0;
                    return (
                        <div key={card.id} className="aspect-[2/3] relative group transition-all duration-300 hover:scale-105 hover:z-50 perspective-1000">
                            <div className={`w-full h-full rounded-xl border-2 p-1.5 flex flex-col relative overflow-hidden transition-all shadow-lg ${isOwned ? 'border-[#e1b542] shadow-[#e1b542]/20 bg-slate-900' : 'border-slate-800 bg-[#0a0a0a] opacity-60 grayscale'}`}>
                                {isOwned && <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${getRarityGradient(card.rarity)}`}></div>}
                                <div className="relative z-10 flex justify-between items-start mb-1 px-1 pt-1">
                                    <div className={`text-[9px] font-bold uppercase tracking-tighter truncate w-full ${isOwned ? 'text-white' : 'text-slate-500'}`}>{card.name}</div>
                                </div>
                                <div className={`relative z-10 flex-1 bg-black/60 rounded border flex items-center justify-center mb-2 mx-0.5 overflow-hidden group-hover:border-white/20 transition-colors ${isOwned ? 'border-[#e1b542]/30' : 'border-white/5'}`}>
                                     <div className="transform group-hover:scale-110 transition-transform duration-500">
                                        {isOwned ? <RenderIcon name={card.iconName} size={36} className={getRarityTextColor(card.rarity)} /> : <RenderIcon name="LockIcon" size={28} className="text-slate-700"/>}
                                     </div>
                                </div>
                                <div className="relative z-10 bg-black/30 rounded p-1.5 h-[36px] border border-white/5 flex items-center justify-center">
                                    <div className="text-[7px] leading-tight text-slate-400 text-center font-medium line-clamp-2">{card.desc}</div>
                                </div>
                                <div className="relative z-10 mt-1 flex justify-between items-center px-1 pb-0.5">
                                    <div className={`text-[7px] font-bold uppercase tracking-widest ${getRarityTextColor(card.rarity)}`}>{card.rarity}</div>
                                    {count > 1 && <div className="bg-amber-500 text-black text-[8px] font-bold px-1.5 rounded-sm shadow-sm">x{count}</div>}
                                </div>
                                {count > 1 && (
                                    <div className="absolute inset-0 z-20 bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-sm">
                                        <button onClick={() => onSell && onSell(card.id, card.value || 10)} className="bg-emerald-600 text-white text-[9px] px-3 py-1.5 rounded hover:bg-emerald-500 font-bold shadow-lg border border-emerald-400/50 transform hover:scale-105 transition-all">SELL (+{card.value || 10})</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="p-3 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center mt-auto gap-2 shrink-0">
                <div className="flex gap-3 text-[10px] md:text-xs overflow-x-auto w-full md:w-auto whitespace-nowrap pb-1 md:pb-0 scrollbar-hide">
                    <span>Common: <b className="text-slate-300">{stats['Common']?.owned || 0}/{stats['Common']?.total || 0}</b></span>
                    <span>Uncommon: <b className="text-emerald-400">{stats['Uncommon']?.owned || 0}/{stats['Uncommon']?.total || 0}</b></span>
                    <span>Rare: <b className="text-blue-400">{stats['Rare']?.owned || 0}/{stats['Rare']?.total || 0}</b></span>
                    <span>Epic: <b className="text-purple-400">{stats['Epic']?.owned || 0}/{stats['Epic']?.total || 0}</b></span>
                    <span>Legendary: <b className="text-amber-500">{stats['Legendary']?.owned || 0}/{stats['Legendary']?.total || 0}</b></span>
                </div>
                {totalDuplicateValue > 0 && (
                    <button 
                        onClick={() => onSellAll && onSellAll({ value: totalDuplicateValue, count: totalDuplicatesCount })} 
                        className="text-xs font-bold bg-emerald-900/50 border border-emerald-500 text-emerald-400 px-3 py-1 rounded hover:bg-emerald-500 hover:text-black transition-colors flex items-center gap-2 animate-pulse"
                    >
                        <RenderIcon name="Coins" size={12} /> Sell {totalDuplicatesCount} Duplicates (+{totalDuplicateValue})
                    </button>
                )}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

export default function InventoryView({ 
    inventory, bank, bankBalance, cards, discipline, 
    onUpdateInventory, onUpdateBank, onUpdateBankBalance, onUpdateCards, onUpdateDiscipline,
    onUseItem, onOpenBox, onOpenPack
}) {
  const [rightTab, setRightTab] = useState('binder'); // 'binder' or 'bank'
  const [sellConfirm, setSellConfirm] = useState(null); 
  const [draggedItem, setDraggedItem] = useState(null); 

  // Defensive defaults to prevent crashes if props are missing
  const safeInventory = Array.isArray(inventory) ? inventory : new Array(28).fill(null);
  const safeBank = Array.isArray(bank) ? bank : new Array(50).fill(null);
  const safeCards = Array.isArray(cards) ? cards : [];

  // --- DRAG & DROP SYSTEM ---
  const handleDragStart = (containerId, index) => {
      setDraggedItem({ container: containerId, index });
  };

  const handleDrop = (targetContainerId, targetIndex) => {
      if (!draggedItem) return;
      const { container: sourceContainerId, index: sourceIndex } = draggedItem;
      const sourceSlots = sourceContainerId === 'inventory' ? safeInventory : safeBank;
      const targetSlots = targetContainerId === 'inventory' ? safeInventory : safeBank;
      const setSource = sourceContainerId === 'inventory' ? onUpdateInventory : onUpdateBank;
      const setTarget = targetContainerId === 'inventory' ? onUpdateInventory : onUpdateBank;

      if (sourceContainerId === targetContainerId) {
          const newSlots = [...sourceSlots];
          const temp = newSlots[sourceIndex];
          newSlots[sourceIndex] = newSlots[targetIndex];
          newSlots[targetIndex] = temp;
          setSource(newSlots);
      } else {
          const itemToMove = sourceSlots[sourceIndex];
          const targetItem = targetSlots[targetIndex];
          const newSourceSlots = [...sourceSlots];
          const newTargetSlots = [...targetSlots];
          newSourceSlots[sourceIndex] = targetItem; 
          newTargetSlots[targetIndex] = itemToMove;
          setSource(newSourceSlots);
          setTarget(newTargetSlots);
      }
      setDraggedItem(null);
  };

  const handleContextMenu = (containerId, index) => {
      const sourceSlots = containerId === 'inventory' ? safeInventory : safeBank;
      const targetSlots = containerId === 'inventory' ? safeBank : safeInventory;
      const setSource = containerId === 'inventory' ? onUpdateInventory : onUpdateBank;
      const setTarget = containerId === 'inventory' ? onUpdateBank : onUpdateInventory;

      const item = sourceSlots[index];
      if(!item) return;

      // Try to add to target stack first
      const newTarget = [...targetSlots];
      const existingIndex = newTarget.findIndex(s => s && s.name === item.name && s.rarity === item.rarity);
      
      if (existingIndex !== -1) {
          newTarget[existingIndex] = { ...newTarget[existingIndex], count: newTarget[existingIndex].count + item.count };
      } else {
          const emptyIndex = newTarget.findIndex(s => s === null);
          if (emptyIndex !== -1) {
              newTarget[emptyIndex] = item;
          } else {
              alert("Target storage is full!");
              return;
          }
      }
      
      setTarget(newTarget);
      const newSource = [...sourceSlots];
      newSource[index] = null;
      setSource(newSource);
  };

  const handleCurrencyAction = (type, percent) => {
      if (type === 'deposit') {
          const amount = Math.floor(discipline * percent);
          if (amount > 0) {
              onUpdateDiscipline(discipline - amount);
              onUpdateBankBalance(bankBalance + amount);
          }
      } else {
          const amount = Math.floor(bankBalance * percent);
          if (amount > 0) {
              onUpdateBankBalance(bankBalance - amount);
              onUpdateDiscipline(discipline + amount);
          }
      }
  };

  const handleSellCard = (id, val) => {
    const index = safeCards.indexOf(id);
    if (index > -1) {
        const newCards = [...safeCards];
        newCards.splice(index, 1);
        onUpdateCards(newCards);
        onUpdateDiscipline(discipline + val);
    }
  };

  const confirmSellAll = () => {
      if (!sellConfirm) return;
      const counts = {};
      const newCards = [];
      safeCards.forEach(id => {
          if (!counts[id]) { counts[id] = 1; newCards.push(id); }
      });
      onUpdateCards(newCards);
      onUpdateDiscipline(discipline + sellConfirm.value);
      setSellConfirm(null);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 items-start">
      
      {/* SELL MODAL */}
      {sellConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e1e1e] border border-slate-700 p-6 rounded-xl max-w-sm w-full shadow-2xl text-center">
                <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30"><RenderIcon name="Coins" size={24} className="text-emerald-400"/></div>
                <h3 className="text-xl font-bold text-white mb-2">Liquidation</h3>
                <p className="text-slate-400 text-sm mb-6">Sell <strong className="text-white">{sellConfirm.count} duplicates</strong> for <strong className="text-emerald-400">{sellConfirm.value} Discipline</strong>?</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => setSellConfirm(null)} className="px-4 py-2 rounded border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-bold">Cancel</button>
                    <button onClick={confirmSellAll} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors text-xs font-bold">Confirm Sale</button>
                </div>
            </div>
        </div>
      )}

      {/* INVENTORY COLUMN */}
      <div className="lg:w-1/3 flex flex-col gap-6 h-full overflow-hidden">
        <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 flex-1 flex flex-col shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><RenderIcon name="Package" size={120} /></div>
            <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><RenderIcon name="Package" className="text-amber-500"/> Backpack</h3>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-mono font-bold border ${safeInventory.filter(i => i).length >= INVENTORY_SLOTS ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-black/30 border-slate-700 text-slate-400'}`}>
                    {safeInventory.filter(i => i).length} / {INVENTORY_SLOTS}
                </div>
            </div>
            
            <div className="flex-1 relative z-10 overflow-hidden">
                <InventoryGrid 
                    slots={safeInventory} 
                    containerId="inventory"
                    mp={discipline}
                    onUseItem={onUseItem} 
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onContextMenu={handleContextMenu}
                />
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:w-2/3 bg-[#1e1e1e] border border-slate-700 rounded-xl flex flex-col shadow-2xl relative overflow-hidden h-full">
        <div className="flex border-b border-slate-700 bg-[#131313] shrink-0">
            <button onClick={() => setRightTab('binder')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${rightTab === 'binder' ? 'bg-[#1e1e1e] text-white border-t-2 border-amber-500' : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a1a]'}`}>
                <RenderIcon name="BookOpen" size={16}/> Card Binder
            </button>
            <button onClick={() => setRightTab('bank')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${rightTab === 'bank' ? 'bg-[#1e1e1e] text-white border-t-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a1a]'}`}>
                <RenderIcon name="Landmark" size={16}/> Bank Vault
            </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
            {rightTab === 'binder' ? (
                <div className="h-full flex flex-col p-6 overflow-hidden">
                    <div className="flex-1 bg-black/20 rounded-lg border border-slate-800/50 p-2 overflow-hidden">
                        <CollectionBinder cards={safeCards} onSell={handleSellCard} onSellAll={setSellConfirm}/>
                    </div>
                </div>
            ) : (
                <BankInterface 
                    slots={safeBank} 
                    balance={bankBalance}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onContextMenu={handleContextMenu}
                    onCurrencyAction={handleCurrencyAction}
                />
            )}
        </div>
      </div>
    </div>
  );
}