<template>
  <div class="field">
    <v-autocomplete ref="fieldInput"
                    class="field-item choice"
                    v-bind="fieldPropsNested"
                    :rules="(isRequired) ? [rules.required] : []"
                    :items="fieldItems"
                    :item-text="itemText"
                    :item-value="itemValue"
                    v-model="fieldValue"
                    @click="evtClick"
                    @input="evtInput"
                    @keydown="evtKeydown"
                    @keydown.enter="evtKeydownControl"
                    @keydown.esc="evtKeydownControl"
                    @keydown.tab="evtKeydownControl"
                    @blur="evtBlur"
                    @focus="evtFocus"></v-autocomplete>
  </div>
</template>

<script>
import fieldModel from './FieldModel';
import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldChoice',
  model: {
    ...fieldModel,
  },
  props: {
    ...fieldProps,
    itemText: { type: String, default: 'display_name' },
    itemValue: { type: String, default: 'value' },
    items: { type: Array, default: () => [] },
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
    fieldItems() {
      const items = [{ display_name: 'Значения отсутствуют', value: null }];
      return items.concat(this.items);
    },
  },
  watch: {
    fieldValueInput() { this.fieldValue = this.fieldValueInput; },
  },
  methods: {
    evtClick() {
      console.log(this.$refs.fieldInput.$el.getAttribute(''));
    },
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    async evtKeydownControl(evt) {
      const isOpenCombobox = this.$refs.fieldInput.$el
        .querySelector('.v-input__slot').getAttribute('aria-expanded');
      if (isOpenCombobox === 'false') this.$emit('keydown:control', evt);
    },
    evtFocus() {},
    evtBlur(evt) {
      this.$emit('blur:input', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Field.scss';

::v-deep {
  .v-input__slot {
    padding: 0px !important;
  }
  input {
    min-width: 46px !important;
  }
}
</style>
