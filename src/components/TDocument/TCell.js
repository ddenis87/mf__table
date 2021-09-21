import {
  DEFAULT_CELL_TYPE,
} from './TDocumentConst';

/**
 * Класс реализующий методы ячейки
 * @module TCell
 */
class TCell {
  constructor(cell = {}) {
    this.BaseClass = this.constructor;
    this.createCell(cell);
  }

  createCell(cell) {
    Object.entries(cell).forEach((property) => {
      const [propertyName, propertyValue] = property;
      this[propertyName] = propertyValue;
    });
  }

  /**
   * Возвращает имя действия или null если отсутствует или не определено
   * @returns {String|null}
   */
  getActionName() {
    return this.action || null;
  }

  /**
   * Возвращает формулу или null если отсутствует или не определена
   * @returns {String|null}
   */
  getFormula() {
    return this.formula || null;
  }

  /**
   * Возвращает параметр или null если отсутствует или не определен
   * @returns {String|null}
   */
  getParameter() {
    return this.parameter || null;
  }

  /**
   * Возвращает имя стиля или null если отсутствует или не определен
   * @returns {String|null}
   */
  getStyleName() {
    return this.style || null;
  }

  /**
   * Возвращает тип если отсутствует или не определен 'string'
   * @returns {String} - 'string'
   */
  getType() {
    return this.type || DEFAULT_CELL_TYPE;
  }
  /**
   * Возвращает скрипт валидации или null если отсутствует или не определен
   * @returns {String|null}
   */
  getValidators() {
    return this.validators || null;
  }

  /**
   * Возвращает значение или null если отсутствует или не определено
   * @returns {String|Number|Date|null}
   */
  getValue() {
    return this.value || null;
  }
}

export default TCell;
