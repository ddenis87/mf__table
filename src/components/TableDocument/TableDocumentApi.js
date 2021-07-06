import store from '@/store/index';
import TableDocument from './TableDocument';

function getRepresentationStore(sourceName, id) {
  let representationValue = store
    .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id });
  if (representationValue === undefined) {
    store.dispatch('DataTable/REQUEST_DATA_ITEM', {
      tableName: sourceName,
      id,
    }).then(() => {
      representationValue = store
        .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id });
      return representationValue;
    }).catch(() => representationValue);
  }
}

class TableDocumentApi extends TableDocument {
  constructor(params) {
    super(params);
    Object.values(this.cells).forEach((cellValue) => {
      console.log(cellValue);
      const { type, representationId, sourceName } = cellValue;
      if (type !== 'field') return;
      const representationValue = getRepresentationStore(sourceName, representationId);
      this.setRepresentation(representationId, representationValue);
    });
  }

  BASE_CLASS = TableDocumentApi;

  representations = new Map();

  fillArea(dataArea, parameters) {
    super.fillArea(dataArea, parameters);

    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      if (Object.keys(cellValue).includes('type') && cellValue.type.includes('field')) {
        cellValue.representation = this.getRepresentation(cellValue.value);
        // cellValue.representation = getRepresentationStore(cellValue.type.split('.')[1], cellValue.value);
      }
    });
  }

  getRepresentation(key) {
    let representation = 'none';
    if (this.representations.has(key)) representation = this.representations(key);
    return representation;
  }

  setRepresentation(key, value) {
    this.representations.set(key, value);
  }
}

export default TableDocumentApi;
