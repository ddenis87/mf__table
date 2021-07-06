<template>
  <div class="field">
    <v-autocomplete ref="fieldInput"
                    class="field-item choice"
                    return-object
                    no-data-text="Значение отсутствует"
                    :rules="(isRequired) ? [rules.required] : []"
                    :items="fieldItems"
                    :item-text="itemText"
                    :item-value="itemValue"
                    v-bind="fieldPropsNested"
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
    items: {
      type: Array,
      default: () => [{
        display_name: 'Значения отсутствуют',
        value: null,
      }],
    },
    itemValue: { type: String, default: 'value' },
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
      return this.items;
    },
  },
  watch: {
    fieldValueInput() { this.fieldValue = this.fieldValueInput; },
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
    evtClick() {
      console.log(this.$refs.fieldInput.$el.getAttribute(''));
    },
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    evtKeydownControl(evt) {
      const isOpenCombobox = this.$refs.fieldInput.$el
        .querySelector('.v-input__slot').getAttribute('aria-expanded');
      if (isOpenCombobox === 'false') {
        setTimeout(() => document.querySelector('.v-menu__content').remove(), 10);
        this.$emit('keydown:control', evt);
      }
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
