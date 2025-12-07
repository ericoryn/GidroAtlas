

import type { WaterObject, ConditionCategory, WaterResourceType, WaterType, FaunaPresence } from '@/types';
import { convertJSONToWaterObjects } from './dataConverter';
import waterObjectsJSON from './water_objects.json';

// Преобразуем данные из JSON
const jsonWaterObjects = convertJSONToWaterObjects(waterObjectsJSON);

const existingMockWaterObjects: WaterObject[] = [
  {
    id: '1',
    name: 'Озеро Балхаш',
    region: 'Алматинская область',
    resourceType: 'lake',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 2,
    passportDate: '2021-03-15',
    latitude: 46.5,
    longitude: 75.0,
    description: 'Крупнейшее озеро Казахстана, полупресноводное',
    area: 16400,
    depth: 26,
  },
  {
    id: '2',
    name: 'Капчагайское водохранилище',
    region: 'Алматинская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 3,
    passportDate: '2020-06-20',
    latitude: 43.88,
    longitude: 77.08,
    description: 'Искусственное водохранилище на реке Или',
    area: 1847,
    depth: 45,
  },
  {
    id: '3',
    name: 'Иртыш-Караганда канал',
    region: 'Карагандинская область',
    resourceType: 'canal',
    waterType: 'fresh',
    fauna: 'no',
    conditionCategory: 4,
    passportDate: '2018-09-10',
    latitude: 49.8,
    longitude: 73.1,
    description: 'Главный водоподводящий канал центрального Казахстана',
  },
  {
    id: '4',
    name: 'Озеро Зайсан',
    region: 'Восточно-Казахстанская область',
    resourceType: 'lake',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 1,
    passportDate: '2023-01-05',
    latitude: 47.9,
    longitude: 84.3,
    description: 'Пресноводное озеро в восточном Казахстане',
    area: 1810,
    depth: 15,
  },
  {
    id: '5',
    name: 'Шардаринское водохранилище',
    region: 'Туркестанская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 5,
    passportDate: '2016-11-30',
    latitude: 41.27,
    longitude: 68.03,
    description: 'Водохранилище на реке Сырдарья',
    area: 783,
    depth: 25,
  },
  {
    id: '6',
    name: 'Большой Алматинский канал',
    region: 'Алматинская область',
    resourceType: 'canal',
    waterType: 'fresh',
    fauna: 'no',
    conditionCategory: 2,
    passportDate: '2022-04-18',
    latitude: 43.15,
    longitude: 76.95,
    description: 'Ирригационный канал в Алматинской области',
  },
  {
    id: '7',
    name: 'Озеро Алаколь',
    region: 'Область Жетысу',
    resourceType: 'lake',
    waterType: 'non-fresh',
    fauna: 'yes',
    conditionCategory: 3,
    passportDate: '2019-07-22',
    latitude: 46.2,
    longitude: 81.7,
    description: 'Бессточное солёное озеро',
    area: 2650,
    depth: 54,
  },
  {
    id: '8',
    name: 'Бухтарминское водохранилище',
    region: 'Восточно-Казахстанская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 2,
    passportDate: '2021-12-01',
    latitude: 49.16,
    longitude: 84.04,
    description: 'Крупнейшее водохранилище в Казахстане',
    area: 5490,
    depth: 90,
  },
  {
    id: '9',
    name: 'Озеро Тенгиз',
    region: 'Акмолинская область',
    resourceType: 'lake',
    waterType: 'non-fresh',
    fauna: 'yes',
    conditionCategory: 1,
    passportDate: '2023-05-14',
    latitude: 50.45,
    longitude: 68.95,
    description: 'Крупное солёное озеро, место гнездования фламинго',
    area: 1590,
    depth: 8,
  },
  {
    id: '10',
    name: 'Кызылагаш водохранилище',
    region: 'Алматинская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'no',
    conditionCategory: 4,
    passportDate: '2017-08-25',
    latitude: 44.72,
    longitude: 78.98,
    description: 'Водохранилище в предгорьях Алатау',
    area: 120,
    depth: 35,
  },
  {
    id: '11',
    name: 'Арал Северный',
    region: 'Кызылординская область',
    resourceType: 'lake',
    waterType: 'non-fresh',
    fauna: 'yes',
    conditionCategory: 3,
    passportDate: '2020-02-10',
    latitude: 46.15,
    longitude: 60.85,
    description: 'Северная часть Аральского моря',
    area: 3300,
    depth: 42,
  },
  {
    id: '12',
    name: 'Сергеевское водохранилище',
    region: 'Северо-Казахстанская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 2,
    passportDate: '2022-09-08',
    latitude: 53.48,
    longitude: 67.82,
    description: 'Водохранилище на реке Ишим',
    area: 117,
    depth: 23,
  },
  {
    id: '13',
    name: 'Озеро Сасыкколь',
    region: 'Область Жетысу',
    resourceType: 'lake',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 4,
    passportDate: '2018-04-03',
    latitude: 46.55,
    longitude: 81.0,
    description: 'Пресноводное озеро рядом с Алаколь',
    area: 736,
    depth: 5,
  },
  {
    id: '14',
    name: 'Вячеславское водохранилище',
    region: 'Акмолинская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'no',
    conditionCategory: 3,
    passportDate: '2019-11-17',
    latitude: 51.35,
    longitude: 71.5,
    description: 'Водохранилище вблизи Астаны',
    area: 61,
    depth: 18,
  },
  {
    id: '15',
    name: 'Озеро Маркаколь',
    region: 'Восточно-Казахстанская область',
    resourceType: 'lake',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 1,
    passportDate: '2023-07-20',
    latitude: 48.78,
    longitude: 85.75,
    description: 'Высокогорное озеро на Алтае',
    area: 455,
    depth: 27,
  },
  {
    id: '16',
    name: 'Каратомарское водохранилище',
    region: 'Костанайская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 5,
    passportDate: '2015-06-12',
    latitude: 52.89,
    longitude: 63.11,
    description: 'Водохранилище на реке Тобол',
    area: 86,
    depth: 20,
  },
  {
    id: '17',
    name: 'Озеро Индер',
    region: 'Атырауская область',
    resourceType: 'lake',
    waterType: 'non-fresh',
    fauna: 'no',
    conditionCategory: 2,
    passportDate: '2021-08-30',
    latitude: 48.57,
    longitude: 51.93,
    description: 'Солёное озеро с борными отложениями',
    area: 110,
    depth: 2,
  },
  {
    id: '18',
    name: 'Жезказган канал',
    region: 'Улытауская область',
    resourceType: 'canal',
    waterType: 'fresh',
    fauna: 'no',
    conditionCategory: 4,
    passportDate: '2017-03-22',
    latitude: 47.78,
    longitude: 67.71,
    description: 'Водоподводящий канал к Жезказгану',
  },
  {
    id: '19',
    name: 'Озеро Шалкар',
    region: 'Западно-Казахстанская область',
    resourceType: 'lake',
    waterType: 'non-fresh',
    fauna: 'yes',
    conditionCategory: 3,
    passportDate: '2020-05-05',
    latitude: 50.02,
    longitude: 51.13,
    description: 'Крупное солёное озеро западного Казахстана',
    area: 240,
    depth: 18,
  },
  {
    id: '20',
    name: 'Кенгир водохранилище',
    region: 'Улытауская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    fauna: 'yes',
    conditionCategory: 3,
    passportDate: '2019-09-28',
    latitude: 47.55,
    longitude: 66.95,
    description: 'Водохранилище на реке Кенгир',
    area: 45,
    depth: 30,
  },
];

