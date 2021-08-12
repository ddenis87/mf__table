export default {
  // ---- dataTable -----------------------------------------------------------
  GET_DESCRIPTION:(state) => (option) => {
    if (option.tableName)
      return state[option.tableName].description;
    return false;
  },

  GET_RELATED_MODEL_VIEW:(state) => (option) => {
    if (option.tableName)
      return state[option.tableName].relatedModelView;
    return false;
  },
  
  GET_LIST_OPTIONS:(state) => (option) => {
    if (option.tableName)
      return state[option.tableName].listOptions;
    return {};
  },
  // --------------------------------------------------------------------------

  // ---- dataTableSpace ------------------------------------------------------
  GET_PROPS_TABLE:(state) => (option) => {
    if (!option.tableName) return {};
    if (state[option.tableName][option.guid])
      return state[option.tableName][option.guid].propsTable;
    return {};
  },
  
  GET_PROP_TABLE_VALUE:(state) => (option) => {
    return state[option.tableName][option.guid].propsTable[option.key];
  },

  GET_COUNT_DATA_TOTAL:(state) => (option) => {
    if (!option.tableName) return {};
    if (state[option.tableName][option.guid])
      return state[option.tableName][option.guid].countDataTotal;
    return -1;
  },

  GET_COUNT_DATA_LOADED:(state) => (option) => {
    if (option.tableName)
      if (option.guid)
        return state[option.tableName][option.guid].listData.length;
    return -1;
  },

  GET_LIST_DATA:(state) => (option) => {
    if (option.tableName) {
      if (option.guid)
        return state[option.tableName][option.guid].listData;
      return state[option.tableName].listData;
    }
    return [];
  },
  
  GET_LIST_DATA_ITEM_REPRESENTATION:(state) => (options) => {
    // console.log(options);
    const relatedModelView = state[options.tableName].relatedModelView;
    const template = relatedModelView.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1).split('}{');
    const dataItem = state[options.tableName].listData.find((item) => item.id === options.id);
    // console.log(dataItem);
    if (!dataItem) return undefined;
    let value = relatedModelView;
    template.forEach((templateItem) => {
      value = value.replace(`{${templateItem}}`, dataItem[templateItem]);
    });
    // console.log(value);
    return value;
  },

  GET_ACTIVE_ELEMENT:(state) => (option) => {
    if (option.guid)
      return state[option.tableName][option.guid].activeElement;
    return null;
  },

  
  // --------------------------------------------------------------------------

  GET_LOADING_API:(state) => (option) => {
    if (!option.tableName) return {};
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
  GET_LINK_PAGE_NEXT:(state) => (option) => {
    if (!state[option.tableName][option.guid].linkPageNext) return null;
    const [, parametersURL] = state[option.tableName][option.guid].linkPageNext.split('?');
    // return state[option.tableName][option.guid].linkPageNext;
    return parametersURL;
  },
  GET_LINK_PAGE_PREVIOUS:(state) => (option) => {
    if (!state[option.tableName][option.guid].linkPagePrevious) return null;
    const [, parametersURL] = state[option.tableName][option.guid].linkPagePrevious.split('?');
    // return state[option.tableName][option.guid].linkPagePrevious;
    return parametersURL;
  },

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

  GET_DATA_GROUP:(state) => (option) => {
    console.log(state[option.tableName][option.guid].listDataGroup);
    return state[option.tableName][option.guid].listDataGroup;
  },
  GET_DATA_GROUP_LEVEL:(state) => (option) => {
    if (!option.tableName) return 0;
    return state[option.tableName][option.guid].listDataGroup.length;
  },
  GET_ADDING_MODE:(state) => (option) => {
    if (option.guid)
      return state[option.tableName][option.guid].addingMode;
    return {index: null, id: null};
  },

  GET_FILTER_DEFAULT_FIELD:(state) => (option) => {
    if (!option.guid) return false;
    return state[option.tableName][option.guid].filters[option.filter];
  },
  GET_FILTERS:(state) => (option) => {
    if (!option.guid) return false;
    return state[option.tableName][option.guid].filters;
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
  GET_MARK_EVENTS_ADDING:(state) => (option) => {
    return state[option.tableName][option.guid].markersEvents.eventAdding;
  },
  GET_MARK_MODE_ADDING:(state) => (option) => {
    return state[option.tableName][option.guid].markersEvents.modeAdding;
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