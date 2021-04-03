import ElFieldHistory from '@/components/Elements/ElFields/ElFieldHistory.vue';
import ElFieldNumber from '@/components/Elements/ElFields/ElFieldNumber.vue';
import ElFieldString from '@/components/Elements/ElFields/ElFieldString.vue';
import ElFieldStringArea from '@/components/Elements/ElFields/ElFieldStringArea.vue';
import ElFieldDate from '@/components/Elements/ElFields/ElFieldDate.vue';
import ElFieldDateTime from '@/components/Elements/ElFields/ElFieldDateTime.vue';
import ElFieldChoice from '@/components/Elements/ElFields/ElFieldChoice.vue';
import ElFieldDialog from '@/components/Elements/ElFields/ElFieldDialog.vue';
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

export const TheTableForm = {
  components: {
    ElFieldHistory,
    ElFieldNumber,
    ElFieldString,
    ElFieldStringArea,
    ElFieldDate,
    ElFieldDateTime,
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
        if (!this.fieldFormValue[key])
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
        this.nextElement(option.event.target.closest('.el-field'));
        // if (nextElement) nextElement.focus();
      }
    },
    nextElement(currentElement) {
      if (currentElement.className.indexOf('form-action') != -1) return null;
      if (currentElement.parentElement.nextElementSibling) {
        let nextElement = currentElement.parentElement.nextElementSibling;
        if (nextElement.querySelector('.el-field > .el-field__item')) {
          nextElement = nextElement.querySelector('.el-field > .el-field__item');
          if (nextElement.parentElement.getAttribute('tabindex') == -1) {
            this.nextElement(nextElement.parentElement);
            return;
          }
          if (nextElement.querySelector('input'))
            return nextElement.querySelector('input').focus();
          if (nextElement.querySelector('textarea'))
            return nextElement.querySelector('textarea').focus();
        }
        if (nextElement.className.indexOf('form-action__control')) {
          nextElement.lastElementChild.querySelector('button').focus();
        }
      }
      this.nextElement(currentElement.parentElement);
    },

    eventAcceptKeydown(event) {
      if (event.key == 'Tab') {
        event.preventDefault();
        let startForm = event.target.closest('.form-action').firstElementChild.firstElementChild.firstElementChild.querySelector('.el-field > .el-field__item');
        if (startForm.querySelector('input')) { startForm.querySelector('input').focus(); return; }
        if (startForm.querySelector('textarea')) { startForm.querySelector('textarea').focus(); return; }
      }
      this.eventFormAccept();
    },

    // ACTIONS
    assingObject(base, added) {
      return Object.assign(base, added);
    },
    eventFormCancel() {
      this.$emit('event-action-cancel');
      this.$refs.formAction.reset();
    },
    async eventFormAccept() {
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
        console.log(item[0], ' - ', item[1]);
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