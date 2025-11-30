import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../../store/gamestore.js'; // Fixed import path

// --- 1. EMBEDDED ICONS ---
// Custom SVG Icons specific to the Blueprint Simulator style
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
    Construction: (props) => <Icon {...props} d="M17 11h4V3H3v8h4" />,
    PanelRightClose: (props) => <Icon {...props} d="M18 3v18M12 9l3 3-3 3M3 3h18v18H3z" />,
    PanelRightOpen: (props) => <Icon {...props} d="M18 3v18M15 15l-3-3 3-3M3 3h18v18H3z" />,
    X: (props) => <Icon {...props} d="M18 6 6 18M6 6l12 12" />,
    ArrowUpRight: (props) => <Icon {...props} d="M7 7h10v10M7 17 17 7" />,
    Bed: (props) => <Icon {...props} d="M2 19v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M12 13V7M2 9h20" />,
    Utensils: (props) => <Icon {...props} d="M3 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2M12 22v-7" />,
    Bath: (props) => <Icon {...props} d="M9 6 6.5 3.5M3 7v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7" />,
    Brain: (props) => <Icon {...props} d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1 2.96-3.08 3 3 0 0 1-.34-5.55 2.5 2.5 0 0 1 .34-4.94 2.5 2.5 0 0 1 2.5-2.5zm5 0a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1 .34 4.94 3 3 0 0 1-.34 5.55 2.5 2.5 0 0 1 2.96 3.08 2.5 2.5 0 0 1-4.96-.44v-15A2.5 2.5 0 0 1 14.5 2z" />,
    Wrench: (props) => <Icon {...props} d="M14 14.5V17m-3-3.5L8 10 5.5 7.5a2.12 2.12 0 0 1 3 3L11 14l3 3m7.5-6.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z" />,
    Lock: (props) => <Icon {...props} d="M15 16h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3V7a4 4 0 0 0-8 0v3H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10z" />,
    Square: (props) => <Icon {...props} d="M3 3h18v18H3z" />,
    HelpCircle: (props) => <Icon {...props} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />,
    Map: (props) => <Icon {...props} d="M14.1 6.3a2 2 0 0 0-1.1-1.1c-.8-.2-1.7.3-2 .8L7.8 8.8c-.8 1.4-.4 3.1 1 4L11 15h6v4l4-4 4-4-4-4z" />,
    Car: (props) => <Icon {...props} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />,
    Ship: (props) => <Icon {...props} d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.9 5.8 2.42 8M12 10V4L9.63 6M12 4l2.37 2M12 4V2" />,
    Aperture: (props) => <Icon {...props} d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />,
    Cpu: (props) => <Icon {...props} d="M20 16.2A4.5 4.5 0 0 0 12 22h0a4.5 4.5 0 0 0-8-5.8h0a4.5 4.5 0 0 0 8 5.8h0a4.5 4.5 0 0 0 8-5.8h0zM12 2v4M12 18v4" />,
    Trophy: (props) => <Icon {...props} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M2 22h20M8 22l1-9h6l1 9" />,
    Zap: (props) => <Icon {...props} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    Shield: (props) => <Icon {...props} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    Package: (props) => <Icon {...props} d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />,
    Gift: (props) => <Icon {...props} d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />,
    Star: (props) => <Icon {...props} d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    Code: (props) => <Icon {...props} d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
    TrendingUp: (props) => <Icon {...props} d="m23 6-9.5 9.5-5-5L1 18" />,
    Users: (props) => <Icon {...props} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M23 21v-2a4 4 0 0 0-3-3.87" />,
    Camera: (props) => <Icon {...props} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    Watch: (props) => <Icon {...props} d="M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 2v4M12 18v4M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h4M18 12h4M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />,
    Monitor: (props) => <Icon {...props} d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 22v-4" />,
    Mic: (props) => <Icon {...props} d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />,
    Library: (props) => <Icon {...props} d="m16 6 4 14M12 6v14M8 8v12M4 4v16" />,
    Grid: (props) => <Icon {...props} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    List: (props) => <Icon {...props} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    Archive: (props) => <Icon {...props} d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" />,
    Layers: (props) => <Icon {...props} d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z M22 17.65l-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.65 M22 12.76l-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.76" />,
    Crown: (props) => <Icon {...props} d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />,
    Sun: (props) => <Icon {...props} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />,
    ZoomIn: (props) => <Icon {...props} d="M11 5h2M12 12v.01M12 17h.01M17 12h.01M19 12a7 7 0 1 0-7 7 7 7 0 0 0 7-7zM8 8l2 2m4 4 2 2" />,
    ZoomOut: (props) => <Icon {...props} d="M5 12h14M12 12v.01M12 17h.01M17 12h.01M19 12a7 7 0 1 0-7 7 7 7 0 0 0 7-7z" />,
    Circle: (props) => <Icon {...props} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />,
    Shop: (props) => <Icon {...props} d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
};

const RenderIcon = ({ name, size = 16, className = "" }) => {
    const IconComponent = ICONS[name] || ICONS.HelpCircle;
    return <IconComponent size={size} className={className} />;
};

// --- 2. EMBEDDED DATA & COLORS ---
const PLOT_SQUARE_FOOTAGE = 1000;
const PLOT_COST = 25000;
const EXPANSION_COST = 100000;
const MAX_GRID_DIMENSION = 10;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;

// Category Color Mapping
const CATEGORY_COLORS = {
    'Special': { text: 'text-amber-400', border: 'border-amber-700', bg: 'bg-amber-900/50' },
    'Room': { text: 'text-blue-400', border: 'border-blue-700', bg: 'bg-blue-900/50' },
    'Booster': { text: 'text-purple-400', border: 'border-purple-700', bg: 'bg-purple-900/50' },
    'Gear': { text: 'text-green-400', border: 'border-green-700', bg: 'bg-green-900/50' },
    'Deed': { text: 'text-orange-400', border: 'border-orange-700', bg: 'bg-orange-900/50' },
    'Crate': { text: 'text-red-400', border: 'border-red-700', bg: 'bg-red-900/50' },
};

const getItemColor = (category) => {
    return CATEGORY_COLORS[category] || { text: 'text-slate-400', border: 'border-slate-700', bg: 'bg-slate-900/50' };
};

