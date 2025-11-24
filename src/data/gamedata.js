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
export const USER_NAME = "Justin";
export const CURRENT_VERSION = "v27.1";
export const INVENTORY_SLOTS = 28;
export const BANK_SLOTS = 50;
export const MAX_SKILL_LEVEL = 99;
export const TOTAL_SKILLS = 13; 
export const MAX_TOTAL_LEVEL = MAX_SKILL_LEVEL * TOTAL_SKILLS;
export const CONTRACTS_PER_PAGE = 5;
export const CARDS_PER_PAGE = 8;

// --- DATA CONSTANTS ---

export const SKILL_DETAILS = {
  inc: { name: "Income", icon: "Sword", desc: "Raw earning power.", unlocks: [{ level: 10, title: "Paycheck" }, { level: 50, title: "$100k Club" }, { level: 99, title: "Tycoon" }] },
  cod: { name: "Code", icon: "Code", desc: "Coding ability.", unlocks: [{ level: 10, title: "Hello World" }, { level: 50, title: "Senior Dev" }, { level: 99, title: "Singularity" }] },
  cnt: { name: "Content", icon: "Target", desc: "Influence.", unlocks: [{ level: 10, title: "Voice" }, { level: 50, title: "Monetized" }, { level: 99, title: "Cult Leader" }] },
  ai: { name: "AI Ops", icon: "Sparkles", desc: "AI Ops.", unlocks: [{ level: 10, title: "Prompter" }, { level: 50, title: "Automator" }, { level: 99, title: "Necromancer" }] },
  sec: { name: "Security", icon: "Shield", desc: "Financial Security.", unlocks: [{ level: 10, title: "Buffer" }, { level: 50, title: "Insured" }, { level: 99, title: "Immortal" }] },
  vit: { name: "Vitality", icon: "Heart", desc: "Health.", unlocks: [{ level: 10, title: "Walker" }, { level: 50, title: "Athlete" }, { level: 99, title: "Olympian" }] },
  wis: { name: "Wisdom", icon: "Star", desc: "Future Proofing.", unlocks: [{ level: 10, title: "Will" }, { level: 50, title: "Trust" }, { level: 99, title: "Dynasty" }] },
  net: { name: "Network", icon: "Users", desc: "Community.", unlocks: [{ level: 10, title: "Lurker" }, { level: 50, title: "Leader" }, { level: 99, title: "The Hub" }] },
  ast: { name: "Assets", icon: "Pickaxe", desc: "Hard Assets.", unlocks: [{ level: 10, title: "Stacker" }, { level: 50, title: "Standard" }, { level: 99, title: "Dragon" }] },
  flo: { name: "Cash Flow", icon: "Activity", desc: "Cash Flow.", unlocks: [{ level: 10, title: "Positive" }, { level: 50, title: "Surplus" }, { level: 99, title: "Infinite" }] },
  inv: { name: "Invest", icon: "Sprout", desc: "Growth.", unlocks: [{ level: 10, title: "Sower" }, { level: 50, title: "Compounder" }, { level: 99, title: "Harvest" }] },
  est: { name: "Estate", icon: "Hammer", desc: "Real Estate.", unlocks: [{ level: 10, title: "Tenant" }, { level: 50, title: "Portfolio" }, { level: 99, title: "Baron" }] },
  dis: { name: "Discipline", icon: "Flame", desc: "Willpower.", unlocks: [{ level: 10, title: "Routine" }, { level: 50, title: "Iron Will" }, { level: 99, title: "Monk Mode" }] },
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
export const initialData = {
  setupComplete: true, 
  lastVersion: null, 
  cash: 5000,
  discipline: 5000, 
  streak: 0, 
  lastMaintenance: null,
  monthlyExpenses: 3200,
  monthlyIncome: 4500,
  bonusXP: { inc: 0, cod: 0, cnt: 0, ai: 0, sec: 300, vit: 0, wis: 0, net: 0, ast: 0, flo: 0, inv: 0, est: 0, dis: 0 },
  assets: { realEstate: 0, crypto: 1200, metals: 0, digitalIP: 2500, stocks: 0, audience: 600 },
  liabilities: { debt: 2000, mortgage: 0 },
  wellness: { energy: 80, hydration: 60, focus: 45 },
  
  // UPDATE: Inventory is now 28 null slots, Bank is 50 null slots
  inventory: [
    { id: 1, name: "Windows 10 PC", type: "Tech", desc: "Command Station", iconName: "Monitor", rarity: "Rare", count: 1 },
    { id: 2, name: "Vault Code", type: "Security", desc: "Access Keys", iconName: "FileKey", rarity: "Legendary", count: 1 },
    ...new Array(26).fill(null) // Pad remainder with null
  ],
  bank: new Array(BANK_SLOTS).fill(null), // New Bank State
  bankBalance: 0,

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
    welcome: true, contract: true, skills: true, vitals: true, shop: true, grind: true,
    player_card: true, p_vitals: true, financial_overview: true, unified_menu: true, active_contracts: true, collection: true,
    asset_wallet: true
  },
  layout: {
    home: {
        left: ['daily_ops', 'contract'], 
        right: ['shop', 'skills'] 
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