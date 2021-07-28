<template>
  <div class="filter-extended-item">
    <div class="item item__switch">
      <v-checkbox hide-details v-model="isFilterOn" @change="toggleFilter"></v-checkbox>
    </div>
    <div class="item item__compare">
      <filter-field-wrapper ref="fieldCompare"
                            :field-options="fieldOptionsCompare"
                            v-model="valueCompare"
                            @input="evtInput"
                            @keydown:control="evtKeydownControl"></filter-field-wrapper>
    </div>
    <div class="item item__data">
      <filter-field-wrapper ref="fieldInput"
                            :field-options="fieldOptions.value"
                            :field-mode="fieldMode"
                            v-model="valueField"
                            @input="evtInput"
                            @keydown:control="evtKeydownControl"></filter-field-wrapper>
    </div>
  </div>
</template>

<script>
import FilterFieldWrapper from './FilterFieldWrapper.vue';
import FIELD_MODE from './FilterExtended';

export default {
  name: 'FilterExtended',
  components: {
    FilterFieldWrapper,
  },
  model: {
    event: 'input:field',
  },
  props: {
    fieldOptions: { type: Object, default() { return { type: 'string' }; } },
  },
  data() {
    return {
      valueCompare: null,
      valueField: null,
      valuesField: null,

      isFilterOn: false,

      fieldMode: FIELD_MODE.SINGLE,
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
    toggleFilter() {},
    evtInput() {
      // console.log(this.valueCompare);
      const compare = this.getCompareKey();
      if (this.valueCompare === 'between') this.fieldMode = FIELD_MODE.RANGE;
      else this.fieldMode = FIELD_MODE.SINGLE;
      if (!this.valueField) {
        this.$emit('input:field', null);
        // console.log('emit "clear:key"');
        return;
      }
      this.valuesField = this.valueField;
      if (!Array.isArray(this.valuesField)) this.valuesField = [this.valuesField];

      let compareValue = compare;
      this.valuesField.forEach((value) => {
        compareValue = compareValue.replace('{$value}', this.getCompareValue(value));
      });

      // const value = this.getCompareValue();
      // const compareValue = compare.replace('{$value}', value);
      this.$emit('input:field', compareValue);
      // console.log(compareValue);
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
  // border: thin solid grey;
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
