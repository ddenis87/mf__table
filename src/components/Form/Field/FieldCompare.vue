<template>
  <div class="field">
    <v-autocomplete ref="fieldInput"
                    class="field-item compare"
                    placeholder="Выбрать"
                    rounded
                    disable-lookup
                    background-color="rgba(242, 242, 242, 1)"
                    :items="fieldItems"
                    :item-text="itemText"
                    :item-value="itemValue"
                    v-bind="fieldPropsNested"
                    v-model="fieldValue"
                    @click.stop
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

const EQUALLY = { id: 'equally', value: 'Равно' };
const MORE_OR_EQUALLY = { id: 'moreOrEqually', value: 'Больше или равно' };
const LESS_OR_EQUALLY = { id: 'lessOrEqually', value: 'Меньше или равно' };
const IN_LIST = { id: 'inList', value: 'В списке' };
const CONTAINS = { id: 'contains', value: 'Содержит' };
const BETWEEN = { id: 'between', value: 'Диапазон' };

export default {
  name: 'FieldCompare',
  model: {
    ...fieldModel,
  },
  props: {
    ...fieldProps,
    typeField: { type: String, default: 'string' },
  },
  data() {
    return {
      fieldValue: null,
      fieldMap: {
        string: () => [CONTAINS, EQUALLY],
        integer: () => [EQUALLY, CONTAINS, MORE_OR_EQUALLY, LESS_OR_EQUALLY, BETWEEN],
        choice: () => [EQUALLY, IN_LIST],
        date: () => [EQUALLY, MORE_OR_EQUALLY, LESS_OR_EQUALLY, BETWEEN],
        datetime: () => [EQUALLY, MORE_OR_EQUALLY, LESS_OR_EQUALLY, BETWEEN],
        field: () => [EQUALLY, IN_LIST],
      },
      itemText: 'value',
      itemValue: 'id',
    };
  },
  computed: {
    ...fieldComputed,
    fieldItems() {
      return this.fieldMap[this.typeField]();
    },
  },
  async mounted() {
    this.fieldValue = this.fieldMap[this.typeField]()[0].id;
    // await this.$nextTick();
    this.evtInput();
  },
  methods: {
    evtClick() {},
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    evtKeydownControl(evt) {
      const isOpenCombobox = this.$refs.fieldInput.$el
        .querySelector('.v-input__slot').getAttribute('aria-expanded');
      if (isOpenCombobox === 'false') {
        this.$refs.fieldInput.isMenuActive = false;
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

.compare {
  font-size: 14px;
}

::v-deep {
  .v-input__slot {
    padding: 0px 8px !important;
  }
  input {
    min-width: 46px !important;
  }
}
</style>
