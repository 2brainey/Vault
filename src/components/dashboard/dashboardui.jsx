// 2brainey/vault/Vault-afa4cc999fa2737b63c2f45c68edbd0523c4440e/src/components/dashboard/dashboardui.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    CheckCircle, Circle, ArrowRight, ArrowLeft, 
    HelpCircle, Lock as LockIcon, X, Trophy, Sparkles, Gift,
    Briefcase, DollarSign, Coins, Package, Tag, List
} from 'lucide-react'; 

import { CARD_DATABASE, CONTRACTS_PER_PAGE, CARDS_PER_PAGE, SKILL_DETAILS, INVENTORY_SLOTS } from '../../data/gamedata';
import { RenderIcon, getRarityGradient, getRarityColor, getXpRequiredForLevel } from './dashboardutils'; 

// --- NEW COMPONENT: SKILL CARD ---
export const SkillCard = ({ skill, onItemClick, totalXP }) => {
  const details = SKILL_DETAILS[skill.id] || { 
    name: skill.id.toUpperCase(), icon: "Star", color: "text-slate-400", desc: "Generic Skill", unlocks: [] 
  };
  
  const currentLevel = skill.level;
  const currentXP = totalXP;
  const nextLevel = Math.min(currentLevel + 1, 99);
  
  const xpForCurrent = getXpRequiredForLevel(currentLevel);
  const xpForNext = getXpRequiredForLevel(nextLevel);
  const progressPercent = Math.min(100, ((currentXP - xpForCurrent) / (xpForNext - xpForCurrent)) * 100);

  return (
    <div 
      onClick={() => onItemClick({ ...details, level: currentLevel, currentXP: totalXP, xpForNext, id: skill.id })}
      className="group relative bg-[#1e1e1e] border border-slate-700 hover:border-amber-500 rounded-lg p-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md bg-black/30 ${details.color} group-hover:scale-105 transition-transform duration-300`}>
          <RenderIcon name={details.icon} size={18} />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-white leading-tight truncate">{details.name}</h3>
          <div className="text-[9px] text-slate-500 font-mono">Lvl {currentLevel}</div>
        </div>
        <div className="ml-auto text-lg font-bold text-slate-700 group-hover:text-white/20 transition-colors">
          {currentLevel}
        </div>
      </div>

      <div className="absolute inset-0 bg-[#1a1a1a]/95 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center z-10 text-center border border-amber-500/50 pointer-events-none">
        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Experience</div>
        <div className="text-xl font-mono text-white font-bold mb-2">
          {currentXP ? currentXP.toLocaleString() : 0} <span className="text-xs text-slate-500">XP</span>
        </div>
        <div className="w-full space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 px-1">
            <span>Lvl {currentLevel}</span>
            <span>{xpForNext ? (xpForNext - currentXP).toLocaleString() : 0} to Lvl {nextLevel}</span>
          </div>
          <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-slate-700">
            <div className={`h-full ${details.color.replace('text', 'bg')}`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="mt-3 text-[10px] text-amber-500 font-bold flex items-center gap-1">
          <RenderIcon name="Sparkles" size={10} /> Click to view Mastery Log
        </div>
      </div>
    </div>
  );
};

// ... (Other components like MasteryModal, MasteryLogWidget, etc.)

// --- ADVANCED InventoryGrid (CONSOLIDATED FROM INVENTORYPROTOTYPE.JSX) ---

const getRarityTextColor = (rarity) => {
  switch(rarity) {
      case 'Legendary': return 'text-amber-400';
      case 'Epic': return 'text-purple-400';
      case 'Rare': return 'text-blue-400';
      case 'Uncommon': return 'text-emerald-400';
      default: return 'text-slate-400';
  }
};

export const InventoryGrid = ({ slots: inventory, mp, onUseItem, onDragStart, onDrop, onContextMenu, containerId }) => {
  const [tooltip, setTooltip] = useState(null);
  const safeSlots = Array.isArray(inventory) ? inventory : new Array(28).fill(null);

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
      {/* FIXED: Currency Pouch updated to Brain Matter (BM) */}
      {containerId === 'inventory' && (
        <div className="flex justify-between items-center p-2 bg-[#131313] border border-slate-800 rounded shrink-0 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400"><RenderIcon name="Brain" size={14}/> Brain Matter Pouch</div>
            <div className="font-mono text-white text-sm">{mp || 0} BM</div>
        </div>
      )}

      <div className={`grid ${containerId === 'bank' ? 'grid-cols-5' : 'grid-cols-4'} gap-2 p-2 overflow-y-auto custom-scrollbar flex-1 content-start`}>
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
            <div className={`font-bold text-base mb-1 ${getRarityTextColor(tooltip.item.rarity)}`}>{tooltip.item.name}</div>
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


// ... (The rest of the file follows, including CollectionBinder, ContractWidget, etc.)