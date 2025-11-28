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
                          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border ml-4 ${isClaimable ? 'bg-black/40 border-slate-600' : 'bg-black/20 border-slate-800'}`}>
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


// --- CARD COLLECTION BINDER ---

// Helper function to map card IDs to full card objects and count duplicates
const mapAndCountCards = (cardIds) => {
    const cardMap = {};
    let totalValue = 0;
    
    cardIds.forEach(id => {
        const cardData = CARD_DATABASE.find(c => c.id === id);
        if (cardData) {
            if (!cardMap[id]) {
                cardMap[id] = { ...cardData, count: 0, duplicates: 0, totalValue: 0 };
            }
            cardMap[id].count++;
            
            // Track duplicates and their value for mass sale
            if (cardMap[id].count > 1) {
                cardMap[id].duplicates++;
                cardMap[id].totalValue += cardData.value;
                totalValue += cardData.value;
            }
        }
    });

    const uniqueCards = Object.values(cardMap).sort((a, b) => {
        const rarityOrder = ['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
        return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    });

    return { uniqueCards, totalValue };
};

const CardItem = ({ card, onSell }) => {
    const rarityColor = getRarityColor(card.rarity);

    return (
        <div className={`aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-center relative p-2 ${getRarityGradient(card.rarity)}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${rarityColor.replace('text', 'bg').replace('/20', '/30')}`}>
                <RenderIcon name={card.iconName} size={20} className={rarityColor} />
            </div>
            <h4 className="text-xs font-bold text-white text-center leading-tight truncate w-full px-1">{card.name}</h4>
            <div className="text-[8px] uppercase text-slate-400 mt-0.5">{card.rarity}</div>
            <div className="absolute top-1 right-1 text-[8px] font-mono font-bold px-1 rounded bg-black/50 text-emerald-400">
                {card.value} DSC
            </div>
            {card.count > 1 && (
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] font-mono px-1 rounded-full">
                    x{card.count}
                </div>
            )}
            
            {card.duplicates > 0 && (
                <button 
                    onClick={() => onSell(card.id, card.value)} 
                    className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl"
                    title={`Sell 1 duplicate for ${card.value} DSC`}
                >
                    <RenderIcon name="DollarSign" size={16} className="text-emerald-400 animate-pulse"/>
                    <span className="text-[9px] font-bold text-emerald-400 mt-1">Sell Dupe</span>
                </button>
            )}
        </div>
    );
};

export const CollectionBinder = ({ cards, onSell, onSellAll }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { uniqueCards, totalValue: totalDupeValue } = useMemo(() => mapAndCountCards(cards), [cards]);
    const totalPages = Math.ceil(uniqueCards.length / CARDS_PER_PAGE);

    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const currentCards = uniqueCards.slice(startIndex, startIndex + CARDS_PER_PAGE);

    const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    
    const duplicateCount = uniqueCards.reduce((sum, card) => sum + card.duplicates, 0);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><RenderIcon name="Tag" className="text-purple-400"/> Card Collection</h2>
                <div className="flex items-center gap-3">
                    {duplicateCount > 0 && (
                        <button 
                            onClick={() => onSellAll({ count: duplicateCount, value: totalDupeValue })}
                            className="px-3 py-1 bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-800 transition-colors flex items-center gap-2"
                        >
                            <RenderIcon name="Coins" size={14}/> Sell {duplicateCount} Duplicates ({totalDupeValue} DSC)
                        </button>
                    )}
                    <div className="text-xs font-mono text-slate-400">Total: {cards.length}</div>
                </div>
            </div>

            {uniqueCards.length > 0 ? (
                <>
                    <div className="grid grid-cols-4 gap-4 flex-1 mb-4">
                        {currentCards.map(card => (
                            <CardItem key={card.id} card={card} onSell={onSell} />
                        ))}
                        {[...Array(CARDS_PER_PAGE - currentCards.length)].map((_, i) => (
                             <div key={`empty-${i}`} className="aspect-[2/3] rounded-xl border border-slate-800/50 border-dashed bg-[#1a1a1a] flex items-center justify-center opacity-50">
                                <RenderIcon name="Circle" size={20} className="text-slate-700"/>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center shrink-0">
                        <button onClick={handlePrev} disabled={currentPage === 1} className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white">
                            <RenderIcon name="ArrowLeft" size={16}/>
                        </button>
                        <span className="text-xs text-slate-400 font-mono">Page {currentPage} / {totalPages}</span>
                        <button onClick={handleNext} disabled={currentPage === totalPages} className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white">
                            <RenderIcon name="ArrowRight" size={16}/>
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <RenderIcon name="Package" size={48} className="mb-4 opacity-50" />
                    <p>Your binder is empty. Buy a pack from the shop!</p>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: WELLNESS BAR (RESTORATION) ---
export const WellnessBar = ({ label, value, iconName, onFill, color, task }) => {
  const progressPercent = Math.max(0, Math.min(100, value));
  
  return (
    <div className="bg-[#131313] p-3 rounded-lg border border-slate-700 flex flex-col hover:border-blue-500/50 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-md ${color.replace('bg', 'text')}`}><RenderIcon name={iconName} size={16} /></div>
          <h4 className="text-xs font-bold text-white">{label}</h4>
        </div>
        <span className="text-xs font-mono text-white">{value}%</span>
      </div>
      <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-slate-700 relative">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${progressPercent}%` }}></div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] text-slate-500 italic flex items-center gap-1"><RenderIcon name="CheckCircle" size={10} className="text-emerald-500" /> Complete: {task}</span>
        <button 
          onClick={onFill} 
          disabled={value >= 100}
          className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
        >
          FILL +20
        </button>
      </div>
    </div>
  );
};


