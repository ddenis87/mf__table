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

// function getRepresentationAtStore(sourceName, value, relatedModelView) {
//   const representation = store
//     .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({
//       tableName: sourceName,
//       id: value,
//       relatedModelView,
//     });
//   return representation;
// }

class TableDocumentApi extends TableDocument {
  // constructor(params) {
  //   super(params);
  //   console.log(this.columnCount);
  //   // this.prepareRepresentation();
  // }

  // BASE_CLASS = TableDocumentApi; // заменить на this.constructor

  representations = new Map();

  async deserialize(data, template, settings) {
    try {
      super.deserialize(data, template, settings);
    } finally {
      await this.prepareRepresentation();
      // super.recalculateFormulas();
    }
  }

  editingCell(sheet, cellName, cellValue) {
    if (this.getCell(sheet, cellName) && cellValue) {
      const { type, relatedModelView } = this.getCell(sheet, cellName);
      if (type?.includes('field')) {
        const { parthSource: sourceName } = parseType(type);
        const representation = store
          .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: cellValue, relatedModelView });
        this.setRepresentation(cellValue, representation);
      }
    }
    super.editingCell(sheet, cellName, cellValue);
  }

  // async getRepresentationStore() { // getRepresentationAtApi
  //   const promises = Object.values(this.cells).map(async (cellValue) => {
  //     const { type, value, relatedModelView } = cellValue;
  //     if (type?.includes('field') && value) {
  //       const { parthSource: sourceName } = parseType(type);
  //       await requestRepresentation(sourceName, value);
  //       const representation = store
  //         .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: value, relatedModelView });
  //       this.setRepresentation(value, representation);
  //     }
  //   });
  //   await Promise.all(promises);
  // }
  async getRepresentationStore() { // getRepresentationAtApi
    const promises = this.sheetsList.map(async (sheet) => {
      const prom = Object.values(this.sheets[sheet.name].cells).map(async (cellValue) => {
        const { type, value, relatedModelView } = cellValue;
        if (type?.includes('field') && value) {
          // console.log(type, value, relatedModelView);
          const { parthSource: sourceName } = parseType(type);
          await requestRepresentation(sourceName, value);
          const representation = store
            .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: +value, relatedModelView });
          // console.log(representation);
          this.setRepresentation(value, representation);
        }
      });
      await Promise.all(prom);
    });
    await Promise.all(promises);
    // const promises = Object.values(this.cells).map(async (cellValue) => {
    //   const { type, value, relatedModelView } = cellValue;
    //   if (type?.includes('field') && value) {
    //     const { parthSource: sourceName } = parseType(type);
    //     await requestRepresentation(sourceName, value);
    //     const representation = store
    //       .getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({ tableName: sourceName, id: value, relatedModelView });
    //     this.setRepresentation(value, representation);
    //   }
    // });
    // await Promise.all(promises);
  }

  getDocument(sheet, JSONFormat = false) {
    const cells = {};
    Object.entries(this.sheets[sheet].cells).forEach((cell) => {
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
      rows: this.sheets[sheet].rows,
      rowCount: this.sheets[sheet].rowCount,
      columns: this.sheets[sheet].columns,
      columnCount: this.sheets[sheet].columnCount,
      cells,
      styles: this.styles
        .filter((style) => style.name.split('|')[0] === sheet)
        .map((st) => {
          const item = {
            name: st.name.split('|')[1],
            list: st.list,
          };
          return item;
        }),
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
    // console.log('before await');
    await this.getRepresentationStore(); // .then(() => {
    // console.log('after await');
    this.sheetsList.forEach((sheet) => {
      this.sheets[sheet.name].cells = { ...this.sheets[sheet.name].cells };
    });
    // this.sheets = { ...this.sheets };
    // });
  }

  setRepresentation(key, value) {
    this.representations.set(key, value);
  }
}

export default TableDocumentApi;
