export default {
  copy(value) {
    navigator.clipboard.writeText(value);
  },

  async paste() {
    const pasteValue = await navigator.clipboard.readText();
    return pasteValue;
  },
};
