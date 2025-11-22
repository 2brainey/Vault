import React, { useState, useEffect } from 'react';
import { 
  Shield, TrendingUp, DollarSign, Lock, Activity, 
  Home, Layers, CheckCircle, Circle, 
  AlertTriangle, User, Trophy, Zap, Star, Code, 
  Cpu, Hammer, Pickaxe, Sprout, Sparkles,
  Briefcase, X, Sword, Heart, Target, Users,
  LayoutDashboard, ArrowRight, ArrowLeft, Flame, Edit3,
  Eye, EyeOff, Save, HelpCircle, Grid, List,
  BookOpen, ChevronRight, Lock as LockIcon, Unlock,
  Droplet, Brain, Smile, Package, Coffee,
  Smartphone, Monitor, CreditCard, Map, Scroll,
  FileKey, Dumbbell, Camera, PenTool, Car, ShoppingBag, Plus,
  Headphones, Armchair, Book, HardDrive, Glasses, Coins, Tag,
  Box, Dna, Hexagon, Server, Globe, Wifi, Database, Key,
  MousePointer, GripVertical, Settings, Sliders, Crown, Gift,
  Building, Landmark, Gavel, Filter, Watch, Mic, Library, Archive,
  Trash2
} from 'lucide-react';

// --- CONFIGURATION ---
const USER_NAME = "Justin";
const CURRENT_VERSION = "v26.0"; // Bumped for Stability
const INVENTORY_SLOTS = 28;
const MAX_SKILL_LEVEL = 99;
const TOTAL_SKILLS = 13; 
const MAX_TOTAL_LEVEL = MAX_SKILL_LEVEL * TOTAL_SKILLS;
const CONTRACTS_PER_PAGE = 5;
const CARDS_PER_PAGE = 8;

// --- ICON REGISTRY ---
const IconMap = {
  Code, AlertTriangle, Coffee, Wifi, Smile, Hexagon, Grid, FileKey,
  CheckCircle, Sparkles, Server, Lock, Key, Cpu, HardDrive, Brain, Globe,
  Database, Zap, Dna, Sword, Target, Shield, Heart, Star, Users,
  Pickaxe, Activity, Sprout, Hammer, Monitor, Dumbbell, Camera, PenTool, Car,
  Headphones, Armchair, Book, Glasses, Coins, Package, ShoppingBag, Flame,
  LayoutDashboard, User, MousePointer, Edit3, GripVertical, DollarSign, TrendingUp, Plus,
  Layers, X, ChevronRight, LockIcon, Unlock, Droplet, Map, Scroll, Settings, Sliders,
  Crown, Gift, Box, Building, Landmark, Gavel, List, Filter, Circle, ArrowRight, ArrowLeft,
  Briefcase, Watch, Mic, Library, Archive, Trash2
};

const RenderIcon = ({ name, size = 16, className = "" }) => {
  const IconComponent = IconMap[name] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};

// --- DATA CONSTANTS ---
const CARD_DATABASE = [
  { id: 'c1', name: "Hello World", rarity: "Common", desc: "Your first line of code.", iconName: "Code", value: 50 },
  { id: 'c2', name: "Syntax Error", rarity: "Common", desc: "A rite of passage.", iconName: "AlertTriangle", value: 50 },
  { id: 'c3', name: "Coffee Stain", rarity: "Common", desc: "Fuel for the machine.", iconName: "Coffee", value: 50 },
  { id: 'c4', name: "Ethernet Cable", rarity: "Common", desc: "Hardline connection.", iconName: "Wifi", value: 50 },
  { id: 'c5', name: "Rubber Duck", rarity: "Common", desc: "Debugging companion.", iconName: "Smile", value: 50 },
  { id: 'c6', name: "Mechanical Key", rarity: "Common", desc: "Click clack.", iconName: "Hexagon", value: 50 },
  { id: 'c7', name: "Pixel", rarity: "Common", desc: "One of many.", iconName: "Grid", value: 50 },
  { id: 'c8', name: "Bug Ticket", rarity: "Common", desc: "It never ends.", iconName: "FileKey", value: 50 },
  { id: 'u1', name: "Git Commit", rarity: "Uncommon", desc: "Save point created.", iconName: "CheckCircle", value: 150 },
  { id: 'u2', name: "Clean Code", rarity: "Uncommon", desc: "Easy to read.", iconName: "Sparkles", value: 150 },
  { id: 'u3', name: "Server Rack", rarity: "Uncommon", desc: "The heavy lifting.", iconName: "Server", value: 150 },
  { id: 'u4', name: "VPN", rarity: "Uncommon", desc: "Hidden tracks.", iconName: "Lock", value: 150 },
  { id: 'u5', name: "API Key", rarity: "Uncommon", desc: "Access granted.", iconName: "Key", value: 150 },
  { id: 'r1', name: "The Algorithm", rarity: "Rare", desc: "It knows what you want.", iconName: "Cpu", value: 400 },
  { id: 'r2', name: "Encrypted Drive", rarity: "Rare", desc: "Secrets within.", iconName: "HardDrive", value: 400 },
  { id: 'r3', name: "Neural Node", rarity: "Rare", desc: "Learning capacity.", iconName: "Brain", value: 400 },
  { id: 'r4', name: "Global Network", rarity: "Rare", desc: "Connected everywhere.", iconName: "Globe", value: 400 },
  { id: 'e1', name: "Mainframe", rarity: "Epic", desc: "Unlimited power.", iconName: "Database", value: 1000 },
  { id: 'e2', name: "Quantum Bit", rarity: "Epic", desc: "0 and 1 simultaneously.", iconName: "Zap", value: 1000 },
  { id: 'l1', name: "The Singularity", rarity: "Legendary", desc: "Intelligence explosion.", iconName: "Dna", value: 5000 },
];

const SKILL_DETAILS = {
  inc: { desc: "Raw earning power.", unlocks: [{ level: 10, title: "Paycheck" }, { level: 50, title: "$100k Club" }, { level: 99, title: "Tycoon" }] },
  cod: { desc: "Coding ability.", unlocks: [{ level: 10, title: "Hello World" }, { level: 50, title: "Senior Dev" }, { level: 99, title: "Singularity" }] },
  cnt: { desc: "Influence.", unlocks: [{ level: 10, title: "Voice" }, { level: 50, title: "Monetized" }, { level: 99, title: "Cult Leader" }] },
  ai: { desc: "AI Ops.", unlocks: [{ level: 10, title: "Prompter" }, { level: 50, title: "Automator" }, { level: 99, title: "Necromancer" }] },
  sec: { desc: "Financial Security.", unlocks: [{ level: 10, title: "Buffer" }, { level: 50, title: "Insured" }, { level: 99, title: "Immortal" }] },
  vit: { desc: "Health.", unlocks: [{ level: 10, title: "Walker" }, { level: 50, title: "Athlete" }, { level: 99, title: "Olympian" }] },
  wis: { desc: "Wisdom.", unlocks: [{ level: 10, title: "Will" }, { level: 50, title: "Trust" }, { level: 99, title: "Dynasty" }] },
  net: { desc: "Network.", unlocks: [{ level: 10, title: "Lurker" }, { level: 50, title: "Leader" }, { level: 99, title: "The Hub" }] },
  ast: { desc: "Assets.", unlocks: [{ level: 10, title: "Stacker" }, { level: 50, title: "Standard" }, { level: 99, title: "Dragon" }] },
  flo: { desc: "Cash Flow.", unlocks: [{ level: 10, title: "Positive" }, { level: 50, title: "Surplus" }, { level: 99, title: "Infinite" }] },
  inv: { desc: "Investing.", unlocks: [{ level: 10, title: "Sower" }, { level: 50, title: "Compounder" }, { level: 99, title: "Harvest" }] },
  est: { desc: "Real Estate.", unlocks: [{ level: 10, title: "Tenant" }, { level: 50, title: "Portfolio" }, { level: 99, title: "Baron" }] },
  dis: { desc: "Discipline. The fuel for all other skills.", unlocks: [{ level: 10, title: "Routine" }, { level: 50, title: "Iron Will" }, { level: 99, title: "Monk Mode" }] },
};

