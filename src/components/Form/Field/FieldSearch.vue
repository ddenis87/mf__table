<template>
  <div class="field">
    <v-text-field ref="fieldInput"
                  class="field-item text"
                  prepend-icon="mdi-magnify"
                  append-icon="mdi-arrow-right"
                  v-bind="fieldPropsNested"
                  :rules="(isRequired) ? [rules.required] : []"
                  v-model="fieldValue"
                  @click:append="evtSearch"
                  @click:clear="evtClear"
                  @input="evtInput"
                  @keydown="evtKeydown"
                  @keydown.enter="evtKeydownControl"
                  @keydown.esc="evtKeydownControl"
                  @keydown.tab="evtKeydownControl"
                  @blur="evtBlur"
                  @focus="evtFocus"></v-text-field>
    <div v-if="isRequired" class="required"></div>
  </div>
</template>

<script>
import fieldModel from './FieldModel';
import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldText',
  model: {
    ...fieldModel,
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
  computed: {
    ...fieldComputed,
  },
  watch: {
    fieldValueInput() { this.fieldValue = this.fieldValueInput || ''; },
  },
  mounted() {
    if (!this.isSelected) return;
    const element = this.$refs.fieldInput.$el.querySelector('input');
    setTimeout(() => {
      element.select();
      element.focus();
    }, 50);
  },
  methods: {
    evtClear() { this.$emit('search:clear', this.fieldValue); },
    evtSearch() { this.$emit('search', this.fieldValue); },
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
}
</style>
