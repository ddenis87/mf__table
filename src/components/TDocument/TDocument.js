import TSheet from './TSheet';

import {
  getColumnNameForNumber,
} from '../../helpers/spreadSheet';

import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_ROW_COUNT,
  EDIT_ACCESS,
} from './TDocumentConst';

import {
  getJSONParse,
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

    Object.entries(this.sheets).forEach((sheet) => {
      const [sheetName, sheetValue] = sheet;
      this.sheets[sheetName] = new TSheet(sheetValue);
    });
    if (!Object.keys(args).includes('JSONDocument')) return;
    this.createDocument(JSON.parse(args.JSONDocument));
  }

  /**
   * Возвращает объект ячейки, если ячейка отсутствует возвращает пустой объект
   * @param {String} sheetName - имя листа
   * @param {String} cellName - имя ячейки
   * @returns {Object}
   */
  // getCell(sheetName = 'sheet1', cellName) {
  //   return this.sheets[sheetName].cells[cellName] || {};
  // }

  /**
   * Возвращает объект колонки, если колонка отсутствует возвращает пустой объект
   * @param {String} sheetName - имя листа
   * @param {String} cellName - имя колонки
   * @returns {Object}
   */
  // getColumn(sheetName = 'sheet1', columnName) {
  //   return this.sheets[sheetName].columns[columnName] || {};
  // }

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
   * Возвращает объект строки, если строка отсутствует возвращает пустой объект
   * @param {String} sheetName - имя листа
   * @param {String} rowName - имя строки
   * @returns {Object}
   */
  // getRow(sheetName = 'sheet1', rowName) {
  //   return this.sheets[sheetName].rows[rowName] || {};
  // }

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

  // setCell(sheetName = 'sheet1', cellName, cell) {
  //   this.sheets[sheetName].cells[cellName] = cell;
  // }

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
