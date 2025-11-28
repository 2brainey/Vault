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
  Trash2, Bed, Bath, Utensils, Expand
} from 'lucide-react';

// --- CONFIGURATION ---
export const USER_NAME = "Justin";
export const CURRENT_VERSION = "v29.0"; // Updated for Permanent XP System
export const INVENTORY_SLOTS = 28;
export const BANK_SLOTS = 50;
export const MAX_SKILL_LEVEL = 99;
export const TOTAL_SKILLS = 13; 
export const MAX_TOTAL_LEVEL = MAX_SKILL_LEVEL * TOTAL_SKILLS;
export const CONTRACTS_PER_PAGE = 5;
export const CARDS_PER_PAGE = 8;
export const PLOT_COST = 1000;
export const MAX_GRID_DIMENSION = 10;

// --- STATIC DATA: FULL 10-TIER SKILL DETAILS ---
// XP CALC: Level = 25 * log10((XP / 100) + 1)
export const SKILL_DETAILS = {
  inc: { 
    name: "Income", 
    icon: "Sword", 
    color: "text-emerald-400",
    desc: "Raw earning power and market value.", 
    unlocks: [
      { level: 10, title: "Paycheck", desc: "Secure a consistent income source.", reward: { name: "Ledger", type: "Item", icon: "Book" } },
      { level: 20, title: "Side Hustle", desc: "Earn your first $100 outside of work." },
      { level: 30, title: "Freelancer", desc: "Establish a reliable client base." },
      { level: 40, title: "High Earner", desc: "Surpass median household income solo." },
      { level: 50, title: "$100k Club", desc: "Break the six-figure ceiling.", reward: { name: "Gold Calculator", type: "Gear", icon: "Landmark" } },
      { level: 60, title: "Investor", desc: "Your money makes more money than you do." },
      { level: 70, title: "Rainmaker", desc: "Generate revenue on demand." },
      { level: 80, title: "Whale", desc: "Net worth exceeds lifetime expenses." },
      { level: 90, title: "Magnate", desc: "Own multiple cash-flowing assets." },
      { level: 99, title: "Tycoon", desc: "Financial freedom is absolute.", reward: { name: "Tycoon's Scepter", type: "Trophy", icon: "Crown" } }
    ] 
  },
  cod: { 
    name: "Code", 
    icon: "Code", 
    color: "text-blue-400",
    desc: "Proficiency in software architecture and syntax.", 
    unlocks: [
      { level: 10, title: "Hello World", desc: "Write your first functional script.", reward: { name: "Coffee Mug", type: "Consumable", icon: "Coffee" } },
      { level: 20, title: "Script Kiddie", desc: "Automate a simple daily task." },
      { level: 30, title: "Git Pusher", desc: "Contribute to a repository weekly." },
      { level: 40, title: "Full Stack", desc: "Build and deploy a complete web app." },
      { level: 50, title: "Senior Dev", desc: "Master a specific language or framework.", reward: { name: "Mechanical Keyboard", type: "Gear", icon: "Monitor" } },
      { level: 60, title: "Architect", desc: "Design a scalable system from scratch." },
      { level: 70, title: "Algorithmic", desc: "Solve hard LeetCode problems easily." },
      { level: 80, title: "Maintainer", desc: "Manage a large open source project." },
      { level: 90, title: "System Lord", desc: "Your code runs critical infrastructure." },
      { level: 99, title: "Singularity", desc: "You speak fluent machine code.", reward: { name: "Neural Interface", type: "Trophy", icon: "Cpu" } }
    ] 
  },
  cnt: { 
    name: "Content", 
    icon: "Target", 
    color: "text-pink-400",
    desc: "Influence, audience reach, and media production.", 
    unlocks: [
      { level: 10, title: "Lurker No More", desc: "Post your first piece of public content.", reward: { name: "Notebook", type: "Item", icon: "Edit3" } },
      { level: 20, title: "Commenter", desc: "Engage with a community regularly." },
      { level: 30, title: "Publisher", desc: "Stick to a weekly posting schedule." },
      { level: 40, title: "Viral", desc: "One post exceeds 10k views/impressions." },
      { level: 50, title: "Monetized", desc: "Earn your first dollar from content.", reward: { name: "Pro Camera", type: "Gear", icon: "Camera" } },
      { level: 60, title: "Brand Deal", desc: "Secure a sponsorship or partnership." },
      { level: 70, title: "Influencer", desc: "Can move markets with a mention." },
      { level: 80, title: "Thought Leader", desc: "Others cite your work as primary source." },
      { level: 90, title: "Media Empire", desc: "Manage a team of creators." },
      { level: 99, title: "Cult Leader", desc: "Your audience follows you anywhere.", reward: { name: "Golden Mic", type: "Trophy", icon: "Mic" } }
    ] 
  },
  ai: { 
    name: "AI Ops", 
    icon: "Sparkles", 
    color: "text-purple-400",
    desc: "Leveraging artificial intelligence for leverage.", 
    unlocks: [
      { level: 10, title: "User", desc: "Create an account on an LLM." },
      { level: 20, title: "Prompter", desc: "Learn effective prompt engineering." },
      { level: 30, title: "Tweaker", desc: "Customize system instructions." },
      { level: 40, title: "Automator", desc: "Connect AI to an API/Webhook." },
      { level: 50, title: "Fine-Tuner", desc: "Train a model on custom data.", reward: { name: "AI Cluster Key", type: "Gear", icon: "Server" } },
      { level: 60, title: "Local Host", desc: "Run a model on your own hardware." },
      { level: 70, title: "Agent Builder", desc: "Create autonomous agents." },
      { level: 80, title: "Swarm Architect", desc: "Orchestrate multi-agent systems." },
      { level: 90, title: "AGI Researcher", desc: "Push the boundaries of intelligence." },
      { level: 99, title: "Necromancer", desc: "Breathe life into silicon.", reward: { name: "A.G.I. Core", type: "Trophy", icon: "Dna" } }
    ] 
  },
  sec: { 
    name: "Security", 
    icon: "Shield", 
    color: "text-slate-300",
    desc: "Digital privacy, asset protection, and redundancy.", 
    unlocks: [
      { level: 10, title: "2FA User", desc: "Enable 2FA on all critical accounts." },
      { level: 20, title: "Manager", desc: "Use a password manager for everything." },
      { level: 30, title: "Encrypted", desc: "Encrypt your local hard drives." },
      { level: 40, title: "Backup", desc: "Implement the 3-2-1 backup rule." },
      { level: 50, title: "Insured", desc: "Full coverage for health/auto/home.", reward: { name: "Paper Wallet", type: "Item", icon: "FileKey" } },
      { level: 60, title: "Air Gapped", desc: "Store critical keys offline." },
      { level: 70, title: "Privacy Coin", desc: "Understand and use anonymous txs." },
      { level: 80, title: "Offshore", desc: "Legal entity in a second jurisdiction." },
      { level: 90, title: "Bunker", desc: "Self-sustaining physical security." },
      { level: 99, title: "Immortal", desc: "Legacy secured for generations.", reward: { name: "Fortress Vault", type: "Trophy", icon: "Lock" } }
    ] 
  },
  vit: { 
    name: "Vitality", 
    icon: "Heart", 
    color: "text-red-400",
    desc: "Physical health, endurance, and strength.", 
    unlocks: [
      { level: 10, title: "Walker", desc: "Hit 10k steps daily for a week." },
      { level: 20, title: "Mover", desc: "Complete a 30-minute workout without stopping." },
      { level: 30, title: "Hydrated", desc: "Perfect hydration streak for a month." },
      { level: 40, title: "Lifter", desc: "Bench/Squat your bodyweight." },
      { level: 50, title: "Athlete", desc: "Run a 5k in under 25 minutes.", reward: { name: "Gym Membership", type: "Gear", icon: "Dumbbell" } },
      { level: 60, title: "Machine", desc: "Maintain peak heart rate for 10 mins." },
      { level: 70, title: "Iron Body", desc: "Never get sick due to lifestyle choices." },
      { level: 80, title: "Spartan", desc: "Complete a triathlon or marathon." },
      { level: 90, title: "Adonis", desc: "Reach <12% body fat with high muscle mass." },
      { level: 99, title: "Olympian", desc: "Peak human physical condition.", reward: { name: "Golden Heart", type: "Trophy", icon: "Heart" } }
    ] 
  },
  wis: { 
    name: "Wisdom", 
    icon: "Star", 
    color: "text-indigo-400",
    desc: "Knowledge acquisition and application.", 
    unlocks: [
      { level: 10, title: "Reader", desc: "Finish one non-fiction book." },
      { level: 20, title: "Note Taker", desc: "Maintain a personal knowledge base." },
      { level: 30, title: "Student", desc: "Complete an online course." },
      { level: 40, title: "Graduate", desc: "Master a complex subject." },
      { level: 50, title: "Teacher", desc: "Successfully mentor someone else.", reward: { name: "Library Card", type: "Item", icon: "Library" } },
      { level: 60, title: "Philosopher", desc: "Develop your own mental models." },
      { level: 70, title: "Polymath", desc: "Expertise in three distinct fields." },
      { level: 80, title: "Sage", desc: "Others seek you for life advice." },
      { level: 90, title: "Oracle", desc: "Predict trends with high accuracy." },
      { level: 99, title: "Dynasty", desc: "Your knowledge survives you.", reward: { name: "Ancient Scroll", type: "Trophy", icon: "Scroll" } }
    ] 
  },
  net: { 
    name: "Network", 
    icon: "Users", 
    color: "text-cyan-400",
    desc: "Social capital and community standing.", 
    unlocks: [
      { level: 10, title: "Lurker", desc: "Join a professional community." },
      { level: 20, title: "User", desc: "Participate in discussions." },
      { level: 30, title: "Member", desc: "Become a recognized regular." },
      { level: 40, title: "Contributor", desc: "Add value to the group freely." },
      { level: 50, title: "Leader", desc: "Organize an event or meetup.", reward: { name: "Business Cards", type: "Item", icon: "Briefcase" } },
      { level: 60, title: "Connector", desc: "Introduce two high-value people." },
      { level: 70, title: "Inner Circle", desc: "Access to exclusive closed groups." },
      { level: 80, title: "Rainmaker", desc: "Your network generates your income." },
      { level: 90, title: "Hub", desc: "You are the center of the graph." },
      { level: 99, title: "The Network", desc: "Six degrees of separation is now one.", reward: { name: "Golden Ring", type: "Trophy", icon: "Globe" } }
    ] 
  },
  ast: { 
    name: "Assets", 
    icon: "Pickaxe", 
    color: "text-yellow-500",
    desc: "Accumulation of hard assets and commodities.", 
    unlocks: [
      { level: 10, title: "Saver", desc: "Save $1,000 in cash." },
      { level: 20, title: "Coin Collector", desc: "Own your first physical silver/gold." },
      { level: 30, title: "Stacker", desc: "Accumulate 10oz of silver equivalent." },
      { level: 40, title: "HODLer", desc: "Hold an asset for >1 year without selling." },
      { level: 50, title: "Standard", desc: "Assets equal 1 year of expenses.", reward: { name: "Metal Detector", type: "Gear", icon: "Pickaxe" } },
      { level: 60, title: "Vault", desc: "Require a physical safe for storage." },
      { level: 70, title: "Dragon", desc: "Assets equal 5 years of expenses." },
      { level: 80, title: "Sovereign", desc: "Assets held in multiple jurisdictions." },
      { level: 90, title: "Reserve Bank", desc: "You can loan against your own assets." },
      { level: 99, title: "Planet", desc: "Your gravity pulls resources to you.", reward: { name: "Golden Ore", type: "Trophy", icon: "Coins" } }
    ] 
  },
  flo: { 
    name: "Cash Flow", 
    icon: "Activity", 
    color: "text-green-500",
    desc: "Liquidity management and monthly surplus.", 
    unlocks: [
      { level: 10, title: "Negative", desc: "Track every penny spent for a month." },
      { level: 20, title: "Breakeven", desc: "Income exactly matches expenses." },
      { level: 30, title: "Positive", desc: "Save 10% of monthly income." },
      { level: 40, title: "Buffer", desc: "One month of expenses in checking." },
      { level: 50, title: "Surplus", desc: "Save 30% of monthly income.", reward: { name: "Flow Meter", type: "Gear", icon: "Activity" } },
      { level: 60, title: "Automated", desc: "All bills paid automatically." },
      { level: 70, title: "Abundance", desc: "Save 50% of monthly income." },
      { level: 80, title: "Infinite", desc: "Passive income covers basic needs." },
      { level: 90, title: "Overflow", desc: "Passive income covers all wants." },
      { level: 99, title: "River", desc: "Money flows in faster than you can spend.", reward: { name: "Eternal Droplet", type: "Trophy", icon: "Droplet" } }
    ] 
  },
  inv: { 
    name: "Invest", 
    icon: "Sprout", 
    color: "text-lime-400",
    desc: "Capital allocation and ROI.", 
    unlocks: [
      { level: 10, title: "Gambler", desc: "Buy your first stock/crypto." },
      { level: 20, title: "Speculator", desc: "Read a company balance sheet." },
      { level: 30, title: "Sower", desc: "Set up a recurring monthly buy." },
      { level: 40, title: "Holder", desc: "Don't panic sell during a dip." },
      { level: 50, title: "Compounder", desc: "Reinvest dividends/yields.", reward: { name: "Growth Seed", type: "Item", icon: "Sprout" } },
      { level: 60, title: "Diversified", desc: "Portfolio across 3 asset classes." },
      { level: 70, title: "Accredited", desc: "Qualify for private deal flow." },
      { level: 80, title: "VC", desc: "Invest in a private startup." },
      { level: 90, title: "Whale", desc: "Your buy/sell moves the local price." },
      { level: 99, title: "Market Maker", desc: "You provide the liquidity.", reward: { name: "Golden Hand", type: "Trophy", icon: "TrendingUp" } }
    ] 
  },
  est: { 
    name: "Estate", 
    icon: "Hammer", 
    color: "text-orange-400",
    desc: "Real estate and physical property management.", 
    unlocks: [
      { level: 10, title: "Tenant", desc: "Pay rent on time for a year." },
      { level: 20, title: "Roommate", desc: "Sublet or hack your housing costs." },
      { level: 30, title: "Owner", desc: "Own your primary residence." },
      { level: 40, title: "Landlord", desc: "Rent out a unit or property." },
      { level: 50, title: "Portfolio", desc: "Own 2+ properties.", reward: { name: "Master Key", type: "Item", icon: "Key" } },
      { level: 60, title: "Multi-Family", desc: "Own a building with 4+ units." },
      { level: 70, title: "Commercial", desc: "Own office or retail space." },
      { level: 80, title: "Developer", desc: "Build on raw land." },
      { level: 90, title: "Mogul", desc: "Own a city block." },
      { level: 99, title: "Baron", desc: "Your estate is its own zip code.", reward: { name: "Golden Deed", type: "Trophy", icon: "Map" } }
    ] 
  },
  dis: { 
    name: "Discipline", 
    icon: "Flame", 
    color: "text-amber-500",
    desc: "Willpower, habits, and self-control.", 
    unlocks: [
      { level: 10, title: "Impulse", desc: "Resist a major temptation once." },
      { level: 20, title: "Routine", desc: "Stick to a morning routine for a week." },
      { level: 30, title: "Habit", desc: "Do something hard for 30 days straight." },
      { level: 40, title: "Streak", desc: "Maintain a 100-day streak." },
      { level: 50, title: "Iron Will", desc: "Fast for 24 hours.", reward: { name: "Focus Potion", type: "Consumable", icon: "Brain" } },
      { level: 60, title: "Flow State", desc: "Work for 4 hours without distraction." },
      { level: 70, title: "Monk Mode", desc: "Cut all cheap dopamine for a month." },
      { level: 80, title: "Stoic", desc: "Remain calm in a major crisis." },
      { level: 90, title: "Unbreakable", desc: "Your word is absolute law." },
      { level: 99, title: "Ascended", desc: "Complete mastery over self.", reward: { name: "Eternal Flame", type: "Trophy", icon: "Flame" } }
    ] 
  },
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
    
    // START: RE-INTRODUCING MISSING BOOSTERS (7 more for 13 total skills)
    { id: 'b7', name: "Fortress Plan", cost: 450, effect: "+4,500 Security XP", iconName: "Shield", skillId: 'sec', xpAmount: 4500, color: "text-slate-300", rarity: "Rare", type: "Booster" },
    { id: 'b8', name: "Biohack Training", cost: 350, effect: "+3,500 Vitality XP", iconName: "Heart", skillId: 'vit', xpAmount: 3500, color: "text-red-400", rarity: "Rare", type: "Booster" },
    { id: 'b9', name: "Historical Texts", cost: 550, effect: "+5,500 Wisdom XP", iconName: "Star", skillId: 'wis', xpAmount: 5500, color: "text-indigo-400", rarity: "Rare", type: "Booster" },
    { id: 'b10', name: "Resource Mapping", cost: 650, effect: "+6,500 Assets XP", iconName: "Pickaxe", skillId: 'ast', xpAmount: 6500, color: "text-yellow-500", rarity: "Epic", type: "Booster" },
    { id: 'b11', name: "Liquidity Drill", cost: 300, effect: "+3,000 Cash Flow XP", iconName: "Activity", skillId: 'flo', xpAmount: 3000, color: "text-green-500", rarity: "Uncommon", type: "Booster" },
    { id: 'b12', name: "Mindfulness Retreat", cost: 800, effect: "+8,000 Discipline XP", iconName: "Flame", skillId: 'dis', xpAmount: 8000, color: "text-amber-500", rarity: "Epic", type: "Booster" },
    { id: 'b13', name: "Audience Workshop", cost: 700, effect: "+7,000 Content XP", iconName: "Target", skillId: 'cnt', xpAmount: 7000, color: "text-pink-400", rarity: "Rare", type: "Booster" },
    // END: MISSING BOOSTERS
  ],
  gear: [
    // IMPORTANT: g1 is the Estate Deed. We must use its ID later.
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

export const ESTATE_ROOMS = [
    // SPECIAL / EXPANSION
    { id: 'expansion', name: 'Land Expansion', cost: 25000, icon: 'Expand', desc: 'Expand estate borders (+1 Row/Col)', type: 'Special', isExpansion: true },
    { id: 'plot_deed', name: 'Plot Deed', cost: PLOT_COST, icon: 'Map', desc: 'Claim a single plot of land', type: 'Special', isDeed: true },
    
    // BUNDLES
    { id: 'starter_home', name: 'Starter Home', cost: 15000, icon: 'Home', desc: 'Master Suite (Bed, Bath, Kitchen)', type: 'Bundle', multiplier: 1.2, isBundle: true },

    // BARE NECESSITIES
    { id: 'bedroom', name: 'Master Bedroom', cost: 5000, icon: 'Bed', desc: '+5% Energy Regen', type: 'Rest', multiplier: 1.05 },
    { id: 'kitchen', name: 'Chef Kitchen', cost: 6000, icon: 'Utensils', desc: '+5% Nutrition Efficiency', type: 'Sustenance', multiplier: 1.05 },
    { id: 'bathroom', name: 'Luxury Bath', cost: 4500, icon: 'Bath', desc: '+5% Focus Regen', type: 'Hygiene', multiplier: 1.05 },

    // FACILITIES
    { id: 'gym', name: 'Home Gym', cost: 8000, icon: 'Dumbbell', desc: '+10% Vitality XP Gain', type: 'Health', multiplier: 1.1 },
    { id: 'office', name: 'Command Center', cost: 12000, icon: 'Monitor', desc: '+10% Coding XP Gain', type: 'Tech', multiplier: 1.1 },
    { id: 'library', name: 'Grand Library', cost: 10000, icon: 'Book', desc: '+10% Wisdom XP Gain', type: 'Knowledge', multiplier: 1.1 },
    { id: 'studio', name: 'Content Studio', cost: 9000, icon: 'Camera', desc: '+10% Content XP Gain', type: 'Creative', multiplier: 1.1 },
    { id: 'vault', name: 'Hidden Vault', cost: 20000, icon: 'Lock', desc: 'Protects streak from decay', type: 'Security', multiplier: 1.0 },
    { id: 'garden', name: 'Zen Garden', cost: 6000, icon: 'Sprout', desc: '+5 Energy Regen/Day', type: 'Wellness', multiplier: 1.0 },
];

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
  
  // NEW PERMANENT STATE FIELDS (v29.0)
  lifetime: {
    totalIncomeBase: 4500 * 12, 
    totalDebtPrincipalPaid: 0,
    totalAssetAcquisitionCost: 0,
    peakCashFlow: (4500 - 3200) * 20,
    // NEW: Field to track claimed mastery rewards
    claimedMasteryRewards: {} // Format: { skillId: [level1, level2, ...], ... }
  },

  // NEW: Centralized Statistics Tracking
  statistics: {
    sessionsOpened: 0,
    contractsCompleted: 0,
    cardsSold: 0,
    packsOpened: 0,
    itemsBought: 0,
    totalDisciplineEarned: 0,
    maintenance: {
        energy: 0,
        hydration: 0,
        focus: 0
    }
  },

  // 28 Slot Inventory
  inventory: [
    { id: 1, name: "Windows 10 PC", type: "Tech", desc: "Command Station", iconName: "Monitor", rarity: "Rare", count: 1 },
    { id: 2, name: "Vault Code", type: "Security", desc: "Access Keys", iconName: "FileKey", rarity: "Legendary", count: 1 },
    ...new Array(26).fill(null) 
  ],
  
  // 50 Slot Bank
  bank: new Array(50).fill(null), 
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
    { 
      id: 'q10', 
      title: "Gym Rat", 
      desc: "Workout 3x in a week.", 
      xp: 1000, 
      category: "Vitality", 
      completed: false, 
      difficulty: "Medium", 
      // NEW: Test Reward
      rewardItem: { id: 'r_energy_pack', name: "Energy Drink", type: "Consumable", desc: "+10 Energy", iconName: "Zap", rarity: "Common", count: 3 }
    },
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
  // UPDATED: Make both new widgets visible by default
  widgetConfig: { 
    welcome: true, contract: true, skills: true, vitals: true, shop: true, grind: true,
    player_card: true, p_vitals: true, financial_overview: true, unified_menu: true, active_contracts: true, collection: true,
    asset_wallet: true, 
    mastery_log_widget: true, // Force standalone widget visible
    mastery_log_btn: true, // Force button widget visible
    productivity_timer: true,
  },
  layout: {
    home: {
        left: ['daily_ops', 'contract', 'productivity_timer'], 
        right: ['shop', 'skills'] 
    },
    // UPDATED: Add mastery_log_widget to a column for initial display
    profile: {
        left: ['player_card', 'p_vitals'],
        center: ['financial_overview', 'unified_menu', 'mastery_log_widget', 'mastery_log_btn'], // Added both new widgets
        right: ['active_contracts', 'collection']
    },
    vault: {
        left: ['financial_overview'],
        center: ['unified_menu'],
        right: ['collection', 'asset_wallet']
    }
  }
};