export const mockWaterObjects: WaterObject[] = [
  ...existingMockWaterObjects,
  ...jsonWaterObjects,
];

export const getFilteredObjects = (
  objects: WaterObject[],
  filters: {
    region?: string;
    resourceTypes: string[];
    waterType?: string;
    fauna?: string;
    conditionCategories: number[];
    dateFrom?: string;
    dateTo?: string;
    searchQuery?: string;
  }
): WaterObject[] => {
  const filtered = objects.filter((obj) => {
    // Region filter
    if (filters.region && obj.region !== filters.region) {
      return false;
    }

    // Resource type filter
    if (filters.resourceTypes.length > 0 && !filters.resourceTypes.includes(obj.resourceType)) {
      return false;
    }

    // Water type filter
    if (filters.waterType && filters.waterType !== 'all' && obj.waterType !== filters.waterType) {
      return false;
    }

    // Fauna filter
    if (filters.fauna && filters.fauna !== 'all' && obj.fauna !== filters.fauna) {
      return false;
    }

    // Condition category filter
    if (filters.conditionCategories.length > 0 && !filters.conditionCategories.includes(obj.conditionCategory)) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const objDate = new Date(obj.passportDate);
      const fromDate = new Date(filters.dateFrom);
      if (objDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const objDate = new Date(obj.passportDate);
      const toDate = new Date(filters.dateTo);
      if (objDate > toDate) return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!obj.name.toLowerCase().includes(query) && !obj.region.toLowerCase().includes(query)) {
        return false;
      }
    }

    return true;
  });

  return filtered;
};
