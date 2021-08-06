import ApiHttp from './ApiHTTP';

export default class ApiRest extends ApiHttp {
  async create(sourceName, formData) {
    let response = null;
    try {
      response = await this.require.post(`api/v1/${sourceName}/`, formData);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async delete(sourceName, elementId) {
    let response = null;
    try {
      response = await this.require.delete(`api/v1/${sourceName}/${elementId}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async getAll(sourceName, parametersURL) {
    let response = null;
    try {
      response = await this.require.get(`api/v1/${sourceName}/?${parametersURL}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async get(sourceName, elementId) {
    let response = null;
    try {
      response = await this.require.get(`api/v1/${sourceName}/?id=${elementId}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async options(sourceName) {
    let response = null;
    try {
      response = await this.require.options(`api/v1/${sourceName}`);
    } catch (err) {
      console.log(err);
    }
    return response;
  }

  async update(sourceName, formData, elementId) {
    let response = null;
    try {
      response = await this.require.put(`api/v1/${sourceName}/${elementId}/`, formData);
    } catch (err) {
      console.log(err);
    }
    return response;
  }
}
