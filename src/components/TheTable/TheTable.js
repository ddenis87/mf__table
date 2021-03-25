import DataTable from '@/components/DataTable/DataTable.vue';

export const TheTable = {
  components: {
    DataTable,
  },
  props: {
    defaultFilters: null,

    typeRowNumber: { type: Number, default: 0 },
    typeColumn: { type: String, default: 'fixed' },
    isFooter: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
    isHierarchy: { type: Boolean, default: false },
    isEditable: { type: Boolean, default: true },
    isAddingInline: { type: Boolean, default: true },
  },
  data() {
    return {
      typeRow: ['fixed', 'dense', 'auto'],
      focusedElement: {},
    }
  },
  computed: {
    tableProperties() {
      return (this.isMultiline) ? (this.tablePropertiesMultiline) ? this.tablePropertiesMultiline : this.tablePropertiesUno : this.tablePropertiesUno;
    },
  },
  created() {
    // this.$store.dispatch('DataTable/REQUEST_OPTIONS', {tableName: this.tableName});
  },
  // mounted() {
  //   this.$emit('table-mount', this.$data, this.tableProperties);
  // },
  methods: {
    componentMounted(option) {
      this.$emit('component-mounted', option);
    },
    eventRowFocused(option) {
      this.$emit('row-focused', option);
    },
    eventRowSelected(option) {
      this.$emit('row-selected', option);
    },
    eventRowKeydown(event, option) {
      this.$emit('row-keydown', event, option);
    },
    eventComponentBlur() {
      this.$emit('component-blur');
    },
  }
}