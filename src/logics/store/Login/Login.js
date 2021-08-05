import apiLocalStorages from '@/logics/ApiLocalStorages';

export default {
  state: {
    userName: null,
  },
  getters: {
    hasAuthorization(state) {
      return state.userName || null;
    },
  },
  mutations: {
    deleteUserName(state) {
      state.userName = null;
    },

    setUserName(state, options) {
      state.userName = options.userName;
    },
  },
  actions: {
    async authorization(state, options) {
      const { apiApp } = state.rootState;
      const { userName, userPassword } = options;
      // const userName = await apiApp.authorization(userName, userPassword);
      // console.log(state);
      console.log('store logic login');
      const userToken = await apiApp.authorization(userName, userPassword);
      state.commit('setUserName', { userName });
      return userToken;
    },

    logout(state) {
      apiLocalStorages.deleteValue('userToken');
      apiLocalStorages.deleteValue('userName');
      apiLocalStorages.deleteValue('userPassword');
      state.commit('deleteUserName');
    },
  },
};
