const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;

class TABLE_DOCUMENT {
  constructor({
    rows = {},
    rowCount = ROW_COUNT,
    columns = {},
    columnCount = COLUMNS_COUNT,
    cells = {},
    styles = [],
    namedAreas = [],
    cellWidth = CELL_WIDTH,
    cellHeight = CELL_HEIGHT,
  }) {
    this.rows = rows;
    this.rowCount = rowCount;
    this.columns = columns;
    this.columnCount = columnCount;
    this.cells = cells;
    this.styles = styles;
    this.namedAreas = namedAreas;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  rows = {};

  rowCount = null;

  columns = {};

  columnCount = null;

  cells = {};

  styles = [];

  namedAreas = [];

  cellWidth = null;

  cellHeight = null;

  getAreaByName(areaName) {
    if (!areaName) return null;
    const namedArea = this.namedAreas.find((item) => item.name === areaName);
    if (!namedArea) return null;
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [];
    const [rangeFrom, rangeTo] = namedArea.range.split(':');
    let rowNumber = 1;
    for (let i = rangeFrom; i <= rangeTo; i += 1) {
      rows[rowNumber] = this.rows[i];
      Object.keys(this.cells).filter((cellName) => cellName.replace(/[A-z]/g, '') === i).forEach((cellName) => {
        cells[`${cellName.replace(/[0-9]/g, rowNumber)}`] = this.cells[cellName];

        const columnName = cellName.replace(/[0-9]/g, '');
        if (!Object.keys(columns).includes(columnName)) columns[columnName] = this.columns[columnName];

        if (this.styles.findIndex((item) => item.name === cellName) > -1) {
          styles.push(this.styles.find((item) => item.name === cellName));
        }
        
        if (this.namedAreas.findIndex((item) => item.range.split(':')[0].includes(cellName.toUpperCase())) > -1) {
          const namedAreaShift = this.namedAreas.find((item) => item.range.split(':')[0].includes(cellName.toUpperCase()));
          const [rangeShiftFrom, rangeShiftTo] = namedAreaShift.range.split(':');
          let range = rangeShiftFrom.replace(/[0-9]/g, rowNumber);
          if (rangeShiftTo) {
            range += `:${rangeShiftTo.replace(/[0-9]/g, (this.cells[cellName].rowspan)
              ? rowNumber + (this.cells[cellName].rowspan - 1) : rowNumber)}`;
          }
          namedAreaShift.range = range.toLowerCase();
          namedAreas.push(namedAreaShift);
        }
      });
      rowNumber += 1;
    }
    return new TABLE_DOCUMENT({
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      columnCount: Object.keys(columns).length,
      cells,
      styles,
      namedAreas,
      cellWidth: this.cellWidth,
      cellHeight: this.cellHeight,
    });
  }

  insertNamedArea(area, value) {
    const currentRow = Object.keys(this.rows).length + 1;
    Object.keys(area.cells).forEach((cellName) => {
      this.cells[cellName.replace(/[0-9]/g, currentRow)] = { ...area.cells[cellName], value: value[area.namedAreas.find((item) => item.range.slice(':')[0] === cellName).name] };
    });
    console.log(area);
    console.log(value);
    return currentRow;
  }

  setValueNamedArea(areaData) {
    if (!areaData.length) return null;

    const [v1, v2] = this.namedAreas[0].range.split(':');
    const namedAreaRange = (+v2) - (+v1) + 1;
    // const cellsTemp = this.cells;
    this.cells = {};
    for (let i = 0; i < areaData.length - 1; i += 1) {
      if (i > 0) { // копируем строки области
        for (let j = 0; j < namedAreaRange; j += 1) {
          this.rows[(i + namedAreaRange) + j] = { ...this.rows[(i - namedAreaRange) + j] };
        }
      }

      // for (let [areaName, areaValue] of Object.entries(areaData[i])) {
      //   const namedArea = this.namedAreas.find((item) => item.name === areaName);
      //   const [nameCellTemp] = namedArea.range.split(':');
      //   this.cells[`${nameCellTemp.replace(/[0-9]/g, '')}${i}`] = cellsTemp[nameCellTemp];

      // }
    }

    return this.rows;
  }
}

export default TABLE_DOCUMENT;
