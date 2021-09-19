/* eslint-disable import/prefer-default-export */

export const DEFAULT_COLUMN_COUNT = 26;

export const DEFAULT_ROW_COUNT = 1000;

/**
 * Тип редактирования листа
 * @readonly
 * @enum {String}
 * @property {String} OPEN 0 - лист доступен для редактирования
 * @property {String} CLOSED 1 - лист недоступен для редактирования
 * @property {String} CLOSED_EXCEPT_OPEN 2 - лист недоступен для
 * редактирования кроме ячеек у которых явно указано разрешение
 */
export const EDIT_ACCESS = {
  OPEN: 0,
  CLOSED: 1,
  CLOSED_EXCEPT_OPEN: 2,
};
