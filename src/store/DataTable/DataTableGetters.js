export default {
  GET_LOADING_API:(state) => (option) => {
    return state[option.tableName][option.guid].apiLoading;
  },
  GET_ADDRESS_API:(state, getters, rootState, rootGetters) => (option, tableName) => {
    let addressApi = `${rootGetters.GET_ADDRESS_API}api/v1/${tableName}/?`;
    switch (option) {
      case 'options': return addressApi;
      case 'post':
      case 'update':
      case 'delete': return addressApi.slice(0, -1);
      case 'get': {
        return addressApi;
      }
      default: return addressApi;
    }
  },
  GET_ADDRESS_API_NEXT:(state) => (option) => { return state[option.tableName][option.guid].apiNext; },
  GET_ADDRESS_API_PREVIOUS:(state) => (option) => { return state[option.tableName][option.guid].apiPrevious; },

  GET_FILTER_API:(state) => (option) => {
    let filters = state[option.tableName][option.guid].filters;
    let filtersApi = '';
    Object.keys(filters).forEach(key => {
      if(filters[key] != null) {
        filtersApi += `&${key}=${filters[key]}`;
      }
    })
    if (state[option.tableName][option.guid].filtersFields) filtersApi += state[option.tableName][option.guid].filtersFields;
    return filtersApi;
  },

  GET_TABLE_DESCRIPTION:(state) => (option) => { return (state[option.tableName]) ? state[option.tableName].description : ''; },
  GET_HIERARCHY_MODE:(state) => (option) => { return state[option.tableName].isHierarchyMode; },
  GET_RELATED_MODEL_VIEW:(state) => (option) => { return state[option.tableName].relatedModelView; },

  GET_TABLE_DATA_COUNT:(state) => (option) => {
    if (state[option.tableName][option.guid])
      return state[option.tableName][option.guid].tableDataCount;
    return -1;
  },

  GET_OPTIONS:(state) => (tableName, headers) => {
    let headerStore = state[tableName].listOptions;
    let headerBase = headers;
    let newheaderBase = [];
    let headerReturn = [];
    if (Array.isArray(headerBase[0])) {
      for (let i = 0; i < headerBase.length; i++) { newheaderBase.push(...headerBase[i]) }
    } else {
      newheaderBase = headerBase;
    }
    newheaderBase.forEach(element => {
      if (element.value in headerStore) {
        headerReturn.push(Object.assign(element, headerStore[element.value], {'position_in_template': {'grid-area': element.value}}));
      }
    });
    return headerReturn;
  },
  GET_FIELD:(state) => (tableName) => {
    console.log(tableName);
    return state[tableName].listOptions;
  },
  GET_DATA:(state) => (option) => {
    if (option.guid)
      return state[option.tableName][option.guid].listData;
    return state[option.tableName].listData;
  },
  GET_DATA_GROUP:(state) => (option) => { return state[option.tableName][option.guid].listDataGroup; },
  GET_DATA_GROUP_LEVEL:(state) => (option) => { return state[option.tableName][option.guid].listDataGroup.length; },
  GET_ADDING_MODE:(state) => (option) => {
    if (option.guid)
      return state[option.tableName][option.guid].addingMode;
    return {index: null, id: null};
  },

  GET_FILTER_DEFAULT_FIELD:(state) => (option) => {
    if (!option.guid) return false;
    return state[option.tableName][option.guid].filters[option.filter];
  },
  GET_FILTER_EXTENDED:(state) => (option) => {
    if (!option.guid) return '';
    if (state[option.tableName][option.guid].filtersExtended == null) return '';
      return '' + state[option.tableName][option.guid].filtersExtended;
  },


  // ----МАРКЕРЫ СОБЫТИЙ--------------------------------------------------------
  GET_MARK_EVENTS_FILTER_EXTENDE_RESET:(state) => (option) => {
    if (!option.guid) return null;
    return state[option.tableName][option.guid].markersEvents.filterExtendedReset;
  },
  GET_MARK_EVENTS_FILTER_EXTENDE_OFF:(state) => (option) => {
    if (!option.guid) return null;
    return state[option.tableName][option.guid].markersEvents.filterExtendedOff;
  },


  // HISTORY DATA -------------------------------------------------------
  // ------------ -------------------------------------------------------
  // ------------ -------------------------------------------------------
  GET_HISTORY_ADDRESS_API:(state, getters, rootState, rootGetters) => (option) => {
    let addressApi = `${rootGetters.GET_ADDRESS_API}api/v1/${option.tableName}/`;
    switch(option.mode) {
      case 'element': {
        addressApi += `retrieve_actual/?`;
        break;
      }
      case 'element_list': {
        addressApi += `?`;
        break;
      }
    }
    return addressApi;
  },
}