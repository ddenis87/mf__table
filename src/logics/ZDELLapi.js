import ApiHTTP from './ZDELapiHTTP';
// import apiLocalStorages from './apiLocalStorages';

export default class {
  constructor(baseURL) {
    this.apiHTTP = new ApiHTTP(baseURL);
    this.apiLocalStorage = apiLocalStorage;
  }

  async authorization(userName, userPassword) {
    let userToken = null; // this.apiLocalStorage.getValue('Token');
    // console.log(userToken);
    // if (!userName || !)
    // if (userToken) return userToken;

    try {
      const response = await this.apiHTTP.require.post('api-token-auth/', {
        username: userName,
        password: userPassword,
      });
      userToken = response.data.token;
      this.apiHTTP.setHeaderToken(userToken);
      this.apiLocalStorage.setValue('Token', userToken);
    } catch (err) {
      console.log(err);
    }
    // } finally {
    return userToken;
    // }
  }

  async authorizationLocalStorages() {
    const userToken = this.apiLocalStorage.getValue('Token');
    return userToken;
  }

  logout() {
    this.apiLocalStorage.deleteValue('Token');
  }
}