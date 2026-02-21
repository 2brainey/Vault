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
  Trash2, Bed, Bath, Utensils, Expand, Wrench, Play, Pause, Aperture
} from 'lucide-react';

export const USER_NAME = "Justin";
export const CURRENT_VERSION = "v33.0"; 
export const INVENTORY_SLOTS = 28;
export const BANK_SLOTS = 50;
export const MAX_SKILL_LEVEL = 99;
export const TOTAL_SKILLS = 8; 
export const MAX_TOTAL_LEVEL = MAX_SKILL_LEVEL * TOTAL_SKILLS;
export const CONTRACTS_PER_PAGE = 5;
export const CARDS_PER_PAGE = 8;
export const PLOT_COST = 1000;
export const MAX_GRID_DIMENSION = 10;

export const CONSTANTS = {
  TIME: {
    SECONDS_IN_MONTH: 2629746,
    DAILY_MS: 86400000,
    HOURLY_MS: 3600000,
  },
  TOAST: {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
  },
  UI: {
    COLORS: {
      SUCCESS: 'text-emerald-400',
      ERROR: 'text-rose-400',
      WARNING: 'text-amber-400',
      INFO: 'text-blue-400',
    }
  }
};

export const SKILL_DETAILS = {
  eng: { name: "Engineering", icon: "Code", color: "text-blue-400", desc: "Build & automate systems.", unlocks: [] },
  inf: { name: "Influence", icon: "Target", color: "text-pink-400", desc: "Reach & persuasion.", unlocks: [] },
  liq: { name: "Liquidity", icon: "DollarSign", color: "text-emerald-400", desc: "Cash flow & income.", unlocks: [] },
  equ: { name: "Equity", icon: "Pickaxe", color: "text-yellow-500", desc: "Assets & ownership.", unlocks: [] },
  vit: { name: "Vitality", icon: "Heart", color: "text-red-400", desc: "Health & energy.", unlocks: [] },
  int: { name: "Intellect", icon: "Brain", color: "text-indigo-400", desc: "Wisdom & strategy.", unlocks: [] },
  sec: { name: "Security", icon: "Shield", color: "text-slate-300", desc: "Defense & stability.", unlocks: [] },
  wil: { name: "Willpower", icon: "Flame", color: "text-amber-500", desc: "Discipline & focus.", unlocks: [] },
};

