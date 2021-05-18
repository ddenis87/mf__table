<template>
  <div :key="`body-row-${source.value}`"
       class="sheet-body__row"
       :style="templateRow(source.height)">
    <template v-if="!printMode">
      <div v-for="level in maxLevelGroupRow"
          :key="`${source.value}-${level}`"
          class="column column-group"
          :class="{
            'line-start': (source.openGroup === true && source.rowLevel === level - 1),
            'line': (source.parent && level <= source.rowLevel),
            'line-end': (source.rowGroupEnd && source.rowLevel === level),
          }"
          :style="getStyleGroup(level)">
          <spread-sheet-btn-group v-if="isRowGroupLevel(source, level)"
                          :data-row-index="index"
                          :data-row-parent="source.value"
                          :data-row-count="source.rowGroup - 1"
                          :data-row-status="source.openGroup">
            {{ (setOpenGroupRows.includes(source.value)) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
          </spread-sheet-btn-group>
      </div>
      <div class="column column-title"
          :style="shiftTitle">{{ source.value }}</div>
    </template>
    <template v-for="(column, columnIndex) in columns">
      <div v-if="!setExcludedCell.includes(`${column.name}${source.value}`)"
          :key="`body-${source.value}-${column.value}`"
          class="column column-body"
          :class="[
            (cells[`${column.name}${source.value}`])
              ? cells[`${column.name}${source.value}`].style : '',
            (isGridOff) ? 'column-body_grid-off' : '',
          ]"
          :style="[getCellGeometry(source, column, columnIndex), fixedCell(column, columnIndex)]"
          :data-name="`${column.name}${source.name}`"
          :tabindex="columnIndex"
          v-html="formattedData(column.name, source)">
      </div>
    </template>
  </div>
</template>

<script>
import formattedData from '@/plugins/formattedDataDisplay/formattedDataDisplay';
import {
  CELL_TYPE_DEFAULT,
} from '../SpreadSheetConst';

import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetBodyItem',
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
    templateColumnWidth: { type: String, default: '' },
    setOpenGroupRows: { type: Array, default() { return []; } },
    printMode: { type: Boolean, default: false },
    isGridOff: { type: Boolean, default: false },
  },
  data() {
    return {
      shiftTitle: { left: `${20 * this.maxLevelGroupRow}px` },
    };
  },
  computed: {
  },
  methods: {
    formattedData(columnName) {
      if (!this.cells[`${columnName}${this.source.value}`]) return '';
      const formattedOption = {};
      const cell = this.cells[`${columnName}${this.source.value}`];
      const cellValue = cell.value;
      const cellType = this.getCellType(cell, columnName);
      formattedOption.valueType = cellType;
      const cellFormatString = this.getCellFormatString(cell, columnName);
      if (cellFormatString) formattedOption.formatString = cellFormatString;
      return formattedData(cellValue, formattedOption);
    },
    getCellType(cell, columnName) {
      const cellType = cell.type
        || this.source.type
        || this.columns.find((column) => column.name === columnName).type
        || CELL_TYPE_DEFAULT;
      return cellType;
    },
    getCellFormatString(cell, columnName) {
      const cellFormatString = cell.formatString
        || this.source.formatString
        || this.columns.find((column) => column.name === columnName).formatString
        || null;
      return cellFormatString;
    },
    templateRow(height) {
      const templateRow = {
        'grid-template-rows': `${height || '22'}px`,
      };
      if (this.printMode) {
        templateRow['grid-template-columns'] = this.templateColumnWidth;
      } else if (this.maxLevelGroupRow === 0) {
        templateRow['grid-template-columns'] = `60px ${this.templateColumnWidth}`;
      } else {
        templateRow['grid-template-columns'] = `repeat(${this.maxLevelGroupRow}, minmax(20px, 20px)) 60px ${this.templateColumnWidth}`;
      }
      return templateRow;
    },
    fixedCell(column, columnIndex) {
      const fixed = {};
      if (column.fixed) {
        fixed.position = 'sticky';
        fixed['z-index'] = 100;
        fixed.left = (20 * this.maxLevelGroupRow) + 60;
        for (let i = 0; i < columnIndex; i += 1) {
          fixed.left += this.columns[i].width;
        }
        fixed.left += 'px';
        // if (!this.columns[columnIndex + 1].fixed) fixed['border-right'] = '3px solid rgba(0, 0, 0, .3)';
        if (!this.columns[columnIndex + 1].fixed && this.isGridOff) fixed['box-shadow'] = '2px 0px 0px rgba(0, 0, 0, .2)';
      }
      return fixed;
    },
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
    align-items: flex-end;
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
      padding: 0px 2px;
      width: 100%;
      border-right: thin solid grey;
      border-bottom: thin solid grey;
      box-sizing: border-box;
      line-height: 1.25;
      // letter-spacing: 0.4px;
      white-space: nowrap;
      overflow: hidden;
      outline: none;
      cursor: cell;
      &_grid-off {
        border-right: thin solid rgba(255,255,255, 0);
        border-bottom: thin solid rgba(255,255,255, 0);;
      }
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
      left: 9.5px;
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
      z-index: 90;
    }
  }
}
</style>