const SHOP_ITEMS = {
  boosters: [
    { id: 'b1', name: "Coding Bootcamp", cost: 500, effect: "+5,000 Code XP", iconName: "Code", skillId: 'cod', xpAmount: 5000, color: "text-blue-400", rarity: "Rare", type: "Booster" },
    { id: 'b2', name: "Investment Seminar", cost: 300, effect: "+3,000 Invest XP", iconName: "TrendingUp", skillId: 'inv', xpAmount: 3000, color: "text-emerald-400", rarity: "Uncommon", type: "Booster" },
    { id: 'b3', name: "Networking Ticket", cost: 200, effect: "+2,000 Network XP", iconName: "Users", skillId: 'net', xpAmount: 2000, color: "text-purple-400", rarity: "Uncommon", type: "Booster" },
    { id: 'b4', name: "AI Symposium", cost: 600, effect: "+6,000 AI XP", iconName: "Sparkles", skillId: 'ai', xpAmount: 6000, color: "text-pink-400", rarity: "Epic", type: "Booster" },
    { id: 'b5', name: "Real Estate Course", cost: 1000, effect: "+10,000 Estate XP", iconName: "Hammer", skillId: 'est', xpAmount: 10000, color: "text-amber-600", rarity: "Legendary", type: "Booster" },
    { id: 'b6', name: "Sales Masterclass", cost: 400, effect: "+4,000 Income XP", iconName: "DollarSign", skillId: 'inc', xpAmount: 4000, color: "text-green-400", rarity: "Rare", type: "Booster" },
  ],
  gear: [
    { id: 'g1', name: "Estate Deed", cost: 50000, effect: "Unlocks Estate Planning", iconName: "Building", rarity: "Legendary", color: "text-amber-400", type: "Item" },
    { id: 'g2', name: "Server Farm", cost: 15000, effect: "Passive Income Gen", iconName: "Server", rarity: "Epic", color: "text-blue-500", type: "Item" },
    { id: 'g3', name: "Angel Syndicate", cost: 10000, effect: "Access to Deal Flow", iconName: "Users", rarity: "Epic", color: "text-purple-500", type: "Item" },
    { id: 'g4', name: "Gold Vault", cost: 5000, effect: "Secure Storage", iconName: "Lock", rarity: "Rare", color: "text-yellow-600", type: "Item" },
    { id: 'g5', name: "Studio Setup", cost: 2500, effect: "+Content Quality", iconName: "Camera", rarity: "Rare", color: "text-red-400", type: "Item" },
    { id: 'g6', name: "Smart Watch", cost: 1200, effect: "+Daily Vitality XP", iconName: "Watch", rarity: "Rare", color: "text-emerald-400", type: "Item" },
    { id: 'g7', name: "Standing Desk", cost: 800, effect: "Reduces Fatigue", iconName: "Monitor", rarity: "Uncommon", color: "text-slate-300", type: "Item" },
    { id: 'g8', name: "White Noise", cost: 400, effect: "+Focus Regen", iconName: "Mic", rarity: "Common", color: "text-slate-400", type: "Item" },
    { id: 'g9', name: "Library Access", cost: 2000, effect: "+Wisdom Gain", iconName: "Library", rarity: "Rare", color: "text-indigo-400", type: "Item" },
    { id: 'g10', name: "Green Screen", cost: 600, effect: "+Content Polish", iconName: "Grid", rarity: "Uncommon", color: "text-green-500", type: "Item" }
  ],
  packs: [
    { id: 'p1', name: "Standard Pack", cost: 500, effect: "3 Cards", iconName: "Package", rarity: "Common", color: "text-white", type: "Pack", cardCount: 3, weights: { c: 60, u: 30, r: 8, e: 1.9, l: 0.1 } },
    { id: 'p2', name: "Epic Pack", cost: 1200, effect: "5 Cards (Better Odds)", iconName: "Sparkles", rarity: "Epic", color: "text-purple-400", type: "Pack", cardCount: 5, weights: { c: 20, u: 40, r: 30, e: 9, l: 1 } },
    { id: 'p3', name: "Legend Pack", cost: 2500, effect: "5 Cards (High Odds)", iconName: "Crown", rarity: "Legendary", color: "text-amber-400", type: "Pack", cardCount: 5, weights: { c: 0, u: 10, r: 40, e: 40, l: 10 } },
    { id: 'bx1', name: "Standard Box", cost: 2000, effect: "5x Standard Packs", iconName: "Box", rarity: "Common", color: "text-white", type: "Box", packId: 'p1', count: 5 },
    { id: 'bx2', name: "Epic Box", cost: 4800, effect: "5x Epic Packs", iconName: "Box", rarity: "Epic", color: "text-purple-400", type: "Box", packId: 'p2', count: 5 },
    { id: 'bx3', name: "Legend Box", cost: 10000, effect: "5x Legend Packs", iconName: "Box", rarity: "Legendary", color: "text-amber-400", type: "Box", packId: 'p3', count: 5 },
  ]
};

