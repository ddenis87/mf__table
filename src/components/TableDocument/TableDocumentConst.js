/* eslint-disable import/prefer-default-export */

/**
 * @module TableDocumentConst
 */

/**
 * Количество столбцов по умолчанию
 */
export const DEFAULT_COLUMN_COUNT = 26;

/**
 * Количество строк по умолчанию
 */
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
  CLOSED: 'closed',
  CLOSED_EXCEPT_OPEN: 'closedExceptOpen',
  OPEN: 'open',
};

/**
 * Тип диапазона
 * @readonly
 * @enum {String}
 * @property {String} CELL 'cell' - ячейка
 * @property {String} RANGE 'range' - диапазон
 * @property {String} COLUMN 'column' - колонка(и)
 * @property {String} ROW 'row' - строка(и)
 */
export const RANGE_TYPE = {
  CELL: 'cell',
  RANGE: 'range',
  COLUMN: 'column',
  ROW: 'row',
};

export const REG_DIGITS = /[0-9]/g;

export const REG_OPERATORS = /[+-/*)(%: ]/g;

export const REG_SYMBOLS = /[A-Z]/gi;

export const RETURN_FORMAT = {
  OBJECT: 'object',
  ENTRIES: 'entries',
  KEYS: 'keys',
};

/**
 * Тип сдвига
 * @readonly
 * @enum {String}
 * @property {String} VERTICAL 'vertical' - вертикальный
 * @property {String} HORIZONTAL 'horizontal' - горизонтальный
 */
export const SHIFT_TYPE = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

/**
 * Поля ячейки
 */
export const CELL_ATTRIBUTES = {
  VALUE: 'value',
  FORMULA: 'formula',
  SCRIPTS: 'scripts',
  PARAMETER: 'parameter',
  ACTION: 'action',
  VALIDATE: 'validate',
};

/**
 * Высота ячейки
 * @constant {Number}
 * @property {Number} CELL_HEIGHT 22
 */
export const CELL_HEIGHT = 22;

/**
 * Ширина ячейки
 * @constant {Number}
 * @property {Number} CELL_WIDTH 94
 */
export const CELL_WIDTH = 94;

/**
 * Режим удаления
 * @readonly
 * @enum {String}
 * @property {String} DATA 'data' - данные
 * @property {String} COLUMN 'column' - колонки
 * @property {String} ROW 'row' - строки
 */
export const DELETE_MODE = {
  DATA: 'data',
  COLUMN: 'column',
  ROW: 'row',
};

// export default {
//   /**
//    * Тип редактирования листа
//    * @readonly
//    * @enum {String}
//    * @property {String} CLOSED 'closed' - лист недоступен для редактирования
//    * @property {String} CLOSED_EXCEPT_OPEN 'closedExceptOpen' - лист недоступен для
//    * редактирования кроме ячеек у которых явно указано разрешение
//    * @property {String} OPEN 'open' - лист доступен для редактирования
//    */
//   EDIT_ACCESS,
//   /**
//    * Тип диапазона
//    * @readonly
//    * @enum {String}
//    * @property {String} CELL 'cell' - ячейка
//    * @property {String} RANGE 'range' - диапазон
//    * @property {String} COLUMN 'column' - колонка(и)
//    * @property {String} ROW 'row' - строка(и)
//    */
//   RANGE_TYPE,

//   // /** @constant {Regular} */
//   REG_DIGITS,
//   // /** @constant {Regular} */
//   REG_OPERATORS,
//   // /** @constant {Regular} */
//   REG_SYMBOLS,
//   // /** @constant {String} */
//   RETURN_FORMAT,

//   /**
//    * Тип сдвига
//    * @readonly
//    * @enum {String}
//    * @property {String} VERTICAL 'vertical' - вертикальный
//    * @property {String} HORIZONTAL 'horizontal' - горизонтальный
//    */
//   SHIFT_TYPE,
//   // /** @constant {String} */
//   CELL_ATTRIBUTES,
//   /**
//    * Высота ячейки
//    * @constant {Number}
//    * @property {Number} CELL_HEIGHT 22
//    */
//   CELL_HEIGHT,
//   /**
//    * Ширина ячейки
//    * @constant {Number}
//    * @property {Number} CELL_WIDTH 94
//    */
//   CELL_WIDTH,
//   /**
//    * Режим удаления
//    * @readonly
//    * @enum {String}
//    * @property {String} DATA 'data' - данные
//    * @property {String} COLUMN 'column' - колонки
//    * @property {String} ROW 'row' - строки
//    */
//   DELETE_MODE,
// };
