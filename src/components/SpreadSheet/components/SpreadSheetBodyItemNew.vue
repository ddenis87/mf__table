<template>
  <div class="sheet-body__row"
       :style="gridRow">
    <template v-if="isTitle">
      <div v-for="(level, levelIndex) in maxLevelGroupRow"
           class="column column-group"
           :class="getGroupClass(level)"
           :key="levelIndex"
           :style="getGroupStyle(level)">
        <spread-sheet-btn-group v-if="hasGroup(level)"
                                :data-row-name="rowName">
          {{ btnGroupStatusImg }}
        </spread-sheet-btn-group>
      </div>
      <div class="column column-title"
           :style="shiftTitle">
        <span class="content">{{ rowName }}</span>
      </div>
    </template>

    <template v-for="(column, columnIndex) in columns">
      <div v-if="hasExcludedCell(column.name)"
           class="column column-body"
           :key="`body-${getCellName(column.name)}`"
           :class="getCellClass(column.name)"
           :style="[
            getCellGeometry(column.name, columnIndex),
            fixedCell(column, columnIndex),
           ]">
        <div v-if="hasImg(column.name)" class="content" v-html="getImg(column.name)"></div>
        <div v-else
              class="content"
              v-html="formattedData(column.name)"></div>
      </div>
    </template>
  </div>
</template>

