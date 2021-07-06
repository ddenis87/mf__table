<template>
  <div class="edit-field">
    <field-wrapper ref="wrapper"
                   v-bind="fieldProps"
                   v-model="fieldValue"
                   @control:esc="editingCanceled"
                   @keydown:control="editingAccept"
                   @blur:wrapper="editingAccept"></field-wrapper>
  </div>
</template>

<script>
import FieldWrapper from './FieldWrapper.vue';

export default {
  name: 'EditField',
  components: {
    FieldWrapper,
  },
  props: {
    propertiesComponent: { type: Object, default: () => { return { tableName: '', guid: '' }}},
    propertiesField: { type: Object, default: () => { return { fieldOption: Object, fieldValue: null }}},
    element: null,
    typeRow: { type: String, default: 'fixed' },
  },
  data() {
    return {
      fieldValue: null,
    };
  },
  computed: {
    fieldProps() {
      console.log(this.propertiesComponent);
      console.log(this.propertiesField);
      console.log(this.element);
      const props = {
        fieldOptions: this.propertiesField.fieldOption,
        isSelected: true,
      };
      return props;
    },
    fieldOption() { return this.propertiesField.fieldOption; },
    fieldsElement() {
      let fieldsElement = [];
      for (let key of Object.keys(this.element)) {
        fieldsElement.push({key, value: this.computedValueField(this.element[key])});
      }
      return fieldsElement;
    },
  },
  // watch: {
  //   propertiesField() {
  //     console.log(this.propertiesField.fieldValue);
  //     this.fieldValue = this.propertiesField.fieldValue || null;
  //   },
  // },
  mounted() {
    this.fieldValue = this.propertiesField.fieldValue || null;
  },
  beforeDestroy() {
    console.log('destroy');
  },
  methods: {
    editingAccept(option) {
      // this.saveElementFieldInStore(option.value);
      this.saveElementFieldInStore(this.fieldValue);

      let bFormData = this.buildForm();
      let sendOption = {
        ...this.propertiesComponent,
        id: this.element['id'],
        fieldName: this.fieldOption.value,
        value: this.computedValueField(this.fieldValue),
        formData: bFormData,
      };
      this.$store.dispatch('DataTable/UPDATE_ELEMENT_FIELD', sendOption);
      console.log(option);
      let eventEditingAccepted = new CustomEvent('editing-accepted', { detail: { key: (option.event.type == 'blur') ? 'Enter' : option.event.key, keyShift: option.event.shiftKey } });
      
      let editableElement = document.querySelector('.body-column_editing');
      // console.log(editableElement);
      if (document.querySelector('.body-column_editing')) document.querySelector('.body-column_editing').dispatchEvent(eventEditingAccepted);
      
      this.removeFormEditField();
    },

    editingCanceled() {
      let editableField = document.querySelector('.body-column_editing');
      let newEvent = new CustomEvent('editing-canceled')
      editableField.dispatchEvent(newEvent);
      this.removeFormEditField();
    },

    saveElementFieldInStore(value) {
      let sendOption = {
        ...this.propertiesComponent,
        id: this.element['id'],
        fieldName: this.fieldOption.value,
        value: value,
      };
      // console.log(sendOption);
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

    buildForm() {
      let newFormData = new FormData();
      this.fieldsElement.forEach(element => {
        if (element.value != '') 
          newFormData.set(element.key, element.value);
      });
      // newFormData.set(this.fieldOption.value, this.computedValueField(option.value));
      newFormData.set(this.fieldOption.value, this.computedValueField(this.fieldValue));
      return newFormData;
    },

    removeFormEditField() { // ???
      if (document.querySelector('.edit-field')) {
        document.querySelector('.edit-field').remove();
      }
    },
  },
};
</script>
