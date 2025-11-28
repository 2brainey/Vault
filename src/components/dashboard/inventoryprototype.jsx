// 2brainey/vault/Vault-afa4cc999fa2737b63c2f45c68edbd0523c4440e/src/components/dashboard/inventoryprototype.jsx

import React, { useState } from 'react';
import { 
  Package, ShoppingBag, Filter, Sliders, Search, 
  ArrowUpRight, Trash2, RotateCcw,
  Shield, TrendingUp, DollarSign, Lock, Activity, 
  Home, Layers, CheckCircle, Circle, AlertTriangle, 
  User, Trophy, Zap, Star, Code, Cpu, Hammer, Pickaxe, 
  Sprout, Sparkles, Briefcase, X, Sword, Heart, Target, 
  Users, LayoutDashboard, ArrowRight, ArrowLeft, Flame, 
  Edit3, Eye, EyeOff, Save, HelpCircle, Grid, List, 
  BookOpen, ChevronRight, Lock as LockIcon, Unlock, Droplet, 
  Brain, Smile, Coffee, Smartphone, Monitor, CreditCard, Map, 
  Scroll, FileKey, Dumbbell, Camera, PenTool, Car, Plus, 
  Headphones, Armchair, Book, HardDrive, Glasses, Coins, 
  Tag, Box, Dna, Hexagon, Server, Globe, Wifi, Database, Key, 
  MousePointer, GripVertical, Settings, Crown, Gift, Building, 
  Landmark, Gavel, Watch, Mic, Library, Archive, Copy,
  ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react';

// --- Imports for the consolidated logic ---
// NOTE: These were previously local inline constants/components
import { InventoryGrid, CollectionBinder } from './dashboardui'; // <-- IMPORT CONSOLIDATED GRID AND BINDER
import { RenderIcon } from './dashboardutils'; 
import { INVENTORY_SLOTS, CARD_DATABASE } from '../../data/gamedata'; 

// --- LOCAL COMPONENT: BankInterface (Stays here as it's only used by this file) ---

const BankInterface = ({ slots, balance, onDragStart, onDrop, onContextMenu, onCurrencyAction }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4 px-4 pt-4 shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><RenderIcon name="Landmark" className="text-amber-500"/> Vault Storage</h2>
                <div className="bg-black/40 px-3 py-1 rounded border border-slate-700 flex items-center gap-2">
                    <RenderIcon name="Lock" size={14} className="text-slate-500"/>
                    <span className="text-amber-500 font-mono font-bold">{(balance || 0).toLocaleString()} DSC</span>
                </div>
            </div>

            {/* Currency Controls */}
            <div className="grid grid-cols-2 gap-4 px-4 mb-4 shrink-0">
                <div className="bg-[#131313] p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex justify-between">
                        <span>Deposit</span>
                        <ArrowDownToLine size={12} className="text-emerald-500"/>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => onCurrencyAction && onCurrencyAction('deposit', 0.1)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">10%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('deposit', 0.5)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">50%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('deposit', 1.0)} className="flex-1 bg-emerald-900/50 hover:bg-emerald-900 text-[10px] py-1 rounded text-emerald-400 border border-emerald-900">ALL</button>
                    </div>
                </div>
                <div className="bg-[#131313] p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex justify-between">
                        <span>Withdraw</span>
                        <ArrowUpFromLine size={12} className="text-red-500"/>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => onCurrencyAction && onCurrencyAction('withdraw', 0.1)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">10%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('withdraw', 0.5)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded text-slate-300">50%</button>
                        <button onClick={() => onCurrencyAction && onCurrencyAction('withdraw', 1.0)} className="flex-1 bg-red-900/50 hover:bg-red-900 text-[10px] py-1 rounded text-red-400 border border-red-900">ALL</button>
                    </div>
                </div>
            </div>

            {/* Bank Grid uses the imported InventoryGrid */}
            <div className="flex-1 bg-black/20 rounded-lg border border-slate-800/50 p-2 mx-4 mb-4 overflow-hidden relative">
                <InventoryGrid 
                    slots={slots} 
                    containerId="bank" 
                    onDragStart={onDragStart} 
                    onDrop={onDrop}
                    onContextMenu={onContextMenu}
                    mp={0} // Hide MP in bank grid
                />
            </div>
            
            <div className="px-4 pb-2 text-[10px] text-slate-500 text-center shrink-0">
                Right-click items to quick-transfer • Drag to reorganize
            </div>
        </div>
    )
}

