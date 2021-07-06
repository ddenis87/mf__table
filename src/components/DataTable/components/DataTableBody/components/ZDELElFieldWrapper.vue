<template>
  <div class="el-field-wrapper"
       :class="{'el-field-wrapper__required': (fieldOption.required && (value == null || value == ''))}">
    <component :is="importField"
               v-model="value"
               v-bind="fieldPropertiesView"
               :input-properties="fieldOption"
               @event-keydown="eventKeydown"
               @event-blur="eventBlur"></component>
    <!-- <div class="el-field-wrapper__required"
         :class="{'el-field-wrapper__required_true': (fieldOption.required && (value == null || value == ''))}"></div> -->
  </div>
</template>

<script>

export default {
  name: 'ElFieldWrapperTable',
  model: {
    prop: 'fieldValue',
  },
  props: {
    inUse: { type: String, default: 'table' },
    isDense: { type: Boolean, default: false },
    isHideLabel: { type: Boolean, dafault: false },
    isHideUnderline: { type: Boolean, dafault: false },
    isRequiredOff: { type: Boolean, dafault: true },
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
      return () => import(`@/components/Elements/ElFields/ElField${this.getFieldName(this.fieldType)}.vue`);
    },
    fieldPropertiesView() {
      return {
        'in-use': this.inUse,
        'is-dense': this.isDense,
        'is-hide-label': this.isHideLabel,
        'is-hide-underline': this.isHideUnderline,
        'is-required-off': this.isRequiredOff,
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
        case 'string': fieldType = `Text`; break;
        case 'integer': fieldType = `Number`; break;
        case 'date': fieldType = `Date`; break;
        case 'datetime': fieldType = `Datetime`; break;
        case 'choice': fieldType = `Choice`; break;
        case 'field': fieldType = `Dialog`; break;
      }
      return fieldName + fieldType;
    },
    eventKeydown(option) {
      switch(option.event.key) {
        case 'Escape': { this.$emit('event-keydown-escape', {...option, fieldKey: this.fieldOption.value}); break; }
        case 'Enter': { this.$emit('event-keydown-enter', {...option, fieldKey: this.fieldOption.value}); break; }
        case 'Tab': { this.$emit('event-keydown-tab', {...option, fieldKey: this.fieldOption.value}); break; }
      }
    },
    eventBlur(option) {
      this.$emit('event-blur', {...option, fieldKey: this.fieldOption.value});
    }
  },
}
</script>

<style lang="scss" scoped>
.el-field-wrapper {
  overflow: hidden;
  margin: 0 3px;
  border-bottom: 2px solid rgba(21, 101, 192, .3);
  &__required {
    border-bottom: 3px solid rgba(255, 0, 0,.6);
  }
}
</style>