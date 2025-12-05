import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, FilterParams, WaterObject, ConditionCategory } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Filters
  filters: FilterParams;
  setFilters: (filters: Partial<FilterParams>) => void;
  resetFilters: () => void;

  // UI State
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  isFilterPanelOpen: boolean;
  setFilterPanelOpen: (open: boolean) => void;
  isDetailsPanelOpen: boolean;
  setDetailsPanelOpen: (open: boolean) => void;
}

const defaultFilters: FilterParams = {
  region: undefined,
  resourceTypes: [],
  waterType: 'all',
  fauna: 'all',
  conditionCategories: [1, 2, 3, 4, 5] as ConditionCategory[],
  dateFrom: undefined,
  dateTo: undefined,
  searchQuery: '',
};

// Mock user credentials
const MOCK_USERS = [
  { username: 'expert', password: 'expert123', role: 'expert' as const },
  { username: 'admin', password: 'admin123', role: 'expert' as const },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (username: string, password: string) => {
        const foundUser = MOCK_USERS.find(
          (u) => u.username === username && u.password === password
        );
        if (foundUser) {
          set({
            user: {
              id: foundUser.username,
              username: foundUser.username,
              role: foundUser.role,
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Filters
      filters: defaultFilters,
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },
      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      // UI State
      selectedObjectId: null,
      setSelectedObjectId: (id) => set({ selectedObjectId: id }),
      isFilterPanelOpen: true,
      setFilterPanelOpen: (open) => set({ isFilterPanelOpen: open }),
      isDetailsPanelOpen: false,
      setDetailsPanelOpen: (open) => set({ isDetailsPanelOpen: open }),
    }),
    {
      name: 'gidroatlas-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Priority calculation
export function calculatePriority(object: WaterObject): { score: number; level: 'high' | 'medium' | 'low' } {
  const passportDate = new Date(object.passportDate);
  const now = new Date();
  const ageInYears = Math.floor((now.getTime() - passportDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  
  // Чем хуже состояние (выше категория), тем выше приоритет
  // Категория 1 (лучшее) = низкий приоритет, Категория 5 (худшее) = высокий приоритет
  const score = object.conditionCategory * 3 + ageInYears;
  
  let level: 'high' | 'medium' | 'low';
  if (score >= 15) {
    level = 'high';
  } else if (score >= 9) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  return { score, level };
}
