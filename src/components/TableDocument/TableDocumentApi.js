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

  BASE_CLASS = TableDocumentApi;

  representations = new Map();

  async prepareRepresentation() {
    await this.getRepresentationStore().then(() => {
      console.log('before update');
      this.cells = { ...this.cells };
    });
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

  // fillArea(dataArea, parameters) {
  //   super.fillArea(dataArea, parameters);
  //   Object.entries(this.cells).forEach((cell) => {
  //     const [, cellValue] = cell;
  //     if (Object.keys(cellValue).includes('type') && cellValue.type.includes('field')) {
  //       cellValue.representation = this.getRepresentation(cellValue.value);
  //     }
  //   });
  // }

  getRepresentation(key) {
    let representation = 'none';
    if (this.representations.has(key)) representation = this.representations.get(key);
    return representation;
  }

  setRepresentation(key, value) {
    this.representations.set(key, value);
  }
}

export default TableDocumentApi;
