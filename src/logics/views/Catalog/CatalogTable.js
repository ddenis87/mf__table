export default {
  data: {
    focusedTableElement: null,
  },
  computed: {
    componentTable() {
      return () => import(`@/components/CatalogTable/CatalogTable${this.sourceName[0].toUpperCase() + this.sourceName.slice(1)}`);
    },
  },
  methods: {
    evtBlurTable() {
      this.focusedTableElement = null;
    },
    evtFocusedElement(focusElement) {
      this.focusedTableElement = focusElement;
    },
    evtMountedTable(options) {
      this.guid = options.guid;
    },
  },
};
