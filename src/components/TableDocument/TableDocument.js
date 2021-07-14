import {
  RANGE_TYPE,
  SHIFT_TYPE,
  getParseAtSymbolDigit,
  getColumnNameForNumber,
  getColumnNumberForName,
  getRangeType,
  getRangeSplit,
  getRangeLength,
  getRangeShift,
  moveCell,
  moveRange,
} from './Helpers';

import Formulas from './Formulas';

const EDIT_ACCESS = {
  CLOSED: 'closed',
  CLOSED_EXCEPT_OPEN: 'closedExceptOpen',
  OPEN: 'open',
  // OPEN_EXCEPT_CLOSED: 'open-except-closed',
};

const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;

// const REG_OPERATORS = /[+-/*)(% ]/g;

const CELL_ATTRIBUTES = {
  VALUE: 'value',
  FORMULA: 'formula',
  ACTION: 'action',
  PARAMETER: 'parameter',
};

const DELETE_MODE = {
  DATA: 'data',
  COLUMN: 'column',
  ROW: 'row',
};

const INSERT_MODE = {
  FULL: 'full',
  DATA_ONLY: 'dataOnly',
};

const RETURN_FORMAT = {
  OBJECT: 'object',
  ENTRIES: 'entries',
  KEYS: 'keys',
};

// function fillingFormula(operandsValues, formula) {
//   let fillFormula = formula;
//   Object.entries(operandsValues).forEach((operand) => {
//     const [operandName, operandValue] = operand;
//     fillFormula = fillFormula.replace(`$${operandName}`, operandValue);
//   });
//   return fillFormula;
// }

function getObjectOfJSON(data) {
  return (typeof data === 'string') ? JSON.parse(data) : data;
}

function valueValidateType(value, type) {
  if (!value && typeof type !== 'boolean') return true;
  const validate = {
    string: (v) => (typeof v === 'string'),
    number: (v) => (typeof v === 'number'),
    integer: (v) => (typeof v === 'number'),
    float: (v) => (typeof v === 'number'),
    boolean: (v) => (typeof v === 'boolean'),
    date: (v) => (new Date(v).toDateString() !== 'Invalid Date'),
    datetime: (v) => (new Date(v).toDateString() !== 'Invalid Date'),
    field: () => true,
    choice: () => true,
  };
  return validate[type](value);
}
// function hasString(value) {

// }
// function getOperandsSet(formula) {
//   return formula.replace(REG_OPERATORS, '').split('$').splice(1);
// }

// function getOperandsValues(operandsSet) {
//   const operandsValues = {};
//   operandsSet.forEach((operand) => {
//     operandsValues[operand] = ` +this.getCellValueForFormula('${operand}')`;
//   });
//   return operandsValues;
// }

