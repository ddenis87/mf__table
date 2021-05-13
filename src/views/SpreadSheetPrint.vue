<template>
  <div class="spread-sheet-print">
    <spread-sheet :columns="columns"
                  :rows="rows"
                  :cells="cells"
                  :styles="styles"
                  :print-mode="true"></spread-sheet>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';

export default {
  name: 'SpreadSheetPrint',
  components: {
    SpreadSheet,
  },
  props: {
    rows: { type: Object, default() { return {}; } },
    columns: { type: Object, default() { return {}; } },
    cells: { type: Object, default() { return {}; } },
    rowsCount: { type: Number, default: 1000 },
    columnsCount: { type: Number, default: 50 },
    styles: { type: Array, default() { return []; } },
  },
  mounted() {
    console.log(this.cells);
  },
};
</script>

<style lang="scss" scoped>

</style>