// --- INITIAL DATA ---
const initialData = {
  setupComplete: true, 
  lastVersion: null, 
  cash: 5000,
  discipline: 5000, 
  streak: 0, 
  lastMaintenance: null,
  monthlyExpenses: 3200,
  monthlyIncome: 4500,
  // PRE-CALIBRATED: +100 Sec XP (Debt), +200 Sec XP (No Savings) = 300 Sec XP Total
  bonusXP: { inc: 0, cod: 0, cnt: 0, ai: 0, sec: 300, vit: 0, wis: 0, net: 0, ast: 0, flo: 0, inv: 0, est: 0, dis: 0 },
  assets: { realEstate: 0, crypto: 1200, metals: 0, digitalIP: 2500, stocks: 0, audience: 600 },
  liabilities: { debt: 2000, mortgage: 0 },
  wellness: { energy: 80, hydration: 60, focus: 45 },
  inventory: [
    { id: 1, name: "Windows 10 PC", type: "Tech", desc: "Command Station", iconName: "Monitor", rarity: "Rare" },
    { id: 2, name: "Vault Code", type: "Security", desc: "Access Keys", iconName: "FileKey", rarity: "Legendary" },
  ],
  cards: [], 
  achievements: [
    // EASY
    { id: 'q1', title: "Hydrated", desc: "Drink a glass of water.", xp: 100, category: "Vitality", completed: false, difficulty: "Easy" },
    { id: 'q2', title: "Hello World", desc: "Write 1 line of code.", xp: 150, category: "Code", completed: false, difficulty: "Easy" },
    { id: 'q3', title: "First Step", desc: "Walk 1,000 steps.", xp: 100, category: "Vitality", completed: false, difficulty: "Easy" },
    { id: 'q4', title: "Lurker", desc: "Join a Discord server.", xp: 150, category: "Network", completed: false, difficulty: "Easy" },
    { id: 'q5', title: "Penny Saved", desc: "Save $10 this week.", xp: 200, category: "Security", completed: false, difficulty: "Easy" },
    { id: 'q6', title: "Idea Log", desc: "Write down one business idea.", xp: 150, category: "Wisdom", completed: false, difficulty: "Easy" },
    { id: 'q7', title: "Read a Page", desc: "Read 1 page of a book.", xp: 100, category: "Wisdom", completed: false, difficulty: "Easy" },
    { id: 'q8', title: "Clean Desk", desc: "Organize your workspace.", xp: 100, category: "Discipline", completed: false, difficulty: "Easy" },
    
    // MEDIUM
    { id: 'q10', title: "Gym Rat", desc: "Workout 3x in a week.", xp: 1000, category: "Vitality", completed: false, difficulty: "Medium" },
    { id: 'q11', title: "Freelancer", desc: "Earn your first $100 online.", xp: 1500, category: "Income", completed: false, difficulty: "Medium" },
    { id: 'q12', title: "Stacker", desc: "Buy 1oz of Silver.", xp: 1200, category: "Assets", completed: false, difficulty: "Medium" },
    { id: 'q13', title: "Content Creator", desc: "Post 1 video or article.", xp: 1000, category: "Content", completed: false, difficulty: "Medium" },
    { id: 'q14', title: "Debt Chipper", desc: "Pay off $500 of debt.", xp: 2000, category: "Security", completed: false, difficulty: "Medium" },
    { id: 'q15', title: "Script Kiddie", desc: "Build a simple calculator app.", xp: 2500, category: "Code", completed: false, difficulty: "Medium" },
    { id: 'q16', title: "Cold Call", desc: "Reach out to 5 prospects.", xp: 1500, category: "Network", completed: false, difficulty: "Medium" },
    
    // HARD
    { id: 'def_1', title: "Fortress of Solitude", desc: "Save 3 months expenses ($9.6k)", xp: 5000, category: 'Security', completed: false, difficulty: "Hard" },
    { id: 'def_3', title: "Debt Slayer", desc: "Eliminate all consumer debt", xp: 8000, category: 'Security', completed: false, difficulty: "Hard" },
    { id: 'sk_2', title: "The First Dollar", desc: "Earn $1,000 online total", xp: 5000, category: 'Income', completed: false, difficulty: "Hard" },
    { id: 'q17', title: "Landlord", desc: "Acquire your first rental property.", xp: 15000, category: "Estate", completed: false, difficulty: "Hard" },
    { id: 'q18', title: "Gold Bug", desc: "Acquire 1oz of Gold.", xp: 6000, category: "Assets", completed: false, difficulty: "Hard" },
    { id: 'q19', title: "1000 True Fans", desc: "Reach 1,000 Followers.", xp: 10000, category: "Content", completed: false, difficulty: "Hard" },
    { id: 'q20', title: "SaaS Founder", desc: "Launch a paid product.", xp: 20000, category: "Code", completed: false, difficulty: "Hard" },
    { id: 'q21', title: "1000lb Club", desc: "Squat/Bench/Deadlift 1000lbs total.", xp: 10000, category: "Vitality", completed: false, difficulty: "Hard" },
    { id: 'q22', title: "Angel Investor", desc: "Invest in a startup.", xp: 12000, category: "Invest", completed: false, difficulty: "Hard" }
  ],
  widgetConfig: { 
    // DEFAULT VISIBILITY: TRUE for all core widgets
    welcome: true, contract: true, skills: true, vitals: true, shop: true, grind: true,
    player_card: true, p_vitals: true, financial_overview: true, unified_menu: true, active_contracts: true, collection: true,
    asset_wallet: true
  },
  layout: {
    home: {
        left: ['daily_ops', 'contract'], // Default Left Column
        right: ['shop', 'skills'] // Default Right Column
    },
    profile: {
        left: ['player_card', 'p_vitals'],
        center: ['financial_overview', 'unified_menu'],
        right: ['active_contracts', 'collection']
    },
    vault: {
        left: ['financial_overview'],
        center: ['unified_menu'],
        right: ['collection', 'asset_wallet']
    }
  }
};

// --- HELPER FUNCTIONS ---
const getRarityColor = (rarity) => {
  switch(rarity) {
      case 'Legendary': return 'text-amber-400 border-amber-500/50 bg-amber-900/20';
      case 'Epic': return 'text-purple-400 border-purple-500/50 bg-purple-900/20';
      case 'Rare': return 'text-blue-400 border-blue-500/50 bg-blue-900/20';
      case 'Uncommon': return 'text-emerald-400 border-emerald-500/50 bg-emerald-900/20';
      default: return 'text-slate-400 border-slate-700 bg-slate-800/50';
  }
};

const getRarityGradient = (rarity) => {
    switch(rarity) {
        case 'Legendary': return 'from-amber-900/50 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-900/20';
        case 'Epic': return 'from-purple-900/50 to-slate-900 border-purple-500/50 shadow-lg shadow-purple-900/20';
        case 'Rare': return 'from-blue-900/50 to-slate-900 border-blue-500/50 shadow-lg shadow-blue-900/20';
        case 'Uncommon': return 'from-emerald-900/50 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-900/20';
        default: return 'from-slate-800 to-slate-900 border-slate-700';
    }
};

const sanitizeData = (loadedData) => {
    // Helper to ensure all necessary fields exist
    const safe = { ...initialData, ...loadedData };
    
    // Deep merge layouts to prevent crash if a key is missing
    safe.layout = { 
        home: { left: [], right: [], ...loadedData.layout?.home },
        profile: { left: [], center: [], right: [], ...loadedData.layout?.profile },
        vault: { left: [], center: [], right: [], ...loadedData.layout?.vault }
    };
    // Ensure widgetConfig exists
    safe.widgetConfig = { ...initialData.widgetConfig, ...loadedData.widgetConfig };
    
    // Ensure inventory exists
    if (!Array.isArray(safe.inventory)) safe.inventory = initialData.inventory;
    
    return safe;
};