export const CARD_DATABASE = [
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

export const SHOP_ITEMS = {
  boosters: [
    { id: 'b1', name: "Coding Bootcamp", cost: 500, effect: "+5,000 Eng XP", iconName: "Code", skillId: 'eng', xpAmount: 5000, color: "text-blue-400", rarity: "Rare", type: "Booster" },
    { id: 'b2', name: "Investment Seminar", cost: 300, effect: "+3,000 Equity XP", iconName: "TrendingUp", skillId: 'equ', xpAmount: 3000, color: "text-yellow-500", rarity: "Uncommon", type: "Booster" },
    { id: 'b3', name: "Networking Ticket", cost: 200, effect: "+2,000 Inf XP", iconName: "Users", skillId: 'inf', xpAmount: 2000, color: "text-pink-400", rarity: "Uncommon", type: "Booster" },
    { id: 'b4', name: "AI Symposium", cost: 600, effect: "+6,000 Eng XP", iconName: "Sparkles", skillId: 'eng', xpAmount: 6000, color: "text-blue-400", rarity: "Epic", type: "Booster" },
    { id: 'b5', name: "Real Estate Course", cost: 1000, effect: "+10,000 Equity XP", iconName: "Hammer", skillId: 'equ', xpAmount: 10000, color: "text-yellow-500", rarity: "Legendary", type: "Booster" },
    { id: 'b6', name: "Sales Masterclass", cost: 400, effect: "+4,000 Liq XP", iconName: "DollarSign", skillId: 'liq', xpAmount: 4000, color: "text-emerald-400", rarity: "Rare", type: "Booster" },
    { id: 'b7', name: "Fortress Plan", cost: 450, effect: "+4,500 Security XP", iconName: "Shield", skillId: 'sec', xpAmount: 4500, color: "text-slate-300", rarity: "Rare", type: "Booster" },
    { id: 'b8', name: "Biohack Training", cost: 350, effect: "+3,500 Vitality XP", iconName: "Heart", skillId: 'vit', xpAmount: 3500, color: "text-red-400", rarity: "Rare", type: "Booster" },
    { id: 'b9', name: "Historical Texts", cost: 550, effect: "+5,500 Intellect XP", iconName: "Book", skillId: 'int', xpAmount: 5500, color: "text-indigo-400", rarity: "Rare", type: "Booster" },
    { id: 'b10', name: "Resource Mapping", cost: 650, effect: "+6,500 Equity XP", iconName: "Pickaxe", skillId: 'equ', xpAmount: 6500, color: "text-yellow-500", rarity: "Epic", type: "Booster" },
    { id: 'b11', name: "Liquidity Drill", cost: 300, effect: "+3,000 Liq XP", iconName: "Activity", skillId: 'liq', xpAmount: 3000, color: "text-emerald-400", rarity: "Uncommon", type: "Booster" },
    { id: 'b12', name: "Mindfulness Retreat", cost: 800, effect: "+8,000 Willpower XP", iconName: "Flame", skillId: 'wil', xpAmount: 8000, color: "text-amber-500", rarity: "Epic", type: "Booster" },
    { id: 'b13', name: "Audience Workshop", cost: 700, effect: "+7,000 Inf XP", iconName: "Target", skillId: 'inf', xpAmount: 7000, color: "text-pink-400", rarity: "Rare", type: "Booster" },
  ],
  gear: [
    { id: 'd1', name: 'Plot Deed', iconName: 'Map', cost: 150000, rarity: 'Rare', effect: 'Grants ownership of a standard 16x16 land plot.', type: 'Deed' },
    { id: 'd2', name: 'Estate Deed', iconName: 'Home', cost: 500000, rarity: 'Epic', effect: 'Permanent 10% reduction on property tax.', type: 'Deed' },
    { id: 'd3', name: 'Business Deed', iconName: 'Trophy', cost: 2500000, rarity: 'Legendary', effect: 'License to operate a player-owned vendor stall.', type: 'Deed' },
    { id: 'd4', name: 'Car Deed', iconName: 'Car', cost: 75000, rarity: 'Uncommon', effect: 'Title to a basic utility vehicle.', type: 'Deed' },
    { id: 'd5', name: 'Boat Deed', iconName: 'Ship', cost: 125000, rarity: 'Rare', effect: 'Title to a small watercraft.', type: 'Deed' },
    { id: 'd6', name: 'Plane Deed', iconName: 'Aperture', cost: 15000000, rarity: 'Mythic', effect: 'Title to a private jet.', type: 'Deed' },
    { id: 'd7', name: 'Helicopter Deed', iconName: 'Cpu', cost: 7500000, rarity: 'Legendary', effect: 'Title to a transport helicopter.', type: 'Deed' },
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
    { id: 'p1', name: "Standard Pack", cost: 500, effect: "3 Cards", iconName: "Layers", rarity: "Common", color: "text-white", type: "Pack", cardCount: 3, weights: { c: 60, u: 30, r: 8, e: 1.9, l: 0.1 } },
    { id: 'p2', name: "Epic Pack", cost: 1200, effect: "5 Cards (Better Odds)", iconName: "Zap", rarity: "Epic", color: "text-purple-400", type: "Pack", cardCount: 5, weights: { c: 20, u: 40, r: 30, e: 9, l: 1 } },
    { id: 'p3', name: "Legend Pack", cost: 2500, effect: "5 Cards (High Odds)", iconName: "Crown", rarity: "Legendary", color: "text-amber-400", type: "Pack", cardCount: 5, weights: { c: 0, u: 10, r: 40, e: 40, l: 10 } },
    { id: 'p4', name: 'Standard Box', iconName: 'Archive', cost: 2000, rarity: 'Common', type: "Box", effect: 'A bundle of 5 Standard Packs.', packId: 'p1', count: 5 },
    { id: 'p5', name: 'Epic Box', iconName: 'Archive', cost: 8000, rarity: 'Epic', type: "Box", effect: 'A bundle of 5 Epic Packs.', packId: 'p2', count: 5 },
    { id: 'p6', name: 'Legend Box', iconName: 'Archive', cost: 30000, rarity: 'Legendary', type: "Box", effect: 'A premium bundle of 5 Legend Packs.', packId: 'p3', count: 5 },
  ],
  crates: [
    { id: 'lf_hourly', name: 'Hourly Supply Crate', iconName: 'Sun', cost: 0, rarity: 'Common', isHourlyClaim: true, effect: 'A free hourly supply drop.', type: 'Crate' },
    { id: 'lf4', name: 'Standard Loot Crate', iconName: 'Package', cost: 1000, rarity: 'Common', effect: 'A basic crate containing 2-3 inventory items.', type: 'Crate' },
    { id: 'lf5', name: 'Epic Loot Crate', iconName: 'Gift', cost: 15000, rarity: 'Epic', effect: 'A quality crate with high-value items.', type: 'Crate' },
    { id: 'lf6', name: 'Legendary Loot Crate', iconName: 'Star', cost: 50000, rarity: 'Legendary', effect: 'The ultimate prize. Mythic possibility is high.', type: 'Crate' },
  ]
};

export const ESTATE_ROOMS = [
    { id: 'expansion', name: 'Land Expansion', cost: 25000, icon: 'Expand', desc: `Expands grid to ${MAX_GRID_DIMENSION}x${MAX_GRID_DIMENSION} max`, type: 'Special', isExpansion: true },
    { id: 'plot_deed', name: 'Plot Deed', cost: PLOT_COST, icon: 'Map', desc: 'Claim a single plot of land', type: 'Special', isDeed: true },
    { id: 'starter_home', name: 'Starter Home', cost: 15000, icon: 'Home', desc: 'Master Suite (Bed, Bath, Kitchen)', type: 'Bundle', multiplier: 1.2, isBundle: true },
    { id: 'bedroom', name: 'Master Bedroom', cost: 5000, icon: 'Bed', desc: '+5% Energy Regen', type: 'Rest', multiplier: 1.05 },
    { id: 'kitchen', name: 'Chef Kitchen', cost: 6000, icon: 'Utensils', desc: '+5% Nutrition Efficiency', type: 'Sustenance', multiplier: 1.05 },
    { id: 'bathroom', name: 'Luxury Bath', cost: 4500, icon: 'Bath', desc: '+5% Focus Regen', type: 'Hygiene', multiplier: 1.05 },
    { id: 'gym', name: 'Home Gym', cost: 8000, icon: 'Dumbbell', desc: '+10% Vitality XP Gain', type: 'Health', multiplier: 1.1 },
    { id: 'office', name: 'Command Center', cost: 12000, icon: 'Monitor', desc: '+10% Engineering XP Gain', type: 'Tech', multiplier: 1.1 },
    { id: 'library', name: 'Grand Library', cost: 10000, icon: 'Book', desc: '+10% Intellect XP Gain', type: 'Knowledge', multiplier: 1.1 },
    { id: 'studio', name: 'Content Studio', cost: 9000, icon: 'Camera', desc: '+10% Influence XP Gain', type: 'Creative', multiplier: 1.1 },
    { id: 'vault', name: 'Hidden Vault', cost: 20000, icon: 'Lock', desc: 'Protects streak from decay', type: 'Security', multiplier: 1.0 },
    { id: 'garden', name: 'Zen Garden', cost: 6000, icon: 'Sprout', desc: '+5 Energy Regen/Day', type: 'Wellness', multiplier: 1.0 },
];

export const WIDGET_DATABASE = [
    { id: 'productivity_timer', name: 'Focus Timer', icon: 'Clock', category: 'Focus', defaultSize: 'col-span-1' },
    { id: 'task_command_center', name: 'Kanban Board', icon: 'Trello', category: 'Task', defaultSize: 'col-span-2' },
    { id: 'player_card', name: 'Player Card', icon: 'User', category: 'Profile', defaultSize: 'col-span-1' },
    { id: 'active_contracts', name: 'Contracts', icon: 'Briefcase', category: 'Goals', defaultSize: 'col-span-2' },
    { id: 'financial_overview', name: 'Net Worth Summary', icon: 'DollarSign', category: 'Finance', defaultSize: 'col-span-1' },
    { id: 'mastery_log_widget', name: 'Mastery Overview', icon: 'Scroll', category: 'Skills', defaultSize: 'col-span-1' },
];

export const initialData = {
  setupComplete: true, 
  lastVersion: null, 
  cash: 5000,
  discipline: 5000,
  salvage: 0, 
  streak: 0, 
  lastMaintenance: null,
  lastDailyClaim: 0,
  lastHourlyClaim: 0,
  monthlyExpenses: 3200,
  monthlyIncome: 4500,
  bonusXP: { eng: 0, inf: 0, liq: 0, equ: 0, vit: 0, int: 0, sec: 300, wil: 0 },
  assets: { realEstate: 0, crypto: 1200, metals: 0, digitalIP: 2500, stocks: 0, audience: 600 },
  liabilities: { debt: 2000, mortgage: 0 },
  wellness: { energy: 80, hydration: 60, focus: 45 },
  
  lifetime: {
    totalIncomeBase: 4500 * 12, 
    totalDebtPrincipalPaid: 0,
    totalAssetAcquisitionCost: 0,
    peakCashFlow: (4500 - 3200) * 20,
    claimedMasteryRewards: {}
  },

  statistics: {
    sessionsOpened: 0,
    contractsCompleted: 0,
    cardsSold: 0,
    packsOpened: 0,
    itemsBought: 0,
    totalDisciplineEarned: 0,
    maintenance: { energy: 0, hydration: 0, focus: 0 }
  },

  inventory: [
    { id: 1, name: "Windows 10 PC", type: "Tech", desc: "Command Station", iconName: "Monitor", rarity: "Rare", count: 1 },
    { id: 2, name: "Vault Code", type: "Security", desc: "Access Keys", iconName: "FileKey", rarity: "Legendary", count: 1 },
    ...new Array(26).fill(null) 
  ],
  bank: new Array(50).fill(null), 
  bankBalance: 0,
  cards: [], 
  
  achievements: [
    { id: 'q1', title: "Hydrated", desc: "Drink a glass of water.", xp: 100, category: "Vitality", completed: false, difficulty: "Easy" },
    { id: 'q2', title: "Hello World", desc: "Write 1 line of code.", xp: 150, category: "Engineering", completed: false, difficulty: "Easy" },
    { id: 'q3', title: "First Step", desc: "Walk 1,000 steps.", xp: 100, category: "Vitality", completed: false, difficulty: "Easy" },
    { id: 'q4', title: "Lurker", desc: "Join a Discord server.", xp: 150, category: "Influence", completed: false, difficulty: "Easy" },
    { id: 'q5', title: "Penny Saved", desc: "Save $10 this week.", xp: 200, category: "Security", completed: false, difficulty: "Easy" },
    { id: 'q6', title: "Idea Log", desc: "Write down one business idea.", xp: 150, category: "Intellect", completed: false, difficulty: "Easy" },
    { id: 'q7', title: "Read a Page", desc: "Read 1 page of a book.", xp: 100, category: "Intellect", completed: false, difficulty: "Easy" },
    { id: 'q8', title: "Clean Desk", desc: "Organize your workspace.", xp: 100, category: "Willpower", completed: false, difficulty: "Easy" },
    { id: 'q10', title: "Gym Rat", desc: "Workout 3x in a week.", xp: 1000, category: "Vitality", completed: false, difficulty: "Medium", rewardItem: { id: 'r_energy_pack', name: "Energy Drink", type: "Consumable", desc: "+10 Energy", iconName: "Zap", rarity: "Common", count: 3 } },
    { id: 'q11', title: "Freelancer", desc: "Earn your first $100 online.", xp: 1500, category: "Liquidity", completed: false, difficulty: "Medium" },
    { id: 'q12', title: "Stacker", desc: "Buy 1oz of Silver.", xp: 1200, category: "Equity", completed: false, difficulty: "Medium" },
    { id: 'q13', title: "Content Creator", desc: "Post 1 video or article.", xp: 1000, category: "Influence", completed: false, difficulty: "Medium" },
    { id: 'q14', title: "Debt Chipper", desc: "Pay off $500 of debt.", xp: 2000, category: "Security", completed: false, difficulty: "Medium" },
    { id: 'q15', title: "Script Kiddie", desc: "Build a simple calculator app.", xp: 2500, category: "Engineering", completed: false, difficulty: "Medium" },
    { id: 'q16', title: "Cold Call", desc: "Reach out to 5 prospects.", xp: 1500, category: "Influence", completed: false, difficulty: "Medium" },
    { id: 'def_1', title: "Fortress of Solitude", desc: "Save 3 months expenses ($9.6k)", xp: 5000, category: 'Security', completed: false, difficulty: "Hard" },
    { id: 'def_3', title: "Debt Slayer", desc: "Eliminate all consumer debt", xp: 8000, category: 'Security', completed: false, difficulty: "Hard" },
    { id: 'sk_2', title: "The First Dollar", desc: "Earn $1,000 online total", xp: 5000, category: 'Liquidity', completed: false, difficulty: "Hard" },
    { id: 'q17', title: "Landlord", desc: "Acquire your first rental property.", xp: 15000, category: "Equity", completed: false, difficulty: "Hard" },
    { id: 'q18', title: "Gold Bug", desc: "Acquire 1oz of Gold.", xp: 6000, category: "Equity", completed: false, difficulty: "Hard" },
    { id: 'q19', title: "1000 True Fans", desc: "Reach 1,000 Followers.", xp: 10000, category: "Influence", completed: false, difficulty: "Hard" },
    { id: 'q20', title: "SaaS Founder", desc: "Launch a paid product.", xp: 20000, category: "Engineering", completed: false, difficulty: "Hard" },
    { id: 'q21', title: "1000lb Club", desc: "Squat/Bench/Deadlift 1000lbs total.", xp: 10000, category: "Vitality", completed: false, difficulty: "Hard" },
    { id: 'q22', title: "Angel Investor", desc: "Invest in a startup.", xp: 12000, category: "Equity", completed: false, difficulty: "Hard" }
  ],
  
  widgetConfig: { 
    welcome: true, 
    productivity_timer: true,
    task_command_center: true, 
    todo_list: true,
    player_card: false, active_contracts: false, financial_overview: false, mastery_log_widget: false,
    p_vitals: true, unified_menu: true, mastery_log_btn: true, asset_wallet: true, 
  },
  
  layout: {
    home: {
        left_sidebar: ['todo_list'],
        center: ['productivity_timer', 'task_command_center'], 
        right_sidebar: ['skills', 'inventory'],
        widgetSizes: {
            'productivity_timer': 'col-span-1',
            'task_command_center': 'col-span-2'
        }
    },
    profile: {
        left: ['player_card', 'p_vitals'],
        center: ['financial_overview', 'unified_menu', 'mastery_log_widget'],
        right: ['active_contracts', 'collection']
    },
    vault: {
        left: ['player_card', 'p_vitals'], 
        center: ['financial_overview', 'unified_menu'],
        right: ['collection', 'asset_wallet']
    }
  }
};

// --- STATIC DATA: ESTATE PROTOTYPE CONFIGURATION ---
export const PLOT_SQUARE_FOOTAGE = 10000;
export const PLOT_BASE_COST = 25000;
export const PLOT_DIMENSION_M = 100; // 100m x 100m plot
export const EXPANSION_TIERS = [
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

export const MODULAR_ROOMS = [
    { id: 'module_bedroom', name: 'M-Bedroom', cost: 1500, icon: 'Bed', desc: 'Modular resting unit.', type: 'Rest', category: 'Build', sqft: 2000, length: 40, width: 50 },
    { id: 'module_bathroom', name: 'M-Bathroom', cost: 1000, icon: 'Bath', desc: 'Modular hygiene unit.', type: 'Hygiene', category: 'Build', sqft: 60, length: 6, width: 10 }, 
    { id: 'module_kitchen', name: 'M-Kitchen', cost: 3000, icon: 'Utensils', desc: 'Modular sustenance unit.', type: 'Sustenance', category: 'Build', sqft: 2500, length: 50, width: 50 },
    { id: 'module_laundry', name: 'M-Laundry', cost: 1500, icon: 'Box', desc: 'Modular laundry unit.', type: 'Utility', category: 'Build', sqft: 1000, length: 20, width: 50 },
    { id: 'module_living', name: 'M-Living', cost: 3000, icon: 'Home', desc: 'Modular social unit.', type: 'Social', category: 'Build', sqft: 1500, length: 30, width: 50 },
];

export const DEFAULT_ESTATE_ITEMS = [
    ...MODULAR_ROOMS,
    { id: 'bathroom_std', name: 'Bathroom (Std)', cost: 2000, icon: 'Bath', desc: 'Basic hygiene. Slightly larger footprint.', type: 'Hygiene', category: 'Build', priority: 2, sqft: 80, length: 8, width: 10 },
    { id: 'custom_lab', name: 'Bio-Lab', cost: 20000, icon: 'Droplet', desc: 'High-tech research facility.', type: 'Tech', category: 'Build', priority: 4, sqft: 5000, length: 100, width: 50 },
    { id: 'plot_deed_special', name: 'Land Deed', cost: PLOT_BASE_COST, icon: 'Map', desc: 'Claim an unowned plot.', type: 'Deed', isDeed: true, priority: 0, sqft: PLOT_SQUARE_FOOTAGE, category: 'Deeds' },
    { id: 'd2', name: 'Estate Title', cost: 500000, icon: 'Home', desc: 'Property tax reduction.', skillReq: { skill: 'Equity', level: 10 }, category: 'Deeds' },
    { id: 'd3', name: 'Business License', cost: 2500000, icon: 'Trophy', desc: 'Operate vendor stall.', skillReq: { skill: 'Equity', level: 50 }, category: 'Deeds' },
];