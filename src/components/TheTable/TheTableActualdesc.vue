<template>
  <data-table v-bind="propertiesTable"
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
      propertiesTableUno: {
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