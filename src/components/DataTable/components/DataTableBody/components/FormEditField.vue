<template>
  <div class="form-edit-field">
    <div class="element" :class="`element_${typeRow}`">
      <el-field-wrapper class="element__item"
                        :is-dense="true"
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
    <div class="element line-required">
      <div class="line-required"
           :class="`line-required_${this.fieldOption.required}`"></div>
    </div>
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
    typeRow: { type: String, default: 'fixed' },
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
  padding-top: 2px;
  background-color: white;
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
  .element {
    overflow: hidden;
    
    &_fixed { height: calc(41px - 6px); }
    &_dense { height: 22px; }
    &_auto { height: auto; }
    &__item {
      margin-top: -19px;
    }
  }
  .line-required {
    height: 3px;
    &_false {
      margin: 0px 2px;
      background-color: rgba(21,101,192, .3);
    }
    &_true {
      margin: 0px 2px;
      background-color: rgba(255, 0, 0,.6);
    }
  }
}
</style>