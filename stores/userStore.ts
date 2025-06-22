import { create } from 'zustand';
import { Session } from 'next-auth';

export interface UserState {
  session: Session | null;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    onboardingCompleted?: boolean;
    hasPassword?: boolean;
    isGoogleUser?: boolean;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: UserState['user']) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateOnboardingStatus: (completed: boolean) => void;
  updatePasswordStatus: (hasPassword: boolean) => void;
  clearUser: () => void;
  
  // Computed values
  getOnboardingStatus: () => boolean;
  getUserName: () => string;
  getUserEmail: () => string;
  getUserImage: () => string | null;
  getPasswordStatus: () => { hasPassword: boolean; isGoogleUser: boolean; needsPasswordSetup: boolean };
}

export const useUserStore = create<UserState>((set, get) => ({
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (session) => set((state) => ({
    session,
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading: false
  })),

  setUser: (user) => set({ user }),

  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  setLoading: (loading) => set({ isLoading: loading }),

  updateOnboardingStatus: (completed) => set((state) => ({
    user: state.user ? { ...state.user, onboardingCompleted: completed } : null,
    session: state.session ? {
      ...state.session,
      user: {
        ...state.session.user,
        onboardingCompleted: completed
      }
    } : null
  })),

  updatePasswordStatus: (hasPassword) => set((state) => ({
    user: state.user ? { ...state.user, hasPassword } : null,
    session: state.session ? {
      ...state.session,
      user: {
        ...state.session.user,
        hasPassword
      }
    } : null
  })),

  clearUser: () => set({
    session: null,
    user: null,
    isAuthenticated: false,
    isLoading: false
  }),

  // Computed values
  getOnboardingStatus: () => {
    const state = get();
    return state.user?.onboardingCompleted || state.session?.user?.onboardingCompleted || false;
  },

  getUserName: () => {
    const state = get();
    return state.user?.name || state.session?.user?.name || 'Utilisateur';
  },

  getUserEmail: () => {
    const state = get();
    return state.user?.email || state.session?.user?.email || '';
  },

  getUserImage: () => {
    const state = get();
    return state.user?.image || state.session?.user?.image || null;
  },

  getPasswordStatus: () => {
    const state = get();
    const userHasPassword = (state.user as any)?.hasPassword || (state.session?.user as any)?.hasPassword || false;
    const userIsGoogleUser = (state.user as any)?.isGoogleUser || (state.session?.user as any)?.isGoogleUser || false;
    return {
      hasPassword: userHasPassword,
      isGoogleUser: userIsGoogleUser,
      needsPasswordSetup: !userHasPassword && userIsGoogleUser
    };
  }
})); 