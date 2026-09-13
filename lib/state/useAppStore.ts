"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductTest, UserProfile } from "@/types";

interface AppState {
  // auth (demo mode — see /lib/auth for the swap-in point for real Supabase auth)
  session: { email: string; name: string } | null;
  profile: UserProfile | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;

  // sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // global command palette (Cmd+K)
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;

  // watchlist
  watchlist: string[];
  toggleWatchlist: (productId: string) => void;
  isWatchlisted: (productId: string) => boolean;

  // compare tray
  compareIds: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  // tracked competitors (store ids)
  competitors: string[];
  toggleCompetitor: (storeId: string) => void;

  // tests
  tests: ProductTest[];
  addTest: (test: ProductTest) => void;
  updateTest: (id: string, patch: Partial<ProductTest>) => void;
  removeTest: (id: string) => void;

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: null,
      profile: null,
      login: (email, name) =>
        set({
          session: { email, name: name || email.split("@")[0] },
        }),
      logout: () => set({ session: null, profile: null }),
      completeOnboarding: (data) =>
        set((state) => ({
          profile: {
            name: state.session?.name || "there",
            email: state.session?.email || "",
            onboarded: true,
            ...state.profile,
            ...data,
          },
        })),

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      commandOpen: false,
      setCommandOpen: (v) => set({ commandOpen: v }),

      watchlist: [],
      toggleWatchlist: (productId) =>
        set((s) => ({
          watchlist: s.watchlist.includes(productId)
            ? s.watchlist.filter((id) => id !== productId)
            : [...s.watchlist, productId],
        })),
      isWatchlisted: (productId) => get().watchlist.includes(productId),

      compareIds: [],
      toggleCompare: (productId) =>
        set((s) => ({
          compareIds: s.compareIds.includes(productId)
            ? s.compareIds.filter((id) => id !== productId)
            : s.compareIds.length >= 4
            ? s.compareIds
            : [...s.compareIds, productId],
        })),
      clearCompare: () => set({ compareIds: [] }),

      competitors: [],
      toggleCompetitor: (storeId) =>
        set((s) => ({
          competitors: s.competitors.includes(storeId)
            ? s.competitors.filter((id) => id !== storeId)
            : [...s.competitors, storeId],
        })),

      tests: [],
      addTest: (test) => set((s) => ({ tests: [test, ...s.tests] })),
      updateTest: (id, patch) =>
        set((s) => ({ tests: s.tests.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      removeTest: (id) => set((s) => ({ tests: s.tests.filter((t) => t.id !== id) })),

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "winner-os-store",
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
        watchlist: state.watchlist,
        tests: state.tests,
        competitors: state.competitors,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
