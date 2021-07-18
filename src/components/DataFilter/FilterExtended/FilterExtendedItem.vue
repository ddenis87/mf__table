<template>
  <div class="filter-extended-item">
    <div class="item item__switch">
      <v-checkbox hide-details v-model="isFilterOn" @change="toggleFilter"></v-checkbox>
    </div>
    <div class="item item__compare">
      <filter-field-wrapper ref="fieldCompare"
                            :field-options="fieldOptionsCompare"
                            @keydown:control="evtKeydownControl"></filter-field-wrapper>
    </div>
    <div class="item item__data">
      <filter-field-wrapper ref="fieldInput"
                            :field-options="fieldOptions.value"
                            @keydown:control="evtKeydownControl"></filter-field-wrapper>
    </div>
  </div>
</template>

<script>
import FilterFieldWrapper from './FilterFieldWrapper.vue';

export default {
  name: 'FilterExtended',
  components: {
    FilterFieldWrapper,
  },
  props: {
    fieldOptions: { type: Object, default() { return { type: 'string' }; } },
  },
  data() {
    return {
      isFilterOn: false,
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
    evtKeydownControl(evt) {
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
