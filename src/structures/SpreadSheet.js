const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
const COUNT_ROWS = 1000;
const COUNT_COLUMNS = 26;

class TABLE_DOCUMENT {
  constructor({
    rows = {},
    countRows = COUNT_ROWS,
    columns = {},
    countColumns = COUNT_COLUMNS,
    cells = {},
    styles = [],
    namedAreas = [],
    cellWidth = CELL_WIDTH,
    cellHeight = CELL_HEIGHT,
  }) {
    this.rows = rows;
    this.countRows = countRows;
    this.columns = columns;
    this.countColumns = countColumns;
    this.cells = cells;
    this.styles = styles;
    this.namedAreas = namedAreas;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  };

  rows = {};
  countRows = null;
  columns = {};
  countColumns = null;
  cells = {};
  styles = [];
  namedAreas = [];
  cellWidth = null;
  cellHeight = null;

  getAreaByName(areaName) { // проверить toUpperCase toLowerCase на именах столбцов, ячеек, именованных диапазонах
    if (!areaName) return null;
    const namedArea = this.namedAreas.find((item) => item.name === areaName);
    if (!namedArea) return null;
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [];
    const [ rangeFrom, rangeTo ] = namedArea.range.split(':');
    let rowNumber = 1;
    for (let i = rangeFrom; i < rangeTo; i += 1) {
      rows[rowNumber] = this.rows[i];
      rowNumber += 1;
      Object.keys(this.cells).filter((cellName) => +cellName.replace(/[A-z]/g, '') === i).forEach((cellName) => {
        cells[cellName] = this.cells[cellName];
        
        const columnName = cellName.replace(/[0-9]/g, '');
        if (!Object.keys(columns).includes(columnName)) columns[columnName] = this.columns[columnName];

        if (Object.keys(this.cells[cellName]).includes('style')) {
          styles = this.styles.filter((item) => {
            return (item.name === this.cells[cellName].styles
              || item.name === `${this.cells[cellName].styles}::after`);
          })
        }
        namedAreas = this.namedAreas.filter((item) => item.range.includes(cellName));
      });
    }
    return new TABLE_DOCUMENT({
      rows,
      countRows: Object.keys(rows).length,
      columns,
      countColumns: Object.keys(columns).length,
      cells,
      styles,
      namedAreas,
      cellWidth: this.cellWidth,
      cellHeight: this.cellWidth,
    })
  };
  setValueNamedArea() {};
};