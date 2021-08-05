import ApiHttp from './ApiHttp';
import apiLocalStorages from './ApiLocalStorages';

export default class ApiApp extends ApiHttp {
  // constructor(baseURL) {
  //   super(baseURL);
  // }

  async authorization(userName, userPassword) {
    if (userName === undefined && userPassword === undefined) {
      const userToken = apiLocalStorages.getValue('Token');
      if (userToken) {
        this.setHeaderToken(userToken);
        return;
      }
    }
    super.authorization(userName, userPassword);
  }

  async deleteElement(sourceName, elementId) {
    let response = null;
    try {
      response = await this.require.get(`api/v1/${sourceName}/${elementId}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async getElements(sourceName, parametersURL) {
    let response = null;
    try {
      response = await this.require.get(`api/v1/${sourceName}/?${parametersURL}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async getOptions(sourceName) {
    let response = null;
    try {
      response = await this.require.options(`api/v1/${sourceName}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async postElement(sourceName, formData) {
    let response = null;
    try {
      response = await this.require.post(`api/v1/${sourceName}`, formData);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async updateElement(sourceName, formData, elementId) {
    let response = null;
    try {
      response = await this.require.put(`api/v1/${sourceName}/${elementId}`, formData);
    } catch (err) {
      console.log(err);
    }
    return response;
  }
}
