import store from '@/store';
import apiLocalStorages from '@/logics/ApiLocalStorages';

export default {
  hasAuthorization() {
    return store.getters['Login/hasAuthorization'];
  },

  hasAuthorizationLS() {
    const userToken = apiLocalStorages.getValue('userToken');
    if (userToken) store.state.apiApp.setHeaderToken(userToken);
  },

  async authorization(userName, userPassword) {
    console.log('view logic - login authorization');
    const userToken = await store.dispatch('Login/authorization', {
      userName,
      userPassword,
    });
    console.log(`view logic - after dispatch ${userToken}`);
    apiLocalStorages.setValue('userName', userName);
    apiLocalStorages.setValue('userPassword', userPassword);
    apiLocalStorages.setValue('userToken', userToken);
    return true;
  },
};
