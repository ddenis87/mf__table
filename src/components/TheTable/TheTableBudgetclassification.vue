<template>
  <data-table id="budgetclassification" 
              :properties="tableProperties"
              :type-height="typeRow[typeRowNumber]"
              :type-column="typeColumn"
              :is-editable="isEditable"
              :is-footer="isFooter"
              :is-expansion="isExpansion"
              :is-multiline="isMultiline"
              @event-row-focused="eventRowFocused"
              @event-row-selected="eventRowSelected"
              @event-row-keydown="eventRowKeydown"
              @event-component-blur="eventComponentBlur"
              @component-mounted="componentMounted"></data-table>
</template>

<script>
import { TheTable } from './TheTable.js';

export default {
  name: 'TheTableBudgetclassification',
  mixins: [
    TheTable,
  ],
  props: {
    // typeRowNumber: { type: Number, default: 1 },
    isEditable: { type: Boolean, default: false },
  },
  data() {
    return {
      tablePropertiesUno: {
        tableName: 'budgetclassification',
        relatedModelView: '{head_code} - {head_name}',
        headers: [
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