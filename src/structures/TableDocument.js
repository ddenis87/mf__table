const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
// const CELL_TYPE_DEFAULT = 'string';
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;
const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function getColumnNameForNumber(columnNumber) {
  if (columnNumber > 702) return 'Infinity';
  if (columnNumber <= SET_COLUMN_NAME.length) {
    const columnName = SET_COLUMN_NAME[columnNumber - 1];
    return columnName;
  }
  if ((columnNumber % SET_COLUMN_NAME.length) === 0) {
    const columnName = `${SET_COLUMN_NAME[
      ((columnNumber - SET_COLUMN_NAME.length) / SET_COLUMN_NAME.length) - 1
    ]}${SET_COLUMN_NAME[SET_COLUMN_NAME.length - 1]}`;
    return columnName;
  }
  const columnName = `${SET_COLUMN_NAME[
    (Math.floor(columnNumber / SET_COLUMN_NAME.length)) - 1
  ]}${SET_COLUMN_NAME[(columnNumber % SET_COLUMN_NAME.length) - 1]}`;
  return columnName;
}

function getNamedAreaType(rangeFrom, rangeTo) {
  if (rangeFrom && !rangeTo) return 'cell';
  if (+rangeFrom && +rangeTo) return 'row|column';
  return 'cell|range';
  // console.log(rangeFrom, rangeTo);
}

