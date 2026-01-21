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
  // Users map for name display
  usersMap: Record<string, string>;
  fetchAllUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  crmUser: null,
  loading: true,
  usersMap: {},

  setUser: async (user) => {
    set({ currentUser: user, loading: true });

    if (user) {
      try {
        // Fetch CRM user data
        const response = await api.get<{ data: CrmUser }>('/users/me');
        if (response.data.data) {
          set({ crmUser: response.data.data });
        }

        // Also fetch all users map when a user logs in
        get().fetchAllUsers();

        set({ loading: false });
      } catch (error) {
        console.error('Failed to fetch CRM user:', error);
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
    usersMap: {},
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

  fetchAllUsers: async () => {
    try {
      const response = await api.get<{ data: { id: string; name: string }[] }>('/users');
      if (response.data.data) {
        const map: Record<string, string> = {};
        response.data.data.forEach(u => {
          map[u.id] = u.name;
        });
        set({ usersMap: map });
      }
    } catch (error) {
      console.error('Failed to fetch all users:', error);
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
        usersMap: {}, // Clear map on sign out
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      set({ loading: false });
    }
  },
}));
