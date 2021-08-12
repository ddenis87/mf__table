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
    const formData = new FormData();
    Object.entries(this.fieldFormValue).forEach((field) => {
      const [fieldKey, fieldValue] = field;
      let value = fieldValue || '';
      if (typeof value === 'object' && value !== null) {
        value = value.id || value.value;
      }
      formData.set(fieldKey, value);
    });
    const sendOptions = {
      tableName: this.tableName,
      guid: this.guid,
      formData,
    };
    if (this.focusedElement) {
      sendOptions.actionName = 'editing';
      sendOptions.id = formData.get('id');
      sendOptions.formData.delete('id');
      this.updateElement(sendOptions);
    } else {
      sendOptions.actionName = 'adding';
      sendOptions.previous = true;
      this.addingElement(sendOptions);
    }
  },

  async addingElement(options) {
    const id = await this.$store.dispatch('DataTable/ADDING_NEW_ELEMENT', options);
    const addingElement = document.querySelectorAll(`.${this.guid} .body [data-rowId="${id}"]`)[0];
    if (!addingElement) return;
    const eventClick = new Event('click', { bubbles: false });
    addingElement.focus();
    addingElement.dispatchEvent(eventClick);
  },

  async updateElement(options) {
    console.log(options);
    await this.$store.dispatch('DataTable/UPDATE_ELEMENT', options);
    this.$refs.FormAction.reset();
    this.$emit('event-action-accept', options);
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
