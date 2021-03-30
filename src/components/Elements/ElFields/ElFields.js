import ElBtnIconSmall from '@/components/Elements/ElBtn/ElBtnIconSmall.vue';
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

export const ElField = {
  model: {
    prop: 'inputValue',
    event: 'input-value',
  },
  components: {
    ElBtnIconSmall,
    ElBtn,
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
    fieldItems() { return this.inputProperties.choices; },
    fieldLabel() { return (!this.isHideLabel) ? (this.inputCustomLabel) ? this.inputCustomLabel : this.inputProperties.label : null; },
    fieldRequired() { return (this.inputProperties.required && !this.isRequiredOff) ? [this.rules.required] : [] },
    fieldMaxLength() { return ('max_length' in this.inputProperties) ? this.inputProperties['max_length'] : Infinity; },
  },
  watch: {
    inputValue() { this.fieldValue = this.inputValue; },
  },
  methods: {
    eventClearValue() {
      this.fieldValue = '';
      this.emitInputValue();
      this.emitClearValue();
    },
    
    emitInputValue(value = (this.fieldValue) ? this.fieldValue : '') { this.$emit('input-value', value); },
    emitKeydown(event) { this.$emit('event-keydown', {event: event, value: (this.fieldValue) ? this.fieldValue : ''}); },
    emitClearValue() { this.$emit('clear-value'); },

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