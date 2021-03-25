<template>
  <data-table id="actualdesc" 
              :properties="tableProperties"
              :default-filters="defaultFilters"
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
  name: 'TableActualdesc',
  mixins: [
    TheTable,
  ],
  props: {
  },
  data() {
    return {
      tablePropertiesUno: {
        tableName: 'actualdesc',
        headers: [
          {value: 'start_date', width: [200, 200] },
          {value: 'some_desc', width: [200, ], },
        ],
      },
    }
  },
}
</script>