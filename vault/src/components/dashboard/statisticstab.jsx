import React from 'react';
import { 
  Activity, CheckCircle, Package, ShoppingBag, 
  TrendingUp, Zap, Droplet, Brain, Coins
} from 'lucide-react';
import { RenderIcon } from './dashboardutils';

export default function StatisticsTab({ stats }) {
  
  // Defensive default to prevent crashes if stats haven't initialized
  const s = stats || { maintenance: {} };

  const StatCard = ({ label, value, icon, color, subtext }) => (
    <div className="bg-[#1e1e1e] border border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-lg hover:border-slate-500 transition-colors group">
        <div className={`p-3 rounded-full bg-black/30 ${color} group-hover:scale-110 transition-transform`}>
            <RenderIcon name={icon} size={24} />
        </div>
        <div>
            <div className="text-2xl font-mono font-bold text-white">{value ? value.toLocaleString() : 0}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">{label}</div>
            {subtext && <div className="text-[10px] text-slate-600 mt-1">{subtext}</div>}
        </div>
    </div>
  );

  return (
    <div className="animate-in fade-in space-y-8 h-full overflow-y-auto custom-scrollbar p-2">
        
        {/* SECTION 1: HABIT TRACKING */}
        <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <Activity className="text-blue-500" size={20} /> Bio-Metrics Tracked
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    label="Energy Maintained" 
                    value={s.maintenance?.energy || 0} 
                    icon="Zap" 
                    color="text-yellow-400" 
                    subtext="Restful nights logged"
                />
                <StatCard 
                    label="Hydration Logged" 
                    value={s.maintenance?.hydration || 0}
                    icon="Droplet" 
                    color="text-blue-400" 
                    subtext="Water intake sessions"
                />
                <StatCard 
                    label="Focus Sessions" 
                    value={s.maintenance?.focus || 0} 
                    icon="Brain" 
                    color="text-purple-400" 
                    subtext="Deep work blocks completed"
                />
            </div>
        </div>

        {/* SECTION 2: CAREER & ECONOMY */}
        <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <TrendingUp className="text-emerald-500" size={20} /> Career Milestones
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                    label="Contracts Done" 
                    value={s.contractsCompleted || 0} 
                    icon="CheckCircle" 
                    color="text-emerald-400" 
                />
                <StatCard 
                    label="Packs Opened" 
                    value={s.packsOpened || 0} 
                    icon="Package" 
                    color="text-purple-400" 
                />
                <StatCard 
                    label="Items Bought" 
                    value={s.itemsBought || 0} 
                    icon="ShoppingBag" 
                    color="text-amber-500" 
                />
                <StatCard 
                    label="Cards Sold" 
                    value={s.cardsSold || 0} 
                    icon="TrendingUp" 
                    color="text-red-400" 
                />
            </div>
        </div>

        {/* SECTION 3: FINANCIAL LIFETIME */}
        <div className="bg-black/20 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Lifetime Earnings</div>
                    <div className="text-3xl font-mono text-white font-bold flex items-center gap-2">
                        <Coins className="text-amber-500" size={28}/> 
                        {(s.totalDisciplineEarned || 0).toLocaleString()} <span className="text-sm text-slate-500">DSC</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Sessions</div>
                    <div className="text-xl font-mono text-white">{(s.sessionsOpened || 0).toLocaleString()}</div>
                </div>
            </div>
        </div>

    </div>
  );
}