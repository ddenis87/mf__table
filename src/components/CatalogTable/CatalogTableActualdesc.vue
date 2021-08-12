<template>
  <data-table v-bind="tableProps"
              @event-component="eventComponent"></data-table>
</template>

<script>
import catalogTable from '@/logics/components/CatalogTable';

export default {
  name: 'TableActualdesc',
  mixins: [
    catalogTable,
  ],
  props: {
    isAddingInline: { type: Boolean, default: false },
    isEditableInline: { type: Boolean, default: false },
  },
  data() {
    return {
      sourceName: 'actualdesc',
      optionTable: {
        templateUno: [
          { value: 'start_date', width: [210, 210] },
          { value: 'some_desc', width: [200] },
        ],
      },
    };
  },
};
</script>
