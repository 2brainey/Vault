import { create } from 'zustand';
import { db } from '../config/firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
    initialData, 
    INVENTORY_SLOTS, 
    SHOP_ITEMS, 
    CARD_DATABASE,
    SKILL_DETAILS
} from '../data/gamedata';

// --- HELPER FUNCTIONS ---

const addToSlotArray = (slots, item, quantity = 1) => {
    const newSlots = [...slots];
    const existingIndex = newSlots.findIndex(s => s && s.name === item.name && s.rarity === item.rarity);
    if (existingIndex !== -1) {
        newSlots[existingIndex] = { ...newSlots[existingIndex], count: newSlots[existingIndex].count + quantity };
        return newSlots;
    }
    const emptyIndex = newSlots.findIndex(s => s === null);
    if (emptyIndex !== -1) {
        newSlots[emptyIndex] = { ...item, count: quantity, id: Date.now() + Math.random() };
        return newSlots;
    }
    return null;
};

const generatePackCards = (packType) => {
    let weights = { c: 60, u: 30, r: 8, e: 1.9, l: 0.1 };
    let cardCount = 3;
    if (packType === 'Epic') { weights = { c: 20, u: 40, r: 30, e: 9, l: 1 }; cardCount = 5; } 
    else if (packType === 'Legendary') { weights = { c: 0, u: 10, r: 40, e: 40, l: 10 }; cardCount = 5; }
    
    const newCards = [];
    for(let i=0; i<cardCount; i++) {
      const rand = Math.random() * 100;
      let cardRarity = 'Common';
      if (rand > (100 - weights.l)) cardRarity = 'Legendary';
      else if (rand > (100 - weights.l - weights.e)) cardRarity = 'Epic';
      else if (rand > (100 - weights.l - weights.e - weights.r)) cardRarity = 'Rare';
      else if (rand > (100 - weights.l - weights.e - weights.r - weights.u)) cardRarity = 'Uncommon';
      
      const pool = CARD_DATABASE.filter(c => c.rarity === cardRarity);
      const card = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : CARD_DATABASE[0];
      newCards.push(card);
    }
    return newCards;
};

// Helper to safely merge saved data
const mergeData = (base, saved) => {
  const merged = { 
      ...base, 
      ...saved,
      statistics: { ...base.statistics, ...(saved?.statistics || {}) },
      bonusXP: { ...base.bonusXP, ...(saved?.bonusXP || {}) },
      wellness: { ...base.wellness, ...(saved?.wellness || {}) },
      assets: { ...base.assets, ...(saved?.assets || {}) },
      liabilities: { ...base.liabilities, ...(saved?.liabilities || {}) },
      lifetime: { ...base.lifetime, ...(saved?.lifetime || {}) }
  };
  
  if (!saved?.layout?.home?.left_sidebar) {
      merged.layout = base.layout;
      merged.widgetConfig = base.widgetConfig; 
  }

  if (Array.isArray(saved?.inventory) && saved.inventory.length !== INVENTORY_SLOTS) {
     const fixed = new Array(INVENTORY_SLOTS).fill(null);
     saved.inventory.forEach((item, i) => { if(i < INVENTORY_SLOTS) fixed[i] = item });
     merged.inventory = fixed;
  } else if (!Array.isArray(saved?.inventory)) {
      merged.inventory = base.inventory;
  }

  if (!Array.isArray(saved?.bank)) {
    merged.bank = base.bank;
  }
  
  return merged;
};

// --- XP CALCULATION HELPERS ---
const calcLevel = (xp) => Math.max(1, Math.min(Math.floor(25 * Math.log10((xp / 100) + 1)), 99));
const getXP = (base, id, data) => (Number(base) || 0) + (data.bonusXP?.[id] || 0);


// --- ZUSTAND STORE ---

