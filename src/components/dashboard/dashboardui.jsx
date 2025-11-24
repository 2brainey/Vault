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
                          {isUnlocked ? <CheckCircleIcon /> : <RenderIcon name="LockIcon" size={14} className="text-slate-600"/>}
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

// --- STANDARD UI COMPONENTS (Including AssetBar) ---

export const WellnessBar = ({ label, value, iconName, onFill, color, tasks }) => {
    const [taskIndex, setTaskIndex] = useState(0);
    const handleMouseEnter = () => { if (tasks && tasks.length > 0) setTaskIndex(prev => (prev + 1) % tasks.length); };
    const displayTask = tasks && tasks.length > 0 ? tasks[taskIndex] : "Complete Maintenance";
    
    return (
      <div className="mb-3 last:mb-0">
         <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400"><RenderIcon name={iconName} size={12} /> {label}</div>
            <div className="relative group" onMouseEnter={handleMouseEnter}>
              <button onClick={onFill} className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-600 transition-colors">MAINTAIN</button>
              <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[#1a1a1a] border border-slate-700 text-[10px] text-slate-300 rounded-lg shadow-2xl hidden group-hover:block z-50 pointer-events-none">
                  <div className="font-bold text-amber-500 mb-1 flex items-center gap-1"><RenderIcon name="Flame" size={10}/> Real Life Task:</div><div className="text-white mb-2">{displayTask}</div><div className="text-emerald-400 font-mono">+5 Discipline & XP</div>
              </div>
            </div>
         </div>
         <div className="h-2 bg-black rounded-full overflow-hidden border border-slate-800"><div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}></div></div>
      </div>
    );
};

