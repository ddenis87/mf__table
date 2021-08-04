import store from '@/store';

export default {
  hasAuthorization() {
    return store.getters['Login/hasAuthorization'];
  },

  async authorization(userName, userPassword) {
    console.log('component logic');
    await store.dispatch('Login/authorization', {
      userName,
      userPassword,
    });
    return true;
  },

  async authorizationLocalStorages() {
    const userToken = await store.dispatch('Login/authorizationLocalStorages', {});
    return userToken || false;
  },

  logout() {
    store.dispatch('Login/logout');
  },
};
