<template>
  <div :key="`body-row-${source.value}`"
       class="sheet-body__row"
       :style="[{
         'grid-template-columns': `
         repeat(${maxLevelGroupRow}, minmax(20px, 20px))
         60px
         ${templateRow}`,
         'grid-template-rows': `${(source.height) ? source.height : '22'}px`,
       }]">
    <div v-for="level in maxLevelGroupRow"
        :key="`${source.value}-${level}`"
        class="column column-group"
        :class="{'column-stop': (source.value === 1)}"
        :style="getStyleGroup(level)">
        <spread-sheet-btn-group v-if="isRowGroupLevel(source, level)"
                                :data-row-index="index"
                                :data-row-parent="source.value"
                                :data-row-count="source.rowGroup - 1"
                                :data-row-status="source.openGroup">
          {{ (source.openGroup) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
        </spread-sheet-btn-group>
    </div>
    <div class="column column-title"
        :style="shiftTitle">{{ source.value }}</div>
    <template v-for="(column, columnIndex) in columns">
      <div v-if="!setExcludedCell.includes(`${column.name}${source.value}`)"
          :key="`body-${source.value}-${column.value}`"
          class="column column-body"
          :class="(cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].style : ''"
          :style="getCellGeometry(source, column, columnIndex)">
        {{ (cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].value : '' }}
      </div>
    </template>
  </div>
</template>

<script>
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetBodyItem',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    index: { type: Number }, // ????
    source: { type: Object, default() { return {}; } },
    columns: Array,
    cells: { type: Object, default() { return {}; } },
    setExcludedCell: { type: Array },
    maxLevelGroupRow: { type: Number, default: 0 },
    templateRow: { type: String, default: '' },
  },
  data() {
    return {
      shiftTitle: { left: `${20 * this.maxLevelGroupRow}px` },
    };
  },

  methods: {
    getStyleGroup(level) {
      return {
        left: `${20 * (+level - 1)}px`,
      };
    },
    isRowGroupLevel(row, level) {
      return (Object.keys(row).includes('rowLevel') && (row.rowLevel + 1) === level);
    },
    getCellGeometry(row, column, columnIndex) {
      const cellGeometry = {};
      const cellName = `${column.name}${row.value}`;
      if (this.cells[cellName]) {
        cellGeometry['grid-column-start'] = this.cells[cellName]['grid-column-start'] + columnIndex;
        cellGeometry['grid-column-end'] = this.cells[cellName]['grid-column-end'] + columnIndex;
        cellGeometry.height = `${this.cells[cellName].height}px`;
        cellGeometry['z-index'] = 1;
      } else {
        cellGeometry['grid-column-start'] = columnIndex + this.maxLevelGroupRow + 2;
        cellGeometry['grid-column-end'] = (columnIndex + this.maxLevelGroupRow + 2) + 1;
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
    display: inline-flex;
    align-items: center;
    background-color: white;
    &-stop {
      position: sticky;
      top: 0px;
    }
    &-group, &-title {
      position: sticky;
      background-color: #dadce0;
      justify-content: center;

      font-size: 0.75em;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.6);
    }

    &-group {
      left: 0px;
      width: 20px;
      z-index: 500;
      &:first-child {
        box-shadow:  inset 1px 0px 0px grey;
      }
    }

    &-title {
      border: thin solid grey;
      border-top: 0px;
      width: 60px;
      z-index: 400;
    }
    &-body {
      position: relative;
      padding: 0px 2px;
      width: 100%;
      border-right: thin solid grey;
      border-bottom: thin solid grey;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
