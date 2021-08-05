<template>
  <spread-sheet :columns="columns"
                :rows="rows"
                :cells="cells"
                :styles="styles"
                :is-show-grid="false"
                :is-show-title="false"
                :is-print-mode="true"></spread-sheet>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';

export default {
  name: 'SpreadSheetPrint',
  components: {
    SpreadSheet,
  },
  data() {
    return {
      rows: {},
      rowCount: 0,
      columns: {},
      columnCount: 0,
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
    const tableDocument = JSON.parse(localStorage.getItem('SpreadSheetTableDocument'));
    if (!tableDocument) return;
    ({
      rows: this.rows = {},
      rowColumn: this.rowColumn = 0,
      columns: this.columns = {},
      columnCount: this.columnCount = 0,
      cells: this.cells = {},
      styles: this.styles = [],
    } = tableDocument);
  },
  beforeDestroy() {
    localStorage.removeItem('dataPrint');
  },
};
</script>

<style lang="scss" scoped>

</style>
