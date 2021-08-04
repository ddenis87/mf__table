export default {
  deleteUserToken(state) {
    state.userToken = null;
  },

  setUserToken(state, options) {
    state.userToken = options.userToken;
  },
};
