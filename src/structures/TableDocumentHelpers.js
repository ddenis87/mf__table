const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const REG_SYMBOLS = /[A-Z]/gi;
const REG_DIGITS = /[0-9]/g;

const RANGE_TYPE = {
  CELL: 'cell',
  RANGE: 'range',
  COLUMN: 'column',
  ROW: 'row',
};

export function getParseAtSymbolDigit(str) {
  return {
    parthSymbol: str.replace(REG_DIGITS, ''),
    parthDigit: +str.replace(REG_SYMBOLS, ''),
  };
};

export function getColumnNumberForName(name) {
  const nameLowerCase = name.toLowerCase();
  if (nameLowerCase.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
};

export function getColumnNameForNumber(number) {
  if (number > 702) return 'Infinity';
  const settLength = SET_COLUMN_NAME.length;
  if (number <= settLength) {
    const columnName = SET_COLUMN_NAME[number - 1];
    return columnName;
  }
  if ((number % settLength) === 0) {
    const columnName = `${SET_COLUMN_NAME[
      ((number - settLength) / settLength) - 1
    ]}${SET_COLUMN_NAME[settLength - 1]}`;
    return columnName;
  }
  const columnName = `${SET_COLUMN_NAME[
    (Math.floor(number / settLength)) - 1
  ]}${SET_COLUMN_NAME[(number % settLength) - 1]}`;
  return columnName;
};

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
};

export function getRangeSplit(range) {
  let splitRange = range.toString();
  if (splitRange.includes(':')) splitRange = splitRange.split(':');
  else splitRange = [splitRange, splitRange];
  return splitRange;
};

export function getRangeLength(range, isCompute = false) {
  const rangeType = getRangeType(range);
  let [r1, r2] = getRangeSplit(range);
  if (!r2 && [RANGE_TYPE.COLUMN, RANGE_TYPE.ROW].includes(rangeType)) r2 = r1;
  const rangeLength = {
    [RANGE_TYPE.CELL]: () => [1, 1],
    [RANGE_TYPE.ROW]: () => [0, (+r2 - +r1) + 1],
    [RANGE_TYPE.COLUMN]: () => {
      r1 = getColumnNumberForName(r1);
      r2 = getColumnNumberForName(r2);
      console.log(r1, r2);
      return [(+r2 - +r1) + 1, 0];
    },
    [RANGE_TYPE.RANGE]: () => {
      const { parthSymbol: columnFrom, parthDigit: rowFrom } = getParseAtSymbolDigit(r1);
      const { parthSymbol: columnTo, parthDigit: rowTo } = getParseAtSymbolDigit(r2);
      return [
        (+getColumnNumberForName(columnTo) - +getColumnNumberForName(columnFrom)) + 1,
        (+rowTo - +rowFrom) + 1,
      ];
    },
  };
  const rezult = rangeLength[rangeType]();
  return (isCompute) ? rezult[1] - rezult[0] + 1 : rezult;
};

export function getRangeShift(range, shift = SHIFT_TYPE.VERTICAL, step = 1) {
  console.log(shift);
  const rangeType = getRangeType(range);
  const rangeTypes = {
    [RANGE_TYPE.ROW]: () => {
      if (!range.includes(':')) return +range + +step;
      const [rangeFrom, rangeTo] = getRangeSplit(range);
      return `${+rangeFrom + +step}:${+rangeTo + +step}`;
    },
  };
  return rangeTypes[rangeType]();
}