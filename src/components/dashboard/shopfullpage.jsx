import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Zap, Shield, Package, 
  ChevronRight, Star, AlertCircle, Coins, Info, 
  Grid, List, CheckCircle, Gift, Sun, Trophy, Map, Home, Car, Ship, Aperture, Cpu, Database, Brain
} from 'lucide-react';
import { SHOP_ITEMS } from '../../data/gamedata';
import { RenderIcon } from './dashboardutils';

// --- NEW/MERGED DATA SOURCE FOR SHOP DISPLAY ---
// This combines core SHOP_ITEMS with the new Deeds/Crates/Packs from your model

// Deeds created by the user:
const NEW_DEED_ITEMS = [
    { id: 'd1', name: 'Plot Deed', iconName: 'Map', cost: 150000, rarity: 'Rare', effect: 'Grants ownership of a standard 16x16 land plot.' },
    { id: 'd2', name: 'Estate Deed', iconName: 'Home', cost: 500000, rarity: 'Epic', effect: 'Permanent 10% reduction on property tax.' },
    { id: 'd3', name: 'Business Deed', iconName: 'Trophy', cost: 2500000, rarity: 'Legendary', effect: 'License to operate a player-owned vendor stall.' },
    { id: 'd4', name: 'Car Deed', iconName: 'Car', cost: 75000, rarity: 'Uncommon', effect: 'Title to a basic utility vehicle.' },
    { id: 'd5', name: 'Boat Deed', iconName: 'Ship', cost: 125000, rarity: 'Rare', effect: 'Title to a small watercraft.' },
    { id: 'd6', name: 'Plane Deed', iconName: 'Aperture', cost: 15000000, rarity: 'Mythic', effect: 'Title to a private jet.' },
    { id: 'd7', name: 'Helicopter Deed', iconName: 'Cpu', cost: 7500000, rarity: 'Legendary', effect: 'Title to a transport helicopter.' },
];

// Crates/Daily Drops from the user's model:
const LOOT_CRATE_ITEMS = [
    { id: 'lf_hourly', name: 'Hourly Supply Crate', iconName: 'Sun', cost: 0, rarity: 'Common', isHourlyClaim: true, effect: 'A free hourly supply drop.' },
    { id: 'lf4', name: 'Standard Loot Crate', iconName: 'Package', cost: 1000, rarity: 'Common', effect: 'A basic crate containing 2-3 inventory items.' },
    { id: 'lf5', name: 'Epic Loot Crate', iconName: 'Gift', cost: 15000, rarity: 'Epic', effect: 'A quality crate with high-value items.' },
    { id: 'lf6', name: 'Legendary Loot Crate', iconName: 'Star', cost: 50000, rarity: 'Legendary', effect: 'The ultimate prize. Mythic possibility is high.' },
];

// Packs from the user's model (to replace old packs):
const CARD_PACK_ITEMS = [
    { id: 'p1', name: 'Standard Pack', iconName: 'Layers', cost: 500, rarity: 'Common', type: "Pack", effect: 'Contains 5 random Capital Cards.' },
    { id: 'p2', name: 'Epic Pack', iconName: 'Zap', cost: 1200, rarity: 'Epic', type: "Pack", effect: 'Contains 5 random Capital Cards. Better odds for higher rarities.' },
    { id: 'p3', name: 'Legend Pack', iconName: 'Crown', cost: 3500, rarity: 'Legendary', type: "Pack", effect: 'Contains 5 random Capital Cards. High odds for Legendary or Mythic.' },
    { id: 'p4', name: 'Standard Box', iconName: 'Archive', cost: 2000, rarity: 'Common', type: "Box", effect: 'A bundle of 5 Standard Packs.' },
    { id: 'p5', name: 'Epic Box', iconName: 'Archive', cost: 8000, rarity: 'Epic', type: "Box", effect: 'A bundle of 5 Epic Packs.' },
    { id: 'p6', name: 'Legend Box', iconName: 'Archive', cost: 30000, rarity: 'Legendary', type: "Box", effect: 'A premium bundle of 5 Legend Packs.' },
];

// Consolidated data structure used by the component
const CONSOLIDATED_SHOP_DATA = {
    boosters: SHOP_ITEMS.boosters, // Use existing boosters
    gear: [...NEW_DEED_ITEMS, ...SHOP_ITEMS.gear], // MERGE: Deeds now appear in Gear
    packs: CARD_PACK_ITEMS, // Replace old packs with new Card Packs
    crates: LOOT_CRATE_ITEMS, // New dedicated category for crates/daily items
};
// --- END NEW/MERGED DATA SOURCE ---


