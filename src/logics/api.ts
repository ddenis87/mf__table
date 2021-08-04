import ApiHTTP from './apiHTTP';
// import apiLocalStorage from './apiLocalStorage';

export default class Api extends ApiHTTP {
  // constructor(baseURL: string) {
  //   super(baseURL);
  // }
  authorization(userName: string, userPassword: string): string {
    this.setHeaderToken('token');
    return `${userName} ${userPassword}`;
  }
  // authorization(userName: string, userPassword: string) {
  //   let userToken = null; // this.apiLocalStorage.getValue('Token');
  //   // console.log(userToken);
  //   // if (!userName || !)
  //   // if (userToken) return userToken;

  //   try {
  //     const response = this.require.post('api-token-auth/', {
  //       username: userName,
  //       password: userPassword,
  //     });
  //     userToken = response.data.token;
  //     this.setHeaderToken(userToken);
  //     // this.apiLocalStorage.setValue('Token', userToken);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   // } finally {
  //   return userToken;
  //   // }
  // }

  // async authorizationLocalStorages() {
  //   const userToken = this.apiLocalStorage.getValue('Token');
  //   return userToken;
  // }

  // logout() {
  //   this.apiLocalStorage.deleteValue('Token');
  // }
}
