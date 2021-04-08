import ElBtnIcon from '@/components/Elements/ElBtn/ElBtnIcon.vue';
import DialogFullPage from '@/components/Dialogs/DialogFullPage.vue';

export const DataTableControlActions = {
  components: {
    ElBtnIcon,
    DialogFullPage,
  },
  props: {
    tableName: { type: String, default: '' },
    guid: { type: String, default: '' },
    propsTable: {
      type: Object, default() {
        return {
          isAdding: null,
          isAddingForm: null,
          isAddingInline: null,
          isEditing: null,
          isEditingForm: null,
          isHierarchy: null,
          isMultiline: null,
          isMarkDeleted: null,
        }
      }
    },
    filtersForm: { type: Object, default: () => {} },
  },
  data() {
    return {
      isShowDialog: false,
      typeForm: 'element',
      actionTitle: '',
    }
  },
  computed: {
    activeElement() {
      return this.$store.getters[`DataTable/GET_ACTIVE_ELEMENT`]({
        tableName: this.tableName,
        guid: this.guid,
      });
    },
    buildActionTitle() {
      return `${this.actionTitle} ${(this.typeForm == 'element') ? 'записи' : 'группы'} ${(this.isRecycleBin) ? '(помечен на удаление)' : ''}`
    },
    buildFormName() {
      return this.tableName[0].toUpperCase() + this.tableName.slice(1) + this.typeForm[0].toUpperCase() + this.typeForm.slice(1);
    },
    importComponentForm() {
      if (!this.isShowDialog) return null;
      return () => import(`@/components/TheForms/TheForm${this.buildFormName}`);
    },
    isRecycleBin() { 
      return this.$store.getters[`DataTable/GET_FILTER_DEFAULT_FIELD`]({
        tableName: this.tableName,
        guid: this.guid,
        filter: 'is_deleted'
      });
    },
  },
  methods: {
    addingElement() {
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
        tableName: this.tableName,
        guid: this.guid,
      });
      this.typeForm = 'element';
      this.actionTitle = 'Добавление';
      this.isShowDialog = true;
    },
    
    async addingElementInline() {
      // console.log('adding element')
      this.$store.commit('DataTable/MARK_EVENT_ADDING', {
        tableName: this.tableName,
        guid: this.guid,
        status: true,
      });
      // await this.$store.dispatch('DataTable/ADDING_NEW_ELEMEN_INLINE', {
      //   tableName: this.tableName,
      //   guid: this.guid,
      //   id: (this.activeElement) ? this.activeElement.id : -1,
      // })
      //   .then(() => {
      //     let index = this.$store.getters['DataTable/GET_ADDING_MODE']({
      //       tableName: this.tableName,
      //       guid: this.guid,
      //     }).index;
      //     let addingElement = document.querySelectorAll(`.${this.guid} .body .body-row`)[index].querySelectorAll('.body-column')[0];
      //     let eventDblClick = new Event('dblclick', {bubbles: false});
      //     addingElement.focus();
      //     addingElement.dispatchEvent(eventDblClick);

      //     this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
      //       tableName: this.tableName,
      //       guid: this.guid,
      //     });
      //   });
    },

    addingGroup() {
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
        tableName: this.tableName,
        guid: this.guid,
      });
      this.typeForm = 'group';
      this.actionTitle = 'Добавление';
      this.isShowDialog = true;
    },

    editingElement() {
      if ('is_group' in this.activeElement) {
        if (this.activeElement.is_group) this.typeForm = 'group';
        else this.typeForm = 'element';
      } else {
        this.typeForm = 'element';
      }
      this.actionTitle = 'Редактирование'
      this.isShowDialog = true;
    },
    
    closeDialog() {
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
        tableName: this.tableName,
        guid: this.guid,
      });
      this.isShowDialog = false;
    },
    
    async markDeletingElement() {
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
        id: this.activeElement['id'],
      }
      let snackBar = {
        show: true,
      };
      await this.$store.dispatch('DataTable/DELETED_ELEMENT', sendOption)
        .then(() => {
           snackBar.text = (this.isRecycleBin) ? 'Пометка на удаление снята' : 'Пометка на удаление установлена';
           snackBar.status = true;
         })
         .catch(() => {
           snackBar.text = 'Ошибка, изменения не сохранены';
           snackBar.status = false;
         })
         .finally(() => {
           this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
             tableName: this.tableName,
             guid: this.guid,
           });
           this.$emit('event-mark-deleted', snackBar);
         })
    },
    async deletingElement() {
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
        id: this.activeElement['id'],
      }
      let snackBar = {
        show: true,
      };
      await this.$store.dispatch('DataTable/DELETED_ELEMENT', sendOption)
        .then(() => {
           snackBar.text = 'Элемент удален';
           snackBar.status = true;
         })
         .catch(() => {
           snackBar.text = 'Ошибка, изменения не сохранены';
           snackBar.status = false;
         })
         .finally(() => {
           this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
             tableName: this.tableName,
             guid: this.guid,
           });
           this.$emit('event-mark-deleted', snackBar);
         })
    },

    toggleRecycleBin() {
      this.$store.commit('DataTable/CLEAR_DATA_GROUP_LEGEND', {
        tableName: this.tableName,
        guid: this.guid,
      });
      let filterParams = {
        'is_deleted': !this.isRecycleBin,
        'parent': null,
      };
      if (!this.isRecycleBin) {
        filterParams.is_deleted = true;
        filterParams.parent = null;
        filterParams.parent__isnull = null;
      } else {
        filterParams.is_deleted = false;
        filterParams.parent__isnull = (this.propsTable.isHierarchy) ? true : null;
      }
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: filterParams,
      });
    },
    refreshTable() {
      let filterParams = {
        is_deleted: false,
        parent: null,
        parent__isnull: (this.propsTable.isHierarchy) ? true : null,
        ordering: (this.propsTable.isHierarchy) ? `-is_group` : null, 
      };
      this.$store.dispatch('DataTable/RESET_TABLE', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: filterParams,
      })
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
        bFormData.set(`${key}`, `${sendOption.values[key]}`);
      };
      sendOption.formData = bFormData;
      delete sendOption.values;
      sendOption.previous = true;
      this.closeDialog();
      if (sendOption.actionName == 'editing') 
        this.$store.dispatch(`DataTable/UPDATE_ELEMENT`, sendOption);
      if (sendOption.actionName == 'adding') {
        await this.$store.dispatch(`DataTable/ADDING_NEW_ELEMENT`, sendOption)
          .then((id) => {
            let addingElement = document.querySelectorAll(`.${this.guid} .body [data-rowId="${id}"]`)[0];
            if (!addingElement) return;
            let eventClick = new Event('click', {bubbles: false});
            addingElement.focus();
            addingElement.dispatchEvent(eventClick);
          })
      }
    },
  }
}