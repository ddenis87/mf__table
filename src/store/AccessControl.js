export default {
  namespaced: true,
  state: {
    catalog: {
      dataTableControl: new Set([
        'adding',
        'addingInline',
        'addingGroup',
        'editing',
        'markDelete',
        'recycle',
        'filters',
      ])
      // dataTableControl: {
      //   adding: true,
      //   addingInline: true,
      //   addingGroup: true,
      //   editing: true,
      //   markDelete: true,
      //   recycle: true,
      //   filter: true,
      // },
    },
    informationRegister: {
      dataTableControl: new Set([
        'adding',
        'editing',
      ])
      // {
      //   adding: true,
      //   addingInline: false,
      //   edititng: true,
      //   markDelete: true,
      //   recycle: true,
      //   filter: true,
      // },
    },
  },
  getters: {
    GET_DATATABLE_CONTROL:(state) => (option) => { return state[option.type].dataTableControl; },
  },
  mutations: {},
  actions: {},
}