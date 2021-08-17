import {
  // REG_SYMBOLS,
  // REG_DIGITS,
  getColumnNameForNumber,
  getColumnNumberForName,
  getParseAtSymbolDigit,
} from '../../helpers/spreadSheet';

// const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const REG_SYMBOLS = /[A-Z]/gi;
const REG_DIGITS = /[0-9]/g;

export const RANGE_TYPE = {
  CELL: 'cell',
  RANGE: 'range',
  COLUMN: 'column',
  ROW: 'row',
};

export const SHIFT_TYPE = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

// export function getColumnNameForNumber(number) {

// }
//   if (number > 702) return 'Infinity';
//   const settLength = SET_COLUMN_NAME.length;
//   if (number <= settLength) {
//     const columnName = SET_COLUMN_NAME[number - 1];
//     return columnName;
//   }
//   if ((number % settLength) === 0) {
//     const columnName = `${SET_COLUMN_NAME[
//       ((number - settLength) / settLength) - 1
//     ]}${SET_COLUMN_NAME[settLength - 1]}`;
//     return columnName;
//   }
//   const columnName = `${SET_COLUMN_NAME[
//     (Math.floor(number / settLength)) - 1
//   ]}${SET_COLUMN_NAME[(number % settLength) - 1]}`;
//   return columnName;
// }

// export function getColumnNumberForName(name) {
//   const nameLowerCase = name.toLowerCase();
//   if (nameLowerCase.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase) + 1;
//   const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[0]) + 1;
//   const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[1]) + 1;
//   return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
// }

// export function getParseAtSymbolDigit(str) {
//   return {
//     parthSymbol: str.replace(REG_DIGITS, ''),
//     parthDigit: +str.replace(REG_SYMBOLS, ''),
//   };
// }
// export function deltaCell(currentCell, shiftCell) {
//   const { parthSymbol: currentColumn, parthDigit: currentRow } = getParseAtSymbolDigit(currentCell);
//   const { parthSymbol: shiftColumn, parthDigit: shiftRow } = getParseAtSymbolDigit(shiftCell);
//   return {
//     deltaRow: shiftRow - currentRow,
//     deltaColumn: getColumnNumberForName(shiftColumn) - getColumnNumberForName(currentColumn),
//   };
// }

export function getRangeSplit(range) {
  // console.log(range);
  let splitRange = range.toString();
  if (splitRange.includes(':')) splitRange = splitRange.split(':');
  else splitRange = [splitRange, splitRange];
  return splitRange;
}

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
      const { parthSymbol: rangeFromColumn, parthDigit: rangeFromRow } = getParseAtSymbolDigit(rangeFrom);
      const { parthSymbol: rangeToColumn, parthDigit: rangeToRow } = getParseAtSymbolDigit(rangeTo);
      if (shiftType === SHIFT_TYPE.VERTICAL) rezult = `${rangeFromColumn}${rangeFromRow + step}:${rangeToColumn}${rangeToRow + step}`;
      if (shiftType === SHIFT_TYPE.HORIZONTAL) rezult = `${getColumnNameForNumber(getColumnNumberForName(rangeFromColumn) + step)}${rangeFromRow}:${getColumnNameForNumber(getColumnNumberForName(rangeToColumn) + step)}${rangeToRow}`;
      return rezult;
    },
  };
  return rangeTypes[rangeType]().toString();
}

export function moveCell(cellName, from = 'a1', rangeLimit = 'a1:a1') {
  const [rangeLimitFrom] = getRangeSplit(rangeLimit);
  const { parthSymbol: fromColumn, parthDigit: fromRow } = getParseAtSymbolDigit(from);
  const fromColumnNumber = getColumnNumberForName(fromColumn);
  let { parthSymbol: rangeLimitFromColumn, parthDigit: rangeLimitFromRow } = getParseAtSymbolDigit(rangeLimitFrom);
  if (rangeLimitFromColumn === '') rangeLimitFromColumn = 'a';
  if (rangeLimitFromRow === '') rangeLimitFromRow = 1;
  const rangeLimitFromColumnNumber = getColumnNumberForName(rangeLimitFromColumn);
  const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
  const cellColumnNumber = getColumnNumberForName(cellColumn);
  const moveColumn = cellColumnNumber - rangeLimitFromColumnNumber + fromColumnNumber;
  const moveRow = cellRow - rangeLimitFromRow + fromRow;
  return `${getColumnNameForNumber(moveColumn)}${moveRow}`;
}

export function moveRange(range, from, rangeLimit = 'a1:a1') {
  const [rangeLimitFrom] = getRangeSplit(rangeLimit);
  let { parthSymbol: rangeLimitFromColumn, parthDigit: rangeLimitFromRow } = getParseAtSymbolDigit(rangeLimitFrom);
  if (rangeLimitFromColumn === '') rangeLimitFromColumn = 'a';
  if (rangeLimitFromRow === '') rangeLimitFromRow = 1;
  const rangeType = getRangeType(range);
  let [rangeFrom, rangeTo] = getRangeSplit(range);
  if (rangeType === RANGE_TYPE.COLUMN) {
    rangeFrom = getColumnNumberForName(rangeFrom);
    rangeTo = getColumnNumberForName(rangeTo);
  }
  const rangeTypes = {
    [RANGE_TYPE.ROW]: () => `${rangeFrom - rangeLimitFromRow + from}:${rangeTo - rangeLimitFromRow + from}`,
    [RANGE_TYPE.COLUMN]: () => {
      const rangeMoveFromColumn = rangeFrom - getColumnNumberForName(rangeLimitFromColumn) + from;
      const rangeMoveToColumn = rangeTo - getColumnNumberForName(rangeLimitFromColumn) + from;
      return `${getColumnNameForNumber(rangeMoveFromColumn)}:${getColumnNameForNumber(rangeMoveToColumn)}`;
    },
  };
  return rangeTypes[rangeType]();
}

// export function moveFormula(formula) {
//   let [func, value] = formula.split('(');
//   func = func.slice(1);
//   console.log(func);
//   value = value.slice(0, -1).toLowerCase().split(';');
//   console.log(...value);
//   value.map((item) => moveCell(item, 'a1', 'a1:a2'));
//   console.log(...value);
//   return value;
// }
