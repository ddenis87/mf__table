import store from '@/store';

function getListOptions(sourceName) {
  return store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: sourceName });
}

function setFilterExtend(option) {
  store.dispatch('DataTable/SET_FILTER_EXTENDED', option);
}

function resetFilterExtend(option) {
  // store.dispatch('DataTable/MARK_EVENT_FILTER_EXTENDED_RESET', {
  //   tableName: option.tableName,
  //   guid: option.guid,
  // });
  store.dispatch('DataTable/SET_FILTER_EXTENDED', option);
}

export default {
  getListOptions,
  setFilterExtend,
  resetFilterExtend,
};
