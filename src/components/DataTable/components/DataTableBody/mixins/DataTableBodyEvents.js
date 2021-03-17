import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import store from '@/store';
import ContentEditing from '../components/ContentEditing.vue';

export const DataTableBodyEvents = {
  data() {
    return {
      // isSorting: false,
      isSortingOrderAsc: false,
      isSortingCurrentField: '',
      isTooltipShow: false,
      isTooltipTimer: null,
      isTooltipProperties: { top: 0, left: 0, width: 0, height: 0, text: '' },
    }
  },
  computed: {
    computedTooltipShift() {
      // console.log(this.typeHeight, ' - ', this.typeColumn);
      let calcTooltipShift = { left: -2, top: -3, };
      // if (this.typeHeight == 'fixed' && this.typeColumn == 'fixed') { calcTooltipShift.left = 4; calcTooltipShift.top = -2; return calcTooltipShift};
      if (this.typeHeight == 'fixed' && this.typeColumn == 'dense') { calcTooltipShift.left = -1; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.typeHeight == 'auto' && this.typeColumn == 'fixed') { calcTooltipShift.left = 3; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.typeHeight == 'dense' && this.typeColumn == 'dense') { calcTooltipShift.left = -1; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.typeHeight == 'auto' && this.typeColumn == 'dense') { calcTooltipShift.left = -1; calcTooltipShift.top = -3; return calcTooltipShift};
      return calcTooltipShift;
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
    eventColumnDblclick(event, itemRow, columnProperties, columnValue) {
      // console.log(itemRow);
      if (!this.checkForEditable(event, columnProperties)) {    // checkForEditable - in mixin Editing
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
        let target = event.target.closest('.body-column').querySelector('.box-editing-default');
        this.mountEditingComponent(target, itemRow, columnProperties, columnValue);  // mountEditingComponent - in mixin Editing
      }
    },
    mountEditingComponent(target, itemRow, columnProperties, columnValue) {
      let editingComponentProperties = {
        tableName: this.tableName,
        guid: this.guid,
        itemRow,
        columnProperties,
        columnValue,
      };
      // console.log(editingComponentProperties);
      let editingComponentVue = Vue.extend(ContentEditing);
      let editingComponent = new editingComponentVue({ vuetify, store, propsData: { properties: editingComponentProperties }}).$mount();
      target.prepend(editingComponent.$el);
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
      let editableElement = document.querySelector('.body-column_editing');
      editableElement.classList.remove('body-column_focus');
      editableElement.parentElement.classList.remove('body-row_focus');
      this.switchDecorationToDisplay();
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
            this.$emit('adding-new-element');
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
      if (!this.isColumnFocus && !this.isColumnEditing && !this.isRowFocus)
        event.target.closest('.body-row')?.classList.add('body-row_hover');
      if (!this.isColumnEditing) this.tooltipShow(event);
    },
    eventMouseOut(event) {
      if (event.relatedTarget?.classList?.contains('tooltip')) return;
      // if (!this.isColumnFocus && !this.isColumnEditing && !this.isRowFocus) /// ???????
        event.target.closest('.body-row')?.classList.remove('body-row_hover');
      this.tooltipHide(event);
    },
    // EVENTS KEYBOARD
    eventRowKeydown(event, itemRow) { // НАВИГАЦИЯ ПРИ ЗАБЛОКИРОВАННОЙ ТАБЛИЦЕ НА РЕДАКТИРОВАНИЕ (НАВИГАЦИЯ ПО СТРОКАМ)
      console.log('event row keydown');
      if (event.code.includes('Arrow') || event.code == 'Tab') {
        event.preventDefault();
        if ((event.code == 'ArrowDown' && event.target.nextElementSibling) || (event.code =='Tab' && event.shiftKey == false)) { event.target.nextElementSibling.focus(); }
        if ((event.code == 'ArrowUp' && event.target.previousElementSibling) || (event.code =='Tab' && event.shiftKey == true)) { event.target.previousElementSibling.focus(); }
      }
    },
    eventRowDblclick(event, itemRow) {
      let newItemRow = Object.assign({}, itemRow);
      if ('text' in newItemRow) delete newItemRow.text;
      this.$emit('event-row-selected', event, newItemRow);
    },
    
    async eventColumnKeydown(event, itemRow, itemColumn, columnValue) {
      // console.log('event column keydown');
      if (event.code.includes('Arrow') || event.code == 'Tab') {
        event.preventDefault();
        if ((event.code == 'ArrowRight' && event.target.nextElementSibling) || (event.code =='Tab' && event.shiftKey == false)) { event.target.nextElementSibling.focus(); return; }
        if ((event.code == 'ArrowLeft' && event.target.previousElementSibling) || (event.code =='Tab' && event.shiftKey == true)) { event.target.previousElementSibling.focus(); return; }
        if (event.code == 'ArrowDown' || event.code == 'ArrowUp') {
          let currentIndex = event.target.getAttribute('tabindex');
          if (this.isExpansion) currentIndex++;
          if (this.isHierarchyMode) currentIndex++;
          if (event.code == 'ArrowDown' && event.target.parentElement.nextElementSibling.closest('.body-row')) {
            event.target.parentElement.nextElementSibling.children[currentIndex].focus();
          }
          if (event.code == 'ArrowUp' && event.target.parentElement.previousElementSibling.closest('.body-row')) { 
            event.target.parentElement.previousElementSibling.children[currentIndex].focus(); 
          }
          return;
        }
      }
      if (event.code.includes('Key') || event.code.includes('Digit') || event.code == 'Enter') {
        this.eventColumnDblclick(event, itemRow, itemColumn, columnValue); // ПЕРЕКЛЮЧАЕМСЯ В РЕЖИМ РЕДАКТИРОВАНИЯ
      }
      if (event.code == 'Insert') {
        await this.$store.dispatch('DataTable/ADDING_NEW_ELEMEN_INLINE', {
          tableName: this.tableName,
          guid: this.guid,
          id: ('id' in itemRow) ? itemRow.id : -1,
        })
          .then(() => {
            // let isGroup = this.$store.getters['DataTable/GET_DATA_GROUP_LEVEL']({ tableName: this.tableName, guid: this.guid });
            let index = this.$store.getters['DataTable/GET_ADDING_MODE']({ tableName: this.tableName, guid: this.guid }).index;
            // console.log(index);
            // console.log(document.querySelectorAll(`.${this.guid} .body .body-row`)[index]);
            let addingElement = document.querySelectorAll(`.${this.guid} .body .body-row`)[index].querySelectorAll('.body-column')[0];
            let eventDblClick = new Event('dblclick', {bubbles: false});
            addingElement.focus();
            addingElement.dispatchEvent(eventDblClick);
          });
      }
    },



    // EVENT FOCUS/SELECT/BLUR ROW
    eventRowFocus(event, itemRow) {
      this.isRowFocus = true;
      event.target.classList.remove('body-row_hover');
      event.target.classList.add('body-row_focus');
      this.$emit('event-row-focused', event, itemRow);
    },
    eventRowBlur(event) {
      this.isRowFocus = false;
      event.target.classList.remove('body-row_focus');
      // this.emitBlurBody(event);
      if (!event.relatedTarget) this.$emit('event-body-blur');
    },
    // EVENT FOCUS/BLUR COLUMN
    eventColumnFocus(event, itemRow) {
      this.isTooltipShow = false; // hide tooltip
      this.isColumnFocus = true;
      event.target.parentElement.classList.remove('body-row_hover');
      event.target.parentElement.classList.add('body-row_focus');
      event.target.classList.add('body-column_focus');
      this.$emit('event-row-focused', event, itemRow);
    },
    eventColumnBlur(event) {  // work if not editable
      if (!this.isColumnEditing) {
        this.isColumnFocus = false;
        event.target.parentElement.classList.remove('body-row_focus');
        event.target.classList.remove('body-column_focus');
      }
      if (!event.relatedTarget) this.$emit('event-body-blur');
      // this.emitBlurBody(event);
    },

    // FUNCTION TOOLTIP
    tooltipShow(event) {
      if (event.target.classList.contains('content-display')) {
        let parent = event.target.closest('.body-column');
        this.isTooltipTimer = setTimeout(() => {
          this.isTooltipProperties = {
            top: parent.getBoundingClientRect().top + this.computedTooltipShift.top,
            left: parent.getBoundingClientRect().left + this.computedTooltipShift.left,
            width: parent.getBoundingClientRect().width,
            height: parent.getBoundingClientRect().height,
            text: parent.getAttribute('data-overflow-text'),
          };
        }, 1100);
      }
    },
    tooltipHide(event) {
      this.isTooltipProperties = {
        top: -300,
        left: -300,
        width: 0,
        height: 0,
      };
      if (event.relatedTarget?.classList?.contains('tooltip')) return;
      this.isTooltipShow = false;
      clearTimeout(this.isTooltipTimer);
    },
  }
}