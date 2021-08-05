import axios from 'axios';

export default class {
  constructor(baseUrl) {
    this.require = axios.create({
      baseURL: baseUrl,
      headers: {},
    });
  }

  setHeaderToken(token) {
    this.require.defaults.headers.common = { Authorization: `Token ${token}` };
  }

  // async authorization(userName, userPassword) {
  //   try {
  //     const response = await this.ax.post('api-token-auth/', {
  //       username: userName,
  //       password: userPassword,
  //     });
  //     this.ax.defaults.headers.common = { Authorization: `Token ${response.data.token}` };
  //   } catch (err) {
  //     console.log(err.response.data);
  //   }
  // }

  // async getOptions(sourceName) {
  //   try {
  //     const response = await this.ax.options(`api/v1/${sourceName}`);
  //     console.log(response);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}
