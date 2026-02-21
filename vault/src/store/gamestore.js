import { create } from 'zustand';
import { db } from '../config/firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
    initialData, 
    INVENTORY_SLOTS, 
    SHOP_ITEMS, 
    CARD_DATABASE,
    SKILL_DETAILS,
    MAX_SKILL_LEVEL 
} from '../data/gamedata'; 

// --- HELPER FUNCTIONS ---

const addToSlotArray = (slots, item, quantity = 1) => {
    const newSlots = [...slots];
    // Stack existing
    const existingIndex = newSlots.findIndex(s => s && s.name === item.name && s.rarity === item.rarity);
    if (existingIndex !== -1) {
        newSlots[existingIndex] = { ...newSlots[existingIndex], count: newSlots[existingIndex].count + quantity };
        return newSlots;
    }
    // Find empty
    const emptyIndex = newSlots.findIndex(s => s === null);
    if (emptyIndex !== -1) {
        // Ensure unique ID for drag keys
        newSlots[emptyIndex] = { ...item, count: quantity, id: Date.now() + Math.random() };
        return newSlots;
    }
    return null; // Inventory full
};

// Helper to safely merge saved data
const mergeData = (base, saved) => {
  const merged = { 
      ...base, 
      ...saved,
      salvage: saved?.salvage !== undefined ? saved.salvage : (base.salvage || 0),
      lastDailyClaim: saved?.lastDailyClaim || 0, 
      lastHourlyClaim: saved?.lastHourlyClaim || 0,
      customRewards: saved?.customRewards || {}, // NEW: Merge custom rewards
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
// Reverse calc to set level: XP = 100 * (10^(Level/25) - 1)
const calcXpForLevel = (level) => Math.ceil(100 * (Math.pow(10, level / 25) - 1));

const getXP = (base, id, data) => (Number(base) || 0) + (data.bonusXP?.[id] || 0);

// --- ZUSTAND STORE ---

export const useGameStore = create((set, get) => ({
  data: { ...initialData, customRewards: {} },
  userId: 'test-user-id', 
  loading: true,
  isSaving: false,
  pendingPackOpen: null,

  loadGame: async () => {
    set({ loading: true });
    try {
      const localData = localStorage.getItem('vault_save_v1');
      if (localData) {
          const parsed = JSON.parse(localData);
          set({ data: mergeData(initialData, parsed), loading: false });
      } else {
          set({ data: initialData, loading: false });
      }
    } catch (error) {
      console.error("Load Error:", error);
      set({ data: initialData, loading: false });
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

  // --- GAMEPLAY ACTIONS ---
  claimDailyAction: () => {
    const state = get();
    const now = Date.now();
    if (now - state.data.lastDailyClaim < 86400000) return { success: false, message: "Already claimed today!" };

    set(prev => {
        const newSalvage = (prev.data.salvage || 0) + 5;
        return {
            data: {
                ...prev.data,
                lastDailyClaim: now,
                discipline: prev.data.discipline + 5000,
                salvage: newSalvage
            }
        };
    });
    return { success: true, message: "Daily Reward Claimed! +5000 BM, +5 Salvage" };
  },

  claimHourlyAction: () => {
    const state = get();
    const now = Date.now();
    if (now - state.data.lastHourlyClaim < 3600000) return { success: false, message: "Hourly crate not ready." };

    const possibleRewards = [...SHOP_ITEMS.boosters]; 
    const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
    
    set(prev => {
        const newInv = addToSlotArray([...prev.data.inventory], reward, 1) || prev.data.inventory;
        return {
            data: {
                ...prev.data,
                lastHourlyClaim: now,
                inventory: newInv
            }
        };
    });
    return { success: true, message: `Hourly Crate: Found ${reward.name}!` };
  },

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
        const totalReward = Math.min(50, baseReward);
        const dropRoll = Math.random();
        let newInventory = [...state.data.inventory];
        let dropMsg = "";
        let newSalvage = state.data.salvage || 0;
        
        if (dropRoll < 0.10) {
            const salvageAmount = Math.floor(Math.random() * 3) + 1;
            newSalvage += salvageAmount;
            dropMsg = ` & Found ${salvageAmount} Salvage!`;
        } else if (dropRoll < 0.15) { 
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

  tickFocusSession: (baseRate, multiplier, timeAdded) => set((state) => ({
      data: {
          ...state.data,
          discipline: state.data.discipline + (baseRate + multiplier),
          wellness: {
              ...state.data.wellness,
              focus: Math.max(0, state.data.wellness.focus - 0.05) 
          }
      }
  })),

  completeFocusSession: (minutes) => {
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
          if(!current[keys[i]]) current[keys[i]] = {}; // Safety check
          current = current[keys[i]];
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
        if(!newInv) return prev; 
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
        const newCards = prev.data.cards.filter(c => c !== cardId); 
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
    set(prev => {
        const currentClaims = prev.data.lifetime.claimedMasteryRewards[skillId] || [];
        if (currentClaims.includes(level)) return prev;

        const newClaims = { 
            ...prev.data.lifetime.claimedMasteryRewards, 
            [skillId]: [...currentClaims, level] 
        };
        
        let newData = { ...prev.data, lifetime: { ...prev.data.lifetime, claimedMasteryRewards: newClaims } };
        
        // Grant Reward
        if (reward.type === 'Item') {
            const newInv = addToSlotArray(newData.inventory, reward, reward.count || 1);
            if (newInv) newData.inventory = newInv;
        } else if (reward.type === 'Currency') {
            if (reward.currency === 'cash') newData.cash = (newData.cash || 0) + reward.amount;
            if (reward.currency === 'discipline') newData.discipline = (newData.discipline || 0) + reward.amount;
        } else if (reward.type === 'XP') {
             newData.bonusXP[skillId] = (newData.bonusXP[skillId] || 0) + reward.amount;
        }

        return { data: newData };
    });
    return { success: true, message: `Claimed ${reward.name}!` };
  },

  getSkillData: () => {
    const state = get();
    const data = state.data;
    
    const engXP = getXP(35000 + ((data.assets?.digitalIP || 0) * 10), 'eng', data);
    const infXP = getXP(15000 + ((data.assets?.audience || 0) * 50), 'inf', data);
    const currentCashFlowValue = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
    const liqXP = getXP((data.lifetime.totalIncomeBase * 2) + (currentCashFlowValue * 50) + (data.assets?.cash || 0), 'liq', data);
    const equXP = getXP(data.lifetime.totalAssetAcquisitionCost + (data.lifetime.totalDebtPrincipalPaid * 2) + (data.assets?.realEstate || 0) + (data.assets?.stocks || 0) + (data.assets?.crypto || 0), 'equ', data);
    const vitXP = getXP(85000 + ((data.statistics?.maintenance?.energy || 0) * 100), 'vit', data);
    const intXP = getXP(30000 + (data.achievements.filter(a => a.completed).length * 5000), 'int', data);
    const safetyMonths = data.monthlyExpenses > 0 ? (data.cash / data.monthlyExpenses) : 0;
    const secXP = getXP((safetyMonths * 5000) + (data.assets?.metals || 0), 'sec', data);
    const wilXP = getXP((data.discipline * 2) + (data.streak * 1000), 'wil', data);

    const skillXpMap = {
        eng: engXP, inf: infXP, liq: liqXP, equ: equXP, 
        vit: vitXP, int: intXP, sec: secXP, wil: wilXP
    };
    
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

    return { calculatedSkills, totalXPs: skillXpMap };
  },

  // --- DEVELOPER MODE ACTIONS ---
  
  dev_addItem: (item, qty = 1) => {
      set(prev => {
          const newInv = addToSlotArray([...prev.data.inventory], item, qty);
          return newInv ? { data: { ...prev.data, inventory: newInv } } : prev;
      });
  },

  dev_removeItem: (index) => {
      set(prev => {
          const newInv = [...prev.data.inventory];
          newInv[index] = null;
          return { data: { ...prev.data, inventory: newInv } };
      });
  },

  dev_setSkillLevel: (skillId, targetLevel) => {
      const state = get();
      const targetXP = calcXpForLevel(targetLevel);
      const currentTotal = state.getSkillData().totalXPs[skillId];
      const currentBonus = state.data.bonusXP[skillId] || 0;
      const currentBase = currentTotal - currentBonus;
      const newBonus = Math.max(0, targetXP - currentBase);

      set(prev => ({
          data: {
              ...prev.data,
              bonusXP: { ...prev.data.bonusXP, [skillId]: newBonus }
          }
      }));
  },

  dev_setMasteryReward: (skillId, level, reward) => {
      set(prev => {
          const skillRewards = prev.data.customRewards?.[skillId] || {};
          if (!reward) {
              const newSkillRewards = { ...skillRewards };
              delete newSkillRewards[level];
              return { data: { ...prev.data, customRewards: { ...prev.data.customRewards, [skillId]: newSkillRewards } } };
          }
          return { 
              data: { 
                  ...prev.data, 
                  customRewards: { 
                      ...prev.data.customRewards, 
                      [skillId]: { ...skillRewards, [level]: reward } 
                  } 
              } 
          };
      });
  }

}));