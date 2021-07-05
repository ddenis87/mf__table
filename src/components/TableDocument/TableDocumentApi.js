// import store from '@/store/index';
import TableDocument from './TableDocument';
import {
  getParseAtSymbolDigit,
  getRangeType,
  moveCell,
  moveRange,
} from './Helpers';
// function getRepresentationStore(sourceName, id) {
//   const representationValue = store
//     .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id });
//   return representationValue;
// }

class TableDocumentApi extends TableDocument {
  // constructor(params) {
  //   super(params);
  //   // Object.values(this.cells).forEach((cellValue) => {
  //   //   const { type, representationId, sourceName } = cellValue;
  //   //   if (type !== 'field') return;
  //   //   const representationValue = getRepresentationStore(sourceName, representationId);
  //   //   this.setRepresentation(representationId, representationValue);
  //   // });
  // }

  representations = new Map();

  fillArea(dataArea, parameters) {
    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      const parameterName = cellValue?.parameter || null;
      if (!parameterName) return;
      const parameterNameData = parameters[parameterName] || parameterName;
      if (!parameterName || !dataArea[parameterNameData]) return;
      cellValue.value = dataArea[parameterNameData];
      if (Object.keys(cellValue).includes('type') && cellValue.type.includes('field')) {
        cellValue.representation = this.getRepresentation(cellValue.value);
      }
    });
  }

  getAreaCopy() {
    const {
      rows, columns, cells, styles, scripts, namedAreas,
    } = JSON.parse(JSON.stringify({
      rows: this.rows,
      columns: this.columns,
      cells: this.cells,
      styles: this.styles,
      scripts: this.scripts,
      namedAreas: this.namedAreas,
    }));
    return new TableDocumentApi({
      rangeType: this.rangeType,
      rows,
      rowCount: this.rowCount,
      columns,
      columnCount: this.columnCount,
      cells,
      styles,
      scripts,
      namedAreas,
    });
  }

  getAreaForRange(range) {
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [];
    const scripts = {};
    const cellsInRange = this.getCellsInRange(range);
    cellsInRange.forEach((cell) => {
      const [cellNameCurrent, cellValueCurrent] = cell;
      const cellNameShift = moveCell(cellNameCurrent, undefined, range);
      const { parthSymbol: cellColumnCurrent, parthDigit: cellRowCurrent } = getParseAtSymbolDigit(cellNameCurrent);
      const { parthSymbol: cellColumnShift, parthDigit: cellRowShift } = getParseAtSymbolDigit(cellNameShift);

      cells[cellNameShift] = this.cells[cellNameCurrent];
      columns[cellColumnShift] = this.columns[cellColumnCurrent];
      rows[cellRowShift] = this.rows[cellRowCurrent];

      const cellStyles = this.getCellStyles(cellNameCurrent);
      if (cellStyles) styles.push(cellStyles);

      if (Object.keys(cellValueCurrent).includes('action')) {
        const actionName = cellValueCurrent.action;
        const script = Object.entries(this.scripts).find((scriptItem) => scriptItem[0] === actionName);
        if (script) {
          scripts[actionName] = this.scripts[actionName];
        }
      }
    });
    const listNamedAreas = this.getListNamedAreasForRange(range);
    listNamedAreas.forEach((namedArea) => {
      namedAreas.push({
        name: namedArea.name,
        range: moveRange(namedArea.range.toLowerCase(), 1, range),
      });
    });
    return new TableDocumentApi({
      methodName: (getRangeType(range) === 'row') ? 'put' : 'join', // ??????
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      columnCount: Object.keys(columns).length,
      cells,
      styles,
      scripts,
      namedAreas,
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
