<template>
  <data-table v-bind="tableProps"
              :is-editable-inline="false"
              :is-hierarchy="false"
              @event-component="eventComponent"></data-table>
</template>

<script>
import catalogTable from '@/logics/components/CatalogTable';

export default {
  name: 'TheTableBudgetclassification',
  mixins: [
    catalogTable,
  ],
  props: {
    isAddingInline: { type: Boolean, default: false },
    isEditableInline: { type: Boolean, default: false },
  },
  data() {
    return {
      sourceName: 'budgetclassification',
      optionTable: {
        templateUno: [
          { value: 'head_code', align: 'end', width: [200, 200] },
          { value: 'id', width: [60, 60] },
          { value: 'head_name', width: [400] },

        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
