/* eslint-disable import/prefer-default-export */

/**
 * Возвращает объект полученный из JSON строки
 * @param {String} JSONString
 * @return {Object}
 */
export function getJSONParse(JSONString) {
  return JSON.parse(JSONString);
}
