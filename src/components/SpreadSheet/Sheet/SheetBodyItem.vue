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
        :class="{
          'line-start': (source.openGroup === true && source.rowLevel === level - 1),
          'line': (source.parent && level <= source.rowLevel),
          'line-end': (source.rowGroupEnd && source.rowLevel === level),
        }"
        :style="getStyleGroup(level)">
        <sheet-btn-group v-if="isRowGroupLevel(source, level)"
                         :data-row-index="index"
                         :data-row-parent="source.value"
                         :data-row-count="source.rowGroup - 1"
                         :data-row-status="source.openGroup">
          {{ (source.openGroup) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
        </sheet-btn-group>
    </div>
    <div class="column column-title"
        :style="shiftTitle">{{ source.value }}</div>
    <template v-for="(column, columnIndex) in columns">
      <div v-if="!setExcludedCell.includes(`${column.name}${source.value}`)"
          :key="`body-${source.value}-${column.value}`"
          class="column column-body"
          :class="(cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].style : ''"
          :style="getCellGeometry(source, column, columnIndex)"
          :data-name="`${column.name}${source.name}`">
        {{ (cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].value : '' }}
      </div>
    </template>
  </div>
</template>

<script>
import SheetBtnGroup from './SheetBtnGroup.vue';

export default {
  name: 'SheetBodyItem',
  components: {
    SheetBtnGroup,
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
      return (Object.keys(row).includes('rowGroup') && (row.rowLevel + 1) === level);
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
    position: relative;
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
      cursor: default;
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
      cursor: cell;
    }
  }
  .line-start {
    &::before {
      content: '';
      position: absolute;
      top: calc(50% + 5px);
      width: 0px;
      height: 50%;
      border-left: thin solid #3F3F3F;
      background-color: #3F3F3F;
    }
  }
  .line {
    &::before {
      content: '';
      position: absolute;
      top: 0px;
      width: 0px;
      height: 100%;
      border-left: thin solid #3F3F3F;
      background-color: #3F3F3F;
    }
  }
  .line-end {
    &::before {
      content: '';
      position: absolute;
      left: 10px;
      bottom: 0px;
      width: 8px;
      border-left: 1px solid #3F3F3F;
      border-bottom: 1px solid #3F3F3F;
      background-color: unset;
    }
  }
  .selected {
    &::after {
      content: '';
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      border: 1px solid #1a73e8;
      z-index: 200;
    }
  }
}
</style>
