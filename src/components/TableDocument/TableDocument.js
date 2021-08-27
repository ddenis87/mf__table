import store from '@/store/index';
import FormulaParser, { Address } from 'fast-formula-parser';
// import {
//   FormulaHelpers,
// } from 'fast-formula-parser';
// import {
//   FormulaHelpers, Types, FormulaError, MAX_ROW, MAX_COLUMN,
// } from 'fast-formula-parser';
import {
  RANGE_TYPE,
  SHIFT_TYPE,
  getRangeType,
  getRangeSplit,
  getRangeLength,
  getRangeShift,
  moveCell,
  moveFormula,
  moveRange,
} from './TableDocumentHelpers';

import {
  getColumnNameForNumber,
  getColumnNumberForName,
  getParseAtSymbolDigit,
} from '../../helpers/spreadSheet';

// import Formulas from './Formulas';
import TableDocumentDeserializeError from './TableDocumentDeserializeError';
import TableDocumentGeneralError from './TableDocumentGeneralError';
import TableDocumentValidationCellError from './TableDocumentValidationCellError';

const EDIT_ACCESS = {
  CLOSED: 'closed',
  CLOSED_EXCEPT_OPEN: 'closedExceptOpen',
  OPEN: 'open',
};

const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
// const ROW_COUNT = 100; // { sheet1: 1000, sheet3: 1000, sheet2: 1000 };
// const COLUMNS_COUNT = 26; // { sheet1: 26, sheet3: 26, sheet2: 26 };

const CELL_ATTRIBUTES = {
  VALUE: 'value',
  FORMULA: 'formula',
  SCRIPTS: 'scripts',
  PARAMETER: 'parameter',
  ACTION: 'action',
  VALIDATE: 'validate',
};

const DELETE_MODE = {
  DATA: 'data',
  COLUMN: 'column',
  ROW: 'row',
};

const RETURN_FORMAT = {
  OBJECT: 'object',
  ENTRIES: 'entries',
  KEYS: 'keys',
};

function getObjectOfJSON(data) {
  return (typeof data === 'string') ? JSON.parse(data) : data;
}

function validateCellValueType(value = '', type = 'string') {
  if (!value && typeof type !== 'boolean') return true;
  const validate = {
    string: () => true, // (typeof v === 'string'),
    number: (v) => (typeof v === 'number'),
    integer: (v) => (typeof v === 'number'),
    float: (v) => (typeof v === 'number'),
    boolean: (v) => (typeof v === 'boolean'),
    date: (v) => (new Date(v).toDateString() !== 'Invalid Date'),
    datetime: (v) => (new Date(v).toDateString() !== 'Invalid Date'),
    field: () => true,
    choice: () => true,
  };
  return validate[type.split('.')[0]](value) || 'Значение не соответствует типу ячейки';
}

function getRepresentationAtStore(sourceName, value, relatedModelView) {
  const representation = store
    .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({
      tableName: sourceName,
      id: value,
      relatedModelView,
    });
  return representation;
}

