import ElBtnIcon from '@/components/Elements/ElBtn/ElBtnIcon.vue';
import DialogFullPage from '@/components/Dialogs/DialogFullPage.vue';
import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue';

export const DataTableControl = {
  components: {
    ElBtnIcon,
    DialogFullPage,
    DialogBarRight,
  },
  props: {
    guid: { type: String, default: null },
    tableName: { type: String, default: null },
    focusedElement: null, //{ type: Object, default() { return null } },
  },
  data() {
    return {
      isDialogShow: false,
      isDialogFilterShow: false,
      typeElement: 'element',
    }
  },
  computed: {
    isMountTable() { return (this.guid) ? true : false },
    isHierarchyMode() {
      return this.$store.getters['DataTable/GET_HIERARCHY_MODE']({
        tableName: this.tableName,
        guid: this.guid,
      });
    },
    isFilterFilds() {
      return (this.$store.getters[`DataTable/GET_FILTER_EXTENDED`]({
        tableName: this.tableName,
        guid: this.guid,
      })) ? true : false;
    },
    componentTableForm() {
      if (!this.isDialogShow) return null;
      if (this.typeElement == 'element')
        return () => import(`@/components/TheTableForm/TheTableForm${this.tableName[0].toUpperCase() + this.tableName.slice(1)}`);
      else 
        return () => import(`@/components/TheTableForm/TheTableForm${this.tableName[0].toUpperCase() + this.tableName.slice(1)}Group`);
    },
    componentFilter() {
      if (this.guid)
        return () => import('@/components/DataFilter/DataFilterExtended/DataFilterExtended.vue');
      return null;
    },
    isViewRecucleBin() { return this.$store.getters[`DataTable/GET_FILTER_DEFAULT_FIELD`]({
      tableName: this.tableName,
      guid: this.guid,
      filter: 'is_deleted'
    }); }
  },
  methods: {
    eventOpenForm() {
      this.isDialogShow = true;
    },
    eventCloseDialog() {
      this.isDialogShow = false;
      this.$emit('blur-element');
    },
    toggleRecycleBin() {
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: {'is_deleted': !this.isViewRecucleBin}
      });
    },

    async addingElementInline() {
      // console.log(this.focusedElement);
      await this.$store.dispatch('DataTable/ADDING_NEW_ELEMEN_INLINE', {
        tableName: this.tableName,
        guid: this.guid,
        id: (this.focusedElement) ? this.focusedElement.id : -1,
      })
        .then(() => {
          let index = this.$store.getters['DataTable/GET_ADDING_MODE']({
            tableName: this.tableName,
            guid: this.guid,
          }).index;
          let addingElement = document.querySelectorAll(`.${this.guid} .body .body-row`)[index].querySelectorAll('.body-column')[0];
          let eventDblClick = new Event('dblclick', {bubbles: false});
          addingElement.focus();
          addingElement.dispatchEvent(eventDblClick);
        });
    },

    async eventActionAccept(option) {
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
      };
      Object.assign(sendOption, option);
      if (sendOption.actionName == 'editing') {
        sendOption.id = option.values.id;
        delete sendOption.values.id;
      }
      let bFormData = new FormData();
      for (let key of Object.keys(sendOption.values)) {
        // if (sendOption.values[key])
          bFormData.set(`${key}`, `${sendOption.values[key]}`);
      };
      sendOption.formData = bFormData;
      delete sendOption.values;
      sendOption.previous = true;
      this.eventCloseDialog();
      if (sendOption.actionName == 'editing') 
        this.$store.dispatch(`DataTable/UPDATE_ELEMENT`, sendOption);
      if (sendOption.actionName == 'adding') {
        
        await this.$store.dispatch(`DataTable/ADDING_NEW_ELEMENT`, sendOption)
          .then((id) => {
            // console.log(document.querySelectorAll(`.${this.guid} .body [data-rowId="${id}"]`)[0]);
            let addingElement = document.querySelectorAll(`.${this.guid} .body [data-rowId="${id}"]`)[0];
            let eventClick = new Event('click', {bubbles: false});
            addingElement.focus();
            addingElement.dispatchEvent(eventClick);
          })
      }
        
      
    },

    eventActionCancel() {
      this.eventCloseDialog();
    },
  }
}