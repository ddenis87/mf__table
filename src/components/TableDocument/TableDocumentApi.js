import store from '@/store/index';
import TableDocument from './TableDocument';

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
  constructor(params) {
    super(params);
    this.prepareRepresentation();
  }
  // constructor(params) {
  //   super(params);
  //   (async () => {
  //     await this.prepareRepresentation();
  //   })();
  // }

  BASE_CLASS = TableDocumentApi;

  representations = new Map();

  async deserialize(data, template, settings) {
    super.deserialize(data, template, settings);
    this.prepareRepresentation();
  }

  editingCell(cellName, cellValue) {
    if (this.cells[cellName] && cellValue) {
      const { type } = this.cells[cellName];
      if (type?.includes('field')) {
        const { parthSource: sourceName } = parseType(type);
        const representation = store
          .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: cellValue });
        this.setRepresentation(cellValue, representation);
      }
    }
    super.editingCell(cellName, cellValue);
  }

  async getRepresentationStore() {
    const promises = Object.values(this.cells).map(async (cellValue) => {
      const { type, value } = cellValue;
      if (type?.includes('.') && value) {
        const { parthSource: sourceName } = parseType(type);
        await requestRepresentation(sourceName, value);
        const representation = store
          .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: value });
        this.setRepresentation(value, representation);
      }
    });
    await Promise.all(promises);
  }

  getRepresentation(key) {
    let representation = 'none';
    if (this.representations.has(key)) representation = this.representations.get(key);
    return representation;
  }

  async prepareRepresentation() {
    await this.getRepresentationStore().then(() => {
      console.log('before update');
      this.cells = { ...this.cells };
    });
  }

  setRepresentation(key, value) {
    this.representations.set(key, value);
  }
}

export default TableDocumentApi;
