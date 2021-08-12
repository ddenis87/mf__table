import store from '@/store';
import { Guid } from 'js-guid';
import DataTable from '@/components/Form/DataTable/DataTable.vue';

export default {
  components: {
    DataTable,
  },
  props: {
    // defaultOptions: { type: Object, default: () => {} },
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
  data: {
    guid: `d${Guid.newGuid().StringGuid}`,
    typeRow: ['fixed', 'dense', 'auto'],
  },
  computed: {
    activeElement() {
      return store.getters['DataTable/GET_ACTIVE_ELEMENT'](this.optionCatalog);
    },

    countDataTotal() {
      return this.$store.getters['DataTable/GET_COUNT_DATA_TOTAL'](this.optionCatalog);
    },

    countDataLoaded() {
      return store.getters['DataTable/GET_COUNT_DATA_LOADED'](this.optionCatalog);
    },

    isLoading() {
      return store.getters['DataTable/GET_LOADING_API'](this.optionCatalog);
    },
    isAddingMode() {
      return store.getters['DataTable/GET_MARK_MODE_ADDING'](this.optionCatalog);
    },

    optionCatalog() {
      return {
        tableName: this.sourceName,
        guid: this.guid,
      };
    },
    tableProps() {
      return {
        guid: this.guid,
        options: this.optionTable,
        'link-page-next': store.getters['DataTable/GET_LINK_PAGE_NEXT'](this.optionCatalog),
        'link-page-previous': store.getters['DataTable/GET_LINK_PAGE_PREVIOUS'](this.optionCatalog),
        'list-options': store.getters['DataTable/GET_LIST_OPTIONS'](this.optionCatalog),
        'list-data': store.getters['DataTable/GET_LIST_DATA'](this.optionCatalog),
        'list-data-group': store.getters['DataTable/GET_DATA_GROUP'](this.optionCatalog),
        'list-data-group-level': store.getters['DataTable/GET_DATA_GROUP_LEVEL'](this.optionCatalog),

        'is-loading': this.isLoading,
        'active-element': this.activeElement,
        'count-data-total': this.countDataTotal,
        'count-data-loded': this.countDataLoaded,
        // properties: this.optionTable,
        'type-row': this.typeRow[this.typeRowNumber],
        'type-column': this.typeColumn,

        'is-adding': this.isAdding,
        'is-adding-form': this.isAddingForm,
        'is-adding-inline': this.isAddingInline,
        'is-editable': this.isEditable,
        'is-editable-form': this.isEditableForm,
        'is-editable-inline': this.isEditableInline,
        'is-footer': this.isFooter,
        'is-expansion': this.isExpansion,
        'is-multiline': this.isMultiline,
        'is-hierarchy': this.isHierarchy,
      };
    },
  },

  async created() {
    await this.createdTableSpace();
  },

  methods: {
    async createdTableSpace() {
      await this.$store.dispatch('DataTable/CREATE_TABLE_DATA_SPACE', {
        tableName: this.sourceName,
        guid: this.guid,
        tableOption: {
          propsTable: {
            typeRow: this.typeRow[this.typeRowNumber],
            typeColumn: this.typeColumn,
            isAdding: this.isAdding,
            isAddingForm: this.isAddingForm,
            isAddingInline: this.isAddingInline,
            isEditable: this.isEditable,
            isEditableForm: this.isEditableForm,
            isEditableInline: this.isEditableInline,
            isFooter: this.isFooter,
            isExpansion: this.isExpansion,
            isMultiline: this.isMultiline,
            isHierarchy: this.isHierarchy,
          },
        },
        defaultFilters: this.defaultFilters,
      });
      return true;
    },

    eventComponent(eventName, options) {
      console.log(eventName);
      const eventTable = {
        'mounted-component': () => this.$emit('component-mounted', options),
        'element:focused': () => this.evtFocusedElement(options),
        'element:selected': () => this.evtSelectedElement(options),
        'blur-component': () => this.evtblurComponent(),
        'toggle:group': () => this.toggleGroup(options),
        'request:next': () => this.requestNext(),
        'request:previous': () => this.requestPrevious(),
        'element:adding': () => this.evtAddingElement(options),
      };
      eventTable[eventName]();
      // console.log(event, options);
    },

    evtAddingElement(options) {
      console.log(options);
      this.$emit('element:adding', options);
    },

    evtFocusedElement(options) {
      store.commit('DataTable/SET_ACTIVE_ELEMENT', {
        ...this.optionCatalog,
        value: options.value,
      });
      this.$emit('row-focused', options);
    },

    evtSelectedElement(options) {
      store.commit('DataTable/SET_ACTIVE_ELEMENT', {
        ...this.optionCatalog,
        value: options.value,
      });
      this.$emit('row-selected', options);
    },

    toggleGroup(options) {
      const isDeleted = this.$store.getters['DataTable/GET_FILTER_DEFAULT_FIELD']({
        filter: 'is_deleted',
        ...this.optionCatalog,
      });
      if (isDeleted) return;
      this.$store.dispatch('DataTable/SELECTED_GROUP', {
        ...this.optionCatalog,
        value: options,
      });
    },

    requestNext() {
      store.dispatch('DataTable/REQUEST_DATA', {
        ...this.optionCatalog,
        next: true,
      });
    },

    requestPrevious() {
      store.dispatch('DataTable/REQUEST_DATA_PREVIOUS', this.optionCatalog);
    },

    evtblurComponent() {
      store.commit('DataTable/SET_ACTIVE_ELEMENT', this.optionCatalog);
      this.$emit('component-blur');
    },
  },
};
