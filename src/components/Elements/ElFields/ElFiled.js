export const ElField = {
  model: {
    prop: 'inputValue',
    event: 'input-value',
  },
  props: {
    isDense: { type: Boolean, default: true },
    isSingleLine: { type: Boolean, default: false, },  // show or hide label
    isRequiredOff: { type: Boolean, default: false },  // 
    isHideMessage: { type: Boolean, default: false },  // hidden or show validation error
    isHideLabel: { type: Boolean, dafault: false },    // hidden or show label
    isHideUnderline: { type: Boolean, dafault: false },
    isDisabled: { type: Boolean, default: false },
    isBtnClear: { type: Boolean, default: true },
    
    isSelected: { type: Boolean, defalt: false },

    inputValue: null,
    inputProperties: { type: Object, default:() => { return { label: '', required: false } } },
    inputCustomLabel: { type: String, default: null }
  },
  data() {
    return {
      isEmit: true,
      fieldValue: this.inputValue,
      rules: {
        required(value) { return !!value || false; },
      },
    }
  },
  computed: {
    fieldLabel() { return (!this.isHideLabel) ? (this.inputCustomLabel) ? this.inputCustomLabel : this.inputProperties.label : null; },
    fieldRequired() { return (this.inputProperties.required && !this.isRequiredOff) ? [this.rules.required] : [] },
  },
  watch: {
    inputValue() { this.fieldValue = this.inputValue; },
  },
  methods: {
    eventInput() { console.log('input'); this.emitInputValue(); },
    eventKeydownTab(event) {
      if (this.checkRequiredField(event)) return;
      this.isEmit = false;

      this.emitInputValue();
      this.emitKeydown(event);
    },
    eventKeydownEnter(event) {
      if (this.checkRequiredField(event)) return;
      this.isEmit = false;

      this.emitInputValue();
      this.emitKeydown(event);
    },
    eventKeydownEsc(event) {
      this.isEmit = false;

      this.emitInputValue();
      this.emitKeydown(event);
    },
    eventClear() {
      this.emitInputValue('');
      this.emitClearValue();
    },
    eventBlur() { if (this.isEmit) this.emitBlur(); },

    emitInputValue(value = (this.fieldValue) ? this.fieldValue : '') { this.$emit('input-value', value); },
    emitClearValue() { this.$emit('clear-value'); },
    emitKeydown(event) { this.$emit('keydown', {event: event, value: this.inputValue}); },
    emitBlur() { this.$emit('blur'); },

    checkRequiredField(event) {
      if (this.inputProperties.required && !this.isRequiredOff) {
        if (!this.fieldValue) {
          if (event.key == 'Tab') event.preventDefault();
          return true;
        }
      }
      return false;
    },
  }
}