export const InventoryGrid = ({ inventory, mp, onUseItem }) => (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex justify-between items-center p-2 bg-[#131313] border border-slate-800 rounded shrink-0">
         <div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><RenderIcon name="Coins" size={14}/> Discipline Pouch</div>
         <div className="font-mono text-white text-sm">{mp} DSC</div>
      </div>
      <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 custom-scrollbar">
         {inventory?.map((item, i) => (
             <div key={item?.id || i} onClick={() => onUseItem && item && onUseItem(item, i, 'inventory')} className={`aspect-square rounded border flex items-center justify-center text-slate-400 hover:text-white group relative transition-all bg-gradient-to-br cursor-pointer active:scale-95 ${item ? getRarityGradient(item.rarity) : 'bg-[#1a1a1a] border-slate-800/50 border-dashed'}`}>
                 {item && <RenderIcon name={item.iconName} size={20} />}
             </div>
         ))}
      </div>
    </div>
);

export const ContractWidget = ({ contracts, onToggle, title }) => {
    const [filter, setFilter] = useState('active');
    const [page, setPage] = useState(0);
    const filtered = (contracts || []).filter(c => filter === 'active' ? !c.completed : filter === 'completed' ? c.completed : true);
    const sorted = [...filtered].sort((a,b) => (a.difficulty === 'Easy' && b.difficulty !== 'Easy') ? -1 : a.xp - b.xp);
    const paginated = sorted.slice(page * CONTRACTS_PER_PAGE, (page + 1) * CONTRACTS_PER_PAGE);
    const maxPage = Math.ceil(sorted.length / CONTRACTS_PER_PAGE) - 1;
    useEffect(() => setPage(0), [filter]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 px-4 pt-4">
                {title && <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><RenderIcon name="Briefcase" size={14}/> {title}</h3>}
                <div className="flex gap-1">{['active', 'completed', 'all'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 text-[9px] uppercase font-bold rounded ${filter === f ? 'bg-amber-500 text-black' : 'text-slate-500 hover:bg-slate-800'}`}>{f}</button>)}</div>
            </div>
            <div className="flex-1 px-4 space-y-2 min-h-[200px] overflow-y-auto custom-scrollbar">
                {paginated.map(c => (
                    <div key={c.id} onClick={() => !c.completed && onToggle(c.id)} className={`flex items-center justify-between p-3 rounded border transition-all ${c.completed ? 'border-emerald-900/50 bg-emerald-900/10 opacity-60' : 'border-slate-800 bg-[#2a2a2a] hover:border-amber-500/50 cursor-pointer'}`}>
                        <div className="flex items-center gap-3">
                            {c.completed ? <RenderIcon name="CheckCircle" size={14} className="text-emerald-500"/> : <RenderIcon name="Circle" size={14} className="text-slate-500"/>}
                            <div><div className={`text-xs font-bold ${c.completed ? 'text-emerald-500 line-through' : 'text-slate-200'}`}>{c.title}</div><div className="text-[10px] text-slate-500">{c.desc}</div></div>
                        </div>
                        <div className="text-right"><div className="text-[10px] text-amber-500 font-mono">+{c.xp} XP</div><div className="text-[8px] text-slate-600 uppercase">{c.difficulty}</div></div>
                    </div>
                ))}
                {paginated.length === 0 && <div className="text-center text-xs text-slate-500 py-8">No contracts found.</div>}
            </div>
            <div className="p-3 border-t border-slate-800 flex justify-between items-center mt-auto">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="text-slate-500 hover:text-white disabled:opacity-30"><RenderIcon name="ArrowLeft" size={14}/></button>
                <span className="text-[10px] text-slate-500">Page {page + 1} / {Math.max(1, maxPage + 1)}</span>
                <button disabled={page >= maxPage} onClick={() => setPage(p => p + 1)} className="text-slate-500 hover:text-white disabled:opacity-30"><RenderIcon name="ArrowRight" size={14}/></button>
            </div>
        </div>
    );
};

export const CollectionBinder = ({ cards, onSell }) => {
    const [page, setPage] = useState(0);
    const safeCards = cards || [];
    const cardCounts = safeCards.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
    const uniqueOwnedIds = Object.keys(cardCounts);
    const sortedDb = [...CARD_DATABASE].sort((a, b) => (cardCounts[a.id] > 0 ? -1 : 1));
    const paginatedCards = sortedDb.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
    const maxPage = Math.ceil(sortedDb.length / CARDS_PER_PAGE) - 1;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 pl-4 pr-4 pt-4">
                <h2 className="text-xl font-bold text-white">Collection Binder</h2>
                <div className="text-xs text-slate-400">{uniqueOwnedIds.length} / {CARD_DATABASE.length} Collected</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 mb-4 flex-1">
                {paginatedCards.map(card => {
                    const count = cardCounts[card.id] || 0;
                    const isOwned = count > 0;
                    return (
                        <div key={card.id} className={`aspect-[2/3] rounded-xl border-2 p-3 flex flex-col items-center justify-center text-center relative group transition-all ${isOwned ? `${getRarityGradient(card.rarity)} bg-black/40` : 'border-slate-800 bg-[#0a0a0a] opacity-50 grayscale'}`}>
                            {count > 1 && <div className="absolute top-2 right-2 bg-amber-500 text-black text-[9px] font-bold px-1.5 rounded-full">x{count}</div>}
                            <div className="mb-2">{isOwned ? <RenderIcon name={card.iconName} size={24} /> : <RenderIcon name="LockIcon" size={24}/>}</div>
                            <div className="text-[10px] font-bold mb-1 truncate w-full text-white">{card.name}</div>
                            <div className="text-[8px] uppercase opacity-70 text-slate-300">{card.rarity}</div>
                            {count > 1 && (
                                <div className="absolute inset-0 bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                    <button onClick={() => onSell(card.id, card.value || 10)} className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded hover:bg-emerald-500 font-bold">SELL 1 (+{card.value || 10})</button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="p-3 border-t border-slate-800 flex justify-between items-center mt-auto">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="text-slate-500 hover:text-white disabled:opacity-30"><RenderIcon name="ArrowLeft" size={14}/></button>
                <span className="text-[10px] text-slate-500">Page {page + 1} / {Math.max(1, maxPage + 1)}</span>
                <button disabled={page >= maxPage} onClick={() => setPage(p => p + 1)} className="text-slate-500 hover:text-white disabled:opacity-30"><RenderIcon name="ArrowRight" size={14}/></button>
            </div>
        </div>
    );
};

export const SkillMatrix = ({ skills, onItemClick, totalXPs }) => {
   return (
       <div className="grid grid-cols-2 gap-2 p-2 bg-[#131313] rounded border border-slate-800 overflow-y-auto custom-scrollbar max-h-[400px]">
           {skills.map((skill, i) => (
               <SkillCard key={skill.id} skill={skill} onItemClick={onItemClick} totalXP={totalXPs[skill.id] || 0} />
           ))}
       </div>
    );
};

export const DynamicStat = ({ label, value, sub, colors }) => (
    <div className="p-4 rounded-lg relative group" style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: `1px solid ${colors.border}` }}>
      <div className="text-xs text-slate-400 uppercase mb-1">{label}</div>
      <div className="text-xl font-bold text-white font-mono">{value}</div>
      <div className="text-xs text-amber-500 mt-1">{sub}</div>
    </div>
);

export const MetricCard = ({ title, value, iconName }) => (
  <div className="p-5 rounded-xl relative group bg-black/20 border border-slate-700">
    <div className="flex justify-between mb-2 opacity-50" style={{ color: '#94a3b8' }}><RenderIcon name={iconName} /></div>
    <div className="text-2xl font-bold text-white font-mono">{value}</div>
    <div className="text-xs text-slate-500 font-bold mt-1">{title}</div>
  </div>
);

// --- HERE IS THE MISSING ASSETBAR ---
export const AssetBar = ({ label, value, total, color }) => {
  const safeTotal = Number(total) || 1; 
  const safeValue = Number(value) || 0;
  const pct = Math.min(100, Math.max(0, (safeValue / safeTotal) * 100));
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{label}</span><span className="text-white font-mono">${safeValue.toLocaleString()}</span></div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#232a3a' }}><div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }}></div></div>
    </div>
  );
};

export const InputGroup = ({ title, children }) => (
    <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

export const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="text-[10px] text-slate-400 block mb-1">{label}</label>
    <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded bg-[#2b3446] p-2 text-white font-mono text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all border border-slate-700" />
  </div>
);

export const SkillDetailModal = ({ skill, onClose, colors }) => {
  const details = SKILL_DETAILS[skill.id] || { desc: "No data available.", unlocks: [] };
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in p-4">
        <div className="rounded-2xl max-w-sm w-full relative shadow-2xl overflow-hidden" style={{ backgroundColor: colors.bg, border: `2px solid ${colors.accentPrimary}` }}>
            <div className="p-6 border-b" style={{ borderColor: colors.border, background: '#232a3a' }}>
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white"><RenderIcon name="X" /></button>
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><RenderIcon name={skill.iconName} className={skill.color} /> {skill.name}</h2>
                <p className="text-amber-500 font-mono text-sm mt-1">Level {skill.level} / 99</p>
            </div>
            <div className="p-6">
                 <p className="text-slate-200 text-sm">{details.desc}</p>
                 <button onClick={onClose} className="mt-4 w-full py-2 bg-amber-500 text-black rounded font-bold hover:bg-amber-400">Close</button>
            </div>
        </div>
    </div>
  );
};