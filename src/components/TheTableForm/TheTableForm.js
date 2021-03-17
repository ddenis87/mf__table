import ElFieldNumber from '@/components/Elements/ElField/ElFieldNumber.vue';
import ElFieldString from '@/components/Elements/ElField/ElFieldString.vue';
import ElFieldStringArea from '@/components/Elements/ElField/ElFieldStringArea.vue';
import ElFieldDate from '@/components/Elements/ElField/ElFieldDate.vue';
// import ElFieldDateTime from '@/components/Elements/ElField/ElFieldDateTime.vue';
import ElFieldChoice from '@/components/Elements/ElField/ElFieldChoice.vue';
import ElFieldDialog from '@/components/Elements/ElField/ElFieldDialog.vue';
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

export const TheTableForm = {
  components: {
    ElFieldNumber,
    ElFieldString,
    ElFieldStringArea,
    ElFieldDate,
    // ElFieldDateTime,
    ElFieldChoice,
    ElFieldDialog,
    ElBtn,
  },
  props: {
    actionName: 'adding',
    guid: null,
    focusedElement: Object,
  },
  data() {
    return {
      fieldArray: null,
    }
  },
  computed: {
    fieldForm() {
      if (!this.guid) return null;
      let fieldForm = this.$store.getters[`DataTable/GET_FIELD`](this.tableName);
      // console.log(fieldForm);
      if (this.focusedElement != null) {
        for (let key of Object.keys(fieldForm)) {
          this.fieldFormValue[key] = this.focusedElement[key];
        }
      }
      return fieldForm;
    },
  },
  watch: {
    focusedElement() {
      if (this.focusedElement == null) this.fieldFormValueClear();
    },
  },
  created() {
    // this.$store.dispatch(`DataTable/REQUEST_OPTIONS`, {tableName: this.tableName, guid: this.guid,});
  },
  mounted() {
    this.fieldArray = Array.from(document.querySelectorAll('.table-form .el-field__item input[tabindex="1"]'));
  },
  methods: {
    // NAVIGATION
    eventNextElement(event) {
      let target = event.event.target;
      let eventClick = new Event('click');
      target.closest('.el-field').dispatchEvent(eventClick);
      let currentFieldIndex = this.fieldArray.indexOf(target);
      if (currentFieldIndex + 1 == this.fieldArray.length) {
        target.closest('.table-form').querySelector('.tabspace-end button').focus();
        return;
      }
      setTimeout(() => {
        document.querySelectorAll('.table-form .el-field__item input[tabindex="1"]')[currentFieldIndex + 1].focus();
      }, 100);
    },
    eventKeydownAccept(event) {
      switch(event.key) {
        case 'Enter': {this.eventClickActionAccept(); break;}
        case 'Tab': {
          setTimeout(() => {
            event.target.closest('.table-form').querySelectorAll('.el-field__item input[tabindex="1"]')[0].focus();
          }, 100);
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
      // this.$refs.formAction.reset();
      // setTimeout(() => { // ЧТОБ СТЕРЕТЬ ДАТУ ИЗ ЗА МАСКИ
      //   this.$refs.formAction.reset();
      // },100);
    },
    eventClickActionAccept() {
      if (!this.$refs.formAction.validate()) {
        setTimeout(() => {
          this.$refs.formAction.resetValidation();
        }, 3000);
        return;
      }
      if (!this.fieldFormValueValidation()) return;
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
      console.log(option);
      // console.log(option);
      for (let key of Object.keys(option.values)) {
        // if (option.values[key] != null) {
          if (typeof(option.values[key]) == 'object' && option.values[key] != null) {
            if ('id' in option.values[key]) option.values[key] = option.values[key].id;
            else option.values[key] = option.values[key].value;
          }
        // }
      }
      console.log(option);
      this.$emit('event-action-accept', option);
      this.$refs.formAction.reset();
      // setTimeout(() => { // ЧТОБ СТЕРЕТЬ ДАТУ ИЗ ЗА МАСКИ
      //   this.$refs.formAction.reset();
      // },100);
    },
    fieldFormValueValidation() {
      for (let key of Object.keys(this.fieldFormValue)) {
        if (this.fieldForm[key].required == true && (this.fieldFormValue[key] == '' || this.fieldFormValue[key] == null)) return false;
      }
      return true;
    }
  },
}