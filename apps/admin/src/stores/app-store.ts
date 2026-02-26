import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentSchoolId: string | null;
  setCurrentSchoolId: (id: string) => void;
  currentSeasonId: string | null;
  setCurrentSeasonId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  currentSchoolId: null,
  setCurrentSchoolId: (id: string) => set({ currentSchoolId: id }),
  currentSeasonId: null,
  setCurrentSeasonId: (id: string) => set({ currentSeasonId: id }),
}));
