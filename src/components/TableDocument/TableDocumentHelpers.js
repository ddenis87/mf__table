import store from '@/store/index';

import {
  getColumnNameForNumber,
  getColumnNumberForName,
  getParseAtSymbolDigit,
} from '../../helpers/spreadSheet';

import {
  REG_SYMBOLS,
  REG_DIGITS,
  REG_OPERATORS,
  RANGE_TYPE,
  SHIFT_TYPE,
} from './TableDocumentConst';

// const {
//   REG_SYMBOLS,
//   REG_DIGITS,
//   REG_OPERATORS,
//   RANGE_TYPE,
//   SHIFT_TYPE,
// } = CONST;

/**
 * Возвращает объект полученный путем парсинга JSON строки
 * @param {String|Object} data - строка JSON или объект
 * @returns {Object}
 */
export function getObjectOfJSON(data) {
  return (typeof data === 'string') ? JSON.parse(data) : data;
}

/**
 * Возвращает массив с началом и окончанием диапазона, полученный из строки
 * @param {String} range - диапазон
 * @returns {Array}
 * @example getRangeSplit('a1:b5') // return [a1, b5]
 */
export function getRangeSplit(range) {
  let splitRange = range.toString();
  if (splitRange.includes(':')) splitRange = splitRange.split(':');
  else splitRange = [splitRange, splitRange];
  return splitRange;
}

/**
 * Возвращает тип диапазона или undefined
 * @param {String} range - диапазон
 * @returns {RANGE_TYPE}
 */
export function getRangeType(range) {
  const [v1, v2] = `${range}`.toLowerCase().split(':');
  if (!v2) {
    if (!v1.match(REG_DIGITS)) return RANGE_TYPE.COLUMN;
    if (!v1.match(REG_SYMBOLS)) return RANGE_TYPE.ROW;
    return RANGE_TYPE.CELL;
  }
  if (+v1 && +v2) return RANGE_TYPE.ROW;
  if (v1.match(REG_DIGITS) && v1.match(REG_SYMBOLS)
    && v2.match(REG_DIGITS) && v2.match(REG_SYMBOLS)) return RANGE_TYPE.RANGE;
  if (getColumnNumberForName(v1) && getColumnNumberForName(v2)) return RANGE_TYPE.COLUMN;
  return undefined;
}

/**
 * Возвращает длину диапазона
 * @param {*} range - диапазон
 * @param {*} isCompute - ффлаг вычисления
 * @returns {Number|Array}
 */
export function getRangeLength(range, isCompute = false) {
  const rangeType = getRangeType(range);
  let [r1, r2] = getRangeSplit(range);
  const rangeLength = {
    [RANGE_TYPE.CELL]: () => {
      const rezult = (isCompute) ? 1 : [1, 1];
      return rezult;
    },
    [RANGE_TYPE.ROW]: () => {
      const rezult = (isCompute) ? (+r2 - +r1) + 1 : [0, (+r2 - +r1) + 1];
      return rezult;
    },
    [RANGE_TYPE.COLUMN]: () => {
      r1 = getColumnNumberForName(r1);
      r2 = getColumnNumberForName(r2);
      return (isCompute) ? (+r2 - +r1) + 1 : [(+r2 - +r1) + 1, 0];
    },
    [RANGE_TYPE.RANGE]: () => {
      const { parthSymbol: columnFrom, parthDigit: rowFrom } = getParseAtSymbolDigit(r1);
      const { parthSymbol: columnTo, parthDigit: rowTo } = getParseAtSymbolDigit(r2);
      return (isCompute) ? NaN : [
        (getColumnNumberForName(columnTo) - getColumnNumberForName(columnFrom)) + 1,
        (rowTo - rowFrom) + 1,
      ];
    },
  };
  const rezult = rangeLength[rangeType]();
  return rezult;
}

/**
 * Возвращает диапазон сдвинутый на заданный шаг
 * @param {String} range - диапазон
 * @param {SHIFT_TYPE} shiftType - тип сдвига
 * @param {Number} step - шаг сдвига
 * @returns {String}
 */
