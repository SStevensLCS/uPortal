import { create } from 'zustand';

interface ParentAppState {
  currentStudentId: string | null;
  setCurrentStudentId: (id: string | null) => void;
  currentSchoolId: string | null;
  setCurrentSchoolId: (id: string) => void;
}

export const useAppStore = create<ParentAppState>((set) => ({
  currentStudentId: null,
  setCurrentStudentId: (id) => set({ currentStudentId: id }),
  currentSchoolId: null,
  setCurrentSchoolId: (id) => set({ currentSchoolId: id }),
}));
