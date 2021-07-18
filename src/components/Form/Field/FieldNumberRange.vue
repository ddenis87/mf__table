<template>
  <div class="field-range">
    <field-number ref="fieldFrom"
                  v-bind="fieldFrom"
                  v-model="fieldValueFrom"
                  @input="evtInput"
                  @keydown:control="evtKeydownControl"></field-number>
    <field-number ref="fieldTo"
                  v-bind="fieldTo"
                  v-model="fieldValueTo"
                  @input="evtInput"
                  @keydown:control="evtKeydownControl"></field-number>
  </div>
</template>

<script>
import FieldNumber from './FieldNumber.vue';

import fieldModel from './FieldModel';
import fieldProps from './FieldProps';

export default {
  name: 'FieldNumberRange',
  components: {
    FieldNumber,
  },
  model: {
    ...fieldModel,
  },
  props: {
    ...fieldProps,
  },
  data() {
    return {
      fieldValueFrom: null,
      fieldValueTo: null,
    };
  },
  computed: {
    fieldFrom() {
      return {
        fieldLabel: 'Начало',
        isClearable: this.isClearable,
      };
    },
    fieldTo() {
      return {
        fieldLabel: 'Окончание',
        isClearable: this.isClearable,
      };
    },
  },
  methods: {
    evtInput() {
      if (this.isCompareEmit()) {
        this.$emit('input', [this.fieldValueFrom, this.fieldValueTo]);
      }
      if (this.isCompareEmitClear()) this.$emit('input', null);
    },
    evtKeydownControl(evt) {
      evt.preventDefault();
      if (evt.code === 'Escape') return;

      const nextField = evt.target.closest('.field').nextElementSibling;
      if (nextField && !evt.shiftKey) {
        const nextInput = nextField.querySelector('.field input');
        nextInput.dispatchEvent(new Event('click'));
        nextInput.focus();
        return;
      }

      this.$emit('keydown:control', evt);
    },
    isCompareEmit() {
      return (this.fieldValueFrom && this.fieldValueTo);
    },
    isCompareEmitClear() {
      return (this.fieldValueFrom === null || this.fieldValueTo === null);
    },
  },
};
</script>

<style lang="scss" scoped>
.field-range {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  // border: thin solid green;
}
</style>
