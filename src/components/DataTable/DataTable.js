import { Guid } from 'js-guid';

export const DataTable = {
  data() {
    return {
      guid: 'd' + Guid.newGuid().StringGuid,
      // isBlockTable: false,
    }
  },
  computed: {
    optionGetter() { return { tableName: this.tableName, guid: this.guid } },
    propsTable() { return this.$store.getters['DataTable/GET_PROPS_TABLE'](this.optionGetter); },
    isLoadingData() {
      let status = this.$store.getters['DataTable/GET_LOADING_API'](this.optionGetter);
      if (!status) {
        // console.log('add listener scroll');
        this.parentElement.addEventListener('scroll', this.eventScrollPagination);
        if (this.getCountDataTotal() != 0)
          setTimeout(() => this.eventScrollPagination(), 300);
      } else {
        if (this.parentElement)
          this.parentElement.removeEventListener('scroll', this.eventScrollPagination);
      }
      return status; //this.$store.getters['DataTable/GET_LOADING_API'](this.optionGetter);
    },
    // isHierarchyMode() { 
    //   return this.$store.getters['DataTable/GET_HIERARCHY_MODE'](this.optionGetter); 
    // },

    listOptions() { return this.$store.getters['DataTable/GET_LIST_OPTIONS'](this.optionGetter); },
    listData() { return this.$store.getters['DataTable/GET_LIST_DATA'](this.optionGetter); },
    countDataTotal() { return this.$store.getters['DataTable/GET_COUNT_DATA_TOTAL'](this.optionGetter); },
    countDataLoaded() {return this.$store.getters['DataTable/GET_COUNT_DATA_LOADED'](this.optionGetter); },

    listDataGroup() { return this.$store.getters['DataTable/GET_DATA_GROUP'](this.optionGetter); },
    listDataGroupLevel() { return this.$store.getters['DataTable/GET_DATA_GROUP_LEVEL'](this.optionGetter); },

  },
  watch: {
    propsTable() {
      if (this.propsTable.typeRow == 'dense')
        setTimeout(() => this.eventScrollPagination(), 300);
    },
    countDataTotal() {
      // console.log(this.countDataTotal);
      if (this.countDataTotal == 0 && 
          (this.$store.getters['DataTable/GET_FILTER_EXTENDED'](this.optionGetter) != '' ||
            this.$store.getters['DataTable/GET_FILTER_DEFAULT_FIELD'](Object.assign({ filter: 'search' }, this.optionGetter)) != null )) {
        this.isShowDialogEmpty = true;
      }
      // if (this.countDataTotal < 50) {
      //   if (this.getApiNext())
      //     this.requestData({next: true});
        // if (this.getApiPrevious()) {
        //   console.log('previous load');
          // this.requestData({previous: true});
      //   }
      // }
    },
  },
  async created() {
    await this.$store.dispatch('DataTable/CREATE_TABLE_DATA_SPACE', {
      tableName: this.tableName,
      guid: this.guid,
      tableOption: {
        propsTable: {
          typeRow: this.typeRow,
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
      defaultFilters: this.defaultFilters
    })
      .then(() => {
        // properties in stor
      });
  },
  mounted() { // Сообщаем в родителя что компонент смонтирован
    this.mountedComponent({
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
    getApiNext() { return this.$store.getters['DataTable/GET_LINK_PAGE_NEXT'](this.optionGetter); },
    getApiPrevious() { return this.$store.getters['DataTable/GET_LINK_PAGE_PREVIOUS'](this.optionGetter); },
    // getDataCount() { return this.$store.getters['DataTable/GET_DATA'](this.optionGetter); },
    getCountDataTotal() { return this.$store.getters['DataTable/GET_COUNT_DATA_TOTAL'](this.optionGetter); },
    async requestData(option) {
      await this.$store.dispatch('DataTable/REQUEST_DATA', Object.assign({
        tableName: this.tableName,
        guid: this.guid,
      }, option))
        .then(() => {
          this.isBlock = true;
        });
    },
    requestDataPrevious(option) {
      this.$store.dispatch('DataTable/REQUEST_DATA_PREVIOUS', Object.assign({
        tableName: this.tableName,
        guid: this.guid,
      }, option));
    },
    async addingNewElement() {
      // this.isBlockTable = true;
      this.parentElement.removeEventListener('scroll', this.eventScrollPagination);
      console.log('adding element for table');
      let index = this.$store.getters['DataTable/GET_ADDING_MODE']({
        tableName: this.tableName,
        guid: this.guid,
      }).index;
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
      };
      let bFormData = new FormData();
      console.log(this.defaultFilters);
      if(this.defaultFilters) {
        for (let key of Object.keys(this.defaultFilters)) {
          bFormData.set(`${key}`, this.defaultFilters[key]);
        }
      }
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
      sendOption.previous = true;
      await this.$store.dispatch('DataTable/ADDING_NEW_ELEMENT', sendOption)
        .then((id) => {
          // console.log(id);
          let addingElement = document.querySelectorAll(`.${this.guid} .body [data-rowId="${id}"]`)[0];

          // console.log(addingElement);
          let eventClick = new Event('click', {bubbles: false});
          addingElement.focus();
          addingElement.dispatchEvent(eventClick);
        })
        .finally(() => {
          // this.isBlockTable = false;
          this.$store.commit('DataTable/RESET_ADDING_MODE',{
            tableName: this.tableName,
            guid: this.guid,
          })
        });
    },
    setSorting(option) {
      console.log(option);
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: {'ordering': `${(this.propsTable.isHierarchy) ? '-is_group,' : ''}${(option.ordering) ? '' : '-'}${option.key}`}
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
          defaultFilters: { 'search': null, 'is_deleted': false, }
        });
      }
      this.isShowDialogEmpty = false;
    },
    toggleGroup(option) {
      this.blurComponent();
      if (!this.$store.getters['DataTable/GET_FILTER_DEFAULT_FIELD'](Object.assign({ filter: 'is_deleted' }, this.optionGetter)))
        this.$store.dispatch('DataTable/SELECTED_GROUP', {
          tableName: this.tableName,
          guid: this.guid,
          value: option
        });
    }
  }
}