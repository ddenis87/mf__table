import getters from './DataTableGetters.js';
import mutations from './DataTableMutations.js';
import actions from './DataTableActions.js';

class DataTable {
  constructor({relatedModelView = '{id}'}) {
    this.relatedModelView = relatedModelView;
  }
  description = null;
  relatedModelView = ''; // шаблон представление таблицы в других таблицах, компонентах, и т.д. ///DELETE
  // isHierarchyMode = false;  // HIERARCHICAL TABLE SET WHEN LOADING OPTIONS

  listOptions = {};
  listData = [];  // МАССИВ ДАННЫХ  !!!!!

  extra_actions = {};
}

export default {
  namespaced: true,
  state: {
    "budgetclassification": new DataTable({ relatedModelView: '{head_code} - {head_name}' }),
    "organization": new DataTable({ relatedModelView: '{title}' }),

    "actualdesc": new DataTable({ relatedModelView: '{some_desc}' }),
  },
  getters,
  mutations,
  actions,
}