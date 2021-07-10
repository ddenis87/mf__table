export default {
  fieldForm() {
    if (!this.guid) return null;
    const fieldForm = this.$store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: this.tableName });
    if (this.focusedElement === null) return fieldForm;
    return fieldForm;
  },
};
