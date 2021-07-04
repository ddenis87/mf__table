export default {
  fieldPropsNested() {
    return {
      dense: true,
      'hide-details': 'auto',
      label: this.fieldLabel,
      clearable: this.isClearable,
      disabled: this.isDisabled,
      flat: this.isFlat,
      solo: this.isSolo,
      'single-line': this.isSingleLine,
    };
  },
};
