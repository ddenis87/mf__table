import ElBtnIconSmall from '@/components/Elements/ElBtn/ElBtnIconSmall.vue';
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

export const ElField = {
  
  components: {
    ElBtnIconSmall,
    ElBtn,
  },
  model: {
    prop: 'inputValue',
    event: 'input-value',
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
  mounted() {
    let inputElement = null;
    switch (this.inputProperties.type) {
      case 'string':
      case 'integer': 
      case 'date':
      case 'datetime': inputElement = document.querySelector(`.el-field-wrapper .v-text-field__slot input`); break;
      case 'choice': 
      case 'field': inputElement = document.querySelector(`.el-field-wrapper .v-select__slot input`); break;
    };
    if (!this.isSelected) return;
    setTimeout(() => {
      // inputElement.setSelectionRange(0, 0);
      inputElement.select();
      inputElement.focus();
    }, 50);
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

    blurField(event) {
      if (this.isEmit)
        this.$emit('event-blur', {event: event, value: (this.fieldValue) ? this.fieldValue : ''});
      else this.isEmit = true;
    }
  }
}