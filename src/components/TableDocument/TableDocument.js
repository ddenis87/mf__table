import FormulaParser, { Address } from 'fast-formula-parser';
import TableDocumentDeserializeError from './TableDocumentDeserializeError';
import TableDocumentGeneralError from './TableDocumentGeneralError';
import TableDocumentValidationCellError from './TableDocumentValidationCellError';

import {
  getObjectOfJSON,
  getRangeType,
  getRangeSplit,
  getRangeLength,
  getRangeShift,
  getRepresentationAtStore,
  moveCell,
  moveFormula,
  moveRange,
  validateCellValueType,
} from './TableDocumentHelpers';

import {
  getColumnNameForNumber,
  getColumnNumberForName,
  getParseAtSymbolDigit,
} from '../../helpers/spreadSheet';

import {
  CELL_ATTRIBUTES,
  DEFAULT_COLUMN_COUNT,
  DEFAULT_ROW_COUNT,
  DELETE_MODE,
  EDIT_ACCESS,
  RANGE_TYPE,
  RETURN_FORMAT,
  SHIFT_TYPE,
} from './TableDocumentConst';

/**
 * Класс реализующий методы работы с табличным документом
 * @module TableDocument
 */
class TableDocument {
  // constructor({
  //   version = null,
  //   methodName = null,
  //   sheets = {
  //     sheet1: {
  //       title: 'Лист 1',
  //       index: 0,
  //       editAccess: undefined,
  //       columns: {},
  //       columnCount: 26,
  //       rows: {},
  //       rowCount: 100,
  //       cells: {},
  //     },
  //   },
  //   styles = {},
  //   scripts = {},
  //   images = {},
  //   namedAreas = [],
  //   cellWidth = CELL_WIDTH,
  //   cellHeight = CELL_HEIGHT,
  //   JSONString = null,
  // } = {}) {
  //   if (JSONString) {
  //     const JSONStringParse = JSON.parse(JSONString);
  //     ({
  //       version: this.version = null,
  //       methodName: this.methodName = null,
  //       sheets: this.sheets = {},
  //       styles: this.styles = {},
  //       scripts: this.scripts = {},
  //       images: this.images = {},
  //       namedAreas: this.namedAreas = [],
  //       cellWidth: this.cellWidth = CELL_WIDTH,
  //       cellHeight: this.cellHeight = CELL_HEIGHT,
  //     } = JSONStringParse);

  //     this.BaseClass = this.constructor;
  //     this.overridingFormulaParser();
  //     return;
  //   }
  //   this.version = version;
  //   this.methodName = methodName;
  //   this.sheets = sheets;
  //   this.styles = styles;
  //   this.scripts = scripts;
  //   this.images = images;
  //   this.namedAreas = namedAreas;
  //   this.cellWidth = cellWidth;
  //   this.cellHeight = cellHeight;

  //   this.BaseClass = this.constructor;
  //   this.overridingFormulaParser();
  // }

  constructor(options = {}) {
    this.BaseClass = this.constructor;
    this.createDocument(options);
    this.overridingFormulaParser();
  }

  createDocument(options) {
    let args;
    ({
      images: this.images = {},
      namedAreas: this.namedAreas = [],
      scripts: this.scripts = {},
      sheets: this.sheets = {
        sheet1: {
          cells: {},
          columnCount: DEFAULT_COLUMN_COUNT,
          columns: {},
          editAccess: EDIT_ACCESS.OPEN,
          index: 0,
          rows: {},
          rowCount: DEFAULT_ROW_COUNT,
          title: 'Лист 1',
        },
      },
      styles: this.styles = {},
      version: this.version = '0.0.1',
      ...args
    } = options);
    if (!Object.keys(args).includes('JSONDocument')) return;
    this.createDocument(JSON.parse(args.JSONDocument));
  }

  /**
   * Добавление области в документ
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @param {String} areaName - имя области
   * @param {Enum} shiftType - тип сдвига докумета при вставки
   */
  addArea(sheet, cellName, areaName, shiftType = SHIFT_TYPE.VERTICAL) {
    // надо удалить используется только в скрипте для добавления строки
    const area = this.documentTemplate.getNamedArea(areaName).getAreaCopy(); // getAreaCopy() убрать
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    const cellColumnNumber = (shiftType === SHIFT_TYPE.VERTICAL)
      ? 1 : getColumnNumberForName(cellColumn);
    const cellRowNumber = (shiftType === SHIFT_TYPE.HORIZONTAL) ? 1 : cellRow;
    this.insertArea(sheet, cellColumnNumber, cellRowNumber, area, shiftType);
    this.recalculateFormulas();
  }

  /**
   * Расчет формулы ячейки
   * @param {String} sheet - лист
   * @param {String} cellName - имя ячейки
   * @returns {Number}
   */
  calculateCellValue(sheet = 'sheet1', cellName) {
    // console.time('calculateCellValue');
    const cell = this.getCell(sheet, cellName);
    const cellFormula = cell.formula.slice(1);
    const context = { row: cell.rowName, column: getColumnNumberForName(cell.columnName), sheet };
    let result = null;
    result = this.parseFormula.parse(cellFormula, context);
    this.setCellValue(sheet, cellName, result);
    // console.timeEnd('calculateCellValue');
    return result || 0;
  }

