import getters from './DataTableGetters.js';
import mutations from './DataTableMutations.js';
import actions from './DataTableActions.js';

class TableDataBase {
  constructor({relatedModelView = '{id}'}) {
    this.relatedModelView = relatedModelView;
  }
  description = null;
  // tableDataCount = 0; // в GUID
  isHierarchyMode = null;  // HIERARCHICAL TABLE SET WHEN LOADING OPTIONS
  relatedModelView = ''; // шаблон представление таблицы в других таблицах, компонентах, и т.д. ///DELETE
  listOptions = {};
  listData = [];  // МАССИВ ДАННЫХ  !!!!!
};

class DataHistory {
  constructor({relatedModelView = '{id}'}) {
    this.relatedModelView = relatedModelView;
  }
  description = null;
  listOptions = {};
  listData = [];  // МАССИВ ДАННЫХ  !!!!!

};

export default {
  namespaced: true,
  state: {
    "budgetclassification": new TableDataBase({ relatedModelView: '{head_code} - {head_name}' }),
    "organization": new TableDataBase({ relatedModelView: '{title}' }),

    "actualdesc": new TableDataBase({ relatedModelView: '{some_desc}' }),
  },
  getters,
  mutations,
  actions,
}