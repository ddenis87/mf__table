export const DataTableBodyGroupStore = {
  methods: {
    storeToggleGroup(option) {
      this.$store.dispatch('DataTable/SELECTED_GROUP', option);
      // this.$store.commit('DataTable/CHANGE_DATA_GROUP_LEGEND', option);
      // this.$store.commit('DataTable/CHANGE_API_FILTER_PARENT', option);
      // this.$store.commit('DataTable/CHANGE_GETTER_FILTER_DATA', option);
      // this.$store.dispatch('DataTable/REQUEST_DATA', option);
    },
  }
}