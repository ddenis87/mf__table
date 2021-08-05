import store from '@/store';

export default {
  hasAuthorization() {
    return store.getters['Login/hasAuthorization'];
  },

  async authorization(userName, userPassword) {
    await store.dispatch('Login/authorization', {
      userName,
      userPassword,
    });
    return true;
  },
};
