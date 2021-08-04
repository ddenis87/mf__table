export default {
  // getters
  hasAuthorization(state) {
    return state.userToken || null;
  },
};
