<template>
  <div class="spread-sheet-body-static">
    <div ref="SheetBodyFixed"
         class="sheet-body-fixed">
      <div class="sheet-body-fixed__item" v-for="(row, rowIndex) in rows"
           :style="{width: `${templateTableWidth}px`, position: 'relative'}" :key="rowIndex">
        <spread-sheet-body-item :source="row"
                                :columns="columns"
                                :cells="cells"
                                :set-excluded-cell="[].concat(...Object.values(setExcludedCells))"
                                :max-level-group-row="maxLevelGroupRow"
                                :template-column-width="templateColumnWidth"></spread-sheet-body-item>
        <div class="sheet-body-fixed__item_end" :key="`end-${rowIndex}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SpreadSheetBodyItem from './SpreadSheetBodyItem.vue';

export default {
  name: 'SpreadSheetBodyStatic',
  components: {
    SpreadSheetBodyItem,
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
  },
};
</script>

<style lang="scss" scoped>

</style>
