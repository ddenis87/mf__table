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

  /**
   * Возвращает список листов документа
   * @returns {Object} // { name: sheetName, title: sheetTitle }
   */
  getSheetsList() {
    let sheetsList = Object.values(this.sheets);
    const sheetsListSort = sheetsList.sort((a, b) => a.index - b.index);
    sheetsList = [];
    sheetsListSort.forEach((sheet) => {
      sheetsList.push(sheet);
    });
    return sheetsList;
  }

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

  setCell(sheetName = 'sheet1', cellName, cell) {
    this.sheets[sheetName].cells[cellName] = cell;
  }
}

export default TDocument;
