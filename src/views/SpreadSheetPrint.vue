<template>
  <spread-sheet :columns="columns"
                :rows="rows"
                :cells="cells"
                :styles="styles"
                :print-mode="true"></spread-sheet>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';

export default {
  name: 'SpreadSheetPrint',
  components: {
    SpreadSheet,
  },
  props: {
    // rows: { type: Object, default() { return {}; } },
    // columns: { type: Object, default() { return {}; } },
    // cells: { type: Object, default() { return {}; } },
    // rowsCount: { type: Number, default: 1000 },
    // columnsCount: { type: Number, default: 50 },
    // styles: { type: Array, default() { return []; } },
  },
  data() {
    return {
      columns: {},
      rows: {},
      cells: {},
      styles: [],
    };
  },
  computed: {
    tableColumns() {
      console.log(this.columns);
      return this.columns;
    },
  },
  created() {
    const dataPrint = JSON.parse(localStorage.getItem('dataPrint'));
    if (!dataPrint) return;
    this.rows = dataPrint.rows;
    this.columns = dataPrint.columns;
    this.cells = dataPrint.cells;
    this.styles = dataPrint.styles;
  },
  beforeDestroy() {
    localStorage.removeItem('dataPrint');
  },
};
</script>

<style lang="scss" scoped>

</style>
