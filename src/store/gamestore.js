import { create } from 'zustand';
import { db } from '../config/firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
    initialData as staticInitialData, 
    INVENTORY_SLOTS, 
    SHOP_ITEMS, 
    CARD_DATABASE,
    SKILL_DETAILS,
    MAX_SKILL_LEVEL 
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

// Augmented initial data to include Salvage
const extendedInitialData = {
    ...staticInitialData,
    salvage: 0, // NEW RESOURCE
};

// Helper to safely merge saved data
const mergeData = (base, saved) => {
  const merged = { 
      ...base, 
      ...saved,
      salvage: saved?.salvage !== undefined ? saved.salvage : (base.salvage || 0), // Ensure salvage exists
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
  data: extendedInitialData,
  userId: 'test-user-id', 
  loading: true,
  isSaving: false,
  pendingPackOpen: null,

  loadGame: async () => {
    set({ loading: true });
    try {
      // In a real app, fetch from Firebase here. 
      // For now, we load from local storage or defaults.
      const localData = localStorage.getItem('vault_save_v1');
      if (localData) {
          const parsed = JSON.parse(localData);
          set({ data: mergeData(extendedInitialData, parsed), loading: false });
      } else {
          set({ data: extendedInitialData, loading: false });
      }
    } catch (error) {
      console.error("Load Error:", error);
      set({ data: extendedInitialData, loading: false });
    }
  },

  saveGame: async () => {
    set({ isSaving: true });
    const currentData = get().data;
    localStorage.setItem('vault_save_v1', JSON.stringify(currentData));
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

  // Updated to include Salvage drops
  updateWellness: (type, amount) => {
    let result = { success: true, message: '' };
    
    set((state) => {
        const currentVal = state.data.wellness[type];
        
        if (amount < 0) {
            const newVal = Math.min(100, Math.max(0, currentVal + amount));
            return { data: { ...state.data, wellness: { ...state.data.wellness, [type]: newVal } } };
        }

        const newVal = Math.min(100, Math.max(0, currentVal + amount));
        const newStats = { ...state.data.statistics };
        
        if (!newStats.maintenance) newStats.maintenance = { energy: 0, hydration: 0, focus: 0 };
        newStats.maintenance[type] = (newStats.maintenance[type] || 0) + 1;

        const baseReward = Math.floor(Math.random() * 11) + 10;
        const avgWellness = (state.data.wellness.energy + state.data.wellness.hydration + state.data.wellness.focus) / 3;
        const maintenanceBonus = Math.floor((avgWellness / 100) * 30);
        const totalReward = Math.min(50, baseReward + maintenanceBonus);

        const dropRoll = Math.random();
        let newInventory = [...state.data.inventory];
        let dropMsg = "";
        let newSalvage = state.data.salvage || 0;
        
        // 10% Chance for Salvage
        if (dropRoll < 0.10) {
            const salvageAmount = Math.floor(Math.random() * 3) + 1;
            newSalvage += salvageAmount;
            dropMsg = ` & Found ${salvageAmount} Salvage!`;
        } else if (dropRoll < 0.15) { // 5% Chance for Item (shifted range)
            const allItems = [...SHOP_ITEMS.boosters, ...SHOP_ITEMS.gear];
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            const updatedInv = addToSlotArray(newInventory, randomItem, 1);
            if (updatedInv) {
                newInventory = updatedInv;
                dropMsg = ` & Found ${randomItem.name}!`;
            }
        }

        result.message = `+${totalReward} BM${dropMsg}`;

        return {
            data: {
                ...state.data,
                statistics: newStats,
                wellness: { ...state.data.wellness, [type]: newVal },
                discipline: state.data.discipline + totalReward,
                inventory: newInventory,
                salvage: newSalvage
            }
        };
    });

    return result; 
  },

  // Used for the new Header Timer ticker
  tickFocusSession: (baseRate, multiplier, timeAdded) => set((state) => ({
      data: {
          ...state.data,
          discipline: state.data.discipline + (baseRate + multiplier),
          wellness: {
              ...state.data.wellness,
              focus: Math.max(0, state.data.wellness.focus - 0.05) // Slight decay per second
          }
      }
  })),

  completeFocusSession: (minutes) => {
      // Legacy function kept for compatibility if needed, though header timer replaces it
      const state = get();
      const baseReward = Math.floor(minutes * 10 * (1 + (minutes / 100)));
      set(prev => ({
          data: {
              ...prev.data,
              discipline: prev.data.discipline + baseReward,
              wellness: { ...prev.data.wellness, focus: Math.max(0, prev.data.wellness.focus - 10) }
          }
      }));
      return { success: true, message: `+${baseReward} Brain Matter`, reward: baseReward };
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
    set(prev => {
        let newInv = addToSlotArray([...prev.data.inventory], item, 1);
        if(!newInv) return prev; // Inventory full
        return {
            data: {
                ...prev.data,
                discipline: prev.data.discipline - item.cost,
                inventory: newInv,
                statistics: { ...prev.data.statistics, itemsBought: (prev.data.statistics.itemsBought || 0) + 1 }
            }
        }
    });
    return { success: true, message: `Purchased ${item.name}` };
  },

  handleUseItemAction: (item, index, containerId) => {
    set(prev => {
        const newInv = [...prev.data.inventory];
        if (newInv[index].count > 1) newInv[index] = { ...newInv[index], count: newInv[index].count - 1 };
        else newInv[index] = null;
        
        // Logic for item effects (simplified)
        let xpUpdates = {};
        if (item.type === 'Booster' && item.skillId) {
            xpUpdates = { [item.skillId]: (prev.data.bonusXP[item.skillId] || 0) + (item.xpAmount || 0) };
        }

        return {
            data: {
                ...prev.data,
                inventory: newInv,
                bonusXP: { ...prev.data.bonusXP, ...xpUpdates },
                pendingPackOpen: item.type === 'Pack' ? item : null 
            }
        };
    });
    return { success: true, message: `Used ${item.name}` };
  },

  handleSellCardAction: (cardId, value) => {
    set(prev => {
        const newCards = prev.data.cards.filter(c => c !== cardId); // Simplistic removal
        return {
            data: {
                ...prev.data,
                cards: newCards,
                discipline: prev.data.discipline + value,
                statistics: { ...prev.data.statistics, cardsSold: (prev.data.statistics.cardsSold || 0) + 1 }
            }
        }
    });
    return { success: true, message: `Sold card for ${value} BM` };
  },

  toggleAchievementAction: (id, isCompleting) => {
    let rewardMsg = '';
    set(prev => {
        const newAch = prev.data.achievements.map(a => {
            if(a.id === id) {
                if(isCompleting && !a.completed) {
                    rewardMsg = `Completed: ${a.title} (+${a.xp} XP)`;
                    return { ...a, completed: true };
                } else if (!isCompleting) {
                    return { ...a, completed: false };
                }
            }
            return a;
        });
        return { data: { ...prev.data, achievements: newAch } };
    });
    return { success: true, rewardMsg };
  },

  handleClaimMasteryRewardAction: (skillId, level, reward) => {
    // Logic to add reward to inventory and mark as claimed
    return { success: true, message: `Claimed ${reward.name}!` };
  },

  getSkillData: () => {
    const state = get();
    const data = state.data;
    
    // XP Calculation logic
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