  /**
   * Удаление области в документе
   * @param {String} sheet - лист
   * @param {String} range - диапазон
   * @param {Enum} shiftType - направление сдвига документа
   * @returns
   */
  deleteArea(sheet, range, shiftType = null) {
    const rangeType = getRangeType(range);
    this.deleteRange(`${sheet}!${range}`);

    // if delete only data at not shift
    if (shiftType && [RANGE_TYPE.CELL, RANGE_TYPE.RANGE].includes(rangeType)) return;

    const [rangeFrom, rangeTo] = getRangeSplit(range);
    const rangeShiftFrom = getRangeShift(rangeTo, shiftType, 1);
    const rangeShiftArea = this.getRangeToEdge(`${sheet}!${rangeShiftFrom}`);
    const areaShift = this.getAreaForRange(`${sheet}!${rangeShiftArea}`);
    const shiftArea = {
      [SHIFT_TYPE.VERTICAL]: () => {
        this.deleteRange(`${sheet}!${rangeShiftArea}`, DELETE_MODE.ROW);
        this.insertArea(sheet, 1, +rangeFrom, areaShift);
      },
      [SHIFT_TYPE.HORIZONTAL]: () => {
        this.deleteRange(`${sheet}!${rangeShiftArea}`, DELETE_MODE.COLUMN);
        this.insertArea(sheet, getColumnNumberForName(rangeFrom), 1, areaShift);
      },
      null: () => {},
    };
    shiftArea[shiftType]();
  }