<script>
import display from '@/plugins/formattingView/formattingView';
import {
  CELL_HEIGHT,
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
    rows: Array,
    columns: Array,
    cells: { type: Object, default() { return {}; } },
    representations: { type: Map, default() { return new Map(); } },
    images: { type: Object, default() { return {}; } },
    setExcludedCell: { type: Array },
    maxLevelGroupRow: { type: Number, default: 0 },
    templateColumnWidth: { type: String, default: '' },
    setOpenGroupRows: { type: Array, default() { return []; } },
    printMode: { type: Boolean, default: false },
    isGrid: { type: Boolean, default: true },
    isTitle: { type: Boolean, default: true },
  },
  data() {
    return {
      shiftTitle: {
        left: `${20 * this.maxLevelGroupRow}px`,
        'border-top': `thin solid ${(this.index === 0) ? 'rgba(0,0,0,0)' : 'unset'}`,
      },
      rowName: this.source.value,
    };
  },
  computed: {
    btnGroupStatusImg() {
      return (this.setOpenGroupRows.includes(this.rowName))
        ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline';
    },
    templateColumnTitle() {
      let tempalteColumnTitle = `60px ${this.templateColumnWidth}`;
      if (this.maxLevelGroupRow !== 0) {
        tempalteColumnTitle = `repeat(${this.maxLevelGroupRow}, minmax(20px, 20px))
                               60px
                               ${this.templateColumnWidth}`;
      }
      return tempalteColumnTitle;
    },
    gridRow() {
      const gridRow = {
        'grid-template-rows': `${this.source.height || CELL_HEIGHT}px`,
        'grid-template-columns': this.templateColumnTitle,
      };
      return gridRow;
    },
  },
  mounted() {
  },
  methods: {
    formattedData(columnName) {
      const cell = this.hasCell(columnName);
      if (!cell) return '';
      if (!Object.keys(cell).includes('value')) return '';
      return display.formate(cell.value, { ...cell, representations: this.representations });
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
        if (!this.columns[columnIndex + 1].fixed && !this.isGrid) fixed['box-shadow'] = '2px 0px 0px rgba(0, 0, 0, .2)';
        if (columnIndex === 0) fixed['padding-left'] = '0px';
      }
      return fixed;
    },
    getCellClass(columnName) {
      if (!this.hasCell(columnName)) return null;
      if (!Object.keys(this.hasCell(columnName)).includes('style')) return null;
      return this.hasCell(columnName).style;
    },
    getCellGeometry(columnName, columnIndex) {
      const cellGeometry = {};
      if (this.hasCell(columnName)) {
        const {
          'grid-column-start': columnStart,
          'grid-column-end': columnEnd,
          height,
        } = this.hasCell(columnName);
        cellGeometry['grid-column-start'] = +columnStart + columnIndex;
        cellGeometry['grid-column-end'] = +columnEnd + columnIndex;
        cellGeometry.height = `${height}px`;
      } else {
        cellGeometry['grid-column-start'] = columnIndex + (this.maxLevelGroupRow + 2);
        cellGeometry['grid-column-end'] = (columnIndex + (this.maxLevelGroupRow + 2)) + 1;
      }
      return cellGeometry;
    },
    getCellName(columnName) {
      return `${columnName}${this.rowName}`;
    },
    getEndGroup(currentLevel) {
      const indexRow = this.index;
      if (this.rows[indexRow].parent
        && !this.rows[indexRow].rowLevel <= currentLevel
        && (!this.rows[indexRow + 1]?.parent
          || this.rows[indexRow + 1]?.parent !== this.rows[indexRow].parent)
        && this.rows[indexRow + 1].rowLevel <= currentLevel - 1) return true;
      return false;
    },
    getGroupClass(level) {
      const { rowLevel, parent: rowParent } = this.source;
      const groupClass = [];
      if (this.setOpenGroupRows.includes(this.rowName) && rowLevel === level - 1) {
        groupClass.push('line-start');
      }
      if (rowParent && level <= rowLevel) groupClass.push('line');
      if (this.getEndGroup(level) && level <= rowLevel) groupClass.push('line-end');
      return groupClass;
    },
    getGroupStyle(level) {
      return {
        left: `${20 * (+level - 1)}px`,
      };
    },
    getImg(columnName) {
      const cellName = this.getCellName(columnName);
      return this.images[this.cells[cellName].image];
    },
    hasCell(columnName) {
      const cellName = this.getCellName(columnName);
      return this.cells[cellName] || false;
    },
    hasExcludedCell(columnName) {
      const cellName = this.getCellName(columnName);
      if (this.setExcludedCell.includes(cellName)) return false;
      return true;
    },
    hasGroup(level) {
      return (Object.keys(this.source).includes('rowGroup')
        && (this.source.rowLevel + 1) === level);
    },
    hasImg(columnName) {
      const cellName = this.getCellName(columnName);
      if (!this.cells[cellName]) return false;
      if (!Object.keys(this.cells[cellName]).includes('image')) return false;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../SpreadSheet.scss';

.sheet-body__row {
  position: relative;
  display: grid;
  grid-row: $bodyGridRow;
  .column {
    position: relative;
    display: inline-flex;
    &-title, &-group {
      position: sticky;
      justify-content: center;
      align-items: center;
      background-color: $backgroundColorTitle;
      z-index: 500;
    }
    &-title {
      font-size: 0.75em;
      font-weight: bold;
      color: $bodyFontColorTitle;
      border-top: thin solid grey;
      cursor: default;
      &::after {
        position: absolute;
        content: '';
        left: 0px;
        top: -1px;
        right: -0px;
        bottom: -1px;
        border-left: thin solid grey;
        border-right: thin solid grey;
        border-bottom: thin solid grey;
      }
    }

    &-body {
      padding: 0px 0px;
      padding-left: 1px;
      padding-top: 1px;
      line-height: $bodyLineHeight;
      white-space: nowrap;
      outline: none;
      // background-color: white;
      &::after { // grid vertical horizontal
        position: absolute;
        content: '';
        left: 0px;
        top: 0px;
        bottom: -1px;
        right: -1px;
        border-right: $bodyGridColor;
        border-bottom: $bodyGridColor;
      }
    }

    .content {
      display: flex;
      justify-content: inherit;
      align-items: inherit;
      height: 100%;
      width: 100%;
      background-color: white;
      overflow: hidden;
      user-select: none;
    }
  }

  .line-start {
    &::before {
      content: '';
      position: absolute;
      top: calc(50% + 6px);
      height: 50%;
      border-left: 1px solid #3F3F3F;
    }
  }
  .line {
    &::before {
      content: '';
      position: absolute;
      top: 0px;
      width: 1px;
      height: 100%;
      border-left: 1px solid #3F3F3F;
    }
  }
  .line-end {
    &::before {
      content: '';
      position: absolute;
      left: 9.5px;
      bottom: -1px;
      top: 0px;
      width: 8px;
      height: 100%;
      border-left: 1px solid #3F3F3F;
      border-bottom: 1px solid #3F3F3F;
      background-color: unset;
      z-index: 9999;
    }
  }
}
</style>
