import FieldSearch from '@/components/Form/Field/FieldSearch.vue';

export default {
  data: {
    guid: null,
    titleLoading: 'Загрузка',
    freeSearchValue: '',
  },
  components: {
    FieldSearch,
  },
  computed: {
    catalogOptions() {
      return {
        tableName: this.sourceName,
        guid: this.guid,
      };
    },
    tableDiscription() { return this.$store.getters['DataTable/GET_DESCRIPTION'](this.catalogOptions); },
  },
  methods: {
    freeSearch(options) {
      if (!options.code.includes('Enter')) return;
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', { defaultFilters: { search: this.freeSearchValue }, ...this.catalogOptions });
    },
    clearValueFreeSearch() {
      const isHierarchy = this.$store.getters['DataTable/GET_PROP_TABLE_VALUE']({ key: 'isHierarchy', ...this.catalogOptions });
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        defaultFilters: {
          search: null,
          ordering: (isHierarchy) ? '-is_group' : null,
        },
        ...this.catalogOptions,
      });
      this.freeSearchValue = null;
    },
  },
};
