/* eslint-disable import/prefer-default-export */

import {
  REG_DIGITS,
  REG_SYMBOLS,
} from './TDocumentConst';

import {
  getColumnNameForNumber,
  getColumnNumberForName,
} from '../../helpers/spreadSheet';

/**
 * Проверяет вхождение index в rangeIndexes (граничные значения включены)
 * @param {Number} index 
 * @param {Array} rangeIndexes 
 * @returns {Boolean}
 */
export function isInRange(index, rangeIndexes) {
  return (index >= rangeIndexes[0] && index <= rangeIndexes[1]);
}

/**
 * Возвращает объект полученный из JSON строки
 * @param {String} JSONString
 * @return {Object}
 */
export function getJSONParse(JSONString) {
  if (typeof JSONString === 'string') return JSON.parse(JSONString);
  return JSONString;
}

export function getParseAtSymbolDigit(str) {
  const result = {};
  if (str.replace(REG_DIGITS, '').length) result.parthSymbol = str.replace(REG_DIGITS, '');
  if (str.replace(REG_SYMBOLS, '').length) result.parthDigit = str.replace(REG_SYMBOLS, '');
  return result;
}

export function getRangeIndexes(rangeA1Notation, rowCount, columnCount) {
  const [rangeFrom, rangeTo] = (rangeA1Notation.includes(':'))
    ? rangeA1Notation.split(':') : `${rangeA1Notation}:${rangeA1Notation}`.split(':');
  const {
    parthSymbol: columnFrom = 'a', parthDigit: rowFromIndex = 1,
  } = getParseAtSymbolDigit(rangeFrom);
  const {
    parthSymbol: columnTo = getColumnNameForNumber(columnCount),
    parthDigit: rowToIndex = rowCount,
  } = getParseAtSymbolDigit(rangeTo);
  const columnFromIndex = getColumnNumberForName(columnFrom);
  const columnToIndex = getColumnNumberForName(columnTo);
  return {
    indexesRow: [rowFromIndex - 1, rowToIndex - 1],
    indexesColumn: [columnFromIndex - 1, columnToIndex - 1],
  };
}
