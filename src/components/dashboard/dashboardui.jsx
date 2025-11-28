// 2brainey/vault/Vault-afa4cc999fa2737b63c2f45c68edbd0523c4440e/src/components/dashboard/dashboardui.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { 
    CheckCircle, Circle, ArrowRight, ArrowLeft, 
    HelpCircle, Lock as LockIcon, X, Trophy, Sparkles, Gift
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
      onClick={() => onItemClick({ ...details, level: currentLevel, currentXP, xpForNext, id: skill.id })}
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

// --- NEW COMPONENT: MASTERY MODAL ---
export const MasteryModal = ({ skill, onClose, onClaimReward, claimedLevels }) => {
    if (!skill) return null;
    const progressToMax = (skill.level || 0) / 99 * 100;
  
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="bg-[#1a1a1a] border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
          <div className="p-6 bg-[#222] border-b border-slate-700 flex justify-between items-start relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-10 opacity-5 ${skill.color}`}>
              <RenderIcon name={skill.icon} size={200} />
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <div className={`p-4 rounded-xl bg-black/50 border border-slate-600 ${skill.color} shadow-lg`}>
                <RenderIcon name={skill.icon} size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{skill.name} Mastery</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-amber-500 font-mono font-bold">Level {skill.level}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400 text-sm">{(skill.currentXP || 0).toLocaleString()} Total XP</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="relative z-10 p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
              <RenderIcon name="X" size={24} />
            </button>
          </div>
  
          <div className="px-6 py-4 bg-[#151515] border-b border-slate-800">
            <div className="flex justify-between text-xs uppercase font-bold text-slate-500 mb-2">
              <span>Progress to 99</span>
              <span>{progressToMax.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-black rounded-full overflow-hidden border border-slate-800 relative">
              <div className={`h-full ${skill.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${progressToMax}%` }}></div>
              {[10,20,30,40,50,60,70,80,90].map(m => (
                <div key={m} className="absolute top-0 bottom-0 w-px bg-black/30" style={{ left: `${(m/99)*100}%` }}></div>
              ))}
            </div>
          </div>
  
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-4 relative">
              <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-800 z-0"></div>
              {skill.unlocks && skill.unlocks.map((unlock, index) => {
                const isUnlocked = skill.level >= unlock.level;
                const isClaimed = claimedLevels && claimedLevels.includes(unlock.level);
                const hasReward = !!unlock.reward;
                const isClaimable = isUnlocked && hasReward && !isClaimed;
                
                return (
                  <div key={unlock.level} className={`relative z-10 flex gap-4 group ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-14 h-14 rounded-2xl shrink-0 flex flex-col items-center justify-center border-2 font-bold shadow-lg transition-all ${isUnlocked ? `bg-[#222] ${skill.color} border-current shadow-${skill.color}/20` : 'bg-[#111] border-slate-800 text-slate-600'}`}>
                      <span className="text-xs uppercase">LVL</span>
                      <span className="text-xl leading-none">{unlock.level}</span>
                    </div>
                    <div className={`flex-1 rounded-xl border p-4 flex justify-between items-center transition-all ${isUnlocked ? 'bg-[#222] border-slate-700 group-hover:border-slate-500' : 'bg-[#111] border-slate-800'}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{unlock.title}</h4>
                          {isUnlocked ? <CheckCircleIcon /> : <RenderIcon name="Lock" size={14} className="text-slate-600"/>}
                        </div>
                        <p className="text-sm text-slate-400">{unlock.desc}</p>
                      </div>
                      {hasReward && (
                          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border ml-4 ${isUnlocked ? 'bg-black/40 border-slate-600' : 'bg-black/20 border-slate-800'}`}>
                              <div className={`p-1.5 rounded ${isClaimable ? 'bg-amber-500/20 text-amber-500' : isClaimed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-600'}`}>
                                  <RenderIcon name={unlock.reward.icon} size={16} />
                              </div>
                              <div className="text-right">
                                  <div className={`text-[9px] font-bold uppercase ${isClaimable ? 'text-amber-500' : isClaimed ? 'text-emerald-500' : 'text-slate-600'}`}>Reward</div>
                                  <div className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{unlock.reward.name}</div>
                              </div>
                              {isClaimable && (
                                  <button onClick={() => onClaimReward(skill.id, unlock.level, unlock.reward)} className="ml-2 text-[10px] bg-amber-500 hover:bg-amber-400 text-black px-2 py-1 rounded font-bold animate-pulse">CLAIM</button>
                              )}
                              {isClaimed && <RenderIcon name="CheckCircle" size={16} className="text-emerald-500 ml-2" />}
                          </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
};

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-500">
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- DEDICATED MASTERY LOG WIDGET ---
export const MasteryLogWidget = ({ playerSkills, totalXPs, onItemClick }) => (
    <div className="flex flex-col w-full"> 
        <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2 shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <RenderIcon name="Scroll" size={14} className="text-amber-500"/> Skill Mastery Overview
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2 bg-[#131313] rounded border border-slate-800 overflow-y-auto custom-scrollbar max-h-[340px]">
            {playerSkills && playerSkills.length > 0 ? (
                playerSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} onItemClick={onItemClick} totalXP={totalXPs[skill.id]} />
                ))
            ) : (
                <div className="col-span-2 flex items-center justify-center text-slate-500 text-xs h-32">No skills loaded.</div>
            )}
        </div>
    </div>
);

// --- ADVANCED InventoryGrid (CONSOLIDATED FROM INVENTORYPROTOTYPE.JSX) ---

// Helper needed locally in this scope
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

  // Defensive check for slots
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


// ... (rest of the file: WellnessBar, ContractWidget, CollectionBinder, etc.)
// ... (The rest of the component exports are unchanged)
// ...
// ... (Make sure to remove the old InventoryGrid block and keep the rest of the original file)
// ...

export const WellnessBar = ({ label, value, iconName, onFill, color, tasks }) => {
  // ...
  // (keep the rest of the file contents)
};