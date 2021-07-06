import store from '@/store/index';
import TableDocument from './TableDocument';

function parseType(type) {
  const [parthType, parthSource] = type.split('.');
  return {
    parthType,
    parthSource,
  };
}

class TableDocumentApi extends TableDocument {
  constructor(params) {
    super(params);

    console.log(store);
  }

  BASE_CLASS = TableDocumentApi;

  representations = new Map();

  // async requiredRepresentation() {
  //   return new Promise((resolve) => {
  //     Object.values(this.cells).forEach((cellValue) => {
  //       const { type, value } = cellValue;
  //       // console.log(type);
  //       if (!type?.includes('.')) return;
  //       if (!value) return;
  //       console.log(type);
  //       const { parthSource: sourceName } = parseType(type);
  //       store.dispatch('DataTable/REQUEST_DATA_ITEM', {
  //         tableName: sourceName,
  //         id: value,
  //       }).then(() => {
  //         console.log(store
  //           .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: value }));
  //       });
  //     });
  //   });
  // }

  fillArea(dataArea, parameters) {
    super.fillArea(dataArea, parameters);
    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      if (Object.keys(cellValue).includes('type') && cellValue.type.includes('field')) {
        cellValue.representation = this.getRepresentation(cellValue.value);
      }
    });
  }

  getRepresentation(key) {
    let representation = 'none';
    if (this.representations.has(key)) representation = this.representations.get(key);
    return representation;
  }

  setRepresentation(key, value) {
    console.log(key, value);
    this.representations.set(key, value);
    this.cells = { ...this.cells };
  }
}

export default TableDocumentApi;
