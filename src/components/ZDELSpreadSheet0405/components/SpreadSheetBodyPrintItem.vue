<template>
  <div :key="`body-row-${source.value}`"
       class="sheet-body__row"
       :style="{
         'grid-template-rows': `${source.height || '22'}px`,
         'grid-template-columns': templateColumnWidth,
       }">
    <template v-for="(column, columnIndex) in columns">
      <div v-if="!setExcludedCell.includes(`${column.name}${source.value}`)"
          :key="`body-${source.value}-${column.value}`"
          class="column column-body"
          :class="[
            (cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].style : '',
          ]"
          :style="[getCellGeometry(source, column, columnIndex)]"
          :data-name="`${column.name}${source.name}`"
          :tabindex="columnIndex">
        {{ (cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].value : '' }}
      </div>
    </template>
  </div>
</template>

<script>
// import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetBodyPrintItem',
  components: {
    // SpreadSheetBtnGroup,
  },
  props: {
    index: { type: Number }, // ????
    source: { type: Object, default() { return {}; } },
    columns: Array,
    cells: { type: Object, default() { return {}; } },
    setExcludedCell: { type: Array },
    maxLevelGroupRow: { type: Number, default: 0 },
    templateColumnWidth: { type: String, default: '' },

    printMode: { type: Boolean, default: false },
  },
  data() {
    return {
      shiftTitle: { left: `${20 * this.maxLevelGroupRow}px` },
    };
  },
  computed: {
  },
  methods: {
    getCellGeometry(row, column, columnIndex) {
      const cellGeometry = {};
      const cellName = `${column.name}${row.value}`;
      if (this.cells[cellName]) {
        cellGeometry['grid-column-start'] = this.cells[cellName]['grid-column-start'] + columnIndex;
        cellGeometry['grid-column-end'] = this.cells[cellName]['grid-column-end'] + columnIndex;
        cellGeometry.height = `${this.cells[cellName].height}px`;
        cellGeometry['z-index'] = 1;
      } else {
        cellGeometry['grid-column-start'] = columnIndex + (this.printMode) ? 0 : (this.maxLevelGroupRow + 2);
        cellGeometry['grid-column-end'] = (columnIndex + ((this.printMode) ? 1 : (this.maxLevelGroupRow + 2))) + 1;
      }
      return cellGeometry;
    },
  },
};
</script>

<style lang="scss" scoped>
.sheet-body__row {
  position: relative;
  display: grid;
  grid-auto-rows: minmax(22px, 22px);
  .column {
    position: relative;
    display: inline-flex;
    align-items: center;
    background-color: white;
    &-body {
      padding: 0px 2px;
      width: 100%;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      outline: none;
      cursor: cell;
    }
  }
}
</style>
