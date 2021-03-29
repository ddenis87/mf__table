<template>
  <data-table v-bind="propertiesTable"
              @event-component="eventComponent"></data-table>
</template>

<script>
import { TheTable } from './TheTable.js';

export default {
  name: 'TheTableBudgetclassification',
  mixins: [
    TheTable,
  ],
  data() {
    return {
      disHierarchy: null,
      disMultiline: null,
      disAddingInline: null,
      disEditableInline: null,
      optionTable: {
        tableName: 'budgetclassification',
        templateUno: [
          {value: 'head_code', align: 'end', width: [200, 200], },
          {value: 'id', width: [60, 60], },
          {value: 'head_name', width: [400,],},
          
        ],
      },
    }
  },
}
</script>

<style lang="scss" scoped>

</style>