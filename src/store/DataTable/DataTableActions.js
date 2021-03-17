import axios from 'axios';

export default {
  CREATE_TABLE_DATA_SPACE(state, option) {
    return new Promise((resolve, reject) => {
      state.commit('CREATE_TABLE_DATA_SPACE', option);
      if (option.defaultFilters)
        state.commit('SET_FILTER_DEFAULT', option);
      state.dispatch('REQUEST_OPTIONS', option) // Не запрашивать когда повторное открытие?
        .then(() => {
          state.dispatch('REQUEST_DATA', option)
            .then(() => {
              resolve();
            })
        })
    });
  },
  DELETE_TABLE_DATA_SPACE(state, option) {
    state.commit('DELETE_TABLE_DATA_SPACE', option);
  },

  // ----NAVIGATION GROUP-------------------------------------------------------
  SELECTED_GROUP(state, option) {
    state.commit('CHANGE_DATA_GROUP_LEGEND', option);
    state.commit('SET_FILTER_PARENT', option);
    state.commit('CLEAR_DATA', option);
    state.dispatch('REQUEST_DATA', option);
  },
  // ---------------------------------------------------------------------------

  // ----FILTERS----------------------------------------------------------------
  // ----УСТАНОВКА ФИЛЬТРОВ ПО УМОЛЧАНИЮ----------------------------------------
  SET_FILTER_DEFAULT(state, option) {
    state.commit('SET_FILTER_DEFAULT', option);
    if ('requestFalse' in option) return;
    state.commit('CLEAR_DATA', option);
    state.dispatch('REQUEST_DATA', option);
  },
  // ---------------------------------------------------------------------------

  // ----УСТАНОВКА РАСШИРЕННОГО ФИЛЬТА------------------------------------------
  SET_FILTER_EXTENDED(state, option) {
    state.commit('SET_FILTER_EXTENDED', option);
    if ('requestFalse' in option) return;
    state.commit('CLEAR_DATA', option);
    state.dispatch('REQUEST_DATA', option);
  },

  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  // ----ДОБАВЛЕНИЕ/УДАЛЕНИЕ ПУСТОЙ СТРОКИ В ДАННЫЕ-----------------------------
  ADDING_NEW_ELEMEN_INLINE(state, option) {
    return new Promise((resolve, reject) => {
      state.commit('ADDING_NEW_ELEMEN_INLINE', option);
      resolve();
    });
  },
  ADDING_NEW_ELEMEN_INLINE_FIELD(state, option) {
    return new Promise((resolve, reject) => {
      console.log('action ADDING_NEW_ELEMEN_INLINE_FIELD')
      state.commit('ADDING_NEW_ELEMEN_INLINE_FIELD', option);
      resolve();
    });
  },
  ADDING_NEW_ELEMENT(state, option) {
    // state.commit('SET_FILTER_DEFAULT', Object.assign(option, {})); ????
    // state.commit('CLEAR_DATA', option);
    return new Promise((resolve, reject) => {
      state.dispatch('REQUEST_ADDING', option)
        .then((response) => {
          console.log(response);
          // Отчистить Data запросить данные если добавляем не в строке
          // response должен содержать id созданного элемента
          state.commit('CLEAR_DATA', option);
          state.dispatch('REQUEST_DATA', Object.assign(option, {id: response.data.id}))
            .then(() => {
              resolve(response.data.id);
            })
        })
    });
  },

  DELETING_NEW_ELEMENT_INLINE(state, option) {
    return new Promise((resolve, reject) => {
      state.commit('DELETING_NEW_ELEMENT_INLINE', option);
      resolve();
    });
  },
  // ---------------------------------------------------------------------------

  // ----ОБНОВЛЕНИЕ ПОЛЕЙ ЭЛЕМЕНТА----------------------------------------------
  UPDATE_ELEMENT_FIELD(state, option) {
    return new Promise((resolve, reject) => {

      state.dispatch('REQUEST_UPDATE', option)
        .then((response) => {
          
        })
    });
  },
  // ---------------------------------------------------------------------------

  // ----ОБНОВЛЕНИЕ ЭЛЕМЕНТА----------------------------------------------------
  UPDATE_ELEMENT(state, option) {
    return new Promise((resolve, reject) => {
      state.dispatch('REQUEST_UPDATE', option)
        .then((response) => {
          // Перезапросить данные ????
          state.commit('CLEAR_DATA', option);
          state.dispatch('REQUEST_DATA', option);
        })
    });
  },
  // ---------------------------------------------------------------------------

  // ----ПОМЕТКА НА УДАЛЕНИЕ ЭЛЕМЕНТА-------------------------------------------
  MARK_DELETED_ELEMENT(state, option) {
    return new Promise((resolve, reject) => {
      state.dispatch('REQUEST_MARK_DELETED', option)
        .then(() => {
          resolve();
        })
    });
  },
  // ---------------------------------------------------------------------------

  // ----ДОБАВЛЕНИЕ ССЫЛКИ В ССЫЛОЧНУЮ ТАБЛИЦУ---------------------------------- // ??
  ADDING_DATA_LINK(state, option) {
    return new Promise((resolve, reject) => {
      state.commit('ADDING_DATA_LINK', option);
      resolve();
    });
  },
  // ---------------------------------------------------------------------------

  // ----МАРКЕРЫ СОБЫТИЙ--------------------------------------------------------
  MARK_EVENT_FILTER_EXTENDED_RESET(state, option) { state.commit('MARK_EVENT_FILTER_EXTENDED_RESET', option); },
  MARK_EVENT_FILTER_EXTENDED_OFF(state, option) { state.commit('MARK_EVENT_FILTER_EXTENDED_OFF', option); },


  // REQUEST API
  // ПОЛУЧЕНИЕ OPTIONS
  REQUEST_OPTIONS(state, option) {
    let addressApi = state.getters.GET_ADDRESS_API('options', option.tableName);
    let tokenAccess = state.rootGetters['Login/GET_USER_TOKEN_ACCESS'];
    axios.defaults.headers.common = {'Authorization': tokenAccess};
    return new Promise((resolve, reject) => {
      state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
      axios
        .options(addressApi)
        .then(response => {
          let sendOption = {
            tableName: option.tableName,
            guid: option.guid,
            description: response.data.description,
            data: JSON.parse(response.request.response).actions.POST
          };
          state.commit('SET_OPTIONS', sendOption);
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject();
        })
        .finally(() => {
          state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
        });
      });
  },

  REQUEST_DATA(state, option) {
    let filterApi = state.getters.GET_FILTER_API(option);
    let filterExtended = state.getters.GET_FILTER_EXTENDED(option);
    let addressApi = state.getters.GET_ADDRESS_API('get', option.tableName) + filterApi + filterExtended;
    if ('next' in option) addressApi = state.getters.GET_ADDRESS_API_NEXT(option);
    if ('previous' in option) addressApi = state.getters.GET_ADDRESS_API_PREVIOUS(option);
    if ('id' in option) addressApi += `&page_by_id=${option.id}`;

    console.log(addressApi);
    let sendOption = { // Заменить на option
      tableName: option.tableName,
      guid: option.guid,
    };
    return new Promise((resolve, reject) => {
      if (!'hidden' in option)
        state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
      axios
        .get(addressApi)
        .then(response => {
          state.commit('SET_DATA_OPTIONS', Object.assign(sendOption, {data: response.data}));
          response.data.results.forEach(element => {
            for (let key of Object.keys(element)) {
              let options = state.state[option.tableName].listOptions[key];
              switch(options.type) {
                case 'choice': {
                  element[key] = options.choices.find(item => item.value == element[key]);
                  break;
                }
                case 'field': {
                  if (!element[key]) break; // ЕСЛИ ЗНАЧЕНИЕ NULL
                  let relatedModelName = options['related_model_name']
                  if (!state.state[relatedModelName].listData.find(item => item.id == element[key].id)) { // Если значение не найдено
                    state.commit('SET_DATA', {
                      tableName: relatedModelName,
                      value: element[key],
                    });
                  } // else Если есть, то возможно обновляем
                  element[key] = state.state[relatedModelName].listData.find(item => item.id == element[key].id)
                }
              }
            }

            if (!state.state[option.tableName].listData.find(item => item.id == element.id)) {
              state.commit('SET_DATA', {
                tableName: option.tableName,
                value: element,
              });
            }
            sendOption.value = state.state[option.tableName].listData.find(item => item.id == element.id);
            state.commit('SET_DATA', sendOption);
          });
          console.log(state.state);
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject();
        })
        .finally(() => {
          state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
        });
    });
  },

  REQUEST_ADDING(state, option) {
    let addressApi = state.getters.GET_ADDRESS_API('post', option.tableName);
    return new Promise((resolve, reject) => {
      state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
      axios
       .post(addressApi, option.formData)
       .then(response => {
         console.log(response);
         resolve(response);
       })
       .catch(err => {
        console.log(err);
        reject(err);
      })
      .finally(() => {
        state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
      });
    });
  },

  REQUEST_UPDATE(state, option) {
    let addressApi = state.getters.GET_ADDRESS_API('update', option.tableName);
    addressApi += `${option.id}/`;
    return new Promise((resolve, reject) => {
      state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
      axios
        .put(addressApi, option.formData)
        .then(response => {
          console.log(response);

          resolve();
        })
        .catch(err => {
         console.log(err);
         reject(err);
        })
        .finally(() => {
         state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
        });
    });
  },

  REQUEST_MARK_DELETED(state, option) {
    let addressApi = state.getters.GET_ADDRESS_API('delete', option.tableName);
    addressApi += `${option.id}`;
    return new Promise((resolve, reject) => {
      state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
      axios
        .delete(addressApi)
        .then(response => {
          console.log(response);
          state.commit('MARK_DELETED_ELEMENT', option);
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject(err);
         })
         .finally(() => {
          state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
         });
    });
  }
}