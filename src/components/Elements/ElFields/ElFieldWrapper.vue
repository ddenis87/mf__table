<template>
  <div class="el-field-wrapper">
    <component :is="importField"
               v-model="value"
               v-bind="fieldPropertiesView"
               :input-properties="fieldOption"
               @event-keydown="eventKeydown"
               @event-blur="eventBlur"></component>
  </div>
</template>

<script>

export default {
  name: 'ElFieldWrapperTable',
  model: {
    prop: 'fieldValue',
  },
  props: {
    isDense: { type: Boolean, default: false },
    isHideLabel: { type: Boolean, dafault: false },
    isHideUnderline: { type: Boolean, dafault: false },
    isSelected: { type: Boolean, defalt: false },
    isAutofocus: { type: Boolean, defalt: false },
    isBtnClear: { type: Boolean, default: false },

    fieldType: { type: String, default: 'string' },
    fieldValue: null,
    fieldOption: Object,
  },
  data() {
    return {
      value: this.fieldValue,
    }
  },
  computed: {
    importField() {
      return () => import(`./${this.getFieldName(this.fieldType)}.vue`);
    },
    fieldPropertiesView() {
      return {
        'is-dense': this.isDense,
        'is-hide-label': this.isHideLabel,
        'is-hide-underline': this.isHideUnderline,
        'is-selected': this.isSelected,
        'autofocus': this.isAutofocus,
        'is-btn-clear': this.isBtnClear,
      }
    },
  },
  methods: {
    getFieldName(type) {
      let fieldType = '';
      let fieldName = 'ElField';
      switch(type) {
        case 'string': fieldType = `String`; break;
        case 'integer': fieldType = `Number`; break;
        case 'date': fieldType = `Date`; break;
        case 'datetime': fieldType = `Datetime`; break;
        case 'choice': fieldType = `Choice`; break;
        case 'field': fieldType = `Dialog`; break;
      }
      return fieldName + fieldType;
    },
    eventKeydown(option) {
      option.event.preventDefault();
      switch(option.event.key) {
        case 'Escape': { this.$emit('event-keydown-escape', option); break; }
        case 'Enter': { this.$emit('event-keydown-enter', option); break; }
        case 'Tab': { this.$emit('event-keydown-tab', option); break; }
      }
    },
    eventBlur(option) {
      this.$emit('event-blur', option);
    }
  },
}
</script>

<style lang="scss" scoped>

</style>