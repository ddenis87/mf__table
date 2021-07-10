export default {
  mounted() {
    if (this.focusedElement) {
      this.fieldFormValue = { ...this.fieldFormValue, ...this.fieldForm, ...this.focusedElement };
      return;
    }
    Object.keys(this.fieldForm).forEach((itemKey) => {
      this.fieldFormValue[itemKey] = null;
    });
    this.selectStartForm();
  },
};
