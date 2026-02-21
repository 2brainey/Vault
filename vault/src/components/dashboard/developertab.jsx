import React, { useState } from 'react';
import { useGameStore } from '../../store/gamestore';
import { SHOP_ITEMS, SKILL_DETAILS } from '../../data/gamedata';
import { RenderIcon, getRarityColor } from './dashboardutils';
import { 
    Plus, Trash2, Save, AlertTriangle, 
    Download, Upload, RefreshCw, Zap, 
    DollarSign, Briefcase, CheckCircle, XCircle 
} from 'lucide-react';

export default function DeveloperTab() {
    const { 
        data, 
        updateData, 
        updateNestedData, 
        toggleAchievementAction,
        dev_addItem, 
        dev_removeItem, 
        dev_setSkillLevel, 
        dev_setMasteryReward,
        saveGame 
    } = useGameStore();

    // --- STATE: SPAWNER ---
    const [selectedItemCat, setSelectedItemCat] = useState('boosters');
    const [selectedItemId, setSelectedItemId] = useState('');
    const [spawnQty, setSpawnQty] = useState(1);

    // --- STATE: SKILL TUNER ---
    const [skillTargetLevels, setSkillTargetLevels] = useState({});

    // --- STATE: MASTERY BUILDER ---
    const [rewardSkill, setRewardSkill] = useState('eng');
    const [rewardLevel, setRewardLevel] = useState(10);
    const [rewardType, setRewardType] = useState('Item'); 
    const [rewardDetails, setRewardDetails] = useState({ id: '', amount: 1000 });

    // --- STATE: JSON IMPORTER ---
    const [importText, setImportText] = useState('');
    const [showImport, setShowImport] = useState(false);

    // --- HANDLERS ---

    const handleSpawn = () => {
        const allItems = [...SHOP_ITEMS.boosters, ...SHOP_ITEMS.gear, ...SHOP_ITEMS.packs, ...SHOP_ITEMS.crates];
        const item = allItems.find(i => i.id === selectedItemId);
        if (item) dev_addItem(item, parseInt(spawnQty));
        else alert("Please select a valid item ID");
    };

    const handleSetLevel = (skillId) => {
        const lvl = skillTargetLevels[skillId];
        if (lvl) dev_setSkillLevel(skillId, parseInt(lvl));
    };

    const handleSaveReward = () => {
        let rewardObj = { name: 'Custom Reward', type: rewardType };
        if (rewardType === 'Item') {
             const allItems = [...SHOP_ITEMS.boosters, ...SHOP_ITEMS.gear, ...SHOP_ITEMS.packs, ...SHOP_ITEMS.crates];
             const item = allItems.find(i => i.id === rewardDetails.id);
             if (!item) return alert("Invalid Item ID");
             rewardObj = { ...item, type: 'Item', count: 1 };
        } else if (rewardType === 'Currency') {
             rewardObj = { name: `${rewardDetails.amount} Currency`, type: 'Currency', currency: 'cash', amount: parseInt(rewardDetails.amount) };
        } else if (rewardType === 'XP') {
             rewardObj = { name: `${rewardDetails.amount} Bonus XP`, type: 'XP', amount: parseInt(rewardDetails.amount) };
        }
        dev_setMasteryReward(rewardSkill, parseInt(rewardLevel), rewardObj);
    };

    const getVisualReward = (skillId, lvl) => {
        const custom = data.customRewards?.[skillId]?.[lvl];
        if (custom) return { ...custom, source: 'Custom' };
        return null; // No default rewards shown to keep canvas clean for builder
    };

    // --- NEW FEATURE HANDLERS ---

    const handleExportJSON = () => {
        const json = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(json);
        alert("Game State copied to clipboard!");
    };

    const handleImportJSON = () => {
        try {
            const parsed = JSON.parse(importText);
            updateData(parsed);
            alert("State injected successfully!");
            setShowImport(false);
        } catch (e) {
            alert("Invalid JSON format");
        }
    };

    const handleWipeSave = () => {
        if(confirm("ARE YOU SURE? This will wipe all progress.")) {
            localStorage.removeItem('vault_save_v1');
            window.location.reload();
        }
    };

    const resetCooldowns = () => {
        updateData({ lastDailyClaim: 0, lastHourlyClaim: 0 });
        alert("Daily and Hourly timers reset!");
    };

    const setVitals = (val) => {
        updateData({ wellness: { energy: val, hydration: val, focus: val } });
    };

    return (
        <div className="h-full flex flex-col gap-6 p-4 max-w-7xl mx-auto pb-32 animate-in fade-in">
            {/* --- HEADER & GLOBAL CONTROLS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-900/20 border border-amber-500/50 p-4 rounded-xl flex items-center gap-4">
                    <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                    <div>
                        <h2 className="text-lg font-bold text-white leading-none">Developer Console</h2>
                        <p className="text-xs text-amber-200 mt-1">Live Environment. Changes auto-save.</p>
                    </div>
                </div>
                <div className="flex gap-2 h-full">
                    <button onClick={saveGame} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-slate-300">
                        <Save size={16} className="mb-1"/> Force Save
                    </button>
                    <button onClick={handleExportJSON} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-emerald-400">
                        <Download size={16} className="mb-1"/> Export JSON
                    </button>
                    <button onClick={() => setShowImport(!showImport)} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-blue-400">
                        <Upload size={16} className="mb-1"/> Import JSON
                    </button>
                    <button onClick={handleWipeSave} className="flex-1 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-red-500">
                        <Trash2 size={16} className="mb-1"/> Wipe Data
                    </button>
                </div>
            </div>

            {/* --- JSON IMPORT OVERLAY --- */}
            {showImport && (
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                    <textarea 
                        value={importText} 
                        onChange={(e) => setImportText(e.target.value)} 
                        placeholder="Paste JSON save data here..." 
                        className="w-full h-32 bg-black/30 text-[10px] font-mono p-2 text-slate-400 border border-slate-700 rounded mb-2"
                    />
                    <button onClick={handleImportJSON} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold text-xs">INJECT STATE</button>
                </div>
            )}

            {/* --- ROW 1: QUICK ACTIONS (VITALS & TIME) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VITALS CONTROL */}
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Zap size={14}/> God Mode Vitals</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setVitals(100)} className="bg-emerald-900/30 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/50 py-2 rounded text-xs font-bold">Fill All</button>
                        <button onClick={() => setVitals(50)} className="bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 py-2 rounded text-xs font-bold">Set 50%</button>
                        <button onClick={() => setVitals(0)} className="bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50 py-2 rounded text-xs font-bold">Drain All</button>
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-mono text-slate-500 px-1">
                        <span>Energy: {data.wellness.energy}%</span>
                        <span>Hydration: {data.wellness.hydration}%</span>
                        <span>Focus: {data.wellness.focus}%</span>
                    </div>
                </div>

                {/* COOLDOWN CONTROL */}
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><RefreshCw size={14}/> Chrono-Trigger</h3>
                    <div className="flex gap-2">
                        <button onClick={resetCooldowns} className="flex-1 bg-amber-900/30 text-amber-500 border border-amber-800 hover:bg-amber-900/50 py-2 rounded text-xs font-bold">
                            Reset Daily & Hourly Timers
                        </button>
                    </div>
                    <div className="mt-3 text-[10px] text-slate-500">
                        <div className="flex justify-between"><span>Last Daily:</span> <span className="font-mono">{new Date(data.lastDailyClaim).toLocaleTimeString()}</span></div>
                        <div className="flex justify-between"><span>Last Hourly:</span> <span className="font-mono">{new Date(data.lastHourlyClaim).toLocaleTimeString()}</span></div>
                    </div>
                </div>
            </div>

            {/* --- ROW 2: ECONOMY ARCHITECT --- */}
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><DollarSign size={14}/> Economy Architect</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Liquid Cash</label>
                        <input type="number" value={data.cash} onChange={(e) => updateNestedData('cash', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"/>
                    </div>
                    <div>
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Brain Matter (BM)</label>
                        <input type="number" value={data.discipline} onChange={(e) => updateNestedData('discipline', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"/>
                    </div>
                    <div>
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Bank Balance</label>
                        <input type="number" value={data.bankBalance} onChange={(e) => updateNestedData('bankBalance', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"/>
                    </div>
                    <div>
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Debt</label>
                        <input type="number" value={data.liabilities.debt} onChange={(e) => updateNestedData('liabilities.debt', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-red-400 font-mono"/>
                    </div>
                    {/* Asset Overrides */}
                    <div><label className="text-[9px] text-slate-500 uppercase font-bold">Real Estate</label><input type="number" value={data.assets.realEstate} onChange={(e) => updateNestedData('assets.realEstate', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-500 font-mono"/></div>
                    <div><label className="text-[9px] text-slate-500 uppercase font-bold">Crypto</label><input type="number" value={data.assets.crypto} onChange={(e) => updateNestedData('assets.crypto', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-500 font-mono"/></div>
                    <div><label className="text-[9px] text-slate-500 uppercase font-bold">Stocks</label><input type="number" value={data.assets.stocks} onChange={(e) => updateNestedData('assets.stocks', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-500 font-mono"/></div>
                    <div><label className="text-[9px] text-slate-500 uppercase font-bold">Metals</label><input type="number" value={data.assets.metals} onChange={(e) => updateNestedData('assets.metals', parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-500 font-mono"/></div>
                </div>
            </div>

            {/* --- ROW 3: SKILL TUNER --- */}
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Skill Level Tuner</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                    {Object.entries(SKILL_DETAILS).map(([key, detail]) => (
                        <div key={key} className="flex flex-col items-center gap-1 bg-black/20 p-2 rounded border border-slate-800 hover:border-slate-600 transition-colors">
                            <RenderIcon name={detail.icon} size={14} className={detail.color} />
                            <span className="text-[9px] text-slate-400 font-bold uppercase">{key}</span>
                            <div className="flex items-center gap-1 w-full">
                                <input 
                                    type="number" 
                                    placeholder={dev_setSkillLevel ? "Lvl" : "N/A"}
                                    className="w-full bg-black border border-slate-700 text-white text-[10px] px-1 py-1 rounded text-center font-mono"
                                    value={skillTargetLevels[key] || ''}
                                    onChange={(e) => setSkillTargetLevels({ ...skillTargetLevels, [key]: e.target.value })}
                                />
                                <button onClick={() => handleSetLevel(key)} className="px-1.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[9px] text-white">Go</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ROW 4: MASTERY REWARD BUILDER --- */}
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 flex flex-col gap-4 flex-1 min-h-[450px]">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mastery Reward Builder</h3>
                    <div className="text-[10px] text-slate-500 flex gap-4">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Custom Reward</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600"></div> Empty Slot</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* LEFT: CONFIG FORM */}
                    <div className="lg:col-span-4 flex flex-col gap-3 bg-black/20 p-4 rounded-xl border border-slate-800 h-fit">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold">Target Skill</label>
                            <select className="bg-black/30 border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-amber-500" value={rewardSkill} onChange={e => setRewardSkill(e.target.value)}>
                                {Object.entries(SKILL_DETAILS).map(([k, d]) => <option key={k} value={k}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                             <label className="text-[10px] text-slate-500 uppercase font-bold">Unlock Level (1-99)</label>
                             <input type="number" min="1" max="99" value={rewardLevel} onChange={e => setRewardLevel(e.target.value)} className="bg-black/30 border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-amber-500" />
                        </div>
                        <div className="w-full h-px bg-slate-800 my-1"></div>
                        <div className="flex flex-col gap-1">
                             <label className="text-[10px] text-slate-500 uppercase font-bold">Reward Type</label>
                             <select className="bg-black/30 border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-amber-500" value={rewardType} onChange={e => setRewardType(e.target.value)}>
                                <option value="Item">Item (Existing ID)</option>
                                <option value="Currency">Currency (Cash)</option>
                                <option value="XP">Bonus XP</option>
                            </select>
                        </div>
                        {rewardType === 'Item' ? (
                            <div className="flex flex-col gap-1">
                                 <label className="text-[10px] text-slate-500 uppercase font-bold">Item ID</label>
                                 <input type="text" placeholder="e.g. b1, p1, d1" value={rewardDetails.id} onChange={e => setRewardDetails({ ...rewardDetails, id: e.target.value })} className="bg-black/30 border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-amber-500" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                 <label className="text-[10px] text-slate-500 uppercase font-bold">Amount</label>
                                 <input type="number" value={rewardDetails.amount} onChange={e => setRewardDetails({ ...rewardDetails, amount: e.target.value })} className="bg-black/30 border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-amber-500" />
                            </div>
                        )}
                        <button onClick={handleSaveReward} className="mt-2 w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded font-bold uppercase tracking-wider text-xs shadow-lg shadow-purple-900/20">
                            Save Configuration
                        </button>
                    </div>

                    {/* RIGHT: MASTERY PATH VISUALIZATION */}
                    <div className="lg:col-span-8 bg-black/40 rounded-xl border border-slate-800 flex flex-col overflow-hidden h-[450px]">
                        <div className="p-3 bg-black/60 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <RenderIcon name={SKILL_DETAILS[rewardSkill].icon} size={16} className={SKILL_DETAILS[rewardSkill].color} />
                                <span className="font-bold text-slate-200 text-xs">Mastery Path: {SKILL_DETAILS[rewardSkill].name}</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                            {Array.from({ length: 99 }, (_, i) => i + 1).map(lvl => {
                                const reward = getVisualReward(rewardSkill, lvl);
                                const isCustom = reward?.source === 'Custom';
                                const isActive = parseInt(rewardLevel) === lvl;

                                return (
                                    <div 
                                        key={lvl} 
                                        onClick={() => setRewardLevel(lvl)}
                                        className={`
                                            flex items-center gap-3 p-2 rounded border transition-all cursor-pointer group
                                            ${isActive ? 'bg-white/10 border-white/30' : 'bg-transparent border-transparent hover:bg-white/5'}
                                            ${isCustom ? 'border-l-2 border-l-purple-500 bg-purple-900/10' : ''}
                                        `}
                                    >
                                        <div className={`
                                            w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold font-mono
                                            ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'}
                                        `}>
                                            {lvl}
                                        </div>
                                        
                                        <div className="flex-1 flex items-center justify-between">
                                            {reward ? (
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-bold ${isCustom ? 'text-purple-300' : 'text-amber-500'}`}>
                                                        {reward.name}
                                                    </span>
                                                    <span className="text-[9px] text-slate-500">
                                                        {reward.type} {reward.amount ? `x${reward.amount}` : ''}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-600 italic group-hover:text-slate-500">Empty Slot</span>
                                            )}

                                            {isCustom && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); dev_setMasteryReward(rewardSkill, lvl, null); }}
                                                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors"
                                                    title="Delete Custom Reward"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ROW 5: ITEM SPAWNER & INVENTORY --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Plus size={14}/> Item Spawner</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <select className="bg-black/30 border border-slate-700 text-white rounded p-2 text-xs flex-1 outline-none focus:border-amber-500" value={selectedItemCat} onChange={e => setSelectedItemCat(e.target.value)}>
                                <option value="boosters">Boosters</option>
                                <option value="gear">Gear</option>
                                <option value="packs">Packs</option>
                                <option value="crates">Crates</option>
                            </select>
                            <input type="number" min="1" max="99" value={spawnQty} onChange={e => setSpawnQty(e.target.value)} className="bg-black/30 border border-slate-700 text-white rounded p-2 w-16 text-center outline-none focus:border-amber-500" />
                        </div>
                        <select className="bg-black/30 border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-amber-500" value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}>
                            <option value="">Select Item...</option>
                            {SHOP_ITEMS[selectedItemCat]?.map(item => (
                                <option key={item.id} value={item.id}>{item.name} ({item.rarity})</option>
                            ))}
                        </select>
                        <button onClick={handleSpawn} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs uppercase py-2 flex items-center justify-center gap-2">
                            Spawn Item
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Trash2 size={14}/> Inventory Manager (Click to Delete)</h3>
                    <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                        {data.inventory.map((item, i) => (
                            <div key={i} onClick={() => item && dev_removeItem(i)} className={`aspect-square border rounded flex items-center justify-center cursor-pointer hover:bg-red-900/50 hover:border-red-500 transition-colors ${item ? 'border-slate-600 bg-black/20' : 'border-slate-800 opacity-20'}`}>
                                {item && <RenderIcon name={item.iconName || 'Package'} size={14} className={getRarityColor(item.rarity)} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- ROW 6: CONTRACT DEBUGGER --- */}
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Briefcase size={14}/> Contract & Achievement Debugger</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {data.achievements.map(ach => (
                        <div key={ach.id} onClick={() => toggleAchievementAction(ach.id, !ach.completed)} className={`flex items-center justify-between p-2 rounded border cursor-pointer select-none transition-all ${ach.completed ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-black/30 border-slate-700 hover:border-slate-500'}`}>
                            <div className="flex flex-col overflow-hidden">
                                <span className={`text-xs font-bold truncate ${ach.completed ? 'text-emerald-400' : 'text-slate-300'}`}>{ach.title}</span>
                                <span className="text-[9px] text-slate-500 truncate">{ach.desc}</span>
                            </div>
                            <div className="pl-2">
                                {ach.completed ? <CheckCircle size={16} className="text-emerald-500"/> : <div className="w-4 h-4 rounded-full border border-slate-600"></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}