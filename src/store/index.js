import Vue from 'vue'
import Vuex from 'vuex'

import Login from './Login.js';
import DataTable from './DataTable/DataTable.js';
import AccessControl from './AccessControl.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    addressApi: 'https://an67.pythonanywhere.com/',
  },
  getters: {
    GET_ADDRESS_API(state) { return state.addressApi; },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Login,
    DataTable,
    AccessControl,
  }
})
