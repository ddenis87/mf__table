export default {
  // actions
  async authorization(state, options) {
    const { api } = state.rootState;
    const { userName, userPassword } = options;
    const userToken = await api.authorization(userName, userPassword);
    state.commit('setUserToken', { userToken });
    return true;
    // console.log(state.rootState.api);

    // console.log('store logic');
    // console.log(state, options);
  },

  async authorizationLocalStorages(state) {
    const { api } = state.rootState;
    const userToken = await api.authorizationLocalStorages();
    state.commit('setUserToken', { userToken });
    return userToken;
  },

  logout(state) {
    const { api } = state.rootState;
    api.logout();
  },
};
