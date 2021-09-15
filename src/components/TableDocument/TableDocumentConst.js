/**
 * @module TableDocumentConst
 */

const EDIT_ACCESS = {
  CLOSED: 'closed',
  CLOSED_EXCEPT_OPEN: 'closedExceptOpen',
  OPEN: 'open',
};

const RANGE_TYPE = {
  CELL: 'cell',
  RANGE: 'range',
  COLUMN: 'column',
  ROW: 'row',
};

const REG_DIGITS = /[0-9]/g;

const REG_OPERATORS = /[+-/*)(%: ]/g;

const REG_SYMBOLS = /[A-Z]/gi;

const RETURN_FORMAT = {
  OBJECT: 'object',
  ENTRIES: 'entries',
  KEYS: 'keys',
};

const SHIFT_TYPE = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const CELL_ATTRIBUTES = {
  VALUE: 'value',
  FORMULA: 'formula',
  SCRIPTS: 'scripts',
  PARAMETER: 'parameter',
  ACTION: 'action',
  VALIDATE: 'validate',
};

const CELL_HEIGHT = 22;

const CELL_WIDTH = 94;

const DELETE_MODE = {
  DATA: 'data',
  COLUMN: 'column',
  ROW: 'row',
};

export default {
  /**
   * Тип редактирования листа
   * @readonly
   * @enum {String}
   * @property {String} CLOSED 'closed' - лист недоступен для редактирования
   * @property {String} CLOSED_EXCEPT_OPEN 'closedExceptOpen' - лист недоступен для
   * редактирования кроме ячеек у которых явно указано разрешение
   * @property {String} OPEN 'open' - лист доступен для редактирования
   */
  EDIT_ACCESS,
  /**
   * Тип диапазона
   * @readonly
   * @enum {String}
   * @property {String} CELL 'cell' - ячейка
   * @property {String} RANGE 'range' - диапазон
   * @property {String} COLUMN 'column' - колонка(и)
   * @property {String} ROW 'row' - строка(и)
   */
  RANGE_TYPE,

  // /** @constant {Regular} */
  REG_DIGITS,
  // /** @constant {Regular} */
  REG_OPERATORS,
  // /** @constant {Regular} */
  REG_SYMBOLS,
  // /** @constant {String} */
  RETURN_FORMAT,

  /**
   * Тип сдвига
   * @readonly
   * @enum {String}
   * @property {String} VERTICAL 'vertical' - вертикальный
   * @property {String} HORIZONTAL 'horizontal' - горизонтальный
   */
  SHIFT_TYPE,
  // /** @constant {String} */
  CELL_ATTRIBUTES,
  /**
   * Высота ячейки
   * @constant {Number}
   * @property {Number} CELL_HEIGHT 22
   */
  CELL_HEIGHT,
  /**
   * Ширина ячейки
   * @constant {Number}
   * @property {Number} CELL_WIDTH 94
   */
  CELL_WIDTH,
  /**
   * Режим удаления
   * @readonly
   * @enum {String}
   * @property {String} DATA 'data' - данные
   * @property {String} COLUMN 'column' - колонки
   * @property {String} ROW 'row' - строки
   */
  DELETE_MODE,
};
