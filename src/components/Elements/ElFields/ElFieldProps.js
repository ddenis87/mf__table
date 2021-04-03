export const ElFieldProps = {
  props: {
    inUse: { type: String, default: 'table' },
    isDense: { type: Boolean, default: true },
    isSingleLine: { type: Boolean, default: false, },  // show or hide label
    isRequiredOff: { type: Boolean, default: false },  // 
    isHideMessage: { type: Boolean, default: false },  // hidden or show validation error
    isHideLabel: { type: Boolean, dafault: false },    // hidden or show label
    isHideUnderline: { type: Boolean, dafault: false },
    isDisabled: { type: Boolean, default: false },
    isBtnClear: { type: Boolean, default: true },
    
    isSelected: { type: Boolean, defalt: false },
    isAutofocus: { type: Boolean, defalt: false },
    inputValue: null,
    inputProperties: { type: Object, default() { return { label: '', required: true, type: 'string' } } },
    inputCustomLabel: { type: String, default: null }
  },
  computed: {
    propsField() {
      return {
        'no-data-text': 'Значение отсутствует',
        'return-object': true,
        dense: this.isDense,
        'single-line': this.isSingleLine,
        solo: this.isHideUnderline,
        flat: this.isHideUnderline,
        'hide-details': this.isHideMessage,
        disabled: this.isDisabled,
        clearable: this.isBtnClear,
        label: this.fieldLabel,
        rules: this.fieldRequired,
        autofocus: this.isAutofocus,
      }
    },
  },
}