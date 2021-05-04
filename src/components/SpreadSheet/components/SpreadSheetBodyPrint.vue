<template>
  <div class="spread-sheet-body-print">
    <div ref="SheetBodyPrint"
         class="sheet-body-print">
      <div class="sheet-body-print__item" v-for="(row, rowIndex) in rows"
           :style="{width: `${templateTableWidth}px`, position: 'relative'}" :key="rowIndex">
        <spread-sheet-body-print-item :source="row"
                                      :columns="columns"
                                      :cells="cells"
                                      :set-excluded-cell="setExcludedCellsArray"
                                      :max-level-group-row="0"
                                      :template-column-width="templateColumnWidth"
                                      :print-mode="printMode"></spread-sheet-body-print-item>
        <div class="sheet-body-print__item_end" :key="`end-${rowIndex}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SpreadSheetBodyPrintItem from './SpreadSheetBodyPrintItem.vue';

export default {
  name: 'SpreadSheetBodyPrint',
  components: {
    SpreadSheetBodyPrintItem,
  },
  props: {
    rows: { type: Array },
    // rowsFixed: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    templateColumnWidth: { type: String, default: '' },
    templateTableWidth: { type: Number, default: 0 },
    maxLevelGroupRow: { type: Number, default: 0 },
    setExcludedCells: { type: Object, default() { return {}; } },

    printMode: { type: Boolean, default: false },
  },
  computed: {
    setExcludedCellsArray() { return [].concat(...Object.values(this.setExcludedCells)); },
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
