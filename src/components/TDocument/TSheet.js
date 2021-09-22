import TCell from './TCell';

import {
  getColumnNumberForName,
  getParseAtSymbolDigit,
} from '../../helpers/spreadSheet';

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
    // console.log(dataCells);
    Object.entries(dataCells).forEach((cell) => {
      const [cellName, cellValue] = cell;
      const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
      this.cells[cellRow - 1][getColumnNumberForName(cellColumn) - 1] = new TCell(cellValue);
    });
  }

  /**
   *
   * @param {*} range 'b2:d3'
   */
  getRange(range) {
    const [rangeFrom, rangeTo] = (range.includes(':'))
      ? range.split(':') : `${range}:${range}`.split(':');
    const { parthSymbol: columnFrom, parthDigit: rowFrom = 1 } = getParseAtSymbolDigit(rangeFrom);
    const {
      parthSymbol: columnTo, parthDigit: rowTo = this.rowCount,
    } = getParseAtSymbolDigit(rangeTo);
    const columnFromIndex = (columnFrom.length) ? getColumnNumberForName(columnFrom) : 1;
    const columnToIndex = (columnTo.length) ? getColumnNumberForName(columnTo) : this.columnCount;
    const rowFromIndex = (rowFrom === 0) ? 1 : rowFrom;
    const rowToIndex = (rowTo === 0) ? this.rowCount : rowTo;
    // console.log(columnFrom, columnTo);
    // console.log(rowFrom, rowTo);
    let cells = this.cells.filter((cell, indexRow) => (indexRow >= rowFromIndex - 1
      && indexRow <= rowToIndex - 1));
    cells = cells.map((cell) => cell.filter((item, index) => (index >= columnFromIndex - 1
      && index <= columnToIndex - 1)));
    return cells;
  }
}

export default TSheet;