// NOTE: CollectionBinder is no longer included here as it is imported from dashboardui.jsx


// --- MAIN COMPONENT ---

export default function InventoryView({ 
    inventory, bank, bankBalance, cards, discipline, 
    onUpdateInventory, onUpdateBank, onUpdateBankBalance, onUpdateCards, onUpdateDiscipline,
    onUseItem, onOpenBox, onOpenPack
}) {
  const [rightTab, setRightTab] = useState('binder'); // 'binder' or 'bank'
  const [sellConfirm, setSellConfirm] = useState(null); 
  const [draggedItem, setDraggedItem] = useState(null); 

  // Defensive defaults to prevent crashes if props are missing
  // NOTE: BANK_SLOTS/INVENTORY_SLOTS are now imported from gamedata
  const safeInventory = Array.isArray(inventory) ? inventory : new Array(INVENTORY_SLOTS).fill(null);
  const safeBank = Array.isArray(bank) ? bank : new Array(50).fill(null);
  const safeCards = Array.isArray(cards) ? cards : [];

  // --- DRAG & DROP SYSTEM ---
  const handleDragStart = (containerId, index) => {
      setDraggedItem({ container: containerId, index });
  };

  const handleDrop = (targetContainerId, targetIndex) => {
      if (!draggedItem) return;
      const { container: sourceContainerId, index: sourceIndex } = draggedItem;
      const sourceSlots = sourceContainerId === 'inventory' ? safeInventory : safeBank;
      const targetSlots = targetContainerId === 'inventory' ? safeInventory : safeBank;
      const setSource = sourceContainerId === 'inventory' ? onUpdateInventory : onUpdateBank;
      const setTarget = targetContainerId === 'inventory' ? onUpdateInventory : onUpdateBank;

      if (sourceContainerId === targetContainerId) {
          const newSlots = [...sourceSlots];
          const temp = newSlots[sourceIndex];
          newSlots[sourceIndex] = newSlots[targetIndex];
          newSlots[targetIndex] = temp;
          setSource(newSlots);
      } else {
          const itemToMove = sourceSlots[sourceIndex];
          const targetItem = targetSlots[targetIndex];
          const newSourceSlots = [...sourceSlots];
          const newTargetSlots = [...targetSlots];
          newSourceSlots[sourceIndex] = targetItem; 
          newTargetSlots[targetIndex] = itemToMove;
          setSource(newSourceSlots);
          setTarget(newTargetSlots);
      }
      setDraggedItem(null);
  };

  const handleContextMenu = (containerId, index) => {
      const sourceSlots = containerId === 'inventory' ? safeInventory : safeBank;
      const targetSlots = containerId === 'inventory' ? safeBank : safeInventory;
      const setSource = containerId === 'inventory' ? onUpdateInventory : onUpdateBank;
      const setTarget = containerId === 'inventory' ? onUpdateBank : onUpdateInventory;

      const item = sourceSlots[index];
      if(!item) return;

      // Try to add to target stack first
      const newTarget = [...targetSlots];
      const existingIndex = newTarget.findIndex(s => s && s.name === item.name && s.rarity === item.rarity);
      
      if (existingIndex !== -1) {
          newTarget[existingIndex] = { ...newTarget[existingIndex], count: newTarget[existingIndex].count + item.count };
      } else {
          const emptyIndex = newTarget.findIndex(s => s === null);
          if (emptyIndex !== -1) {
              newTarget[emptyIndex] = item;
          } else {
              alert("Target storage is full!");
              return;
          }
      }
      
      setTarget(newTarget);
      const newSource = [...sourceSlots];
      newSource[index] = null;
      setSource(newSource);
  };

  const handleCurrencyAction = (type, percent) => {
      if (type === 'deposit') {
          const amount = Math.floor(discipline * percent);
          if (amount > 0) {
              onUpdateDiscipline(discipline - amount);
              onUpdateBankBalance(bankBalance + amount);
          }
      } else {
          const amount = Math.floor(bankBalance * percent);
          if (amount > 0) {
              onUpdateBankBalance(bankBalance - amount);
              onUpdateDiscipline(discipline + amount);
          }
      }
  };

  const handleSellCard = (id, val) => {
    const safeCardDatabase = CARD_DATABASE;
    const index = safeCards.indexOf(id);
    if (index > -1) {
        const newCards = [...safeCards];
        newCards.splice(index, 1);
        onUpdateCards(newCards);
        onUpdateDiscipline(discipline + val);
    }
  };

  const confirmSellAll = () => {
      if (!sellConfirm) return;
      const counts = {};
      const newCards = [];
      safeCards.forEach(id => {
          if (!counts[id]) { counts[id] = 1; newCards.push(id); }
      });
      onUpdateCards(newCards);
      onUpdateDiscipline(discipline + sellConfirm.value);
      setSellConfirm(null);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 items-start">
      
      {/* SELL MODAL */}
      {sellConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e1e1e] border border-slate-700 p-6 rounded-xl max-w-sm w-full shadow-2xl text-center">
                <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30"><RenderIcon name="Coins" size={24} className="text-emerald-400"/></div>
                <h3 className="text-xl font-bold text-white mb-2">Liquidation</h3>
                <p className="text-slate-400 text-sm mb-6">Sell <strong className="text-white">{sellConfirm.count} duplicates</strong> for <strong className="text-emerald-400">{sellConfirm.value} Discipline</strong>?</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => setSellConfirm(null)} className="px-4 py-2 rounded border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-bold">Cancel</button>
                    <button onClick={confirmSellAll} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors text-xs font-bold">Confirm Sale</button>
                </div>
            </div>
        </div>
      )}

      {/* INVENTORY COLUMN */}
      <div className="lg:w-1/3 flex flex-col gap-6 h-full overflow-hidden">
        <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 flex-1 flex flex-col shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><RenderIcon name="Package" size={120} /></div>
            <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><RenderIcon name="Package" className="text-amber-500"/> Backpack</h3>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-mono font-bold border ${safeInventory.filter(i => i).length >= INVENTORY_SLOTS ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-black/30 border-slate-700 text-slate-400'}`}>
                    {safeInventory.filter(i => i).length} / {INVENTORY_SLOTS}
                </div>
            </div>
            
            <div className="flex-1 relative z-10 overflow-hidden">
                <InventoryGrid 
                    slots={safeInventory} // <-- Using the imported InventoryGrid
                    containerId="inventory"
                    mp={discipline}
                    onUseItem={onUseItem} 
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onContextMenu={handleContextMenu}
                />
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:w-2/3 bg-[#1e1e1e] border border-slate-700 rounded-xl flex flex-col shadow-2xl relative overflow-hidden h-full">
        <div className="flex border-b border-slate-700 bg-[#131313] shrink-0">
            <button onClick={() => setRightTab('binder')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${rightTab === 'binder' ? 'bg-[#1e1e1e] text-white border-t-2 border-amber-500' : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a1a]'}`}>
                <RenderIcon name="BookOpen" size={16}/> Card Binder
            </button>
            <button onClick={() => setRightTab('bank')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${rightTab === 'bank' ? 'bg-[#1e1e1e] text-white border-t-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a1a]'}`}>
                <RenderIcon name="Landmark" size={16}/> Bank Vault
            </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
            {rightTab === 'binder' ? (
                <div className="h-full flex flex-col p-6 overflow-hidden">
                    <div className="flex-1 bg-black/20 rounded-lg border border-slate-800/50 p-2 overflow-hidden">
                        <CollectionBinder cards={safeCards} onSell={handleSellCard} onSellAll={setSellConfirm}/>
                    </div>
                </div>
            ) : (
                <BankInterface 
                    slots={safeBank} 
                    balance={bankBalance}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onContextMenu={handleContextMenu}
                    onCurrencyAction={handleCurrencyAction}
                />
            )}
        </div>
      </div>
    </div>
  );
}