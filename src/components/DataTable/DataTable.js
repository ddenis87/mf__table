import { Guid } from 'js-guid';

export const DataTable = {
  data() {
    return {
      guid: 'd' + Guid.newGuid().StringGuid,
    }
  },
  computed: {
    optionGetter() { return { tableName: this.properties.tableName, guid: this.guid } },
    isLoadingData() {
      let status = this.$store.getters['DataTable/GET_LOADING_API'](this.optionGetter);
      if (!status) {
        console.log('add listener scroll');
        this.parentElement.addEventListener('scroll', this.eventScrollPagination);
        if (this.getDataCount() != 0)
          setTimeout(() => this.eventScrollPagination(), 300);
      }
      return status; //this.$store.getters['DataTable/GET_LOADING_API'](this.optionGetter);
    },
    isHierarchyMode() { 
      return this.$store.getters['DataTable/GET_HIERARCHY_MODE'](this.optionGetter); 
    },

    listOptions() { return this.$store.getters['DataTable/GET_OPTIONS'](this.tableName, this.properties.headers); },
    listData() { return this.$store.getters['DataTable/GET_DATA'](this.optionGetter); },
    listDataCount() { return this.$store.getters['DataTable/GET_TABLE_DATA_COUNT'](this.optionGetter); },
    listDataCountLoad() {return this.$store.getters['DataTable/GET_DATA'](this.optionGetter).length; },

    listDataGroup() { return this.$store.getters['DataTable/GET_DATA_GROUP'](this.optionGetter); },
    listDataGroupLevel() { return this.$store.getters['DataTable/GET_DATA_GROUP_LEVEL'](this.optionGetter); },

  },
  watch: {
    typeHeight() {
      if (this.typeHeight == 'dense')
        setTimeout(() => this.eventScrollPagination(), 300);
    },
    listDataCount() {
      console.log(this.listDataCount);
      if (this.listDataCount == 0) {
        this.isDialogEmptyShow = true;
      }
    },
  },
  async created() {
    await this.$store.dispatch('DataTable/CREATE_TABLE_DATA_SPACE', {
      tableName: this.tableName,
      guid: this.guid,
      tableOption: {relatedModelView: this.properties.relatedModelView},
      defaultFilters: this.defaultFilters
    })
      .then(() => {});
  },
  mounted() { // Сообщаем в родителя что компонент смонтирован
    this.eventComponentMounted({
      guid: this.guid,
    });
  },
  beforeDestroy() {
    this.$store.dispatch('DataTable/DELETE_TABLE_DATA_SPACE', {
      tableName: this.tableName,
      guid: this.guid,
    });
  },
  methods: {
    getApiNext() { return this.$store.getters['DataTable/GET_ADDRESS_API_NEXT'](this.optionGetter); },
    getApiPrevious() { return this.$store.getters['DataTable/GET_ADDRESS_API_PREVIOUS'](this.optionGetter); },
    getDataCount() { return this.$store.getters['DataTable/GET_DATA'](this.optionGetter); },
    requestData(option) {
      this.$store.dispatch('DataTable/REQUEST_DATA', Object.assign({
        tableName: this.tableName,
        guid: this.guid,
      }, option));
    },
    async addingNewElement() {
      let index = this.$store.getters['DataTable/GET_ADDING_MODE']({
        tableName: this.tableName,
        guid: this.guid,
      }).index;
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
      };
      let bFormData = new FormData();
      for (let key of Object.keys(this.listData[index])) {
        if (this.listData[index][key]) {
          let newCurrentValue = null;
          // console.log(this.items[index][key]);
          if (typeof(this.listData[index][key]) == 'object' && this.listData[index][key] != null) {
            if ('id' in this.listData[index][key]) newCurrentValue = this.listData[index][key].id;
            else newCurrentValue = this.listData[index][key].value;
          } else {
            newCurrentValue = this.listData[index][key];
          } 

          bFormData.set(`${key}`, `${newCurrentValue}`);
        }
      };
      console.log(sendOption);
      sendOption.formData = bFormData;
      await this.$store.dispatch('DataTable/ADDING_NEW_ELEMENT', sendOption)
        .then((id) => {
          let addingElement = document.querySelectorAll(`.${this.guid} .body [data-rowId="${id}"]`)[0];
          let eventClick = new Event('click', {bubbles: false});
          addingElement.focus();
          addingElement.dispatchEvent(eventClick);
        });
    },
    setSorting(option) {
      console.log(option);
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: {'ordering': `${(option.ordering) ? '' : '-'}${option.key}`}
      });
    },
    closeEmptyDialog(option) {
      if (option == 'reset' || option == 'off') {

        if (option == 'reset') this.$store.dispatch('DataTable/MARK_EVENT_FILTER_EXTENDED_RESET', { tableName: this.tableName, guid: this.guid })
        else this.$store.dispatch('DataTable/MARK_EVENT_FILTER_EXTENDED_OFF', { tableName: this.tableName, guid: this.guid })

        this.$store.dispatch('DataTable/SET_FILTER_EXTENDED', {
          tableName: this.tableName,
          guid: this.guid,
          value: null,
          requestFalse: null,
        });
        this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
          tableName: this.tableName,
          guid: this.guid,
          defaultFilters: { 'search': null }
        });
      }
      this.isDialogEmptyShow = false;
    },
    toggleGroup(option) {
      this.$store.dispatch('DataTable/SELECTED_GROUP', {
        tableName: this.tableName,
        guid: this.guid,
        value: option
      });
    }
  }
}