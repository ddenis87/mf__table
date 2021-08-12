<template>
  <data-table v-bind="tableProps"
              @event-component="eventComponent"></data-table>
</template>

<script>
import catalogTable from '@/logics/components/CatalogTable';

export default {
  name: 'TableOrganization',
  mixins: [
    catalogTable,
  ],
  props: {
    isHierarchy: { type: Boolean, default: true },
  },
  data() {
    return {
      sourceName: 'organization',
      optionTable: {
        templateUno: [
          { value: 'title', align: 'start', width: [350] },
          { value: 'institution_code', align: 'end', width: 94 },
          { value: 'registry_date', align: 'start', width: 120 },
          { value: 'inn', width: [104, 104] },
          { value: 'kpp', width: [94, 94] },
          { value: 'rubpnubp_status', width: [104, 104] },
          { value: 'egrul_status', width: [115, 115] },
          { value: 'industry_typing', width: [100, 100] },
          { value: 'institution_type', width: [105, 105] },
          { value: 'budget_level', width: [115, 115] },
          { value: 'bk', width: [145, 145], relatedModelView: '{head_code} - {head_name}' },
        ],
        templateMultiline: [
          [
            {
              value: 'title', align: 'start', column: 4, width: [100],
            },
          ], [
            { value: 'institution_code', align: 'end', width: 140 },
            { value: 'inn', width: [120] },
            { value: 'kpp', width: [120] },
            { value: 'budget_level', width: [120] },
          ], [
            { value: 'institution_type', width: [130] },
            { value: 'egrul_status', width: [140, 140] },
            { value: 'rubpnubp_status', width: [140, 140] },
            { value: 'industry_typing', width: [120] },
          ], [
            { value: 'organization_type', align: 'start', width: 115 },
            { value: 'registry_date', align: 'start', width: 90 },
            { value: 'bk', column: 2, width: [180] },
          ],
        ],
      },
    };
  },
};
</script>
