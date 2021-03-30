import ElFieldHistory from '@/components/Elements/ElFields/ElFieldHistory.vue';
import ElFieldNumber from '@/components/Elements/ElFields/ElFieldNumber.vue';
import ElFieldString from '@/components/Elements/ElFields/ElFieldString.vue';
import ElFieldStringArea from '@/components/Elements/ElFields/ElFieldStringArea.vue';
import ElFieldDate from '@/components/Elements/ElField/ElFieldDate.vue';
import ElFieldChoice from '@/components/Elements/ElFields/ElFieldChoice.vue';
import ElFieldDialog from '@/components/Elements/ElField/ElFieldDialog.vue';
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

export const TheTableForm = {
  components: {
    ElFieldHistory,
    ElFieldNumber,
    ElFieldString,
    ElFieldStringArea,
    ElFieldDate,
    ElFieldChoice,
    ElFieldDialog,
    ElBtn,
  },
  props: {
    actionName: 'adding',
    guid: null,
    focusedElement: Object,

    filtersForm: { type: Object, default: () => {} },
  },

  computed: {
    fieldForm() {
      if (!this.guid) return null;
      let fieldForm = this.$store.getters[`DataTable/GET_LIST_OPTIONS`]({tableName: this.tableName});
      if (this.focusedElement != null) {
        for (let key of Object.keys(fieldForm)) {
          this.fieldFormValue[key] = this.focusedElement[key];
        }
      }
      return fieldForm;
    },
  },
  mounted() {
    if (this.focusedElement == null) {
      let filtersStor = this.$store.getters[`DataTable/GET_FILTERS`]({tableName: this.tableName, guid: this.guid});
      Object.keys(this.fieldFormValue).forEach(key => {
        if (key in filtersStor) this.fieldFormValue[key] = filtersStor[key];
      })
    }
    if (this.focusedElement == null && this.filtersForm) {
      // console.log('fill filters');
      Object.keys(this.filtersForm).forEach(key => {
        this.fieldFormValue[key] = this.filtersForm[key];
      });
    }
    // this.fieldArray = Array.from(document.querySelectorAll('.table-form .el-field__item input[tabindex="1"]'));
  },
  methods: {
    eventKeydown(option) {
      console.log('keydown form');
      console.log(option);
      if (option.event.key == 'Enter') {
        let nextElement = this.nextElement(option.event.target.closest('.el-field'));
        if (nextElement) nextElement.focus();
      }
    },
    nextElement(currentElement) {
      if (currentElement.className.indexOf('form-action') != -1) return null;
      if (currentElement.parentElement.nextElementSibling) {
        let parentNextElement = currentElement.parentElement.nextElementSibling.querySelector('.el-field > .el-field__item');
        if (parentNextElement.querySelector('input'))
          return parentNextElement.querySelector('input').focus();
        if (parentNextElement.querySelector('textarea'))
          return parentNextElement.querySelector('textarea').focus();
      }
      this.nextElement(currentElement.parentElement);
    },

    eventNextElement() {},
    eventKeydownAccept(event) {
      switch(event.key) {
        case 'Enter': {this.eventClickActionAccept(); break;}
        case 'Tab': {
          console.log('end form tab');
          console.log(event.target.closest('.table-form').querySelector('.tabspace-start input'));
          let eventClick = new Event('click');
          event.target.closest('.table-form').querySelector('.tabspace-start input').focus();
          break;
        }
      }
    },

    // ACTIONS
    assingObject(base, added) {
      return Object.assign(base, added);
    },
    eventClickActionCancel() {
      this.$emit('event-action-cancel');
      this.$refs.formAction.reset();
    },
    async eventClickActionAccept() {
      if (!this.fieldFormValueValidation()) return;
      // console.log(this.fieldFormValue);
      // let sendFormData = new FormData();
      // for (let key of Object.keys(this.fieldFormValue)) {
      //   let value = this.fieldFormValue[key];
      //   if (value)
      //     sendFormData.set(`${key}`, `${value}`);
      // }
      // console.log(sendFormData.get('id'));
      // let sendOption = {
      //   tableName: this.tableName,
      //   guid: this.guid,
      //   formData: sendFormData,
      //   previous: true,
      // };
      // if (sendFormData.get('id')) {
      //   this.$store.dispatch(`DataTable/UPDATE_ELEMENT`, sendOption);
      // } else {
      //   await this.$store.dispatch(`DataTable/ADDING_NEW_ELEMENT`, sendOption)
      //     .then((id) => {
      //       let addingElement = document.querySelectorAll(`.${this.guid} .body [data-rowId="${id}"]`)[0];
      //       if (!addingElement) return;
      //       let eventClick = new Event('click', {bubbles: false});
      //       addingElement.focus();
      //       addingElement.dispatchEvent(eventClick);
      //     })
      // }
      // this.$emit('event-accept');
      let option = {values: {}};
      
      option.actionName = (this.focusedElement) ? 'editing' : 'adding';
      let newFieldFormValue = {};
      for (let item of Object.entries(this.fieldFormValue)) {
        // console.log(item[0], ' - ', item[1]);
        if (item[1] == undefined || item[1] == null) {
          newFieldFormValue[item[0]] = '';
        } else { newFieldFormValue[item[0]] = item[1]; }
      }
      Object.assign(option.values, newFieldFormValue);
      for (let key of Object.keys(option.values)) {
        if (typeof(option.values[key]) == 'object' && option.values[key] != null) {
          if ('id' in option.values[key]) option.values[key] = option.values[key].id;
          else option.values[key] = option.values[key].value;
        }
      }
      // console.log(option);
      this.$emit('event-action-accept', option);
      this.$refs.formAction.reset();
    },

    fieldFormValueValidation() {
      if (!this.$refs.formAction.validate()) {
        setTimeout(() => {
          this.$refs.formAction.resetValidation();
        }, 3000);
        return false;
      }
      for (let key of Object.keys(this.fieldFormValue)) {
        if (this.fieldForm[key].required == true && (this.fieldFormValue[key] == '' || this.fieldFormValue[key] == null)) return false;
      }
      return true;
    }
  },
}