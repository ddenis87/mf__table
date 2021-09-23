import {
  getColumnNameForNumber,
  getColumnNumberForName,
} from '../../helpers/spreadSheet';

import TCell from './TCell';

import {
  getParseAtSymbolDigit,
  isInRange,
} from './TDocumentHelpers';

class TSheet {
  constructor(options = { cells: {} }) {
    Object.entries(options).forEach((property) => {
      const [propertyName, propertyValue] = property;
      this[propertyName] = propertyValue;
    });

    if (Array.isArray(this.cells)) return;
    const dataCells = options.cells;
    this.cells = [this.rowCount];
    for (let i = 0; i < this.rowCount; i += 1) {
      this.cells[i] = [this.columnCount];
      for (let j = 0; j < this.columnCount; j += 1) {
        this.cells[i][j] = new TCell();
      }
    }
    Object.entries(dataCells).forEach((cell) => {
      const [cellName, cellValue] = cell;
      const rangeIndexes = this.getRangeIndexes(cellName);
      this.cells[rangeIndexes.indexesRow[0]][rangeIndexes.indexesColumn[0]] = new TCell(cellValue);
    });
  }

  /**
   * Возвращает двухмерный массив объектов TCell
   * @param {String} range 'b2:d3'
   * @return {Array}
   */
  getRange(rangeA1Notation) {
    const rangeIndexes = this.getRangeIndexes(rangeA1Notation);
    return this.cells
      .filter((item, indexRow) => isInRange(indexRow, rangeIndexes.indexesRow))
      .map((cell) => cell
        .filter((item, indexColumn) => isInRange(indexColumn, rangeIndexes.indexesColumn)));
  }

  getRangeIndexes(rangeA1Notation) {
    const [rangeFrom, rangeTo] = (rangeA1Notation.includes(':'))
      ? rangeA1Notation.split(':') : `${rangeA1Notation}:${rangeA1Notation}`.split(':');
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