// --- SUB-COMPONENTS ---
const WellnessBar = ({ label, value, iconName, onFill, color, task, tasks }) => {
    const [taskIndex, setTaskIndex] = useState(0);
    const handleMouseEnter = () => {
        if (tasks && tasks.length > 0) {
            setTaskIndex(prev => (prev + 1) % tasks.length);
        }
    };
    const displayTask = tasks && tasks.length > 0 ? tasks[taskIndex] : task;
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

const InventoryGrid = ({ inventory, mp }) => {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex justify-between items-center p-2 bg-[#131313] border border-slate-800 rounded shrink-0">
         <div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><RenderIcon name="Coins" size={14}/> Discipline Pouch</div>
         <div className="font-mono text-white text-sm">{mp} DSC</div>
      </div>
      <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 custom-scrollbar">
          {inventory?.map((item, i) => (
              <div key={item.id || i} className={`aspect-square rounded border flex items-center justify-center text-slate-400 hover:text-white group relative transition-all bg-gradient-to-br ${getRarityGradient(item.rarity)}`}>
                  <RenderIcon name={item.iconName} size={20} />
                  <div className="absolute bottom-full right-0 w-32 bg-black p-2 rounded border border-slate-700 text-xs hidden group-hover:block z-20 shadow-xl pointer-events-none">
                      <div className={`font-bold text-amber-500`}>{item.name}</div>
                      <div className="text-[10px] text-slate-300">{item.desc}</div>
                      <div className="text-[9px] text-slate-500 mt-1 uppercase">{item.rarity}</div>
                  </div>
              </div>
          ))}
          {[...Array(Math.max(0, INVENTORY_SLOTS - (inventory?.length || 0)))].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-[#1a1a1a] rounded border border-slate-800/50"></div>
          ))}
      </div>
    </div>
  );
};

const ContractWidget = ({ contracts, onToggle, title = "Contracts" }) => {
    const [filter, setFilter] = useState('active');
    const [page, setPage] = useState(0);
    // Safe check for contracts array
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

const CollectionBinder = ({ cards, onSell }) => {
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

const SkillMatrix = ({ skills, onItemClick }) => {
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

const DynamicStat = ({ label, value, sub, colors, tooltip }) => (
  <div className="p-4 rounded-lg relative group" style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: `1px solid ${colors.border}` }}>
    <div className="text-xs text-slate-400 uppercase mb-1">{label}</div>
    <div className="text-xl font-bold text-white font-mono">{value}</div>
    <div className="text-xs text-amber-500 mt-1">{sub}</div>
    {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-slate-700 text-[10px] text-slate-300 rounded shadow-xl hidden group-hover:block z-50 pointer-events-none text-center">
            {tooltip}
        </div>
    )}
  </div>
);

const MetricCard = ({ title, value, iconName, trend, colors, tooltip }) => (
  <div className="p-5 rounded-xl relative group bg-black/20 border border-slate-700">
    <div className="flex justify-between mb-2 opacity-50" style={{ color: '#94a3b8' }}><RenderIcon name={iconName} /></div>
    <div className="text-2xl font-bold text-white font-mono">{value}</div>
    <div className="text-xs text-slate-500 font-bold mt-1">{title}</div>
    {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-slate-700 text-[10px] text-slate-300 rounded shadow-xl hidden group-hover:block z-50 pointer-events-none text-center">
            {tooltip}
        </div>
    )}
  </div>
);

