/* eslint-disable import/prefer-default-export */

import {
  REG_DIGITS,
  REG_SYMBOLS,
} from './TDocumentConst';

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
