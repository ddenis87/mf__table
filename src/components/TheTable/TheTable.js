import DataTable from '@/components/DataTable/DataTable.vue';

export const TheTable = {
  components: {
    DataTable,
  },
  props: {
    defaultOptions: null,
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
    }
  },
  computed: {
    propertiesTable() {
      return {
        properties: (this.isMultiline) ? (this.propertiesTableMultiline) ? this.propertiesTableMultiline : this.propertiesTableUno : this.propertiesTableUno,
        'default-options': this.defaultOptions,
        'default-filters': this.defaultFilters,
        'type-height': this.typeRow[this.typeRowNumber],
        'type-column': this.typeColumn,
        'is-editable': this.isEditable,
        'is-adding-inline': this.isAddingInline,
        'is-footer': this.isFooter,
        'is-expansion': this.isExpansion,
        'is-multiline': this.isMultiline,
      }
    },
  },
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