// --- SUB-COMPONENT: SHOP ITEM CARD ---
const ShopItemCard = ({ item, onPurchase, canAfford, isWidget = false, ownedCount = 0 }) => {
    const [purchaseMode, setPurchaseMode] = useState(false);
    const getRarityColor = (r) => {
        switch(r) {
            case 'Mythic': return 'border-rose-500 text-rose-400 bg-rose-950/30';
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

    const handleItemClick = (e) => {
        e.stopPropagation(); 
        if (!item.isHourlyClaim && !canAfford) return;
        
        if (purchaseMode) {
            onPurchase(item);
            setPurchaseMode(false);
        } else {
            setPurchaseMode(true);
        }
    };


    return (
        <div 
            className={`relative group bg-[#1e1e1e] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${!canAfford && !item.isHourlyClaim ? 'opacity-60 grayscale-[0.3]' : 'hover:-translate-y-1 hover:shadow-2xl'} ${item.rarity === 'Legendary' ? 'border-amber-500/50' : 'border-slate-700'}`}
            style={{ zIndex: purchaseMode ? 50 : 10 }} 
        >
            
            {/* Rarity Tag */}
            <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg backdrop-blur-md border-b border-l border-opacity-20" style={{ borderColor: 'inherit', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <span className={item.rarity === 'Legendary' ? 'text-amber-400' : item.rarity === 'Epic' ? 'text-purple-400' : 'text-slate-400'}>
                    {item.rarity}
                </span>
            </div>

            {/* Owned Tag */}
            {ownedCount > 0 && (
                <div className="absolute top-0 left-0 px-2 py-1 bg-emerald-900/80 border-b border-r border-emerald-500/30 rounded-br-lg z-10 flex items-center gap-1">
                    <CheckCircle size={10} className="text-emerald-400"/>
                    <span className="text-[9px] font-bold text-emerald-300 uppercase">Owned: {ownedCount}</span>
                </div>
            )}

            <div className={`${cardPadding} flex flex-col h-full`}>
                {/* Icon Header */}
                <div className="mb-2 mt-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${rarityStyle}`}>
                        <RenderIcon name={item.iconName} size={iconSize} />
                    </div>
                </div>

                {/* Content */}
                <div className="mb-auto">
                    <h3 className={`font-bold text-white mb-1 leading-tight ${isWidget ? 'text-sm' : 'text-lg'} group-hover:text-amber-500 transition-colors`}>{item.name}</h3>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{item.effect}</p>
                </div>

                {/* Footer / Price */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{item.isHourlyClaim ? 'Claim' : 'Cost'}</span>
                        <div className={`flex items-center gap-1 font-mono font-bold text-xs ${canAfford || item.isHourlyClaim ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.isHourlyClaim ? 'FREE' : item.cost.toLocaleString()} <span className="text-[8px]">{item.isHourlyClaim ? '' : 'BM'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleItemClick}
                        disabled={!canAfford && !item.isHourlyClaim}
                        className={`w-full py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1
                            ${(canAfford || item.isHourlyClaim)
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }
                        `}
                    >
                        {item.isHourlyClaim ? 'Claim' : canAfford ? 'Purchase' : 'Too Expensive'}
                    </button>
                </div>
            </div>

            {/* Purchase Confirmation Overlay */}
            {purchaseMode && (
                <div 
                    className="absolute inset-0 bg-black/90 rounded-xl flex flex-col items-center justify-center gap-1 z-20 border border-white/10 animate-in fade-in zoom-in duration-200"
                    onClick={(e) => { e.stopPropagation(); setPurchaseMode(false); }}
                >
                    <span className="text-[8px] font-bold text-white uppercase tracking-wider animate-pulse text-center">Confirm Purchase?</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-400">{item.cost >= 1000 ? (item.cost/1000) + 'k' : item.cost} BM</span>
                    <button onClick={() => setPurchaseMode(false)} className="text-[8px] text-slate-400 hover:text-white mt-1">(Click to Cancel)</button>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENT: SHOP ITEM ROW (Used for List View) ---
const ShopItemRow = ({ item, onPurchase, canAfford, ownedCount = 0 }) => {
    const getRarityTextColor = (r) => {
        switch(r) {
            case 'Mythic': return 'text-rose-400';
            case 'Legendary': return 'text-amber-400';
            case 'Epic': return 'text-purple-400';
            case 'Rare': return 'text-blue-400';
            case 'Uncommon': return 'text-emerald-400';
            default: return 'text-slate-400';
        }
    };
    
    return (
        <div className={`flex items-center justify-between p-2 rounded-lg border border-slate-700 bg-[#222222] transition-all hover:bg-[#2a2a2a] ${!canAfford && !item.isHourlyClaim ? 'opacity-60 grayscale-[0.3]' : ''}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center bg-black/30 shrink-0 ${getRarityTextColor(item.rarity)}`}>
                    <RenderIcon name={item.iconName} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <div className={`font-bold text-xs truncate ${getRarityTextColor(item.rarity)}`}>{item.name}</div>
                        {ownedCount > 0 && <span className="text-[9px] bg-emerald-900/50 text-emerald-400 px-1 rounded border border-emerald-500/30">x{ownedCount}</span>}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">{item.effect}</div>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <div className={`font-mono text-[10px] font-bold w-12 text-right ${canAfford || item.isHourlyClaim ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.isHourlyClaim ? 'FREE' : item.cost.toLocaleString()}
                </div>
                <button 
                    onClick={() => (canAfford || item.isHourlyClaim) && onPurchase(item)}
                    disabled={!canAfford && !item.isHourlyClaim}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors whitespace-nowrap
                        ${(canAfford || item.isHourlyClaim) 
                            ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }
                    `}
                >
                    {item.isHourlyClaim ? 'Claim' : canAfford ? 'Buy' : 'N/A'}
                </button>
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---
export default function ShopFullPage({ onPurchase, discipline, inventory = [] }) {
  const [activeCategory, setActiveCategory] = useState('boosters');
  const [viewMode, setViewMode] = useState('card');
  const isFullPage = true; 
  const [dailyClaimed, setDailyClaimed] = useState(false); // Simple state for demonstration

  // 1. Define all categories/tabs including the new Crate category
  const categories = [
    { id: 'boosters', label: 'Boosters', icon: 'Zap', desc: 'Instant XP Gains' },
    { id: 'gear', label: 'Gear & Deeds', icon: 'Shield', desc: 'Permanent Bonuses & Titles' },
    { id: 'packs', label: 'Card Packs', icon: 'Layers', desc: 'Capital Card Loot' },
    { id: 'crates', label: 'Crates & Daily', icon: 'Package', desc: 'Loot Box Items' },
  ];
  
  // 2. Map the active category ID to the consolidated data structure
  const currentItems = useMemo(() => {
      switch(activeCategory) {
          case 'gear': return CONSOLIDATED_SHOP_DATA.gear;
          case 'packs': return CONSOLIDATED_SHOP_DATA.packs;
          case 'crates': return CONSOLIDATED_SHOP_DATA.crates;
          case 'boosters':
          default: return CONSOLIDATED_SHOP_DATA.boosters;
      }
  }, [activeCategory]);
  
  const handlePurchaseWrapper = (item) => {
    onPurchase(item, activeCategory); 
  };

  // Helper to check owned count
  const getOwnedCount = (itemId) => {
      if (!inventory) return 0;
      // Filter the inventory for the item by ID or Name (fallback for different object schemas)
      const matches = inventory.filter(slot => slot && (slot.id === itemId || slot.name === itemId));
      return matches.reduce((acc, curr) => acc + (curr.count || 1), 0);
  };
  
  return (
    <div className="h-full flex flex-col bg-[#0f1219] overflow-hidden relative">
        
        {/* Top Bar / Balance Display (Condensed) - Now receives live discipline */}
        <div className="shrink-0 px-6 py-4 bg-[#1a1a1a] border-b border-slate-800 flex justify-between items-center">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-amber-500" size={24} />
                <span className="hidden sm:inline">Black Market</span>
             </h2>
             <div className="bg-black/40 border border-emerald-500/30 rounded-lg px-4 py-2 flex items-center gap-3">
                {/* ENHANCED BRAIN MATTER GRAPHIC IN SHOP HEADER */}
                <div className="p-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-xl shadow-pink-900/70">
                    <Brain size={18} className="text-white" />
                </div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold leading-none">Brain Matter</div>
                    <div className="text-xl font-mono font-bold text-white leading-none">{discipline.toLocaleString()}</div>
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
                
                {/* Daily Claim Section (Only for Crates tab) */}
                {activeCategory === 'crates' && (
                    <div className="mb-8">
                        <div className="rounded-xl bg-gradient-to-r from-blue-900/20 to-slate-900 border border-blue-500/30 p-4 flex items-center justify-between gap-4 shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg border-2 ${dailyClaimed ? 'bg-slate-700 border-slate-500' : 'bg-blue-500 border-blue-300'}`}>
                                    <RenderIcon name={dailyClaimed ? "CheckCircle" : "Gift"} size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Daily Supply Drop</h3>
                                    <p className="text-xs text-blue-200">{dailyClaimed ? "You have claimed today's reward." : "A free crate of supplies is available."}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setDailyClaimed(true)} // Mock claim logic
                                disabled={dailyClaimed}
                                className={`relative z-10 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${dailyClaimed ? 'bg-slate-800 text-slate-500' : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg'}`}
                            >
                                {dailyClaimed ? 'Claimed' : 'Claim Free'}
                            </button>
                        </div>
                    </div>
                )}


                {/* Grid Header and View Toggle */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold text-white capitalize">{categories.find(c => c.id === activeCategory)?.label}</h2>
                    <div className="flex items-center gap-3">
                         <span className="text-xs text-slate-500 font-mono">{currentItems.length || 0} Items</span>
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
                        {currentItems.map(item => (
                            <ShopItemCard 
                                key={item.id} 
                                item={item} 
                                onPurchase={handlePurchaseWrapper} 
                                canAfford={discipline >= item.cost}
                                isWidget={!isFullPage}
                                ownedCount={getOwnedCount(item.id)}
                            />
                        ))}
                    </div>
                )}
                
                {viewMode === 'list' && (
                    <div className="space-y-3">
                        {currentItems.map(item => (
                            <ShopItemRow 
                                key={item.id} 
                                item={item} 
                                onPurchase={handlePurchaseWrapper} 
                                canAfford={discipline >= item.cost}
                                ownedCount={getOwnedCount(item.id)}
                            />
                        ))}
                    </div>
                )}
                
                {/* Empty State */}
                {(currentItems.length === 0) && (
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