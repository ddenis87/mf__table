const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;
const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function getColumnNumberForName(columnName) {
  if (columnName.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === columnName) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === columnName[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === columnName[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
}

function getColumnNameForNumber(columnNumber) {
  if (columnNumber > 702) return 'Infinity';
  const settLength = SET_COLUMN_NAME.length;
  if (columnNumber <= settLength) {
    const columnName = SET_COLUMN_NAME[columnNumber - 1];
    return columnName;
  }
  if ((columnNumber % settLength) === 0) {
    const columnName = `${SET_COLUMN_NAME[
      ((columnNumber - settLength) / settLength) - 1
    ]}${SET_COLUMN_NAME[settLength - 1]}`;
    return columnName;
  }
  const columnName = `${SET_COLUMN_NAME[
    (Math.floor(columnNumber / settLength)) - 1
  ]}${SET_COLUMN_NAME[(columnNumber % settLength) - 1]}`;
  return columnName;
}

function parseCellName(cellName) {
  return {
    cellColumn: cellName.replace(/[0-9]/g, ''),
    cellRow: +cellName.replace(/[A-z]/g, ''),
  };
}

function getCellNameShift(cellName, rangeCells, shiftColumn = 1, shiftRow = 1) {
  const [rangeRow, rangeColumn] = rangeCells;
  const { cellColumn, cellRow } = parseCellName(cellName);
  const cellColumnShift = getColumnNameForNumber(+getColumnNumberForName(cellColumn) - +rangeColumn[0] + shiftColumn);
  const cellRowShift = +cellRow - +rangeRow[0] + shiftRow;
  return `${cellColumnShift}${cellRowShift}`;
}

function getRangeType(range) {
  const [v1, v2] = `${range}`.toLowerCase().split(':');
  if (!v2) return 'cell';
  if (+v1 && +v2) return 'row';
  if (v1.match(/[0-9]/) && v1.match(/[A-z]/)
    && v2.match(/[0-9]/) && v2.match(/[A-z]/)) return 'range';
  if (getColumnNumberForName(v1) && getColumnNumberForName(v2)) return 'column';
  return 'RaN';
}

function getRangeSize(range) {
  const rangeType = getRangeType(range);
  const [v1, v2] = range.toLowerCase().split(':');
  const rangeSize = {
    cell: () => [1, 1],
    row: () => [+v1, +v2],
    column: () => [+getColumnNumberForName(v1), getColumnNumberForName(v2)],
    range: () => {
      const { cellColumn: fromCellColumn, cellRow: fromCellRow } = parseCellName(v1);
      const { cellColumn: toCellColumn, cellRow: toCellRow } = parseCellName(v2);
      return [
        [fromCellRow, getColumnNumberForName(fromCellColumn)],
        [toCellRow, getColumnNumberForName(toCellColumn)],
      ];
    },
  };
  return rangeSize[rangeType]();
}

function getRangeOfCellArea(cells) {
  const cellsEntries = (Array.isArray(cells)) ? cells : Object.entries(cells);
  const rows = [];
  const columns = [];
  cellsEntries.forEach((cell) => {
    const [cellName] = cell;
    const { cellColumn, cellRow } = parseCellName(cellName);
    rows.push(cellRow);
    columns.push(getColumnNumberForName(cellColumn));
  });
  return [[Math.min(...rows), Math.max(...rows)], [Math.min(...columns), Math.max(...columns)]];
}

class TableDocument {
  constructor({
    template = false,
    rangeType = null,
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
        rangeType: this.rangeType = null,
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
    this.rangeType = rangeType;
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

  buildDocument(data, template, settings) {
    const buldMethods = {
      put: (buildData, buildArea, buildParameter) => { this.putArea(buildData, buildArea, buildParameter); },
      row: (buildData, buildArea, buildParameter) => { this.putArea(buildData, buildArea, buildParameter); }, // ????
      join: (buildData, buildArea, buildParameter) => { this.joinArea(buildData, buildArea, buildParameter); },
      column: (buildData, buildArea, buildParameter) => { this.joinArea(buildData, buildArea, buildParameter); }, // ????
    };
    const documentData = (typeof data === 'string') ? JSON.parse(data) : data;
    const documentTemplate = (typeof template === 'string') ? JSON.parse(template) : template;
    const documentSetting = (typeof template === 'string') ? JSON.parse(settings) : settings;

    documentData.forEach((item) => {
      const [itemDataKey, itemDataValue] = Object.entries(item)[0];
      const itemSetting = Object.entries(documentSetting).find((setting) => setting[0] === itemDataKey);
      let area = null;
      let buildMethodName = null;
      let areaParameters = {};

      if (itemSetting) {
        const [, tagValue] = itemSetting;
        const { templateSectionName, methodName, parameters } = tagValue;

        area = documentTemplate.getNamedArea(templateSectionName);
        areaParameters = parameters;
        buildMethodName = methodName;
      } else {
        area = documentTemplate.getNamedArea(itemDataKey);
        buildMethodName = area.rangeType;
      }
      if (!Array.isArray(itemDataValue)) {
        const nestedData = [
          { [itemDataKey]: [{ ...itemDataValue }] },
        ];
        this.buildDocument(nestedData, template, settings);
        return;
      }
      itemDataValue.forEach((itemData) => {
        console.log(areaParameters);
        buldMethods[buildMethodName](itemData, area, areaParameters);

        Object.keys(itemData).forEach((parameterKey) => {
          if (Array.isArray(itemData[parameterKey])) {
            const nestedData = [
              { [parameterKey]: [...itemData[parameterKey]] },
            ];
            this.buildDocument(nestedData, template, settings);
          }
        });
      });
    });
  }

  fillArea(dataArea, parameters) {
    console.log(parameters);
    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      const parameterName = cellValue?.parameter || null;
      if (!parameterName) return;
      const parameterNameData = parameters[parameterName] || parameterName;
      if (!parameterName || !dataArea[parameterNameData]) return;
      cellValue.value = dataArea[parameterNameData];
    });
  }

  getAreaCopy() {
    const {
      rows, columns, cells, styles, namedAreas,
    } = JSON.parse(JSON.stringify({
      rows: this.rows,
      columns: this.columns,
      cells: this.cells,
      styles: this.styles,
      namedAreas: this.namedAreas,
    }));

    return new TableDocument({
      rangeType: this.rangeType,
      rows,
      rowCount: this.rowCount,
      columns,
      columnCount: this.columnCount,
      cells,
      styles,
      namedAreas,
    });
  }

  getCellByName(cellName) {
    let cell = {};
    if (Object.keys(this.cells).includes(cellName)) {
      cell = this.cells[cellName];
    }
    return cell;
  }

  getCellsInRange(range) {
    const rangeType = getRangeType(range);
    const [rangeFrom, rangeTo] = getRangeSize(range);
    const setRange = [];
    if (rangeType === 'cell') {
      return Object.entries(this.cells).filter((cell) => {
        const [cellName] = cell;
        return cellName === range;
      });
    }
    if (['column', 'row'].includes(rangeType)) {
      for (let n = rangeFrom; n <= rangeTo; n += 1) setRange.push(n);
      return Object.entries(this.cells).filter((cell) => {
        const [cellName] = cell;
        const { cellColumn, cellRow } = parseCellName(cellName);
        const condition = {
          row: () => setRange.includes(cellRow),
          column: () => setRange.includes(getColumnNumberForName(cellColumn)),
        };
        return (condition[rangeType]());
      });
    }
    if (rangeType === 'range') {
      for (let n = rangeFrom[0]; n <= rangeTo[0]; n += 1) setRange.push(n);
      for (let n = rangeFrom[1]; n <= rangeTo[1]; n += 1) setRange.push(getColumnNameForNumber(n));
      return Object.entries(this.cells).filter((cell) => {
        const [cellName] = cell;
        const { cellColumn, cellRow } = parseCellName(cellName);
        return (setRange.includes(cellRow) && setRange.includes(cellColumn));
      });
    }
    return Object.entries({});
  }

  getLastRow() {
    const rows = [0];
    Object.keys(this.rows).forEach((row) => rows.push(+row));
    return Math.max(...rows);
  }

  getLastColumn() {
    const columns = [0];
    Object.keys(this.columns).forEach((column) => columns.push(+getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  getLastColumnInRow(numberRow) {
    const cellsInRow = this.getCellsInRange(`${numberRow}:${numberRow}`);
    return +getRangeOfCellArea(cellsInRow)[1][1];
  }

  getNamedArea(areaName) {
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = []; // ???? добавлять саму именованную область
    // const [rangeFrom, rangeTo] = range.split(':');
    // const namedAreas = [{
    //   name: areaName,
    //   range: `1:${+rangeTo - +rangeFrom + 1}`,
    // }];
    const range = this.getNamedAreaRange(areaName);
    const cellsInRange = this.getCellsInRange(range);
    const rangeCellArea = getRangeOfCellArea(cellsInRange); // ????

    cellsInRange.forEach((cell) => {
      const [cellNameCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea);
      const { cellColumn: cellColumnCurrent, cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
      const { cellColumn: cellColumnShift, cellRow: cellRowShift } = parseCellName(cellNameShift);

      cells[cellNameShift] = this.cells[cellNameCurrent];
      columns[cellColumnShift] = this.columns[cellColumnCurrent];
      rows[cellRowShift] = this.rows[cellRowCurrent];

      const cellStyles = this.getCellStyles(cellNameCurrent);
      if (cellStyles) styles.push(cellStyles);

      // const cellNamedArea = this.getNamedAreaCellShift(cellNameCurrent, cellNameShift, areaName);
      // if (cellNamedArea) namedAreas.push(cellNamedArea);
    });
    return new TableDocument({
      rangeType: getRangeType(range),
      // insertMethodName: (getRangeType(range) === 'row') ? 'put' : 'join',
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      columnCount: Object.keys(columns).length,
      cells,
      styles,
      namedAreas,
    });
  }

  getNamedAreaCellShift(cellNameCurrent, cellNameShift, areaName) {
    const cellNamedArea = this.namedAreas.find((namedArea) => namedArea.range.split(':')[0].toLowerCase() === cellNameCurrent
      && namedArea.name !== areaName);
    if (!cellNamedArea) return null;
    return {
      name: cellNamedArea.name,
      range: cellNameShift,
    };
  }

  getNamedAreaRange(areaName) {
    let range = null;
    if (areaName.includes('|')) {
      const [areaNameRow, areaNameColumn] = areaName.split('|');
      const rangeRow = this.namedAreas.find((item) => item.name === areaNameRow);
      const [r1, r2] = rangeRow.range.split(':');
      const rangeColumn = this.namedAreas.find((item) => item.name === areaNameColumn);
      const [c1, c2] = rangeColumn.range.split(':');
      range = `${c1}${r1}:${c2}${r2}`.toLowerCase();
    } else {
      const namedArea = this.namedAreas.find((item) => item.name === areaName);
      range = namedArea.range.toLowerCase();
    }
    return range;
  }

  insertArea(numberColumn, numberRow, area) {
    // console.log(area);
    const {
      rows: areaRow,
      columns: areaColumn,
      cells: areaCells,
      styles: areaStyles,
      namedAreas: areaNamedArea,
    } = area;
    const rangeCellArea = getRangeOfCellArea(areaCells);

    Object.entries(areaCells).forEach((cell) => {
      const [cellNameCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea, numberColumn, numberRow);
      const { cellColumn: cellColumnCurrent, cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
      const { cellColumn: cellColumnShift, cellRow: cellRowShift } = parseCellName(cellNameShift);

      this.cells[cellNameShift] = areaCells[cellNameCurrent];
      this.columns[cellColumnShift] = areaColumn[cellColumnCurrent];
      this.rows[cellRowShift] = areaRow[cellRowCurrent];
    });

    areaStyles.forEach((itemAreaStyle) => {
      const style = this.styles.find((itemStyle) => itemStyle.name === itemAreaStyle.name);
      if (!style) this.styles.push(itemAreaStyle);
    });

    this.namedAreas = [...this.namedAreas, ...areaNamedArea];
    this.rowCount = this.getLastRow();
    this.columnCount = this.getLastColumn();
  }

  joinArea(dataArea, area, parameters) {
    const areaCopy = area.getAreaCopy();
    const numberLastRow = this.getLastRow();
    const numberNewColumn = this.getLastColumnInRow(numberLastRow) + 1;
    areaCopy.fillArea(dataArea, parameters);
    this.insertArea(numberNewColumn, numberLastRow, areaCopy);
  }

  putArea(dataArea, area, parameters) {
    const areaCopy = area.getAreaCopy();
    const numberNewRow = this.getLastRow() + 1;
    areaCopy.fillArea(dataArea, parameters);
    this.insertArea(1, numberNewRow, areaCopy);
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

  getCellStyles(cellName) {
    const cellStyle = this.styles.find((item) => item.name === cellName);
    if (!cellStyle) return null;
    return cellStyle;
  }

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
