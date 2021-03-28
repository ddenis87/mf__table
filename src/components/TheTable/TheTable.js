import DataTable from '@/components/DataTable/DataTable.vue';

export const TheTable = {
  components: {
    DataTable,
  },
  props: {
    defaultOptions: { type: Object, default: () => {} },
    defaultFilters: { type: Object, default: () => {} },
    typeRowNumber: { type: Number, default: 0 },
    typeColumn: { type: String, default: 'fixed' },
    isAdding: { type: Boolean, default: true },
    isAddingForm: { type: Boolean, default: true },
    isAddingInline: { type: Boolean, default: true },
    isEditable: { type: Boolean, default: true },
    isEditableForm: { type: Boolean, default: true },
    isEditableInline: { type: Boolean, default: true },
    isFooter: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
    isHierarchy: { type: Boolean, default: true },
    
  },
  data() {
    return {
      dTypeRow: ['fixed', 'dense', 'auto'],
      dDefaultOptions: this.defaultOptions,
      dDefaultFilters: this.defaultFilters,
      dTypeRowNumber: this.typeRowNumber,
      dTypeColumn: this.typeColumn,
      
      disAdding: this.isAdding,
      disAddingForm: this.isAddingForm,
      disAddingInline: this.isAddingInline,
      disEditable: this.isEditable,
      disEditableForm: this.isEditableForm,
      disEditableInline: this.isEditableInline,
      disFooter: this.isFooter,
      disExpansion: this.isExpansion,
      disMultiline: this.isMultiline,
      disHierarchy: this.isHierarchy,
    }
  },
  computed: {
    propertiesTable() {
      return {
        properties: this.optionTable, // (this.disMultiline) ? (this.propertiesTableMultiline) ? this.propertiesTableMultiline : this.propertiesTableUno : this.propertiesTableUno,
        'default-options': this.dDefaultOptions,
        'default-filters': this.dDefaultFilters,
        'type-row': this.dTypeRow[this.dTypeRowNumber],
        'type-column': this.dTypeColumn,

        'is-adding': this.disAdding,
        'is-adding-form': this.disAddingForm,
        'is-adding-inline': this.disAddingInline,
        'is-editable': this.disEditable,
        'is-editable-form': this.disEditableForm,
        'is-editable-inline': this.disEditableInline,
        'is-footer': this.disFooter,
        'is-expansion': this.disExpansion,
        'is-multiline': this.disMultiline,
        'is-hierarchy': this.disHierarchy,
      }
    },
  },
  methods: {
    eventComponent(eventName, option) {
      switch(eventName) {
        case 'mounted-component': this.$emit('component-mounted', option); break;
        case 'focused-element': this.$emit('row-focused', option); break;
        case 'selected-element': this.$emit('row-selected', option); break;
        case 'blur-component': this.$emit('component-blur'); break;
      }
    },
  }
}