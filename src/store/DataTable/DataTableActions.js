import axios from 'axios';

export default {
  // CREATE_TABLE_DATA_SPACE(state, option) {
  //   return new Promise(async (resolve, reject) => {
  //     state.commit('CREATE_TABLE_DATA_SPACE', option);
  //     if (option.defaultFilters)
  //       state.commit('SET_FILTER_DEFAULT', option);
  //     await state.dispatch('REQUEST_OPTIONS', option) // Не запрашивать когда повторное открытие?
  //       // .then(() => {
  //     await state.dispatch('REQUEST_DATA', option)
  //           // .then(() => {
  //             // console.log(state);
  //     resolve();
  //           // })
  //       // })
  //   });
  // },

  async CREATE_TABLE_DATA_SPACE(state, option) {
    state.commit('CREATE_TABLE_DATA_SPACE', option);
    if (option.defaultFilters) state.commit('SET_FILTER_DEFAULT', option);
    await state.dispatch('REQUEST_OPTIONS', option) // Не запрашивать когда повторное открытие?
    await state.dispatch('REQUEST_DATA', option)
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

  // ----TOGGLE HIERARCHY MODE--------------------------------------------------
  TOGGLE_HIERARCHY_MODE(state, option) {
    if (state.state[option.tableName][option.guid].propsTable.isHierarchy) {
      state.state[option.tableName][option.guid].propsTable.isHierarchy = false;
      state.commit('CLEAR_DATA_GROUP_LEGEND', option);
      state.dispatch('SET_FILTER_DEFAULT', Object.assign(option, {
        defaultFilters: {
          'ordering': null,
          'parent__isnull': null,
          'parent': null,
          'is_group': null,
        }
      }));
    } else {
      state.state[option.tableName][option.guid].propsTable.isHierarchy = true;
      state.dispatch('SET_FILTER_DEFAULT', Object.assign(option, {
        defaultFilters: {
          'ordering': '-is_group',
          'parent__isnull': true,
        }
      }));
    }
  },
  // ---------------------------------------------------------------------------
  RESET_TABLE(state, option) {
    state.commit('SET_FILTER_DEFAULT', option);
    state.commit('CLEAR_DATA', option);
    state.commit('CLEAR_DATA_GROUP_LEGEND', option);
    state.commit('SET_FILTER_EXTENDED', {value: null, ...option});
    state.dispatch('REQUEST_DATA', option);
  },
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
  async SET_FILTER_EXTENDED(state, option) {
    state.commit('SET_FILTER_EXTENDED', option);
    if ('requestFalse' in option) return;
    state.commit('CLEAR_DATA', option);
    await state.dispatch('REQUEST_DATA', option);
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
      // console.log('action ADDING_NEW_ELEMEN_INLINE_FIELD')
      state.commit('ADDING_NEW_ELEMEN_INLINE_FIELD', option);
      resolve();
    });
  },

  // ADDING_NEW_ELEMENT(state, option) {
  //   // state.commit('SET_FILTER_DEFAULT', Object.assign(option, {})); ????
  //   // state.commit('CLEAR_DATA', option);
  //   return new Promise((resolve, reject) => {
  //     state.dispatch('REQUEST_ADDING', option)
  //       .then((response) => {
  //         console.log(response);
  //         state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //         // Отчистить Data запросить данные если добавляем не в строке
  //         // response должен содержать id созданного элемента
  //         state.commit('CLEAR_DATA', option); // перенесено в REQUEST_DATA ???
  //         state.dispatch('REQUEST_DATA', Object.assign(option, {id: response.data.id, previous: true}))
  //           .then(() => {
  //             console.log('request data iz adding element')
  //             resolve(response.data.id);
  //           })
  //       })
  //   });
  // },
  // async ADDING_NEW_ELEMENT(state, options) {
  //   const response = await state.dispatch('REQUEST_ADDING', options)
  //   state.commit('SET_LOADING_API', Object.assign(options, { status: true }));
  //   state.commit('CLEAR_DATA', options); // перенесено в REQUEST_DATA ???
  //   await state.dispatch('REQUEST_DATA', Object.assign(options, {id: response.data.id, previous: true}))
  //   return response.data.id;
  // },

  async ADDING_NEW_ELEMENT(state, options) {
    const { apiRest } = state.rootState;
    state.commit('SET_LOADING_API', { ... options, status: true });

    const response = await apiRest.create(options.tableName, options.formData);
    state.commit('CLEAR_DATA', options); // перенесено в REQUEST_DATA ???

    await state.dispatch('REQUEST_DATA', { ...options, id: response.data.id, previous: true });
    state.commit('SET_LOADING_API', { ... options, status: true });
    return response.data.id;
  },

  DELETING_NEW_ELEMENT_INLINE(state, option) {
    return new Promise((resolve, reject) => {
      state.commit('DELETING_NEW_ELEMENT_INLINE', option);
      resolve();
    });
  },
  // ---------------------------------------------------------------------------

  // ----ОБНОВЛЕНИЕ ПОЛЕЙ ЭЛЕМЕНТА----------------------------------------------
  // UPDATE_ELEMENT_FIELD(state, option) {
  //   return new Promise((resolve, reject) => {

  //     state.dispatch('REQUEST_UPDATE', option)
  //       .then((response) => {
          
  //       })
  //   });
  // },
  async UPDATE_ELEMENT_FIELD(state, options) { // обновляет запись
    const { apiRest } = state.rootState;
    const { tableName: sourceName, formData, id: elementId } = options;
    state.commit('SET_LOADING_API', Object.assign(options, { status: true }));
    await apiRest.update(sourceName, formData, elementId);
    state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
  },
  // ---------------------------------------------------------------------------

  // ----ОБНОВЛЕНИЕ ЭЛЕМЕНТА----------------------------------------------------
  // UPDATE_ELEMENT(state, option) {
  //   return new Promise((resolve, reject) => {
  //     state.dispatch('REQUEST_UPDATE', option)
  //       .then((response) => {
  //         // Перезапрос данные
  //         let newOption = Object.assign({}, option);
  //         delete newOption.id;
  //         state.commit('CLEAR_DATA', newOption);
  //         state.dispatch('REQUEST_DATA', newOption);
  //       })
  //   });
  // },
  async UPDATE_ELEMENT(state, options) { // обновляет запись и перезапрашивает данные
    await state.dispatch('UPDATE_ELEMENT_FIELD', options);
    const { tableName, guid } = options;
    const sendOptions = {
      tableName,
      guid,
    };
    state.commit('CLEAR_DATA', sendOptions);
    state.dispatch('REQUEST_DATA', sendOptions);
  },
  // ---------------------------------------------------------------------------

  // ----ПОМЕТКА НА УДАЛЕНИЕ ЭЛЕМЕНТА-------------------------------------------
  // DELETED_ELEMENT(state, option) {
  //   return new Promise((resolve, reject) => {
  //     state.dispatch('REQUEST_MARK_DELETED', option)
  //       .then(() => {
  //         resolve();
  //       })
  //   });
  // },
  async DELETED_ELEMENT(state, options) {
    const { apiRest } = state.rootState;
    const { tableName: sourceName, id: elementId } = options;
    state.commit('SET_LOADING_API', Object.assign(options, { status: true }));
    // console.log(sourceName, elementId);
    const response = await apiRest.delete(sourceName, elementId);
    // console.log(response);
    state.commit('MARK_DELETED_ELEMENT', options);
    state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
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
  // MARK_EVENT_FILTER_EXTENDED_RESET(state, option) { state.commit('MARK_EVENT_FILTER_EXTENDED_RESET', option); },
  // MARK_EVENT_FILTER_EXTENDED_OFF(state, option) { state.commit('MARK_EVENT_FILTER_EXTENDED_OFF', option); },


  // REQUEST API
  // ПОЛУЧЕНИЕ OPTIONS
  async REQUEST_OPTIONS(state, options) {
    const { apiRest } = state.rootState;
    state.commit('SET_LOADING_API', Object.assign(options, { status: true }));
    const response = await apiRest.options(options.tableName);
    const sendOptions = {
      ...options,
      description: response.data.description,
      data: JSON.parse(response.request.response).actions.POST
    };
    state.commit('SET_OPTIONS', sendOptions);
    sendOptions.data = response.data.extra_actions;
    state.commit('SET_EXTRA_ACTIONS', sendOptions);
    state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
  },

  // REQUEST_OPTIONS(state, option) {
  //   let addressApi = state.getters.GET_ADDRESS_API('options', option.tableName);
  //   let tokenAccess = state.rootGetters['Login/GET_USER_TOKEN_ACCESS'];
  //   axios.defaults.headers.common = {'Authorization': tokenAccess};
  //   return new Promise((resolve, reject) => {
  //     state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //     axios
  //       .options(addressApi)
  //       .then(response => {
  //         // console.log(response);
  //         let sendOption = {
  //           tableName: option.tableName,
  //           guid: option.guid,
  //           description: response.data.description,
  //           data: JSON.parse(response.request.response).actions.POST
  //         };
  //         state.commit('SET_OPTIONS', sendOption);
  //         sendOption.data = response.data.extra_actions;
  //         state.commit('SET_EXTRA_ACTIONS', sendOption);
  //         resolve();
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         reject();
  //       })
  //       .finally(() => {
  //         state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //       });
  //     });
  // },

  // REQUEST_DATA_PREVIOUS(state, option) {
  //   let addressApi = state.getters.GET_LINK_PAGE_PREVIOUS(option);
  //   let sendOption = { // Заменить на option
  //     tableName: option.tableName,
  //     guid: option.guid,
  //   };
  //   return new Promise((resolve, reject) => {
  //     state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //     axios
  //         .get(addressApi)
  //         .then(response => {
  //           let buferData = [];
  //           state.commit('SET_DATA_OPTIONS_PRELOAD', Object.assign(sendOption, {data: response.data}));
  //           response.data.results.forEach(element => {
  //             for (let key of Object.keys(element)) {
  //               let options = state.state[option.tableName].listOptions[key];
  //               switch(options.type) {
  //                 case 'choice': {
  //                   element[key] = options.choices.find(item => item.value == element[key]);
  //                   break;
  //                 }
  //                 case 'field': {
  //                   if (!element[key]) break; // ЕСЛИ ЗНАЧЕНИЕ NULL
  //                   let relatedModelName = options['related_model_name']
  //                   if (!state.state[relatedModelName].listData.find(item => item.id == element[key].id)) { // Если значение не найдено
  //                     state.commit('SET_DATA', {
  //                       tableName: relatedModelName,
  //                       value: element[key],
  //                     });
  //                   } // else Если есть, то возможно обновляем
  //                   element[key] = state.state[relatedModelName].listData.find(item => item.id == element[key].id)
  //                 }
  //               }
  //             }

  //             if (!state.state[option.tableName].listData.find(item => item.id == element.id)) {
  //               state.commit('SET_DATA', {
  //                 tableName: option.tableName,
  //                 value: element,
  //               });
  //             }
  //             buferData.push(state.state[option.tableName].listData.find(item => item.id == element.id));
  //             // sendOption.value = state.state[option.tableName].listData.find(item => item.id == element.id);
  //             // state.commit('SET_DATA', sendOption);
  //           });
  //           sendOption.buferData = buferData;
  //           state.commit('SET_DATA_PREVIOUS', sendOption);
  //           resolve();
  //         })
  //         .catch(error => {
  //           console.log(error);
  //           reject();
  //         })
  //         .finally(() => {
  //           setTimeout(() => {
  //             state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //           }, 800);
  //         });
  //   });
  // },
  async REQUEST_DATA_PREVIOUS(state, options) {
    const { apiRest } = state.rootState;
    const parametersURL = state.getters.GET_LINK_PAGE_PREVIOUS(options);
    const sendOption = { // Заменить на option
      tableName: options.tableName,
      guid: options.guid,
    };

    const response = await apiRest.getAll(options.tableName, parametersURL);
    state.commit('SET_DATA_OPTIONS_PRELOAD', Object.assign(sendOption, {data: response.data}));
    response.data.results.forEach((element) => {
      for (let key of Object.keys(element)) {
        let optionsKey = state.state[option.tableName].listOptions[key];
        switch(optionsKey.type) {
          case 'choice': {
            element[key] = optionsKey.choices.find(item => item.value == element[key]);
            break;
          }
          case 'field': {
            if (!element[key]) break; // ЕСЛИ ЗНАЧЕНИЕ NULL
            let relatedModelName = optionsKey['related_model_name']
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

      if (!state.state[options.tableName].listData.find(item => item.id == element.id)) {
        state.commit('SET_DATA', {
          tableName: options.tableName,
          value: element,
        });
      }
      buferData.push(state.state[options.tableName].listData.find(item => item.id == element.id));
    });
    sendOption.buferData = buferData;
    state.commit('SET_DATA_PREVIOUS', sendOption);
    state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
  },


  // REQUEST_DATA_PRELOAD(state, option) {
  //     console.log('preload data');
  //     let addressApi = option.data.previous;
  //     let sendOption = { // Заменить на option
  //       tableName: option.tableName,
  //       guid: option.guid,
  //     };
  //     console.log(addressApi);
  //     return new Promise((resolve, reject) => {
  //       state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //       axios
  //         .get(addressApi)
  //         .then(response => {
  //           state.commit('SET_DATA_OPTIONS_PRELOAD', Object.assign(sendOption, {data: response.data}));
  //           let joinResponse = response.data.results.concat(option.data.results);
  //           // console.log(joinResponse);
  //           joinResponse.forEach(element => {
  //             for (let key of Object.keys(element)) {
  //               let options = state.state[option.tableName].listOptions[key];
  //               switch(options.type) {
  //                 case 'choice': {
  //                   element[key] = options.choices.find(item => item.value == element[key]);
  //                   break;
  //                 }
  //                 case 'field': {
  //                   if (!element[key]) break; // ЕСЛИ ЗНАЧЕНИЕ NULL
  //                   let relatedModelName = options['related_model_name']
  //                   if (!state.state[relatedModelName].listData.find(item => item.id == element[key].id)) { // Если значение не найдено
  //                     state.commit('SET_DATA', {
  //                       tableName: relatedModelName,
  //                       value: element[key],
  //                     });
  //                   } // else Если есть, то возможно обновляем
  //                   element[key] = state.state[relatedModelName].listData.find(item => item.id == element[key].id)
  //                 }
  //               }
  //             }

  //             if (!state.state[option.tableName].listData.find(item => item.id == element.id)) {
  //               state.commit('SET_DATA', {
  //                 tableName: option.tableName,
  //                 value: element,
  //               });
  //             }
  //             sendOption.value = state.state[option.tableName].listData.find(item => item.id == element.id);
  //             state.commit('SET_DATA', sendOption);
  //           });
  //           // console.log('resolve preload');
  //           resolve();
  //         })
  //         .catch(error => {
  //           console.log(error);
  //           reject();
  //         })
  //         .finally(() => {
  //           setTimeout(() => {
  //             state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //           }, 800);
  //         });
  //     });
  // },
  async REQUEST_DATA_PRELOAD(state, options) {
    const { apiRest } = state.rootState;
    console.log(options.data.previous);
    const [, parametersURL] = options.data.previous.split('?');
    state.commit('SET_LOADING_API', Object.assign(options, { status: true }));

    const response = await apiRest.getListAll(options.tableName, parametersURL);
    let joinResponse = response.data.results.concat(option.data.results);
    joinResponse.forEach((element) => {
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
    state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
  },

  async REQUEST_DATA(state, options) {
    const { apiRest } = state.rootState;
    const filterApi = state.getters.GET_FILTER_API(options);
    const filterExtended = state.getters.GET_FILTER_EXTENDED(options);
    let parametersURL = filterApi + filterExtended;
    const sendOption = { // Заменить на option
      tableName: options.tableName,
      guid: options.guid,
    };
    if (Object.keys(options).includes('next')) parametersURL = state.getters.GET_LINK_PAGE_NEXT(options);
    state.commit('SET_LOADING_API', Object.assign(options, { status: true }));

    const response = await apiRest.getAll(options.tableName, parametersURL);
    state.commit('SET_DATA_OPTIONS', Object.assign(sendOption, {data: response.data}));
    if ((response.data.results.length < state.state[options.tableName][options.guid].filters['page_size'])
      && ('previous' in options)
      && ('id' in options)
      && (response.data.previous != null)) {
      state.dispatch('REQUEST_DATA_PRELOAD', sendOption);
    } else {
      response.data.results.forEach(element => {
        for (let key of Object.keys(element)) {
          let optionsKey = state.state[options.tableName].listOptions[key];
          switch(optionsKey.type) {
            case 'choice': {
              element[key] = optionsKey.choices.find(item => item.value == element[key]);
              break;
            }
            case 'field': {
              if (!element[key]) break; // ЕСЛИ ЗНАЧЕНИЕ NULL
              let relatedModelName = optionsKey['related_model_name']
              if (!state.state[relatedModelName].listData.find(item => item.id == element[key].id)) { // Если значение не найдено
                state.commit('SET_DATA', {
                  tableName: relatedModelName,
                  value: element[key],
                });
              } else {  // else Если есть, то возможно обновляем
                state.commit('UPDATE_DATA', {
                  tableName: relatedModelName,
                  value: element[key],
                });
              }
              element[key] = state.state[relatedModelName].listData.find(item => item.id == element[key].id)
            }
          }
        }
        if (!state.state[options.tableName].listData.find(item => item.id == element.id)) {
          state.commit('SET_DATA', {
            tableName: options.tableName,
            value: element,
          });
        } else {
          state.commit('UPDATE_DATA', {
            tableName: options.tableName,
            value: element,
          });
        }
        sendOption.value = state.state[options.tableName].listData.find(item => item.id == element.id);
        state.commit('SET_DATA', sendOption);
      });
    }
    setTimeout(() => {
      state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
    }, 800);
  },

  // REQUEST_DATA(state, option) {
  //   let filterApi = state.getters.GET_FILTER_API(option);
  //   let filterExtended = state.getters.GET_FILTER_EXTENDED(option);
  //   let addressApi = state.getters.GET_ADDRESS_API('get', option.tableName) + filterApi + filterExtended;
  //   if ('next' in option) { addressApi = state.getters.GET_LINK_PAGE_NEXT(option); }
  //   // else { state.commit('CLEAR_DATA', option); };
  //   if ('id' in option) addressApi += `&page_by_id=${option.id}`;

  //   console.log(addressApi);
  //   let sendOption = { // Заменить на option
  //     tableName: option.tableName,
  //     guid: option.guid,
  //   };
  //   return new Promise((resolve, reject) => {
  //     state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //     axios
  //       .get(addressApi)
  //       .then(response => {
  //         state.commit('SET_DATA_OPTIONS', Object.assign(sendOption, {data: response.data}));

  //         // console.log(response.data.results);
  //         if ((response.data.results.length < state.state[option.tableName][option.guid].filters['page_size']) && ('previous' in option) && ('id' in option) && (response.data.previous != null)) {
  //           state.dispatch('REQUEST_DATA_PRELOAD', sendOption)
  //             .then(() => {
  //               resolve();
  //             })
  //         } else {
  //           response.data.results.forEach(element => {
  //             for (let key of Object.keys(element)) {
  //               let options = state.state[option.tableName].listOptions[key];
  //               switch(options.type) {
  //                 case 'choice': {
  //                   element[key] = options.choices.find(item => item.value == element[key]);
  //                   break;
  //                 }
  //                 case 'field': {
  //                   if (!element[key]) break; // ЕСЛИ ЗНАЧЕНИЕ NULL
  //                   let relatedModelName = options['related_model_name']
  //                   if (!state.state[relatedModelName].listData.find(item => item.id == element[key].id)) { // Если значение не найдено
  //                     state.commit('SET_DATA', {
  //                       tableName: relatedModelName,
  //                       value: element[key],
  //                     });
  //                   } else {  // else Если есть, то возможно обновляем
  //                     state.commit('UPDATE_DATA', {
  //                       tableName: relatedModelName,
  //                       value: element[key],
  //                     });
  //                   }
  //                   element[key] = state.state[relatedModelName].listData.find(item => item.id == element[key].id)
  //                 }
  //               }
  //             }

  //             if (!state.state[option.tableName].listData.find(item => item.id == element.id)) {
  //               state.commit('SET_DATA', {
  //                 tableName: option.tableName,
  //                 value: element,
  //               });
  //             } else {
  //               state.commit('UPDATE_DATA', {
  //                 tableName: option.tableName,
  //                 value: element,
  //               });
  //             }
  //             sendOption.value = state.state[option.tableName].listData.find(item => item.id == element.id);
  //             state.commit('SET_DATA', sendOption);
  //           });
  //           // console.log(state.state);
  //           // console.log('resolve load iz preload');
  //           resolve();
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         // state.commit('SET_DATA_OPTIONS', Object.assign(sendOption, {data: {count: 0, next: null}}));
  //         reject();
  //       })
  //       .finally(() => {
  //         setTimeout(() => {
  //           state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //         }, 800);
  //       });
  //   });
  // },

  // async REQUEST_ADDING(state, options) {
  //   // options - formData
  //   const { apiRest } = state.rootState;
  //   state.commit('SET_LOADING_API', Object.assign(options, { status: true }));
  //   const response = await apiRest.addListItem(options.tableName, options.formData);
  //   state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
  //   return response;
  //   // let addressApi = state.getters.GET_ADDRESS_API('post', options.tableName);
  //   // return new Promise((resolve, reject) => {
  //   //   console.log(addressApi);
  //   //   console.log(options);
  //   // state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //   // axios
  //   //   .post(addressApi, option.formData)
  //   //   .then(response => {
  //   //     console.log(response);
  //   //     resolve(response);
  //   //   })
  //   //   .catch(err => {
  //   //     console.log(err);
  //   //     reject(err);
  //   //   })
  //   //   .finally(() => {
  //   //     state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //   //   });
  //   // });
  // },

  // REQUEST_UPDATE(state, option) {
  //   let addressApi = state.getters.GET_ADDRESS_API('update', option.tableName);
  //   addressApi += `${option.id}/`;
  //   return new Promise((resolve, reject) => {
  //     state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //     axios
  //       .put(addressApi, option.formData)
  //       .then(response => {
  //         console.log(response);

  //         resolve();
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         reject(err);
  //       })
  //       .finally(() => {
  //         state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //       });
  //   });
  // },

  // REQUEST_MARK_DELETED(state, option) {
  //   let addressApi = state.getters.GET_ADDRESS_API('delete', option.tableName);
  //   addressApi += `${option.id}`;
  //   return new Promise((resolve, reject) => {
  //     state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //     axios
  //       .delete(addressApi)
  //       .then(response => {
  //         console.log(response);
  //         state.commit('MARK_DELETED_ELEMENT', option);
  //         resolve();
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         reject(err);
  //        })
  //       .finally(() => {
  //         state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //       });
  //   });
  // },

  // ЗАПРОС ЭЛЕМЕНТА ДАННЫХ ----------------------------------------------
  // REQUEST_DATA_ITEM(state, option) {
  //   let addressApi = state.getters.GET_ADDRESS_API('get', option.tableName);
  //   let tokenAccess = state.rootGetters['Login/GET_USER_TOKEN_ACCESS'];
  //   axios.defaults.headers.common = {'Authorization': tokenAccess};
  //   addressApi += `id=${option.id}`;
  //   return new Promise((resolve, reject) => {
  //     // state.commit('SET_LOADING_API', Object.assign(option, { status: true }));
  //     axios
  //       .get(addressApi)
  //       .then(response => {
  //         response.data.results.forEach(element => {
  //           state.commit('SET_DATA', {
  //             tableName: option.tableName,
  //             value: element,
  //           });
  //         });
  //         resolve();
  //       })
  //       .catch(err => {
  //         reject(err);
  //       })
  //       .finally(() => {
  //         // state.commit('SET_LOADING_API', Object.assign(option, { status: false }));
  //       });
  //   });
  // },
  async REQUEST_DATA_ITEM(state, options) {
    const { apiRest } = state.rootState;
    const { tableName: sourceName, id: elementId } = options;
    state.commit('SET_LOADING_API', Object.assign(options, { status: true }));

    const response = await apiRest.get(sourceName, elementId);
    console.log(response);
    response.data.results.forEach((element) => {
      state.commit('SET_DATA', {
        tableName: sourceName,
        value: element,
      });
    });
    state.commit('SET_LOADING_API', Object.assign(options, { status: false }));
  },
  // --------------------------------------------------------------------

  // HISTORY DATA -------------------------------------------------------
  // ------------ -------------------------------------------------------
  // ------------ -------------------------------------------------------

  // HISTORY_REQUEST_DATA(state, option) {
  //   let addressApi = state.getters.GET_HISTORY_ADDRESS_API(option);
  //   if (option.mode == 'element') addressApi += `id=${option.id}`;
  //   if (option.mode == 'element_list') addressApi += `related=${option.id}`;
  //   console.log(addressApi);
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(addressApi)
  //       .then(response => {
  //         // console.log(response);
  //         resolve(response.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         reject();
  //       })
  //   })
  // },
  async HISTORY_REQUEST_DATA(state, options) {
    const { apiRest } = state.rootState;
    const { tableName, mode, id: elementId } = options;
    let sourceName = tableName;
    let parametersURL = `related=${elementId}`;
    if (mode === 'element') {
      sourceName += '/retrieve_actual';
      parametersURL = `id=${elementId}`;
    }
    const response = await apiRest.getAll(sourceName, parametersURL);
    return response.data;
  },
}