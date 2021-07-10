export default {
  selectStartForm() {
    const fieldInput = this.$refs.startForm.$el.querySelector('input')
      || this.$refs.startForm.$el.querySelector('textarea');
    fieldInput.focus();
  },
  evtControlCancel() {
    this.$refs.FormAction.reset();
    this.$emit('event-action-cancel');
  },

  evtControlAccept() {
    if (!this.hasValidation()) return;
    const option = {
      actionName: (this.focusedElement) ? 'editing' : 'adding',
      form: new FormData(),
    };
    Object.entries(this.fieldFormValue).forEach((field) => {
      const [fieldKey, fieldValue] = field;
      let value = fieldValue || '';
      if (typeof value === 'object' && value !== null) {
        value = value.id || value.value;
      }
      option.form.set(fieldKey, value);
    });
    this.$emit('event-action-accept', option);
    this.$refs.FormAction.reset();
  },

  evtKeydownField(evt) {
    if (evt.code !== 'Enter') return;
    this.findNextField(evt.target.closest('.field'));
  },

  findNextField(currentField) {
    if (!currentField.parentElement.nextElementSibling) {
      this.findNextField(currentField.parentElement);
      return;
    }
    const nextField = currentField.parentElement.nextElementSibling;
    if (nextField.classList.contains('form-control')) {
      this.$refs.FormControl.selectControlAccept();
      return;
    }
    const fieldInput = nextField.querySelector('input') || nextField.querySelector('textarea');
    const newEvent = new Event('click');
    fieldInput.dispatchEvent(newEvent);
    fieldInput.focus();
  },

  hasValidation() {
    if (!this.$refs.FormAction.validate()) return false;
    let isValidate = true;
    Object.keys(this.fieldFormValue).forEach((key) => {
      if (['', undefined, null].includes(this.fieldFormValue[key])
        && this.fieldForm[key].required) isValidate = false;
    });
    return isValidate;
  },
};
