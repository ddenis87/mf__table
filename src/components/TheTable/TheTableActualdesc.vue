<template>
  <data-table v-bind="propertiesTable"
              @event-component="eventComponent"></data-table>
</template>

<script>
import { TheTable } from './TheTable.js';

export default {
  name: 'TableActualdesc',
  mixins: [
    TheTable,
  ],
  data() {
    return {
      disEditableInline: false,
      disHierarchy: null,
      disMultiline: null,
      disFooter: null,
      optionTable: {
        tableName: 'actualdesc',
        templateUno: [
          {value: 'start_date', width: [200, 200] },
          {value: 'some_desc', width: [200, ], },
        ],
      },
    }
  },
}
</script>