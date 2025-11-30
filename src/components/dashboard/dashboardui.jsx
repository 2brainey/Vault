import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    CheckCircle, Circle, ArrowRight, ArrowLeft, 
    HelpCircle, Lock as LockIcon, X, Trophy, Sparkles, Gift,
    Briefcase, DollarSign, Coins, Package, Tag, List, Brain, Lock, Wrench
} from 'lucide-react'; 

import { CARD_DATABASE, CONTRACTS_PER_PAGE, CARDS_PER_PAGE, SKILL_DETAILS, INVENTORY_SLOTS } from '../../data/gamedata';
import { RenderIcon, getRarityGradient, getRarityColor, getXpRequiredForLevel } from './dashboardutils'; 

// --- SKILL CARD ---
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
            <div className={`h-full ${details.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="mt-3 text-[10px] text-amber-500 font-bold flex items-center gap-1">
          <RenderIcon name="Sparkles" size={10} /> Click to view Mastery Log
        </div>
      </div>
    </div>
  );
};

// --- MASTERY MODAL ---
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-500">
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
                          {isUnlocked ? <RenderIcon name="CheckCircle" size={16} className="text-emerald-500"/> : <RenderIcon name="Lock" size={14} className="text-slate-600"/>}
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

// --- INVENTORY GRID ---
export const InventoryGrid = ({ slots: inventory, mp, cash, salvage, onUseItem, onDragStart, onDrop, onContextMenu, containerId }) => {
  const safeSlots = Array.isArray(inventory) ? inventory : new Array(INVENTORY_SLOTS).fill(null);

  const handleDragStartLocal = (e, index) => {
    if (!safeSlots[index]) {
        e.preventDefault();
        return;
    }
    e.dataTransfer.effectAllowed = "move";
    if (onDragStart) onDragStart(containerId, index);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDropLocal = (e, targetIndex) => { e.preventDefault(); if (onDrop) onDrop(containerId, targetIndex); };
  const handleContextMenuLocal = (e, item, index) => { e.preventDefault(); if(item && onContextMenu) onContextMenu(containerId, index); }

  const getRarityTextColor = (rarity) => {
      switch(rarity) {
          case 'Legendary': return 'text-amber-400';
          case 'Epic': return 'text-purple-400';
          case 'Rare': return 'text-blue-400';
          case 'Uncommon': return 'text-emerald-400';
          default: return 'text-slate-400';
      }
  };

  return (
    <div className="flex flex-col h-full">
      {containerId === 'inventory' && (
        // Currency Pouch Header (Z-Index: 20)
        <div className="flex justify-between items-center p-2 bg-[#131313] border border-slate-800 rounded shrink-0 mb-3 text-[10px] z-20">
            <div className="flex items-center gap-1.5"><RenderIcon name="DollarSign" size={12} className="text-emerald-400"/><span className="font-mono font-bold text-white">${(cash || 0).toLocaleString()}</span></div>
            <div className="flex items-center gap-1.5"><RenderIcon name="Brain" size={12} className="text-pink-400"/><span className="font-mono font-bold text-white">{(mp || 0).toLocaleString()}</span></div>
            <div className="flex items-center gap-1.5"><RenderIcon name="Wrench" size={12} className="text-slate-400"/><span className="font-mono font-bold text-white">{salvage || 0}</span></div>
        </div>
      )}

      {/* Grid Container (Scrollable) */}
      <div className={`grid ${containerId === 'bank' ? 'grid-cols-5' : 'grid-cols-4'} gap-2 p-2 overflow-y-auto custom-scrollbar flex-1 content-start pb-12`}>
          {safeSlots.map((item, i) => (
              <div 
                key={i} 
                draggable={!!item}
                onDragStart={(e) => handleDragStartLocal(e, i)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropLocal(e, i)}
                onClick={() => item && onUseItem && onUseItem(item, i, containerId)}
                onContextMenu={(e) => handleContextMenuLocal(e, item, i)}
                // FINAL FIX: Position tooltip BELOW the item (top: 110%) and boost z-index on the container on hover.
                className={`
                    aspect-square rounded border flex items-center justify-center relative transition-all group z-50 hover:z-[100]
                    ${item 
                        ? `cursor-grab active:cursor-grabbing hover:text-white bg-gradient-to-br ${getRarityGradient(item.rarity)} text-slate-400` 
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
                        {/* Tooltip: Positioned BELOW the item (top: 110%) to clear the currency pouch header */}
                        <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-40 bg-[#0a0a0a] p-2 rounded border border-slate-700 text-xs shadow-2xl hidden group-hover:block z-[99999] pointer-events-none whitespace-normal">
                            <div className={`font-bold text-[10px] mb-0.5 ${getRarityTextColor(item.rarity)}`}>{item.name}</div>
                            <div className="text-[9px] leading-tight text-slate-300">{item.desc || item.type}</div>
                            {/* Arrow pointing UPWARDS */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#0a0a0a] border-l border-t border-slate-700 rotate-45"></div>
                        </div>
                    </>
                  )}
              </div>
          ))}
      </div>
    </div>
  );
};

// --- CARD COLLECTION BINDER ---
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

// --- UTILITY COMPONENTS (EXPORTED) ---

export const ContractWidget = ({ contracts, onToggle }) => {
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
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><RenderIcon name="X" size={24}/></button>
                </div>
                <p className="text-sm text-slate-400 mb-4">{skill.desc}</p>
                <div className="text-xs text-slate-300">Detailed stats and unlock path to be implemented here.</div>
            </div>
        </div>
    );
};