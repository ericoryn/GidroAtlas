export type WaterResourceType = 'lake' | 'canal' | 'reservoir' | 'lock' | 'hydro-unit';
export type WaterType = 'fresh' | 'non-fresh';
export type FaunaPresence = 'yes' | 'no' | 'unknown';
export type ConditionCategory = 1 | 2 | 3 | 4 | 5;
export type PriorityLevel = 'high' | 'medium' | 'low';
export type UserRole = 'guest' | 'expert';

export interface PassportDetails {
  geographical_location?: {
    admin_area?: string;
    admin_district?: string;
    location_relative_to_settlement?: string;
    boundaries?: string;
  };
  physical_characteristics?: {
    length_m?: number;
    width_m?: number;
    area_ha?: number;
    depth_max_m?: number | string;
    depth_avg_m?: number | string;
    depth_min_m?: number;
  };
  biological_characteristics?: {
    overgrowth_degree?: {
      surface_vegetation?: string;
      underwater_vegetation?: string;
    };
    phytoplankton_development?: string;
    fauna_composition?: {
      ichthyofauna?: string;
      mammals?: string;
      invertebrates?: string;
    };
    commercial_fauna_composition?: {
      ichthyofauna?: string;
      mammals?: string;
      invertebrates?: string;
    };
    fish_productivity_kg_ha?: {
      ichthyofauna?: string;
      mammals?: string;
      invertebrates?: string;
    };
  };
}

export interface WaterObject {
  id: string;
  name: string;
  region: string;
  resourceType: WaterResourceType;
  waterType: WaterType;
  fauna: FaunaPresence;
  conditionCategory: ConditionCategory;
  passportDate: string;
  latitude: number;
  longitude: number;
  passportUrl?: string;
  description?: string;
  area?: number;
  depth?: number;
  passportDetails?: PassportDetails;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface FilterParams {
  region?: string;
  resourceTypes: WaterResourceType[];
  waterType?: WaterType | 'all';
  fauna?: FaunaPresence | 'all';
  conditionCategories: ConditionCategory[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface PriorityResult {
  objectId: string;
  score: number;
  level: PriorityLevel;
  passportAgeYears: number;
}

export interface Region {
  id: string;
  name: string;
  nameRu: string;
}

export const REGIONS: Region[] = [
  { id: 'almaty', name: 'Almaty', nameRu: 'Алматинская область' },
  { id: 'aqmola', name: 'Aqmola', nameRu: 'Акмолинская область' },
  { id: 'aqtobe', name: 'Aqtobe', nameRu: 'Актюбинская область' },
  { id: 'atyrau', name: 'Atyrau', nameRu: 'Атырауская область' },
  { id: 'east-kz', name: 'East Kazakhstan', nameRu: 'Восточно-Казахстанская область' },
  { id: 'jambyl', name: 'Jambyl', nameRu: 'Жамбылская область' },
  { id: 'west-kz', name: 'West Kazakhstan', nameRu: 'Западно-Казахстанская область' },
  { id: 'karaganda', name: 'Karaganda', nameRu: 'Карагандинская область' },
  { id: 'kostanay', name: 'Kostanay', nameRu: 'Костанайская область' },
  { id: 'kyzylorda', name: 'Kyzylorda', nameRu: 'Кызылординская область' },
  { id: 'mangystau', name: 'Mangystau', nameRu: 'Мангистауская область' },
  { id: 'pavlodar', name: 'Pavlodar', nameRu: 'Павлодарская область' },
  { id: 'north-kz', name: 'North Kazakhstan', nameRu: 'Северо-Казахстанская область' },
  { id: 'turkestan', name: 'Turkestan', nameRu: 'Туркестанская область' },
  { id: 'ulytau', name: 'Ulytau', nameRu: 'Улытауская область' },
  { id: 'abai', name: 'Abai', nameRu: 'Область Абай' },
  { id: 'zhetysu', name: 'Zhetysu', nameRu: 'Область Жетысу' },
];

export const RESOURCE_TYPE_LABELS: Record<WaterResourceType, string> = {
  lake: 'Озеро',
  canal: 'Канал',
  reservoir: 'Водохранилище',
  lock: 'Шлюз',
  'hydro-unit': 'Гидроузел',
};

export const WATER_TYPE_LABELS: Record<WaterType, string> = {
  fresh: 'Пресная',
  'non-fresh': 'Соленая',
};

export const FAUNA_LABELS: Record<FaunaPresence, string> = {
  yes: 'Да',
  no: 'Нет',
  unknown: 'Неизвестно',
};

export const CATEGORY_COLORS: Record<ConditionCategory, string> = {
  1: '#22c55e',
  2: '#86efac',
  3: '#fbbf24',
  4: '#fb923c',
  5: '#ef4444',
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

export const CONDITION_LABELS: Record<ConditionCategory, string> = {
  1: 'Отлично',
  2: 'Хорошо',
  3: 'Нормально',
  4: 'Плохо',
  5: 'Критическая',
};