  /**
   * Удалить диапазона в документе
   * @param {String} range - диапазон "'Sheet1'!A1:A5"
   * @param {Enum} deleteMode - режим удаления
   */
  deleteRange(range, deleteMode = null) {
    const [sheet] = range.split('!');
    const cellsInRange = this.getCellsInRange(range, RETURN_FORMAT.KEYS);
    const cells = Object.entries(this.sheets[sheet].cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRange.includes(cellName));
    });
    this.sheets[sheet].cells = { ...Object.fromEntries(cells) };

    const namedAreasInRange = this.getListNamedAreasForRange(range);
    const namedAreas = this.namedAreas.filter((namedArea) => {
      const condition = namedAreasInRange
        .findIndex((item) => item.name === namedArea.name && item.range === namedArea.range);
      return (condition === -1);
    });
    this.namedAreas = [...namedAreas];

    if (deleteMode === DELETE_MODE.ROW) {
      const rowKeys = this.getRowKeysInRange(range);
      const rows = Object.entries(this.sheets[sheet].rows).filter((row) => {
        const [rowName] = row;
        return (!rowKeys.includes(+rowName));
      });
      this.sheets[sheet].rows = { ...Object.fromEntries(rows) };
    }

    if (deleteMode === DELETE_MODE.COLUMN) {
      const columnKeys = this.getColumnKeysInRange(range);
      const columns = Object.entries(this.sheets[sheet].columns).filter((column) => {
        const [columnName] = column;
        return (!columnKeys.includes(columnName));
      });
      this.sheets[sheet].columns = { ...Object.fromEntries(columns) };
    }
  }

  /**
   * Десериализация
   * @param {Object} data - данные
   */
  deserialize(data) {
    // console.time('deserialize');
    const documentData = getObjectOfJSON(data);
    this.sheets = {};
    this.documentTemplate.getSheetsList().forEach((sheet) => {
      this.sheets[sheet.name] = {
        cells: {},
        columnCount: 0,
        columns: {},
        editAccess: this.documentTemplate.sheets[sheet.name].editAccess,
        rowCount: 0,
        rows: {},
        title: this.documentTemplate.sheets[sheet.name].title,
      };
    });
    this.scripts = this.documentTemplate.scripts;

    const deserializeError = [];
    this.documentSettings.forEach((setting) => {
      const [sectionKey, sectionValue] = Object.entries(setting)[0];
      if (Object.keys(sectionValue).includes('nested')) return;
      let sectionData = documentData[sectionKey];
      if (!Array.isArray(sectionData)) sectionData = [sectionData];
      sectionData.forEach((sectionDataItem) => {
        try {
          this.deserializeArea(sectionKey, sectionDataItem);
        } catch (err) {
          if (err instanceof TableDocumentGeneralError) throw err;
          deserializeError.push(...err);
        }
      });
    });
    if (deserializeError.length) {
      throw new TableDocumentDeserializeError('deserialize', deserializeError);
    }
    // console.timeEnd('deserialize');
  }

  /**
   * Десериализация области документа
   * @param {String} sectionKey - ключ секции
   * @param {Array|Object} sectionDataItem - данные
   * @returns
   */
  deserializeArea(sectionKey, sectionDataItem) {
    const sectionValue = this.getSectionSettings(sectionKey);
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
    area = this.documentTemplate
      .getNamedArea(sectionValue.templateSectionName, sectionValue.sheet)
      .getAreaCopy();
    try {
      console.log(sectionDataItem);
      console.log(sectionValue.parameters);
      console.log(sectionValue.sheet);
      area.fillArea(sectionDataItem, sectionValue.parameters, sectionValue.sheet);
    } finally {
      insertMethods[sectionValue.methodName](area, sectionValue.sheet);
    }
    const { nestedData } = sectionValue;
    if (!nestedData) return;
    nestedData.forEach((nestedDataKey) => {
      if (!Object.keys(sectionDataItem).includes(nestedDataKey)) return;
      this.deserializeArea(nestedDataKey, sectionDataItem[nestedDataKey]);
    });
  }

  /**
   * Редактирование ячейки
   * @param {String} sheet - лист
   * @param {String} cellName - имя ячейки
   * @param {String|Number|Date} cellValue - значение ячейки
   */
  editingCell(sheet, cellName, cellValue) {
    this.setCellValue(sheet, cellName, cellValue);
  }

  /**
   * Выполнение скрипта ячейки
   * @param {String} sheet - лист
   * @param {String} cellName - имя ячейки
   * @returns
   */
  executeCellAction(sheet = 'sheet1', cellName) {
    const action = this.getCellAction(sheet, cellName);
    console.log(sheet);
    const scriptBody = this.getScriptBody(action);
    if (!scriptBody) return;
    console.log(scriptBody);
    const actionFunction = eval(scriptBody); // eslint-disable-line no-eval
    actionFunction(sheet, cellName);
  }

  /**
   * Заполнение области данными по параметрам
   * @param {Object} data - данные
   * @param {Object} parameters - параметры
   * @param {String} sheet - имя листа
   * @returns
   */
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

  /**
   * Возвращает копию табличного документа
   * @returns {TableDocument}
   */
  getAreaCopy() {
    const {
      sheets, styles, scripts, images, namedAreas,
    } = JSON.parse(JSON.stringify({
      sheets: this.sheets,
      styles: this.styles,
      scripts: this.scripts,
      images: this.images,
      namedAreas: this.namedAreas,
    }));
    return new this.BaseClass({
      rangeType: this.rangeType,
      sheets,
      styles,
      scripts,
      images,
      namedAreas,
    });
  }

  /**
   * Возвращает область табличного документа по диапазону
   * @param {String} areaRange - диапазон "'Sheet1'!A1:A10"
   * @returns {TableDocument}
   */
  getAreaForRange(areaRange) {
    const [sheet, range] = areaRange.split('!');
    const sheets = {
      [sheet]: {
        cells: {},
        columnCount: 0,
        columns: {},
        rowCount: 0,
        rows: {},
      },
    };

    const styles = {};
    const namedAreas = [];
    const scripts = {};
    const images = {};
    const cellsInRange = this.getCellsInRange(areaRange);
    cellsInRange.forEach((cell) => {
      const [cellNameCurrent, cellValueCurrent] = cell;
      const cellNameShift = moveCell(cellNameCurrent, undefined, range);
      const {
        parthSymbol: cellColumnCurrent, parthDigit: cellRowCurrent,
      } = getParseAtSymbolDigit(cellNameCurrent);
      const {
        parthSymbol: cellColumnShift, parthDigit: cellRowShift,
      } = getParseAtSymbolDigit(cellNameShift);

      sheets[sheet].cells[cellNameShift] = {
        ...this.sheets[sheet].cells[cellNameCurrent],
        cellNameTemplate: cellNameCurrent,
      };
      sheets[sheet].columns[cellColumnShift] = this.sheets[sheet].columns[cellColumnCurrent];
      sheets[sheet].rows[cellRowShift] = this.sheets[sheet].rows[cellRowCurrent];

      const cellStyles = this.getStyleForName(`${sheet}|${cellNameCurrent}`);
      // if (cellStyles) styles.push(cellStyles);
      if (cellStyles) {
        styles[`${sheet}|${cellNameCurrent}`] = this.styles[`${sheet}|${cellNameCurrent}`];
      }

      if (Object.keys(cellValueCurrent).includes('image')) {
        const imageName = cellValueCurrent.image;
        const image = this.images[imageName];
        if (image) {
          images[imageName] = this.images[imageName];
        }
      }
    });
    const listNamedAreas = this.getListNamedAreasForRange(areaRange);
    listNamedAreas.forEach((namedArea) => {
      namedAreas.push({
        name: namedArea.name,
        range: moveRange(namedArea.range, 1, range),
      });
    });
    sheets[sheet].rowCount = Object.keys(sheets[sheet].rows).length;
    sheets[sheet].columnCount = Object.keys(sheets[sheet].columns).length;
    return new this.BaseClass({
      methodName: (getRangeType(range) === 'row') ? 'put' : 'join', // ??????
      sheets,
      styles,
      scripts,
      images,
      namedAreas,
    });
  }

  /**
   * Возвращает высоту листа
   * @param {String} sheet - лист
   * @returns {Number}
   */
  getAreaHeight(sheet = 'sheet1') {
    const rows = [];
    Object.keys(this.sheets[sheet].rows).forEach((row) => rows.push(row));
    return Math.max(...rows);
  }

  /**
   * Возвращает объект содержащий ключ(параметр) => значение(значение ячейки)
   * по списку параметров
   * @param {String} sheet - лист
   * @param {Object} parameters - список параметров
   * @returns {Object}
   */
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

  /**
   * Возвращает ширину листа (кл-во колонок)
   * @param {String} sheet - лист
   * @returns {Number}
   */
  getAreaWidth(sheet = 'sheet1') {
    const columns = [];
    Object.keys(this.columns[sheet])
      .forEach((column) => columns.push(getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  /**
   * Возвращает объект ячейки, если ячейка отсутствует возвращает пустой объект
   * @param {String} sheetName - имя листа
   * @param {String} cellName - имя ячейки
   * @returns {Object}
   */
  getCell(sheetName = 'sheet1', cellName) {
    return this.sheets[sheetName].cells[cellName] || {};
  }

  /**
   * Возвращает имя метода ячейки или null
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @returns {String}
   */
  getCellAction(sheet = 'sheet1', cellName) {
    return this.getCell(sheet, cellName).action || null;
  }

  /**
   * Возвращает объект содержащий ячейки с формулами разложенные по листам или по конкретному листу
   * @param {String} sheet - имя листа
   * @returns {Object}
   */
  getCellFormulas(sheet = null) { // переделать фильтры
    console.time('GetFormulars');
    const cellFormulas = {};
    if (sheet) {
      // cellFormulas[sheet] = [];
      cellFormulas[sheet] = Object.keys(this.sheets[sheet].cells)
        .filter((cellName) => Object.keys(this.sheets[sheet].cells[cellName])
          .includes(CELL_ATTRIBUTES.FORMULA));
      return cellFormulas;
    }
    this.getSheetsList().forEach((sheetItem) => {
      const { name: sheetName } = sheetItem;
      cellFormulas[sheetName] = [];
      const cellFormulasSheet = Object.keys(this.sheets[sheetName].cells)
        .filter((cellName) => Object.keys(this.sheets[sheetName].cells[cellName])
          .includes(CELL_ATTRIBUTES.FORMULA));
      // console.log(cellFormulasSheet);
      cellFormulasSheet.forEach((cell) => cellFormulas[sheetName].push(cell));
    });
    // console.log(cellFormulas);
    console.timeEnd('GetFormulars');
    return cellFormulas;
  }

  /**
   * Возвращает массив имен ячеек в группировке
   * @param {String} sheet - имя листа
   * @param {String} range - диапазон
   * @param {Number} level - уровень группировки
   * @param {Enum} rangeType - тип диапазона
   * @returns {Array}
   */
  getCellKeysInLevel(sheet = 'sheet1', range, level, rangeType = RANGE_TYPE.ROW) {
    const cells = [];
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(range);
    if (rangeType === RANGE_TYPE.ROW) {
      const rowCount = Object.keys(this.sheets[sheet].rows).length;
      for (let row = cellRow; row < rowCount + 1; row += 1) { // ??? непонятка с length
        if (this.sheets[sheet].rows[row].level === level) cells.push(`${cellColumn}${row}`);
        if (this.sheets[sheet].rows[row].level < level) break;
      }
    }
    if (rangeType === RANGE_TYPE.COLUMN) {
      const columnNumber = getColumnNumberForName(cellColumn);
      const columnCount = Object.keys(this.sheets[sheet].columns).length;
      for (let column = columnNumber - 1; column < columnCount; column += 1) {
        const columnName = getColumnNameForNumber(column);
        if (this.sheets[sheet].columns[columnName].level === level) cells.push(`${columnName}${cellRow}`);
        if (this.sheets[sheet].columns[columnName].level < level) break;
      }
    }
    return cells;
  }

  /**
   * Возвращает все ячейки для указанного листа
   * @param {String} sheet - имя листа
   * @returns {Object}
   * @example getCells('sheet1')
   */
  getCells(sheet = 'sheet1') {
    if (!this.sheets[sheet]) return {};
    return this.sheets[sheet].cells || {};
  }

  /**
   * Возвращает ячейки в указанном диапазоне
   * @param {String} range - диапазон "'Sheet1'!A1:A5"
   * @param {Enum} returnFormat - возвращаемый формат ENTRIES, KEYS, VALUES
   * @returns {Array}
   */
  getCellsInRange(range, returnFormat = RETURN_FORMAT.ENTRIES) {
    const [sheet] = range.split('!');
    const rowKeys = this.getRowKeysInRange(range);
    const columnKeys = this.getColumnKeysInRange(range);
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

  /**
   * Возвращает тип ячейки, если отсутствует то тип столбца, тип строки, 'string' (default)
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @returns {String}
   */
  getCellType(sheet = 'sheet1', cellName) {
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    // const cellType = (this.sheets[sheet].cells[cellName])
    //   ? this.sheets[sheet].cells[cellName].type || null : null;
    const cellType = this.getCell(sheet, cellName).type || null;
    return cellType
      || this.getColumnType(sheet, cellColumn)
      || this.getRowType(sheet, cellRow)
      || 'string';
  }

  /**
   * Возвращает скрипт валидации значения ячейки или null
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @returns {String}
   */
  getCellValidatorScript(sheet = 'sheet1', cellName) {
    return this.getCell(sheet, cellName).validators || null;
  }

  /**
   * Возвращает значение ячейки или null
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @returns {String|Number|Date}
   */
  getCellValue(sheet = 'sheet1', cellName) {
    return this.getCell(sheet, cellName).value || null;
  }

  /**
   * Возвращает объект колонки, если колонка отсутствует возвращает пустой объект
   * @param {String} sheetName - имя листа
   * @param {String|Number} columnName - имя или номер колонки
   * @returns {Object}
   */
  getColumn(sheetName = 'sheet1', columnName) {
    let columnNameText = columnName;
    if (+columnName) columnNameText = getColumnNameForNumber(columnName);
    return this.sheets[sheetName].columns[columnNameText] || {};
  }

  /**
   * Возвращает массив ключей объекта columns в заданном диапазоне
   * @param {String} areaRange - диапазон "'Sheet1'!A1:A5"
   * @returns {Array}
   */
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

  /**
   * Возвращает тип колонки или undefined
   * @param {String} sheetName - лист
   * @param {String|Number} columnName - имя или номер колонки
   * @returns {String}
   */
  getColumnType(sheetName = 'sheet1', columnName) {
    return this.getColumn(sheetName, columnName).type || undefined;
  }

  /**
   * Возвращает объект или строку JSON документа
   * @param {Boolean} JSONFormat - тип возвращаемого значения
   * @returns {Object|String}
   */
  getDocument(JSONFormat = false) {
    const cells = Object.entries(this.cells).filter((cell) => {
      const [, cellValue] = cell;
      return (!Object.keys(cellValue).includes('action'));
    });
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
   * Возвращает массив объектов ячеек содержащие формулы во всей книге
   * @returns {Array}
   */
  getFormularsCellsSet() {
    let formulasCellsSet = [];
    this.getSheetsList().forEach((sheet) => {
      const { name: sheetName } = sheet;
      formulasCellsSet = [
        ...formulasCellsSet,
        ...Object.keys(this.sheets[sheetName].cells)
          .filter((cellName) => Object.keys(this.sheets[sheetName].cells[cellName])
            .includes(CELL_ATTRIBUTES.FORMULA)),
      ];
    });
    return formulasCellsSet;
  }

  /**
   * Возвращает номер максимальной колонки в листе
   * @param {String} sheet - имя листа
   * @returns {Number}
   */
  getLastColumn(sheet = 'sheet1') {
    const columns = [0];
    if (!this.sheets[sheet]) return 0;
    if (!this.sheets[sheet].columns) return 0;
    Object.keys(this.sheets[sheet].columns)
      .forEach((column) => columns.push(+getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  /**
   * Возвращает номер максимальной колонки в строке
   * @param {String} sheet - лист
   * @param {String|Number} rowName - номер строки
   * @returns {Number}
   */
  getLastColumnInRow(sheet = 'sheet1', rowName) {
    const columns = [0];
    const cellsInRow = this.getCellsInRange(`${sheet}!${rowName}:${rowName}`, RETURN_FORMAT.KEYS);
    cellsInRow.forEach((cellKey) => {
      const { parthSymbol: cellColumn } = getParseAtSymbolDigit(cellKey);
      columns.push(+getColumnNumberForName(cellColumn));
    });
    return Math.max(...columns);
  }

  /**
   * Возвращает номер последней строки
   * @param {String} sheet - лист
   * @returns {Number}
   */
  getLastRow(sheet = 'sheet1') {
    const rows = [0];
    if (!this.sheets[sheet]) return 0;
    if (!this.sheets[sheet].rows) return 0;
    Object.keys(this.sheets[sheet].rows).forEach((row) => rows.push(+row));
    return Math.max(...rows);
  }

  /**
   * Возвращает список именованных диапазонов в диапазоне
   * @param {String} areaRange - диапазон
   * @returns {Array}
   */
  getListNamedAreasForRange(areaRange) {
    const [sheet, upperRange] = areaRange.split('!');
    const range = upperRange.toLowerCase();
    const namedAreas = [];
    const [rangeFrom, rangeTo] = getRangeSplit(range);
    let {
      parthSymbol: rangeFromColumn, parthDigit: rangeFromRow,
    } = getParseAtSymbolDigit(rangeFrom);
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
    this.namedAreas.forEach((item) => {
      const [itemSheet, itemRange] = item.range.split('!');
      const rangeTypeItem = getRangeType(itemRange);
      let [namedAreaRangeFrom, namedAreaRangeTo] = getRangeSplit(itemRange);

      if (rangeTypeItem === RANGE_TYPE.COLUMN) {
        namedAreaRangeFrom = getColumnNumberForName(namedAreaRangeFrom);
        namedAreaRangeTo = getColumnNumberForName(namedAreaRangeTo);
      }
      if (rangeTypes[rangeTypeItem](namedAreaRangeFrom, namedAreaRangeTo)
        && itemSheet === sheet) namedAreas.push(item);
    });
    return namedAreas;
  }

  /**
   * Возвращает массив табличных документов по имени области
   * @param {String} areaName - имя именованной области
   * @returns {Array<TableDocument>}
   */
  getNamedArea(areaName) {
    const namedAreas = [];
    const range = this.getRangeByAreaName(areaName);
    range.forEach((rangeItem) => {
      // console.log(rangeItem);
      namedAreas.push(this.getAreaForRange(rangeItem));
    });
    // console.log(namedAreas);
    if (namedAreas.length === 1) return namedAreas[0];
    return namedAreas;
  }

  /**
   * Возвращает именованные области документа
   * @returns {Array}
   */
  getNamedAreas() {
    return this.namedAreas;
  }

  /**
   * Возвращает поля для передачи в визуальный компонент
   * @param {String} sheetName
   * @returns {Object}
   */
  getPropsForView(sheetName) {
    if (!this.sheets[sheetName]) return {};
    const styles = [];
    Object.entries(this.styles).forEach((style) => {
      const [styleName, styleList] = style;
      if (styleName.split('|')[0] !== sheetName) return;
      styles.push({
        name: styleName.split('|')[1],
        list: styleList,
      });
    });

    return {
      columns: this.sheets[sheetName].columns,
      columnCount: this.sheets[sheetName].columnCount || 26,
      rows: this.sheets[sheetName].rows,
      rowCount: this.sheets[sheetName].rowCount || 100,
      cells: this.sheets[sheetName].cells,
      styles,
      images: this.images,
    };
  }

  /**
   * Возвращает диапазоны области
   * @param {String} areaName - имя области
   * @returns {Array}
   */
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

  /**
   * Возвращает диапазон именованной области по имени ячейке
   * @param {String} cellName - имя ячейки
   * @param {String} areaName - имя области
   * @param {Enum} rangeType - тип диапазона (направление)
   * @returns {String}
   */
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

  /**
   * Возвращает диапазон от начала диапазона до конца листа
   * @param {String} rangeFrom - начало диапазона
   * @returns {String}
   */
  getRangeToEdge(rangeFrom) {
    const [sheet, range] = rangeFrom.split('!');
    const rangeType = getRangeType(range);
    const rangeEdge = {
      [RANGE_TYPE.CELL]: () => `${range}:${getColumnNameForNumber(this.getLastColumn(sheet))}${this.getLastRow(sheet)}`,
      [RANGE_TYPE.ROW]: () => `${range}:${this.getLastRow(sheet)}`,
      [RANGE_TYPE.COLUMN]: () => `${range}:${getColumnNameForNumber(this.getLastColumn(sheet))}`,
    };
    return rangeEdge[rangeType]();
  }

  /**
   * Возвращает объект строки, если строка отсутствует возвращает пустой объект
   * @param {String} sheetName - имя листа
   * @param {String} rowName - имя строки
   * @returns {Object}
   */
  getRow(sheetName = 'sheet1', rowName) {
    return this.sheets[sheetName].rows[rowName] || {};
  }

  /**
   * Возвращает тип строки или undefined
   * @param {*} sheetName - имя листа
   * @param {*} rowName - имя строки
   * @returns {String}
   */
  getRowType(sheetName = 'sheet1', rowName) {
    return this.getRow(sheetName, rowName).type || undefined;
  }

  /**
   * Возвращает массив ключей объекта rows в заданном диапазоне
   * @param {String} areaRange - диапазон "'Sheet1'!A1:A5"
   * @returns {Array}
   */
  getRowKeysInRange(areaRange) {
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

  /**
   * Возвращает список листов документа
   * @returns {Object} // { name: sheetName, title: sheetTitle }
   */
  getSheetsList() {
    const sheetsListArray = Object.entries(this.sheets);
    const sheetsListArraySort = sheetsListArray.sort((a, b) => a[1].index - b[1].index);
    const sheetsList = [];
    sheetsListArraySort.forEach((sheet) => {
      sheetsList.push({
        name: sheet[0],
        title: sheet[1].title,
      });
    });
    return sheetsList;
  }

  /**
   * Возвращает поля секции из объекта настроек
   * @param {String} sectionName - имя секции
   * @returns {Object}
   */
  getSectionSettings(sectionName) {
    const sectionSettings = this.documentSettings
      .find((setting) => Object.keys(setting).includes(sectionName));
    return Object.values(sectionSettings)[0];
  }

  /**
   * Возвращает тело скрипта по имени
   * @param {String} scriptName - имя скрипта
   * @returns {String}
   */
  getScriptBody(scriptName) {
    // if (!this.scripts[scriptName]) return null;
    return this.scripts[scriptName] || null;
  }

  /**
   * Возвращает стили документа
   * @returns {Array}
   */
  getStyles() {
    return this.styles;
  }

  /**
   * Возвращает стиль по имени
   * @param {*} styleName - имя стиля
   * @returns {Object}
   */
  getStyleForName(styleName) {
    if (!Object.keys(this.styles).includes(styleName)) return null;
    return this.styles[styleName];
  }

  /**
   * Проверка редактирования
   * @param {*} sheet - имя листа
   * @param {*} cellName - имя ячейки
   * @returns {Boolean}
   */
  hasEditing(sheet, cellName) {
    return this.hasEditingSheet(sheet, cellName);
  }

  /**
   * Проверка редактирования ячейки
   * @param {*} sheet - имя листа
   * @param {*} cellName - имя ячейки
   * @returns {Boolean}
   */
  hasEditingCell(sheet, cellName) {
    const isEditAccessSheet = this.sheets[sheet].editAccess || EDIT_ACCESS.OPEN;
    let isEditAccessCell;
    if (Object.keys(this.sheets[sheet].cells).includes(cellName)) {
      isEditAccessCell = this.sheets[sheet].cells[cellName].isEditable;
    }
    // console.log(isEditAccessSheet, isEditAccessCell);
    // console.log(isEditCell);
    if (isEditAccessSheet === EDIT_ACCESS.CLOSED_EXCEPT_OPEN
      && isEditAccessCell === true) return true;
    if (isEditAccessSheet === EDIT_ACCESS.OPEN && isEditAccessCell !== false) return true;
    if (!isEditAccessSheet && isEditAccessCell === false) return false;
    return false;
  }

  /**
   * Проверка редактирования листа
   * @param {*} sheet - имя листа
   * @param {*} cellName - имя ячейки
   * @returns {Boolean}
   */
  hasEditingSheet(sheet, cellName) {
    console.log(this.sheets[sheet].editAccess, sheet);
    if (this.sheets[sheet].editAccess === EDIT_ACCESS.CLOSED) return false;
    return this.hasEditingCell(sheet, cellName);
  }

  /**
   * Проверяет наличие именованной секции в документе
   * @param {String} namedArea - имя именованной секции
   * @returns {Boolean}
   */
  hasNamedArea(namedArea) {
    let rezult = false;
    const foundNamedArea = this.namedAreas
      .find((item) => (item.name === namedArea.name && item.range === namedArea.range));
    if (foundNamedArea) rezult = true;
    return rezult;
  }

  /**
   * Вставка области в документ
   * @param {String} sheet - имя листа
   * @param {Number} numberColumn - начало колонки вставки
   * @param {Number} numberRow - начало строки вставки
   * @param {TableDocument} area - добавляемая область
   * @param {Enum} shiftType - тип сдвига
   */
  insertArea(sheet = 'sheet1', numberColumn, numberRow, area, shiftType = null) {
    // console.time('insertArea');
    const namedAreas = [];
    const {
      images: areaImages,
    } = area;
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
      // console.log(rangeFrom);
      rangeShift = this.getRangeToEdge(`${rangeFrom}`);
      // console.log(rangeShift);
      areaShift = this.getAreaForRange(`${sheet}!${rangeShift}`);
      // console.log(areaShift);
      this.deleteRange(`${sheet}!${rangeShift}`);
    }
    Object.entries(area.getCells(sheet)).forEach((cell) => {
      const [currentCellName] = cell;
      const shiftCellName = moveCell(currentCellName, `${getColumnNameForNumber(numberColumn)}${numberRow}`);
      const {
        parthSymbol: currentColumn, parthDigit: currentRow,
      } = getParseAtSymbolDigit(currentCellName);
      const {
        parthSymbol: shiftColumn, parthDigit: shiftRow,
      } = getParseAtSymbolDigit(shiftCellName);

      this.setColumn(sheet, shiftColumn, area.getColumn(sheet, currentColumn));
      this.setRow(sheet, shiftRow, area.getRow(sheet, currentRow));

      const cellValue = area.getCell(sheet, currentCellName);
      if (Object.keys(cellValue).includes('formula')) {
        cellValue.formula = moveFormula(
          cellValue.formula,
          shiftCellName,
          cellValue.cellNameTemplate,
        );
        cellValue.calculated = false;
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
    this.setStyles(area.getStyles());
    this.setNamedArea(area.getNamedAreas(), numberRow, numberColumn);

    this.images = { ...this.images, ...areaImages };
    this.namedAreas = [...this.namedAreas, ...namedAreas];
    this.sheets[sheet].rowCount = this.getLastRow(sheet);
    this.sheets[sheet].columnCount = this.getLastColumn(sheet);

    shiftInsert[shiftType]();
    // console.timeEnd('insertArea');
  }

  /**
   * Устанавливает поля ячейки
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @param {Object} cellValue - объект содержащий поля ячейки
   */
  setCell(sheet = 'sheet1', cellName, cellValue) {
    if (this.sheets[sheet].cells[cellName]) this.sheets[sheet].cells[cellName] = cellValue;
    else this.sheets[sheet].cells = { ...this.sheets[sheet].cells, [cellName]: cellValue };
  }

  /* eslint-disable */
  /**
   * Устанавливает значение ячейки
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @param {String|Number|Date|Boolean} cellValue - значение ячейки
   * @param {String} cellParameter - имя параметра ячейки
   * @param {Boolean} isErrorStop - флаг остановки в случае ошибки
   */
  setCellValue(sheet = 'sheet1', cellName, cellValue, cellParameter = '', isErrorStop = false) {
    // console.log(sheet, cellName, cellValue);
    const cellProperty = this.getCell(sheet, cellName);
    // console.log(cellProperty);
    try {
      this.validateCellValue(cellName, { ...cellProperty, value: cellValue }, cellParameter, sheet);
      cellProperty.value = cellValue;
    } finally {
      if (!isErrorStop) {
        this.setCell(sheet, cellName, cellProperty);
        // this.recalculateFormulas();
      }
    }
  }

  /**
   * Устанавливает поля колонки
   * @param {String} sheet - имя листа
   * @param {String} columnName - имя колонки
   * @param {Object} columnValue - объект содержащий поля колонки
   */
  setColumn(sheet = 'sheet1', columnName, columnValue) {
    let columnNameText = columnName;
    if (+columnName) columnNameText = getColumnNameForNumber(columnName);
    // this.sheets[sheet].columns = { ...this.sheets[sheet].columns, [columnNameText]: columnValue };
    this.sheets[sheet].columns[columnNameText] = columnValue;
    this.setColumnGroup(sheet, columnValue.level || 0, columnNameText);
  }

  /**
   * Установка группировок колонок
   * @param {String} sheet - имя листа
   * @param {Number} level - уровень группировки
   * @param {String} columnName - имя колонки
   */
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

  /**
   * Устанавливает именованные секции со сдвигом в документе
   * @param {Array} areas - именованные секции
   * @param {Number} numberRow - номер строки области
   * @param {Number} numberColumn - номер столбца области
   */
  setNamedArea(areas, numberRow, numberColumn) {
    const moveRangeDirection = {
      [RANGE_TYPE.ROW]: (range, numRow) => moveRange(range, numRow),
      [RANGE_TYPE.COLUMN]: (range, numCol) => moveRange(range, numCol),
    };
    areas.forEach((area) => {
      const [, range] = area.range.split('!');
      const rangeType = getRangeType(range);
      const namedArea = {
        name: area.name,
        range: `${moveRangeDirection[rangeType](
          area.range,
          (rangeType === RANGE_TYPE.ROW) ? numberRow : numberColumn,
        )}`,
      };
      if (!this.hasNamedArea(namedArea)) this.namedAreas.push(namedArea);
    });
  }

  /**
   * Устанавливает поля строки
   * @param {String} sheet - имя листа
   * @param {String} rowName - имя строки
   * @param {Object} rowValue - объект содержащий поля строки
   */
  setRow(sheet = 'sheet1', rowName, rowValue) {
    // this.sheets[sheet].rows = { ...this.sheets[sheet].rows, [rowName]: rowValue };
    this.sheets[sheet].rows[rowName] = rowValue;
    this.setRowGroup(sheet, rowValue.level || 0, rowName);
  }

  /**
   * Установка группировок строк
   * @param {String} sheet - имя листа
   * @param {Number} level - уровень группировки
   * @param {String} rowName - имя строки
   */
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

  /**
   * Устанавливает поле ячейки calculated, если ячейка не задана то
   * на всем листе, если лист не задан то на всей книге
   * @param {Boolean} state - состояние
   * @param {String} sheet - имя листа
   * @param {String} cellName - имя ячейки
   * @returns
   */
  setCalculated(state = false, sheet = null, cellName = null) {
    if (sheet && cellName) {
      this.sheets[sheet].cells[cellName].calculated = state;
      return;
    }
    if (sheet) {
      Object.values(this.sheets[sheet].cells).forEach((cellValue) => {
        if (cellValue.includes('formula')) cellValue.calculated = state;
      });
      return;
    }
    this.getSheetsList().forEach((sheetItem) => {
      Object.values(this.sheets[sheetItem].cells).forEach((cellValue) => {
        if (cellValue.includes('formula')) cellValue.calculated = state;
      });
    });
  }

  /**
   * Добавляет стили области в документ
   * @param {Array} stylesArea - объект стилей
   */
  setStyles(stylesArea) {
    this.styles = { ...this.styles, ...stylesArea };
  }

  /**
   * Присоединить секцию
   * @param {TableDocument} area - табличный документ
   * @param {String} sheet - имя листа
   */
  joinArea(area, sheet = 'sheet1') {
    const numberLastRow = this.getLastRow(sheet);
    const numberNewColumn = this.getLastColumnInRow(sheet, numberLastRow) + 1;
    this.insertArea(sheet, numberNewColumn, numberLastRow, area);
  }

  /**
   * Переопределение методов FormulaParser
   */
   overridingFormulaParser() {
    this.parseFormula = new FormulaParser({
      functionsNeedContext: {
        SUMGROUP: (context, column, row) => {
          const { sheet } = context.position;
          const cellNameRange = `${Address.columnNumberToName(column.value)}${row.value}`.toLowerCase();
          const cellKeys = this.getCellKeysInLevel(
            sheet, cellNameRange, this.getCell(sheet, cellNameRange).level || 1,
          ); // добавить в формулу уровень группировки?
          let result = 0;
          cellKeys.forEach((cellKey) => {
            result += this.getCellValue(sheet, cellKey.toLowerCase());
          });
          return result;
        },
        OBJECTPROPERTY: (context, cellName, propertyName) => { // переделать в ближайшем будущем
          const cellNameSource = cellName.value.toLowerCase();
          const { sheet } = context.position;
          // const { type, value } = this.cells[cellNameSource];
          const { type, value } = this.getCell(sheet, cellNameSource);
          const property = `{${propertyName.value.toLowerCase()}}`;
          const result = getRepresentationAtStore(type.split('.')[1], value, property);
          return result;
        },
      },
      functions: {},
      onCell: ({ sheet, row, col }) => {
        const value = this.getCellValue(sheet, `${getColumnNameForNumber(col)}${row}`);
        return value;
      },
      onRange: (ref) => {
        const arr = [];
        for (let { row } = ref.from; row <= ref.to.row; row += 1) {
          const innerArr = [];
          if (this.getRow(ref.sheet, [row - 1])) {
            for (let { col } = ref.from; col <= ref.to.col; col += 1) {
              const cellNameRange = `${Address.columnNumberToName(col)}${row}`.toLowerCase();
              const value = this.getCellValue(ref.sheet, cellNameRange);
              innerArr.push(value);
            }
          }
          arr.push(innerArr);
        }
        return arr;
      },
    });
  }

  /**
   * Вставить секцию
   * @param {TableDocument} area - табличный документ
   * @param {String} sheet - имя листа
   */
  putArea(area, sheet = 'sheet1') {
    const numberNewRow = this.getLastRow(sheet) + 1;
    this.insertArea(sheet, 1, numberNewRow, area);
  }

  /**
   * Пересчет всех формул
   * @param {String} sheet - имя листа
   */
  recalculateFormulas(sheet = null) {
    console.time('recalculateFormulas');
    const cellFormulas = this.getCellFormulas(sheet);
    Object.keys(cellFormulas).forEach((sheetName) => {
      cellFormulas[sheetName].forEach((cellName) => {
        this.calculateCellValue(sheetName, cellName);
      });
    });
    console.timeEnd('recalculateFormulas');
  }

  /**
   * Сериализация, возвращает объект с данными документа
   * @param {String} nameDataSection - имя секции данных
   * @param {Array} settings - настройки
   * @returns {Object}
   */
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
    const areaValue = areas.getAreaValue(keyValue.sheet, keyValue.parameters || {});
    if (keyValue.nestedData) {
      keyValue.nestedData.forEach((nestedSection) => {
        areaValue[nestedSection] = this.serializationDataSection(nestedSection, settings);
      });
    }
    return (keyValue.presentationType === 'unit') ? { ...areaValue } : [{ ...areaValue }];
  }

  /**
   * Устанавливает шаблон в документ
   * @param {String|Object} template - объект или JSON строка 
   */
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

  /**
   * Устанавливает настройки в документ
   * @param {String|Object} settings - объект или JSON строка настроек
   */
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

  /**
   * Валидация значения ячейки
   * @param {String} cellName - имя ячейки
   * @param {String|Number|Data|Boolean} cellValue - значение ячейки
   * @param {String} cellParameter - имя параметра
   * @param {String} sheet - лист
   */
  validateCellValue(cellName, cellValue, cellParameter, sheet) {
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    const { type: cellType, value: checkValue } = cellValue;
    const checkType = cellType
      || this.getRowType(sheet, cellRow)
      || this.getColumnType(sheet, cellColumn)
      || 'string';
    const validateType = validateCellValueType(checkValue, checkType);
    let validateCustom = true;
    const validatorScript = this.getCellValidatorScript(sheet, cellName);
    if (validatorScript) {
      const validateCellValueCustom = eval(validatorScript); // eslint-disable-line no-eval
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
