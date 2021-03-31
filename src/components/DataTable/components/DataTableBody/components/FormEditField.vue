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
      if (document.querySelector('.form-edit-field')) document.querySelector('.form-edit-field').remove();
    },
    editingAccept(option) {
      console.log(option);
      console.log(this.propertiesField);
      let bFormData = this.buildForm(option);

      for (let key of Object.keys(this.element)) {
        console.log(bFormData.get(key));
      }
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
      let keyValue = null;
      this.fieldsElement.forEach(element => {
        keyValue = Object.entries(element);
        newFormData.set(keyValue[0], keyValue[1]);
      });
      newFormData.set(this.fieldOption.value, option.value);
      return newFormData;
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