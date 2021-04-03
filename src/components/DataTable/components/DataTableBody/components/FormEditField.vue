<template>
  <div class="form-edit-field"
       :class="{'form-edit-field_required': this.fieldOption.required}">
    <el-field-wrapper :is-dense="true"
                      :is-hide-label="true"
                      :is-hide-underline="true"
                      :is-selected="true"
                      :is-autofocus="true"
                      :field-type="fieldType"
                      :field-option="fieldOption"
                      v-model="fieldValue"
                      @event-keydown-escape="editingCanceled"
                      @event-keydown-enter="editingAccept"
                      @event-keydown-tab="editingAccept"
                      @event-blur="editingAccept"></el-field-wrapper>
  </div>
</template>

<script>
import ElFieldWrapper from '@/components/Elements/ElFields/ElFieldWrapper.vue';

export default {
  name: 'FormEditField',
  components: {
    ElFieldWrapper,
  },
  props: {
    propertiesComponent: { type: Object, default: () => { return { tableName: '', guid: '' }}},
    propertiesField: { type: Object, default: () => { return { fieldOption: Object, fieldValue: null }}},
    element: null,
  },
  computed: {
    fieldType() { return this.propertiesField.fieldOption.type; },
    fieldValue() { return this.propertiesField.fieldValue; },
    fieldOption() { return this.propertiesField.fieldOption; },
    fieldsElement() {
      let fieldsElement = [];
      for (let key of Object.keys(this.element)) {
        fieldsElement.push({key, value: this.computedValueField(this.element[key])});
      }
      return fieldsElement;
    },
  },
  methods: {
    editingCanceled() {
      let editableField = document.querySelector('.body-column_editing');
      let newEvent = new CustomEvent('editing-canceled')
      editableField.dispatchEvent(newEvent);
      this.removeFormEditField();
    },
    
    editingAccept(option) {
      console.log(option);
      console.log(this.propertiesField);
      // if (this.$store.getters['DataTable/GET_ADDING_MODE'](this.propertiesComponent).index != null) {  // if ADDING_MODE
      //   if (option.event.type == 'blur') {
      //     this.editingCanceled();
      //   } else {
      //     this.saveElementInStore(option);
      //   }
      //   return;
      // }
      console.log('editingAccept');
      this.saveElementFieldInStore(option.value);

      let bFormData = this.buildForm(option);
      let sendOption = {
        ...this.propertiesComponent,
        id: this.element['id'],
        fieldName: this.fieldOption.value,
        value: this.computedValueField(option.value),
        formData: bFormData,
      };
      this.$store.dispatch('DataTable/UPDATE_ELEMENT_FIELD', sendOption);
      let eventEditingAccepted = new CustomEvent('editing-accepted', { detail: { key: (option.event.type == 'blur') ? 'Enter' : option.event.key, keyShift: option.event.shiftKey } });
      
      let editableElement = document.querySelector('.body-column_editing');
      console.log(editableElement);
      if (document.querySelector('.body-column_editing')) document.querySelector('.body-column_editing').dispatchEvent(eventEditingAccepted);
      
      this.removeFormEditField();
    },

    // saveElementInStore(option) {
    //   console.log('saveElementInStore');
    //   this.saveElementFieldInStore(option.value);
    //   let editableElement = document.querySelector('.body-column_editing');
    //   let eventEditingAccepted = new CustomEvent('editing-accepted', { detail: { key: 'Tab', keyShift: option.event.shift } });
    //   editableElement.dispatchEvent(eventEditingAccepted);
      
    //   this.removeFormEditField();
    // },

    saveElementFieldInStore(value) {
      let sendOption = {
        ...this.propertiesComponent,
        id: this.element['id'],
        fieldName: this.fieldOption.value,
        value: value,
      };
      console.log(sendOption);
      this.$store.dispatch('DataTable/ADDING_NEW_ELEMEN_INLINE_FIELD', sendOption);
    },

    computedValueField(value) {
      let newValue = null;
      if (typeof(value) == 'object' && value != null) {
        if ('id' in value)
          newValue = value.id;
        else
          newValue = value.value;
      }
      else 
        newValue = (value != null) ? value : '';
      return newValue;
    },

    buildForm(option) {
      let newFormData = new FormData();
      this.fieldsElement.forEach(element => {
        if (element.value != '') 
          newFormData.set(element.key, element.value);
      });
      newFormData.set(this.fieldOption.value, this.computedValueField(option.value));
      return newFormData;
    },

    removeFormEditField() {
      if (document.querySelector('.form-edit-field')) {
        document.querySelector('.form-edit-field').remove();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.form-edit-field {
  margin-top: -17px;
  &_required {
    border-bottom: thin dashed red;
  }
}
</style>