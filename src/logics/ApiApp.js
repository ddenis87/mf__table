import ApiHttp from './ApiHTTP';
// import apiLocalStorages from './ApiLocalStorages';

export default class ApiApp extends ApiHttp {
  async deleteListItem(sourceName, elementId) {
    let response = null;
    try {
      response = await this.require.delete(`api/v1/${sourceName}/${elementId}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async getList(sourceName, parametersURL) {
    let response = null;
    try {
      response = await this.require.get(`api/v1/${sourceName}/?${parametersURL}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async getListItem(sourceName, elementId) {
    let response = null;
    try {
      response = await this.require.get(`api/v1/${sourceName}/?id=${elementId}`);
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

  async addListItem(sourceName, formData) {
    let response = null;
    try {
      response = await this.require.post(`api/v1/${sourceName}/`, formData);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async updateListItem(sourceName, formData, elementId) {
    let response = null;
    try {
      response = await this.require.put(`api/v1/${sourceName}/${elementId}/`, formData);
    } catch (err) {
      console.log(err);
    }
    return response;
  }
}
