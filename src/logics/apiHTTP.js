import axios from 'axios';

export default class ApiHttp {
  constructor(baseURL) {
    this.require = axios.create({
      baseURL,
      headers: {},
    });
  }

  async authorization(userName, userPassword) {
    let userToken = null;
    try {
      const response = await this.require.post('api-token-auth/', {
        username: userName,
        password: userPassword,
      });
      userToken = response.data.token;
      this.setHeaderToken(userToken);
    } catch (err) {
      console.log(err);
    }
    return userToken;
  }

  setHeaderToken(token) {
    this.require.defaults.headers.common = { Authorization: `Token ${token}` };
  }

  setHeaderURL(url) {
    this.require.defaults.headers.common = { baseURL: url };
  }
}
