import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session, MedicalRecord, Audit, Assignment, Feedback, Alert, FilterOptions } from './types';

interface AppStore {
  // Auth
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Data
  records: MedicalRecord[];
  audits: Audit[];
  assignments: Assignment[];
  feedback: Feedback[];
  alerts: Alert[];
  setRecords: (records: MedicalRecord[]) => void;
  setAudits: (audits: Audit[]) => void;
  setAssignments: (assignments: Assignment[]) => void;
  setFeedback: (feedback: Feedback[]) => void;
  setAlerts: (alerts: Alert[]) => void;

  // Filters
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  resetFilters: () => void;

  // UI
  showMaskNames: boolean;
  toggleMaskNames: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultFilters: FilterOptions = {
  month: new Date().toISOString().slice(0, 7),
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      records: [],
      audits: [],
      assignments: [],
      feedback: [],
      alerts: [],
      filters: defaultFilters,
      showMaskNames: true,
      sidebarOpen: true,

      setSession: (session) => set({ session }),
      setUser: (user) => set({ user }),
      logout: () => set({ session: null, user: null }),

      setRecords: (records) => set({ records }),
      setAudits: (audits) => set({ audits }),
      setAssignments: (assignments) => set({ assignments }),
      setFeedback: (feedback) => set({ feedback }),
      setAlerts: (alerts) => set({ alerts }),

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
      resetFilters: () => set({ filters: defaultFilters }),

      toggleMaskNames: () => set((state) => ({
        showMaskNames: !state.showMaskNames,
      })),
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen,
      })),
    }),
    {
      name: 'flowapp-store',
      partialize: (state) => ({
        session: state.session,
        filters: state.filters,
        showMaskNames: state.showMaskNames,
      }),
    }
  )
);
