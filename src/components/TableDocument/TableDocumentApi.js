import store from '@/store/index';
import display from '@/plugins/formattingView/formattingView';
import TableDocument from './TableDocument';
// import ValueValidate from './Errors';

function parseType(type) {
  const [parthType, parthSource] = type.split('.');
  return {
    parthType,
    parthSource,
  };
}

function requestRepresentation(sourceName, value) {
  return new Promise((resolve) => {
    store.dispatch('DataTable/REQUEST_DATA_ITEM', {
      tableName: sourceName,
      id: value,
    }).then(() => {
      resolve();
    });
  });
}

class TableDocumentApi extends TableDocument {
  // constructor(params) {
  //   super(params);
  //   // console.log(this.columnCount);
  //   // this.prepareRepresentation();
  // }

  // BASE_CLASS = TableDocumentApi; // заменить на this.constructor

  representations = new Map();

  async deserialize(data, template, settings) {
    try {
      super.deserialize(data, template, settings);
    } finally {
      this.prepareRepresentation();
    }
  }

  editingCell(cellName, cellValue) {
    if (this.cells[cellName] && cellValue) {
      const { type, relatedModelView } = this.cells[cellName];
      if (type?.includes('field')) {
        const { parthSource: sourceName } = parseType(type);
        const representation = store
          .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: cellValue, relatedModelView });
        this.setRepresentation(cellValue, representation);
      }
    }
    super.editingCell(cellName, cellValue);
  }

  async getRepresentationStore() {
    const promises = Object.values(this.cells).map(async (cellValue) => {
      const { type, value, relatedModelView } = cellValue;
      if (type?.includes('field') && value) {
        const { parthSource: sourceName } = parseType(type);
        await requestRepresentation(sourceName, value);
        const representation = store
          .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: value, relatedModelView });
        this.setRepresentation(value, representation);
      }
    });
    await Promise.all(promises);
  }

  getDocument(JSONFormat = false) {
    const cells = {};
    Object.entries(this.cells).forEach((cell) => {
      const [cellName, cellValue] = cell;
      if (Object.keys(cellValue).includes('scripts')) return;
      cells[cellName] = {
        ...cellValue,
        value: display.formate(cellValue.value, {
          ...cellValue,
          representations: this.representations,
        }),
      };
    });

    const document = {
      editAccess: this.editAccess,
      rows: this.rows,
      rowCount: this.rowCount,
      columns: this.columns,
      columnCount: this.columnCount,
      cells,
      styles: this.styles,
      representations: Object.fromEntries(this.representations),
    };
    return (JSONFormat) ? JSON.stringify(document) : document;
  }

  getRepresentation(key) {
    let representation = 'none';
    if (this.representations.has(key)) representation = this.representations.get(key);
    return representation;
  }

  async prepareRepresentation() {
    await this.getRepresentationStore(); // .then(() => {
    this.cells = { ...this.cells };
    // });
  }

  setRepresentation(key, value) {
    this.representations.set(key, value);
  }
}

export default TableDocumentApi;
