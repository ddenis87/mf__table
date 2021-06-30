<template>
  <div class="field">
    <v-text-field class="field-text"
                  type="number"
                  dense
                  hide-details="auto"
                  :label="fieldLabel"
                  :clearable="isClearable"
                  :disabled="isDisabled"
                  :flat="isFlat"
                  :solo="isSolo"
                  :single-line="isSingleLine"
                  :rules="(isRequired) ? [rules.required] : []"
                  v-model="fieldValue"
                  @input="evtInput"
                  @keydown="evtKeydown"
                  @keydown.enter="evtKeydownControl"
                  @keydown.esc="evtKeydownControl"
                  @keydown.tab="evtKeydownControl"
                  @blur="evtBlur"
                  @focus="evtFocus"></v-text-field>
  </div>
</template>

<script>
import fieldProps from './FiledProps';
import filedModel from './FieldModel';

export default {
  name: 'FieldNumber',
  model: {
    ...filedModel,
  },
  props: {
    ...fieldProps,
  },
  data() {
    return {
      fieldValue: '',
      rules: {
        required(value) { return !!value || false; },
      },
    };
  },
  watch: {
    fieldValueInput() { this.fieldValue = this.fieldValueInput; },
  },
  methods: {
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    evtKeydownControl(evt) { this.$emit('keydown:control', evt); },
    evtFocus() {},
    evtBlur(evt) { this.$emit('blur:input', evt); },
  },
};
</script>

<style lang="scss" scoped>
@import './Field.scss';

::v-deep {
  .v-input__slot {
    padding: 0px !important;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