// UPDATED ITEMS WITH 8-SKILL REQUIREMENTS
const ESTATE_ITEMS_DATA = [
    // -- SPECIALS --
    { id: 'expansion', name: 'Expand Grid', cost: EXPANSION_COST, icon: 'Maximize', desc: `Expands grid size limit to ${MAX_GRID_DIMENSION}x${MAX_GRID_DIMENSION}.`, type: 'Special', isExpansion: true, priority: 0, category: 'Special' },
    
    // -- PREFABS (Rooms) --
    { id: 'starter_home', name: 'Starter Suite', cost: 0, icon: 'Home', desc: 'Auto-placed with first deed.', type: 'Bundle', multiplier: 1.2, isBundle: true, category: 'Room', priority: 1, sqft: 800 },
    
    { id: 'bedroom_std', name: 'Bedroom', cost: 2500, icon: 'Bed', desc: 'Rest & Recovery.', skillBuff: { skill: 'Vitality', multiplier: 0.02 }, type: 'Rest', multiplier: 1.02, category: 'Room', priority: 2, sqft: 200 },
    
    { id: 'bathroom_std', name: 'Bathroom', cost: 2000, icon: 'Bath', desc: 'Basic hygiene.', skillBuff: { skill: 'Willpower', multiplier: 0.02 }, type: 'Hygiene', multiplier: 1.02, category: 'Room', priority: 2, sqft: 100 },
    
    { id: 'kitchen_std', name: 'Kitchen', cost: 3000, icon: 'Utensils', desc: 'Meal prep.', skillBuff: { skill: 'Vitality', multiplier: 0.02 }, type: 'Sustenance', multiplier: 1.02, category: 'Room', priority: 2, sqft: 300 },
    
    { id: 'garage', name: 'Garage', cost: 5000, icon: 'Car', desc: 'Vehicle Storage.', skillBuff: { skill: 'Equity', multiplier: 0.05 }, type: 'Storage', multiplier: 1.0, category: 'Room', priority: 2, sqft: 400 },
    
    // Higher Tier Rooms with Requirements
    { id: 'bedroom_master', name: 'Master Bedroom', cost: 10000, icon: 'Bed', desc: 'Luxury rest.', skillReq: { skill: 'Liquidity', level: 30 }, skillBuff: { skill: 'Vitality', multiplier: 0.08 }, type: 'Rest', multiplier: 1.08, category: 'Room', priority: 3, sqft: 450 },
    
    { id: 'kitchen_chef', name: 'Chef Kitchen', cost: 12000, icon: 'Utensils', desc: 'Gourmet nutrition.', skillReq: { skill: 'Vitality', level: 40 }, skillBuff: { skill: 'Vitality', multiplier: 0.08 }, type: 'Sustenance', multiplier: 1.08, category: 'Room', priority: 3, sqft: 500 },
    
    { id: 'gym', name: 'Home Gym', cost: 1000, icon: 'ArrowUpRight', desc: 'Train at home.', skillBuff: { skill: 'Vitality', multiplier: 0.10 }, type: 'Health', multiplier: 1.1, category: 'Room', priority: 4, sqft: 400 },
    
    { id: 'office', name: 'Command Center', cost: 12000, icon: 'Layout', desc: 'Ops Hub.', skillReq: { skill: 'Engineering', level: 30 }, skillBuff: { skill: 'Engineering', multiplier: 0.10 }, type: 'Tech', multiplier: 1.1, category: 'Room', priority: 4, sqft: 350 },
    
    { id: 'library', name: 'Grand Library', cost: 10000, icon: 'HelpCircle', desc: 'Knowledge base.', skillReq: { skill: 'Intellect', level: 20 }, skillBuff: { skill: 'Intellect', multiplier: 0.10 }, type: 'Knowledge', multiplier: 1.1, category: 'Room', priority: 4, sqft: 600 },

    // -- DEEDS --
    { id: 'plot_deed_special', name: 'Land Deed', cost: PLOT_COST, icon: 'Map', desc: 'Claim an unowned plot.', type: 'Deed', isDeed: true, priority: 0, sqft: PLOT_SQUARE_FOOTAGE, category: 'Deed' },
    
    { id: 'd2', name: 'Estate Title', icon: 'Home', cost: 500000, desc: 'Property tax reduction.', skillReq: { skill: 'Equity', level: 10 }, category: 'Deed' },
    
    { id: 'd3', name: 'Business License', cost: 2500000, icon: 'Trophy', desc: 'Operate vendor stall.', skillReq: { skill: 'Equity', level: 50 }, category: 'Deed' },
    
    { id: 'd4', name: 'Car Title', icon: 'Car', cost: 75000, desc: 'Utility vehicle.', category: 'Deed' },
    
    { id: 'd6', name: 'Private Jet', icon: 'Maximize', cost: 15000000, desc: 'Ultimate travel.', skillReq: { skill: 'Liquidity', level: 80 }, category: 'Deed' },
    
    // -- GEAR & UPGRADES --
    { id: 'g2', name: "Server Farm", cost: 15000, desc: "Passive Income Gen", icon: "Construction", skillReq: { skill: 'Engineering', level: 40 }, skillBuff: { skill: 'Liquidity', multiplier: 0.05 }, category: 'Gear' },
    
    { id: 'g4', name: "Gold Vault", cost: 5000, desc: "Secure Storage", icon: "Lock", skillReq: { skill: 'Security', level: 20 }, category: 'Gear' },
    
    { id: 'g5', name: "Studio Setup", cost: 2500, desc: "+Content Quality", icon: "Camera", skillReq: { skill: 'Influence', level: 15 }, skillBuff: { skill: 'Influence', multiplier: 0.1 }, category: 'Gear' },
    
    // -- CRATES --
    { id: 'lf6', name: 'Legendary Crate', icon: 'Star', cost: 50000, desc: 'The ultimate prize.', category: 'Crate' },
];

// --- 3. HELPER COMPONENTS ---

