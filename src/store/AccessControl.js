export default {
  namespaced: true,
  state: {
    // dataTableControl: {
    //   catalog: new Set([
    //     'adding',
    //     'addingInline',
    //     'addingGroup',
    //     'editing',
    //     'markDelete',
    //     'recycle',
    //     'filters',
    //   ]),
    //   informationRegister: new Set([
    //     'adding',
    //     'editing',
    //   ]),
    // },
    catalog: {
      dataTableControl: new Set([
        'adding',
        'addingInline',
        'addingGroup',
        'editing',
        'markDelete',
        'recycle',
        'filters',
      ]),
      dataTable: {},
    },
    informationRegister: {
      dataTableControl: new Set([
        'adding',
        'editing',
      ])
    },
  },
  getters: {
    GET_DATATABLE_CONTROL:(state) => (option) => { return state[option.type].dataTableControl; },
  },
  mutations: {},
  actions: {},
}