import api from '@/api/apiFile';

export default {
  namespaced: true,
  state: {
    region: [],
  },
  getters: {
    /**
     * Получить список
     * @param {Object} state 
     * @param {String} listName 
     * @returns {Array<Object>}
     */
    getList:(state) => (listName) => {
      return state[listName];
    },
    /**
     * Получить элемент списка
     * @param {Object} state 
     * @param {{ listName, value }} options 
     * @returns {Object}
     */
    getListItem:(state) => (options) => {
      return state[options.listName].find((item) => item.value === options.value) || null;
    },
  },
  mutations: {
    /**
     * Записать список в store
     * @param {Object} state 
     * @param {{ listName, JSONArray }} options 
     */
    SET_LIST(state, options) {
      state[options.listName] = options.JSONArray;
    },
  },
  actions: {
    /**
     * Читаем файлы списков
     * @param {Object} store 
     * @param {String} fileName 
     */
    async readList(state, fileName) {
      const JSONString = await import(`@/assets/lists/${fileName}.json`);
      const JSONArray = JSONString.default;
      state.commit('SET_LIST', { listName: fileName, JSONArray });
    },
  },
};
