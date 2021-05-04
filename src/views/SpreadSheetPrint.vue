<template>
  <div class="spread-sheet-print">
    <spread-sheet :columns="columns"
                  :columnsCount="sheetSpace.column"
                  :rows="rows"
                  :rowsCount="sheetSpace.row"
                  :cells="cells"
                  :styles="styles"
                  :print-mode="true"></spread-sheet>
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
      ...SpreadSheetData,
    };
  },
  computed: {
    columns() { return JSON.parse(this.columnsJSON); },
    rows() { return JSON.parse(this.rowsJSON); },
    cells() { return JSON.parse(this.cellsJSON); },
  },
};
</script>

<style lang="scss" scoped>

</style>
