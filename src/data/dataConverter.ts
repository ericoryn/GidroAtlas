/**
 * AI-GENERATED: Конвертер данных из JSON формата в формат WaterObject
 * Уникальный идентификатор: DATA_CONVERTER_001
 */

import type { WaterObject, WaterResourceType, WaterType, FaunaPresence, ConditionCategory, PassportDetails } from '@/types';
import { parseCoordinateObject, parseCoordinates } from '@/lib/coordinateConverter';

// Типы для JSON данных
interface HydroTechnicalStructureJSON {
  name: string;
  region: string;
  resource_type: string;
  water_type: string;
  fauna_presence: string;
  passport_date: string;
  technical_condition: number;
  coordinates: string;
}

interface WaterBodyLakeJSON {
  name: string;
  region: string;
  resource_type: string;
  water_type: string;
  fauna_presence: string;
  passport_date: string;
  technical_condition: number | string;
  coordinates: string | {
    center?: string;
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
  passport_details?: PassportDetails;
}

interface WaterObjectsJSON {
  hydro_technical_structures: HydroTechnicalStructureJSON[];
  water_bodies_lakes: WaterBodyLakeJSON[];
}

/**
 * Преобразует тип ресурса из строки JSON в WaterResourceType
 */
function convertResourceType(resourceType: string): WaterResourceType {
  const normalized = resourceType.toLowerCase().trim();
  console.log(`Преобразование типа ресурса: "${resourceType}" -> нормализовано: "${normalized}"`);
  if (normalized === 'озеро' || normalized === 'lake') return 'lake';
  if (normalized === 'канал' || normalized === 'canal') return 'canal';
  if (normalized === 'водохранилище' || normalized === 'reservoir') return 'reservoir';
  if (normalized === 'шлюз' || normalized === 'lock') {
    console.log('Найден тип: шлюз -> lock');
    return 'lock';
  }
  if (normalized === 'гидроузел' || normalized === 'hydro-unit') {
    console.log('Найден тип: гидроузел -> hydro-unit');
    return 'hydro-unit';
  }
  console.warn(`Неизвестный тип ресурса: "${resourceType}", используется 'lake' по умолчанию`);
  return 'lake'; // По умолчанию
}

/**
 * Преобразует тип воды из строки JSON в WaterType
 */
function convertWaterType(waterType: string): WaterType {
  const normalized = waterType.toLowerCase().trim();
  if (normalized === 'пресная' || normalized === 'fresh' || normalized === 'да') return 'fresh';
  if (normalized === 'непресная' || normalized === 'соленая' || normalized === 'non-fresh' || normalized === 'нет') return 'non-fresh';
  return 'non-fresh'; // По умолчанию
}

/**
 * Преобразует наличие фауны из строки JSON в FaunaPresence
 */
function convertFaunaPresence(fauna: string): FaunaPresence {
  const normalized = fauna.toLowerCase().trim();
  if (normalized === 'да' || normalized === 'yes') return 'yes';
  if (normalized === 'нет' || normalized === 'no') return 'no';
  return 'unknown';
}

/**
 * Преобразует дату из формата DD.MM.YYYY в YYYY-MM-DD
 */
function convertDate(dateString: string): string {
  // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Пробуем парсить DD.MM.YYYY
  const match = dateString.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  
  // Если не удалось распарсить, используем текущую дату минус случайное количество лет (для тестовых данных)
  if (dateString.includes('любая даты для теста')) {
    const yearsAgo = Math.floor(Math.random() * 5) + 1;
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    return date.toISOString().split('T')[0];
  }
  
  // По умолчанию возвращаем текущую дату
  return new Date().toISOString().split('T')[0];
}

/**
 * Вычисляет категорию состояния на основе формулы приоритета (для объектов без явной категории)
 */
function calculateConditionCategory(passportDate: string, priorityScore?: number): ConditionCategory {
  // Если есть явная категория, используем её
  if (priorityScore !== undefined) {
    // Обратная формула: если приоритет высокий, категория должна быть выше
    // Это упрощённая логика, в реальности нужно учитывать возраст паспорта
    const ageInYears = Math.floor((new Date().getTime() - new Date(convertDate(passportDate)).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (ageInYears > 5) return 5;
    if (ageInYears > 3) return 4;
    if (ageInYears > 2) return 3;
    if (ageInYears > 1) return 2;
    return 1;
  }
  
  // По умолчанию возвращаем среднюю категорию
  return 3;
}

/**
 * Преобразует гидротехническое сооружение из JSON в WaterObject
 */
function convertHydroTechnicalStructure(
  structure: HydroTechnicalStructureJSON,
  index: number
): WaterObject | null {
  const coords = parseCoordinates(structure.coordinates);
  if (!coords) {
    console.warn(`Не удалось распарсить координаты для ${structure.name}`, structure.coordinates);
    return null;
  }
  console.log(`Преобразованы координаты для ${structure.name}:`, coords);

  const conditionCategory = structure.technical_condition as ConditionCategory;
  const passportDate = convertDate(structure.passport_date);

  return {
    id: `hts-${index}`,
    name: structure.name,
    region: structure.region,
    resourceType: convertResourceType(structure.resource_type),
    waterType: convertWaterType(structure.water_type),
    fauna: convertFaunaPresence(structure.fauna_presence),
    conditionCategory,
    passportDate,
    latitude: coords.latitude,
    longitude: coords.longitude,
    description: `${structure.resource_type} в ${structure.region}`,
  };
}

/**
 * Преобразует озеро из JSON в WaterObject
 */
function convertWaterBodyLake(
  lake: WaterBodyLakeJSON,
  index: number
): WaterObject | null {
  const coords = parseCoordinateObject(lake.coordinates);
  if (!coords) {
    console.warn(`Не удалось распарсить координаты для ${lake.name}`, lake.coordinates);
    return null;
  }
  console.log(`Преобразованы координаты для ${lake.name}:`, coords);

  let conditionCategory: ConditionCategory;
  if (typeof lake.technical_condition === 'number') {
    conditionCategory = lake.technical_condition as ConditionCategory;
  } else {
    // Вычисляем категорию на основе даты паспорта
    conditionCategory = calculateConditionCategory(lake.passport_date);
  }

  const passportDate = convertDate(lake.passport_date);
  const area = lake.passport_details?.physical_characteristics?.area_ha 
    ? lake.passport_details.physical_characteristics.area_ha / 100 // Конвертируем га в км²
    : undefined;

  let depth: number | undefined;
  const depthMax = lake.passport_details?.physical_characteristics?.depth_max_m;
  if (typeof depthMax === 'number') {
    depth = depthMax;
  }

  return {
    id: `lake-${index}`,
    name: lake.name,
    region: lake.region,
    resourceType: 'lake',
    waterType: convertWaterType(lake.water_type),
    fauna: convertFaunaPresence(lake.fauna_presence),
    conditionCategory,
    passportDate,
    latitude: coords.latitude,
    longitude: coords.longitude,
    description: `Озеро в ${lake.region}`,
    area,
    depth,
    passportDetails: lake.passport_details,
  };
}

/**
 * Преобразует JSON данные в массив WaterObject
 */
export function convertJSONToWaterObjects(jsonData: WaterObjectsJSON): WaterObject[] {
  const objects: WaterObject[] = [];

  // Преобразуем гидротехнические сооружения
  jsonData.hydro_technical_structures.forEach((structure, index) => {
    const converted = convertHydroTechnicalStructure(structure, index);
    if (converted) {
      objects.push(converted);
    }
  });

  // Преобразуем озёра
  jsonData.water_bodies_lakes.forEach((lake, index) => {
    const converted = convertWaterBodyLake(lake, index);
    if (converted) {
      objects.push(converted);
    }
  });

  return objects;
}

/**
 * Загружает и преобразует данные из JSON файла
 */
export async function loadWaterObjectsFromJSON(): Promise<WaterObject[]> {
  try {
    const response = await fetch('/src/data/water_objects.json');
    if (!response.ok) {
      throw new Error(`Failed to load water_objects.json: ${response.statusText}`);
    }
    const jsonData: WaterObjectsJSON = await response.json();
    return convertJSONToWaterObjects(jsonData);
  } catch (error) {
    console.error('Ошибка при загрузке данных из JSON:', error);
    return [];
  }
}

