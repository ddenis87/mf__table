const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
const CELL_TYPE_DEFAULT = 'string';
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;

function parseCellName(cellName) {
  return {
    cellColumn: cellName.replace(/[0-9]/g, ''),
    cellRow: +cellName.replace(/[A-z]/g, ''),
  };
}

class TableDocument {
  constructor({
    template = false,
    rows = {},
    rowCount = ROW_COUNT,
    columns = {},
    columnCount = COLUMNS_COUNT,
    cells = {},
    styles = [],
    namedAreas = [],
    cellWidth = CELL_WIDTH,
    cellHeight = CELL_HEIGHT,
    JSONString = null,
  } = {}) {
    if (JSONString) {
      const JSONStringParse = JSON.parse(JSONString);
      ({
        template: this.template = false,
        rows: this.rows = {},
        rowCount: this.rowCount = ROW_COUNT,
        columns: this.columns = {},
        columnCount: this.columnCount = COLUMNS_COUNT,
        cells: this.cells = {},
        styles: this.styles = [],
        namedAreas: this.namedAreas = [],
        cellWidth: this.cellWidth = CELL_WIDTH,
        cellHeight: this.cellHeight = CELL_HEIGHT,
      } = JSONStringParse);
      return;
    }
    this.template = template;
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

  buildDocument(documentTemplate, documentData) {
    const data = (typeof documentData === 'string') ? JSON.parse(documentData) : documentData;
    const areaHeader = documentTemplate.getNamedAreaByName('header');
    this.insertNamedArea(areaHeader, []);
    data.forEach((element) => {
      const [areaName, areaValue] = Object.entries(element)[0];
      const namedArea = documentTemplate.getNamedAreaByName(areaName);
      // console.log(namedArea);
      areaValue.forEach((value) => {
        this.insertNamedArea(namedArea, value);
      });
    });
    const areaFooter = documentTemplate.getNamedAreaByName('footer');
    this.insertNamedArea(areaFooter, []);
  }

  getCellByName(cellName) {
    let cell = {};
    if (Object.keys(this.cells).includes(cellName)) {
      cell = this.cells[cellName];
    }
    if (!Object.keys(cell).includes('type')) {
      const { cellColumn, cellRow } = parseCellName(cellName);
      const cellType = this.rows[cellRow]?.type
        || this.columns[cellColumn]?.type
        || CELL_TYPE_DEFAULT;
      cell.type = cellType;
    }
    console.log(cell);
    return cell;
  }

  getDocument(JSONFormat = false) {
    const document = {
      rows: this.rows,
      rowCount: this.rowCount,
      columns: this.columns,
      columnCount: this.columnCount,
      cells: this.cells,
      styles: this.styles,
    };
    return (JSONFormat) ? JSON.stringify(document) : document;
  }

  // getDocumentData(JSONFormat = false) {
  //   console.log(this.namedAreas);
  //   const documentData = {};
  //   this.namedAreas.forEach((namedArea) => {
  //     if (!Object.keys(documentData).includes(namedArea.name)) documentData[namedArea.name] = [];
  //     const [rangeFrom, rangeTo] = namedArea.range.split(':');
  //     const valueArea = {};
  //     for (let row = +rangeFrom; row <= +rangeTo; row += 1) {
  //       Object.entries(this.getCellsInRow(row)).forEach((cell) => {
  //         const [, cellValue] = cell;
  //         valueArea[cellValue.areaName] = cellValue.value;
  //       });
  //     }
  //     documentData[namedArea.name].push(valueArea);
  //   });
  //   return (JSONFormat) ? JSON.stringify(documentData) : documentData;
  // }
  getDocumentData(JSONFormat = false) {
    console.log(this.namedAreas);
    const documentData = [];
    this.namedAreas.forEach((namedArea) => {
      if (documentData.length === 0 || !Object.keys(documentData[documentData.length - 1]).includes(namedArea.name)) {
        documentData.push({ [namedArea.name]: [] });
      }
      const [rangeFrom, rangeTo] = namedArea.range.split(':');
      const valueArea = {};
      for (let row = +rangeFrom; row <= +rangeTo; row += 1) {
        Object.entries(this.getCellsInRow(row)).forEach((cell) => {
          const [, cellValue] = cell;
          valueArea[cellValue.areaName] = cellValue.value;
        });
      }
      documentData[documentData.length - 1][namedArea.name].push({ ...valueArea });
    });
    return (JSONFormat) ? JSON.stringify(documentData) : documentData;
  }

  getCellsInRow(row) {
    const cellKeys = Object.entries(this.cells).filter((cell) => {
      const [cellName, cellValue] = cell;
      return (+cellName.replace(/[A-z]/g, '') === +row
        && Object.keys(cellValue).includes('areaName'));
    });
    return Object.fromEntries(cellKeys);
  }

  // getParentCellAreaName(cellName) {
  //   const { cellRow, cellColumn } = parseCellName(cellName);
  //   const areasNames = [];
  //   areasNames.push(this.rows[cellRow]?.areaName);
  //   areasNames.push(this.columns[cellColumn]?.areaName);
  //   return areasNames;
  // }

  getNamedAreaByName(areaName) {
    if (!areaName) return null;
    const namedArea = this.namedAreas.find((item) => item.name === areaName);
    if (!namedArea) return null;
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [namedArea];
    const [rangeFrom, rangeTo] = namedArea.range.split(':');
    let rowNumber = 1;

    for (let i = +rangeFrom; i <= +rangeTo; i += 1) {
      rows[rowNumber] = this.rows[i];
      const cellsKeys = Object.keys(this.cells).filter((cellName) => +cellName.replace(/[A-z]/g, '') === i);

      cellsKeys.forEach((cellName) => {
        cells[`${cellName.replace(/[0-9]/g, rowNumber)}`] = this.cells[cellName];

        const columnName = cellName.replace(/[0-9]/g, '');
        if (!Object.keys(columns).includes(columnName)) columns[columnName] = this.columns[columnName];

        if (this.styles.findIndex((item) => item.name === cellName) > -1) {
          styles.push(this.styles.find((item) => item.name === cellName));
        }

        if (this.namedAreas.findIndex((item) => item.range.split(':')[0].includes(cellName.toUpperCase())) === -1) return;

        const namedAreaShift = this.namedAreas.find((item) => item.range.split(':')[0].includes(cellName.toUpperCase()));
        const [rangeShiftFrom, rangeShiftTo] = namedAreaShift.range.split(':');
        let range = rangeShiftFrom.replace(/[0-9]/g, rowNumber);
        if (rangeShiftTo) {
          range += `:${rangeShiftTo.replace(/[0-9]/g, (this.cells[cellName].rowspan)
            ? rowNumber + (this.cells[cellName].rowspan - 1) : rowNumber)}`;
        }
        namedAreaShift.range = range.toLowerCase();
        namedAreas.push(namedAreaShift);
      });
      rowNumber += 1;
    }
    return new TableDocument({
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
    const rowsTemp = {};
    const cellsTemp = {};
    const namedAreaRow = area.namedAreas.find((item) => {
      const [v1, v2] = item.range.split(':');
      return (+v1 && +v2);
    });
    if (namedAreaRow && !['header', 'footer'].includes(namedAreaRow.name)) {
      this.namedAreas.push({
        name: namedAreaRow.name,
        range: `${currentRow}:${currentRow + Object.keys(area.rows).length - 1}`,
      });
    }

    Object.keys(area.rows).forEach((rowNumber, index) => {
      rowsTemp[currentRow + index] = { ...area.rows[rowNumber] };
      Object.keys(area.cells).forEach((cellName) => {
        const namedAreaCell = area.namedAreas.find((item) => item.range.split(':')[0] === cellName.replace(/[0-9]/g, index + 1));
        if (namedAreaCell) {
          cellsTemp[`${cellName.replace(/[0-9]/g, currentRow + index)}`] = {
            ...area.cells[cellName.replace(/[0-9]/g, index + 1)],
            value: value[namedAreaCell.name],
            areaName: namedAreaCell.name,
          };
        } else {
          cellsTemp[`${cellName.replace(/[0-9]/g, currentRow + index)}`] = {
            ...area.cells[cellName.replace(/[0-9]/g, index + 1)],
          };
        }
      });
    });
    this.rows = { ...this.rows, ...rowsTemp };
    this.cells = { ...this.cells, ...cellsTemp };
    const columnTemp = {};
    Object.keys(area.columns).forEach((columnName) => {
      columnTemp[columnName] = { ...area.columns[columnName] };
    });
    this.columns = { ...this.columns, ...columnTemp };

    area.styles.forEach((style) => {
      if (this.styles.findIndex((item) => item.name === style.name) > -1) return;
      this.styles.push(style);
    });

    this.rowCount = Object.keys(this.rows).length;
    this.columnCount = Object.keys(this.columns).length;
  }

  // addingRow(rowName = Math.max(...Object.keys(this.rows)) + 1, rowValue = { height: CELL_HEIGHT }) {
  //   const row = {}; // исправить на нормальный код
  //   row[rowName] = rowValue;
  //   this.rows = { ...this.rows, ...row };
  //   this.rowCount = +rowName;
  // }

  editingCell(cellName, cellValue) { // проверять существует строка/столбец
    // получать максимальный из имеющихся, сравнивать
    // если значение пустое и нет других данных в ячейке, удалять ???
    const cells = {}; // исправить на нормальный код
    cells[cellName] = {};
    if (Object.keys(this.cells).includes(cellName)) cells[cellName] = this.cells[cellName];
    cells[cellName].value = cellValue;
    this.cells = { ...this.cells, ...cells };
  }
}

export default TableDocument;
