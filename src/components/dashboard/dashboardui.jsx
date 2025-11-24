import React, { useState, useEffect } from 'react';
import { 
    CheckCircle, Circle, ArrowRight, ArrowLeft, 
    HelpCircle, Lock as LockIcon 
} from 'lucide-react'; 

import { CARD_DATABASE, CONTRACTS_PER_PAGE, CARDS_PER_PAGE, SKILL_DETAILS, INVENTORY_SLOTS } from '../../data/gamedata';
import { RenderIcon, getRarityGradient, getRarityColor } from './dashboardutils'; 

// --- SUB-COMPONENTS ---

export const WellnessBar = ({ label, value, iconName, onFill, color, tasks }) => {
    const [taskIndex, setTaskIndex] = useState(0);
    const handleMouseEnter = () => {
        if (tasks && tasks.length > 0) {
            setTaskIndex(prev => (prev + 1) % tasks.length);
        }
    };
    const displayTask = tasks && tasks.length > 0 ? tasks[taskIndex] : "Complete Maintenance";
    
    return (
      <div className="mb-3 last:mb-0">
         <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
               <RenderIcon name={iconName} size={12} /> {label}
            </div>
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

export const InventoryGrid = ({ inventory, mp, onUseItem }) => {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex justify-between items-center p-2 bg-[#131313] border border-slate-800 rounded shrink-0">
         <div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><RenderIcon name="Coins" size={14}/> Discipline Pouch</div>
         <div className="font-mono text-white text-sm">{mp} DSC</div>
      </div>
      <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 custom-scrollbar">
          {inventory?.map((item, i) => (
              <div 
                key={item.instanceId || i} 
                onClick={() => onUseItem && onUseItem(item)}
                className={`aspect-square rounded border flex items-center justify-center text-slate-400 hover:text-white group relative transition-all bg-gradient-to-br cursor-pointer active:scale-95 ${item ? getRarityGradient(item.rarity) : ''}`}
              >
                  {item && <RenderIcon name={item.iconName} size={20} />}
              </div>
          ))}
      </div>
    </div>
  );
};

export const ContractWidget = ({ contracts, onToggle, title }) => {
    const [filter, setFilter] = useState('active');
    const [page, setPage] = useState(0);
    const safeContracts = contracts || [];

    const filtered = safeContracts.filter(c => {
        if (filter === 'active') return !c.completed;
        if (filter === 'completed') return c.completed;
        return true;
    });
    
    const sorted = [...filtered].sort((a,b) => (a.difficulty === 'Easy' && b.difficulty !== 'Easy') ? -1 : a.xp - b.xp);
    const paginated = sorted.slice(page * CONTRACTS_PER_PAGE, (page + 1) * CONTRACTS_PER_PAGE);
    const maxPage = Math.ceil(sorted.length / CONTRACTS_PER_PAGE) - 1;

    useEffect(() => setPage(0), [filter]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 px-4 pt-4">
                {title && <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><RenderIcon name="Briefcase" size={14}/> {title}</h3>}
                <div className="flex gap-1">
                    {['active', 'completed', 'all'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 text-[9px] uppercase font-bold rounded ${filter === f ? 'bg-amber-500 text-black' : 'text-slate-500 hover:bg-slate-800'}`}>{f}</button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 px-4 space-y-2 min-h-[200px] overflow-y-auto custom-scrollbar">
                {paginated.map(c => (
                    <div key={c.id} onClick={() => !c.completed && onToggle(c.id)} className={`flex items-center justify-between p-3 rounded border transition-all ${c.completed ? 'border-emerald-900/50 bg-emerald-900/10 opacity-60' : 'border-slate-800 bg-[#2a2a2a] hover:border-amber-500/50 cursor-pointer'}`}>
                        <div className="flex items-center gap-3">
                            {c.completed ? <RenderIcon name="CheckCircle" size={14} className="text-emerald-500"/> : <RenderIcon name="Circle" size={14} className="text-slate-500"/>}
                            <div>
                                <div className={`text-xs font-bold ${c.completed ? 'text-emerald-500 line-through' : 'text-slate-200'}`}>{c.title}</div>
                                <div className="text-[10px] text-slate-500">{c.desc}</div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[10px] text-amber-500 font-mono">+{c.xp} XP</div>
                             <div className="text-[8px] text-slate-600 uppercase">{c.difficulty}</div>
                        </div>
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
    
    const sortedDb = [...CARD_DATABASE].sort((a, b) => {
        const aOwned = cardCounts[a.id] > 0;
        const bOwned = cardCounts[b.id] > 0;
        if (aOwned && !bOwned) return -1;
        if (!aOwned && bOwned) return 1;
        return 0;
    });

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
                            
                            {/* Quick Sell Overlay */}
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

export const SkillMatrix = ({ skills, onItemClick }) => {
  const [layout, setLayout] = useState('grid');
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2 shrink-0">
         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skill Database</div>
         <div className="flex gap-1">
            <button onClick={() => setLayout('grid')} className={`p-1 rounded ${layout === 'grid' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:bg-slate-800'}`}><RenderIcon name="Grid" size={14}/></button>
            <button onClick={() => setLayout('list')} className={`p-1 rounded ${layout === 'list' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:bg-slate-800'}`}><RenderIcon name="List" size={14}/></button>
         </div>
      </div>
      {layout === 'grid' ? (
         <div className="grid grid-cols-3 gap-1 p-1 bg-[#131313] rounded border border-slate-800 overflow-y-auto custom-scrollbar">
            {skills.map((skill, i) => (
               <div key={i} onClick={() => onItemClick(skill)} className="p-2 flex flex-col items-center justify-center gap-1 hover:bg-[#2a2a2a] cursor-pointer min-h-[60px] border border-transparent hover:border-slate-600 transition-all group">
                  <span className="text-slate-400 group-hover:text-amber-500 transition-colors"><RenderIcon name={skill.iconName} /></span>
                  <span className="font-mono font-bold text-sm text-white group-hover:text-amber-500">{skill.level}</span>
                  <span className="text-[9px] text-slate-500 uppercase">{skill.name}</span>
               </div>
            ))}
         </div>
      ) : (
         <div className="space-y-1 p-1 bg-[#131313] rounded border border-slate-800 overflow-y-auto custom-scrollbar">
            {skills.map((skill, i) => (
               <div key={i} onClick={() => onItemClick(skill)} className="flex items-center justify-between p-2 hover:bg-[#2a2a2a] cursor-pointer border border-transparent hover:border-slate-600 group">
                  <div className="flex items-center gap-3">
                     <span className="text-slate-400 group-hover:text-amber-500"><RenderIcon name={skill.iconName} /></span>
                     <div><div className="text-xs font-bold text-slate-200 group-hover:text-white">{skill.name}</div><div className="text-[9px] text-slate-500">{skill.label}</div></div>
                  </div>
                  <div className="text-right"><div className="text-sm font-mono font-bold text-amber-500">{skill.level}</div></div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
};

export const DynamicStat = ({ label, value, sub, colors, tooltip }) => (
    <div className="p-4 rounded-lg relative group" style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: `1px solid ${colors.border}` }}>
      <div className="text-xs text-slate-400 uppercase mb-1">{label}</div>
      <div className="text-xl font-bold text-white font-mono">{value}</div>
      <div className="text-xs text-amber-500 mt-1">{sub}</div>
    </div>
);

export const MetricCard = ({ title, value, iconName, trend, colors, tooltip }) => (
  <div className="p-5 rounded-xl relative group bg-black/20 border border-slate-700">
    <div className="flex justify-between mb-2 opacity-50" style={{ color: '#94a3b8' }}><RenderIcon name={iconName} /></div>
    <div className="text-2xl font-bold text-white font-mono">{value}</div>
    <div className="text-xs text-slate-500 font-bold mt-1">{title}</div>
  </div>
);

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
    <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full rounded bg-[#2b3446] p-2 text-white font-mono text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all border border-slate-700" 
    />
  </div>
);

// --- MODAL EXPORTS ---

export const SkillDetailModal = ({ skill, onClose, colors }) => {
    const details = SKILL_DETAILS[skill.id] || { desc: "No data available.", unlocks: [] };
    const percentTo99 = (skill.level / 99) * 100;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in p-4">
        <div className="rounded-2xl max-w-2xl w-full relative shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" style={{ backgroundColor: colors.bg, border: `2px solid ${colors.accentPrimary}` }}>
            <div className="p-6 border-b relative" style={{ borderColor: colors.border, background: '#232a3a' }}>
              <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white"><RenderIcon name="X" /></button>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: colors.accentPrimary, color: '#000' }}>
                  <RenderIcon name={skill.iconName} size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{skill.name}</h2>
                  <p className="text-amber-500 font-mono text-sm">Level {skill.level} / 99</p>
                </div>
              </div>
              <div className="mt-4 h-3 bg-black/50 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${percentTo99}%` }}></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2"><RenderIcon name="BookOpen" size={16} /> About Skill</h3>
                <p className="text-slate-200 leading-relaxed bg-black/20 p-4 rounded-lg border border-slate-700">{details.desc}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2"><RenderIcon name="Trophy" size={16} /> Mastery Milestones</h3>
                <div className="space-y-2 relative pl-4">
                  <div className="absolute left-[26px] top-2 bottom-2 w-0.5 bg-slate-700 z-0"></div>
                  {details.unlocks.map((unlock, idx) => {
                    const isUnlocked = skill.level >= unlock.level;
                    return (
                      <div key={idx} className={`relative z-10 flex items-start gap-4 p-3 rounded-lg border transition-all mb-2 last:mb-0 ${isUnlocked ? 'bg-[#232a3a] border-emerald-500/30' : 'bg-transparent border-transparent opacity-50'}`}>
                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold border-2 text-xs ${isUnlocked ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-slate-500 text-slate-500 border-slate-600'}`}>{unlock.level}</div>
                        <div className="flex-1"><div className="flex items-center gap-2"><h4 className={`font-bold text-sm ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>{unlock.title}</h4>{isUnlocked ? <RenderIcon name="Unlock" size={12} className="text-emerald-500"/> : <RenderIcon name="LockIcon" size={12} className="text-slate-600"/>}</div><p className="text-xs text-slate-400">{unlock.desc}</p></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
        </div>
      </div>
    );
};

export const MasteryLogModal = ({ onClose, skills, colors }) => {
    // ... Modal content ...
    const sortedSkills = skills; 
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in p-4">
        <div className="rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col relative shadow-2xl border border-slate-700" style={{ backgroundColor: colors.bg }}>
           <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-[#232a3a]">
              <div><h2 className="text-2xl font-bold text-white flex items-center gap-3"><RenderIcon name="Scroll" className="text-amber-500"/> Grand Mastery Log</h2><p className="text-slate-400 text-sm">All accumulated knowledge and unlocks.</p></div>
              <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full"><RenderIcon name="X"/></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {sortedSkills.map((skill) => {
                    const details = SKILL_DETAILS[skill.id] || { unlocks: [] };
                    const unlocks = details.unlocks || [];
                    const unlockedCount = unlocks.filter(u => skill.level >= u.level).length;
                    return (
                       <div key={skill.id} className="rounded-xl border border-slate-700 overflow-hidden bg-[#1e1e1e]">
                          <div className="p-3 bg-[#2a2a2a] border-b border-slate-700 flex justify-between items-center">
                             <div className="flex items-center gap-2"><span className="text-amber-500"><RenderIcon name={skill.iconName}/></span><span className="font-bold text-white">{skill.name}</span></div>
                             <span className="text-xs font-mono text-slate-400">{unlockedCount} / {unlocks.length}</span>
                          </div>
                          <div className="p-3 space-y-2">
                             {unlocks.map((u, idx) => {
                                const isUnlocked = skill.level >= u.level;
                                return (
                                   <div key={idx} className={`relative z-10 flex items-start gap-4 p-3 rounded-lg border transition-all mb-2 last:mb-0 ${isUnlocked ? 'bg-[#232a3a] border-emerald-500/30' : 'bg-transparent border-transparent opacity-50'}`}>
                                      <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold border-2 text-xs ${isUnlocked ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-slate-500 text-slate-500 border-slate-600'}`}>{u.level}</div>
                                      <div className="min-w-0"><div className={`text-xs font-bold truncate ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>{u.title}</div><div className="text-[10px] text-slate-500 truncate">{u.desc}</div></div>
                                   </div>
                                )
                             })}
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