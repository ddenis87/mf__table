import TSheet from './TSheet';
import TCell from './TCell';

import {
  getColumnNameForNumber,
  getColumnNumberForName,
} from '../../helpers/spreadSheet';

import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_ROW_COUNT,
  EDIT_ACCESS,
} from './TDocumentConst';

import {
  getJSONParse,
  getParseAtSymbolDigit,
} from './TDocumentHelpers';

class TDocument {
  constructor(options = {}) {
    this.BaseClass = this.constructor;
    this.createDocument(options);
  }

  createDocument(options) {
    let args;
    ({
      images: this.images = {},
      namedArea: this.namedArea = [],
      scripts: this.scripts = {},
      sheets: this.sheets = {
        sheet1: {
          cells: [],
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

    Object.entries(this.sheets).forEach((sheet) => {
      const [sheetName, sheetValue] = sheet;

      const cells = [sheetValue.rowCount];
      for (let i = 0; i < sheetValue.rowCount; i += 1) {
        cells[i] = [sheetValue.columnCount];
        for (let j = 0; j < sheetValue.columnCount; j += 1) {
          cells[i][j] = new TCell();
        }
      }

      Object.entries(sheetValue.cells).forEach((cell) => {
        const [cellName, cellValue] = cell;
        const { parthSymbol, parthDigit } = getParseAtSymbolDigit(cellName);
        const rowIndex = parthDigit - 1;
        const columnIndex = getColumnNumberForName(parthSymbol) - 1;
        cells[rowIndex][columnIndex] = new TCell(cellValue);
      });
      // убрать в впродакшене
      const sheetValueNew = JSON.parse(JSON.stringify(sheetValue));
      // заменить sheetValueNew -> sheetValue
      this.sheets[sheetName] = new TSheet({ ...sheetValueNew, cells });
    });
    if (!Object.keys(args).includes('JSONDocument')) return;
    this.createDocument(JSON.parse(args.JSONDocument));
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

    const cells = {};
    for (let i = 0; i < this.rowCount; i += 1) {
      for (let j = 0; j < this.columnCount; j += 1) {
        const cellName = `${getColumnNameForNumber(j + 1)}${i}`;
        cells[cellName] = this.sheets[sheetName].cells[i][j];
      }
    }
    console.log(cells);
    return {
      columns: this.sheets[sheetName].columns,
      columnCount: this.sheets[sheetName].columnCount,
      rows: this.sheets[sheetName].rows,
      rowCount: this.sheets[sheetName].rowCount,
      cells,
      styles,
      images: this.images,
    };
  }

  /**
   * Возвращает список листов документа
   * @returns {Object} // { name: sheetName, title: sheetTitle }
   */
  getSheetsList() {
    let sheetsList = Object.entries(this.sheets);
    const sheetsListSort = sheetsList.sort((a, b) => a[1].index - b[1].index);
    sheetsList = [];
    sheetsListSort.forEach((sheet) => {
      sheetsList.push({
        name: sheet[0],
        title: sheet[1].title,
      });
    });
    return sheetsList;
  }

  /**
   * Устанавливает шаблон в документ
   * @param {String|Object} template - объект или JSON строка
   */
  setTemplate(template) {
    const templateParse = getJSONParse(template);
    this.documentTemplate = new this.BaseClass(templateParse);
  }
}

export default TDocument;