const AssetBar = ({ label, value, total, color }) => {
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

const InputGroup = ({ title, children }) => (
    <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const InputField = ({ label, value, onChange }) => (
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

const SkillDetailModal = ({ skill, onClose, colors }) => {
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

const MasteryLogModal = ({ onClose, skills, colors }) => {
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
                                   <div key={idx} className={`flex items-center gap-3 p-2 rounded ${isUnlocked ? 'bg-emerald-900/20' : 'opacity-40'}`}>
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isUnlocked ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-slate-500'}`}>{u.level}</div>
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

export default function VaultDashboard() {
  // --- STATE ---
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_data_v24.1'); 
      let loaded = saved ? JSON.parse(saved) : initialData;
      return sanitizeData(loaded);
    } catch (e) {
      return initialData;
    }
  });
  
  const [activeTab, setActiveTab] = useState('dynamic'); 
  const [homeWidgetTab, setHomeWidgetTab] = useState('skills'); 
  const [profileWidgetTab, setProfileWidgetTab] = useState('skills'); 
  const [dailyOpsTab, setDailyOpsTab] = useState('vitals'); 
  const [shopTab, setShopTab] = useState('boosters');
  const [miniShopTab, setMiniShopTab] = useState('boosters'); 
  const [questFilter, setQuestFilter] = useState('active'); 
  const [questPage, setQuestPage] = useState(0); 
  const [rewardModal, setRewardModal] = useState(null); 
  const [skillModal, setSkillModal] = useState(null); 
  const [masteryLogOpen, setMasteryLogOpen] = useState(false); 
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [packOpening, setPackOpening] = useState(null);
  const [dragItem, setDragItem] = useState(null);

  const colors = {
    bg: "#2b3446",
    border: "#404e6d",
    accentSecondary: "#78643e",
    accentPrimary: "#e1b542"
  };

  // Function to ensure data integrity
  function sanitizeData(loadedData) {
    const safe = { ...initialData, ...loadedData };
    safe.layout = { 
        home: { left: [], right: [], ...loadedData?.layout?.home },
        profile: { left: [], center: [], right: [], ...loadedData?.layout?.profile },
        vault: { left: [], center: [], right: [], ...loadedData?.layout?.vault }
    };
    safe.widgetConfig = { ...initialData.widgetConfig, ...loadedData?.widgetConfig };
    if (!Array.isArray(safe.inventory)) safe.inventory = initialData.inventory;
    return safe;
  }

  const resetToDefault = () => {
    if(window.confirm("Are you sure you want to factory reset the layout and data?")) {
        localStorage.removeItem('vault_data_v24.1');
        setData(initialData);
        window.location.reload();
    }
  }

  useEffect(() => {
    localStorage.setItem('vault_data_v24.1', JSON.stringify(data));
  }, [data]);

  // --- VITAL DECAY ---
  useEffect(() => {
    const timer = setInterval(() => {
        setData(prev => ({
            ...prev,
            wellness: {
                energy: Math.max(0, prev.wellness.energy - 1),
                hydration: Math.max(0, prev.wellness.hydration - 1),
                focus: Math.max(0, prev.wellness.focus - 1)
            }
        }));
    }, 30000); 
    return () => clearInterval(timer);
  }, []);

  // --- CALCULATIONS ---
  const totalAssets = Object.values(data.assets || {}).reduce((a, b) => Number(a || 0) + Number(b || 0), 0) + Number(data.cash || 0);
  const totalLiabilities = Object.values(data.liabilities || {}).reduce((a, b) => Number(a || 0) + Number(b || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  const monthlyCashFlow = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
  const runwayMonths = ((data.cash || 0) / (data.monthlyExpenses || 1)).toFixed(1);

  const calculateSkills = () => {
    const calcLevel = (xp) => Math.max(1, Math.min(Math.floor(25 * Math.log10((xp / 100) + 1)), 99));
    const getXP = (base, id) => (Number(base) || 0) + (data.bonusXP?.[id] || 0);
    const BASE_DEV_XP = 35000; const BASE_SOCIAL_XP = 15000; const BASE_AGE_XP = 85000; 

    return [
      { id: 'inc', name: "Income", iconName: "Sword", level: calcLevel(getXP((data.monthlyIncome || 0) * 12, 'inc')), label: "Active Earnings" },
      { id: 'cod', name: "Code", iconName: "Code", level: calcLevel(getXP(BASE_DEV_XP + ((data.assets.digitalIP || 0) * 5), 'cod')), label: "Dev Skills" },
      { id: 'cnt', name: "Content", iconName: "Target", level: calcLevel(getXP(BASE_SOCIAL_XP + ((data.assets.audience || 0) * 50), 'cnt')), label: "Reach" },
      { id: 'ai', name: "AI Ops", iconName: "Sparkles", level: calcLevel(getXP(40000, 'ai')), label: "Leverage" },
      { id: 'sec', name: "Security", iconName: "Shield", level: calcLevel(getXP((data.cash || 0) + (((data.cash || 0) / (data.monthlyExpenses || 1)) * 5000), 'sec')), label: "Runway" },
      { id: 'vit', name: "Vitality", iconName: "Heart", level: calcLevel(getXP(BASE_AGE_XP, 'vit')), label: "Health" },
      { id: 'wis', name: "Wisdom", iconName: "Star", level: calcLevel(getXP(30000 + (data.achievements.filter(a => a.completed).length * 5000), 'wis')), label: "Future Proofing" },
      { id: 'net', name: "Network", iconName: "Users", level: calcLevel(getXP(BASE_SOCIAL_XP + ((data.assets.audience || 0) * 100), 'net')), label: "Community" },
      { id: 'ast', name: "Assets", iconName: "Pickaxe", level: calcLevel(getXP((data.assets.crypto || 0) + (data.assets.metals || 0), 'ast')), label: "Hard Assets" },
      { id: 'flo', name: "Flow", iconName: "Activity", level: calcLevel(getXP(((data.monthlyIncome || 0) - (data.monthlyExpenses || 0)) * 20, 'flo')), label: "Cash Flow" },
      { id: 'inv', name: "Invest", iconName: "Sprout", level: calcLevel(getXP(Math.max((data.assets.stocks || 0) + (data.assets.crypto || 0), 0), 'inv')), label: "Growth" },
      { id: 'est', name: "Estate", iconName: "Hammer", level: calcLevel(getXP((data.assets.realEstate || 0), 'est')), label: "Real Estate" },
      { id: 'dis', name: "Discipline", iconName: "Flame", level: calcLevel(getXP(0, 'dis')), label: "Willpower" },
    ];
  };

  const playerSkills = calculateSkills();
  const sortedSkills = [...playerSkills].sort((a, b) => b.level - a.level); 
  const totalLevel = playerSkills.reduce((sum, skill) => sum + skill.level, 0);
  const getSkillLvl = (id) => playerSkills.find(s => s.id === id)?.level || 1;
  const combatLevel = Math.floor(0.25 * (getSkillLvl('sec') + getSkillLvl('vit') + Math.floor(getSkillLvl('wis') / 2)) + 0.325 * (getSkillLvl('inc') + getSkillLvl('cod')));

  // --- ACTIONS ---
  const updateWellness = (type, amount) => {
    const now = new Date().toDateString();
    const isNewDay = data.lastMaintenance !== now;
    setData(prev => ({
      ...prev,
      wellness: { ...prev.wellness, [type]: Math.min(100, Math.max(0, (prev.wellness?.[type] || 0) + amount)) },
      discipline: prev.discipline + (amount > 0 ? 5 : 0),
      bonusXP: { ...prev.bonusXP, dis: (prev.bonusXP?.dis || 0) + 50 },
      streak: isNewDay && amount > 0 ? prev.streak + 1 : prev.streak,
      lastMaintenance: now
    }));
    if (amount > 0) showToast(`+5 DSC | +50 Discipline XP`, 'success');
  };

  const manualGrind = (skillKey, mpReward, energyCost) => {
    if (data.wellness.energy >= energyCost) {
      setData(prev => ({
        ...prev,
        wellness: { ...prev.wellness, energy: prev.wellness.energy - energyCost },
        bonusXP: { ...prev.bonusXP, [skillKey]: (prev.bonusXP?.[skillKey] || 0) + 10 },
        discipline: prev.discipline + mpReward
      }));
      showToast(`+10 ${skillKey.toUpperCase()} XP | +${mpReward} DSC`, 'success');
    } else {
      showToast("Not enough energy!", 'error');
    }
  };

  const purchaseItem = (item, category) => {
    if (data.discipline >= item.cost) {
      let newData = { ...data, discipline: data.discipline - item.cost };
      if (category === 'boosters') {
          newData.bonusXP = { ...newData.bonusXP, [item.skillId]: (newData.bonusXP?.[item.skillId] || 0) + item.xpAmount };
          showToast(`Boosted ${item.skillId} by ${item.xpAmount} XP!`, 'success');
      } else if (category === 'gear') {
          if (data.inventory.length >= INVENTORY_SLOTS) { showToast("Inventory Full!", 'error'); return; }
          newData.inventory = [...newData.inventory, { ...item, id: Date.now() }];
          showToast(`Purchased ${item.name}`, 'success');
      } else if (category === 'packs') {
          if (item.type === 'Box') {
             const totalCards = [];
             for(let i=0; i<item.count; i++) { totalCards.push(...generatePack(item.packId)); }
             setPackOpening(totalCards); 
             const currentCards = data.cards || [];
             newData.cards = [...currentCards, ...totalCards.map(c => c.id)]; 
          } else {
             const newCards = generatePack(item.id);
             setPackOpening(newCards);
             const currentCards = data.cards || [];
             newData.cards = [...currentCards, ...newCards.map(c => c.id)]; 
          }
      }
      setData(newData);
    } else {
      showToast("Not enough DSC", 'error');
    }
  };
  
  const sellCard = (cardId, value) => {
      const index = data.cards.indexOf(cardId);
      if (index > -1) {
          const newCards = [...data.cards];
          newCards.splice(index, 1); 
          setData(prev => ({
              ...prev,
              cards: newCards,
              discipline: prev.discipline + value
          }));
          showToast(`Sold card for ${value} DSC`, 'success');
      }
  };

  const generatePack = (packId) => {
      const packDef = SHOP_ITEMS.packs.find(p => p.id === packId);
      const weights = packDef ? packDef.weights : { c: 60, u: 30, r: 8, e: 1.9, l: 0.1 };
      const count = packDef ? packDef.cardCount : 3;
      const newCards = [];
      for(let i=0; i<count; i++) {
        const rand = Math.random() * 100;
        let rarity = 'Common';
        if (rand > (100 - weights.l)) rarity = 'Legendary';
        else if (rand > (100 - weights.l - weights.e)) rarity = 'Epic';
        else if (rand > (100 - weights.l - weights.e - weights.r)) rarity = 'Rare';
        else if (rand > (100 - weights.l - weights.e - weights.r - weights.u)) rarity = 'Uncommon';
        const pool = CARD_DATABASE.filter(c => c.rarity === rarity);
        const card = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : CARD_DATABASE[0];
        newCards.push(card);
      }
      return newCards;
  };

  const updateAsset = (key, value) => setData(prev => ({ ...prev, assets: { ...prev.assets, [key]: parseInt(value) || 0 } }));
  const toggleWidget = (key) => setData(prev => ({ ...prev, widgetConfig: { ...prev.widgetConfig, [key]: !prev.widgetConfig?.[key] } }));
  const showToast = (msg, type = 'info') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const toggleAchievement = (id) => {
    const achievement = data.achievements.find(a => a.id === id);
    const isCompleting = !achievement.completed;
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    }));
    if (isCompleting) {
      setRewardModal(achievement);
      showToast(`Unlocked: ${achievement.title}`, 'success');
    }
  };

  // Filtered Contracts Logic
  const activeContracts = data.achievements.filter(a => !a.completed);
  const completedContracts = data.achievements.filter(a => a.completed);
  const sortedActive = [...activeContracts].sort((a,b) => a.xp - b.xp); 
  const priorityContract = sortedActive[0] || { title: "All Complete", desc: "You are a legend.", xp: 0 };
  const displayContracts = questFilter === 'active' ? sortedActive : 
                        questFilter === 'completed' ? completedContracts : 
                        [...sortedActive, ...completedContracts];


  // --- DRAG HANDLERS ---
  const handleDragStart = (e, widgetId, column, context) => { 
      if (!editMode) return; 
      setDragItem({ id: widgetId, column, context }); 
      e.dataTransfer.effectAllowed = 'move'; 
  };
  
  const handleDragOver = (e) => { if (!editMode) return; e.preventDefault(); };
  
  const handleDrop = (e, targetColumn, targetIndex, context) => {
    if (!editMode || !dragItem || dragItem.context !== context) return;
    const newLayout = { ...data.layout };
    const layoutKey = context; 
    
    // Ensure layout array exists to prevent crash
    if (!newLayout[layoutKey] || !newLayout[layoutKey][dragItem.column]) return;

    const sourceList = [...newLayout[layoutKey][dragItem.column]];
    const targetList = dragItem.column === targetColumn ? sourceList : [...newLayout[layoutKey][targetColumn]];
    const itemIndex = sourceList.indexOf(dragItem.id);
    
    if (itemIndex === -1) return;
    
    sourceList.splice(itemIndex, 1);
    if (dragItem.column === targetColumn) { targetList.splice(targetIndex, 0, dragItem.id); newLayout[layoutKey][targetColumn] = targetList; }
    else { targetList.splice(targetIndex, 0, dragItem.id); newLayout[layoutKey][dragItem.column] = sourceList; newLayout[layoutKey][targetColumn] = targetList; }
    setData(prev => ({ ...prev, layout: newLayout }));
    setDragItem(null);
  };

  // --- WIDGET RENDERER ---
  const renderWidget = (widgetId) => {
    const isVisible = data.widgetConfig?.[widgetId];
    if (!isVisible && !editMode) return null;
    const commonWrapperClass = `rounded-xl border shadow-lg relative mb-6 transition-all ${editMode ? 'cursor-move border-dashed border-slate-500 hover:bg-slate-800/50' : 'bg-[#1e1e1e] border-[#404e6d]'} ${!isVisible && editMode ? 'opacity-50' : ''}`;
    const toggleBtn = editMode && <button onClick={() => toggleWidget(widgetId)} className="absolute top-2 right-2 p-1 bg-black/50 rounded z-20 text-white hover:bg-black">{isVisible ? <RenderIcon name="Eye" size={14}/> : <RenderIcon name="EyeOff" size={14}/>}</button>;
    const dragHandle = editMode && <div className="absolute top-2 left-2 text-slate-500"><RenderIcon name="GripVertical" size={16}/></div>;

    switch(widgetId) {
      case 'daily_ops': 
        return (
          <div className={`${commonWrapperClass} p-4 h-fit`}>
             {toggleBtn}{dragHandle}
             <div className="flex justify-between items-center mb-4 pl-4">
                <div className="flex gap-4">
                   <button onClick={() => setDailyOpsTab('vitals')} className={`text-xs font-bold uppercase flex items-center gap-2 ${dailyOpsTab === 'vitals' ? 'text-white' : 'text-slate-500'}`}><RenderIcon name="Activity" size={14}/> Vitals</button>
                   <button onClick={() => setDailyOpsTab('grind')} className={`text-xs font-bold uppercase flex items-center gap-2 ${dailyOpsTab === 'grind' ? 'text-white' : 'text-slate-500'}`}><RenderIcon name="MousePointer" size={14}/> Grind</button>
                </div>
                <div className="text-[10px] text-amber-500 font-mono flex items-center gap-1"><RenderIcon name="Flame" size={12}/> Streak: {data.streak}</div>
             </div>
             {dailyOpsTab === 'vitals' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" tasks={["Sleep 8h", "Power Nap", "Sunlight"]} /><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" tasks={["Drink Water", "Electrolytes", "Tea"]} /><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" tasks={["Deep Work", "Meditate", "No Phone"]} /></div>}
             {dailyOpsTab === 'grind' && <div className="grid grid-cols-4 gap-2 animate-in fade-in">{[{k:'cod',l:'Write Code',c:'text-blue-400',i:"Code",e:5,r:10},{k:'net',l:'Network',c:'text-purple-400',i:"Users",e:5,r:10},{k:'cnt',l:'Post Content',c:'text-amber-400',i:"Target",e:5,r:10},{k:'inc',l:'Freelance',c:'text-emerald-400',i:"DollarSign",e:10,r:10}].map((g,i)=><button key={i} onClick={() => manualGrind(g.k, g.r, g.e)} className="p-3 bg-[#2a2a2a] hover:bg-[#333] rounded border border-slate-700 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"><RenderIcon name={g.i} size={20} className={g.c}/><span className="text-[10px] font-bold text-slate-300">{g.l}</span><span className="text-[9px] text-slate-500">-{g.e} NRG</span></button>)}</div>}
          </div>
        );
      case 'contract': 
        return (
           <div className={`${commonWrapperClass} p-0 overflow-hidden bg-[#1e1e1e] h-fit`}>
              {toggleBtn}{dragHandle}
              <div className="p-6 relative" style={{ background: `linear-gradient(90deg, ${colors.accentSecondary}, ${colors.accentPrimary})` }}>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                      <div><div className="text-xs font-bold text-black/60 uppercase tracking-wider">Priority Objective</div><h3 className="text-xl font-bold text-white">{priorityContract.title}</h3></div>
                      <div className="bg-black/30 px-2 py-1 rounded text-white font-mono font-bold text-xs">+{priorityContract.xp} XP</div>
                  </div>
                  <p className="text-white/80 text-sm mb-4 relative z-10">{priorityContract.desc}</p>
              </div>
              <div className="p-0 bg-[#1e1e1e]">
                  <ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" />
              </div>
           </div>
        );
        // ... (Other cases: shop, skills, player_card, etc. remain identical but using updated props like displayContracts)
        case 'skills':
        return (
          <div className={`${commonWrapperClass} p-6 h-fit flex flex-col`}>
             {toggleBtn}{dragHandle}
             <div className="flex space-x-2 mb-6 border-b border-slate-700 pb-2 overflow-x-auto pl-4">
                {['skills', 'inventory', 'contracts'].map(tab => (
                   <button key={tab} onClick={() => setHomeWidgetTab(tab)} className={`text-[10px] font-bold uppercase px-3 py-2 rounded transition-all whitespace-nowrap ${homeWidgetTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>{tab}</button>
                ))}
             </div>
             {homeWidgetTab === 'skills' && <SkillMatrix skills={playerSkills} onItemClick={setSkillModal} />}
             {homeWidgetTab === 'inventory' && <InventoryGrid inventory={data.inventory} mp={data.discipline} />}
             {homeWidgetTab === 'contracts' && <ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" />}
          </div>
        );
      case 'shop':
        return (
          <div className={`${commonWrapperClass} p-4 h-fit`}>
             {toggleBtn}{dragHandle}
             <div className="flex justify-between items-center mb-4 pl-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><RenderIcon name="ShoppingBag" size={14}/> Black Market</h3>
                 <div className="flex gap-1">
                    {['boosters', 'gear', 'packs'].map(tab => (
                        <button key={tab} onClick={() => setMiniShopTab(tab)} className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${miniShopTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}>{tab}</button>
                    ))}
                 </div>
             </div>
             <div className="space-y-2 pr-1">
                 {SHOP_ITEMS[miniShopTab].slice(0,3).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded bg-[#2a2a2a] border border-[#333] group hover:border-amber-500 transition-colors">
                       <div className="flex items-center gap-3"><span className={`${item.color}`}><RenderIcon name={item.iconName} /></span><div><div className="text-xs font-bold text-slate-200">{item.name}</div><div className="text-[9px] text-slate-500">{item.effect}</div></div></div>
                       <button onClick={() => purchaseItem(item, miniShopTab)} className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-[10px] rounded border border-emerald-800 hover:bg-emerald-500 hover:text-black transition-colors whitespace-nowrap">{item.cost} DSC</button>
                    </div>
                 ))}
                 <button onClick={() => setActiveTab('shop')} className="w-full py-2 text-xs text-slate-500 hover:text-white mt-2 border-t border-slate-700">VIEW FULL MARKET</button>
             </div>
          </div>
        );
      case 'welcome': return null; // Explicitly hidden/deprecated in this version based on user feedback
      
      // --- PROFILE WIDGETS ---
      case 'player_card': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center text-2xl">🧙‍♂️</div><div><div className="font-bold text-white">Lvl {Math.floor(totalLevel/3)} Architect</div><div className="text-xs text-amber-500 font-mono">Combat: {combatLevel}</div></div></div><div className="text-xs text-slate-400 space-y-1"><div className="flex justify-between"><span>Total Level:</span> <span className="text-white">{totalLevel} / {MAX_TOTAL_LEVEL}</span></div><div className="flex justify-between"><span>Contracts:</span> <span className="text-white">{data.achievements.filter(a=>a.completed).length}</span></div></div></div>);
      case 'p_vitals': return (<div className={`${commonWrapperClass} p-4 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Activity" size={14}/> Daily Vitals</h3><div className="space-y-4"><WellnessBar label="Energy" value={data.wellness.energy} iconName="Zap" color="bg-yellow-400" onFill={() => updateWellness('energy', 20)} task="Sleep 8h" /><WellnessBar label="Hydration" value={data.wellness.hydration} iconName="Droplet" color="bg-blue-400" onFill={() => updateWellness('hydration', 20)} task="Drink Water" /><WellnessBar label="Focus" value={data.wellness.focus} iconName="Brain" color="bg-purple-400" onFill={() => updateWellness('focus', 20)} task="Deep Work" /></div></div>);
      case 'financial_overview': return (<div className={`${commonWrapperClass} p-6 h-fit`}>{toggleBtn}{dragHandle}<h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 pl-4"><RenderIcon name="Lock" size={14}/> Financial War Room</h3><div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">NET WORTH</div><div className="font-mono text-lg text-white">${netWorth.toLocaleString()}</div></div><div className="bg-black/20 p-3 rounded"><div className="text-[10px] text-slate-400">RUNWAY</div><div className="font-mono text-lg text-emerald-400">{runwayMonths}m</div></div></div><div className="space-y-4"><AssetBar label="Real Estate" value={data.assets.realEstate} total={totalAssets} color="#10b981" /><AssetBar label="Digital IP" value={data.assets.digitalIP} total={totalAssets} color="#3b82f6" /><AssetBar label="Metals" value={data.assets.metals} total={totalAssets} color={colors.accentPrimary} /><AssetBar label="Crypto" value={data.assets.crypto} total={totalAssets} color="#a855f7" /></div></div>);
      case 'unified_menu': return (<div className={`${commonWrapperClass} p-6 h-fit flex flex-col`}>{toggleBtn}{dragHandle}<div className="flex space-x-2 mb-6 border-b border-slate-700 pb-2 overflow-x-auto pl-4">{['skills', 'inventory'].map(tab => <button key={tab} onClick={() => setProfileWidgetTab(tab)} className={`text-[10px] font-bold uppercase px-3 py-2 rounded transition-all whitespace-nowrap ${profileWidgetTab === tab ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>{tab}</button>)}</div>{profileWidgetTab === 'skills' && <SkillMatrix skills={playerSkills} onItemClick={setSkillModal} />}{profileWidgetTab === 'inventory' && <InventoryGrid inventory={data.inventory} mp={data.discipline} />}</div>);
      case 'active_contracts': return (<div className={`${commonWrapperClass} p-0 h-fit`}>{toggleBtn}{dragHandle}<div className="p-4"><h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><RenderIcon name="Flame" size={14}/> Active Contracts</h3><ContractWidget contracts={displayContracts} onToggle={toggleAchievement} title="" /></div></div>);
      case 'collection': return (<div className={`${commonWrapperClass} p-6 h-fit`}>{toggleBtn}{dragHandle}<CollectionBinder cards={data.cards} onSell={sellCard} /></div>);

      default: return null;
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-[#e1b542] selection:text-black pb-10" style={{ backgroundColor: colors.bg }}>
      {toast && <div className="fixed top-20 right-4 z-[100] bg-[#232a3a] border border-amber-500 text-white px-4 py-3 rounded shadow-xl animate-in slide-in-from-right flex items-center gap-2"><RenderIcon name="Zap" size={16} className="text-amber-500" /> <span className="text-sm font-bold">{toast.msg}</span></div>}
      
      {/* MODALS */}
      {packOpening && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-lg p-8" onClick={() => setPackOpening(null)}>
           <div className="text-center w-full max-w-4xl">
              <h2 className="text-3xl font-bold text-white mb-10 animate-bounce">PACK OPENED!</h2>
              <div className="flex justify-center gap-6 flex-wrap">
                 {packOpening.map((card, i) => (
                    <div key={i} className={`w-48 aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-center p-4 bg-[#1e1e1e] animate-in zoom-in duration-500 delay-${i*200} ${getRarityColor(card.rarity)}`}>
                       <div className="mb-4"><RenderIcon name={card.iconName} size={32} /></div>
                       <div className="font-bold text-lg mb-2">{card.name}</div>
                       <div className="text-xs uppercase tracking-wider opacity-70 mb-4">{card.rarity}</div>
                       <div className="text-xs text-center opacity-80">{card.desc}</div>
                    </div>
                 ))}
              </div>
              <div className="mt-12 text-slate-500 text-sm">Click anywhere to close</div>
           </div>
        </div>
      )}

      {skillModal && <SkillDetailModal skill={skillModal} onClose={() => setSkillModal(null)} colors={colors} />}
      {masteryLogOpen && <MasteryLogModal onClose={() => setMasteryLogOpen(false)} skills={playerSkills} colors={colors} />}

      {/* HEADER */}
      <header className="p-4 sticky top-0 z-50 shadow-xl" style={{ backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dynamic')}>
            <div className="p-2 rounded-lg text-black shadow-lg hover:scale-105 transition-transform" style={{ backgroundColor: colors.accentPrimary, boxShadow: `0 0 15px ${colors.accentPrimary}40` }}><RenderIcon name="Shield" size={24} /></div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">THE VAULT</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-1">
                <span className="text-white font-bold hidden sm:inline">{USER_NAME}</span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold"><RenderIcon name="Sword" size={12} /> {combatLevel}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><RenderIcon name="Plus" size={12} /> {data.discipline}</span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-white"><RenderIcon name="Lock" size={12} /> ${netWorth.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-white"><RenderIcon name="DollarSign" size={12} /> ${data.cash.toLocaleString()}</span>
                <span className="flex items-center gap-1" style={{color: monthlyCashFlow > 0 ? '#34d399' : '#fb7185'}}><RenderIcon name="TrendingUp" size={12} /> {monthlyCashFlow > 0 ? '+' : ''}{monthlyCashFlow.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <nav className="flex p-1 rounded-lg" style={{ border: `1px solid ${colors.border}`, backgroundColor: '#232a3a' }}>
            {[ { id: 'dynamic', icon: "LayoutDashboard", label: 'HOME' }, { id: 'profile', icon: "User", label: 'PROFILE' }, { id: 'shop', icon: "ShoppingBag", label: 'SHOP' }, { id: 'inputs', icon: "Code", label: 'INPUTS' } ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2" style={{ backgroundColor: activeTab === tab.id ? colors.accentPrimary : 'transparent', color: activeTab === tab.id ? '#000' : '#94a3b8' }}>
                <RenderIcon name={tab.icon} size={16} /> <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 relative">
        {activeTab === 'dynamic' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex justify-end mb-4">
                {editMode && (
                   <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                      <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Interface Config</div>
                      {['daily_ops', 'contract', 'skills', 'shop'].map(k => (
                         <button key={k} onClick={() => toggleWidget(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{k.replace('_',' ')}</button>
                      ))}
                   </div>
                )}
                <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${editMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-slate-700'}`}><RenderIcon name="Edit3" size={14} /> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COL */}
                <div className="lg:col-span-2 space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'left', 0, 'home')}>
                   {data.layout.home.left.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'left', 'home')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'left', index, 'home'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
                {/* RIGHT COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'right', 0, 'home')}>
                   {data.layout.home.right.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'right', 'home')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'right', index, 'home'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- SHOP TAB --- */}
        {activeTab === 'shop' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex gap-4 mb-6">
                {['boosters', 'gear', 'packs'].map(tab => (
                   <button key={tab} onClick={() => setShopTab(tab)} className={`px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all ${shopTab === tab ? 'bg-amber-500 text-black' : 'bg-[#1e1e1e] text-slate-400 hover:text-white'}`}>{tab}</button>
                ))}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOP_ITEMS[shopTab].map(item => (
                   <div key={item.id} className="bg-[#1e1e1e] rounded-xl p-6 border border-slate-700 hover:border-amber-500 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-900/50 text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-emerald-900">{item.cost} DSC</div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.color} bg-black/30`}><RenderIcon name={item.iconName} size={24} /></div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-400 mb-4">{item.effect}</p>
                      <button onClick={() => purchaseItem(item, shopTab)} className="w-full py-2 rounded bg-slate-800 hover:bg-emerald-600 text-white font-bold transition-colors">PURCHASE</button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- PROFILE TAB (Merged) --- */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-end mb-4">
                {editMode && (
                   <div className="bg-[#1e1e1e] border border-slate-700 rounded-lg p-2 flex gap-2 mr-4 items-center shadow-xl animate-in fade-in zoom-in">
                      <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider border-r border-slate-700 mr-1">Profile Config</div>
                      {['player_card', 'p_vitals', 'financial_overview', 'unified_menu', 'active_contracts', 'collection'].map(k => (
                         <button key={k} onClick={() => toggleWidget(k)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${data.widgetConfig[k] ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{k.replace(/_/g,' ')}</button>
                      ))}
                   </div>
                )}
                <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${editMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-slate-700'}`}><RenderIcon name="Edit3" size={14} /> {editMode ? 'DONE' : 'EDIT LAYOUT'}</button>
             </div>
          
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'left', 0, 'profile')}>
                   {data.layout.profile.left.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'left', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'left', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
                {/* CENTER COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'center', 0, 'profile')}>
                   {data.layout.profile.center.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'center', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'center', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
                {/* RIGHT COL */}
                <div className="space-y-6" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, 'right', 0, 'profile')}>
                   {data.layout.profile.right.map((widgetId, index) => (
                      <div key={widgetId} draggable={editMode} onDragStart={(e) => handleDragStart(e, widgetId, 'right', 'profile')} onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'right', index, 'profile'); }} onDragOver={(e) => handleDragOver(e)}>
                         {renderWidget(widgetId)}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- INPUTS TAB --- */}
        {activeTab === 'inputs' && (
          <div className="p-6 rounded-xl max-w-4xl mx-auto bg-[#2b3446] border border-[#404e6d] animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white">Update Vital Signs</h2><div className="text-xs text-slate-500 flex items-center gap-1"><RenderIcon name="Save" size={12}/> Auto-saving active</div></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <InputGroup title="Liquid & Income">
                     <InputField label="Cash on Hand ($)" value={data.cash} onChange={(v) => setData({...data, cash: parseInt(v)||0})} />
                     <InputField label="Monthly Income ($)" value={data.monthlyIncome} onChange={(v) => setData({...data, monthlyIncome: parseInt(v)||0})} />
                     <InputField label="Monthly Expenses ($)" value={data.monthlyExpenses} onChange={(v) => setData({...data, monthlyExpenses: parseInt(v)||0})} />
                 </InputGroup>
                 <InputGroup title="Investments & Assets">
                     <InputField label="Real Estate Equity ($)" value={data.assets.realEstate} onChange={(v) => updateAsset('realEstate', v)} />
                     <InputField label="Stock Portfolio ($)" value={data.assets.stocks} onChange={(v) => updateAsset('stocks', v)} />
                     <InputField label="Crypto Holdings ($)" value={data.assets.crypto} onChange={(v) => updateAsset('crypto', v)} />
                     <InputField label="Precious Metals ($)" value={data.assets.metals} onChange={(v) => updateAsset('metals', v)} />
                     <InputField label="Digital Products/IP ($)" value={data.assets.digitalIP} onChange={(v) => updateAsset('digitalIP', v)} />
                 </InputGroup>
                 <InputGroup title="Liabilities">
                     <InputField label="Mortgage Balance ($)" value={data.liabilities.mortgage} onChange={(v) => setData(prev => ({...prev, liabilities: {...prev.liabilities, mortgage: parseInt(v)||0}}))} />
                     <InputField label="Consumer Debt ($)" value={data.liabilities.debt} onChange={(v) => setData(prev => ({...prev, liabilities: {...prev.liabilities, debt: parseInt(v)||0}}))} />
                 </InputGroup>
                 <InputGroup title="Social Capital">
                    <InputField label="Total Audience Size" value={data.assets.audience} onChange={(v) => updateAsset('audience', v)} />
                 </InputGroup>
             </div>
             <button onClick={() => {
               if(window.confirm("Reset all data?")) {
                 localStorage.removeItem('vault_data_v24.1');
                 setData(initialData);
                 window.location.reload();
               }
             }} className="mt-8 flex items-center gap-2 text-xs text-red-400 hover:text-red-300"><RenderIcon name="Trash2" size={14}/> Factory Reset</button>
          </div>
        )}
      </main>
    </div>
  );
}