// --- PLACEHOLDER EXPORTS (RESTORED from original file structure) ---

export const ContractWidget = ({ contracts, onToggle, title, questFilter, setQuestFilter }) => {
  const displayContracts = contracts || [];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(displayContracts.length / CONTRACTS_PER_PAGE);

  const startIndex = (currentPage - 1) * CONTRACTS_PER_PAGE;
  const currentContracts = displayContracts.slice(startIndex, startIndex + CONTRACTS_PER_PAGE);

  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (displayContracts.length === 0) {
    return <div className="text-slate-500 text-xs italic p-4">No contracts to show. Time for a vacation.</div>;
  }

  return (
    <div className="flex flex-col p-4">
      {/* Contract List */}
      <div className="space-y-3 flex-1 min-h-[150px]">
        {currentContracts.map((contract) => (
          <div key={contract.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${contract.completed ? 'bg-emerald-900/20 border-emerald-700' : 'bg-slate-800/50 border-slate-700 hover:border-amber-500'}`}>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold leading-tight ${contract.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>{contract.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{contract.desc}</p>
              <div className="text-[9px] font-mono font-bold text-slate-500 mt-1">+{contract.xp} XP</div>
            </div>
            <button
              onClick={() => onToggle(contract.id)}
              className={`ml-3 px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap transition-colors ${contract.completed ? 'bg-red-800/50 text-red-400 hover:bg-red-700/50' : 'bg-amber-500 hover:bg-amber-400 text-black'}`}
            >
              {contract.completed ? 'Reset' : 'Complete'}
            </button>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
            <button onClick={handlePrev} disabled={currentPage === 1} className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white">
                <RenderIcon name="ArrowLeft" size={12}/>
            </button>
            <span className="text-[10px] text-slate-400">Page {currentPage} / {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages} className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white">
                <RenderIcon name="ArrowRight" size={12}/>
            </button>
        </div>
      )}
    </div>
  );
};

export const AssetBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
      <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
              <span>{label}</span>
              <span className="text-white font-mono">{value.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
          </div>
      </div>
  );
};

export const InputGroup = ({ title, children }) => (
    <div className="mb-8 p-4 bg-[#1a1a1a] rounded-lg border border-slate-700">
        <h3 className="text-xs font-bold uppercase text-amber-500 mb-4 pb-2 border-b border-slate-700">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const InputField = ({ label, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-xs text-slate-400 mb-1">{label}</label>
        <input 
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-black/50 border border-slate-700 rounded p-2 text-sm text-white focus:ring-amber-500 focus:border-amber-500 transition-all"
        />
    </div>
);

export const SkillDetailModal = ({ skill, onClose }) => {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#1a1a1a] border border-slate-700 w-full max-w-md rounded-xl p-6 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><RenderIcon name={skill.icon} className={skill.color}/> {skill.name} Mastery</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><RenderIcon name="X" size={20}/></button>
                </div>
                <p className="text-sm text-slate-400 mb-4">{skill.desc}</p>
                <div className="text-xs text-slate-300">Detailed stats and unlock path to be implemented here.</div>
            </div>
        </div>
    );
};