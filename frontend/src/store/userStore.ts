import { create } from 'zustand';
import { User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';
import type { User as CrmUser } from 'crm-shared';

interface UserState {
  currentUser: User | null;
  crmUser: CrmUser | null;
  loading: boolean;
  setUser: (user: User | null) => Promise<void>;
  clearUser: () => void;
  signOut: () => Promise<void>;
  refreshCrmUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  crmUser: null,
  loading: true,

  setUser: async (user) => {
    set({ currentUser: user, loading: true });

    if (user) {
      try {
        // Fetch CRM user data
        const response = await api.get<{ data: CrmUser }>('/users/me');
        if (response.data.data) {
          set({ crmUser: response.data.data, loading: false });
        } else {
          console.error('No user data in response');
          set({ loading: false });
        }
      } catch (error) {
        console.error('Failed to fetch CRM user:', error);
        // Don't clear current user, just set loading false
        // The user is authenticated with Firebase but might not have a CRM profile yet (e.g. during signup)
        set({ loading: false });
      }
    } else {
      set({ crmUser: null, loading: false });
    }
  },

  clearUser: () => set(() => ({
    currentUser: null,
    crmUser: null,
    loading: false,
  })),

  refreshCrmUser: async () => {
    const { currentUser } = get();
    if (currentUser) {
      try {
        const response = await api.get<{ data: CrmUser }>('/users/me');
        if (response.data.data) {
          set({ crmUser: response.data.data });
        }
      } catch (error) {
        console.error('Failed to refresh CRM user:', error);
      }
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await firebaseSignOut(auth);
      set({
        currentUser: null,
        crmUser: null,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      set({ loading: false });
    }
  },
}));