class TableDocument {
  constructor({
    template = false,
    editAccess = undefined,
    methodName = null,
    rows = {},
    rowCount = ROW_COUNT,
    columns = {},
    columnCount = COLUMNS_COUNT,
    cells = {},
    styles = [],
    scripts = {},
    images = {},
    namedAreas = [],
    cellWidth = CELL_WIDTH,
    cellHeight = CELL_HEIGHT,
    JSONString = null,
  } = {}) {
    if (JSONString) {
      const JSONStringParse = JSON.parse(JSONString);
      ({
        template: this.template = false,
        editAccess: this.editAccess = undefined,
        methodName: this.methodName = null,
        rows: this.rows = {},
        rowCount: this.rowCount = ROW_COUNT,
        columns: this.columns = {},
        columnCount: this.columnCount = COLUMNS_COUNT,
        cells: this.cells = {},
        styles: this.styles = [],
        scripts: this.scripts = {},
        images: this.images = {},
        namedAreas: this.namedAreas = [],
        cellWidth: this.cellWidth = CELL_WIDTH,
        cellHeight: this.cellHeight = CELL_HEIGHT,
      } = JSONStringParse);
      return;
    }
    this.template = template;
    this.editAccess = editAccess;
    this.methodName = methodName;
    this.rows = rows;
    this.rowCount = rowCount;
    this.columns = columns;
    this.columnCount = columnCount;
    this.cells = cells;
    this.styles = styles;
    this.scripts = scripts;
    this.images = images;
    this.namedAreas = namedAreas;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  editAccess = undefined;

  BASE_CLASS = TableDocument;

  addArea(cellName, areaName, shiftType = SHIFT_TYPE.VERTICAL) {
    const area = this.documentTemplate.getNamedArea(areaName);
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    const cellColumnNumber = (shiftType === SHIFT_TYPE.VERTICAL) ? 1 : getColumnNumberForName(cellColumn);
    const cellRowNumber = (shiftType === SHIFT_TYPE.HORIZONTAL) ? 1 : cellRow;
    this.insertArea(cellColumnNumber, cellRowNumber, area, shiftType);
    this.recalculateFormulas();
  }

  calculateCellValue(cellName) {
    const cellFormula = this.getCellParameter(cellName, CELL_ATTRIBUTES.FORMULA);
    const formula = new Formulas(cellFormula, cellName);
    if (formula.hasOperandsInclude(cellName)) {
      this.updateCellValue(cellName, NaN);
      return NaN;
    }
    const result = eval(formula.getFormulaForCalculation()); // eslint-disable-line no-eval
    this.updateCellValue(cellName, result);
    return result;
  }

  calculateSUM(range, currentCellName) {
    const cellKeys = this.getCellsInRange(range, RETURN_FORMAT.KEYS);
    const formula = new Formulas(cellKeys.map((cellKey) => `$${cellKey}`).join(' + '), currentCellName);
    if (formula.hasOperandsInclude(currentCellName)) return NaN;
    return eval(formula.getFormulaForCalculation()); // eslint-disable-line no-eval
  }

  copyAndPast(rangeCopy, rangePast) {
    const {
      parthSymbol: rangeColumn,
      parthDigit: rangeRow,
    } = getParseAtSymbolDigit(rangePast.split(':')[0]);
    const copyArea = this.getAreaForRange(rangeCopy);
    this.insertArea(
      getColumnNumberForName(rangeColumn),
      rangeRow,
      copyArea,
      undefined,
      INSERT_MODE.DATA_ONLY,
    );
  }
  // calculateCellValueV1(cellName) {
  //   const FUNCTION_FORMULA = {
  //     SUM: () => 'calculateSUM',
  //   };
  //   const cellFormula = this.getCellParameter(cellName, CELL_ATTRIBUTES.FORMULA);
  //   if (cellFormula[0] === '=') {
  //     const [functionName, functionParameters] = cellFormula.slice(1, -1).split('(');
  //     const evalFunction = `this.${FUNCTION_FORMULA[functionName]()}('${functionParameters}','${cellName}')`;
  //     console.log(evalFunction);
  //     const result = eval(evalFunction); // eslint-disable-line no-eval
  //     this.updateCellValue(cellName, result);
  //     return result;
  //   }
  //   const operandsSet = getOperandsSet(cellFormula);
  //   if (operandsSet.includes(cellName)) { this.updateCellValue(cellName, NaN); return NaN; }
  //   const operandsValues = getOperandsValues(operandsSet);
  //   const fillFormula = fillingFormula(operandsValues, cellFormula);
  //   const result = eval(fillFormula); // eslint-disable-line no-eval
  //   this.updateCellValue(cellName, result);
  //   return result;
  // }

  // checkEditAccess(cellName) {
  //   if (Object.keys(this.cells).includes(cellName) && this.cells[cellName].disabled === true) return false;
  //   if (!Object.keys(this.cells).includes(cellName)) return true;
  //   if (Object.keys(this.cells[cellName]).includes('areaName')) return true;
  //   return true;
  // }

  deleteArea(range, shiftType = null) {
    const rangeType = getRangeType(range);
    this.deleteRange(range);

    if (shiftType && [RANGE_TYPE.CELL, RANGE_TYPE.RANGE].includes(rangeType)) return; // if delete only data at not shift

    const [rangeFrom, rangeTo] = getRangeSplit(range);
    const rangeShiftFrom = getRangeShift(rangeTo, shiftType, 1);
    const rangeShiftArea = this.getRangeToEdge(rangeShiftFrom);
    const areaShift = this.getAreaForRange(rangeShiftArea);
    const shiftArea = {
      [SHIFT_TYPE.VERTICAL]: () => {
        this.deleteRange(rangeShiftArea, DELETE_MODE.ROW);
        this.insertArea(1, +rangeFrom, areaShift);
      },
      [SHIFT_TYPE.HORIZONTAL]: () => {
        this.deleteRange(rangeShiftArea, DELETE_MODE.COLUMN);
        this.insertArea(getColumnNumberForName(rangeFrom), 1, areaShift);
      },
      null: () => {},
    };
    shiftArea[shiftType]();
  }

  deleteRange(range, deleteMode = null) {
    const cellsInRange = this.getCellsInRange(range, RETURN_FORMAT.KEYS);
    const cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRange.includes(cellName));
    });
    this.cells = { ...Object.fromEntries(cells) };

    const namedAreasInRange = this.getListNamedAreasForRange(range);
    const namedAreas = this.namedAreas.filter((namedArea) => {
      const condition = namedAreasInRange
        .findIndex((item) => item.name === namedArea.name && item.range === namedArea.range);
      return (condition === -1);
    });
    this.namedAreas = [...namedAreas];

    if (deleteMode === DELETE_MODE.ROW) {
      const rowKeys = this.getRowKeysInRange(range);
      const rows = Object.entries(this.rows).filter((row) => {
        const [rowName] = row;
        return (!rowKeys.includes(+rowName));
      });
      this.rows = { ...Object.fromEntries(rows) };
    }

    if (deleteMode === DELETE_MODE.COLUMN) {
      const columnKeys = this.getColumnKeysInRange(range);
      const columns = Object.entries(this.columns).filter((column) => {
        const [columnName] = column;
        return (!columnKeys.includes(columnName));
      });
      this.columns = { ...Object.fromEntries(columns) };
    }
  }

  deserialize(data, template, settings) {
    const documentData = getObjectOfJSON(data);
    const documentTemplate = getObjectOfJSON(template);
    const documentSettings = getObjectOfJSON(settings);
    if (!this.documentTemplate) this.documentTemplate = documentTemplate;
    if (!this.documentSettings) this.documentSettings = documentSettings;
    if (!this.editAccess) this.editAccess = this.documentTemplate.editAccess || undefined;
    documentSettings.forEach((setting) => {
      const [key, keyValue] = Object.entries(setting)[0];
      if (Object.keys(keyValue).includes('nested')) return;
      const dataSection = documentData.find((item) => Object.keys(item).includes(key));
      const dataSectionItems = dataSection[key];
      if (Array.isArray(dataSectionItems)) {
        dataSectionItems.forEach((dataSectionItem) => {
          this.deserializeArea(key, dataSectionItem);
        });
        return;
      }
      this.deserializeArea(key, dataSectionItems);
    });
  }

  deserializeArea(key, dataItem) {
    const insertMethods = {
      put: (buildData, buildArea, buildParameter) => { this.putArea(buildData, buildArea, buildParameter); },
      join: (buildData, buildArea, buildParameter) => { this.joinArea(buildData, buildArea, buildParameter); },
    };

    if (Array.isArray(dataItem)) {
      dataItem.forEach((item) => {
        this.deserializeArea(key, item);
      });
      return;
    }

    const [, keyValue] = Object.entries(this.documentSettings.find((setting) => Object.keys(setting).includes(key)))[0];
    const {
      templateSectionName, methodName: insertMethod, parameters, nestedData,
    } = keyValue;
    const area = this.documentTemplate.getNamedArea(templateSectionName);

    insertMethods[insertMethod](dataItem, area, parameters);
    if (!nestedData) return;
    nestedData.forEach((nestedDataKey) => {
      if (Object.keys(dataItem).includes(nestedDataKey)) this.deserializeArea(nestedDataKey, dataItem[nestedDataKey]);
    });
  }

  editingCell(cellName, cellValue) { // проверять существует строка/столбец
    // получать максимальный из имеющихся, сравнивать
    // если пусстое значение и больше ничего нет, то удалять ячейку из набора ???
    this.valueValidate(cellValue, cellName);
    let cellValues = (Object.keys(this.cells).includes(cellName)) ? this.cells[cellName] : {};
    cellValues = { ...cellValues, ...{ value: cellValue || '' } };
    if (!cellValue && !Object.keys(this.cells).includes(cellName)) return;
    this.cells = { ...this.cells, ...{ [cellName]: cellValues } };
    this.recalculateFormulas();
    console.log(this.cells);
  }

  executeAction(cellName) {
    const actionName = this.getCellParameter(cellName, CELL_ATTRIBUTES.ACTION);
    const { script } = this.getScript(actionName);
    const actionFunction = eval(script); // eslint-disable-line no-eval

    actionFunction(cellName);
    this.recalculateFormulas();
  }

  fillArea(dataArea, parameters) {
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
      rows, columns, cells, styles, scripts, images, namedAreas,
    } = JSON.parse(JSON.stringify({
      rows: this.rows,
      columns: this.columns,
      cells: this.cells,
      styles: this.styles,
      scripts: this.scripts,
      images: this.images,
      namedAreas: this.namedAreas,
    }));
    // const BaseClass = Object.getPrototypeOf(this);
    return new this.BASE_CLASS({
      rangeType: this.rangeType,
      rows,
      rowCount: this.rowCount,
      columns,
      columnCount: this.columnCount,
      cells,
      styles,
      scripts,
      images,
      namedAreas,
    });
  }

  getAreaForRange(range) {
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [];
    const scripts = {};
    const images = {};
    const cellsInRange = this.getCellsInRange(range);
    cellsInRange.forEach((cell) => {
      const [cellNameCurrent, cellValueCurrent] = cell;
      const cellNameShift = moveCell(cellNameCurrent, undefined, range);
      const { parthSymbol: cellColumnCurrent, parthDigit: cellRowCurrent } = getParseAtSymbolDigit(cellNameCurrent);
      const { parthSymbol: cellColumnShift, parthDigit: cellRowShift } = getParseAtSymbolDigit(cellNameShift);

      cells[cellNameShift] = this.cells[cellNameCurrent];
      columns[cellColumnShift] = this.columns[cellColumnCurrent];
      rows[cellRowShift] = this.rows[cellRowCurrent];

      const cellStyles = this.getCellStyles(cellNameCurrent);
      if (cellStyles) styles.push(cellStyles);

      if (Object.keys(cellValueCurrent).includes('action')) {
        const actionName = cellValueCurrent.action;
        const script = Object.entries(this.scripts).find((scriptItem) => scriptItem[0] === actionName);
        if (script) {
          scripts[actionName] = this.scripts[actionName];
        }
      }
      if (Object.keys(cellValueCurrent).includes('image')) {
        // console.log(this.images);
        const imageName = cellValueCurrent.image;
        const image = this.images[imageName];
        if (image) {
          images[imageName] = this.images[imageName];
        }
      }
    });
    // console.log(images);
    const listNamedAreas = this.getListNamedAreasForRange(range);
    listNamedAreas.forEach((namedArea) => {
      namedAreas.push({
        name: namedArea.name,
        range: moveRange(namedArea.range.toLowerCase(), 1, range),
      });
    });
    // const BaseClass = Object.getPrototypeOf(this);
    return new this.BASE_CLASS({
      methodName: (getRangeType(range) === 'row') ? 'put' : 'join', // ??????
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      columnCount: Object.keys(columns).length,
      cells,
      styles,
      scripts,
      images,
      namedAreas,
    });
  }

  getAreaHeight() {
    const rows = [];
    Object.keys(this.rows).forEach((row) => rows.push(row));
    return Math.max(...rows);
  }

  getAreaRange() {
    return `a1:${getColumnNameForNumber(this.getAreaWidth())}${this.getAreaHeight()}`;
  }

  getAreaValue(parameters) {
    const parametersSet = new Map(Object.entries(parameters));
    const parametersValue = {};
    if (parametersSet.size === 0) {
      Object.values(this.cells).forEach((cellValue) => {
        if (cellValue.parameter) parametersValue[cellValue.parameter] = cellValue.value;
      });
      return parametersValue;
    }
    Object.values(this.cells).forEach((cellValue) => {
      if (Object.keys(cellValue).includes(CELL_ATTRIBUTES.PARAMETER)) {
        if (parametersSet.has(cellValue.parameter)) {
          parametersValue[parametersSet.get(cellValue.parameter)] = cellValue.value;
        }
      }
    });
    return parametersValue;
  }

  getAreaWidth() {
    const columns = [];
    Object.keys(this.columns).forEach((column) => columns.push(getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  getCell(cellName) {
    let cell = {};
    if (Object.keys(this.cells).includes(cellName)) {
      cell = this.cells[cellName];
    }
    return cell;
  }

  getCellObject(cellName) {
    return this.cells[cellName] || undefined;
  }

  getCellParameter(cellName, cellParameter) {
    if (!this.cells[cellName]) return null;
    return this.cells[cellName][cellParameter] || null;
  }

  getCellStyles(cellName) {
    const cellStyle = this.styles.find((item) => item.name === cellName);
    if (!cellStyle) return null;
    return cellStyle;
  }

  getCellType(cellName) {
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    return this.cells[cellName]?.type
      || this.columns[cellColumn]?.type
      || this.rows[cellRow]?.type
      || 'string';
  }

  getCellValueForFormula(cellName) {
    if (this.getCellParameter(cellName, CELL_ATTRIBUTES.FORMULA)) return this.calculateCellValue(cellName);
    const cellValue = this.getCellParameter(cellName, CELL_ATTRIBUTES.VALUE);
    return +cellValue || 0;
  }

  getCellsInRange(range, returnFormat = RETURN_FORMAT.ENTRIES) {
    const rowKeys = this.getRowKeysInRange(range);
    const columnKeys = this.getColumnKeysInRange(range);
    const cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      const { parthSymbol: columnKey, parthDigit: rowKey } = getParseAtSymbolDigit(cellName);
      return (columnKeys.includes(columnKey) && rowKeys.includes(rowKey));
    });
    const formatRezult = {
      [RETURN_FORMAT.ENTRIES]: () => cells,
      [RETURN_FORMAT.KEYS]: () => Object.keys(Object.fromEntries(cells)),
      [RETURN_FORMAT.OBJECT]: () => Object.fromEntries(cells),
    };
    return formatRezult[returnFormat]();
  }

  getColumnKeysInRange(range) {
    const type = getRangeType(range);
    const columnKeys = [];
    const columnSet = {
      [RANGE_TYPE.CELL]: () => {
        const { parthSymbol: columnKey } = getParseAtSymbolDigit(range);
        columnKeys.push(columnKey);
        return columnKeys;
      },
      [RANGE_TYPE.COLUMN]: () => {
        let [rangeFrom, rangeTo] = getRangeSplit(range);
        rangeFrom = +getColumnNumberForName(rangeFrom);
        rangeTo = +getColumnNumberForName(rangeTo);
        for (let columnKey = rangeFrom; columnKey < rangeTo + 1; columnKey += 1) {
          columnKeys.push(getColumnNameForNumber(columnKey));
        }
        return columnKeys;
      },
      [RANGE_TYPE.ROW]: () => {
        columnKeys.push(...Object.keys(this.columns));
        return columnKeys;
      },
      [RANGE_TYPE.RANGE]: () => {
        const [rangeFrom, rangeTo] = getRangeSplit(range);
        let { parthSymbol: columnFrom } = getParseAtSymbolDigit(rangeFrom);
        let { parthSymbol: columnTo } = getParseAtSymbolDigit(rangeTo);
        columnFrom = +getColumnNumberForName(columnFrom);
        columnTo = +getColumnNumberForName(columnTo);
        for (let columnKey = columnFrom; columnKey < columnTo + 1; columnKey += 1) {
          columnKeys.push(getColumnNameForNumber(columnKey));
        }
        return columnKeys;
      },
    };
    return columnSet[type]();
  }

  getDocument(JSONFormat = false) {
    const cells = Object.entries(this.cells).filter((cell) => {
      const [, cellValue] = cell;
      // console.log(cellValue);
      return (!Object.keys(cellValue).includes('action'));
    });
    console.log(Object.fromEntries(cells));
    const document = {
      editAccess: this.editAccess,
      rows: this.rows,
      rowCount: this.rowCount,
      columns: this.columns,
      columnCount: this.columnCount,
      cells: Object.fromEntries(cells),
      styles: this.styles,
    };
    return (JSONFormat) ? JSON.stringify(document) : document;
  }

  getFormularsCellsSet() {
    const formulasCellsSet = Object.keys(this.cells)
      .filter((cellName) => Object.keys(this.cells[cellName]).includes(CELL_ATTRIBUTES.FORMULA));
    return formulasCellsSet;
  }

  // calculateSUM(range, currentCellName) {
  //   const cellKeys = this.getCellsInRange(range, RETURN_FORMAT.KEYS);
  //   const formula = cellKeys.map((cellKey) => `$${cellKey}`).join(' + ');
  //   const operandsSet = getOperandsSet(formula);
  //   if (operandsSet.includes(currentCellName)) { this.updateCellValue(currentCellName, NaN); return NaN; }
  //   const operandsValues = getOperandsValues(operandsSet);
  //   const fillFormula = fillingFormula(operandsValues, formula);
  //   const result = eval(fillFormula); // eslint-disable-line no-eval
  //   // this.updateCellValue(cellName, result);
  //   return result;
  // }

  getLastColumn() {
    const columns = [0];
    Object.keys(this.columns).forEach((column) => columns.push(+getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  getLastColumnInRow(numberRow) {
    const columns = [0];
    const cellsInRow = this.getCellsInRange(`${numberRow}:${numberRow}`, RETURN_FORMAT.KEYS);
    cellsInRow.forEach((cellKey) => {
      const { parthSymbol: cellColumn } = getParseAtSymbolDigit(cellKey);
      columns.push(+getColumnNumberForName(cellColumn));
    });
    return Math.max(...columns);
  }

  getLastRow() {
    const rows = [0];
    Object.keys(this.rows).forEach((row) => rows.push(+row));
    return Math.max(...rows);
  }

  getListNamedAreasForRange(range) {
    const namedAreas = [];
    const [rangeFrom, rangeTo] = getRangeSplit(range);
    let { parthSymbol: rangeFromColumn, parthDigit: rangeFromRow } = getParseAtSymbolDigit(rangeFrom);
    if (rangeFromColumn === '') rangeFromColumn = 'a';
    if (rangeFromRow === '') rangeFromRow = 1;
    let {
      parthSymbol: rangeToColumn,
      parthDigit: rangeToRow,
    } = getParseAtSymbolDigit(rangeTo);
    if (rangeToColumn === '') rangeToColumn = getColumnNameForNumber(this.getLastColumn());
    if (rangeToRow === '') rangeToRow = this.getLastRow();
    const rangeTypes = {
      [RANGE_TYPE.ROW]: (from, to) => (from >= rangeFromRow && to <= rangeToRow),
      [RANGE_TYPE.COLUMN]: (from, to) => (from >= getColumnNumberForName(rangeFromColumn)
        && to <= getColumnNumberForName(rangeToColumn)),
    };
    this.namedAreas.forEach((item) => {
      const rangeTypeItem = getRangeType(item.range);
      let [namedAreaRangeFrom, namedAreaRangeTo] = getRangeSplit(item.range);

      if (rangeTypeItem === RANGE_TYPE.COLUMN) {
        namedAreaRangeFrom = getColumnNumberForName(namedAreaRangeFrom);
        namedAreaRangeTo = getColumnNumberForName(namedAreaRangeTo);
      }
      if (rangeTypes[rangeTypeItem](namedAreaRangeFrom, namedAreaRangeTo)) namedAreas.push(item);
    });

    return namedAreas;
  }

  getNamedArea(areaName) {
    const namedAreas = [];
    const range = this.getRangeByAreaName(areaName);
    range.forEach((rangeItem) => {
      namedAreas.push(this.getAreaForRange(rangeItem));
    });
    if (namedAreas.length === 1) return namedAreas[0];
    return namedAreas;
  }

  getRangeByAreaName(areaName) {
    const range = [];
    if (!areaName) return null;
    if (areaName.includes('|')) {
      const [areaNameR1, areaNameR2] = areaName.split('|');
      const rangeR1 = this.namedAreas.find((item) => item.name === areaNameR1);
      const rangeR2 = this.namedAreas.find((item) => item.name === areaNameR2);
      let rangeRow = null;
      let rangeColumn = null;
      if (getRangeType(rangeR1) === RANGE_TYPE.ROW) {
        rangeRow = rangeR1;
        rangeColumn = rangeR2;
      } else {
        rangeRow = rangeR2;
        rangeColumn = rangeR1;
      }
      const [r1, r2] = rangeRow.range.split(':');
      const [c1, c2] = rangeColumn.range.split(':');
      range.push(`${c1}${r1}:${c2}${r2}`.toLowerCase());
    } else {
      const namedAreas = this.namedAreas.filter((item) => item.name === areaName);
      namedAreas.forEach((namedArea) => {
        range.push(
          namedArea.range.toLowerCase() || null,
        );
      });
    }
    return range;
  }

  getRangeByCellName(cellName, areaName = null, rangeType = RANGE_TYPE.ROW) { // ??????
    if (rangeType === RANGE_TYPE.CELL) return cellName;
    let range = '';
    const rangeArea = this.getRangeByAreaName(areaName);
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    if (rangeArea) {
      const rangeLength = getRangeLength(rangeArea);
      if (rangeType === RANGE_TYPE.ROW) range = `a${cellRow}:${cellColumn}${cellRow + (rangeLength - 1)}`;
      if (rangeType === RANGE_TYPE.COLUMN) range = `${cellColumn}1:${cellColumn + (rangeLength - 1)}${cellRow + (rangeLength - 1)}`; // ????
    }
    if (rangeArea === null) {
      if (rangeType === RANGE_TYPE.ROW) range = cellRow;
      if (rangeType === RANGE_TYPE.COLUMN) range = cellColumn;
    }
    return range;
  }

  getRangeToEdge(rangeFrom) {
    const rangeType = getRangeType(rangeFrom);
    const rangeEdge = {
      [RANGE_TYPE.CELL]: () => `${rangeFrom}:${getColumnNameForNumber(this.getLastColumn())}${this.getLastRow()}`,
      [RANGE_TYPE.ROW]: () => `${rangeFrom}:${this.getLastRow()}`,
      [RANGE_TYPE.COLUMN]: () => `${rangeFrom}:${getColumnNameForNumber(this.getLastColumn())}`,
    };
    return rangeEdge[rangeType]();
  }

  getRowKeysInRange(range) {
    const type = getRangeType(range);
    const rowKeys = [];
    const rowSet = {
      [RANGE_TYPE.CELL]: () => {
        const { parthDigit: rowKey } = getParseAtSymbolDigit(range);
        rowKeys.push(+rowKey);
        return rowKeys;
      },
      [RANGE_TYPE.COLUMN]: () => {
        Object.keys(this.rows).forEach((row) => rowKeys.push(+row));
        return rowKeys;
      },
      [RANGE_TYPE.ROW]: () => {
        const [rangeFrom, rangeTo] = getRangeSplit(range);
        for (let rowKey = +rangeFrom; rowKey < +rangeTo + 1; rowKey += 1) rowKeys.push(+rowKey);
        return rowKeys;
      },
      [RANGE_TYPE.RANGE]: () => {
        const [rangeFrom, rangeTo] = getRangeSplit(range);
        const { parthDigit: rowFrom } = getParseAtSymbolDigit(rangeFrom);
        const { parthDigit: rowTo } = getParseAtSymbolDigit(rangeTo);
        for (let rowKey = rowFrom; rowKey < rowTo + 1; rowKey += 1) rowKeys.push(+rowKey);
        return rowKeys;
      },
    };
    return rowSet[type]();
  }

  getScript(scriptName) {
    const script = this.scripts[scriptName];
    if (script) return script;
    return null;
  }

  hasEditing(cellName) {
    return this.hasEditingSheet(cellName);
  }

  hasEditingCell(cellName) {
    let isEditCell;
    if (Object.keys(this.cells).includes(cellName)) {
      isEditCell = this.cells[cellName].isEditable;
    }
    console.log(isEditCell);
    if (this.editAccess === EDIT_ACCESS.CLOSED_EXCEPT_OPEN && !isEditCell) return false;
    if (this.editAccess === EDIT_ACCESS.OPEN && isEditCell === false) return false;
    if (!this.editAccess && isEditCell === false) return false;
    return true;
  }

  hasEditingSheet(cellName) {
    if (this.editAccess === EDIT_ACCESS.CLOSED) return false;
    return this.hasEditingCell(cellName);
  }

  hasNamedArea(namedArea) {
    let rezult = false;
    const foundNamedArea = this.namedAreas
      .find((item) => (item.name === namedArea.name && item.range === namedArea.range));
    if (foundNamedArea) rezult = true;
    return rezult;
  }

  insertArea(numberColumn, numberRow, area, shiftType = null, insertMode = INSERT_MODE.FULL) {
    // console.log(area);
    const rows = {};
    const columns = {};
    const cells = {};
    const namedAreas = [];
    const {
      rows: insertRows,
      columns: insertColumns,
      cells: insertCells,
      styles: insertStyles,
      scripts: areaScripts,
      images: areaImages,
      namedAreas: insertNamedAreas,
    } = area;

    let rangeShift = null;
    let areaShift = null;

    const shiftInsert = {
      [SHIFT_TYPE.HORIZONTAL]: () => {
        const numberColumnShift = numberColumn + area.getAreaWidth();
        this.insertArea(numberColumnShift, numberRow, areaShift);
      },
      [SHIFT_TYPE.VERTICAL]: () => {
        const numberRowShift = numberRow + area.getAreaHeight();
        this.insertArea(numberColumn, numberRowShift, areaShift);
      },
      null: () => {},
    };

    if (shiftType) {
      const rangeFrom = `${getColumnNameForNumber(numberColumn)}${numberRow}`;
      rangeShift = this.getRangeToEdge(`${rangeFrom}`);
      areaShift = this.getAreaForRange(rangeShift);
      this.deleteRange(rangeShift);
    }

    Object.entries(insertCells).forEach((cell) => {
      const [currentCellName, currentCellValue] = cell;
      const shiftCellName = moveCell(currentCellName, `${getColumnNameForNumber(numberColumn)}${numberRow}`);
      const { parthSymbol: currentColumn, parthDigit: currentRow } = getParseAtSymbolDigit(currentCellName);
      const { parthSymbol: shiftColumn, parthDigit: shiftRow } = getParseAtSymbolDigit(shiftCellName);

      if (insertMode === INSERT_MODE.DATA_ONLY) {
        if (!this.cells[shiftCellName]) this.cells[shiftCellName] = {};
        this.cells[shiftCellName].value = insertCells[currentCellName].value;
        return; // next loop
      }

      area.valueValidate(currentCellValue.value || '', currentCellName);
      // this.valueValidate(currentCellValue.value || '', area.getCellType(currentCellName));

      rows[shiftRow] = insertRows[currentRow];
      columns[shiftColumn] = insertColumns[currentColumn];
      cells[shiftCellName] = insertCells[currentCellName] || {};
      const validateType = area.valueValidate(currentCellValue.value || '', currentCellName);
      if (validateType !== true) cells[shiftCellName].invalid = validateType;
    });

    insertStyles.forEach((insertStyle) => {
      const styles = this.styles.find((style) => style.name === insertStyle.name);
      if (!styles) this.styles.push(insertStyle);
    });

    const moveRangeNamedArea = {
      [RANGE_TYPE.ROW]: (range) => moveRange(range, numberRow),
      [RANGE_TYPE.COLUMN]: (range) => moveRange(range, numberColumn),
    };
    insertNamedAreas.forEach((insertNamedArea) => {
      const insertNamedAreaType = getRangeType(insertNamedArea.range);
      const namedArea = {
        name: insertNamedArea.name,
        range: moveRangeNamedArea[insertNamedAreaType](insertNamedArea.range),
      };
      if (!this.hasNamedArea(namedArea)) namedAreas.push(namedArea);
    });

    this.rows = { ...this.rows, ...rows };
    this.columns = { ...this.columns, ...columns };
    this.cells = { ...this.cells, ...cells };
    this.scripts = { ...this.scripts, ...areaScripts };
    this.images = { ...this.images, ...areaImages };
    this.namedAreas = [...this.namedAreas, ...namedAreas];
    this.rowCount = this.getLastRow();
    this.columnCount = this.getLastColumn();

    shiftInsert[shiftType]();
    // console.log(this);
  }

  getSectionSettings(sectionName) {
    const sectionSettings = this.documentSettings.find((setting) => {
      const [sectionKey] = Object.keys(setting);
      return sectionKey === sectionName;
    });
    return Object.entries(sectionSettings)[0];
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

  recalculateFormulas() {
    const formulasCellsSet = this.getFormularsCellsSet();
    formulasCellsSet.map((cellName) => this.calculateCellValue(cellName));
  }

  // recalculateFormulas() {
  //   this.getFormulars.map((formula) => this.updateCellValue())
  // }

  serializationDataSection(nameDataSection, settings) {
    if (!nameDataSection) {
      const result = [];
      this.documentSettings.forEach((setting) => {
        const [key, keyValue] = Object.entries(setting)[0];
        if (Object.keys(keyValue).includes('nested')) return;
        result.push({ [key]: this.serializationDataSection(key, this.documentSettings) });
      });
      return result;
    }
    const settingItem = settings
      .find((setting) => Object.keys(setting)[0] === nameDataSection); // не учитывает если несколько секций с одним именем
    const [, keyValue] = Object.entries(settingItem)[0];
    const areas = this.getNamedArea(keyValue.baseSection);

    if (Array.isArray(areas)) {
      const result = [];
      areas.forEach((area) => {
        result.push(...area.serializationDataSection(nameDataSection, settings));
      });
      return result;
    }

    const areaValue = areas.getAreaValue(keyValue.parameters || {});
    if (keyValue.nestedData) {
      keyValue.nestedData.forEach((nestedSection) => {
        areaValue[nestedSection] = this.serializationDataSection(nestedSection, settings);
      });
    }
    return (keyValue.presentationType === 'unit') ? { ...areaValue } : [{ ...areaValue }];
  }

  updateCellValue(cellName, cellValue) {
    this.cells[cellName].value = cellValue;
    this.cells = { ...this.cells, ...{ [cellName]: this.cells[cellName] } };
  }

  valueValidate(value, cellName) {
    const cellType = this.getCellTypeClean(cellName);
    const validateType = valueValidateType(value, cellType);
    // console.log(cellName, cellType, value, validateType || 'Error type');
    return validateType || 'Значение не соответствует типу ячейки';
  }

  getCellTypeClean(cellName) {
    return this.getCellType(cellName).split('.')[0];
  }
}

export default TableDocument;