function getColumnNumberForName(columnName) {
  console.log(columnName);
  if (columnName.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === columnName) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === columnName[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === columnName[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
}

function getRangeNamedArea(namedArea, direction = 'row') {
  const [rangeFrom, rangeTo] = namedArea.range.toLowerCase().split(':');
  const range = {
    row: () => [rangeFrom, rangeTo],
    column: () => [
      getColumnNumberForName(rangeFrom),
      getColumnNumberForName(rangeTo),
    ],
    join: () => [rangeFrom, rangeTo],
  };
  // let [rangeFrom, rangeTo] = namedArea.range.toLowerCase().split(':');
  // console.log(rangeFrom, rangeTo);
  // if (direction === 'column') {
  //   rangeFrom = getColumnNumberForName(rangeFrom);
  //   rangeTo = getColumnNumberForName(rangeTo);
  // }
  // return [rangeFrom, rangeTo];
  return range[direction]();
}

function parseCellName(cellName) {
  return {
    cellColumn: cellName.replace(/[0-9]/g, ''),
    cellRow: +cellName.replace(/[A-z]/g, ''),
  };
}

function replaceCellName(cellName, position, direction = 'row') {
  const { cellColumn, cellRow } = parseCellName(cellName);
  const replaceFunctions = {
    row: () => `${cellColumn}${position}`,
    column: () => `${getColumnNameForNumber(position)}${cellRow}`,
  };
  return replaceFunctions[direction]();
}
// function getShiftCells(cells = [], shiftRow) {
//   const shiftCells = {};
//   cells.forEach((cell) => {
//     const [cellName, cellValue] = cell;
//     shiftCells[replaceCellRow(cellName, shiftRow)] = cellValue;
//   });
//   return shiftCells;
// }
function getRangeShift(area = {}, fromPosition = 1, direction) {
  const {
    rows, columns, cells, namedAreas,
  } = area;
  let shiftRows = {};
  let shiftColumns = [];
  const shiftCells = {};
  const shiftNamedAreas = [];
  // if (direction) console.log('column shift');
  // console.log(namedAreas[0]);
  const namedArea = namedAreas.find((item) => {
    const [v1, v2] = item.range.split(':');
    return (v1 === v2);
  });
  if (namedArea) {
    shiftNamedAreas.push({
      name: namedArea.name,
      range: `${fromPosition}:${fromPosition + Object.keys(rows).length - 1}`,
    });
  }
  const rangeArea = (direction === 'row') ? Object.keys(rows).length : Object.keys(columns).length;
  for (let i = 0; i < rangeArea; i += 1) {
    const position = fromPosition + i;
    if (direction === 'row') shiftRows[position] = { ...rows[i + 1] };
    if (direction === 'column') shiftColumns[getColumnNameForNumber(position)] = { ...columns[getColumnNameForNumber(i + 1)] };

    const cellsRange = Object.entries(cells).filter((cell) => {
      const { cellColumn, cellRow } = parseCellName(cell[0]);
      const rez = (direction === 'row') ? (cellRow === i + 1)
        : (getColumnNumberForName(cellColumn) === i + 1);
      return rez;
    });
    cellsRange.forEach((cell) => { // вынести в фун-цию getNamedAreasCells
      const [cellName, cellValue] = cell;
      shiftCells[replaceCellName(cellName, position, direction)] = { ...cellValue };

      const cellNamedArea = namedAreas.find((item) => item.range.split(':')[0].toLowerCase().includes(cellName));
      if (!cellNamedArea) return;
      const [rangeFrom] = cellNamedArea.range.split(':');
      const shiftRange = replaceCellName(rangeFrom, position, direction);
      shiftNamedAreas.push({
        name: cellNamedArea.name,
        range: shiftRange.toLowerCase(),
      });
    });
  }
  if (direction === 'row') shiftColumns = { ...columns };
  if (direction === 'column') shiftRows = { ...rows };
  console.log({ shiftRows, shiftCells, shiftNamedAreas });
  return {
    shiftRows, shiftColumns, shiftCells, shiftNamedAreas,
  };
}

class TableDocument {
  constructor({
    template = false,
    templateType = 'row',
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
        templateType: this.templateType = 'row',
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
    this.templateType = templateType;
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
    console.log(data);
    const { templateType } = documentTemplate;
    
    const areaHeader = documentTemplate.getNamedAreaByName('header', templateType);
    if (areaHeader) this.insertNamedArea(areaHeader, []);
    if (templateType === 'join') {
      this.buildDocumentJoin(documentTemplate, data);
      return;
    }
    data.forEach((element) => {
      const [areaName, areaValue] = Object.entries(element)[0];
      const namedArea = documentTemplate.getNamedAreaByName(areaName, templateType);
      areaValue.forEach((value) => {
        this.insertNamedArea(namedArea, value, templateType);
      });
    });
    const areaFooter = documentTemplate.getNamedAreaByName('footer', templateType);
    if (areaFooter) this.insertNamedArea(areaFooter, []);
  }

  buildDocumentJoin(documentTemplate, data) {
    // const { templateType } = documentTemplate;

    // const areaHeader = documentTemplate.getNamedAreaByName('header', templateType);
    // if (areaHeader) this.insertNamedArea(areaHeader, []);
    data.forEach((element) => {
      const [areaName, areaValue] = Object.entries(element)[0];
      const namedArea = documentTemplate.getNamedAreaByName(areaName, 'row');
      areaValue.forEach((value) => {
        this.insertNamedArea(namedArea, value, 'row');
      });
    });

    data.forEach((element) => {
      const [areaName, areaValue] = Object.entries(element)[0];
      const namedArea = documentTemplate.getNamedAreaByName(areaName, 'column');
      areaValue.forEach((value) => {
        this.insertNamedArea(namedArea, value, 'column');
      });
    });

    // проверить кто является хедером, строка или столбец вызвать в соответствии
    // вызвать для строк / столбцов
    // вызвать для ячейки для построения матрицы в нутри строк/столбцов
  }

  getCellByName(cellName) {
    let cell = {};
    if (Object.keys(this.cells).includes(cellName)) {
      cell = this.cells[cellName];
    }
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

  getDocumentData(JSONFormat = false, direction = 'row') {
    console.log(this.namedAreas);
    const documentData = [];
    this.namedAreas.forEach((namedArea) => {
      if (documentData.length === 0 || !Object.keys(documentData[documentData.length - 1]).includes(namedArea.name)) {
        documentData.push({ [namedArea.name]: [] });
      }
      const [rangeFrom, rangeTo] = namedArea.range.split(':');
      const valueArea = {};
      for (let range = +rangeFrom; range <= +rangeTo; range += 1) {
        this.getCellsInRange(range, direction).forEach((cell) => {
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

  getCellsInRange(rangeNumber, direction = 'row') {
    console.log(this.namedAreas);
    const range = (direction === 'column') ? getColumnNameForNumber(rangeNumber) : rangeNumber;
    const cellsInRange = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      const { cellColumn, cellRow } = parseCellName(cellName);
      const namedAreaRow = this.namedAreas.find((item) => +item.range.split(':')[0] === +cellRow);
      const namedAreaColumn = this.namedAreas.find((item) => item.range.toLowerCase().split(':')[0] === cellColumn);
      console.log(cellName);
      console.log(namedAreaRow);
      console.log(namedAreaColumn);
      return ((direction === 'column') ? (cellColumn === range) : (+cellRow === +range))
        && ((direction === 'column') ? !namedAreaRow : !namedAreaColumn);
    });
    return cellsInRange;
  }

  getCellStyles(cellName) {
    const cellStyle = this.styles.find((item) => item.name === cellName);
    if (!cellStyle) return null;
    return cellStyle;
  }

  getCellNamedArea(cellName, position, direction) {
    const cellNamedArea = this.namedAreas.find((item) => item.range.split(':')[0].toLowerCase().includes(cellName));
    if (!cellNamedArea) return null;
    const [rangeFrom] = cellNamedArea.range.split(':');
    const shiftRange = replaceCellName(rangeFrom, position, direction);
    return {
      name: cellNamedArea.name,
      range: shiftRange.toLowerCase(),
    };
  }

  getNamedAreaByName(areaName, direction = 'row') {
    if (!areaName) return null;
    const namedArea = this.namedAreas.find((item) => item.name === areaName);
    if (!namedArea) return null;
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [namedArea];
    const [rangeFrom, rangeTo] = getRangeNamedArea(namedArea, direction);
    let startPosition = 1;
    // проверить чем является шапка, строками, столбцами, ячейкой или диапазоном
    // if (areaName === 'header')
    const namedAreaType = getNamedAreaType(rangeFrom, rangeTo);
    console.log(namedAreaType);
    if (areaName === 'header' && namedAreaType === 'cell') {
      rows[replaceCellName(rangeFrom, '', 'column')] = this.rows[replaceCellName(rangeFrom, '', 'column')];
      columns[replaceCellName(rangeFrom, '', 'row')] = this.columns[replaceCellName(rangeFrom, '', 'row')];
      cells[rangeFrom] = this.cells[rangeFrom];
      styles.push(this.styles.find((item) => item.name === rangeFrom));
      namedAreas.push(this.namedAreas.find((item) => item.range.toLowerCase() === rangeFrom));
    }
    if (namedAreaType === 'row|column') {
      for (let i = +rangeFrom; i <= +rangeTo; i += 1) {
        if (direction === 'row') {
          rows[startPosition] = this.rows[i]; // ???
        }
        if (direction === 'column') {
          columns[getColumnNameForNumber(startPosition)] = this.columns[getColumnNameForNumber(i)];
        }

        this.getCellsInRange(i, direction).forEach((cell) => {
          const [cellName] = cell;
          cells[replaceCellName(cellName, startPosition, direction)] = this.cells[cellName];

          if (direction === 'row') {
            const columnName = replaceCellName(cellName, '', direction);
            if (!Object.keys(columns).includes(columnName)) columns[columnName] = this.columns[columnName];
          }
          if (direction === 'column') {
            const rowName = replaceCellName(cellName, '', direction);
            if (!Object.keys(rows).includes(rowName)) rows[rowName] = this.rows[rowName];
          }

          const cellStyles = this.getCellStyles(cellName);
          if (cellStyles) styles.push(cellStyles);

          const cellNamedArea = this.getCellNamedArea(cellName, startPosition, direction);
          if (cellNamedArea) namedAreas.push(cellNamedArea);
        });

        startPosition += 1;
      }

      // if (direction === 'row') {
      //   columns = this.columns;
      // }
      // if (direction === 'column') {
      //   rows = this.rows;
      // }
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

  insertNamedArea(area, value, direction = 'row') {
    const currentPosition = (direction === 'row') ? Object.keys(this.rows).length + 1 : Object.keys(this.columns).length + 1;
    const {
      shiftRows, shiftColumns, shiftCells, shiftNamedAreas,
    } = getRangeShift(area, currentPosition, direction);
    Object.entries(shiftCells).forEach((cell) => {
      const [cellName, cellValue] = cell;
      const namedAreaCell = shiftNamedAreas.find((item) => item.range.split(':')[0] === cellName);
      if (namedAreaCell) {
        if (value[namedAreaCell.name]) cellValue.value = value[namedAreaCell.name];
        // cellValue.value = value[namedAreaCell.name];
        cellValue.areaName = namedAreaCell.name;
      }
    });

    const namedAreaRow = area.namedAreas.find((item) => {
      const [v1, v2] = item.range.split(':');
      return (v1 === v2);
    });
    if (namedAreaRow && !['header', 'footer'].includes(namedAreaRow.name)) {
      this.namedAreas.push({
        name: namedAreaRow.name,
        range: `${currentPosition}:${currentPosition + (direction === 'row') ? Object.keys(area.rows).length - 1
          : Object.keys(area.columns).length - 1}`,
      });
    }

    this.rows = { ...this.rows, ...shiftRows };
    this.cells = { ...this.cells, ...shiftCells };
    this.columns = { ...this.columns, ...shiftColumns };

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
    return true;
  }

  editingCell(cellName, cellValue) { // проверять существует строка/столбец
    // получать максимальный из имеющихся, сравнивать
    // если пусстое значение и больше ничего нет, то удалять ячейку из набора
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
