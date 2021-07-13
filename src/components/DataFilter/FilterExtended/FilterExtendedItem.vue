<template>
  <div class="filter-extended-item">
    <div class="item item__switch">
      <v-checkbox hide-details v-model="isFilterOn" @change="toggleFilter"></v-checkbox>
    </div>
    <div class="item item__compare">
      <filter-field-wrapper :field-options="fieldOptionsCompare"></filter-field-wrapper>
    </div>
    <div class="item item__data">
      <filter-field-wrapper :field-options="fieldOptions.value"></filter-field-wrapper>
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
      };
    },
  },
  methods: {
    toggleFilter() {},
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