class TableDocument {
  constructor({
    // template = false,
    version = null,
    editAccess = undefined,
    methodName = null,
    sheetsList = [{ name: 'sheet1', nameView: 'Лист 1' }],
    sheets = {
      sheet1: {
        columns: {},
        columnCount: 26,
        rows: {},
        rowCount: 100,
        cells: {},
      },
    },
    // rows = {},
    // rowCount = ROW_COUNT,
    // columns = {},
    // columnCount = COLUMNS_COUNT,
    // cells = {},
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
        version: this.version = null,
        // template: this.template = false,
        editAccess: this.editAccess = undefined,
        methodName: this.methodName = null,
        sheetsList: this.sheetsList = [],
        sheets: this.sheets = {},
        // rows: this.rows = {},
        // rowCount: this.rowCount = ROW_COUNT,
        // columns: this.columns = {},
        // columnCount: this.columnCount = COLUMNS_COUNT,
        // cells: this.cells = {},
        styles: this.styles = [],
        scripts: this.scripts = {},
        images: this.images = {},
        namedAreas: this.namedAreas = [],
        cellWidth: this.cellWidth = CELL_WIDTH,
        cellHeight: this.cellHeight = CELL_HEIGHT,
      } = JSONStringParse);
      return;
    }
    // this.template = template;
    this.version = version;
    this.editAccess = editAccess;
    this.methodName = methodName;
    this.sheetsList = sheetsList;
    this.sheets = sheets;
    // this.rows = rows;
    // this.rowCount = rowCount;
    // this.columns = columns;
    // this.columnCount = columnCount;
    // this.cells = cells;
    this.styles = styles;
    this.scripts = scripts;
    this.images = images;
    this.namedAreas = namedAreas;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  BaseClass = this.constructor;

  parseFormula = new FormulaParser({
    functionsNeedContext: {
      SUMGROUP: (context, column, row) => {
        const { sheet } = context.position;
        const cellNameRange = `${Address.columnNumberToName(column.value)}${row.value}`.toLowerCase();
        const cellKeys = this.getCellKeysInLevel(sheet, cellNameRange, this.getCell(sheet, cellNameRange).level || 1); // добавить в формулу уровень группировки?
        let result = 0;
        cellKeys.forEach((cellKey) => {
          result += this.getCellValue(sheet, cellKey.toLowerCase());
        });
        return result;
      },
    },
    functions: {
      OBJECTPROPERTY: (cellName, propertyName) => { // переделать в ближайшем будущем
        const cellNameSource = cellName.value.toLowerCase();
        const { type, value } = this.cells[cellNameSource];
        const property = `{${propertyName.value.toLowerCase()}}`;
        const result = getRepresentationAtStore(type.split('.')[1], value, property);
        return result;
      },
    },
    onCell: ({ sheet, row, col }) => this.getCellValue(sheet, `${getColumnNameForNumber(col)}${row}`),
    onRange: (ref) => {
      // console.log(ref);
      const arr = [];
      for (let { row } = ref.from; row <= ref.to.row; row += 1) {
        const innerArr = [];
        if (this.getRow(ref.sheet, [row - 1])) {
          for (let { col } = ref.from; col <= ref.to.col; col += 1) {
            const cellNameRange = `${Address.columnNumberToName(col)}${row}`.toLowerCase();
            innerArr.push(this.getCellValue(ref.sheet, cellNameRange));
          }
        }
        arr.push(innerArr);
      }
      // console.log(arr);
      return arr;
    },
  });

  // editAccess = undefined;

  // actionCell(sheet = 'sheet1', cellName) {
  //   // console.log('before get script');
  //   const scripts = this.getCellScripts(cellName, sheet);
  //   // console.log('script', scripts);
  //   if (!scripts) return;
  //   // console.log('before execute');
  //   if (Object.keys(scripts).includes(CELL_ATTRIBUTES.ACTION)) this.executeAction(cellName);
  //   // console.log('before parameter');
  //   const formula = this.getCellParameter(sheet, cellName, 'formula');
  //   // console.log('before calculate');
  //   if (formula) this.calculateCellValue(cellName);
  // }

  addArea(sheet, cellName, areaName, shiftType = SHIFT_TYPE.VERTICAL) { // надо удалить используется только в скрипте для добавления строки
    // const flagValid = false;
    console.log(cellName, areaName, shiftType);
    const area = this.documentTemplate.getNamedArea(areaName).getAreaCopy(); // getAreaCopy() убрать
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    const cellColumnNumber = (shiftType === SHIFT_TYPE.VERTICAL) ? 1 : getColumnNumberForName(cellColumn);
    const cellRowNumber = (shiftType === SHIFT_TYPE.HORIZONTAL) ? 1 : cellRow;
    // try {
    console.log(sheet, cellColumnNumber, cellRowNumber, area, shiftType);
    this.insertArea(sheet, cellColumnNumber, cellRowNumber, area, shiftType);
    // } catch (err) {
    //   console.log(err.getMessagesText());
    // }
    this.recalculateFormulas();
  }

  calculateCellValue(sheet = 'sheet1', cellName) {
    const cellFormula = this.getCellParameter(sheet, cellName, CELL_ATTRIBUTES.FORMULA).slice(1);
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    const context = { row: cellRow, column: getColumnNumberForName(cellColumn), sheet };
    let result = null;
    // console.log(cellName, ...Object.entries(context));
    // if (cellFormula.includes('SUM(')) result = this.parseFormula.parse(`${cellFormula}`);
    // console.log(`cell name: ${cellName}`, `formula: ${cellFormula}`);
    // else
    result = this.parseFormula.parse(cellFormula, context);
    // if (cellFormula.includes('SUM(')) console.log(context.sheet, cellFormula, result);
    this.setCellValue(sheet, cellName, result);
    return result || 0;
  }

  // getFormula(cellFormula, cellName) {
  //   const cellNameRange = cellFormula.split('(')[1].slice(0, -1);
  //   const cellKeys = this.getCellKeysInLevel(cellNameRange, this.getCell(cellName).level || 1);
  //   if (cellKeys.includes(cellName)) return NaN;
  //   const formula = cellKeys.join('+').toLowerCase();
  //   return formula;
  // }

  // calculateSum(range, currentCellName) {
  //   // console.log('calculate function ', currentCellName);
  //   const cellKeys = this.getCellsInRange(range, RETURN_FORMAT.KEYS);
  //   const formula = new Formulas(cellKeys.map((cellKey) => `$${cellKey}`).join(' + '), currentCellName);
  //   if (formula.hasOperandsInclude(currentCellName)) return NaN;
  //   return eval(formula.getFormulaForCalculation()); // eslint-disable-line no-eval
  // }

  // calculateSumGroup(range, currentCellName) {
  //   const cellKeys = this.getCellKeysInLevel(range, this.getCell(currentCellName).level || 1);
  //   const formula = new Formulas(cellKeys.map((cellKey) => `$${cellKey}`).join(' + '), currentCellName);
  //   if (formula.hasOperandsInclude(currentCellName)) return NaN;
  //   return eval(formula.getFormulaForCalculation()); // eslint-disable-line no-eval
  //   // console.log(cells);
  //   // console.log(range);
  //   // console.log(currentCellName);
  // }

  // deleteArea(sheet, cellName, shiftType = null) {
  //   // const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
  //   // this.deleteRange(range, sheet);
  //   const range = this.getRangeByCellName(sheet, cellName);

  //   if (shiftType && [RANGE_TYPE.CELL, RANGE_TYPE.RANGE].includes(rangeType)) return; // if delete only data at not shift

  //   if (shiftType === RANGE_TYPE.ROW) range = cellRow;
  //   if (shiftType === RANGE_TYPE.COLUMN) range = cellColumn;
  // }

  deleteArea(sheet, range, shiftType = null) {
    console.log(range, shiftType, sheet);
    console.log(this.columnCount);
    const rangeType = getRangeType(range);
    this.deleteRange(`${sheet}!${range}`);

    if (shiftType && [RANGE_TYPE.CELL, RANGE_TYPE.RANGE].includes(rangeType)) return; // if delete only data at not shift

    const [rangeFrom, rangeTo] = getRangeSplit(range);
    const rangeShiftFrom = getRangeShift(rangeTo, shiftType, 1);
    const rangeShiftArea = this.getRangeToEdge(`${sheet}!${rangeShiftFrom}`);
    const areaShift = this.getAreaForRange(`${sheet}!${rangeShiftArea}`);
    const shiftArea = {
      [SHIFT_TYPE.VERTICAL]: () => {
        this.deleteRange(`${sheet}!${rangeShiftArea}`, DELETE_MODE.ROW);
        this.insertArea(sheet, 1, +rangeFrom, areaShift);
      },
      // [SHIFT_TYPE.HORIZONTAL]: () => {
      //   this.deleteRange(rangeShiftArea, sheet, DELETE_MODE.COLUMN);
      //   this.insertArea(sheet, getColumnNumberForName(rangeFrom), 1, areaShift);
      // },
      null: () => {},
    };
    shiftArea[shiftType]();
  }

  deleteRange(rangeFrom, deleteMode = null) {
    const [sheet] = rangeFrom.split('!');
    const cellsInRange = this.getCellsInRange(rangeFrom, RETURN_FORMAT.KEYS);
    const cells = Object.entries(this.sheets[sheet].cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRange.includes(cellName));
    });
    this.sheets[sheet].cells = { ...Object.fromEntries(cells) };

    const namedAreasInRange = this.getListNamedAreasForRange(rangeFrom);
    const namedAreas = this.namedAreas.filter((namedArea) => {
      const condition = namedAreasInRange
        .findIndex((item) => item.name === namedArea.name && item.range === namedArea.range);
      return (condition === -1);
    });
    this.namedAreas = [...namedAreas];

    if (deleteMode === DELETE_MODE.ROW) {
      const rowKeys = this.getRowKeysInRange(rangeFrom);
      const rows = Object.entries(this.sheets[sheet].rows).filter((row) => {
        const [rowName] = row;
        return (!rowKeys.includes(+rowName));
      });
      this.sheets[sheet].rows = { ...Object.fromEntries(rows) };
    }

    if (deleteMode === DELETE_MODE.COLUMN) {
      const columnKeys = this.getColumnKeysInRange(rangeFrom);
      const columns = Object.entries(this.sheets[sheet].columns).filter((column) => {
        const [columnName] = column;
        return (!columnKeys.includes(columnName));
      });
      this.sheets[sheet].columns = { ...Object.fromEntries(columns) };
    }
  }

  deserialize(data) {
    const documentData = getObjectOfJSON(data);
    // this.editAccess = this.documentTemplate.editAccess;
    this.sheetsList = this.documentTemplate.sheetsList;
    this.sheets = {};
    this.sheetsList.forEach((sheet) => {
      this.sheets[sheet.name] = {
        editAccess: this.documentTemplate.sheets[sheet.name].editAccess,
        columns: {},
        rows: {},
        cells: {},
      };
    });
    this.scripts = this.documentTemplate.scripts;

    const deserializeError = [];
    this.documentSettings.forEach((setting) => {
      const [sectionKey, sectionValue] = Object.entries(setting)[0];
      // console.log(sectionValue);
      if (Object.keys(sectionValue).includes('nested')) return;
      // console.log(documentData[sectionKey]);
      let sectionData = documentData[sectionKey];
      // let sectionData = documentData
      //   .find((item) => Object.keys(item).includes(sectionKey))[sectionKey];
      if (!Array.isArray(sectionData)) sectionData = [sectionData];
      sectionData.forEach((sectionDataItem) => {
        // try {
        // console.log(sectionKey, sectionDataItem);
        this.deserializeArea(sectionKey, sectionDataItem);
        // } catch (err) {
        //   if (err instanceof TableDocumentGeneralError) throw err;
        //   deserializeError.push(...err);
        // }
      });
    });
    if (deserializeError.length) {
      throw new TableDocumentDeserializeError('deserialize', deserializeError);
    }
  }

  deserializeArea(sectionKey, sectionDataItem) {
    const sectionValue = this.getSectionSettings(sectionKey);
    // console.log(sectionValue);
    const insertMethods = {
      put: (areaInsert, areaSheet) => { this.putArea(areaInsert, areaSheet); },
      join: (areaInsert, areaSheet) => { this.joinArea(areaInsert, areaSheet); },
    };
    if (Array.isArray(sectionDataItem)) {
      sectionDataItem.forEach((item) => {
        this.deserializeArea(sectionKey, item);
      });
      return;
    }
    let area = null;
    // console.log(sectionValue.templateSectionName, sectionValue.sheet);
    area = this.documentTemplate
      .getNamedArea(sectionValue.templateSectionName, sectionValue.sheet)
      .getAreaCopy();
    try {
      area.fillArea(sectionDataItem, sectionValue.parameters, sectionValue.sheet);
      // console.log(area);
    } finally {
      // console.log(area, sectionValue.sheet);
      insertMethods[sectionValue.methodName](area, sectionValue.sheet);
    }
    const { nestedData } = sectionValue;
    if (!nestedData) return;
    nestedData.forEach((nestedDataKey) => {
      // console.log(nestedDataKey);
      // console.log(sectionDataItem);
      if (!Object.keys(sectionDataItem).includes(nestedDataKey)) return;
      this.deserializeArea(nestedDataKey, sectionDataItem[nestedDataKey]);
    });
  }

  editingCell(sheet, cellName, cellValue) {
    this.setCellValue(sheet, cellName, cellValue);
    this.recalculateFormulas();
  }

  executeCellAction(sheet = 'sheet1', cellName) {
    const action = this.getCellAction(sheet, cellName);
    console.log(sheet);
    const scriptBody = this.getScriptBody(action);
    if (!scriptBody) return;
    console.log(scriptBody);
    const actionFunction = eval(scriptBody); // eslint-disable-line no-eval
    actionFunction(sheet, cellName);
  }

  // executeAction(cellName, sheet = 'sheet1') {
  //   const scripts = this.getCellParameter(sheet, cellName, CELL_ATTRIBUTES.SCRIPTS);
  //   if (!(scripts && Object.keys(scripts).includes('action'))) return;

  //   const action = this.getScripts(scripts.action);
  //   const { script } = action;
  //   const actionFunction = eval(script); // eslint-disable-line no-eval

  //   actionFunction(cellName);
  //   this.recalculateFormulas();
  // }

  fillArea(data, parameters, sheet = 'sheet1') { // Заполнить параметры в области setParametersArea()
    // объеденить с методом getAreaCopy(), и удалить getAreaCopy
    const errorValidation = [];
    // console.log(data, parameters, sheet);
    if (!parameters) return;
    Object.entries(this.sheets[sheet].cells).forEach((cell) => {
      const [cellName, cellAttribute] = cell;
      const { parameter: cellParameter } = cellAttribute;
      if (!cellParameter) return;
      if (!Object.keys(parameters).includes(cellParameter)) return;
      const cellValue = data[parameters[cellParameter]];
      try {
        this.setCellValue(sheet, cellName, cellValue, cellParameter); // setCellValue()
      } catch (err) {
        errorValidation.push(err);
      }
    });
    if (errorValidation.length) throw errorValidation;
  }

  getAreaCopy() {
    const {
      sheets, styles, scripts, images, namedAreas,
    } = JSON.parse(JSON.stringify({
      sheets: this.sheets,
      // rows: this.rows,
      // columns: this.columns,
      // cells: this.cells,
      styles: this.styles,
      scripts: this.scripts,
      images: this.images,
      namedAreas: this.namedAreas,
    }));
    return new this.BaseClass({
      rangeType: this.rangeType,
      sheets,
      // rows,
      // rowCount: this.rowCount,
      // columns,
      // columnCount: this.columnCount,
      // cells,
      styles,
      scripts,
      images,
      namedAreas,
    });
  }

  getAreaForRange(areaRange) {
    const [sheet, range] = areaRange.split('!');
    const sheets = {
      [sheet]: {
        columns: {},
        rows: {},
        cells: {},
      },
    };
    // const rows = { [sheet]: {} };
    // const columns = { [sheet]: {} };
    // const cells = { [sheet]: {} };
    const styles = [];
    const namedAreas = [];
    const scripts = {};
    const images = {};
    // console.log(areaRange);
    const cellsInRange = this.getCellsInRange(areaRange);
    // console.log(range, sheet, cellsInRange);
    cellsInRange.forEach((cell) => {
      const [cellNameCurrent, cellValueCurrent] = cell;
      const cellNameShift = moveCell(cellNameCurrent, undefined, range);
      const { parthSymbol: cellColumnCurrent, parthDigit: cellRowCurrent } = getParseAtSymbolDigit(cellNameCurrent);
      const { parthSymbol: cellColumnShift, parthDigit: cellRowShift } = getParseAtSymbolDigit(cellNameShift);

      sheets[sheet].cells[cellNameShift] = {
        ...this.sheets[sheet].cells[cellNameCurrent],
        cellNameTemplate: cellNameCurrent,
      };
      sheets[sheet].columns[cellColumnShift] = this.sheets[sheet].columns[cellColumnCurrent];
      // console.log(this.rows[sheet][cellRowCurrent]);
      sheets[sheet].rows[cellRowShift] = this.sheets[sheet].rows[cellRowCurrent];

      const cellStyles = this.getCellStyles(`${sheet}|${cellNameCurrent}`);
      if (cellStyles) styles.push(cellStyles);

      // if (Object.keys(cellValueCurrent).includes('scripts')) {
      //   const scriptList = cellValueCurrent.scripts;
      //   if (Object.keys(scriptList).includes('action')) {
      //     const actionName = scriptList.action;
      //     const script = Object.entries(this.scripts).find((scriptItem) => scriptItem[0] === actionName);
      //     if (script) {
      //       scripts[actionName] = this.scripts[actionName];
      //     }
      //   }
      // }

      if (Object.keys(cellValueCurrent).includes('image')) {
        // console.log(this.images);
        const imageName = cellValueCurrent.image;
        const image = this.images[imageName];
        if (image) {
          images[imageName] = this.images[imageName];
        }
      }
    });
    // console.log(columns);
    const listNamedAreas = this.getListNamedAreasForRange(areaRange);
    listNamedAreas.forEach((namedArea) => {
      namedAreas.push({
        name: namedArea.name,
        // range: moveRange(namedArea.range.toLowerCase(), 1, range.toLowerCase()),
        range: moveRange(namedArea.range, 1, range),
      });
    });
    sheets[sheet].rowCount = Object.keys(sheets[sheet].rows).length;
    sheets[sheet].columnCount = Object.keys(sheets[sheet].columns).length;
    // console.log(sheets);
    return new this.BaseClass({
      methodName: (getRangeType(range) === 'row') ? 'put' : 'join', // ??????
      sheets,
      // rows,
      // rowCount: Object.keys(rows).length,
      // columns,
      // columnCount: Object.keys(columns).length,
      // cells,
      styles,
      scripts,
      images,
      namedAreas,
    });
  }

  getAreaHeight(sheet = 'sheet1') {
    const rows = [];
    Object.keys(this.sheets[sheet].rows).forEach((row) => rows.push(row));
    return Math.max(...rows);
  }

  // getAreaRange() {
  //   return `a1:${getColumnNameForNumber(this.getAreaWidth())}${this.getAreaHeight()}`;
  // }

  getAreaValue(sheet, parameters) {
    const parametersSet = new Map(Object.entries(parameters));
    const parametersValue = {};
    if (parametersSet.size === 0) {
      Object.values(this.sheets[sheet].cells).forEach((cellValue) => {
        if (cellValue.parameter) parametersValue[cellValue.parameter] = cellValue.value;
      });
      return parametersValue;
    }
    Object.values(this.sheets[sheet].cells).forEach((cellValue) => {
      if (Object.keys(cellValue).includes(CELL_ATTRIBUTES.PARAMETER)) {
        if (parametersSet.has(cellValue.parameter)) {
          parametersValue[parametersSet.get(cellValue.parameter)] = cellValue.value;
        }
      }
    });
    return parametersValue;
  }

  getAreaWidth(sheet = 'sheet1') {
    const columns = [];
    Object.keys(this.columns[sheet]).forEach((column) => columns.push(getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  getCell(sheet = 'sheet1', cellName) {
    if (!this.sheets[sheet].cells) return {};
    return this.sheets[sheet].cells[cellName] || {};
  }

  getCells(sheet = 'sheet1') {
    if (!this.sheets[sheet]) return {};
    return this.sheets[sheet].cells || {};
  }

  // getCellFormula(cellName, sheet = 'sheet1') {
  //   return this.cells[sheet][cellName]?.formula.slice(0) || null;
  // }

  getCellScripts(sheet = 'sheet1', cellName) {
    const { scripts } = this.getCell(sheet, cellName) || null;
    return scripts || null;
  }

  getCellAction(sheet = 'sheet1', cellName) {
    // console.log(this.getCellScripts(sheet, cellName));
    const { action } = this.getCellScripts(sheet, cellName) || {};
    return action || null;
  }

  getCellValue(sheet = 'sheet1', cellName) {
    return this.sheets[sheet].cells[cellName]?.value || null;
    // return this.cells[sheet][cellName]?.value || null;
  }

  getCellParameter(sheet = 'sheet1', cellName, cellParameter) { // разбить на получение каждого атрибута
    if (!this.sheets[sheet].cells[cellName]) return null;
    return this.sheets[sheet].cells[cellName][cellParameter] || null;
  }

  getCellStyles(cellName) {
    const cellStyle = this.styles.find((item) => item.name === cellName);
    if (!cellStyle) return null;
    return cellStyle;
  }

  getCellType(sheet = 'sheet1', cellName) {
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    return this.sheets[sheet].cells[cellName]?.type
      || this.getColumnType(sheet, cellColumn)
      || this.getRowType(sheet, cellRow)
      || 'string';
  }

  // getCellValueForFormula(cellName) { // ??? use in Formula class
  //   if (this.getCellParameter(cellName, CELL_ATTRIBUTES.FORMULA)) return this.calculateCellValue(cellName);
  //   const cellValue = this.getCellParameter(cellName, CELL_ATTRIBUTES.VALUE);
  //   return +cellValue || 0;
  // }

  getCellKeysInLevel(sheet = 'sheet1', range, level, rangeType = RANGE_TYPE.ROW) {
    // console.log(sheet, range, level);
    const cells = [];
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(range);
    if (rangeType === RANGE_TYPE.ROW) {
      // console.log(Object.keys(this.sheets[sheet].rows));
      for (let row = cellRow; row < Object.keys(this.sheets[sheet].rows).length + 1; row += 1) { // ??? непонятка с length
        // console.log(row, this.sheets[sheet].rows[row]);
        if (this.sheets[sheet].rows[row].level === level) cells.push(`${cellColumn}${row}`);
        if (this.sheets[sheet].rows[row].level < level) break;
      }
    }
    if (rangeType === RANGE_TYPE.COLUMN) {
      const columnNumber = getColumnNumberForName(cellColumn);
      for (let column = columnNumber - 1; column < Object.keys(this.sheets[sheet].columns).length; column += 1) {
        const columnName = getColumnNameForNumber(column);
        if (this.sheets[sheet].columns[columnName].level === level) cells.push(`${columnName}${cellRow}`);
        if (this.sheets[sheet].columns[columnName].level < level) break;
      }
    }
    return cells;
  }

  getCellsInRange(areaRange, returnFormat = RETURN_FORMAT.ENTRIES) {
    const [sheet] = areaRange.split('!');
    // console.log(areaRange);
    // console.log(sheet, upperRange);
    // const range = upperRange.toLowerCase();
    // console.log(areaRange);
    const rowKeys = this.getRowKeysInRange(areaRange);
    const columnKeys = this.getColumnKeysInRange(areaRange);
    // console.log(rowKeys, columnKeys);
    const cells = Object.entries(this.sheets[sheet].cells).filter((cell) => {
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

  getColumn(sheet = 'sheet1', columnName) {
    let columnNameText = columnName;
    if (+columnName) columnNameText = getColumnNameForNumber(columnName);
    return this.sheets[sheet].columns[columnNameText] || {};
  }

  getColumnKeysInRange(areaRange) {
    const [sheet, upperRange] = areaRange.split('!');
    const range = upperRange.toLowerCase();
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
        columnKeys.push(...Object.keys(this.sheets[sheet].columns));
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

  getColumnType(sheet = 'sheet1', columnName) {
    return this.getColumn(sheet, columnName).type || undefined;
  }

  getDocument(JSONFormat = false) {
    const cells = Object.entries(this.cells).filter((cell) => {
      const [, cellValue] = cell;
      // console.log(cellValue);
      return (!Object.keys(cellValue).includes('action'));
    });
    // console.log(Object.fromEntries(cells));
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

  /**
   * Get object, includes field for props component view
   * @param {String} sheet
   * @returns Object
   */
  getPropsForView(sheet) {
    if (!this.sheets[sheet]) return {};
    // console.log(sheet);
    return {
      columns: this.sheets[sheet].columns,
      columnCount: this.sheets[sheet].columnCount || 26,
      rows: this.sheets[sheet].rows,
      rowCount: this.sheets[sheet].rowCount || 100,
      cells: this.sheets[sheet].cells,
      styles: this.styles
        .filter((style) => style.name.split('|')[0] === sheet)
        .map((st) => {
          const item = {
            name: st.name.split('|')[1],
            list: st.list,
          };
          return item;
        }),
    };
  }

  getCellFormulas(sheetCurrent = null) { // переделать фильтры
    const cellFormulas = {};
    if (sheetCurrent) {
      // cellFormulas[sheet] = [];
      cellFormulas[sheetCurrent] = Object.keys(this.sheets[sheetCurrent].cells)
        .filter((cellName) => Object.keys(this.sheets[sheetCurrent].cells[cellName])
          .includes(CELL_ATTRIBUTES.FORMULA));
      return cellFormulas;
    }
    this.sheetsList.forEach((sheet) => {
      const { name: sheetName } = sheet;
      cellFormulas[sheetName] = [];
      const cellFormulasSheet = Object.keys(this.sheets[sheetName].cells)
        .filter((cellName) => Object.keys(this.sheets[sheetName].cells[cellName])
          .includes(CELL_ATTRIBUTES.FORMULA));
      // console.log(cellFormulasSheet);
      cellFormulasSheet.forEach((cell) => cellFormulas[sheetName].push(cell));
    });
    // console.log(cellFormulas);
    return cellFormulas;
  }

  getFormularsCellsSet() {
    let formulasCellsSet = [];
    this.sheetsList.forEach((sheet) => {
      const { name: sheetName } = sheet;
      formulasCellsSet = [
        ...formulasCellsSet,
        ...Object.keys(this.sheets[sheetName].cells)
          .filter((cellName) => Object.keys(this.sheets[sheetName].cells[cellName]).includes(CELL_ATTRIBUTES.FORMULA)),
      ];
    });
    // console.log(formulasCellsSet);
    // const formulasCellsSet = Object.keys(this.cells[sheet])
    //   .filter((cellName) => Object.keys(this.cells[sheet][cellName]).includes(CELL_ATTRIBUTES.FORMULA));
    return formulasCellsSet;
  }

  getLastColumn(sheet = 'sheet1') {
    const columns = [0];
    if (!this.sheets[sheet]?.columns) return 0;
    Object.keys(this.sheets[sheet].columns).forEach((column) => columns.push(+getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  getLastColumnInRow(sheet = 'sheet1', rowName) {
    const columns = [0];
    // console.log(sheet, rowName);
    const cellsInRow = this.getCellsInRange(`${sheet}!${rowName}:${rowName}`, RETURN_FORMAT.KEYS);
    cellsInRow.forEach((cellKey) => {
      const { parthSymbol: cellColumn } = getParseAtSymbolDigit(cellKey);
      columns.push(+getColumnNumberForName(cellColumn));
    });
    return Math.max(...columns);
  }

  getLastRow(sheet = 'sheet1') {
    // console.log(sheet);
    const rows = [0];
    if (!this.sheets[sheet]?.rows) return 0;
    // const rowsSearch = (sheet) ? Object.keys(this.rows[sheet]) : Object.keys(this.rows);
    // console.log(rowsSearch);
    Object.keys(this.sheets[sheet].rows).forEach((row) => rows.push(+row));
    return Math.max(...rows);
  }

  getListNamedAreasForRange(areaRange) {
    const [sheet, upperRange] = areaRange.split('!');
    const range = upperRange.toLowerCase();
    const namedAreas = [];
    const [rangeFrom, rangeTo] = getRangeSplit(range);
    let { parthSymbol: rangeFromColumn, parthDigit: rangeFromRow } = getParseAtSymbolDigit(rangeFrom);
    if (rangeFromColumn === '') rangeFromColumn = 'a';
    if (rangeFromRow === '') rangeFromRow = 1;
    let {
      parthSymbol: rangeToColumn,
      parthDigit: rangeToRow,
    } = getParseAtSymbolDigit(rangeTo);
    if (rangeToColumn === '') rangeToColumn = getColumnNameForNumber(this.getLastColumn(sheet));
    if (rangeToRow === '') rangeToRow = this.getLastRow(sheet);
    const rangeTypes = {
      [RANGE_TYPE.ROW]: (from, to) => (from >= rangeFromRow && to <= rangeToRow),
      [RANGE_TYPE.COLUMN]: (from, to) => (from >= getColumnNumberForName(rangeFromColumn)
        && to <= getColumnNumberForName(rangeToColumn)),
    };
    // console.log(`${sheet}!${upperRange}`);
    this.namedAreas.forEach((item) => {
      // console.log(item);
      const [itemSheet, itemRange] = item.range.split('!');
      // console.log(item);
      const rangeTypeItem = getRangeType(itemRange);
      let [namedAreaRangeFrom, namedAreaRangeTo] = getRangeSplit(itemRange);

      if (rangeTypeItem === RANGE_TYPE.COLUMN) {
        namedAreaRangeFrom = getColumnNumberForName(namedAreaRangeFrom);
        namedAreaRangeTo = getColumnNumberForName(namedAreaRangeTo);
      }
      if (rangeTypes[rangeTypeItem](namedAreaRangeFrom, namedAreaRangeTo)
        && itemSheet === sheet) namedAreas.push(item);
    });
    // this.namedAreas.forEach((item) => {
    //   console.log(item);
    //   const [, itemRange] = item.range.split('!');
    //   // console.log(item);
    //   const rangeTypeItem = getRangeType(itemRange);
    //   let [namedAreaRangeFrom, namedAreaRangeTo] = getRangeSplit(itemRange);

    //   if (rangeTypeItem === RANGE_TYPE.COLUMN) {
    //     namedAreaRangeFrom = getColumnNumberForName(namedAreaRangeFrom);
    //     namedAreaRangeTo = getColumnNumberForName(namedAreaRangeTo);
    //   }
    //   if (rangeTypes[rangeTypeItem](namedAreaRangeFrom, namedAreaRangeTo)) namedAreas.push(item);
    // });
    // console.log(namedAreas);
    return namedAreas;
  }

  getNamedArea(areaName) {
    const namedAreas = [];
    const range = this.getRangeByAreaName(areaName);
    // console.log(range);
    range.forEach((rangeItem) => {
      // console.log(rangeItem);
      namedAreas.push(this.getAreaForRange(rangeItem));
    });
    // console.log(namedAreas);
    if (namedAreas.length === 1) return namedAreas[0];
    return namedAreas;
  }

  getNamedAreas() {
    return this.namedAreas;
  }

  // getPreviousRow(rowName) {
  //   const previousRow = +rowName - 1;
  //   return this.rows[previousRow] || {};
  // }

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
        // console.log(namedArea.range);
        range.push(
          namedArea.range || null,
        );
      });
    }
    return range;
  }

  // getRangeByCellName(sheet, cellName, rangeType = RANGE_TYPE.ROW) { // ??????
  //   const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
  //   let result = null;
  //   if (rangeType === RANGE_TYPE.ROW) result = `${cellRow}:${this.getLastRow(sheet)}`;
  //   if (rangeType === RANGE_TYPE.COLUMN) result = `${cellColumn}:${this.getLastColumn(sheet)}`;
  //   return result;
  // }

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

  getRangeToEdge(range) {
    const [sheet, rangeFrom] = range.split('!');
    const rangeType = getRangeType(rangeFrom);
    const rangeEdge = {
      [RANGE_TYPE.CELL]: () => `${rangeFrom}:${getColumnNameForNumber(this.getLastColumn(sheet))}${this.getLastRow(sheet)}`,
      [RANGE_TYPE.ROW]: () => `${rangeFrom}:${this.getLastRow(sheet)}`,
      [RANGE_TYPE.COLUMN]: () => `${rangeFrom}:${getColumnNameForNumber(this.getLastColumn(sheet))}`,
    };
    return rangeEdge[rangeType]();
  }

  getRow(sheet = 'sheet1', rowName) {
    // console.log(sheet);
    // if (sheet) return this.rows[sheet][rowName] || {};
    return this.sheets[sheet].rows[rowName] || {};
  }

  getRowType(sheet = 'sheet1', rowName) {
    return this.getRow(sheet, rowName).type || undefined;
  }

  getRowKeysInRange(areaRange) {
    // console.log(areaRange);
    const [sheet, upperRange] = areaRange.split('!');
    const range = upperRange.toLowerCase();
    const type = getRangeType(range);
    const rowKeys = [];
    const rowSet = {
      [RANGE_TYPE.CELL]: () => {
        const { parthDigit: rowKey } = getParseAtSymbolDigit(range);
        rowKeys.push(+rowKey);
        return rowKeys;
      },
      [RANGE_TYPE.COLUMN]: () => {
        Object.keys(this.sheets[sheet].rows).forEach((row) => rowKeys.push(+row));
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

  getSectionSettings(sectionName) {
    const sectionSettings = this.documentSettings
      .find((setting) => Object.keys(setting).includes(sectionName));
    return Object.values(sectionSettings)[0];
  }

  getScriptBody(scriptName) {
    return this.scripts[scriptName]?.script || null;
  }
  // getScripts(scriptName) {
  //   const script = this.scripts[scriptName];
  //   if (script) return script;
  //   return null;
  // }

  getStyles() {
    return this.styles;
  }

  hasEditing(sheet, cellName) {
    return this.hasEditingSheet(sheet, cellName);
  }

  hasEditingCell(sheet, cellName) {
    const isEditAccessSheet = this.sheets[sheet].editAccess || EDIT_ACCESS.OPEN;
    let isEditAccessCell;
    if (Object.keys(this.sheets[sheet].cells).includes(cellName)) {
      isEditAccessCell = this.sheets[sheet].cells[cellName].isEditable;
    }
    // console.log(isEditAccessSheet, isEditAccessCell);
    // console.log(isEditCell);
    if (isEditAccessSheet === EDIT_ACCESS.CLOSED_EXCEPT_OPEN && isEditAccessCell === true) return true;
    if (isEditAccessSheet === EDIT_ACCESS.OPEN && isEditAccessCell !== false) return true;
    if (!isEditAccessSheet && isEditAccessCell === false) return false;
    return false;
  }

  hasEditingSheet(sheet, cellName) {
    console.log(this.sheets[sheet].editAccess, sheet);
    if (this.sheets[sheet].editAccess === EDIT_ACCESS.CLOSED) return false;
    return this.hasEditingCell(sheet, cellName);
  }

  hasNamedArea(namedArea) {
    let rezult = false;
    const foundNamedArea = this.namedAreas
      .find((item) => (item.name === namedArea.name && item.range === namedArea.range));
    if (foundNamedArea) rezult = true;
    return rezult;
  }

  insertArea(sheet = 'sheet1', numberColumn, numberRow, area, shiftType = null) {
    const namedAreas = [];
    const {
      // cells: insertCells,
      // styles: insertStyles,
      // scripts: areaScripts,
      images: areaImages,
      // namedAreas: insertNamedAreas,
    } = area;
    // console.log(area);
    let rangeShift = null;
    let areaShift = null;

    const shiftInsert = {
      [SHIFT_TYPE.HORIZONTAL]: () => {
        const numberColumnShift = numberColumn + area.getAreaWidth(sheet);
        this.insertArea(sheet, numberColumnShift, numberRow, areaShift);
      },
      [SHIFT_TYPE.VERTICAL]: () => {
        const numberRowShift = numberRow + area.getAreaHeight(sheet);
        this.insertArea(sheet, numberColumn, numberRowShift, areaShift);
      },
      null: () => {},
    };

    if (shiftType) {
      const rangeFrom = `${sheet}!${getColumnNameForNumber(numberColumn)}${numberRow}`;
      console.log(rangeFrom);
      rangeShift = this.getRangeToEdge(`${rangeFrom}`);
      console.log(rangeShift);
      areaShift = this.getAreaForRange(`${sheet}!${rangeShift}`);
      console.log(areaShift);
      this.deleteRange(`${sheet}!${rangeShift}`);
    }
    // console.log(Object.entries(area.getCells(sheet)));
    Object.entries(area.getCells(sheet)).forEach((cell) => {
      const [currentCellName] = cell;
      const shiftCellName = moveCell(currentCellName, `${getColumnNameForNumber(numberColumn)}${numberRow}`);
      const { parthSymbol: currentColumn, parthDigit: currentRow } = getParseAtSymbolDigit(currentCellName);
      const { parthSymbol: shiftColumn, parthDigit: shiftRow } = getParseAtSymbolDigit(shiftCellName);

      this.setColumn(sheet, shiftColumn, area.getColumn(sheet, currentColumn));
      // console.log(area.getRow(currentRow));
      this.setRow(sheet, shiftRow, area.getRow(sheet, currentRow));

      const cellValue = area.getCell(sheet, currentCellName);
      if (Object.keys(cellValue).includes('formula')) {
        cellValue.formula = moveFormula(cellValue.formula, shiftCellName, cellValue.cellNameTemplate);
      }

      this.setCell(
        sheet,
        shiftCellName,
        {
          ...cellValue,
          columnName: shiftColumn,
          rowName: shiftRow,
        },
      );
    });
    this.updateStyles(area.getStyles());
    // console.log(area.getNamedAreas());
    this.updateNamedArea(area.getNamedAreas(), numberRow, numberColumn);

    // this.scripts = { ...this.scripts, ...areaScripts };
    this.images = { ...this.images, ...areaImages };
    this.namedAreas = [...this.namedAreas, ...namedAreas];
    this.sheets[sheet].rowCount = this.getLastRow(sheet);
    this.sheets[sheet].columnCount = this.getLastColumn(sheet);

    shiftInsert[shiftType]();
  }

  setCell(sheet = 'sheet1', cellName, cellValue) {
    // const shiftFormula = {};
    // if (Object.keys(cellValue).includes('formula')
    //   && !cellValue.formula.includes('SUM')) {
    //   const formula = new Formulas(cellValue.formula, cellName);
    //   shiftFormula.formula = formula.moveFormula(cellName, cellValue.cellNameTemplate);
    //   // console.log(formula);
    // }
    // console.log(sheet, cellName, cellValue);
    this.sheets[sheet].cells = { ...this.sheets[sheet].cells, [cellName]: cellValue };
  }

  // moveFormula(cellName, cellValue) {

  // }

  setCellValue(sheet = 'sheet1', cellName, cellValue, cellParameter = '', isErrorStop = false) {
    // console.log(sheet, cellName, cellValue);
    const cellProperty = this.getCell(sheet, cellName);
    // console.log(cellProperty);
    try {
      this.validateCellValue(cellName, { ...cellProperty, value: cellValue }, cellParameter, sheet);
      cellProperty.value = cellValue;
    } finally {
      if (!isErrorStop) this.setCell(sheet, cellName, cellProperty);
    }
  }

  // setColumn(columnName, columnValue) {
  //   let columnNameText = columnName;
  //   if (+columnName) columnNameText = getColumnNameForNumber(columnName);
  //   this.columns = { ...this.columns, [columnNameText]: columnValue };
  // }
  setColumn(sheet = 'sheet1', columnName, columnValue) {
    // console.log(this.sheets, sheet);
    let columnNameText = columnName;
    if (+columnName) columnNameText = getColumnNameForNumber(columnName);
    this.sheets[sheet].columns = { ...this.sheets[sheet].columns, [columnNameText]: columnValue };
    this.setColumnGroup(sheet, columnValue.level || 0, columnNameText);
  }

  setColumnGroup(sheet, level, columnName) {
    const columnNameNumber = getColumnNumberForName(columnName);
    const previousColumn = this.getColumn(sheet, +columnNameNumber - 1);
    const levelGroupPreviousColumn = previousColumn.level || 0;
    const levelGroupAddingColumn = level;
    if (levelGroupAddingColumn > levelGroupPreviousColumn + 1) {
      throw new TableDocumentGeneralError(
        'setRowGroup',
        'Уровень добавляемой области превышает уровень активной группировки',
      );
    }
    if (levelGroupAddingColumn === levelGroupPreviousColumn + 1) previousColumn.isGroup = true;
  }

  updateNamedArea(namedAreasArea, numberRow, numberColumn) {
    // console.log(numberRow, numberColumn);
    const moveRangeDirection = {
      [RANGE_TYPE.ROW]: (range, numRow) => moveRange(range, numRow),
      [RANGE_TYPE.COLUMN]: (range, numCol) => moveRange(range, numCol),
    };
    // console.log(namedAreasArea);
    namedAreasArea.forEach((namedAreaItem) => {
      // console.log(namedAreaItem);
      const [, range] = namedAreaItem.range.split('!');
      const rangeType = getRangeType(range);
      const namedArea = {
        name: namedAreaItem.name,
        range: `${moveRangeDirection[rangeType](
          namedAreaItem.range,
          (rangeType === RANGE_TYPE.ROW) ? numberRow : numberColumn,
        )}`,
      };
      // console.log(moveRangeDirection[rangeType](
      //   namedAreaItem.range,
      //   (rangeType === RANGE_TYPE.ROW) ? numberRow : numberColumn,
      // ));
      if (!this.hasNamedArea(namedArea)) this.namedAreas.push(namedArea);
    });
  }

  setRow(sheet = 'sheet1', rowName, rowValue) {
    // if (flagValid)

    this.sheets[sheet].rows = { ...this.sheets[sheet].rows, [rowName]: rowValue };
    this.setRowGroup(sheet, rowValue.level || 0, rowName);
    // console.log(this.rows);
  }

  setRowGroup(sheet, level, rowName) {
    const previousRow = this.getRow(sheet, +rowName - 1);
    const levelGroupPreviousRow = previousRow.level || 0;
    const levelGroupAddingRow = level;
    if (levelGroupAddingRow > levelGroupPreviousRow + 1) {
      // console.log('error');
      throw new TableDocumentGeneralError(
        'setRowGroup',
        'Уровень добавляемой области превышает уровень активной группировки',
      );
    }
    if (levelGroupAddingRow === levelGroupPreviousRow + 1) previousRow.isGroup = true;
  }

  updateStyles(stylesArea) {
    stylesArea.forEach((styleItem) => {
      const styles = this.styles.find((style) => style.name === styleItem.name);
      if (!styles) this.styles.push(styleItem);
    });
  }

  joinArea(area, sheet = 'sheet1') {
    const numberLastRow = this.getLastRow(sheet);
    const numberNewColumn = this.getLastColumnInRow(sheet, numberLastRow) + 1;
    this.insertArea(sheet, numberNewColumn, numberLastRow, area);
  }

  putArea(area, sheet = 'sheet1') {
    // console.log(sheet);
    const numberNewRow = this.getLastRow(sheet) + 1;
    // console.log(numberNewRow);
    this.insertArea(sheet, 1, numberNewRow, area);
  }

  // recalculateFormulas() {
  //   const formulasCellsSet = this.getFormularsCellsSet();
  //   console.log('after get all formulars');
  //   formulasCellsSet.map((cellName) => this.calculateCellValue(cellName));
  //   console.log('after calculate formulars');
  // }
  recalculateFormulas(sheet = null) {
    const cellFormulas = this.getCellFormulas(sheet);
    // console.log('after get all formulars');
    Object.keys(cellFormulas).forEach((sheetName) => {
      cellFormulas[sheetName].forEach((cellName) => {
        this.calculateCellValue(sheetName, cellName);
      });
    });
    // cellFormulasMap.forEach((cellName, sheetName) => {
    //   console.log(sheetName, cellName);
    //   this.calculateCellValue(sheetName, cellName);
    // });
    // formulasCellsSet.map((cellName) => this.calculateCellValue(cellName));
    // console.log('after calculate formulars');
  }

  serializationDataSection(nameDataSection, settings) {
    if (!nameDataSection) {
      const result = [];
      // console.log(this.documentSettings);
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
    // console.log(keyValue);
    const areaValue = areas.getAreaValue(keyValue.sheet, keyValue.parameters || {});
    // console.log(areaValue);
    if (keyValue.nestedData) {
      keyValue.nestedData.forEach((nestedSection) => {
        areaValue[nestedSection] = this.serializationDataSection(nestedSection, settings);
      });
    }
    return (keyValue.presentationType === 'unit') ? { ...areaValue } : [{ ...areaValue }];
  }

  setTableDocumentTemplate(template) {
    let templateParse = null;
    try {
      templateParse = getObjectOfJSON(template);
    } catch (err) {
      throw new TableDocumentGeneralError(
        'setTableDocumentTemplate',
        'Ошибка парсинга шаблона',
      );
    }
    const { type, version } = templateParse;
    if (!type || type !== 'template') {
      throw new TableDocumentGeneralError(
        'setTableDocumentTemplate',
        'Неверный формат файла "Шаблон"',
      );
    }
    this.version = version;
    this.documentTemplate = new this.BaseClass(templateParse);
  }

  setTableDocumentSettings(settings) {
    let settingsParse = null;
    try {
      settingsParse = getObjectOfJSON(settings);
    } catch (err) {
      throw new TableDocumentGeneralError(
        'setTableDocumentSettings',
        'Ошибка парсинга опций документа',
      );
    }
    const { type, version, data } = settingsParse;
    if (!type || type !== 'settings') {
      throw new TableDocumentGeneralError(
        'setTableDocumentTemplate',
        'Неверный формат файла "Опции"',
      );
    }
    if (this.version !== version) {
      throw new TableDocumentGeneralError(
        'setTableDocumentTemplate',
        `Неподдерживаемая версия формата: \n Версия шаблона: ${this.version} \n Версия опций: ${version}`,
      );
    }
    this.documentSettings = data;
  }

  validateCellValue(cellName, cellValue, cellParameter, sheet) {
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    const { type: cellType, value: checkValue } = cellValue;
    const checkType = cellType
      || this.getRowType(sheet, cellRow)
      || this.getColumnType(sheet, cellColumn)
      || 'string';
    const validateType = validateCellValueType(checkValue, checkType);
    let validateCustom = true;
    const { scripts } = cellValue;
    if (scripts && Object.keys(scripts).includes('validate')) {
      const validateCellValueCustom = eval(scripts.validate); // eslint-disable-line no-eval
      validateCustom = validateCellValueCustom(checkValue);
    }
    if (validateType !== true || validateCustom !== true) {
      throw new TableDocumentValidationCellError(
        cellName,
        cellParameter,
        checkType,
        checkValue,
        [validateType, validateCustom],
      );
    }
  }
}

export default TableDocument;
