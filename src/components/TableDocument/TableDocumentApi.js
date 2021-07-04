import store from '@/store/index';
import TableDocument from './TableDocument';

function getRepresentationStore(sourceName, id) {
  const representationValue = store
    .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id });
  return representationValue;
}

class TableDocumentApi extends TableDocument {
  constructor(params) {
    super(params);
    // Object.values(this.cells).forEach((cellValue) => {
    //   const { type, representationId, sourceName } = cellValue;
    //   if (type !== 'field') return;
    //   const representationValue = getRepresentationStore(sourceName, representationId);
    //   this.setRepresentation(representationId, representationValue);
    // });
  }

  representations = new Map();

  fillArea(dataArea, parameters) {
    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      const parameterName = cellValue?.parameter || null;
      if (!parameterName) return;
      const parameterNameData = parameters[parameterName] || parameterName;
      if (!parameterName || !dataArea[parameterNameData]) return;
      cellValue.value = dataArea[parameterNameData];

      if (cellValue.type && cellValue.type.includes('field')) {

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
