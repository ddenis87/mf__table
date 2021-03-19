import Vue from "vue";

class TableDataSpace {
  constructor({pageSize = 40, isDeleted = false}) {
    this.filters['page_size'] = pageSize;
    this.filters['is_deleted'] = isDeleted;
  };
  apiLoading = false;
  tableDataCount = -1;
  apiNext = null;
  apiPrevious = null;
  listData = [];
  listDataGroup = [];
  filters = {
    'page_size': '',
    'is_deleted': false,
    'parent__isnull': null,
    'ordering': null,
    'search': null,
    'parent': null,
    'is_group': null,
  };
  filtersExtended = null;

  addingMode = {
    index: null,
    id: null,
  };

  markersEvents = {
    filterExtendedReset: null,
    filterExtendedOff: null,
  };
}

export default {
  // ----СОЗДАНИЕ/УДАЛЕНИЕ ТАБЛИЧНОГО ПРОСТРАНСТВА------------------------------
  CREATE_TABLE_DATA_SPACE(state, option) {
    Vue.set(state[option.tableName], option.guid, new TableDataSpace(option.tableOption));
  },
  DELETE_TABLE_DATA_SPACE(state, option) {
    delete state[option.tableName][option.guid];
  },
  // ---------------------------------------------------------------------------

  SET_LOADING_API(state, option) {
    state[option.tableName][option.guid].apiLoading = option.status;
  },

  SET_OPTIONS(state, option) {
    state[option.tableName].listOptions = option.data;
    state[option.tableName].description = option.description;
    if ('parent' in option.data) {
      state[option.tableName].isHierarchyMode = true;
      state[option.tableName][option.guid].filters['parent__isnull'] = true;
      // state[option.tableName][option.guid].filters['ordering'] = `-is_group`;
    } else {
      state[option.tableName].isHierarchyMode = false;
    }
  },
  SET_DATA(state, option) {
    if ('guid' in option) state[option.tableName][option.guid].listData.push(option.value);
    else state[option.tableName].listData.push(option.value);
  },
  SET_DATA_OPTIONS(state, option) {
    state[option.tableName][option.guid].tableDataCount = option.data.count;
    // if ('nextLnk' in option)
      state[option.tableName][option.guid].apiNext = option.data.next
    // if('prevLnk' in option)
      state[option.tableName][option.guid].apiPrevious = option.data.previous;
  },
  CLEAR_DATA(state, option) {
    state[option.tableName][option.guid].tableDataCount = -1;
    state[option.tableName][option.guid].listData = [];
  },
  CHANGE_DATA_GROUP_LEGEND(state, option) {
    let index = state[option.tableName][option.guid].listDataGroup.findIndex(item => item.id == option.value.id);
    if (index == -1)
      state[option.tableName][option.guid].listDataGroup.push(option.value);
    else
      state[option.tableName][option.guid].listDataGroup = state[option.tableName][option.guid].listDataGroup.slice(0, index);
  },


  // ----ДОБАВЛЕНИЕ ПУСТОЙ СТРОКИ В ДАННЫЕ--------------------------------------
  ADDING_NEW_ELEMEN_INLINE(state, option) {
    let newElement = {};
    Object.keys(state[option.tableName].listOptions).forEach(item => {
      newElement[item] = null;
    });
    let indexLastGroup = state[option.tableName][option.guid].listDataGroup.length - 1;
    if (indexLastGroup > -1) {
      newElement.parent = state[option.tableName][option.guid].listDataGroup[indexLastGroup];
    }
    let indexCurrentElement = state[option.tableName][option.guid].listData.findIndex(item => item.id == option.id);
    
    state[option.tableName][option.guid].listData.splice(((indexCurrentElement > -1) ? indexCurrentElement : 0) + 1, 0, newElement);
    state[option.tableName][option.guid].addingMode.index = ((indexCurrentElement > -1) ? indexCurrentElement : 0) + 1;
  },
  // ----СОХРАНЕНИЕ ПОЛЯ СТРОКИ В ДАННЫЕ----------------------------------------
  ADDING_NEW_ELEMEN_INLINE_FIELD(state, option) {
    let index = state[option.tableName][option.guid].listData.findIndex(item => item.id == option.id);
    state[option.tableName][option.guid].listData[index][option.fieldName] = option.value;
  },
  // ----УДАЛЕНИЕ ДОБАВЛЯЕМОЙ СТРОКИ ИЗ ДАННЫХ ПРИ ОТМЕНЕ-----------------------
  DELETING_NEW_ELEMENT_INLINE(state, option) {
    state[option.tableName][option.guid].listData.splice(state[option.tableName][option.guid].addingMode.index, 1);
    state[option.tableName][option.guid].addingMode.id = null;
    state[option.tableName][option.guid].addingMode.index = null;
  },
  // ---------------------------------------------------------------------------

  // ----ДОБАВЛЕНИЕ ССЫЛКИ В ССЫЛОЧНУЮ ТАБЛИЦУ----------------------------------
  ADDING_DATA_LINK(state, option) {
    if (state[option.tableName].listData.findIndex(item => item.id == option.value.id) == -1) {
      state[option.tableName].listData.push(option.value);
    }
  },
  // ---------------------------------------------------------------------------

  // ----ПОМЕТКА НА УДАЛЕНИЕ ЭЛЕМЕНТА-------------------------------------------
  MARK_DELETED_ELEMENT(state, option) {
    let index = state[option.tableName][option.guid].listData.findIndex(item => item.id == option.elementId);
    state[option.tableName][option.guid].listData.splice(index, 1);
  },
  // ---------------------------------------------------------------------------


  // ----FILTERS----------------------------------------------------------------
  // ----УСТАНОВКА ФИЛЬТРОВ ПО УМОЛЧАНИЮ----------------------------------------
  SET_FILTER_DEFAULT(state, option) {
    for (let item of Object.entries(option.defaultFilters)) {
      state[option.tableName][option.guid].filters[item[0]] = item[1];
    }
  },
  // SET_FILTER_HIERARCHY(state, option) {
  //   state[option.tableName][option.guid].filters['parent__isnull'] = true;
  //   state[option.tableName][option.guid].filters['ordering'] = `-is_group`;
  // },
  SET_FILTER_PARENT(state, option) {
    if (state[option.tableName][option.guid].listDataGroup.length) {
      state[option.tableName][option.guid].filters['parent__isnull'] = null;
      state[option.tableName][option.guid].filters['parent'] = state[option.tableName][option.guid].listDataGroup[state[option.tableName][option.guid].listDataGroup.length - 1].id;
    } else {
      state[option.tableName][option.guid].filters['parent__isnull'] = true;
      state[option.tableName][option.guid].filters['parent'] = null;
    }
  },
  // ----УСТАНОВКА РАСШИРЕННОГО ФИЛЬТА------------------------------------------
  SET_FILTER_EXTENDED(state, option) {
    state[option.tableName][option.guid].filtersExtended = (option.value != null && option.value != '') ? option.value : null;
  },

  // ----МАРКЕРЫ СОБЫТИЙ--------------------------------------------------------
  MARK_EVENT_FILTER_EXTENDED_RESET(state, option) {
    state[option.tableName][option.guid].markersEvents.filterExtendedReset = true;
    setTimeout(() => state[option.tableName][option.guid].markersEvents.filterExtendedReset = null,1000);
  },
  MARK_EVENT_FILTER_EXTENDED_OFF(state, option) {
    state[option.tableName][option.guid].markersEvents.filterExtendedOff = true;
    setTimeout(() => state[option.tableName][option.guid].markersEvents.filterExtendedOff = null,1000);
  },
}