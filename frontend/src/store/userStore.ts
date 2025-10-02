import { create } from 'zustand';
import { User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../services/firebase'; // Adjust path if needed

interface UserState {
  currentUser: User | null;
  userRole: string;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  userRole: 'admin',
  loading: false,

  setUser: (user) => set(() => ({
    currentUser: user,
    userRole: 'admin', // userRole fixed to admin for now
  })),

  clearUser: () => set(() => ({
    currentUser: null,
    userRole: 'admin',
  })),

  signOut: async () => {
    set({ loading: true });
    try {
      await firebaseSignOut(auth);
      set({
        currentUser: null,
        userRole: 'admin',
        loading: false,
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      set({ loading: false });
    }
  },
}));
