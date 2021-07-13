<template>
  <div class="filter-extended">
    <div class="body">
      <div v-for="item in listFields" :key="item.key">
        <filter-extended-item :field-options="item"></filter-extended-item>
      </div>
    </div>
    <div class="control"></div>
  </div>
</template>

<script>
import FilterExtendedItem from './FilterExtendedItem.vue';

export default {
  name: 'FilterExtended',
  components: { FilterExtendedItem },
  props: {
    sourceName: { type: String, default: null },
    guid: { type: String, default: null },
    excludedFields: { type: Array, default() { return ['id', 'is_deleted', 'is_group', 'parent', 'related']; } },
  },
  computed: {
    listFields() {
      const listFields = [];
      const listOptions = this.$store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: this.sourceName });
      Object.entries(listOptions).forEach((field) => {
        const [fieldKey, fieldValue] = field;
        if (this.excludedFields.includes(fieldKey)) return;
        listFields.push({
          key: fieldKey,
          value: fieldValue,
        });
      });
      console.log(listFields);
      return listFields;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-extended {
  padding: 10px 0px;
  // border: thin solid green;
  z-index: 999;
  .control {
    padding-bottom: 5px;
    border-bottom: thin solid rgba(128, 128, 128, .4);
  }
}
</style>
