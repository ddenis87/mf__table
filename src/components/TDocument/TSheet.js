import {
  getColumnNameForNumber,
  getColumnNumberForName,
} from '../../helpers/spreadSheet';

import {
  getParseAtSymbolDigit,
  isInRange,
} from './TDocumentHelpers';

class TSheet {
  constructor(options = {}) {
    this.BaseClass = this.constructor;
    Object.entries(options).forEach((property) => {
      const [propertyName, propertyValue] = property;
      this[propertyName] = propertyValue;
    });
  }

  /**
   * Возвращает двумерный массив объектов TCell
   * @param {String|undefined} range 'b2:d3'
   * @return {Array}
   */
  getRange(rangeA1Notation) {
    const rangeIndexes = this.getRangeIndexes(rangeA1Notation);
    const cells = this.cells
      .filter((item, indexRow) => isInRange(indexRow, rangeIndexes.indexesRow))
      .map((cell) => cell
        .filter((item, indexColumn) => isInRange(indexColumn, rangeIndexes.indexesColumn)));
    return new this.BaseClass({
      cells,
    });
  }

  /**
   * Возвращает индексы диапазона начиная с 0
   * @param {String|undefined} rangeA1Notation 'b2:c4'
   * @returns {Object} '{ [1, 3], [1, 2] }'
   */
  getRangeIndexes(rangeA1Notation) {
    const range = rangeA1Notation || '';
    const [rangeFrom, rangeTo] = (range.includes(':'))
      ? range.split(':') : `${range}:${range}`.split(':');
    const {
      parthSymbol: columnFrom = 'a', parthDigit: rowFromIndex = 1,
    } = getParseAtSymbolDigit(rangeFrom);
    const {
      parthSymbol: columnTo = getColumnNameForNumber(this.columnCount),
      parthDigit: rowToIndex = this.rowCount,
    } = getParseAtSymbolDigit(rangeTo);
    const columnFromIndex = getColumnNumberForName(columnFrom);
    const columnToIndex = getColumnNumberForName(columnTo);
    return {
      indexesRow: [rowFromIndex - 1, rowToIndex - 1],
      indexesColumn: [columnFromIndex - 1, columnToIndex - 1],
    };
  }
}

export default TSheet;