// OCTAGON RADAR CHART COMPONENT
const OctagonStatChart = ({ skills }) => {
    const size = 200;
    const center = size / 2;
    const radius = size * 0.4; // 40% of size
    
    const skillKeys = Object.keys(skills);
    const numPoints = skillKeys.length;
    const angleStep = (Math.PI * 2) / numPoints;

    // Helper to calculate point coordinates
    const getPoint = (index, value, maxVal = 100) => {
        const angle = index * angleStep - Math.PI / 2; // Start at top
        const r = (value / maxVal) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    // Generate Polygon Points string
    const pointsString = skillKeys.map((key, i) => {
        const { x, y } = getPoint(i, skills[key]);
        return `${x},${y}`;
    }).join(' ');

    // Generate Background Grids (25%, 50%, 75%, 100%)
    const grids = [0.25, 0.5, 0.75, 1.0].map((scale) => (
        <polygon 
            key={scale}
            points={skillKeys.map((_, i) => {
                const { x, y } = getPoint(i, 100 * scale);
                return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
        />
    ));

    return (
        <div className="flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Web */}
                {grids}
                
                {/* Data Polygon */}
                <polygon 
                    points={pointsString} 
                    fill="rgba(16, 185, 129, 0.3)" // Emerald fill
                    stroke="#10b981" // Emerald stroke
                    strokeWidth="2"
                />
                
                {/* Points & Labels */}
                {skillKeys.map((key, i) => {
                    const { x, y } = getPoint(i, 115); // Label slightly outside
                    const point = getPoint(i, skills[key]);
                    return (
                        <g key={key}>
                            {/* Line to center */}
                            <line 
                                x1={center} y1={center} x2={getPoint(i, 100).x} y2={getPoint(i, 100).y} 
                                stroke="rgba(255,255,255,0.05)" 
                            />
                            {/* Data Dot */}
                            <circle cx={point.x} cy={point.y} r="3" fill="#fbbf24" />
                            {/* Label */}
                            <text 
                                x={x} y={y} 
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                fill="white" 
                                fontSize="9" 
                                fontWeight="bold"
                                className="uppercase font-mono"
                            >
                                {key.substring(0,3)}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Skill Octagon</div>
        </div>
    );
};

const MarketItemRow = ({ item, pendingBuildItem, handleSelectShopItem, discipline, gridDimension, MAX_GRID_DIMENSION, userSkills }) => {
    const itemColors = getItemColor(item.category);
    const isPending = pendingBuildItem?.id === item.id;
    
    // Check Skill Requirement
    const skillReqMet = !item.skillReq || (userSkills[item.skillReq.skill] >= item.skillReq.level);
    
    const actionButtonDisabled = !skillReqMet || (item.isExpansion
        ? discipline < item.cost || gridDimension >= MAX_GRID_DIMENSION
        : discipline < item.cost);

    return (
        <div 
            key={item.id} 
            className={`flex items-center p-3 rounded-xl border transition-all shadow-md ${itemColors.border} ${item.isOwned ? itemColors.bg : 'bg-slate-900/50'} ${isPending ? 'ring-2 ring-amber-500 border-amber-500/50' : ''} group relative overflow-hidden`}
        >
            <div className={`p-2 rounded-lg ${itemColors.text} ${itemColors.bg} bg-opacity-70 mr-3 shrink-0 border ${itemColors.border}`}>
                <RenderIcon name={item.icon} size={18}/>
            </div>
            
            <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white truncate">{item.name}</span>
                    <span className={`text-[10px] font-mono font-bold px-1 rounded-sm ${item.isOwned ? itemColors.text + ' bg-black/40' : 'text-slate-500 bg-slate-700/50'}`}>
                        {item.isOwned ? `Owned x${item.count}` : item.category.toUpperCase()}
                    </span>
                </div>
                <div className={`text-xs font-mono leading-tight text-slate-400`}>{item.desc}</div>
                
                {/* SKILL INFO ROW */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {item.sqft && <div className="text-[9px] text-emerald-500 font-mono">Footprint: {item.sqft} sq ft</div>}
                    
                    {item.skillReq && (
                        <div className={`text-[9px] font-mono font-bold ${skillReqMet ? 'text-green-400' : 'text-red-400'}`}>
                            REQ: {item.skillReq.skill} Lvl {item.skillReq.level} {skillReqMet ? '✓' : '(Low)'}
                        </div>
                    )}
                    
                    {item.skillBuff && (
                        <div className="text-[9px] font-mono text-blue-300">
                            BONUS: +{(item.skillBuff.multiplier * 100).toFixed(0)}% {item.skillBuff.skill}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0">
                {item.cost > 0 && <span className={`text-[11px] font-mono font-bold ${actionButtonDisabled ? 'text-slate-500' : itemColors.text}`}>
                    {item.cost.toLocaleString()} DSC
                </span>}
                <button
                    onClick={() => handleSelectShopItem(item)}
                    disabled={actionButtonDisabled}
                    className={`w-full mt-1 px-2 py-1 text-[10px] font-bold uppercase rounded-md transition-all
                        ${actionButtonDisabled
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                >
                    {item.isExpansion ? 'Expand' : item.isDeed ? 'Buy' : skillReqMet ? 'Select' : 'Locked'}
                </button>
            </div>
        </div>
    );
};


const GridSlot = ({ index, state, isSelected, pendingItem, onInteract, onDemolish, gridDim, onMaintain }) => {
    const isBuilt = state && typeof state === 'object';
    const isOwned = state === 'empty' || isBuilt;
    const isLocked = state === null;

    const itemColors = isBuilt ? getItemColor(state.category) : {};

    const baseStyle = "relative rounded-md border-2 flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden aspect-square";
    const baseGreenBg = 'bg-emerald-900/30';
    let statusStyle = isLocked 
        ? `${baseGreenBg} border-slate-700/50 border-dashed` 
        : `${baseGreenBg} border-emerald-500/30`; 

    if (isBuilt) {
        statusStyle = `${baseGreenBg} ${itemColors.border} shadow-lg z-10 shadow-slate-900/50`;
    } 

    const selectionStyle = isSelected ? "ring-2 ring-amber-500 z-20" : "";
    const tooltipContent = isBuilt 
        ? `${state.name} | ${state.sqft || 0}/${PLOT_SQUARE_FOOTAGE} sq ft used` 
        : isOwned ? `${PLOT_SQUARE_FOOTAGE} sq ft available (Owned)` : `Locked Plot: ${PLOT_COST.toLocaleString()} DSC`;

    return (
        <div onClick={() => onInteract(index)} className={`${baseStyle} ${statusStyle} ${selectionStyle}`}>
            <div className="absolute top-0 left-0 w-max bg-black/90 p-1.5 rounded-br-md text-[8px] text-white hidden group-hover:block z-30 pointer-events-none border-r border-b border-slate-700 shadow-xl">
                {tooltipContent}
            </div>
            
            {isBuilt ? (
                <>
                    <div className={`mb-0.5 p-1 bg-black/50 rounded-full ${itemColors.text}`}>
                        <RenderIcon name={state.icon} size={gridDim > 7 ? 12 : 16} />
                    </div>
                    {gridDim <= 7 && <div className="text-[8px] font-bold text-white text-center px-1 leading-tight line-clamp-1">{state.name}</div>}
                    
                    <div className="absolute bottom-1 w-3/4 h-1 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(state.sqft / PLOT_SQUARE_FOOTAGE) * 100}%` }}></div>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); onMaintain(index); }} 
                        className="absolute bottom-0.5 left-0.5 text-slate-400 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full p-0.5 z-20"
                        title="Maintain Plot"
                    >
                        <RenderIcon name="Wrench" size={10} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDemolish(index); }} 
                        className="absolute top-0.5 right-0.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full p-0.5 z-20"
                        title="Demolish"
                    >
                        <RenderIcon name="X" size={10} />
                    </button>
                </>
            ) : isOwned ? (
                <div className={`flex flex-col items-center ${pendingItem && !pendingBuildItem.isDeed ? 'text-emerald-400' : 'text-emerald-500/50 group-hover:text-emerald-400'}`}>
                    {pendingItem && !pendingBuildItem.isDeed ? <RenderIcon name="Hammer" size={14} /> : <RenderIcon name="Plus" size={14} />}
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

const StatRow = ({ label, value, unit = '', max, color = 'text-white' }) => (
    <div className="flex justify-between items-center">
        <span className="text-slate-400">{label}</span>
        <span>
            <span className={color}>{value}</span>
            {max !== undefined && <span className="text-slate-500"> / {max}</span>}
            {unit && <span className="text-slate-500 ml-1">{unit}</span>}
        </span>
    </div>
);

// Custom Modal Component
const CustomModal = ({ modal, closeModal }) => {
    if (!modal.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4 transition-opacity duration-300">
            <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700 animate-in zoom-in-95">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-amber-400">{modal.title || (modal.isConfirm ? 'Confirmation' : 'Notification')}</h3>
                    <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors p-1 rounded-full">
                        <RenderIcon name="X" size={18}/>
                    </button>
                </div>
                <p className="text-sm text-slate-300 mb-6">{modal.message}</p>
                <div className={`flex ${modal.isConfirm ? 'justify-between' : 'justify-end'} gap-3`}>
                    {modal.isConfirm && (
                        <button onClick={closeModal} className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                            Cancel
                        </button>
                    )}
                    <button onClick={modal.onConfirm || closeModal} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${modal.isConfirm ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}>
                        {modal.isConfirm ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- 4. MAIN COMPONENT ---
export default function EstatePrototype({ discipline: parentDiscipline = 5000, setDiscipline: parentSetDiscipline = () => {} }) {
  // --- INTEGRATION: SKILL MAPPING & CURRENCY ---
  // Connect to GameStore to map global skills to Estate Octagon skills
  const { getSkillData } = useGameStore();
  const { calculatedSkills } = useMemo(() => getSkillData(), [getSkillData]);

  const USER_SKILLS = useMemo(() => {
      const getLvl = (id) => calculatedSkills.find(s => s.id === id)?.level || 1;
      return {
          Engineering: Math.floor((getLvl('cod') + getLvl('ai')) / 2),
          Influence: Math.floor((getLvl('cnt') + getLvl('net')) / 2),
          Liquidity: Math.floor((getLvl('inc') + getLvl('flo')) / 2),
          Equity: Math.floor((getLvl('ast') + getLvl('inv') + getLvl('est')) / 3),
          Vitality: getLvl('vit'),
          Intellect: getLvl('wis'),
          Security: getLvl('sec'),
          Willpower: getLvl('dis')
      };
  }, [calculatedSkills]);

  // Handle Controlled vs Uncontrolled Discipline State
  const [localDiscipline, setLocalDiscipline] = useState(parentDiscipline);
  const isControlled = parentDiscipline !== undefined;
  const discipline = isControlled ? parentDiscipline : localDiscipline;
  const setDiscipline = (valOrFn) => {
      const newVal = typeof valOrFn === 'function' ? valOrFn(discipline) : valOrFn;
      if (isControlled && parentSetDiscipline) parentSetDiscipline(newVal); 
      else setLocalDiscipline(newVal);
  };

  // State
  const [salvage, setSalvage] = useState(15);
  const [gridDimension, setGridDimension] = useState(5);
  const [grid, setGrid] = useState(() => {
      // Try load from local storage first for persistence
      const savedGrid = localStorage.getItem('vault_estate_grid_v1');
      if (savedGrid) {
          try {
              const parsed = JSON.parse(savedGrid);
              // Ensure grid dimensions are correctly set from the loaded array length
              const dim = Math.sqrt(parsed.length);
              if (Number.isInteger(dim)) {
                  setGridDimension(dim);
                  return parsed;
              }
          } catch(e) { console.error("Grid load error", e); }
      }
      const initial = new Array(5 * 5).fill(null);
      const center = Math.floor(initial.length / 2);
      initial[center] = 'empty'; 
      return initial;
  });

  // Save grid on change
  useEffect(() => {
      localStorage.setItem('vault_estate_grid_v1', JSON.stringify(grid));
  }, [grid]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pendingBuildItem, setPendingBuildItem] = useState(null);
  const [isShopOpen, setShopOpen] = useState(true); 
  const [shopTab, setShopTab] = useState('prefabs');
  const [sidebarView, setSidebarView] = useState('market');
  const [plotsOwnedCount, setPlotsOwnedCount] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, message: '', isConfirm: false, onConfirm: null, title: '' });
  const [itemView, setItemView] = useState('list'); 
  const [zoomLevel, setZoomLevel] = useState(1.4);

  // Modal Helpers
  const closeModal = () => setModal({ isOpen: false, message: '', isConfirm: false, onConfirm: null, title: '' });
  const showMessage = (message, title = "Notification") => {
      setModal({ isOpen: true, message, isConfirm: false, onConfirm: closeModal, title });
  };
  const showConfirm = (message, onConfirm, title = "Confirmation") => {
      setModal({ isOpen: true, message, isConfirm: true, onConfirm: () => { onConfirm(); closeModal(); }, title });
  };
  
  // Zoom Handlers
  const handleZoom = (direction) => {
      setZoomLevel(prev => {
          const newZoom = parseFloat((prev + direction * ZOOM_STEP).toFixed(1));
          return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
      });
  };
  
  const handleZoomReset = () => setZoomLevel(1.4); 

  // --- ACTIONS ---
  const handleMaintain = (index) => {
    const salvageGain = Math.floor(Math.random() * 3) + 1;
    setSalvage(s => s + salvageGain);
    showMessage(`Maintained plot ${index + 1}! Gained ${salvageGain} Salvage.`, "Maintenance Complete");
  };

  const expandGrid = () => {
      const oldDim = gridDimension;
      const newDim = oldDim + 1;
      const newGrid = new Array(newDim * newDim).fill(null);
      for(let oldIndex = 0; oldIndex < grid.length; oldIndex++) {
          const row = Math.floor(oldIndex / oldDim); 
          const col = oldIndex % oldDim; 
          const newIndex = (row * newDim) + col;
          newGrid[newIndex] = grid[oldIndex];
      }
      setGrid(newGrid);
      setGridDimension(newDim);
      setDiscipline(d => d - EXPANSION_COST);
      showMessage(`Estate expanded to ${newDim}x${newDim} successfully.`, "Expansion Complete");
  };

  const handleSelectShopItem = (item) => {
      // Re-verify skill requirements
      const skillReqMet = !item.skillReq || (USER_SKILLS[item.skillReq.skill] >= item.skillReq.level);
      if (!skillReqMet) { showMessage(`Skill requirement not met: ${item.skillReq.skill} Lvl ${item.skillReq.level}`, "Access Denied"); return; }

      if (discipline < item.cost) { showMessage("Insufficient Discipline! (DSC)", "Transaction Failed"); return; }
      
      if (item.isExpansion) {
          if (gridDimension >= MAX_GRID_DIMENSION) { showMessage("Maximum Estate size reached!", "Expansion Failed"); return; }
          expandGrid(); setPendingBuildItem(null); return; 
      }
      
      if (item.category !== 'Room' && item.category !== 'Special' && item.category !== 'Deed') {
          setDiscipline(d => d - item.cost); showMessage(`Purchased ${item.name}! Check your inventory.`, "Purchase Complete"); return;
      }

      setPendingBuildItem(item);
      setShopOpen(false); 
      
      // If a slot is already selected, try to perform the action immediately
      if (selectedSlot !== null) {
          if (item.isDeed && grid[selectedSlot] === null) buyPlot(selectedSlot);
          else if (!item.isDeed && !item.isExpansion && grid[selectedSlot] === 'empty') finalizeBuild(selectedSlot, item);
      }
  };

  const handleSlotInteraction = (index) => {
      const slotState = grid[index];
      const isUnowned = slotState === null;
      const isOccupied = typeof slotState === 'object';
      const isOwnedEmpty = slotState === 'empty';

      // 1. Unowned Plot Interaction (Buy Deed or Notify)
      if (isUnowned) {
          if (pendingBuildItem && pendingBuildItem.isDeed) {
              buyPlot(index); return;
          } else if (pendingBuildItem && !pendingBuildItem.isDeed) {
              showMessage("You must own this land before building!", "Action Required"); return;
          }
          setSelectedSlot(selectedSlot === index ? null : index); return;
      }
      
      // 2. Owned but Empty Plot Interaction (Build or Notify)
      if (isOwnedEmpty) {
          if (pendingBuildItem && pendingBuildItem.category === 'Room') {
              finalizeBuild(index, pendingBuildItem); return;
          } else { 
              setSelectedSlot(index);
              setPendingBuildItem(null);
          }
          return;
      }
      
      // 3. Occupied Plot Interaction (Select for info)
      if (isOccupied) { 
          setSelectedSlot(index); 
          setPendingBuildItem(null); 
          return; 
      }

      // Fallback
      setSelectedSlot(selectedSlot === index ? null : index);
  };

  const buyPlot = (index) => {
      const deedItem = ESTATE_ITEMS_DATA.find(i => i.id === 'plot_deed_special') || ESTATE_ITEMS_DATA.find(i => i.isDeed && i.cost === PLOT_COST);
      const cost = deedItem ? deedItem.cost : PLOT_COST;

      // Check liquidity (Discipline) and skill req (already checked in shop)
      if (discipline < cost) { showMessage("Insufficient Discipline! (DSC)", "Transaction Failed"); return; }
      
      const newGrid = [...grid];
      newGrid[index] = 'empty';
      setDiscipline(d => d - cost);
      
      let purchaseMessage = `Plot ${index + 1} claimed!`;

      if (plotsOwnedCount === 1) {
          // Starter Home Logic: Auto-build standard rooms on 3 adjacent plots
          const starterRooms = [
              ESTATE_ITEMS_DATA.find(i => i.id === 'bedroom_std'),
              ESTATE_ITEMS_DATA.find(i => i.id === 'kitchen_std'),
              ESTATE_ITEMS_DATA.find(i => i.id === 'bathroom_std')
          ];
          
          // Try to claim 3 plots in a row (center + 1 right + 1 down) for starter suite for simplicity
          const centerRow = Math.floor(gridDimension / 2);
          const centerCol = Math.floor(gridDimension / 2);
          
          const plotsToPopulate = [];
          
          // Plot 1: The purchased one (index)
          plotsToPopulate.push(index);

          // Attempt to find 2 empty neighbors (right and one below center right if 5x5)
          const potentialNeighbors = [
            index + 1, // Right
            index + gridDimension, // Down
            index + 1 + gridDimension // Down-Right
          ].filter(i => i < newGrid.length && newGrid[i] === null && i % gridDimension !== 0); // Exclude wrap-around

          // Use up to 3 plots total (the one bought + 2 best neighbors)
          plotsToPopulate.push(...potentialNeighbors.slice(0, 2));


          starterRooms.forEach((room, i) => {
              let targetIndex = plotsToPopulate[i];
              // Ensure we don't build outside the new owned plots
              if (targetIndex !== undefined && room && (newGrid[targetIndex] === 'empty' || newGrid[targetIndex] === null)) {
                  newGrid[targetIndex] = { ...room, builtAt: Date.now(), level: 1, sqft: room.sqft, category: 'Room' };
              }
          });
          
          // Mark any unclaimed adjacent plots as empty/owned if they were used for the suite placement logic
          plotsToPopulate.forEach(i => {
              if (newGrid[i] === null || newGrid[i] === 'empty') newGrid[i] = 'empty';
          });

          purchaseMessage = `First Land Deed claimed! A complimentary Starter Suite has been built across plots.`;
      }


      setGrid(newGrid);
      setPlotsOwnedCount(c => c + 1);
      setSelectedSlot(null);
      setPendingBuildItem(null); 
      showMessage(purchaseMessage, "Land Claimed");
  };

  const finalizeBuild = (index, item) => {
      const newGrid = [...grid];
      const dataItem = ESTATE_ITEMS_DATA.find(d => d.id === item.id) || item;
      newGrid[index] = { ...dataItem, builtAt: Date.now(), level: 1, sqft: dataItem.sqft || 0 }; 
      setGrid(newGrid);
      setDiscipline(d => d - item.cost); setPendingBuildItem(null); setSelectedSlot(null);
      showMessage(`${item.name} constructed successfully!`, "Construction Complete");
  };

  const confirmDemolish = (index) => {
      const newGrid = [...grid]; 
      newGrid[index] = 'empty'; 
      setGrid(newGrid);
      if(selectedSlot === index) setSelectedSlot(null);
      showMessage("Structure demolished! The plot is now empty land.", "Demolition Complete");
  }

  const handleDemolish = (index) => {
    showConfirm(
        "Demolish this structure? The land will remain owned, but the building materials are lost.",
        () => confirmDemolish(index),
        "Confirm Demolition"
    );
  }

  // --- CALCULATIONS ---
  const safeGrid = Array.isArray(grid) ? grid : [];
  const roomCounts = safeGrid.reduce((acc, room) => {
      if (room && typeof room === 'object' && room.id) {
          acc[room.id] = (acc[room.id] || 0) + 1;
      }
      return acc;
  }, {});

  const calculatedStats = useMemo(() => {
    let totalSqFt = 0;
    let totalBonusMultiplier = 1.0;
    let ownedRooms = {};

    safeGrid.forEach((plot) => {
        if (plot && typeof plot === 'object') {
            totalSqFt += plot.sqft || 0;
            totalBonusMultiplier *= plot.multiplier || 1.0;

            if (plot.category === 'Room') {
                if (ownedRooms[plot.id]) {
                    ownedRooms[plot.id].count += 1;
                } else {
                    ownedRooms[plot.id] = { ...plot, count: 1 };
                }
            }
        }
    });

    const totalOwnedPlots = safeGrid.filter(p => p === 'empty' || (p && typeof p === 'object')).length;

    return {
        ownedRooms: Object.values(ownedRooms),
        totalOwnedPlots,
        totalSqFt,
        totalBonusMultiplier,
    };
  }, [safeGrid]);

  const plotsUsed = safeGrid.filter(x => x && typeof x === 'object').length;
  const totalPlots = gridDimension * gridDimension;
  
  const unifiedShopItems = useMemo(() => {
    let filteredItems = ESTATE_ITEMS_DATA;
    if (shopTab === 'prefabs') {
        filteredItems = ESTATE_ITEMS_DATA.filter(i => i.category === 'Room' || i.category === 'Special');
    } else if (shopTab === 'deeds') {
        filteredItems = ESTATE_ITEMS_DATA.filter(i => i.category === 'Deed');
    } else if (shopTab === 'gear') {
        filteredItems = ESTATE_ITEMS_DATA.filter(i => i.category === 'Gear' || i.category === 'Crate' || i.category === 'Booster');
    }

    return filteredItems.map(item => {
        const count = roomCounts[item.id] || 0;
        return { ...item, isOwned: count > 0, count: count, bonus: item.desc, category: item.category };
    }).sort((a, b) => (a.cost || 0) - (b.cost || 0));
  }, [roomCounts, shopTab]);


  return (
    <div className="h-full flex flex-col bg-[#0f1219] text-white font-sans">
        {/* Custom scrollbar style for the sidebar */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: #1e1e1e;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #334155;
              border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #475569;
          }
        `}</style>
        
        <header className="shrink-0 p-4 flex justify-between items-center bg-[#1a1a1a] border-b border-slate-700">
            <h1 className="text-xl font-bold">Estate Preview <span className='text-slate-400 text-sm'>v2.0</span></h1>
            <div className="flex items-center gap-4">
                <RenderIcon name="Brain" size={16} className="text-pink-400"/>
                <span className="font-mono text-emerald-400 font-bold">{discipline.toLocaleString()} DSC</span>
                <RenderIcon name="Wrench" size={16} className="text-slate-400"/>
                <span className="font-mono text-slate-300">{salvage} Salvage</span>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
        
          {/* MAIN CANVAS AREA (Grid + Shop Building) */}
          <div className="w-full h-full bg-[#1a202c] relative overflow-hidden flex flex-col transition-all duration-300">
            
            {/* Dynamic Grid Background */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'linear-gradient(#404e6d 1px, transparent 1px), linear-gradient(90deg, #404e6d 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
            </div>

            {/* Header Overlay */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 pt-6 pb-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <RenderIcon name="Layout" className="text-blue-400"/> Estate Blueprint
                    </h2>
                    <div className="h-6 flex items-center mt-1">
                        {pendingBuildItem ? (
                               <span className="text-amber-400 text-sm font-bold animate-pulse flex items-center gap-2 bg-black/40 px-2 py-1 rounded">
                                   <RenderIcon name="Hammer" size={12}/> Select plot for {pendingBuildItem.name}
                               </span> 
                        ) : (
                            <span className="text-slate-400 text-sm">Manage your property facilities.</span>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 pointer-events-auto mt-4 sm:mt-0">
                    {/* Zoom Controls */}
                    <div className="bg-black/40 border border-slate-600 p-1 rounded-lg flex items-center gap-1">
                        <button onClick={() => handleZoom(-1)} disabled={zoomLevel <= MIN_ZOOM} className="text-slate-400 hover:text-white disabled:opacity-50 p-1"><RenderIcon name="ZoomOut" size={16} /></button>
                        <span className="text-xs font-mono text-white px-2 min-w-[40px] text-center">{(zoomLevel * 100).toFixed(0)}%</span>
                        <button onClick={() => handleZoom(1)} disabled={zoomLevel >= MAX_ZOOM} className="text-slate-400 hover:text-white disabled:opacity-50 p-1"><RenderIcon name="ZoomIn" size={16} /></button>
                        <button onClick={handleZoomReset} disabled={zoomLevel === 1.4} className="text-blue-400 hover:text-blue-300 disabled:opacity-50 p-1 ml-1"><RenderIcon name="Circle" size={14} /></button>
                    </div>
                    <div className="bg-black/40 border border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2"><RenderIcon name="Maximize" size={14} className="text-blue-500"/><span className="text-white font-mono font-bold text-xs">{gridDimension}x{gridDimension}</span></div>
                    <div className="bg-black/40 border border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2"><RenderIcon name="Home" size={14} className="text-emerald-500"/><span className="text-white font-mono font-bold text-xs">{plotsUsed} / {totalPlots} Built</span></div>
                </div>
            </div>

            {/* SCROLLABLE AREA - Adjusted padding and removed max-height issue */}
            <div className="relative z-10 flex-1 flex items-start justify-center overflow-auto p-4 custom-scrollbar">
                <div 
                    className="flex flex-col md:flex-row items-start gap-8 transition-all duration-500 ease-in-out origin-center pt-8 pb-16"
                    style={{ 
                        transform: `scale(${isShopOpen ? 0.9 : zoomLevel}) translateX(${isShopOpen ? '-150px' : '0px'})`, 
                        transformOrigin: 'center top', // Anchor zoom/shift to top center
                    }}
                >
                    {/* THE ESTATE GRID */}
                    <div 
                        className="grid gap-2 p-4 bg-black/20 rounded-2xl border border-slate-700 shadow-xl"
                        style={{ 
                            gridTemplateColumns: `repeat(${gridDimension}, minmax(0, 1fr))`,
                            width: 'min(90vw, 500px)',
                            maxWidth: '500px',
                            aspectRatio: '1/1',
                        }}
                    >
                        {safeGrid.map((plotState, i) => (
                            <GridSlot 
                                key={i}
                                index={i}
                                state={plotState}
                                isSelected={selectedSlot === i}
                                pendingItem={pendingBuildItem}
                                onInteract={handleSlotInteraction}
                                onDemolish={handleDemolish}
                                gridDim={gridDimension}
                                onMaintain={handleMaintain} 
                            />
                        ))}
                    </div>

                    {/* THE SHOP BUILDING (Physical location) */}
                    <div 
                        onClick={() => setShopOpen(!isShopOpen)}
                        className={`w-32 h-32 bg-slate-800 border-4 ${isShopOpen ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'border-slate-600 shadow-xl'} rounded-xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all group shrink-0`}
                    >
                        <RenderIcon name="Shop" size={40} className={`${isShopOpen ? 'text-amber-400' : 'text-slate-400'} mb-2`} />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Agency Market</span>
                        <div className="mt-2 text-[8px] bg-black/50 px-2 py-0.5 rounded text-emerald-400">OPEN</div>
                    </div>

                </div>
            </div>

            {/* Build Cancel Overlay */}
            {pendingBuildItem && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-in slide-in-from-bottom-4">
                    <button onClick={() => setPendingBuildItem(null)} className="px-6 py-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-full border border-slate-600 shadow-2xl font-bold flex items-center gap-2 backdrop-blur-md transition-colors">
                        <RenderIcon name="X" size={16} /> Cancel Construction
                    </button>
                </div>
            )}
          </div>

          {/* RIGHT: OVERLAY SHOP SIDEBAR - Condensed Header */}
          <div className={`
                absolute top-0 right-0 bottom-0 z-30
                flex flex-col gap-0 h-full overflow-hidden transition-all duration-300 ease-in-out
                bg-[#1e1e1e] border-l border-slate-700 shadow-2xl
                ${isShopOpen ? 'w-full md:w-[400px] translate-x-0' : 'translate-x-full md:opacity-0 md:pointer-events-none border-0'}
          `}>
              
              <div className="p-4 border-b border-slate-700 bg-[#131313] shrink-0 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                       <h3 className="font-bold text-lg text-white flex items-center gap-2"><RenderIcon name="Shop" size={18} className="text-amber-500"/> Agency Market</h3>
                       <button onClick={() => setShopOpen(false)} className="text-slate-400 hover:text-white transition-colors"><RenderIcon name="PanelRightClose" size={18}/></button>
                  </div>
                  
                  {/* VIEW TOGGLE & BALANCE ROW */}
                  <div className="flex justify-between items-center gap-4">
                      <div className="flex bg-black/30 p-1 rounded-lg flex-1">
                          <button onClick={() => setSidebarView('market')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${sidebarView === 'market' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Catalog</button>
                          <button onClick={() => setSidebarView('stats')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${sidebarView === 'stats' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>My Stats</button>
                      </div>
                      <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 shrink-0">
                        <RenderIcon name="Brain" size={12} className="text-pink-400"/>
                        <span className="font-mono text-emerald-400 font-bold text-sm leading-none">{discipline.toLocaleString()} DSC</span>
                      </div>
                  </div>

                  {sidebarView === 'market' && (
                      <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar pt-2">
                          <button onClick={() => setShopTab('prefabs')} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${shopTab === 'prefabs' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Rooms</button>
                          <button onClick={() => setShopTab('deeds')} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${shopTab === 'deeds' ? 'bg-orange-900/50 border-orange-500 text-orange-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Deeds</button>
                          <button onClick={() => setShopTab('gear')} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${shopTab === 'gear' ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>Gear</button>
                      </div>
                  )}
              </div>

              {/* MARKET VIEW */}
              {sidebarView === 'market' && (
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                      {/* Market View Toggle */}
                      <div className="flex justify-end p-1 rounded-lg bg-black/30 w-fit ml-auto">
                        <button onClick={() => setItemView('list')} className={`p-1 rounded-md transition-colors ${itemView === 'list' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`} title="List View"><RenderIcon name="List" size={18}/></button>
                        <button onClick={() => setItemView('grid')} className={`p-1 rounded-md transition-colors ${itemView === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`} title="Grid View"><RenderIcon name="Grid" size={18}/></button>
                      </div>

                      {/* Conditional Item Rendering */}
                      {itemView === 'grid' ? (
                          <div className="grid grid-cols-2 gap-3">
                              {unifiedShopItems.map(item => {
                                  const skillReqMet = !item.skillReq || (USER_SKILLS[item.skillReq.skill] >= item.skillReq.level);
                                  const actionButtonDisabled = !skillReqMet || (item.isExpansion 
                                      ? discipline < item.cost || gridDimension >= MAX_GRID_DIMENSION
                                      : discipline < item.cost);
                                  const itemColors = getItemColor(item.category);
                                  
                                  return (
                                      <div 
                                          key={item.id}
                                          className={`relative p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all group shadow-md ${itemColors.border} ${item.isOwned ? itemColors.bg : 'bg-slate-900/50'} ${pendingBuildItem?.id === item.id ? 'ring-2 ring-amber-500 border-amber-500/50' : ''}`}
                                      >
                                          <div className="w-full flex justify-between items-center text-[9px] font-mono">
                                              <span className={`px-1 rounded-sm font-bold ${item.isOwned ? itemColors.text + ' bg-black/40' : 'text-slate-500 bg-slate-700/50'}`}>
                                                  {item.isOwned ? `Owned x${item.count}` : item.category}
                                              </span>
                                              {item.cost > 0 && <span className="text-slate-400">{item.cost.toLocaleString()} DSC</span>}
                                          </div>
                                          
                                          <div className={`p-2 rounded-full bg-black/30 ${itemColors.text} relative group-hover:scale-110 transition-transform`}>
                                              <RenderIcon name={item.icon} size={24}/>
                                          </div>
                                          
                                          <div className="w-full">
                                              <div className="text-[10px] font-bold text-white truncate">{item.name}</div>
                                              <div className={`text-[9px] font-mono leading-tight mt-1 text-slate-400`}>{item.desc}</div>
                                              {item.sqft && <div className="text-[9px] text-emerald-500 font-mono mt-1">{item.sqft} sq ft</div>}
                                          </div>
                                          
                                          <button
                                              onClick={() => handleSelectShopItem(item)}
                                              disabled={actionButtonDisabled}
                                              className={`w-full mt-1 py-1 rounded-lg text-[9px] font-bold uppercase transition-all 
                                                  ${actionButtonDisabled 
                                                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                                                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                                                      }`}
                                          >
                                              {item.isExpansion ? 'Expand' : item.isDeed ? 'Buy' : skillReqMet ? 'Select' : 'Locked'}
                                          </button>
                                      </div>
                                  );
                              })}
                          </div>
                      ) : (
                          <div className="flex flex-col gap-3">
                              {unifiedShopItems.map(item => (
                                  <MarketItemRow 
                                      key={item.id}
                                      item={item}
                                      pendingBuildItem={pendingBuildItem}
                                      handleSelectShopItem={handleSelectShopItem}
                                      discipline={discipline}
                                      gridDimension={gridDimension}
                                      MAX_GRID_DIMENSION={MAX_GRID_DIMENSION}
                                      userSkills={USER_SKILLS}
                                  />
                              ))}
                          </div>
                      )}
                  </div>
              )}

              {/* STATS VIEW */}
              {sidebarView === 'stats' && (
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                      
                      {/* NEW: OCTAGON CHART */}
                      <OctagonStatChart skills={USER_SKILLS} />

                      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-slate-700">
                          <h4 className="text-sm font-bold uppercase text-amber-500 border-b border-slate-800 pb-2 mb-3">Metrics & Maintenance</h4>
                          
                          <div className="flex justify-between items-center mb-4 p-2 bg-slate-800/50 rounded-lg">
                              <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
                                  <RenderIcon name="Wrench" size={14} className="text-emerald-400"/> Maintain All Plots
                              </span>
                              <button 
                                  onClick={() => showMessage('Future Feature: Mass maintenance will restore item condition and yield bulk salvage.', "Future Feature")} 
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded transition-colors"
                              >
                                  + Salvage
                              </button>
                          </div>
                          
                          <div className="space-y-2 text-xs font-mono">
                              <StatRow label="Total Plots Owned" value={calculatedStats.totalOwnedPlots} max={totalPlots} />
                              <StatRow label="Built Structures" value={plotsUsed} max={calculatedStats.totalOwnedPlots} />
                              <StatRow label="Multiplier Total" value={calculatedStats.totalBonusMultiplier.toFixed(2)} unit="x" color="text-yellow-400"/>
                              <StatRow label="Decay Rate" value="-2.0%" color="text-red-400" />
                          </div>
                      </div>

                      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-slate-700">
                          <h4 className="text-sm font-bold uppercase text-blue-500 border-b border-slate-800 pb-2 mb-3">Space Utilization</h4>
                          <div className="mb-4">
                             <div className="flex justify-between text-xs mb-1">
                                 <span className="text-slate-400">Total Sq Ft Usage</span>
                                 <span className="text-emerald-400">{calculatedStats.totalSqFt.toLocaleString()} / {(calculatedStats.totalOwnedPlots * PLOT_SQUARE_FOOTAGE).toLocaleString()}</span>
                             </div>
                             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (calculatedStats.totalSqFt / (Math.max(1, calculatedStats.totalOwnedPlots) * PLOT_SQUARE_FOOTAGE)) * 100)}%` }}></div>
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                              {calculatedStats.ownedRooms.length > 0 ? (
                                  calculatedStats.ownedRooms.map((room) => {
                                      const roomColors = getItemColor(room.category);
                                      return (
                                          <div key={room.id} className="flex justify-between items-center text-xs p-2 bg-slate-800/50 rounded">
                                              <div className="flex items-center gap-2">
                                                  <RenderIcon name={room.icon} size={14} className={roomColors.text}/>
                                                  <span className="font-bold">{room.name}</span>
                                              </div>
                                              <span className="font-mono text-emerald-400">Lvl 1 x{room.count}</span>
                                          </div>
                                      );
                                  })
                              ) : (
                                  <p className="text-xs text-slate-500 italic">No amenities built yet.</p>
                              )}
                          </div>
                      </div>
                  </div>
              )}
          </div>
        </div>
        <CustomModal modal={modal} closeModal={closeModal} />
    </div>
  );
}