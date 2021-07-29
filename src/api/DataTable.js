import store from '@/store';

function getDataTotalCount(options) {
  return store.getters['DataTable/GET_COUNT_DATA_TOTAL'](options);
}

function getListOptions(sourceName) {
  return store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: sourceName });
}

function setFilterExtend(options) {
  store.dispatch('DataTable/SET_FILTER_EXTENDED', options);
}

function getFilterExtend(options) {
  return store.getters['DataTable/GET_FILTER_EXTENDED'](options);
}

function resetFilterExtend(options) {
  // store.dispatch('DataTable/MARK_EVENT_FILTER_EXTENDED_RESET', {
  //   tableName: option.tableName,
  //   guid: option.guid,
  // });
  store.dispatch('DataTable/SET_FILTER_EXTENDED', options);
}

export default {
  getDataTotalCount,
  getListOptions,
  getFilterExtend,
  setFilterExtend,
  resetFilterExtend,
};
