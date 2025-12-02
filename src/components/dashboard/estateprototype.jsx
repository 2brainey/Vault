import React, { useState, useMemo } from 'react';

// --- 1. ASSETS & ICONS ---
const Icon = ({ d, size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d={d} />
    </svg>
);

const ICONS = {
    Layout: (props) => <Icon {...props} d="M3 3h18v18H3zM3 9h18M9 21V9" />,
    Home: (props) => <Icon {...props} d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    Hammer: (props) => <Icon {...props} d="m15 12-8.5 8.5c-1.1 1.1-2.5 1.5-3.5.5s-.6-2.4.5-3.5L11 9h7v7z" />,
    Plus: (props) => <Icon {...props} d="M12 5v14M5 12h14" />,
    Maximize: (props) => <Icon {...props} d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />,
    PanelRightClose: (props) => <Icon {...props} d="M18 3v18M12 9l3 3-3 3M3 3h18v18H3z" />,
    X: (props) => <Icon {...props} d="M18 6 6 18M6 6l12 12" />,
    ArrowUpRight: (props) => <Icon {...props} d="M7 7h10v10M7 17 17 7" />,
    Bed: (props) => <Icon {...props} d="M2 19v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M12 13V7M2 9h20" />,
    Utensils: (props) => <Icon {...props} d="M3 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2M12 22v-7" />,
    Bath: (props) => <Icon {...props} d="M9 6 6.5 3.5M3 7v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7" />,
    Wrench: (props) => <Icon {...props} d="M14 14.5V17m-3-3.5L8 10 5.5 7.5a2.12 2.12 0 0 1 3 3L11 14l3 3m7.5-6.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z" />,
    Lock: (props) => <Icon {...props} d="M15 16h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3V7a4 4 0 0 0-8 0v3H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10z" />,
    HelpCircle: (props) => <Icon {...props} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />,
    Map: (props) => <Icon {...props} d="M14.1 6.3a2 2 0 0 0-1.1-1.1c-.8-.2-1.7.3-2 .8L7.8 8.8c-.8 1.4-.4 3.1 1 4L11 15h6v4l4-4 4-4-4-4z" />,
    Car: (props) => <Icon {...props} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />,
    Trophy: (props) => <Icon {...props} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M2 22h20M8 22l1-9h6l1 9" />,
    Zap: (props) => <Icon {...props} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    Star: (props) => <Icon {...props} d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    Camera: (props) => <Icon {...props} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    Grid: (props) => <Icon {...props} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    List: (props) => <Icon {...props} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    ZoomIn: (props) => <Icon {...props} d="M11 5h2M12 12v.01M12 17h.01M17 12h.01M19 12a7 7 0 1 0-7 7 7 7 0 0 0 7-7zM8 8l2 2m4 4 l2 2" />,
    ZoomOut: (props) => <Icon {...props} d="M5 12h14M12 12v.01M12 17h.01M17 12h.01M19 12a7 7 0 1 0-7 7 7 7 0 0 0 7-7z" />,
    Circle: (props) => <Icon {...props} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />,
    Shop: (props) => <Icon {...props} d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />,
    Brain: (props) => <Icon {...props} d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1 2.96-3.08 3 3 0 0 1-.34-5.55 2.5 2.5 0 0 1 .34-4.94 2.5 2.5 0 0 1 2.5-2.5zm5 0a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1 .34 4.94 3 3 0 0 1-.34 5.55 2.5 2.5 0 0 1 2.96 3.08 2.5 2.5 0 0 1-4.96-.44v-15A2.5 2.5 0 0 1 14.5 2z" />,
    Construction: (props) => <Icon {...props} d="M17 11h4V3H3v8h4" />,
    Package: (props) => <Icon {...props} d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />,
    Link: (props) => <Icon {...props} d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeWidth="2.5"/>, 
    Unlink: (props) => <Icon {...props} d="M8.59 13.51l6.83 3.93" strokeWidth="2.5"/>,
    Box: (props) => <Icon {...props} d="M21 7V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2M21 7h-6M10 7H3M12 12h8M12 17h8" />,
    Droplet: (props) => <Icon {...props} d="M12 2.69l5.66 5.66c1.17 1.17 1.17 3.07 0 4.24L12 18.24l-5.66-5.65c-1.17-1.17-1.17-3.07 0-4.24L12 2.69z" />,
    SquareDashed: (props) => <Icon {...props} d="M5 3v18h14V3zM9 3v18M15 3v18M3 9h18M3 15h18" />,
    Image: (props) => <Icon {...props} d="M21 9v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    Trash2: (props) => <Icon {...props} d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />,
    Edit3: (props) => <Icon {...props} d="M12 20h9M16.5 3.5l4 4L7.5 19.5 3 21l1.5-4.5L16.5 3.5z" />
};

const LinkIcon = ({ size=16, className="" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const RenderIcon = ({ name, size = 16, className = "" }) => {
    if (name === 'Link') return <LinkIcon size={size} className={className} />;
    const IconComponent = ICONS[name] || ICONS.HelpCircle;
    return <IconComponent size={size} className={className} />;
};

// --- 2. GAME DATA ---
const PLOT_SQUARE_FOOTAGE = 10000;
const PLOT_COST = 25000;
const PLOT_DIMENSION_M = 100; // 100m x 100m plot
const MAX_GRID_DIMENSION = 10;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;

const EXPANSION_TIERS = [
    { size: 2, cost: 5000, desc: "Expands blueprint to 2x2 plots." }, 
    { size: 3, cost: 20000, desc: "Expands blueprint to 3x3 plots." },
    { size: 4, cost: 50000, desc: "Expands blueprint to 4x4 plots." },
    { size: 5, cost: 100000, desc: "Expands blueprint to 5x5 plots." },
    { size: 6, cost: 200000, desc: "Expands blueprint to 6x6 plots." },
    { size: 7, cost: 350000, desc: "Expands blueprint to 7x7 plots." },
    { size: 8, cost: 600000, desc: "Expands blueprint to 8x8 plots." },
    { size: 9, cost: 900000, desc: "Expands blueprint to 9x9 plots." },
    { size: 10, cost: 1300000, desc: "Expands blueprint to 10x10 plots." },
];

// Modular Rooms 
const MODULAR_ROOMS = [
    { id: 'module_bedroom', name: 'M-Bedroom', cost: 1500, icon: 'Bed', desc: 'Modular resting unit.', type: 'Rest', category: 'Build', sqft: 2000, length: 40, width: 50 },
    { id: 'module_bathroom', name: 'M-Bathroom', cost: 1000, icon: 'Bath', desc: 'Modular hygiene unit.', type: 'Hygiene', category: 'Build', sqft: 60, length: 6, width: 10 }, 
    { id: 'module_kitchen', name: 'M-Kitchen', cost: 3000, icon: 'Utensils', desc: 'Modular sustenance unit.', type: 'Sustenance', category: 'Build', sqft: 2500, length: 50, width: 50 },
    { id: 'module_laundry', name: 'M-Laundry', cost: 1500, icon: 'Box', desc: 'Modular laundry unit.', type: 'Utility', category: 'Build', sqft: 1000, length: 20, width: 50 },
    { id: 'module_living', name: 'M-Living', cost: 3000, icon: 'Home', desc: 'Modular social unit.', type: 'Social', category: 'Build', sqft: 1500, length: 30, width: 50 },
];

// ** CATALOG ITEMS **
const DEFAULT_ITEMS = [
    ...MODULAR_ROOMS,
    { id: 'bathroom_std', name: 'Bathroom (Std)', cost: 2000, icon: 'Bath', desc: 'Basic hygiene. Slightly larger footprint.', type: 'Hygiene', category: 'Build', priority: 2, sqft: 80, length: 8, width: 10 },
    
    { id: 'custom_lab', name: 'Bio-Lab', cost: 20000, icon: 'Droplet', desc: 'High-tech research facility.', type: 'Tech', category: 'Build', priority: 4, sqft: 5000, length: 100, width: 50 },
    
    // -- DEEDS --
    { id: 'plot_deed_special', name: 'Land Deed', cost: PLOT_COST, icon: 'Map', desc: 'Claim an unowned plot.', type: 'Deed', isDeed: true, priority: 0, sqft: PLOT_SQUARE_FOOTAGE, category: 'Deeds' },
    { id: 'd2', name: 'Estate Title', cost: 500000, icon: 'Home', desc: 'Property tax reduction.', skillReq: { skill: 'Equity', level: 10 }, category: 'Deeds' },
    { id: 'd3', name: 'Business License', cost: 2500000, icon: 'Trophy', desc: 'Operate vendor stall.', skillReq: { skill: 'Equity', level: 50 }, category: 'Deeds' },
];

const CATEGORY_COLORS = {
    'Special': { text: 'text-amber-400', border: 'border-amber-700', bg: 'bg-amber-900/50' },
    'Build': { text: 'text-blue-400', border: 'border-blue-700', bg: 'bg-blue-900/50' },
    'Deeds': { text: 'text-orange-400', border: 'border-orange-700', bg: 'bg-orange-900/50' },
    'Assets': { text: 'text-purple-400', border: 'border-purple-700', bg: 'bg-purple-900/50' },
};

const getItemColor = (category) => CATEGORY_COLORS[category] || { text: 'text-slate-400', border: 'border-slate-700', bg: 'bg-slate-900/50' };

// --- 3. SUB-COMPONENTS (DEFINED BEFORE MAIN COMPONENT) ---

const getItemDetails = (shopItems, id) => {
    return shopItems.find(item => item.id === id);
};

const OctagonStatChart = ({ skills }) => {
    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;
    const skillKeys = Object.keys(skills);
    const numPoints = skillKeys.length;
    const angleStep = (Math.PI * 2) / numPoints;

    const getPoint = (index, value, maxVal = 100) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (value / maxVal) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    const pointsString = skillKeys.map((key, i) => {
        const { x, y } = getPoint(i, skills[key]);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner">
            <svg width={size} height={size} className="overflow-visible">
                {[0.25, 0.5, 0.75, 1.0].map(scale => (
                    <polygon key={scale} points={skillKeys.map((_, i) => { const { x, y } = getPoint(i, 100 * scale); return `${x},${y}`; }).join(' ')} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                ))}
                <polygon points={pointsString} fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
                {skillKeys.map((key, i) => {
                    const { x, y } = getPoint(i, 115);
                    return <text key={key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="bold" className="uppercase font-mono">{key.substring(0,3)}</text>;
                })}
            </svg>
            <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Skill Octagon</div>
        </div>
    );
};

// MODALS DEFINED HERE TO AVOID REFERENCE ERRORS
const ItemEditModal = ({ plotIndex, plot, onClose, onRemoveItem }) => {
    const currentUsedSF = plot.sqft || 0;
    const remainingSF = PLOT_SQUARE_FOOTAGE - currentUsedSF;
    
    const handleRemove = (itemRuntimeId) => {
        onRemoveItem(plotIndex, itemRuntimeId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[110] p-4">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-600 w-full max-w-lg">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                    <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2"><RenderIcon name="Edit3" size={20}/> Edit Plot {plotIndex + 1} Contents</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><RenderIcon name="X" size={18}/></button>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono bg-slate-800/50 p-2 rounded">
                        <span className="text-slate-400">Capacity Used:</span>
                        <span className="text-white">{currentUsedSF.toLocaleString()} SF</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono bg-slate-800/50 p-2 rounded">
                        <span className="text-slate-400">Capacity Remaining:</span>
                        <span className="text-emerald-400">{remainingSF.toLocaleString()} SF</span>
                    </div>

                    <h4 className="text-sm font-bold text-white pt-2">Modules Placed ({plot.builtItems.length})</h4>
                    
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                        {plot.builtItems.map((item) => (
                            <div key={item.runtimeId} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-blue-900/50"><RenderIcon name={item.icon} size={16} className="text-blue-300"/></div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{item.name}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">SF: {item.sqft.toLocaleString()} ({item.length}x{item.width} m)</div>
                                    </div>
                                </div>
                                <button onClick={() => handleRemove(item.runtimeId)} className="text-red-400 hover:text-white bg-red-900/30 p-2 rounded-lg transition-colors" title="Remove Module">
                                    <RenderIcon name="Trash2" size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 rounded text-white font-bold">Done Editing</button>
                </div>
            </div>
        </div>
    );
};

const GridSlot = ({ index, state, isSelected, pendingItem, onInteract, onDemolish, gridDim, onMaintain, links, onLink, onDragStart, onDrop }) => {
    const isBuilt = state && typeof state === 'object' && state.type !== 'empty';
    const isOwned = state !== null;
    const isLocked = state === null;
    // Safe access to category for colors
    const itemColors = isBuilt && state.builtItems && state.builtItems.length > 0 
        ? getItemColor(state.builtItems[0].category) 
        : { text: 'text-slate-400', border: 'border-slate-700' };
        
    const baseStyle = "relative flex flex-col items-center justify-center transition-all cursor-pointer group overflow-visible aspect-square select-none";
    
    const hasRightLink = links && links.includes('right');
    const hasBottomLink = links && links.includes('bottom');
    
    let borderClass = `border-t-2 border-l-2 ${hasRightLink ? 'border-r-0' : 'border-r-2'} ${hasBottomLink ? 'border-b-0' : 'border-b-2'}`;
    
    let statusStyle = isLocked ? `bg-emerald-900/30 border-slate-700/50 border-dashed rounded-md` : `bg-emerald-900/30 border-emerald-500/30 rounded-sm`;
    if (isBuilt) statusStyle = `bg-emerald-900/30 ${itemColors.border} shadow-lg z-10 rounded-sm`;
    
    if (isLocked) borderClass = "border-2 border-dashed border-slate-700/50 rounded-md";
    
    const selectionStyle = isSelected ? "ring-2 ring-amber-500 z-30" : "";
    
    const canDrop = isOwned && !isBuilt && !pendingItem;
    const r = Math.floor(index / gridDim);
    const c = index % gridDim;
    const idxRight = (c < gridDim - 1) ? index + 1 : -1;
    const idxDown = (r < gridDim - 1) ? index + gridDim : -1;
    
    const builtItems = state && state.builtItems ? state.builtItems : [];

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); onInteract(index); }} 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, index)}
            onDragStart={(e) => onDragStart(e, index)}
            draggable={isBuilt}
            className={`${baseStyle} ${statusStyle} ${borderClass} ${selectionStyle} ${isBuilt ? 'cursor-move' : ''} ${canDrop ? 'hover:bg-yellow-900/30' : ''}`}
        >
            {isOwned && (
                 <div className="absolute inset-0 z-10" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, index)}></div>
            )}
            {isBuilt && (
                <div className="absolute inset-0 cursor-grab z-30" draggable onDragStart={(e) => onDragStart(e, index)}></div>
            )}

            {isSelected && isOwned && (
                <>
                    {idxRight !== -1 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onLink(index, 'right'); }}
                            className={`absolute -right-3 top-1/2 -translate-y-1/2 z-50 p-1 rounded-full shadow-lg border border-slate-600 transition-all hover:scale-110 ${hasRightLink ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
                            title={hasRightLink ? "Unlink" : "Link Right"}
                        >
                            <RenderIcon name="Link" size={10} />
                        </button>
                    )}
                    {idxDown !== -1 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onLink(index, 'bottom'); }}
                            className={`absolute -bottom-3 left-1/2 -translate-x-1/2 z-50 p-1 rounded-full shadow-lg border border-slate-600 transition-all hover:scale-110 ${hasBottomLink ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
                            title={hasBottomLink ? "Unlink" : "Link Down"}
                        >
                            <RenderIcon name="Link" size={10} className="rotate-90" />
                        </button>
                    )}
                </>
            )}

            {isBuilt ? (
                <>
                    {builtItems.map((module, moduleIndex) => (
                        <div 
                            key={module.runtimeId} 
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden rounded-[2px] pointer-events-none bg-white/5 border border-dashed border-white/20`}
                            style={{
                                width: `${(module.width / PLOT_DIMENSION_M) * 100}%`,
                                height: `${(module.length / PLOT_DIMENSION_M) * 100}%`,
                                transform: `translate(-50%, -50%) translate(${moduleIndex * 2}px, ${moduleIndex * 2}px)`,
                                zIndex: 30 + moduleIndex
                            }}
                            title={`${module.name} (${module.sqft} sq ft)`}
                        >
                            <div className="flex flex-col items-center justify-center text-center p-1">
                                <div className={`p-0.5 rounded-full bg-black/50 ${itemColors.text}`}><RenderIcon name={module.icon} size={10} /></div>
                                <div className="text-[6px] font-mono text-white leading-none mt-0.5">{module.name}</div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="absolute bottom-1 w-3/4 h-1 bg-black/50 rounded-full overflow-hidden z-40">
                        <div className="h-full bg-emerald-500" style={{ width: `${(state.sqft / PLOT_SQUARE_FOOTAGE) * 100}%` }}></div>
                    </div>
                    
                    <button onClick={(e) => { e.stopPropagation(); onMaintain(index); }} className="absolute bottom-0.5 left-0.5 text-slate-400 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full p-0.5 z-50 pointer-events-auto"><RenderIcon name="Wrench" size={10} /></button>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDemolish(index); }} 
                        className="absolute top-0.5 right-0.5 text-slate-500 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full p-0.5 z-50 pointer-events-auto"
                        title="Edit Plot Items"
                    >
                        <RenderIcon name="Edit3" size={10} />
                    </button>
                </>
            ) : isOwned ? (
                <div className={`flex flex-col items-center ${pendingItem && !pendingItem.isDeed ? 'text-emerald-400' : 'text-emerald-500/50 group-hover:text-emerald-400'}`}>
                    {pendingItem && !pendingItem.isDeed ? <RenderIcon name="Hammer" size={14} /> : <RenderIcon name="Plus" size={14} />}
                    <span className="text-[8px] mt-1 font-mono text-emerald-600/70">{PLOT_SQUARE_FOOTAGE} SF</span>
                </div>
            ) : (
                <div className="flex flex-col items-center text-slate-500 transition-colors opacity-60">
                    <RenderIcon name="Lock" size={16} className="mb-1 text-slate-600"/>
                    <span className="text-[8px] font-mono uppercase font-bold text-slate-400">Locked</span>
                    <span className="text-[8px] font-mono text-amber-500">{Math.floor(PLOT_COST/1000)}k BM</span>
                </div>
            )}
        </div>
    );
};

const CustomModal = ({ modal, closeModal }) => {
    if (!modal.isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4 animate-in">
            <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-amber-400">{modal.title}</h3>
                    <button onClick={closeModal} className="text-slate-500 hover:text-white"><RenderIcon name="X" size={18}/></button>
                </div>
                <p className="text-sm text-slate-300 mb-6">{modal.message}</p>
                <div className={`flex ${modal.isConfirm ? 'justify-between' : 'justify-end'} gap-3`}>
                    {modal.isConfirm && <button onClick={closeModal} className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white">Cancel</button>}
                    <button onClick={modal.onConfirm || closeModal} className={`px-4 py-2 text-sm font-semibold rounded-lg text-white ${modal.isConfirm ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}>{modal.isConfirm ? 'Confirm' : 'OK'}</button>
                </div>
            </div>
        </div>
    );
};

const PlotPurchaseModal = ({ plotIndex, closeModal, buyPlot, discipline, PLOT_SQUARE_FOOTAGE, PLOT_COST }) => {
    const [priceFactor, setPriceFactor] = useState(1.0);
    const BASE_PRICE = PLOT_COST;
    const ADJ_PRICE = Math.floor(BASE_PRICE * priceFactor);
    const canAfford = discipline >= ADJ_PRICE;
    const priceFactorPercentage = (priceFactor * 100).toFixed(0);

    const handleBuy = () => {
        buyPlot(plotIndex, ADJ_PRICE); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4 animate-in">
            <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                    <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2"><RenderIcon name="Map" size={20}/> Plot {plotIndex + 1}: Land Acquisition</h3>
                    <button onClick={closeModal} className="text-slate-500 hover:text-white"><RenderIcon name="X" size={18}/></button>
                </div>
                <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Plot Details</h4>
                        <div className="space-y-1 text-sm font-mono">
                            <div className="flex justify-between"><span>Location:</span><span className="text-white">Grid Index {plotIndex}</span></div>
                            <div className="flex justify-between"><span>Size:</span><span className="text-emerald-400">{PLOT_SQUARE_FOOTAGE.toLocaleString()} SF</span></div>
                            <div className="flex justify-between"><span>Base Price:</span><span className="text-amber-400">{BASE_PRICE.toLocaleString()} BM</span></div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-bold uppercase text-amber-400 mb-2 flex items-center gap-2"><RenderIcon name="Wrench" size={14}/> Price Adjustment Factor</h4>
                        <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Current Factor:</span><span className="font-bold text-white">{priceFactorPercentage}%</span></div>
                        <input type="range" min="0.8" max="1.2" step="0.01" value={priceFactor} onChange={(e) => setPriceFactor(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        <p className="text-xs text-slate-500 mt-2">Simulated market volatility affecting price.</p>
                    </div>
                    <div className={`p-4 rounded-lg border border-b-4 ${canAfford ? 'bg-emerald-900/50 border-emerald-500' : 'bg-red-900/50 border-red-500'}`}>
                        <div className="flex justify-between items-center mb-4"><span className="text-lg font-bold">Adjusted Price:</span><span className={`text-2xl font-mono font-bold ${canAfford ? 'text-emerald-300' : 'text-red-300'}`}>{ADJ_PRICE.toLocaleString()} BM</span></div>
                        <button onClick={handleBuy} disabled={!canAfford} className={`w-full py-3 rounded-lg text-lg font-bold uppercase transition-all ${canAfford ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/30' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}>{canAfford ? 'Acquire Deed' : `Insufficient BM`}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ItemPropertyModal = ({ item, onSave, onClose, onDelete }) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    
    const [price, setPrice] = useState(item.cost || 0);
    const [length, setLength] = useState(item.length || 10);
    const [width, setWidth] = useState(item.width || 10);
    const [name, setName] = useState(item.name || "");
    const [icon, setIcon] = useState(item.icon || "Image");

    const currentSqft = length * width;
    
    const handleLengthChange = (e) => setLength(Number(e.target.value));
    const handleWidthChange = (e) => setWidth(Number(e.target.value));

    const handleSave = () => {
        const category = item.category || 'Build';
        const type = item.type || (category === 'Deeds' ? 'Deed' : 'Room');

        onSave(item.id, {
            name, 
            cost: price,
            sqft: currentSqft,
            length,
            width,
            icon,
            category,
            type,
            desc: item.desc || 'Custom defined item.',
            isExpansion: item.isExpansion, 
            isDeed: item.isDeed,
        });
    };
    
    const handleDelete = () => {
        onDelete(item.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[110] p-4">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-600 w-full max-w-md">
                <h3 className="text-lg font-bold text-amber-400 mb-4">Edit/Add Item Properties</h3>
                <div className="space-y-4">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item Name" className="w-full bg-black/50 border border-slate-700 rounded p-2 text-white font-medium" />
                    <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Icon Name (e.g., Bed, Lock)" className="w-full bg-black/50 border border-slate-700 rounded p-2 text-white font-mono" />
                    
                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        <label className="text-sm text-slate-400 font-bold">Cost (BM):</label>
                        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-24 bg-black/50 border border-slate-700 rounded p-1 text-white font-mono text-right" min="0" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <label className="text-xs text-slate-400 font-bold block mb-1">Length (m):</label>
                            <input type="number" value={length} onChange={handleLengthChange} className="w-full bg-black/50 border border-slate-700 rounded p-1 text-white font-mono" min="1" />
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <label className="text-xs text-slate-400 font-bold block mb-1">Width (m):</label>
                            <input type="number" value={width} onChange={handleWidthChange} className="w-full bg-black/50 border border-slate-700 rounded p-1 text-white font-mono" min="1" />
                        </div>
                    </div>
                    
                    <div className="p-3 bg-blue-900/50 rounded-lg border border-blue-700 text-sm flex justify-between font-mono">
                        <span className="text-blue-200">Calculated Square Footage:</span>
                        <span className="font-bold text-white">{currentSqft.toLocaleString()} SF</span>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
                    {!isConfirmingDelete ? (
                        <button onClick={() => setIsConfirmingDelete(true)} className="px-4 py-2 text-sm font-bold rounded-lg text-red-400 hover:bg-red-900/50 transition-colors flex items-center gap-2">
                            <RenderIcon name="Trash2" size={16}/> Delete Item
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-red-300">CONFIRM?</span>
                            <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">YES</button>
                            <button onClick={() => setIsConfirmingDelete(false)} className="px-3 py-1 bg-slate-600 text-white rounded-lg text-xs">NO</button>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 bg-slate-700 rounded text-white">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded text-white font-bold">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddItemModal = ({ onSave, onClose }) => {
    const [newItem, setNewItem] = useState({
        id: 'new_item_' + Date.now(),
        name: 'New Custom Item',
        cost: 1000,
        icon: 'Image',
        desc: 'Custom Item for Blueprint',
        category: 'Build',
        type: 'Room',
        length: 20,
        width: 20,
        sqft: 400
    });
    const [sqft, setSqft] = useState(400);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleDimensionChange = (name, value) => {
        value = Number(value) || 0;
        setNewItem(prev => {
            const newDim = { ...prev, [name]: value };
            const newSqft = newDim.length * newDim.width;
            setSqft(newSqft);
            return { ...newDim, sqft: newSqft };
        });
    };

    const handleSave = () => {
        onSave(newItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[110] p-4">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-600 w-full max-w-md">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><RenderIcon name="Plus" size={20}/> Add New Catalog Item</h3>
                <div className="space-y-4">
                    <input type="text" name="name" value={newItem.name} onChange={handleChange} placeholder="Item Name" className="w-full bg-black/50 border border-slate-700 rounded p-2 text-white font-medium" />
                    <input type="text" name="icon" value={newItem.icon} onChange={handleChange} placeholder="Icon Name (e.g., Bed, Lock)" className="w-full bg-black/50 border border-slate-700 rounded p-2 text-white font-mono" />
                    <input type="text" name="desc" value={newItem.desc} onChange={handleChange} placeholder="Description" className="w-full bg-black/50 border border-slate-700 rounded p-2 text-white font-mono" />

                    <div className="grid grid-cols-2 gap-4">
                        <select name="category" value={newItem.category} onChange={handleChange} className="w-full bg-black/50 border border-slate-700 rounded p-2 text-white">
                            <option value="Build">Build (Room/Upgrade)</option>
                            <option value="Deeds">Deeds (Title)</option>
                            <option value="Assets">Assets (Non-Plottable)</option>
                        </select>
                        <input type="number" name="cost" value={newItem.cost} onChange={handleChange} placeholder="Cost (BM)" className="w-full bg-black/50 border border-slate-700 rounded p-2 text-white font-mono" min="0" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        <div>
                            <label className="text-xs text-slate-400 font-bold block mb-1">Length (m):</label>
                            <input type="number" value={newItem.length} onChange={(e) => handleDimensionChange('length', e.target.value)} className="w-full bg-black/50 border border-slate-700 rounded p-1 text-white font-mono" min="1" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold block mb-1">Width (m):</label>
                            <input type="number" value={newItem.width} onChange={(e) => handleDimensionChange('width', e.target.value)} className="w-full bg-black/50 border border-slate-700 rounded p-1 text-white font-mono" min="1" />
                        </div>
                        <div className="p-1">
                            <label className="text-xs text-slate-400 font-bold block mb-1">SF:</label>
                            <div className="text-sm font-bold text-white mt-1">{sqft.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-700 rounded text-white">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 rounded text-white font-bold">Add to Catalog</button>
                </div>
            </div>
        </div>
    );
};

// --- 4. MAIN ESTATE COMPONENT ---
// UPDATED: Accept props for discipline and salvage directly
const EstatePrototype = ({ discipline, setDiscipline, salvage, setSalvage }) => {
    // REMOVED: const [discipline, setDiscipline] = useState(150000);
    // REMOVED: const [salvage, setSalvage] = useState(15);
    const [gridDimension, setGridDimension] = useState(1);
    
    const [grid, setGrid] = useState(() => {
        const initial = new Array(1 * 1).fill(null);
        initial[0] = { type: 'empty', links: [] };
        return initial;
    });

    const [shopItems, setShopItems] = useState(DEFAULT_ITEMS);
    const [userSkills] = useState({ Engineering: 45, Influence: 20, Liquidity: 60, Equity: 15, Vitality: 30, Intellect: 50, Security: 10, Willpower: 25 });
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [pendingBuildItem, setPendingBuildItem] = useState(null);
    const [isShopOpen, setShopOpen] = useState(true);
    const [shopTab, setShopTab] = useState('build');
    const [sidebarView, setSidebarView] = useState('market');
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, message: '', isConfirm: false, onConfirm: null, title: '' });
    const [plotAcquisitionData, setPlotAcquisitionData] = useState(null);
    const [propertyEditData, setPropertyEditData] = useState(null); 
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [plotContentEditData, setPlotContentEditData] = useState(null); 
    
    const handleWheel = (e) => {
        if (e.target.closest('.shop-sidebar') || e.target.closest('.header-bar')) return;
        e.preventDefault();
        const direction = e.deltaY > 0 ? -1 : 1;
        setZoomLevel(prev => {
            const newZoom = parseFloat((prev + direction * ZOOM_STEP).toFixed(1));
            return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
        });
    };

    const handleMouseDown = (e) => {
        const isCanvasBackground = e.target.closest('.grid-container') || e.target.id === 'canvas-wrapper';
        if(isCanvasBackground) setIsPanning(true);
    };

    const handleMouseMove = (e) => {
        if (!isPanning) return;
        setPanOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    };

    const handleMouseUp = () => setIsPanning(false);
    
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("text/plain", index);
        setDraggedItemIndex(index);
        e.currentTarget.style.opacity = '0.5';
    };
    
    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = draggedItemIndex;
        const newGrid = [...grid];
        const itemToMove = newGrid[sourceIndex];
        e.currentTarget.style.opacity = '1'; 
        if (sourceIndex === targetIndex) return;
        const targetPlot = newGrid[targetIndex];
        if (targetPlot && targetPlot.type === 'empty') {
            newGrid[targetIndex] = { ...itemToMove, links: targetPlot.links || [] };
            newGrid[sourceIndex] = { type: 'empty', links: itemToMove.links || [] }; 
            setGrid(newGrid);
            setSelectedSlot(null);
        } else if (targetPlot && targetPlot.type === 'built') {
            showMessage("Cannot move entire plot to an occupied building plot.", "Placement Failed");
        }
        setDraggedItemIndex(null);
    };

    const handleZoomBtn = (direction) => {
        setZoomLevel(prev => {
            const newZoom = parseFloat((prev + direction * ZOOM_STEP).toFixed(1));
            return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
        });
    };
    const handleZoomReset = () => { setZoomLevel(1.0); setPanOffset({x:0,y:0}); };

    const closeModal = () => setModal({ isOpen: false, message: '', isConfirm: false, onConfirm: null, title: '' });
    const showMessage = (message, title = "Notification") => setModal({ isOpen: true, message, isConfirm: false, onConfirm: closeModal, title });
    
    const handleMaintain = (index) => {
        const salvageGain = Math.floor(Math.random() * 3) + 1;
        setSalvage(salvage + salvageGain); // UPDATED to use prop setter
        showMessage(`Maintained plot ${index + 1}! Gained ${salvageGain} Salvage.`, "Maintenance Complete");
    };
    
    const openPlotContentEditor = (index) => {
        const plot = grid[index];
        if (plot && plot.builtItems && plot.builtItems.length > 0) {
            setPlotContentEditData({ plotIndex: index, plot });
        } else {
            showMessage("This plot has no built modules to edit.", "No Modules Found");
        }
    };

    const removeModuleFromPlot = (plotIndex, itemRuntimeId) => {
        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            const plot = { ...newGrid[plotIndex] };
            if (!plot || !plot.builtItems) return prevGrid;
            const itemToRemove = plot.builtItems.find(item => item.runtimeId === itemRuntimeId);
            if (!itemToRemove) return prevGrid;
            plot.builtItems = plot.builtItems.filter(item => item.runtimeId !== itemRuntimeId);
            plot.sqft = plot.builtItems.reduce((sum, item) => sum + (item.sqft || 0), 0);
            if (plot.sqft === 0) {
                newGrid[plotIndex] = { type: 'empty', links: plot.links };
            } else {
                newGrid[plotIndex] = plot;
            }
            setPlotContentEditData({ plotIndex, plot: newGrid[plotIndex] });
            showMessage(`Removed ${itemToRemove.name}. Capacity recovered.`, "Module Removed");
            return newGrid;
        });
    };
    
    const nextExpansionTier = EXPANSION_TIERS.find(t => t.size === gridDimension + 1);

    const expandGrid = (item) => {
        if (!nextExpansionTier) { showMessage(`Maximum Estate size reached! (${MAX_GRID_DIMENSION}x${MAX_GRID_DIMENSION})`, "Expansion Failed"); return; }
        if (discipline < nextExpansionTier.cost) { showMessage(`Insufficient Brain Matter! Requires ${nextExpansionTier.cost.toLocaleString()} BM.`, "Transaction Failed"); return; }
        const oldDim = gridDimension;
        const newDim = nextExpansionTier.size;
        const newGrid = new Array(newDim * newDim).fill(null);
        for(let oldIndex = 0; oldIndex < grid.length; oldIndex++) {
            const row = Math.floor(oldIndex / oldDim); 
            const col = oldIndex % oldDim; 
            const newIndex = (row * newDim) + col;
            if (newIndex < newGrid.length) newGrid[newIndex] = grid[oldIndex];
        }
        setGrid(newGrid);
        setGridDimension(newDim);
        setDiscipline(discipline - nextExpansionTier.cost);
        showMessage(`Estate expanded to ${newDim}x${newDim} successfully.`, "Expansion Complete");
    };

    const handleLinkPlot = (index, direction) => {
        const newGrid = [...grid];
        const r = Math.floor(index / gridDimension);
        const c = index % gridDimension;
        let neighborIndex = -1;
        if (direction === 'right') neighborIndex = index + 1;
        else if (direction === 'bottom') neighborIndex = index + gridDimension;
        if (neighborIndex === -1 || !newGrid[neighborIndex]) return;
        if (newGrid[index] === null || newGrid[neighborIndex] === null) return;
        const currentCell = { ...newGrid[index] };
        const currentLinks = currentCell.links || [];
        if (currentLinks.includes(direction)) currentCell.links = currentLinks.filter(l => l !== direction);
        else currentCell.links = [...currentLinks, direction];
        newGrid[index] = currentCell;
        setGrid(newGrid);
    };

    const handleSelectShopItem = (item) => {
        if (discipline < item.cost) { showMessage("Insufficient Brain Matter!", "Failed"); return; }
        if (item.id === 'blueprint_expansion') { expandGrid(item); setPendingBuildItem(null); return; }
        if (item.category === 'Build' || item.category === 'Deeds') { setPendingBuildItem(item); setShopOpen(false); return; }
        setDiscipline(discipline - item.cost);
        showMessage(`Purchased ${item.name}! Check inventory.`, "Success");
    };

    const buyPlot = (index, cost = PLOT_COST) => {
        if (discipline < cost) { showMessage("Insufficient Brain Matter!", "Failed"); return; }
        const newGrid = [...grid];
        newGrid[index] = { type: 'empty', links: [] }; 
        setGrid(newGrid);
        setDiscipline(discipline - cost);
        setPendingBuildItem(null);
        setSelectedSlot(null);
        setPlotAcquisitionData(null);
        showMessage("Plot claimed successfully!", "Land Acquired");
    };

    const finalizeBuild = (index, item) => {
        let currentItem = grid[index] || { type: 'empty', sqft: 0, links: [], builtItems: [] };
        let currentUsedSF = currentItem.sqft || 0; 
        const newTotalSF = currentUsedSF + (item.sqft || 0);
        if (newTotalSF > PLOT_SQUARE_FOOTAGE) { showMessage(`Item footprint (${item.sqft} SF) exceeds remaining plot capacity (${PLOT_SQUARE_FOOTAGE - currentUsedSF} SF).`, "Construction Failed"); return; }
        const newGrid = [...grid];
        const existingLinks = currentItem.links || [];
        const builtItems = currentItem.builtItems || [];
        const newItemInstance = { ...item, runtimeId: Date.now() + Math.random(), placement: 'centered' };
        newGrid[index] = { type: 'built', sqft: newTotalSF, links: existingLinks, builtAt: currentItem.builtAt || Date.now(), builtItems: [...builtItems, newItemInstance], };
        setGrid(newGrid);
        setDiscipline(discipline - item.cost);
        setPendingBuildItem(null);
        setSelectedSlot(null);
        showMessage(`${item.name} placed! Total SF: ${newTotalSF.toLocaleString()}`, "Construction Complete");
    };

    const handleSlotInteraction = (index) => {
        if (draggedItemIndex !== null) return;
        const plot = grid[index];
        if (plot === null) { 
            if (pendingBuildItem?.isDeed) buyPlot(index);
            else {
                const deedItem = shopItems.find(item => item.id === 'plot_deed_special');
                if (deedItem) setPlotAcquisitionData({ index, deedItem });
            }
        } else if (plot.type === 'empty') { 
            if (pendingBuildItem && !pendingBuildItem.isDeed) finalizeBuild(index, pendingBuildItem);
            else setSelectedSlot(selectedSlot === index ? null : index);
        } else if (plot.type === 'built') {
            if (pendingBuildItem && !pendingBuildItem.isDeed) finalizeBuild(index, pendingBuildItem);
            else { openPlotContentEditor(index); setSelectedSlot(null); }
        }
    };
    
    const handleItemPropertySave = (id, updatedProperties) => {
        setShopItems(prev => prev.map(i => i.id === id ? { ...i, ...updatedProperties } : i));
        setPropertyEditData(null);
    };
    
    const handleItemDelete = (id) => {
        setShopItems(prev => prev.filter(i => i.id !== id));
        setPropertyEditData(null);
        showMessage(`Item ID: ${id} successfully deleted from the catalog.`, "Deletion Complete");
    }

    const handleAddItem = (newItem) => {
        const finalItem = { ...newItem, id: newItem.id.replace(/\s/g, '_'), sqft: newItem.length * newItem.width, runtimeId: Date.now() };
        setShopItems(prev => [...prev, finalItem]);
        showMessage(`New item '${finalItem.name}' added to the catalog!`, "Catalog Updated");
        setIsAddItemModalOpen(false);
    };
    
    const unifiedShopItems = useMemo(() => {
        let items = shopItems;
        if (shopTab === 'build') items = items.filter(i => i.category === 'Build');
        else if (shopTab === 'deeds') items = items.filter(i => i.category === 'Deeds');
        else if (shopTab === 'expansion') items = nextExpansionTier ? [{ id: 'blueprint_expansion', name: `Expand to ${nextExpansionTier.size}x${nextExpansionTier.size}`, cost: nextExpansionTier.cost, icon: 'Maximize', desc: nextExpansionTier.desc, type: 'Special', isExpansion: true, priority: 0, category: 'Expansion', isOwned: false, count: 0 }] : [];
        else items = [];
        
        const roomCounts = grid.reduce((acc, room) => {
            if (room && room.builtItems) { room.builtItems.forEach(item => { acc[item.id] = (acc[item.id] || 0) + 1; }); }
            return acc;
        }, {});

        return items.map(item => {
            const count = item.category === 'Build' ? (roomCounts[item.id] || 0) : 0;
            return { ...item, isOwned: count > 0, count: count, bonus: item.desc };
        }).sort((a, b) => (a.cost || 0) - (b.cost || 0));
    }, [grid, shopTab, shopItems, nextExpansionTier]);

    const calculatedStats = useMemo(() => {
        let totalSqFt = 0;
        grid.forEach(p => { if (p && p.sqft) totalSqFt += p.sqft; });
        return { totalSqFt, totalOwnedPlots: grid.filter(p => p !== null).length };
    }, [grid]);

    return (
        <div className="h-screen flex flex-col bg-[#0f1219] text-white font-sans overflow-hidden">
            {/* Header */}
            <header className="header-bar shrink-0 p-4 flex justify-between items-center bg-[#1a1a1a] border-b border-slate-700 z-50">
                <div className="flex items-center gap-2">
                    <RenderIcon name="Home" className="text-blue-500" size={24}/>
                    <h1 className="text-xl font-bold">Vault Estate <span className='text-slate-400 text-sm'>Sandbox</span></h1>
                </div>
                <div className="flex items-center gap-4 bg-black/30 px-4 py-2 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2"><RenderIcon name="Brain" size={16} className="text-pink-400"/><span className="font-mono text-emerald-400 font-bold">{discipline.toLocaleString()} BM</span></div>
                    <div className="flex items-center gap-2"><RenderIcon name="Wrench" size={16} className="text-slate-400"/><span className="font-mono text-slate-300">{salvage} Salvage</span></div>
                </div>
            </header>

            <div id="canvas-wrapper" className="flex-1 flex overflow-hidden relative" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}>
                {/* Main Canvas */}
                <div className={`w-full h-full bg-[#1a202c] relative overflow-hidden flex flex-col transition-colors duration-300 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`} id="blueprint-canvas">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#404e6d 1px, transparent 1px), linear-gradient(90deg, #404e6d 1px, transparent 1px)', backgroundSize: '10px 10px', transform: `translate(${panOffset.x % 10}px, ${panOffset.y % 10}px)` }}></div>
                    
                    {/* Controls Overlay */}
                    <div className="absolute top-6 left-6 z-20 pointer-events-none">
                        <div className="pointer-events-auto">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 drop-shadow-md"><RenderIcon name="Layout" className="text-blue-400"/> Blueprint</h2>
                            {pendingBuildItem && <span className="text-amber-400 text-sm font-bold bg-black/60 px-2 py-1 rounded flex items-center gap-2 mt-1 animate-pulse border border-amber-500/50"><RenderIcon name="Hammer" size={12}/> Place {pendingBuildItem.name}</span>}
                        </div>
                    </div>
                    
                    <div className="absolute top-6 right-6 z-20 pointer-events-auto flex gap-2">
                        <button onClick={() => handleZoomBtn(-1)} disabled={zoomLevel <= MIN_ZOOM} className="p-2 bg-black/60 border border-slate-600 rounded hover:bg-slate-700 disabled:opacity-30"><RenderIcon name="ZoomOut"/></button>
                        <button onClick={handleZoomReset} className="p-2 bg-black/60 border border-slate-600 rounded hover:bg-slate-700 font-mono text-xs text-white">{(zoomLevel*100).toFixed(0)}%</button>
                        <button onClick={() => handleZoomBtn(1)} disabled={zoomLevel >= MAX_ZOOM} className="p-2 bg-black/60 border border-slate-600 rounded hover:bg-slate-700 disabled:opacity-30"><RenderIcon name="ZoomIn"/></button>
                    </div>

                    {/* Grid Container */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none grid-container">
                        <div className="pointer-events-auto transition-transform duration-75 ease-out origin-center" style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})` }}>
                            <div className="grid gap-0 bg-black/20 rounded-md border-4 border-slate-700 shadow-2xl p-4" style={{ gridTemplateColumns: `repeat(${gridDimension}, minmax(0, 1fr))`, width: '500px', aspectRatio: '1/1', }}>
                                {grid.map((plot, i) => (
                                    <GridSlot key={i} index={i} state={plot} isSelected={selectedSlot === i} pendingItem={pendingBuildItem} onInteract={handleSlotInteraction} onDemolish={openPlotContentEditor} gridDim={gridDimension} onMaintain={handleMaintain} links={plot ? plot.links : []} onLink={handleLinkPlot} onDragStart={handleDragStart} onDrop={handleDrop} />
                                ))}
                            </div>
                            
                            {/* Physical Shop Building */}
                            <div onClick={() => setShopOpen(!isShopOpen)} className={`absolute -right-40 top-0 w-32 h-32 bg-slate-800 border-4 ${isShopOpen ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'border-slate-600 shadow-xl'} rounded-xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all group pointer-events-auto`}>
                                <RenderIcon name="Shop" size={40} className={`${isShopOpen ? 'text-amber-400' : 'text-slate-400'} mb-2`} />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Market</span>
                                <div className="mt-2 text-[8px] bg-black/50 px-2 py-0.5 rounded text-emerald-400">OPEN</div>
                            </div>
                        </div>
                    </div>

                    {pendingBuildItem && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                            <button onClick={() => setPendingBuildItem(null)} className="px-6 py-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-full border border-slate-600 shadow-2xl font-bold flex items-center gap-2 backdrop-blur-md">
                                <RenderIcon name="X" size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className={`shop-sidebar absolute top-0 right-0 bottom-0 z-30 flex flex-col bg-[#1e1e1e] border-l border-slate-700 shadow-2xl transition-all duration-300 w-[400px] ${isShopOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-slate-700 bg-[#131313] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2"><RenderIcon name="Shop" className="text-amber-500"/> Agency Market</h3>
                            <button onClick={() => setShopOpen(false)} className="text-slate-400 hover:text-white"><RenderIcon name="PanelRightClose"/></button>
                        </div>
                        <div className="flex bg-black/30 p-1 rounded-lg">
                            <button onClick={() => setSidebarView('market')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${sidebarView === 'market' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>Catalog</button>
                            <button onClick={() => setSidebarView('stats')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${sidebarView === 'stats' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>Stats</button>
                        </div>
                        {sidebarView === 'market' && (
                            <div className="flex flex-col gap-3 pt-3">
                                <div className="flex gap-1 overflow-x-auto pb-1">
                                    <button onClick={() => setShopTab('build')} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${shopTab === 'build' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Build (Rooms)</button>
                                    <button onClick={() => setShopTab('deeds')} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${shopTab === 'deeds' ? 'bg-orange-900/50 border-orange-500 text-orange-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Deeds (Land)</button>
                                    <button onClick={() => setShopTab('expansion')} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${shopTab === 'expansion' ? 'bg-amber-900/50 border-amber-500 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Expansion</button>
                                </div>
                                
                                <button onClick={() => setIsAddItemModalOpen(true)} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors">
                                    <RenderIcon name="Plus" size={16}/> Add Item to Catalog
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {sidebarView === 'market' ? unifiedShopItems.map(item => {
                            const itemColors = getItemColor(item.category === 'Deeds' ? 'Deed' : 'Build'); 
                            const actionDisabled = discipline < item.cost || (item.isExpansion && gridDimension >= MAX_GRID_DIMENSION);
                            
                            return (
                                <div 
                                    key={item.id} 
                                    onDoubleClick={() => {
                                        const realItem = getItemDetails(shopItems, item.id);
                                        if (realItem) setPropertyEditData(realItem);
                                    }}
                                    className={`flex items-center p-3 rounded-xl border transition-all shadow-md bg-slate-900/50 ${itemColors.border} group select-none`}
                                    title="Double-click to edit price/size"
                                >
                                    <div className={`p-2 rounded-lg ${itemColors.text} ${itemColors.bg} mr-3 border ${itemColors.border}`}><RenderIcon name={item.icon} size={18}/></div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="text-sm font-bold text-white truncate">{item.name}</div>
                                        <div className="text-xs text-slate-400 font-mono">{item.desc}</div>
                                        {item.sqft && <div className="text-[10px] text-emerald-500 font-mono mt-0.5">{item.sqft.toLocaleString()} sq ft</div>}
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                        <span className={`text-[11px] font-mono font-bold ${actionDisabled ? 'text-slate-500' : itemColors.text}`}>{item.cost.toLocaleString()} BM</span>
                                        <button onClick={() => handleSelectShopItem(item)} disabled={actionDisabled} className={`mt-1 px-2 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${actionDisabled ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                                            {item.isExpansion ? 'Expand' : item.isDeed ? 'Buy' : 'Select'}
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="space-y-6">
                                <OctagonStatChart skills={userSkills} />
                                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-slate-700">
                                    <h4 className="text-sm font-bold uppercase text-blue-500 mb-2 border-b border-slate-800 pb-2">Space Utilization</h4>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Total Sq Ft</span>
                                        <span className="text-emerald-400">{calculatedStats.totalSqFt.toLocaleString()} / {(calculatedStats.totalOwnedPlots * PLOT_SQUARE_FOOTAGE).toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (calculatedStats.totalSqFt / (Math.max(1, calculatedStats.totalOwnedPlots) * PLOT_SQUARE_FOOTAGE)) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <CustomModal modal={modal} closeModal={closeModal} />
            {plotAcquisitionData && <PlotPurchaseModal plotIndex={plotAcquisitionData.index} closeModal={() => setPlotAcquisitionData(null)} buyPlot={buyPlot} discipline={discipline} PLOT_SQUARE_FOOTAGE={PLOT_SQUARE_FOOTAGE} PLOT_COST={PLOT_COST} />}
            {propertyEditData && <ItemPropertyModal item={propertyEditData} onSave={handleItemPropertySave} onClose={() => setPropertyEditData(null)} onDelete={handleItemDelete} />}
            {isAddItemModalOpen && <AddItemModal onSave={handleAddItem} onClose={() => setIsAddItemModalOpen(false)} />}
            {plotContentEditData && <ItemEditModal plotIndex={plotContentEditData.plotIndex} plot={plotContentEditData.plot} onClose={() => setPlotContentEditData(null)} onRemoveItem={removeModuleFromPlot} />}
        </div>
    );
};

export default EstatePrototype;