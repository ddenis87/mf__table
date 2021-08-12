<template>
  <div class="filter-extended-item">
    <div class="item item__switch">
      <v-checkbox hide-details v-model="isFilterOn" @change="evtToggleFilter"></v-checkbox>
    </div>
    <div class="item item__compare">
      <p-filter-item-wrapper ref="fieldCompare"
                             :field-options="fieldOptionsCompare"
                             v-model="valueCompare"
                             @input="evtInput"
                             @keydown:control="evtKeydownControl"></p-filter-item-wrapper>
    </div>
    <div class="item item__data">
      <p-filter-item-wrapper ref="fieldInput"
                             :field-options="fieldOptions.value"
                             :field-mode="fieldMode"
                             v-model="valueField"
                             @input="evtInput"
                             @keydown:control="evtKeydownControl"></p-filter-item-wrapper>
    </div>
  </div>
</template>

<script>
import PFilterItemWrapper from './PFilterItemWrapper.vue';
import FIELD_MODE from './PFilter';

export default {
  name: 'PFilterItem',
  components: {
    PFilterItemWrapper,
  },
  model: {
    event: 'input:field',
  },
  props: {
    fieldOptions: { type: Object, default() { return { type: 'string' }; } },
  },
  data() {
    return {
      fieldMode: FIELD_MODE.SINGLE,
      isFilterOn: false,
      valueCompare: null,
      valueField: null,
      valuesField: null,
    };
  },
  computed: {
    fieldOptionsCompare() {
      return {
        type: 'compare',
        typeField: this.fieldOptions.value.type,
        isClearable: false,
      };
    },
  },
  methods: {
    evtInput() {
      const compare = this.getCompareKey();
      if (this.valueCompare === 'between') this.fieldMode = FIELD_MODE.RANGE;
      else this.fieldMode = FIELD_MODE.SINGLE;
      if (!this.valueField) {
        this.isFilterOn = false;
        this.$emit('input:field', null);
        return;
      }
      this.valuesField = this.valueField;
      if (!Array.isArray(this.valuesField)) this.valuesField = [this.valuesField];

      let compareValue = compare;
      this.valuesField.forEach((value) => {
        compareValue = compareValue.replace('{$value}', this.getCompareValue(value));
      });
      this.isFilterOn = true;
      this.$emit('input:field', compareValue);
    },

    evtKeydownControl(evt) {
      if (evt.code === 'Escape') return;

      if (evt.target.closest('.item__compare') && !evt.shiftKey) {
        const nextElement = this.$refs.fieldInput.$el.querySelector('input');
        nextElement.dispatchEvent(new Event('click'));
        nextElement.focus();
      }
      if (evt.target.closest('.item__compare') && evt.shiftKey) this.$emit('keydown:control', evt);

      if (evt.target.closest('.item__data') && !evt.shiftKey) this.$emit('keydown:control', evt);

      if (evt.target.closest('.item__data') && evt.shiftKey) {
        const previousElement = this.$refs.fieldCompare.$el.querySelector('input');
        previousElement.dispatchEvent(new Event('click'));
        previousElement.focus();
      }
    },

    evtToggleFilter() {
      if (this.isFilterOn) this.evtInput();
      if (!this.isFilterOn) this.$emit('input:field', null);
    },

    filterExtendedItemOff() {
      this.isFilterOn = false;
      this.$emit('input:field', null);
    },

    filterExtendedItemReset() {
      this.valueField = null;
      this.isFilterOn = false;
      this.fieldMode = FIELD_MODE.SINGLE;
      this.$emit('input:field', null);
    },

    getCompareKey() {
      const { key } = this.fieldOptions;
      const compareKey = {
        equally: () => `&${key}={$value}`,
        moreOrEqually: () => `&${key}__gte={$value}`,
        lessOrEqually: () => `&${key}__lte={$value}`,
        inList: () => `&${key}__in={$value}`,
        contains: () => `&${key}__contains={$value}`,
        between: () => `&${key}__gte={$value}&${key}__lte={$value}`,
      };
      return compareKey[this.valueCompare]();
    },

    getCompareValue(value) {
      const valueType = {
        string: (v) => v,
        integer: (v) => v,
        date: (v) => v,
        datetime: (v) => v,
        boolean: (v) => v,
        choice: (v) => v.value,
        field: (v) => v.id,
      };
      return valueType[this.fieldOptions.value.type](value);
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-extended-item {
  display: flex;
  align-items: center;
  padding: 5px 12px;
  .item {
    &__switch {
      position: relative;
      top: -8px;
      width: 56px;
    }
    &__compare {
      padding-right: 4px;
      min-width: 180px;
    }
    &__data {
      padding-left: 4px;
      width: 100%;
    }
  }
}
</style>
