import React, { useState } from 'react';
import { 
  ShoppingBag, Zap, Shield, Package, 
  ChevronRight, Star, AlertCircle, Coins, Info, 
  Grid, List 
} from 'lucide-react';
import { SHOP_ITEMS } from '../../data/gamedata';
import { RenderIcon } from './dashboardutils';

// --- SUB-COMPONENT: SHOP ITEM CARD (Used for Card View) ---
const ShopItemCard = ({ item, onPurchase, canAfford, isWidget = false }) => {
  const getRarityColor = (r) => {
      switch(r) {
          case 'Legendary': return 'border-amber-500 text-amber-500 bg-amber-950/30';
          case 'Epic': return 'border-purple-500 text-purple-400 bg-purple-950/30';
          case 'Rare': return 'border-blue-500 text-blue-400 bg-blue-950/30';
          case 'Uncommon': return 'border-emerald-500 text-emerald-400 bg-emerald-950/30';
          default: return 'border-slate-600 text-slate-400 bg-slate-800/50';
      }
  };

  const rarityStyle = getRarityColor(item.rarity);
  const cardPadding = isWidget ? 'p-3' : 'p-5';
  const iconSize = isWidget ? 18 : 24;

  return (
    <div className={`relative group bg-[#1e1e1e] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${!canAfford ? 'opacity-60 grayscale-[0.3]' : 'hover:-translate-y-1 hover:shadow-2xl'} ${item.rarity === 'Legendary' ? 'border-amber-500/50' : 'border-slate-700'}`}>
        
        {/* Rarity Tag */}
        <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg backdrop-blur-md border-b border-l border-opacity-20" style={{ borderColor: 'inherit', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <span className={item.rarity === 'Legendary' ? 'text-amber-400' : item.rarity === 'Epic' ? 'text-purple-400' : 'text-slate-400'}>
                {item.rarity}
            </span>
        </div>

        <div className={`${cardPadding} flex flex-col h-full`}>
            {/* Icon Header */}
            <div className="mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${rarityStyle}`}>
                    <RenderIcon name={item.iconName} size={iconSize} />
                </div>
            </div>

            {/* Content */}
            <div className="mb-auto">
                <h3 className={`font-bold text-white mb-1 leading-tight ${isWidget ? 'text-sm' : 'text-lg'} group-hover:text-amber-500 transition-colors`}>{item.name}</h3>
                <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">${item.effect}</p>
            </div>

            {/* Footer / Price */}
            <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Cost</span>
                    <div className={`flex items-center gap-1 font-mono font-bold text-xs ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.cost.toLocaleString()} <span className="text-[8px]">DSC</span>
                    </div>
                </div>
                <button 
                    onClick={() => canAfford && onPurchase(item)}
                    disabled={!canAfford}
                    className={`w-full py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1
                        ${canAfford 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }
                    `}
                >
                    {canAfford ? 'Purchase' : 'Too Expensive'}
                </button>
            </div>
        </div>
    </div>
  );
};

// --- SUB-COMPONENT: SHOP ITEM ROW (Used for List View) ---
const ShopItemRow = ({ item, onPurchase, canAfford }) => {
    const getRarityTextColor = (r) => {
        switch(r) {
            case 'Legendary': return 'text-amber-400';
            case 'Epic': return 'text-purple-400';
            case 'Rare': return 'text-blue-400';
            case 'Uncommon': return 'text-emerald-400';
            default: return 'text-slate-400';
        }
    };
    
    return (
        <div className={`flex items-center justify-between p-2 rounded-lg border border-slate-700 bg-[#222222] transition-all hover:bg-[#2a2a2a] ${!canAfford ? 'opacity-60 grayscale-[0.3]' : ''}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center bg-black/30 shrink-0 ${getRarityTextColor(item.rarity)}`}>
                    <RenderIcon name={item.iconName} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`font-bold text-xs truncate ${getRarityTextColor(item.rarity)}`}>{item.name}</div>
                    <div className="text-[9px] text-slate-400 truncate">${item.effect}</div>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <div className={`font-mono text-[10px] font-bold w-12 text-right ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.cost.toLocaleString()}
                </div>
                <button 
                    onClick={() => canAfford && onPurchase(item)}
                    disabled={!canAfford}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors whitespace-nowrap
                        ${canAfford 
                            ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }
                    `}
                >
                    {canAfford ? 'Buy' : 'N/A'}
                </button>
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---
export default function ShopFullPage({ onPurchase, discipline }) {
  const [activeCategory, setActiveCategory] = useState('boosters');
  const [viewMode, setViewMode] = useState('card');
  
  // This helps determine if the component is likely in a widget (small space) or full page.
  // Since we cannot read container width, we use a crude proxy based on the current context or parent structure.
  const isFullPage = true; // For now, assume true since it's called from the main tab view.

  const categories = [
    { id: 'boosters', label: 'Boosters', icon: 'Zap', desc: 'Instant XP Gains' },
    { id: 'gear', label: 'Equipment', icon: 'Shield', desc: 'Permanent Bonuses' },
    { id: 'packs', label: 'Packs', icon: 'Package', desc: 'Random Loot' },
  ];
  
  const handlePurchaseWrapper = (item) => {
    onPurchase(item, activeCategory); 
  };

  const featuredItem = SHOP_ITEMS.gear.find(i => i.rarity === 'Legendary') || SHOP_ITEMS.gear[SHOP_ITEMS.gear.length - 1];
  
  // Conditionally render the compact widget view if we suspect we are constrained
  if (!isFullPage) {
    // This compact view is primarily for the mini-shop widget on the Home tab
    return (
        <div className="flex flex-col h-full p-2 bg-[#1e1e1e]">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><RenderIcon name="ShoppingBag" size={14}/> Market</h3>
                <div className="flex gap-1">
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${activeCategory === cat.id ? 'bg-amber-500 text-black' : 'text-slate-500 hover:bg-slate-700'}`}>{cat.label}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar max-h-[300px]">
                {SHOP_ITEMS[activeCategory]?.slice(0, 5).map(item => (
                     <ShopItemRow 
                        key={item.id} 
                        item={item} 
                        onPurchase={handlePurchaseWrapper} 
                        canAfford={discipline >= item.cost}
                    />
                ))}
            </div>
            <button className="text-[10px] text-slate-500 hover:text-white mt-2 border-t border-slate-700 pt-2">View Full Market (Global Tab)</button>
        </div>
    );
  }

  // --- FULL PAGE INTERFACE (for /shop tab) ---
  return (
    <div className="h-full flex flex-col bg-[#0f1219] overflow-hidden relative">
        
        {/* Top Bar / Balance Display (Condensed) */}
        <div className="shrink-0 px-6 py-4 bg-[#1a1a1a] border-b border-slate-800 flex justify-between items-center">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-amber-500" size={20} />
                <span className="hidden sm:inline">Black Market</span>
             </h2>
             <div className="bg-black/40 border border-emerald-500/30 rounded-lg px-4 py-2 flex items-center gap-3">
                <div className="bg-emerald-500/10 p-1 rounded-full text-emerald-400"><Coins size={16} /></div>
                <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold leading-none">Balance</div>
                    <div className="text-lg font-mono font-bold text-white leading-none">{discipline.toLocaleString()}</div>
                </div>
             </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar (Desktop) */}
            <div className="w-16 md:w-56 bg-[#131313] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                <div className="p-2 space-y-1">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all group relative
                                ${activeCategory === cat.id 
                                    ? 'bg-[#2a2a2a] text-white border border-amber-500/30 shadow-lg' 
                                    : 'text-slate-400 hover:bg-[#1e1e1e] hover:text-white border border-transparent'
                                }
                            `}
                        >
                            <div className={`p-2 rounded-lg shrink-0 ${activeCategory === cat.id ? 'bg-amber-500 text-black' : 'bg-black/30 text-slate-500 group-hover:text-white'}`}>
                                <RenderIcon name={cat.icon} size={18} />
                            </div>
                            <div className="hidden md:block text-left overflow-hidden">
                                <div className="font-bold text-sm truncate">{cat.label}</div>
                                <div className="text-[10px] opacity-60 truncate">{cat.desc}</div>
                            </div>
                            {activeCategory === cat.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gradient-to-b from-[#0f1219] to-[#131313]">
                
                {/* Featured Hero Banner */}
                <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-900/20 to-slate-900 border border-amber-500/20 p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="relative z-10 flex-1">
                        <div className="inline-block px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-amber-500/20">Restocked</div>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 italic">LEGENDARY LOOT</h1>
                        <p className="text-slate-400 text-sm max-w-md">High-tier equipment has arrived in the marketplace. Equip yourself for maximum efficiency.</p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <button onClick={() => setActiveCategory('gear')} className="bg-white text-black hover:bg-amber-400 px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
                            Browse Gear <RenderIcon name="ChevronRight" size={16} className="inline" />
                        </button>
                    </div>
                </div>

                {/* Grid Header and View Toggle */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold text-white capitalize">{categories.find(c => c.id === activeCategory)?.label}</h2>
                    <div className="flex items-center gap-3">
                         <span className="text-xs text-slate-500 font-mono">{SHOP_ITEMS[activeCategory]?.length || 0} Items</span>
                         <div className="flex border border-slate-700 rounded-md p-1 bg-[#131313]">
                            <button onClick={() => setViewMode('card')} className={`p-1 rounded-sm transition-colors ${viewMode === 'card' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:bg-slate-700'}`}>
                                <RenderIcon name="Grid" size={16} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:bg-slate-700'}`}>
                                <RenderIcon name="List" size={16} />
                            </button>
                         </div>
                    </div>
                </div>

                {/* Items Grid/List */}
                {viewMode === 'card' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {SHOP_ITEMS[activeCategory]?.map(item => (
                            <ShopItemCard 
                                key={item.id} 
                                item={item} 
                                onPurchase={handlePurchaseWrapper} 
                                canAfford={discipline >= item.cost}
                                isWidget={!isFullPage} // Pass context for compact rendering
                            />
                        ))}
                    </div>
                )}
                
                {viewMode === 'list' && (
                    <div className="space-y-3">
                        {SHOP_ITEMS[activeCategory]?.map(item => (
                            <ShopItemRow 
                                key={item.id} 
                                item={item} 
                                onPurchase={handlePurchaseWrapper} 
                                canAfford={discipline >= item.cost}
                            />
                        ))}
                    </div>
                )}
                
                {/* Empty State */}
                {(!SHOP_ITEMS[activeCategory] || SHOP_ITEMS[activeCategory].length === 0) && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                        <RenderIcon name="AlertCircle" size={48} className="mb-4 opacity-50" />
                        <p>No stock available in this section.</p>
                    </div>
                )}
            </div>

        </div>
    </div>
  );
}