<template>
  <div class="spread-sheet-body-print">
    <div ref="SheetBodyPrint"
         class="sheet-body-print">
      <div class="sheet-body-print__item" v-for="(row, rowIndex) in prepareRows"
           :style="{width: `${templateTableWidth}px`, position: 'relative'}" :key="rowIndex">
        <spread-sheet-body-print-item :source="row"
                                      :columns="prepareColumns"
                                      :cells="cells"
                                      :set-excluded-cell="setExcludedCellsArray"
                                      :set-representations="representations"
                                      :max-level-group-row="0"
                                      :template-column-width="templateColumnWidth"
                                      :print-mode="printMode"></spread-sheet-body-print-item>
        <div class="sheet-body-print__item_end" :key="`end-${rowIndex}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getColumnNumberForName,
} from '@/helpers/spreadSheet';
import SpreadSheetBodyPrintItem from './SpreadSheetBodyPrintItem.vue';

export default {
  name: 'SpreadSheetBodyPrint',
  components: {
    SpreadSheetBodyPrintItem,
  },
  props: {
    rows: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    templateColumnWidth: { type: String, default: '' },
    templateTableWidth: { type: Number, default: 0 },
    maxLevelGroupRow: { type: Number, default: 0 },
    setExcludedCells: { type: Object, default() { return {}; } },
    representations: { type: Map, default() { return new Map(); } },
    printMode: { type: Boolean, default: false },
  },
  data() {
    console.log(this.setExcludedCells);
    return {
      setExcludedCellsArray: [].concat(...Object.values(this.setExcludedCells)),
    };
  },
  computed: {
    prepareRows() {
      const rowsNumber = [];
      Object.keys(this.cells).forEach((item) => {
        rowsNumber.push(+item.replace(/[A-z]/g, ''));
      });
      const rowsCount = Math.max(...rowsNumber);
      return this.rows.slice(0, rowsCount);
    },
    prepareColumns() {
      const columnsNumber = [];
      Object.keys(this.cells).forEach((item) => {
        columnsNumber.push(getColumnNumberForName(item.replace(/[0-9]/g, '')));
      });
      const columnsCount = Math.max(...columnsNumber);
      return this.columns.slice(0, columnsCount);
    },
  },
  mounted() {
    console.log(this.cells);
  },
};
</script>

<style lang="scss" scoped>
@import '../SpreadSheet.scss';
.spread-sheet-body-print {
  font-size: $bodyFontSize;
  font-weight: $bodyFontWeight;
  color: $bodyFontColor;
}
</style>
