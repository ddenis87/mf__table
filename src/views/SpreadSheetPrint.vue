<template>
  <div class="page-print">
    <spread-sheet :columns="columns"
                  :rows="rows"
                  :cells="cells"
                  :styles="styles"
                  :representations="representations"
                  :is-show-grid="false"
                  :is-show-title="false"
                  :is-print-mode="true"
                  :table-layout-display="'contents'"></spread-sheet>
  </div>
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
      representations: new Map(),
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
    console.log(tableDocument);
    ({
      rows: this.rows = {},
      rowColumn: this.rowColumn = 0,
      columns: this.columns = {},
      columnCount: this.columnCount = 0,
      cells: this.cells = {},
      styles: this.styles = [],
      // representations: this.representations = new Map(),
    } = tableDocument);
    this.representations = new Map(Object.entries(tableDocument.representations));
  },
  beforeDestroy() {
    localStorage.removeItem('dataPrint');
  },
};
</script>

<style lang="scss" scoped>
.page-print {
  display: contents;
  margin: 3px;
  padding: 3px;
  border: thin solid blue;
  min-width: 100px;
}
</style>

<style lang="scss">
html {
  overflow: auto !important;
}
html, body {
  &::-webkit-scrollbar {
    display: block;
  }
}
.v-application--wrap {
  max-width: unset !important;
}
</style>
