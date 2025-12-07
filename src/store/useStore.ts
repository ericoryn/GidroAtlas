import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, FilterParams, WaterObject, ConditionCategory } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Data
  waterObjects: WaterObject[];
  isLoading: boolean;
  error: string | null;
  fetchWaterObjects: () => Promise<void>;

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

const MOCK_USERS = [
  { username: 'expert', password: 'expert123', role: 'expert' as const },
];

import { mockWaterObjects } from '@/data/mockData';

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

      // Data
      waterObjects: [],
      isLoading: false,
      error: null,
      fetchWaterObjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:3000/api/water-objects');
          if (!response.ok) throw new Error('Failed to fetch data');
          const data = await response.json();
          set({ waterObjects: data, isLoading: false });
        } catch (error) {
          console.error('Error fetching water objects:', error);
          console.log('Falling back to mock data...');
          set({ waterObjects: mockWaterObjects, isLoading: false, error: (error as Error).message });
        }
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

export function calculatePriority(object: WaterObject): { score: number; level: 'high' | 'medium' | 'low' } {
  const passportDate = new Date(object.passportDate);
  const now = new Date();
  const ageInYears = Math.floor((now.getTime() - passportDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  const score = (6 - object.conditionCategory) * 3 + ageInYears;

  let level: 'high' | 'medium' | 'low';
  if (score >= 12) {
    level = 'high';
  } else if (score >= 6) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return { score, level };
}
