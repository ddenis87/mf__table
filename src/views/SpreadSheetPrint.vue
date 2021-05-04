<template>
  <div class="spread-sheet-print">
    <spread-sheet :columns="columns"
                  :columnsCount="sheetSpace.column"
                  :rows="rows"
                  :rowsCount="sheetSpace.row"
                  :cells="cells"
                  :styles="styles"
                  :print-mode="printMode"></spread-sheet>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
import SpreadSheetData from './SpreadSheetData';

export default {
  name: 'SpreadSheetPrint',
  components: {
    SpreadSheet,
  },
  data() {
    return {
      setColumnName: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      ...SpreadSheetData,
      printMode: true,
    };
  },
  computed: {
    columns() { return JSON.parse(this.columnsJSON); },
    rows() { return JSON.parse(this.rowsJSON); },
    cells() { return JSON.parse(this.cellsJSON); },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>

</style>
