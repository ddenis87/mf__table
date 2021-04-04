import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import store from '@/store';
import ContentEditing from '../components/ContentEditing.vue';
import FormEditField from '../components/FormEditField.vue';
import FormEditElement from '../components/FormEditElement.vue';

export const DataTableBodyEvents = {
  data() {
    return {
      isTooltipTimer: null,
      formEditField: null,
      formEditElement: null,
    }
  },
  computed: {
    getAddingMode() {
      return (this.$store.getters['DataTable/GET_MARK_MODE_ADDING']({ tableName: this.tableName, guid: this.guid })) ? true : false;
    },
    getEventAdding() {
      return this.$store.getters['DataTable/GET_MARK_EVENTS_ADDING']({ tableName: this.tableName, guid: this.guid });
    }
  },
  watch: {
    getEventAdding() {
      if (this.getEventAdding) {
        let activeElement = this.$store.getters[`DataTable/GET_ACTIVE_ELEMENT`]({
          tableName: this.tableName,
          guid: this.guid,
        });
        let targetInsert;
        if (activeElement) {
          targetInsert = document.querySelector(`.${this.guid} .body [data-rowid="${activeElement.id}"]`);
        } else {
          targetInsert = null;
        }
        // console.log(targetInsert);
        this.mountFormEditElement({targetInsert: targetInsert})
      }
    },
  },
  methods: {
    // EVENT EXPANSION ROW
    eventExpansionRow(event) {
      event.target.closest('.action-btn').classList.toggle('action-btn_action');
      event.target.closest('.body-row').classList.toggle('body-row_auto');
      let celsDisplay = event.target.closest('.body-row').querySelectorAll('.content-display');
      celsDisplay.forEach(element => {
        element.classList.toggle('content-display_auto');
      });
    },
    
    // EVENT TOGGLE EDITING COLUMN
    eventColumnDblclick(event, element, fieldOption, fieldValue) {
      if (this.getAddingMode) { event.preventDefault(); return; }
      // console.log(itemRow);
      if (!this.checkForEditable(event, fieldOption)) {    // checkForEditable - in mixin Editing
        if (this.isModeAdding) {
          // console.log(event.target.nextElementSibling);
          let nextEditableElement = event.target.nextElementSibling;
          if(!nextEditableElement) {
            this.editingAcceptedNewElement();
            return;
          }
          let nextEventDblclickToElement = new Event('dblclick', {bubbles: false});
          nextEditableElement.focus();
          nextEditableElement.dispatchEvent(nextEventDblclickToElement);
        }
        return;
      }
      this.switchDecorationToEdit(event);  // switchDecorationToEdit - in mixin Editing
      if (event.target.closest('.body-column').querySelector('.box-editing-default')) {
        let targetInsert = event.target.closest('.body-column').querySelector('.box-editing-default');
        
        this.mountFormEditField({
          targetInsert,
          fieldOption,
          fieldValue,
          element,
        });
          // this.mountEditingComponent(target, targetInsert, fieldOption, fieldValue);  // mountEditingComponent - in mixin Editing


      }
    },

    mountFormEditField(option) {
      let propertiesComponent = {
        tableName: this.tableName,
        guid: this.guid,
      };
      let propertiesField = {
        fieldOption: option.fieldOption,
        fieldValue: option.fieldValue,
      };
      let subClassVue = Vue.extend(FormEditField);
      this.formEditField = new subClassVue({
        vuetify,
        store,
        propsData: {
          propertiesComponent,
          propertiesField,
          element: option.element,
          typeRow: this.typeRow,
        }
      }).$mount();
      option.targetInsert.prepend(this.formEditField.$el);
    },

    mountFormEditElement(option) {
      let propertiesComponent = {
        tableName: this.tableName,
        guid: this.guid,
      };
      let subClassVue = Vue.extend(FormEditElement);
      this.formEditElement = new subClassVue({
        vuetify,
        store,
        propsData: {
          propertiesComponent,
          itemsHeader: this.itemsHeader,
          styleForm: this.template,
          typeRow: this.typeRow,
          isHierarchyMode: this.isHierarchyMode,
        }
      }).$mount();
      if (option.targetInsert) {
        option.targetInsert.after(this.formEditElement.$el);
      } else {
        document.querySelector(`.${this.guid} .body`).prepend(this.formEditElement.$el);

      }
    },

    checkForEditable(event, columnProperties) {
      if (!this.isEditable) { return false; } // if table properties editable set in false // ??? emit rowProperties
      if (columnProperties['read_only']) { return false; } // field not can edit (at API)
      if (columnProperties['disabled'] == true) { return false } // disabled in properties table
      if (event.target.closest('.body-column').querySelector('.box-display.display-none')) { return false; } // if we are already editing
      return true;
    },
    switchDecorationToDisplay() {
      this.isColumnEditing = false; // status editing
      this.isColumnFocus = false; // status focus
      let editableElement = document.querySelector('.body-column_editing');
      editableElement.classList.remove('body-column_editing');
      editableElement.querySelector('.box-display').classList.remove('display-none');
      editableElement.querySelector('.box-editing').classList.add('display-none');
    },
    switchDecorationToEdit(event) {
      this.isColumnEditing = true; // status editing
      let editableElement = event.target.closest('.body-column');
      editableElement.classList.add('body-column_editing');
      editableElement.querySelector('.box-display').classList.add('display-none');
      editableElement.querySelector('.box-editing').classList.remove('display-none');
    },
    editingCanceled() {
      // console.log('delete comp edidting');
      // Vue.delete(this.formEditField);
      this.formEditField = null
      let editableElement = document.querySelector('.body-column_editing');
      editableElement.classList.remove('body-column_focus');
      editableElement.parentElement.classList.remove('body-row_focus');
      this.switchDecorationToDisplay();
      this.$emit('event-body-blur');
    },
    editingAccepted(event) {
      switch(event.detail.key) {
        case 'Enter': {
          this.switchDecorationToDisplay();
          event.target.focus();
          break;
        }
        case 'Tab': {
          let nextEditableElement = null; 
          if (event.detail.keyShift) nextEditableElement = event.target.previousElementSibling;
          else nextEditableElement = event.target.nextElementSibling;
          // console.log(nextEditableElement);
          this.switchDecorationToDisplay();
          event.target.classList.remove('body-column_focus');
          if (!nextEditableElement) {
            // this.editingAcceptedNewElement(event);
            if (this.$store.getters['DataTable/GET_ADDING_MODE']({
              tableName: this.tableName,
              guid: this.guid,
            }).index != null) {
              this.$emit('adding-new-element');
            } else {
              event.target.closest('.body-row').classList.remove('body-row_hover');
              event.target.closest('.body-row').classList.remove('body-row_focus');
            }
            
            return;
          }
          setTimeout(() => {
            let nextEventDblclickToElement = new Event('dblclick', {bubbles: false});
            nextEditableElement.focus();
            nextEditableElement.dispatchEvent(nextEventDblclickToElement);
          }, 10)
          break;
        }
      }
    },


    // EVENTS MOUSE
    eventMouseOver(event) {
      if (this.getAddingMode) { event.preventDefault(); return; }
      if (!this.isColumnEditing && this.typeRow != 'auto')
        this.isTooltipTimer = setTimeout(() => {
          if (event.target.closest('.body-column > .box-display')) {
            let parent = event.target.closest('.body-column > .box-display').getBoundingClientRect();
          // console.log(parent);
            this.$emit('show-tooltip', Object.assign(parent, {text: event.target.closest('.body-column').getAttribute('data-overflow-text')}));
          }
        }, 1100);
      if (!this.isColumnFocus && !this.isColumnEditing && !this.isRowFocus && !this.getAddingMode)
        event.target.closest('.body-row')?.classList.add('body-row_hover');
      
    },
    eventMouseOut(event) {
      clearTimeout(this.isTooltipTimer);
      if (event.relatedTarget?.classList?.contains('tooltip')) return;
      // if (!this.isColumnFocus && !this.isColumnEditing && !this.isRowFocus) /// ???????
      event.target.closest('.body-row')?.classList.remove('body-row_hover');
      // this.tooltipHide(event);
      this.$emit('hide-tooltip');
    },
    // EVENTS KEYBOARD
    eventRowKeydown(event, itemRow) { // НАВИГАЦИЯ ПРИ ЗАБЛОКИРОВАННОЙ ТАБЛИЦЕ НА РЕДАКТИРОВАНИЕ (НАВИГАЦИЯ ПО СТРОКАМ)
      console.log('event row keydown');
      if (this.getAddingMode) { event.preventDefault(); return; }
      if (event.code.includes('Arrow') || event.code == 'Tab') {
        event.preventDefault();
        if ((event.code == 'ArrowDown' && event.target.nextElementSibling) || (event.code =='Tab' && event.shiftKey == false)) { event.target.nextElementSibling.focus(); }
        if ((event.code == 'ArrowUp' && event.target.previousElementSibling) || (event.code =='Tab' && event.shiftKey == true)) { event.target.previousElementSibling.focus(); }
      }
    },
    eventRowDblclick(event, itemRow) {
      if (this.getAddingMode) { event.preventDefault(); return; }
      let newItemRow = Object.assign({}, itemRow);
      if ('text' in newItemRow) delete newItemRow.text;
      this.$emit('event-row-selected', event, newItemRow);
    },
    
    async eventColumnKeydown(event, itemRow, itemColumn, columnValue) {
      if (this.getAddingMode) { event.preventDefault(); return; }
      // console.log(event);
      if (event.code.includes('Arrow') || event.code == 'Tab') {
        event.preventDefault();
        if ((event.code == 'ArrowRight' && event.target.nextElementSibling) || (event.code =='Tab' && event.shiftKey == false && event.target.nextElementSibling)) { event.target.nextElementSibling.focus(); return; }
        if ((event.code == 'ArrowLeft' && event.target.previousElementSibling) || (event.code =='Tab' && event.shiftKey == true)) { event.target.previousElementSibling.focus(); return; }
        if (event.code == 'ArrowDown' || event.code == 'ArrowUp') {
          let currentIndex = event.target.getAttribute('tabindex');
          if (this.isExpansion) currentIndex++;
          // if (this.isHierarchyMode) currentIndex++;
          if (event.code == 'ArrowDown' && event.target.parentElement.nextElementSibling) { //.closest('.body-row')) {
            event.target.parentElement.nextElementSibling.children[currentIndex].focus();
          }
          if (event.code == 'ArrowUp' && event.target.parentElement.previousElementSibling) { //.closest('.body-row')) { 
            event.target.parentElement.previousElementSibling.children[currentIndex].focus(); 
          }
          return;
        }
      }
      if (event.code.includes('Key') || event.code.includes('Numpad') || event.code.includes('Digit') || event.code == 'Enter') {
        this.eventColumnDblclick(event, itemRow, itemColumn, columnValue); // ПЕРЕКЛЮЧАЕМСЯ В РЕЖИМ РЕДАКТИРОВАНИЯ
      }
      if (event.code == 'Insert') {
        // console.log(event.target.closest('.body-row'));
        let addingElement = event.target.closest('.body-row');
        this.mountFormEditElement({targetInsert: addingElement});
        // if (!this.isAddingInline) return;
        // await this.$store.dispatch('DataTable/ADDING_NEW_ELEMEN_INLINE', {
        //   tableName: this.tableName,
        //   guid: this.guid,
        //   id: ('id' in itemRow) ? itemRow.id : -1,
        // })
        //   .then(() => {
        //     // -----------------------------------------------------------
        //     // let index = this.$store.getters['DataTable/GET_ADDING_MODE']({ tableName: this.tableName, guid: this.guid }).index;
        //     let addingElement = document.querySelectorAll(`.${this.guid} .body .body-row`)[index];
        //     addingElement.style = {};
        //     addingElement.innerHTML = '';
        //     this.mountFormEditElement({targetInsert: addingElement});
        //     // console.log(addingElement);
        //     // -----------------------------------------------------------

        //     // -----------------------------------------------------------
        //     // let index = this.$store.getters['DataTable/GET_ADDING_MODE']({ tableName: this.tableName, guid: this.guid }).index;
        //     // let addingElement = document.querySelectorAll(`.${this.guid} .body .body-row`)[index].querySelectorAll('.body-column')[0];
        //     // let eventDblClick = new Event('dblclick', {bubbles: false});
        //     // addingElement.focus();
        //     // addingElement.dispatchEvent(eventDblClick);
        //   });
      }
    },

    // EVENT FOCUS/SELECT/BLUR ROW
    eventRowFocus(event, itemRow) {
      if (this.getAddingMode) { event.preventDefault(); return; }
      this.isRowFocus = true;
      event.target.classList.remove('body-row_hover');
      event.target.classList.add('body-row_focus');
      this.$emit('event-row-focused', event, itemRow);
    },
    eventRowBlur(event) {
      // if (this.getAddingMode) { event.preventDefault(); return; }
      this.isRowFocus = false;
      event.target.classList.remove('body-row_focus');
      // this.emitBlurBody(event);
      if (!event.relatedTarget) this.$emit('event-body-blur');
    },
    // EVENT FOCUS/BLUR COLUMN
    eventColumnFocus(event, itemRow) {
      this.$emit('hide-tooltip'); // hide tooltip
      if (this.getAddingMode) { event.preventDefault(); return; }
      // this.isTooltipShow = false; 
      this.isColumnFocus = true;
      event.target.parentElement.classList.remove('body-row_hover');
      event.target.parentElement.classList.add('body-row_focus');
      event.target.classList.add('body-column_focus');
      this.$emit('event-row-focused', event, itemRow);
    },
    eventColumnBlur(event) {  // work if not editable
      // if (this.getAddingMode) { event.preventDefault(); return; }
      if (!this.isColumnEditing) {
        this.isColumnFocus = false;
        event.target.parentElement.classList.remove('body-row_focus');
        event.target.classList.remove('body-column_focus');
      }
      if (!event.relatedTarget) this.$emit('event-body-blur');
      // this.emitBlurBody(event);
    },
  }
}