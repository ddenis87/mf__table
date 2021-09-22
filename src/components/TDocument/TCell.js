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
   * Возвращает строку форматирования или null если отсутствует или не определено
   * @returns {String}
   */
  getFormatString() {
    return this.formatString || null;
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
   * Возвращает модель представления данных
   * @returns {String}
   */
  getRelatedModelView() {
    return this.relatedModelView || null;
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
   * @returns {String|Number|Boolean|null}
   */
  getValue() {
    return this.value || null;
  }

  /** Устанавливает имя действия */
  setActionName(value) {
    this.action = value;
  }

  /** Устанавливает строку форматирования */
  setFormatString(value) {
    this.formatString = value;
  }

  /** Устанавливает формулу */
  setFormula(value) {
    this.formula = value;
  }

  /** Устанавливает параметр */
  setParameter(value) {
    this.parameter = value;
  }

  /** Устанавливает модель представления данных */
  setRelatedModelView(value) {
    this.relatedModelView = value;
  }

  /** Устанавливает имя стиля */
  setStyleName(value) {
    this.style = value;
  }

  /** Устанавливает тип */
  setType(value) {
    this.type = value;
  }

  /** Устанавливает скрипт валидации */
  setValidator(value) {
    this.validators = value;
  }

  /** Устанавливает значение */
  setValue(value) {
    this.value = value;
  }
}

export default TCell;
