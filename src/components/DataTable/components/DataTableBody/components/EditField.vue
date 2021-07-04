<template>
  <div class="edit-field">
    <field-wrapper ref="wrapper"
                   v-bind="fieldProps"
                   v-model="fieldValue"></field-wrapper>
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
      fieldValue: this.propertiesField.fieldValue || null,
    };
  },
  computed: {
    fieldProps() {
      console.log(this.propertiesComponent);
      console.log(this.propertiesField.fieldValue);
      console.log(this.element);
      return {
        fieldType: this.propertiesField.fieldOption.type,
      };
    },
  },
  watch: {
    propertiesField() {
      console.log(this.propertiesField.fieldValue);
      this.fieldValue = this.propertiesField.fieldValue || null;
    },
  },
};
</script>
