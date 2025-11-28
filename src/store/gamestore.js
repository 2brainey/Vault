import { create } from 'zustand';
import { db } from '../config/firebase'; 
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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

// Helper to safely merge saved data with new initial defaults
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
  
  // FIX: Force update layout if the saved layout is from the old version
  // We check if 'left_sidebar' exists in the saved home layout. If not, it's old.
  if (!saved?.layout?.home?.left_sidebar) {
      console.log("Migrating layout to v30.0 structure...");
      merged.layout = base.layout;
      merged.widgetConfig = base.widgetConfig; 
  }

  // Inventory array size fix
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


// --- ZUSTAND STORE DEFINITION ---

export const useGameStore = create((set, get) => ({
  // 1. State Initialization
  data: initialData,
  userId: 'test-user-id', 
  loading: true,
  isSaving: false,
  pendingPackOpen: null,

  // 2. Core I/O Actions
  loadGame: async () => {
    set({ loading: true });
    const uid = get().userId; 
    const docRef = doc(db, "users", uid);
    
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const savedData = docSnap.data();
        const merged = mergeData(initialData, savedData);
        set({ data: merged });
      } else {
        await setDoc(docRef, initialData);
        set({ data: initialData });
      }
    } catch (error) {
      console.error("Firebase Load Error. Using initial data:", error);
      set({ data: initialData });
    } finally {
        set({ loading: false });
    }
  },

  saveGame: async () => {
    set({ isSaving: true });
    const uid = get().userId;
    const currentData = get().data;
    const docRef = doc(db, "users", uid);
    
    try {
      await setDoc(docRef, currentData, { merge: true }); 
      console.log("Game saved to Cloud.");
    } catch (error) {
      console.error("Firebase Save Error:", error);
    } finally {
      set({ isSaving: false });
    }
  },

  // 3. Update Actions
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
            discipline: state.data.discipline + (amount > 0 ? 5 : 0),
            lastMaintenance: now
        }
    };
  }),

  manualGrind: (skillKey, mpReward, energyCost) => {
      const state = get(); 
      if (state.data.wellness.energy >= energyCost) {
          set(prevState => {
              const prev = prevState.data;
              const newIncomeBase = (skillKey === 'inc') ? prev.lifetime.totalIncomeBase + (mpReward * 12) : prev.lifetime.totalIncomeBase;
              
              return {
                  data: {
                      ...prev,
                      wellness: { ...prev.wellness, energy: prev.wellness.energy - energyCost },
                      bonusXP: { ...prev.bonusXP, [skillKey]: (prev.bonusXP?.[skillKey] || 0) + 10 },
                      discipline: prev.discipline + mpReward,
                      lifetime: { ...prev.lifetime, totalIncomeBase: newIncomeBase }
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
      return { success: false, message: "Not enough DSC" };
    }

    set(prevState => {
        const prev = prevState.data;
        const incrementBought = (p) => ({...p.statistics, itemsBought: (p.statistics.itemsBought || 0) + 1 });
        let newInventory = [...prev.inventory];
        let newDiscipline = prev.discipline - item.cost;
        let newBonusXP = { ...prev.bonusXP };
        
        if (category === 'gear' || category === 'packs') {
            const updatedInv = addToSlotArray(prev.inventory, item, 1);
            if (!updatedInv) { 
                return { data: prev };
            }
            newInventory = updatedInv;
        } 
        else if (category === 'boosters') {
            newBonusXP[item.skillId] = (prev.bonusXP?.[item.skillId] || 0) + item.xpAmount;
        }

        return {
            data: {
                ...prev,
                statistics: incrementBought(prev),
                discipline: newDiscipline,
                inventory: newInventory,
                bonusXP: newBonusXP
            }
        };
    });

    if (category === 'gear' || category === 'packs') {
        const updatedInventory = get().data.inventory;
        const hasItem = updatedInventory.some(i => i && i.name === item.name);
        if (!hasItem && item.type !== 'Box' && item.type !== 'Pack') {
             return { success: false, message: "Inventory Full! Purchase failed." };
        }
    }
    
    return { success: true, message: `Purchased ${item.name}` };
  },

  handleUseItemAction: (item, index, containerId) => {
    if (containerId !== 'inventory') {
      return { success: false, message: "Move to Backpack to use" };
    }

    let result = { success: false, message: "Error using item." };

    set(prevState => {
        const p = prevState.data;
        let newInventory = [...p.inventory];
        let packsOpened = p.statistics.packsOpened || 0;
        
        if (newInventory[index].count > 1) { 
            newInventory[index].count--; 
        } else {
            newInventory[index] = null;
        }

        if (item.type === 'Box') {
            const pack = SHOP_ITEMS.packs.find(p => p.id === item.packId || 'p1'); 
            let updatedSlots = newInventory;
            let successCount = 0;
            
            for(let i = 0; i < (item.count || 5); i++) {
                const nextSlots = addToSlotArray(updatedSlots, pack, 1);
                if(nextSlots) {
                    updatedSlots = nextSlots;
                    successCount++;
                }
            }
            
            result = { success: true, message: `Box Opened! ${successCount} Packs added.` };
            return { data: { ...p, inventory: updatedSlots } };
            
        } else if (item.type === 'Pack') {
            const newCards = generatePackCards(item.rarity);
            set({ pendingPackOpen: newCards }); 
            packsOpened++;
            result = { success: true, message: `Opened ${item.rarity} Pack! New cards acquired.` };

            return {
                data: {
                    ...p,
                    statistics: { ...p.statistics, packsOpened: packsOpened },
                    inventory: newInventory,
                    cards: [...p.cards, ...newCards.map(c => c.id)]
                }
            };
        } else {
            result = { success: true, message: `${item.name} consumed. Effect TBD.` };
            return { data: { ...p, inventory: newInventory } };
        }
    });
    return result;
  },

  handleSellCardAction: (cardId, value) => {
    const state = get();
    const index = state.data.cards.indexOf(cardId);
    
    if (index === -1) {
        return { success: false, message: "Card not found." };
    }

    set(prevState => {
        const prev = prevState.data;
        const newCards = [...prev.cards];
        newCards.splice(index, 1); 

        return {
            data: {
                ...prev,
                statistics: { 
                    ...prev.statistics, 
                    cardsSold: (prev.statistics.cardsSold || 0) + 1,
                    totalDisciplineEarned: (prev.statistics.totalDisciplineEarned || 0) + value 
                },
                cards: newCards,
                discipline: prev.discipline + value
            }
        };
    });

    return { success: true, message: `Sold card for ${value} DSC` };
  },

  toggleAchievementAction: (id, isCompleting) => {
    const state = get();
    const achievement = state.data.achievements.find(a => a.id === id);
    if (!achievement) return { success: false };

    set(prevState => {
        const prev = prevState.data;
        let newDiscipline = prev.discipline;
        let rewardMsg = '';

        if (isCompleting) {
            newDiscipline += achievement.xp;
            if (achievement.rewardItem) {
                const updatedInv = addToSlotArray(prev.inventory, achievement.rewardItem, achievement.rewardItem.count || 1);
                if (updatedInv) {
                    prev.inventory = updatedInv;
                    rewardMsg = ` & Acquired ${achievement.rewardItem.name}`;
                } else {
                    rewardMsg = ` (Inventory Full - Item Lost)`;
                }
            }
        }

        const newAchievements = prev.achievements.map(a => 
            a.id === id ? { ...a, completed: isCompleting } : a
        );

        return {
            data: {
                ...prev,
                discipline: newDiscipline,
                achievements: newAchievements,
                statistics: { ...prev.statistics, contractsCompleted: (prev.statistics.contractsCompleted || 0) + (isCompleting ? 1 : 0) }
            }
        };
    });
    
    // We need to fetch the rewardMsg from the state update context or pre-calc it. 
    // For simplicity in this pattern, we reconstruct the msg.
    let msg = "";
    if(isCompleting && achievement.rewardItem) msg = " + Reward";
    
    return { success: true, rewardMsg: msg };
  },

  handleClaimMasteryRewardAction: (skillId, level, reward) => {
    const state = get();
    // Check if already claimed logic should be here or UI? 
    // UI handles the button state, but good to double check.
    const claimedList = state.data.lifetime.claimedMasteryRewards[skillId] || [];
    if (claimedList.includes(level)) return { success: false, message: "Already claimed." };

    set(prevState => {
        const prev = prevState.data;
        let newInventory = [...prev.inventory];
        let success = true;

        if (reward.type === 'Item' || reward.type === 'Gear' || reward.type === 'Consumable' || reward.type === 'Trophy') {
            const updated = addToSlotArray(newInventory, { ...reward, rarity: 'Rare', count: 1 }, 1);
            if (updated) newInventory = updated;
            else success = false;
        }

        if (!success) return { data: prev }; // Abort if full

        return {
            data: {
                ...prev,
                inventory: newInventory,
                lifetime: {
                    ...prev.lifetime,
                    claimedMasteryRewards: {
                        ...prev.lifetime.claimedMasteryRewards,
                        [skillId]: [...(prev.lifetime.claimedMasteryRewards[skillId] || []), level]
                    }
                }
            }
        };
    });
    
    // Check if state actually updated (hacky way without return from set)
    // Assuming success for now as we checked inventory space above
    return { success: true, message: `Claimed ${reward.name}!` };
  },

  getSkillData: () => {
    const state = get();
    const data = state.data;
    
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