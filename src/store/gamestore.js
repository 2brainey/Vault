import { create } from 'zustand';
import { db } from '../config/firebase'; // Import your firebase config
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { initialData, INVENTORY_SLOTS } from '../data/gamedata';

// Helper to prevent overwriting defaults with older save versions
const mergeData = (base, saved) => {
  return {
    ...base,
    ...saved,
    statistics: { ...base.statistics, ...(saved?.statistics || {}) },
    bonusXP: { ...base.bonusXP, ...(saved?.bonusXP || {}) },
    wellness: { ...base.wellness, ...(saved?.wellness || {}) },
    assets: { ...base.assets, ...(saved?.assets || {}) },
    liabilities: { ...base.liabilities, ...(saved?.liabilities || {}) },
    inventory: Array.isArray(saved?.inventory) ? saved.inventory : base.inventory,
    // Add other nested objects as needed
  };
};

export const useGameStore = create((set, get) => ({
  // 1. State Initialization
  data: initialData,
  userId: 'test-user-id', // We'll implement real Auth later
  loading: true,

  // 2. Actions (Functions to modify state)
  
  // Load data from Firebase (replaces localStorage logic)
  loadGame: async () => {
    set({ loading: true });
    const uid = get().userId;
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const savedData = docSnap.data();
        const merged = mergeData(initialData, savedData);
        set({ data: merged, loading: false });
      } else {
        // Create new user doc if none exists
        await setDoc(docRef, initialData);
        set({ data: initialData, loading: false });
      }
    } catch (error) {
      console.error("Error loading save:", error);
      // Fallback to local initialData if offline
      set({ data: initialData, loading: false });
    }
  },

  // Save data to Firebase
  saveGame: async () => {
    const uid = get().userId;
    const currentData = get().data;
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, currentData);
      console.log("Game saved to Cloud.");
    } catch (error) {
      console.error("Error saving game:", error);
    }
  },

  // Example of a specific update action
  setDiscipline: (amount) => set((state) => {
    const newData = { ...state.data, discipline: amount };
    return { data: newData };
  }),

  updateWellness: (type, amount) => set((state) => {
    const currentVal = state.data.wellness[type];
    const newVal = Math.min(100, Math.max(0, currentVal + amount));
    
    const newData = {
        ...state.data,
        wellness: { ...state.data.wellness, [type]: newVal },
        discipline: state.data.discipline + (amount > 0 ? 5 : 0)
    };
    
    return { data: newData };
  }),

  // Generic update (use sparingly, try to make specific actions like above)
  updateData: (updater) => set((state) => {
      const newData = typeof updater === 'function' ? updater(state.data) : updater;
      return { data: { ...state.data, ...newData } };
  })

}));