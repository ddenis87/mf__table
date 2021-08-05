import Vue from 'vue'
import Vuex from 'vuex'

// import gState from '@/logics/store/state';
import ApiApp from '../logics/ApiApp';
import Login from './Login.js';
import DataTable from './DataTable/DataTable.js';
import AccessControl from './AccessControl.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // ...gState,
    // addressApi: 'https://an67.pythonanywhere.com/',
    // addressApi: 'http://test.digitatl.ru/',
    apiApp: new ApiApp('http://195.2.84.28/'),
    addressApi: 'http://195.2.84.28/',
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