export function getRangeShift(range, shiftType = SHIFT_TYPE.VERTICAL, step = 1) {
  const rangeString = range.toString();
  const rangeType = getRangeType(rangeString);
  const rangeTypes = {
    [RANGE_TYPE.CELL]: () => {
      let rezult = rangeString;
      const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(rangeString);
      if (shiftType === SHIFT_TYPE.VERTICAL) rezult = `${cellColumn}${cellRow + step}`;
      if (shiftType === SHIFT_TYPE.HORIZONTAL) rezult = `${getColumnNameForNumber(getColumnNumberForName(cellColumn) + step)}${cellRow}`;
      return rezult;
    },
    [RANGE_TYPE.COLUMN]: () => {
      if (!rangeString.includes(':')) return getColumnNameForNumber(getColumnNumberForName(range) + step);
      const [rangeFrom, rangeTo] = getRangeSplit(rangeString);
      return `${getColumnNameForNumber(getColumnNumberForName(rangeFrom) + step)}:${getColumnNameForNumber(getColumnNumberForName(rangeTo) + step)}`;
    },
    [RANGE_TYPE.ROW]: () => {
      if (!rangeString.includes(':')) return +range + +step;
      const [rangeFrom, rangeTo] = getRangeSplit(rangeString);
      return `${+rangeFrom + +step}:${+rangeTo + +step}`;
    },
    [RANGE_TYPE.RANGE]: () => {
      let rezult = rangeString;
      const [rangeFrom, rangeTo] = getRangeSplit(rangeString);
      const {
        parthSymbol: rangeFromColumn, parthDigit: rangeFromRow,
      } = getParseAtSymbolDigit(rangeFrom);
      const {
        parthSymbol: rangeToColumn, parthDigit: rangeToRow,
      } = getParseAtSymbolDigit(rangeTo);
      if (shiftType === SHIFT_TYPE.VERTICAL) rezult = `${rangeFromColumn}${rangeFromRow + step}:${rangeToColumn}${rangeToRow + step}`;
      if (shiftType === SHIFT_TYPE.HORIZONTAL) rezult = `${getColumnNameForNumber(getColumnNumberForName(rangeFromColumn) + step)}${rangeFromRow}:${getColumnNameForNumber(getColumnNumberForName(rangeToColumn) + step)}${rangeToRow}`;
      return rezult;
    },
  };
  return rangeTypes[rangeType]().toString();
}

/**
 * Возвращает представление значения из других источников
 * @param {String} sourceName - имя источника
 * @param {String|Number} value - значение
 * @param {String} relatedModelView - представление источника
 * @returns {String}
 */
export function getRepresentationAtStore(sourceName, value, relatedModelView) {
  const representation = store
    .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({
      tableName: sourceName,
      id: value,
      relatedModelView,
    });
  return representation;
}

/**
 * Возвращает имя ячейки со сдвигом по местоположению
 * @param {String} cellName - имя ячейки
 * @param {String} rangeFrom - начало сдвига
 * @param {String} rangeLimit - диапазон сдвига
 * @returns {String}
 */
export function moveCell(cellName, rangeFrom = 'a1', rangeLimit = 'a1:a1') {
  const [rangeLimitFrom] = getRangeSplit(rangeLimit);
  const { parthSymbol: fromColumn, parthDigit: fromRow } = getParseAtSymbolDigit(rangeFrom);
  const fromColumnNumber = getColumnNumberForName(fromColumn);
  let {
    parthSymbol: rangeLimitFromColumn, parthDigit: rangeLimitFromRow,
  } = getParseAtSymbolDigit(rangeLimitFrom);
  if (rangeLimitFromColumn === '') rangeLimitFromColumn = 'a';
  if (rangeLimitFromRow === '') rangeLimitFromRow = 1;
  const rangeLimitFromColumnNumber = getColumnNumberForName(rangeLimitFromColumn);
  const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
  const cellColumnNumber = getColumnNumberForName(cellColumn);
  const moveColumn = cellColumnNumber - rangeLimitFromColumnNumber + fromColumnNumber;
  const moveRow = cellRow - rangeLimitFromRow + fromRow;
  return `${getColumnNameForNumber(moveColumn)}${moveRow}`;
}

/**
 * Возвращает формулу со сдвигом по местоположению
 * @param {String} cellFormula - формула ячейки
 * @param {String} cellNameCurrent - имя текущей ячейки
 * @param {String} cellNameTemplate - имя ячейки в шаблоне
 * @returns {String}
 */
