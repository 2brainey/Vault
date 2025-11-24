import React, { useState } from 'react';
import { SHOP_ITEMS } from '../../data/gamedata'; 
// Import helper from the sibling utils file
import { RenderIcon } from './dashboardutils'; 


export default function ShopFullPage({ onPurchase, discipline }) {
    const [shopTab, setShopTab] = useState('boosters');

    // Note: getRarityColor/Gradient should also be imported from utils if needed here. 

    return (
        <div className="animate-in fade-in duration-500 h-full">
            <div className="flex gap-4 mb-6">
                {['boosters', 'gear', 'packs'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setShopTab(tab)} 
                        className={`px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all 
                        ${shopTab === tab ? 'bg-amber-500 text-black' : 'bg-[#1e1e1e] text-slate-400 hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOP_ITEMS[shopTab].map(item => (
                    <div 
                        key={item.id} 
                        className="bg-[#1e1e1e] rounded-xl p-6 border border-slate-700 hover:border-amber-500 transition-all group relative overflow-hidden"
                    >
                        {/* Cost Tag */}
                        <div className="absolute top-0 right-0 bg-emerald-900/50 text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-emerald-900">
                            {item.cost} DSC
                        </div>
                        
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.color} bg-black/30`}>
                            <RenderIcon name={item.iconName} size={24} />
                        </div>
                        
                        {/* Details */}
                        <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-sm text-slate-400 mb-4">{item.effect}</p>
                        
                        {/* Purchase Button */}
                        <button 
                            onClick={() => onPurchase(item, shopTab)} 
                            disabled={discipline < item.cost}
                            className={`w-full py-2 rounded font-bold transition-colors 
                                ${discipline >= item.cost 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {discipline >= item.cost ? 'PURCHASE' : 'TOO EXPENSIVE'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}