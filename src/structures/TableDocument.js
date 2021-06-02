const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
// const CELL_TYPE_DEFAULT = 'string';
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;

function parseCellName(cellName) {
  return {
    cellColumn: cellName.replace(/[0-9]/g, ''),
    cellRow: +cellName.replace(/[A-z]/g, ''),
  };
}

function replaceCellRow(cellName, newRow) {
  const { cellColumn } = parseCellName(cellName);
  return `${cellColumn}${newRow}`;
}

// function getShiftCells(cells = [], shiftRow) {
//   const shiftCells = {};
//   cells.forEach((cell) => {
//     const [cellName, cellValue] = cell;
//     shiftCells[replaceCellRow(cellName, shiftRow)] = cellValue;
//   });
//   return shiftCells;
// }
function shiftRange(area = {}, fromPosition = 1, columnDirection = false) {
  const { rows, cells, namedAreas } = area;
  const shiftRows = {};
  const shiftCells = {};
  const shiftNamedAreas = [];
  if (columnDirection) console.log('column shift');
  if (namedAreas.find((item) => {
    const [v1, v2] = item.range.split(':');
    return (+v1 && +v2);
  })) {
    shiftNamedAreas.push({
      name: namedAreas[0].name,
      range: `${fromPosition}:${fromPosition + Object.keys(rows).length - 1}`,
    });
  }
  for (let i = 0; i < Object.keys(rows).length; i += 1) {
    const currentPosition = fromPosition + i;
    shiftRows[currentPosition] = rows[i + 1];

    const cellsRow = Object.entries(cells).filter((cell) => +cell[0].replace(/[A-z]/g, '') === i + 1);
    cellsRow.forEach((cell) => {
      const [cellName, cellValue] = cell;
      shiftCells[replaceCellRow(cellName, currentPosition)] = cellValue;

      if (namedAreas.findIndex((item) => item.range.split(':')[0].includes(cellName)) === -1) return;
      const namedArea = { ...namedAreas.find((item) => item.range.split(':')[0].includes(cellName)) };
      const [rangeShiftFrom, rangeShiftTo] = namedArea.range.split(':');
      let range = replaceCellRow(rangeShiftFrom, currentPosition);
      if (rangeShiftTo) {
        range += `:${replaceCellRow(rangeShiftTo, (cells[cellName].rowspan)
          ? currentPosition + (cells[cellName].rowspan - 1) : currentPosition)}`;
      }
      namedArea.range = range.toLowerCase();
      shiftNamedAreas.push(namedArea);
    });
  }
  // console.log({ shiftRows, shiftCells, shiftNamedAreas });
  return { shiftRows, shiftCells, shiftNamedAreas };
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
    // if (!Object.keys(cell).includes('type')) {
    //   const { cellColumn, cellRow } = parseCellName(cellName);
    //   const cellType = this.rows[cellRow]?.type
    //     || this.columns[cellColumn]?.type
    //     || CELL_TYPE_DEFAULT;
    //   cell.type = cellType;
    // }
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
        // Object.entries(this.getCellsInRow(row)).forEach((cell) => {
        this.getCellsInRow(row).forEach((cell) => {
          if (!Object.keys(cell).includes('areaName')) {
            const [, cellValue] = cell;
            valueArea[cellValue.areaName] = cellValue.value;
          }
        });
      }
      documentData[documentData.length - 1][namedArea.name].push({ ...valueArea });
    });
    return (JSONFormat) ? JSON.stringify(documentData) : documentData;
  }

  getCellsInRow(row) {
    const cellsInRow = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      return (+cellName.replace(/[A-z]/g, '') === +row);
    });
    // console.log(Object.fromEntries(cellsInRow));
    // return Object.fromEntries(cellsInRow);
    return cellsInRow;
  }

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
      // const cellsKeys = Object.keys(this.cells).filter((cellName) => +cellName.replace(/[A-z]/g, '') === i);

      this.getCellsInRow(i).forEach((cell) => {
        const [cellName] = cell;
        cells[replaceCellRow(cellName, rowNumber)] = this.cells[cellName];

        const columnName = replaceCellRow(cellName, '');
        if (!Object.keys(columns).includes(columnName)) columns[columnName] = this.columns[columnName];

        if (this.styles.findIndex((item) => item.name === cellName) > -1) {
          styles.push(this.styles.find((item) => item.name === cellName));
        }

        if (this.namedAreas.findIndex((item) => item.range.split(':')[0].includes(cellName.toUpperCase())) === -1) return;

        const namedAreaShift = this.namedAreas.find((item) => item.range.split(':')[0].includes(cellName.toUpperCase()));
        const [rangeShiftFrom, rangeShiftTo] = namedAreaShift.range.split(':');
        let range = replaceCellRow(rangeShiftFrom, rowNumber);
        if (rangeShiftTo) {
          range += `:${replaceCellRow(rangeShiftTo, (this.cells[cellName].rowspan)
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
    // shiftRange(area, Object.keys(this.rows).length + 1);
    const currentRow = Object.keys(this.rows).length + 1;
    const { shiftRows, shiftCells, shiftNamedAreas } = shiftRange(area, currentRow);
    Object.entries(shiftCells).forEach((cell) => {
      const [cellName, cellValue] = cell;
      const namedAreaCell = shiftNamedAreas.find((item) => item.range.split(':')[0] === cellName);
      if (namedAreaCell) {
        cellValue.value = value[namedAreaCell.name];
        cellValue.areaName = namedAreaCell.name;
      }
    });
    // const rows = {};
    // const cells = {};
    // const namedAreaRow = area.namedAreas.find((item) => {
    //   const [v1, v2] = item.range.split(':');
    //   return (+v1 && +v2);
    // });
    // if (namedAreaRow && !['header', 'footer'].includes(namedAreaRow.name)) {
    //   this.namedAreas.push({
    //     name: namedAreaRow.name,
    //     range: `${currentRow}:${currentRow + Object.keys(area.rows).length - 1}`,
    //   });
    // }

    // Object.keys(area.rows).forEach((rowNumber, index) => {
    //   rows[currentRow + index] = { ...area.rows[rowNumber] };
    //   Object.keys(area.cells).forEach((cellName) => {
    //     const namedAreaCell = area.namedAreas.find((item) => item.range.split(':')[0] === replaceCellRow(cellName, index + 1));
    //     if (namedAreaCell) {
    //       cells[replaceCellRow(cellName, currentRow + index)] = {
    //         ...area.cells[replaceCellRow(cellName, index + 1)],
    //         value: value[namedAreaCell.name],
    //         areaName: namedAreaCell.name,
    //       };
    //     } else {
    //       cells[replaceCellRow(cellName, currentRow + index)] = {
    //         ...area.cells[replaceCellRow(cellName, index + 1)],
    //       };
    //     }
    //   });
    // });
    this.rows = { ...this.rows, ...shiftRows };
    this.cells = { ...this.cells, ...shiftCells };
    
    const columns = {};
    Object.keys(area.columns).forEach((columnName) => {
      columns[columnName] = { ...area.columns[columnName] };
    });
    this.columns = { ...this.columns, ...columns };

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
  checkEditAccess(cellName) {
    if (!Object.keys(this.cells).includes(cellName)) return true;
    if (Object.keys(this.cells[cellName]).includes('areaName')) return true;
    return false;
  }

  editingCell(cellName, cellValue) { // проверять существует строка/столбец
    // получать максимальный из имеющихся, сравнивать
    const cellValues = (Object.keys(this.cells).includes(cellName)) ? this.cells[cellName] : {};
    cellValues.value = cellValue;
    if (!cellValue && !Object.keys(this.cells).includes(cellName)) return;
    this.cells = { ...this.cells, [cellName]: cellValues };
  }

  shiftRows({ shiftStart, shiftBefore = false, shiftStep = 1 }) {
    console.log(shiftBefore);
    const lastRow = Math.max(...Object.keys(this.rows));
    for (let i = 0; i < lastRow - shiftStart; i += 1) {
      console.log(lastRow - i, ' - ', this.rows[lastRow - i]);
      this.rows[lastRow - i + shiftStep] = this.rows[lastRow - i];
      delete this.rows[lastRow - i];

      Object.entries(this.getCellsInRow(lastRow - i)).forEach((cell) => {
        const [cellName, cellValue] = cell;
        this.cells[`${cellName.replace(/[0-9]/g, '')}${lastRow - i + shiftStep}`] = cellValue;
        delete this.cells[cellName];
      });
    }
    this.rows[shiftStart + 1] = this.rows[shiftStart];
    this.rowCount = Object.keys(this.rows).length;
  }
}

export default TableDocument;
