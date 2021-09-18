import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_ROW_COUNT,
  EDIT_ACCESS,
} from './TDocumentConst';

class TDocument {
  constructor(options = {}) {
    this.createDocument(options);
    this.BaseClass = this.constructor;
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
    if (!Object.keys(args).includes('JSONDocument')) return;
    this.createDocument(JSON.parse(args.JSONDocument));
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
   * Возвращает объект колонки, если колонка отсутствует возвращает пустой объект
   * @param {String} sheetName - имя листа
   * @param {String} cellName - имя колонки
   * @returns {Object}
   */
  getColumn(sheetName = 'sheet1', columnName) {
    return this.sheets[sheetName].columns[columnName] || {};
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

  getSheetsList() {
    let sheetsList = Object.values(this.sheets);
    const sheetsListSort = sheetsList.sort((a, b) => a.index - b.index);
    sheetsList = [];
    sheetsListSort.forEach((sheet) => {
      sheetsList.push(sheet);
    });
    return sheetsList;
  }

  setCell(sheetName = 'sheet1', cellName, cell) {
    this.sheets[sheetName].cells[cellName] = cell;
  }
}

export default TDocument;