export const useGameStore = create((set, get) => ({
  data: initialData,
  userId: 'test-user-id', 
  loading: true,
  isSaving: false,
  pendingPackOpen: null,

  loadGame: async () => {
    set({ loading: true });
    // In a real app, verify user auth here
    try {
      // Simulation of loading default data
      set({ data: initialData, loading: false });
    } catch (error) {
      console.error("Load Error:", error);
      set({ data: initialData, loading: false });
    }
  },

  saveGame: async () => {
    set({ isSaving: true });
    // Simulation of save
    setTimeout(() => set({ isSaving: false }), 500);
  },

  updateData: (updater) => set((state) => {
      const newData = typeof updater === 'function' ? updater(state.data) : updater;
      return { data: { ...state.data, ...newData } };
  }),

  setDiscipline: (valOrFn) => set((state) => {
    const newVal = typeof valOrFn === 'function' ? valOrFn(state.data.discipline) : valOrFn;
    return { data: { ...state.data, discipline: newVal } };
  }),

  updateWellness: (type, amount) => set((state) => {
    const currentVal = state.data.wellness[type];
    const newVal = Math.min(100, Math.max(0, currentVal + amount));
    const now = new Date().toDateString();

    const newStats = { ...state.data.statistics };
    if (amount > 0) {
        if (!newStats.maintenance) newStats.maintenance = { energy: 0, hydration: 0, focus: 0 };
        newStats.maintenance[type] = (newStats.maintenance[type] || 0) + 1;
    }

    return {
        data: {
            ...state.data,
            statistics: newStats,
            wellness: { ...state.data.wellness, [type]: newVal },
            lastMaintenance: now
        }
    };
  }),

  // NEW: Action for Productivity Timer Completion
  completeFocusSession: (minutes) => {
      const state = get();
      const baseReward = Math.floor(minutes * 10 * (1 + (minutes / 100)));
      
      const roll = Math.random() * 100;
      let packReward = null;
      let newInventory = [...state.data.inventory];
      let msg = `+${baseReward} Brain Matter`;

      if (roll < minutes) {
          const pack = SHOP_ITEMS.packs.find(p => p.id === 'p1'); // Standard Pack
          const updatedInv = addToSlotArray(newInventory, pack, 1);
          if (updatedInv) {
              newInventory = updatedInv;
              packReward = pack;
              msg += ` & ${pack.name} Found!`;
          }
      }

      set(prev => ({
          data: {
              ...prev.data,
              discipline: prev.data.discipline + baseReward,
              inventory: newInventory,
              wellness: {
                  ...prev.data.wellness,
                  focus: Math.max(0, prev.data.wellness.focus - 10)
              },
              statistics: {
                  ...prev.data.statistics,
                  maintenance: { ...prev.data.statistics.maintenance, focus: (prev.data.statistics.maintenance?.focus || 0) + 1 }
              }
          }
      }));

      return { success: true, message: msg, reward: baseReward };
  },

  manualGrind: (skillKey, mpReward, energyCost) => {
      const state = get(); 
      if (state.data.wellness.energy >= energyCost) {
          set(prevState => {
              const prev = prevState.data;
              return {
                  data: {
                      ...prev,
                      wellness: { ...prev.wellness, energy: prev.wellness.energy - energyCost },
                      bonusXP: { ...prev.bonusXP, [skillKey]: (prev.bonusXP?.[skillKey] || 0) + 10 },
                      discipline: prev.discipline + mpReward,
                  }
              };
          });
          return true;
      }
      return false;
  },

  updateNestedData: (path, value) => set((state) => {
      let newData = { ...state.data };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          current[key] = { ...current[key] };
          current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      return { data: newData };
  }),

  purchaseItemAction: (item, category) => {
    const state = get();
    if (state.data.discipline < item.cost) {
      return { success: false, message: "Not enough Brain Matter" };
    }
    // ... (rest of action logic)
    return { success: true, message: `Purchased ${item.name}` };
  },

  handleUseItemAction: (item, index, containerId) => {
    // ... (rest of action logic)
    return { success: false, message: "Error using item." };
  },

  handleSellCardAction: (cardId, value) => {
    // ... (rest of action logic)
    return { success: true, message: `Sold card for ${value} BM` };
  },

  toggleAchievementAction: (id, isCompleting) => {
    // ... (rest of action logic)
    return { success: true, rewardMsg: '' };
  },

  handleClaimMasteryRewardAction: (skillId, level, reward) => {
    // ... (rest of action logic)
    return { success: true, message: `Claimed ${reward.name}!` };
  },

  // FIXED: Restored full logic for getSkillData
  getSkillData: () => {
    const state = get();
    const data = state.data;
    
    // XP Calculation logic relies on SKILL_DETAILS being correctly imported
    const incXP = getXP(data.lifetime.totalIncomeBase * 10, 'inc', data); 
    const codXP = getXP(35000 + ((data.assets?.digitalIP || 0) * 5), 'cod', data);
    const cntXP = getXP(15000 + ((data.assets?.audience || 0) * 50), 'cnt', data);
    const secXP = getXP((data.cash || 0) + (data.lifetime.totalDebtPrincipalPaid * 10), 'sec', data);
    const astXP = getXP(data.lifetime.totalAssetAcquisitionCost * 5, 'ast', data);

    const currentCashFlowValue = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
    const updatedPeakFlow = Math.max(data.lifetime.peakCashFlow, currentCashFlowValue * 20); 
    const floXP = getXP(updatedPeakFlow, 'flo', data);
    
    const vitXP = getXP(85000, 'vit', data);
    const wisXP = getXP(30000 + (data.achievements.filter(a => a.completed).length * 5000), 'wis', data);
    const netXP = getXP(15000 + ((data.assets?.audience || 0) * 100), 'net', data);
    const invXP = getXP(Math.max((data.assets?.stocks || 0) + (data.assets?.crypto || 0), 0), 'inv', data);
    const estXP = getXP((data.assets?.realEstate || 0), 'est', data);
    const disXP = getXP(0, 'dis', data);
    const aiXP = getXP(40000, 'ai', data);

    if (updatedPeakFlow > data.lifetime.peakCashFlow) {
        set(prevState => ({ 
            data: { 
                ...prevState.data, 
                lifetime: { ...prevState.data.lifetime, peakCashFlow: updatedPeakFlow } 
            }
        }));
    }

    const skillXpMap = {
        inc: incXP, cod: codXP, cnt: cntXP, ai: aiXP, sec: secXP, vit: vitXP, 
        wis: wisXP, net: netXP, ast: astXP, flo: floXP, inv: invXP, est: estXP, dis: disXP
    };

    const totalXPs = skillXpMap;
    
    const calculatedSkills = Object.keys(SKILL_DETAILS).map(key => {
        let xp = skillXpMap[key] || 0;
        return { 
            ...SKILL_DETAILS[key], 
            id: key, 
            level: calcLevel(xp), 
            iconName: SKILL_DETAILS[key].icon || 'Circle', 
            color: SKILL_DETAILS[key].color 
        };
    });

    return { calculatedSkills, totalXPs };
  },
}));