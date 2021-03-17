export const ElFieldRange = {
  model: {
    prop: 'inputValue',
    event: 'input-value'
  },
  props: {
    isSingleLine: { type: Boolean, default: false, },  // show or hide label
    isRequiredOff: { type: Boolean, default: false },  // 
    isHideMessage: { type: Boolean, default: false },  // hidden or show validation error
    isHideLabel: { type: Boolean, dafault: false },    // hidden or show label
    isDisabled: { type: Boolean, default: false },     // 
    isSelected: { type: Boolean, defalt: false },      // selected value in text field after mounted
    isBtnClear: { type: Boolean, default: true },     // hidden or show button clear

    inputValue: { type: Object, default() { return { start: null, end: null } } },
  },
  data() {
    return {
      fieldValue: {
        start: null,
        end: null,
      },
    }
  },
  watch: {
    inputValue() {
      if (this.inputValue == null) { 
        this.fieldValue.start = null;
        this.fieldValue.end = null;
        setTimeout(() => {
          this.fieldValue.start = null;
          this.fieldValue.end = null;
        }, 100)
        return;
      }
      this.fieldValue = this.inputValue;
    },
  },
  methods: {
    eventInputValue() {
      if (this.fieldValue.start && this.fieldValue.end)
        this.$emit('input-value', this.fieldValue);
    },
    eventClearValue() {
      if (!this.fieldValue.start && !this.fieldValue.end) {
        this.$emit('clear-value');
        return;
      }
      this.$emit('input-value', this.fieldValue);
    },
  },
}