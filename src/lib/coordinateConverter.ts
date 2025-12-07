/**
 * Утилита для преобразования координат из формата DMS (градусы, минуты, секунды)
 * в формат Decimal Degrees (десятичные градусы)
 * 
 * Поддерживает форматы:
 * - "N 49º31'21\", E 67º03'11\""
 * - "42°47′ с. ш. 71°33′ в. д."
 * - "49º31'21\" N, 67º03'11\" E"
 */

interface ParsedCoordinate {
  degrees: number;
  minutes: number;
  seconds: number;
  hemisphere: 'N' | 'S' | 'E' | 'W';
}

/**
 * Парсит строку координаты в формате DMS
 * @param coordString - строка координаты (например, "N 49º31'21\"")
 * @returns объект с градусами, минутами, секундами и полушарием
 */
function parseDMS(coordString: string): ParsedCoordinate | null {
  // Нормализация строки: удаление лишних пробелов, замена различных символов градусов
  const normalized = coordString
    .trim()
    .replace(/[º°]/g, '°')
    .replace(/['′]/g, "'")
    .replace(/["″]/g, '"')
    .replace(/\s+/g, ' ');

  // Паттерн для формата: N 49°31'21" или 49°31'21" N
  const patterns = [
    // Формат: N 49°31'21" или E 67°03'11"
    /([NSЕЗ])\s*(\d+)[°º]\s*(\d+)['′]\s*([\d.]+)["″]?/i,
    // Формат: 49°31'21" N или 67°03'11" E
    /(\d+)[°º]\s*(\d+)['′]\s*([\d.]+)["″]?\s*([NSЕЗ])/i,
    // Формат: 42°47′ с. ш. (только градусы и минуты)
    /(\d+)[°º]\s*(\d+)['′]\s*([NSЕЗ])/i,
    // Формат: N 49°31' (только градусы и минуты)
    /([NSЕЗ])\s*(\d+)[°º]\s*(\d+)['′]/i,
  ];

  // Сначала проверяем русские форматы "с. ш." и "в. д."
  if (normalized.includes('с.ш') || normalized.includes('с. ш') || normalized.includes('С.Ш') || normalized.includes('С. Ш')) {
    const match = normalized.match(/(\d+)[°º]\s*(\d+)['′]/);
    if (match) {
      return {
        degrees: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
        seconds: 0,
        hemisphere: 'N',
      };
    }
  }
  
  if (normalized.includes('в.д') || normalized.includes('в. д') || normalized.includes('В.Д') || normalized.includes('В. Д')) {
    const match = normalized.match(/(\d+)[°º]\s*(\d+)['′]/);
    if (match) {
      return {
        degrees: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
        seconds: 0,
        hemisphere: 'E',
      };
    }
  }

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      let degrees: number;
      let minutes: number;
      let seconds: number;
      let hemisphere: 'N' | 'S' | 'E' | 'W';

      if (match[1] && /[NSЕЗ]/i.test(match[1])) {
        // Первый формат: N 49°31'21"
        hemisphere = normalizeHemisphere(match[1]);
        degrees = parseInt(match[2], 10);
        minutes = parseInt(match[3], 10);
        seconds = parseFloat(match[4] || '0');
      } else if (match[4] && /[NSЕЗ]/i.test(match[4])) {
        // Второй формат: 49°31'21" N
        degrees = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        seconds = parseFloat(match[3] || '0');
        hemisphere = normalizeHemisphere(match[4]);
      } else if (match[3] && /[NSЕЗ]/i.test(match[3])) {
        // Третий формат: 42°47′ с. ш.
        degrees = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        seconds = 0;
        hemisphere = normalizeHemisphere(match[3]);
      } else {
        // Четвертый формат: N 49°31'
        hemisphere = normalizeHemisphere(match[1]);
        degrees = parseInt(match[2], 10);
        minutes = parseInt(match[3], 10);
        seconds = 0;
      }

      return { degrees, minutes, seconds, hemisphere };
    }
  }

  return null;
}

/**
 * Нормализует обозначение полушария
 */
function normalizeHemisphere(hemisphere: string): 'N' | 'S' | 'E' | 'W' {
  const upper = hemisphere.toUpperCase();
  if (upper === 'N' || upper === 'С' || upper === 'СЕВЕР' || upper.includes('СЕВЕР')) return 'N';
  if (upper === 'S' || upper === 'Ю' || upper === 'ЮГ' || upper.includes('ЮГ')) return 'S';
  if (upper === 'E' || upper === 'В' || upper === 'ВОСТОК' || upper.includes('ВОСТОК')) return 'E';
  if (upper === 'W' || upper === 'З' || upper === 'ЗАПАД' || upper.includes('ЗАПАД')) return 'W';
  return 'N'; // По умолчанию
}

/**
 * Преобразует координату из DMS в Decimal Degrees
 * @param coordString - строка координаты в формате DMS
 * @returns десятичные градусы (положительные для N/E, отрицательные для S/W)
 */
export function dmsToDecimal(coordString: string): number | null {
  const parsed = parseDMS(coordString);
  if (!parsed) {
    console.warn(`Не удалось распарсить координату: ${coordString}`);
    return null;
  }

  const decimal = parsed.degrees + parsed.minutes / 60 + parsed.seconds / 3600;
  
  // Для южного и западного полушарий делаем отрицательным
  if (parsed.hemisphere === 'S' || parsed.hemisphere === 'W') {
    return -decimal;
  }
  
  return decimal;
}

/**
 * Парсит строку с двумя координатами (широта и долгота)
 * @param coordString - строка вида "N 49º31'21\", E 67º03'11\"" или "42°47′ с. ш. 71°33′ в. д."
 * @returns объект с latitude и longitude в десятичных градусах
 */
export function parseCoordinates(coordString: string): { latitude: number; longitude: number } | null {
  console.log('Парсинг координат:', coordString);
  
  // Разделяем на широту и долготу
  // Используем регулярное выражение для поиска разделителя между широтой и долготой
  // Формат: "42°47′ с. ш. 71°33′ в. д."
  
  // Паттерн для поиска: "с. ш." или "с.ш." за которым следует пробел и затем долгота с "в. д." или "в.д."
  const latLonPattern = /(.+?)\s+(с\.?\s*ш\.?|С\.?\s*Ш\.?)\s+(.+?)\s+(в\.?\s*д\.?|В\.?\s*Д\.?)/i;
  const match = coordString.match(latLonPattern);
  
  let latString = '';
  let lonString = '';
  
  if (match) {
    // Нашли паттерн с русскими обозначениями
    latString = (match[1] + ' ' + match[2]).trim(); // "42°47′ с. ш."
    lonString = (match[3] + ' ' + match[4]).trim(); // "71°33′ в. д."
    console.log(`Найден паттерн с русскими обозначениями: lat="${latString}", lon="${lonString}"`);
  } else {
    // Пробуем другие разделители
    const separators = [' в. д.', ' в.д.', ' В. Д.', ' В.Д.', 'в. д.', 'в.д.', 'В. Д.', 'В.Д.', ',', ';', ' E', ' E', 'E', 'В'];
    
    for (const sep of separators) {
      const index = coordString.indexOf(sep);
      if (index > 0) {
        latString = coordString.substring(0, index).trim();
        lonString = coordString.substring(index + sep.length).trim();
        
        // Если разделитель - это E/В/в.д., нужно добавить его обратно к долготе
        if (['E', 'В', 'в. д.', 'в.д.', 'В. Д.', 'В.Д.'].includes(sep.trim())) {
          lonString = sep.trim() + ' ' + lonString;
        }
        console.log(`Найден разделитель "${sep}": lat="${latString}", lon="${lonString}"`);
        break;
      }
    }
  }
  
  // Если не нашли разделитель, пробуем парсить как единую строку
  if (!latString || !lonString) {
    // Пробуем найти два числа с градусами
    const matches = coordString.match(/(\d+)[°º]/g);
    if (matches && matches.length >= 2) {
      const firstMatch = coordString.indexOf(matches[0]);
      const secondMatch = coordString.indexOf(matches[1], firstMatch + matches[0].length);
      
      latString = coordString.substring(0, secondMatch).trim();
      lonString = coordString.substring(secondMatch).trim();
      console.log(`Разделение по градусам: lat="${latString}", lon="${lonString}"`);
    } else {
      console.warn('Не найдено два числа с градусами');
      return null;
    }
  }
  
  const latitude = dmsToDecimal(latString);
  const longitude = dmsToDecimal(lonString);
  
  if (latitude === null || longitude === null) {
    console.warn(`Не удалось распарсить координаты из строки: ${coordString}`, { latString, lonString, latitude, longitude });
    return null;
  }
  
  console.log(`Успешно распарсены координаты: lat=${latitude}, lon=${longitude}`);
  return { latitude, longitude };
}

/**
 * Парсит координаты из объекта с center, north, south, east, west
 * Использует center для основной координаты
 */
export function parseCoordinateObject(
  coords: { center?: string; north?: string; south?: string; east?: string; west?: string } | string
): { latitude: number; longitude: number } | null {
  if (typeof coords === 'string') {
    return parseCoordinates(coords);
  }
  
  if (coords.center) {
    return parseCoordinates(coords.center);
  }
  
  // Если нет center, пробуем вычислить из границ
  if (coords.north && coords.south && coords.east && coords.west) {
    const north = dmsToDecimal(coords.north);
    const south = dmsToDecimal(coords.south);
    const east = dmsToDecimal(coords.east);
    const west = dmsToDecimal(coords.west);
    
    if (north !== null && south !== null && east !== null && west !== null) {
      const latitude = (north + south) / 2;
      const longitude = (east + west) / 2;
      return { latitude, longitude };
    }
  }
  
  return null;
}

