import TCell from './TCell';

import {
  isInRange,
  getRangeIndexes,
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
      const rangeIndexes = getRangeIndexes(cellName, this.rowCount, this.columnCount);
      this.cells[rangeIndexes.indexesRow[0]][rangeIndexes.indexesColumn[0]] = new TCell(cellValue);
    });
  }

  /**
   * Возвращает двухмерный массив объектов TCell
   * @param {String} range 'b2:d3'
   * @return {Array}
   */
  getRange(rangeA1Notation) {
    const rangeIndexes = getRangeIndexes(rangeA1Notation, this.rowCount, this.columnCount);
    return this.cells
      .filter((item, indexRow) => isInRange(indexRow, rangeIndexes.indexesRow))
      .map((cell) => cell
        .filter((item, indexColumn) => isInRange(indexColumn, rangeIndexes.indexesColumn)));
  }
}

export default TSheet;
