const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const REG_SYMBOLS = /[A-Z]/gi;
const REG_DIGITS = /[0-9]/g;

function getColumnNameForNumber(number) {
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
}

function getColumnNumberForName(name) {
  const nameLowerCase = name.toLowerCase();
  if (nameLowerCase.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
}

function getParseAtSymbolDigit(str) {
  return {
    parthSymbol: str.replace(REG_DIGITS, ''),
    parthDigit: +str.replace(REG_SYMBOLS, ''),
  };
}

export {
  REG_SYMBOLS,
  REG_DIGITS,
  getColumnNameForNumber,
  getColumnNumberForName,
  getParseAtSymbolDigit,
};