export function moveFormula(cellFormula, cellNameCurrent, cellNameTemplate) {
  if (cellNameCurrent === cellNameTemplate) return cellFormula;
  const operands = cellFormula.slice(1).replace(REG_OPERATORS, '$').split('$');
  const {
    parthSymbol: currentColumn, parthDigit: currentRow,
  } = getParseAtSymbolDigit(cellNameCurrent);
  const {
    parthSymbol: templateColumn, parthDigit: templateRow,
  } = getParseAtSymbolDigit(cellNameTemplate);
  const deltaColumn = getColumnNumberForName(currentColumn)
    - getColumnNumberForName(templateColumn);
  const deltaRow = currentRow - templateRow;
  const operandsShift = new Map();
  operands.forEach((operand) => {
    if (+operand) {
      operandsShift.set(operand, operand);
      return;
    }
    const { parthSymbol: operandColumn, parthDigit: operandRow } = getParseAtSymbolDigit(operand);
    const shiftColumn = getColumnNumberForName(operandColumn) + deltaColumn;
    const shiftRow = operandRow + deltaRow;
    operandsShift.set(operand, `${getColumnNameForNumber(shiftColumn)}${shiftRow}`);
  });
  let formula = cellFormula;
  operandsShift.forEach((value, key) => {
    formula = formula.replace(key, value);
  });
  return formula;
}

/**
 * Возвращает диапазон со сдвигом по местоположению
 * @param {*} areaRange - диапазон
 * @param {*} from - начало сдвига
 * @param {*} rangeLimit - диапазон сдвига
 * @returns {String}
 */
export function moveRange(areaRange, from, rangeLimit = 'a1:a1') {
  const [sheet, upperRange] = areaRange.split('!');
  const range = upperRange.toLowerCase();
  const [rangeLimitFrom] = getRangeSplit(rangeLimit);
  let {
    parthSymbol: rangeLimitFromColumn, parthDigit: rangeLimitFromRow,
  } = getParseAtSymbolDigit(rangeLimitFrom);
  if (rangeLimitFromColumn === '') rangeLimitFromColumn = 'a';
  if (rangeLimitFromRow === '') rangeLimitFromRow = 1;
  const rangeType = getRangeType(range);
  let [rangeFrom, rangeTo] = getRangeSplit(range);
  if (rangeType === RANGE_TYPE.COLUMN) {
    rangeFrom = getColumnNumberForName(rangeFrom);
    rangeTo = getColumnNumberForName(rangeTo);
  }
  const rangeTypes = {
    [RANGE_TYPE.ROW]: () => `${sheet}!${rangeFrom - rangeLimitFromRow + from}:${rangeTo - rangeLimitFromRow + from}`,
    [RANGE_TYPE.COLUMN]: () => {
      const rangeMoveFromColumn = rangeFrom - getColumnNumberForName(rangeLimitFromColumn) + from;
      const rangeMoveToColumn = rangeTo - getColumnNumberForName(rangeLimitFromColumn) + from;
      return `${sheet}!${getColumnNameForNumber(rangeMoveFromColumn)}:${getColumnNameForNumber(rangeMoveToColumn)}`;
    },
  };
  return rangeTypes[rangeType]();
}

/**
 * Валидация значения ячейки по типу
 * @param {String|Nuber|Date} value - значение ячейки
 * @param {*} type - тип ячейки
 * @returns {Boolean}
 */
export function validateCellValueType(value = '', type = 'string') {
  if (!value && typeof type !== 'boolean') return true;
  const validate = {
    string: () => true, // (typeof v === 'string'),
    number: (v) => (typeof v === 'number'),
    integer: (v) => (typeof v === 'number'),
    float: (v) => (typeof v === 'number'),
    boolean: (v) => (typeof v === 'boolean'),
    date: (v) => (new Date(v).toDateString() !== 'Invalid Date'),
    datetime: (v) => (new Date(v).toDateString() !== 'Invalid Date'),
    field: () => true,
    choice: () => true,
  };
  return validate[type.split('.')[0]](value) || 'Значение не соответствует типу ячейки';
}
