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
   * Заполняет параметры области значениями
   * @param {Object} parametersData
   * @param {Object} parametersList
   */
  fillInParameters(parametersData, parametersList) {
    if (!parametersList) return;
    this.cells.forEach((cell) => {
      const cellParameterName = cell.getParameter();
      if (!cellParameterName) return;
      if (!parametersList[cellParameterName]) return;
      cell.setValue(parametersData[parametersList[cellParameterName]]);
    });
  }

  /**
   * Возвращает двумерный массив объектов TCell
   * @param {String|undefined} range 'b2:d3'
   * @return {Array}
   */
  getRange(rangeA1Notation) {
    const rangeIndexes = this.getRangeIndexes(rangeA1Notation);
    const rangeIndexesRow = [rangeIndexes.from[0], rangeIndexes.to[0]];
    const rangeIndexesColumn = [rangeIndexes.from[1], rangeIndexes.to[1]];
    const cells = this.cells
      .filter((item, indexRow) => isInRange(
        indexRow, rangeIndexesRow,
      ))
      .map((cell) => cell
        .filter((item, indexColumn) => isInRange(
          indexColumn, rangeIndexesColumn,
        )));
    const rows = this.rows.filter((row, indexRow) => isInRange(indexRow, rangeIndexesRow));
    const columns = this.columns.filter((column, indexColumn) => isInRange(indexColumn, rangeIndexesColumn));
    return new this.BaseClass({
      cells,
      rows,
      columns,
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
      from: [rowFromIndex - 1, columnFromIndex - 1],
      to: [rowToIndex - 1, columnToIndex - 1],
    };
  }
}

export default TSheet;
