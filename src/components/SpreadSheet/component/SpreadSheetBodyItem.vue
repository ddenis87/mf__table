<template>
  <div :key="`body-row-${rowName}`"
       class="sheet-body__row"
       :style="gridRow">
    <template v-if="isShowGroup">
      <div v-for="(level, levelIndex) in maxRowGroupingLevel"
          class="column column-group"
          :key="levelIndex"
          :class="getGroupClass(level)"
          :style="getGroupStyle(level)">
        <spread-sheet-btn-group v-if="isGroup(level)"
                                :data-row-name="rowName">
          <v-icon x-small color="black">
            {{ btnGroup }}
          </v-icon>
        </spread-sheet-btn-group>
      </div>
    </template>

    <div v-if="isShowTitle"
          class="column column-title"
          :style="shiftTitle">
      <div class="content">{{ rowName }}</div>
    </div>

    <template v-for="(column, columnIndex) in columns">
      <div v-if="checkCellExclusion(column.name)"
           :key="`body-${source.value}-${column.value}`"
           class="column column-body"
           :class="getCellClass(column.name)"
           :style="getCellStyle(column.name, columnIndex)"
           :data-name="getCellName(column.name)"
           :data-tooltip="getTooltip(column.name)"
           :tabindex="columnIndex">
        <div v-if="hasImg(column.name)"
             class="content"
             v-html="getImg(column.name)"></div>
        <div v-else
             class="content"
             :class="{'content_tooltip': hasTooltip(column.name)}"
             v-html="formattedData(column.name)"></div>
      </div>
    </template>
  </div>
</template>

<script>
import display from '@/plugins/formattingView/formattingView';

import {
  CELL_HEIGHT,
  CELL_WIDTH_GROUP,
  CELL_WIDTH_LEFT_GROUP,
  CELL_WIDTH_LEFT_TITLE,
} from '../SpreadSheetConst';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetBodyItem',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    cells: { type: Object, default() { return {}; } },
    columns: Array,
    images: { type: Object, default() { return {}; } },
    index: { type: Number }, // ????
    isShowGroup: { type: Boolean, default: true },
    isShowGrid: { type: Boolean, default: true },
    isShowTitle: { type: Boolean, default: true },
    maxRowGroupingLevel: { type: Number, default: 0 },
    rows: Array, // ????
    setExcludedCells: { type: Array },
    setOpenGroupRows: { type: Array, default() { return []; } },
    setRepresentations: { type: Map, default() { return new Map(); } },
    source: { type: Object, default() { return {}; } }, // is one Row
    templateColumnWidth: { type: String, default: '' },
  },
  data() {
    return {
      rowName: this.source.value,
    };
  },
  computed: {
    btnGroup() {
      return (this.setOpenGroupRows.includes(this.rowName))
        ? 'mdi-minus' : 'mdi-plus';
    },

    gridRow() {
      const gridRow = {
        'grid-template-rows': `${this.source.height || CELL_HEIGHT}px`,
        'grid-template-columns': this.templateColumnTitle,
      };
      return gridRow;
    },

    shiftTitle() {
      let shiftLeft = CELL_WIDTH_LEFT_GROUP * this.maxRowGroupingLevel;
      if (this.maxRowGroupingLevel !== 0) shiftLeft += 4;
      const shiftTitle = {
        left: `${shiftLeft}px`,
      };
      if (this.index === 0) shiftTitle['border-top'] = 0;
      if (this.index === this.rows.length - 1) shiftTitle['border-bottom'] = 'thin solid grey';
      return shiftTitle;
    },

    templateColumnTitle() {
      let tempalteColumnTitle = `${this.templateColumnWidth}`;
      if (this.isShowTitle) tempalteColumnTitle = `${CELL_WIDTH_LEFT_TITLE}px ${tempalteColumnTitle}`;
      if (this.maxRowGroupingLevel !== 0) {
        tempalteColumnTitle = `repeat(${this.maxRowGroupingLevel - 1},
                               minmax(${CELL_WIDTH_GROUP}px, ${CELL_WIDTH_GROUP}px))
                               ${CELL_WIDTH_GROUP + 4}px
                               ${tempalteColumnTitle}`;
      }
      return tempalteColumnTitle;
    },
  },
  methods: {
    checkCellExclusion(columnName) {
      const cellName = this.getCellName(columnName);
      if (this.setExcludedCells.includes(cellName)) return false;
      return true;
    },

    formattedData(columnName) {
      const cell = this.hasCell(columnName);
      if (!cell) return '';
      if (!Object.keys(cell).includes('value')) return '';
      return display.formate(cell.value, { ...cell, representations: this.setRepresentations });
    },

    hasCell(columnName) {
      return (this.cells[this.getCellName(columnName)]) || false;
    },

    hasImg(columnName) {
      return (this.hasCell(columnName)?.image) || false;
    },

    hasTooltip(columnName) {
      return (this.hasCell(columnName)?.title) || false;
    },

    isGroup(level) {
      return (Object.keys(this.source).includes('isGroup')
        && (this.source.level + 1) === level);
    },

    isGroupEnd(level) {
      const indexRow = this.index;
      if ((this.rows[indexRow + 1]?.level !== this.source.level)
        && this.rows[indexRow + 1]?.level <= level - 1) return true;
      return false;
    },

    getCellClass(columnName) {
      const cellClass = [];
      if (this.hasCell(columnName)) cellClass.push(this.hasCell(columnName).style || '');
      if (!this.isShowGrid) cellClass.push('column-body_grid-off');
      return cellClass;
    },

    getCellFixed(columnIndex) {
      const cellFixed = {};
      if (this.columns[columnIndex].fixed) {
        cellFixed.position = 'sticky';
        cellFixed['z-index'] = 100;
        cellFixed.left = CELL_WIDTH_LEFT_GROUP * this.maxRowGroupingLevel;
        if (this.isShowTitle) cellFixed.left += CELL_WIDTH_LEFT_TITLE;
        for (let i = 0; i < columnIndex; i += 1) {
          cellFixed.left += this.columns[i].width;
        }
        cellFixed.left += 'px';
        if (!this.columns[columnIndex + 1].fixed
          && !this.isShowGrid) cellFixed['box-shadow'] = '2px 0px 0px rgba(0, 0, 0, .2)';
      }
      return cellFixed;
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
        cellGeometry['grid-column-start'] = columnIndex + (this.maxRowGroupingLevel + 2);
        cellGeometry['grid-column-end'] = (columnIndex + (this.maxRowGroupingLevel + 2)) + 1;
      }
      if (!this.isShowTitle) {
        cellGeometry['grid-column-start'] -= 1;
        cellGeometry['grid-column-end'] -= 1;
      }
      return cellGeometry;
    },

    getCellName(columnName) {
      return `${columnName}${this.source.value}`;
    },

    getCellStyle(columnName, columnIndex) {
      const cellStyle = [];
      cellStyle.push(this.getCellGeometry(columnName, columnIndex));
      cellStyle.push(this.getCellFixed(columnIndex));
      return cellStyle;
    },

    getGroupClass(level) {
      const { level: rowLevel } = this.source;
      const groupClass = [];
      if (this.setOpenGroupRows.includes(this.rowName) && rowLevel === level - 1) {
        groupClass.push('line-start');
      }
      if (level <= rowLevel) groupClass.push('line');
      if (this.isGroupEnd(level) && level <= rowLevel) groupClass.push('line-end');
      return groupClass;
    },

    getGroupStyle(level) {
      const groupStyle = {
        left: `${(CELL_WIDTH_LEFT_GROUP * (+level - 1))}px`,
      };
      // if (!this.isShowTitle
      //   && this.maxRowGroupingLevel === level) groupStyle['border-right'] = 'thin solid grey';
      if (this.index === this.rows.length - 1) groupStyle['border-bottom'] = 'thin solid grey';
      if (this.maxRowGroupingLevel === level) {
        groupStyle['border-right'] = 'thin solid grey';
        groupStyle.width = '24.5px';
      }
      return groupStyle;
    },

    getImg(columnName) {
      return this.images[this.hasCell(columnName)?.image];
    },

    getTooltip(columnName) {
      return this.hasCell(columnName)?.title || '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../SpreadSheet.scss';

.sheet-body__row {
  position: relative;
  display: grid;
  grid-row: $bodyGridAutoRow;
  // grid-auto-rows: $bodyGridAutoRow;
  .column {
    position: relative;
    display: inline-flex;
    align-items: flex-end;
    &-stop {
      position: sticky;
      top: 0px;
    }
    &-group, &-title {
      position: sticky;
      justify-content: center;
      font-size: 0.75em;
      font-weight: bold;
      color: $bodyFontColorTitle;
      cursor: default;
    }

    &-group {
      // padding-top: 2px;
      // padding-left: 0px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: $backgroundColorTitle;
      // border: thin solid black;
      z-index: 500;
      // &:first-child {
      //   // box-shadow: inset 1px 0px 0px grey;
      //   // border-left: thin solid  grey;
      // }
      &::after {
        position: absolute;
        content: '';
        left: 0px;
        bottom: -1px;
        // top: 0px;
        right: 0px;
        background-color: unset;
        // border-bottom: thin solid grey;
        user-select: none;
        // box-shadow:  inset 0px -1px 0px grey;
      }
    }

    &-title {
      // padding-top: 1px;
      align-items: center;
      width: 60px;
      z-index: 400;
      border-top: thin solid grey;
      background-color: $backgroundColorTitle;
      &::after {
        content: '';
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: -1px;
        // border-left: thin solid grey;
        border-right: thin solid grey;
        // border-bottom: thin solid grey;
        z-index: 401;
      }
      // .content {
      //   display: flex;
      //   justify-content: center;
      //   align-items: center;
      //   height: 100%;
      //   width: 100%;
      //   box-sizing: border-box;
      //   background-color: $backgroundColorTitle;
      //   overflow: hidden;
      //   user-select: none;
      //   z-index: 401;
      // }
    }
    &-body {
      width: 100%;
      box-sizing: border-box;
      line-height: $bodyLineHeight;
      white-space: nowrap;
      outline: none;
      cursor: cell;
      background-color: $backgroundColorBody;
      .content {
        display: flex;
        justify-content: inherit;
        align-items: inherit;
        height: 100%;
        width: 100%;
        padding: 0px 3px;
        overflow: hidden;
        user-select: none;
        &_tooltip {
          content: '';
          position: absolute;
          top: 0px;
          right: 0px;
          width: 10px;
          height: 10px;
          background: linear-gradient(45deg, rgba(0,0,0,0) 65%,#f5a338 50%);
          z-index: 81;
        }
        // &-tooltip_invalid {
        //   background-color: grey;
        // }
      }
      &::after {
        content: '';
        position: absolute;
        left: 0px;
        top: 0px;
        right: -1px;
        bottom: -1px;
        border-right: $bodyGridColor;
        border-bottom: $bodyGridColor;
        z-index: 80;
      }
      &_grid-off {
        &::after {
          content: '';
          position: absolute;
          left: 0px;
          top: 0px;
          right: 0px;
          bottom: -1px;
          border-right: $bodyGridColorOff;
          border-bottom: $bodyGridColorOff;
          z-index: 80;
        }
      }
    }
  }
  .line-start {
    &::before {
      content: '';
      position: absolute;
      // left: 10px;
      width: 9px;
      top: calc(50% + 8px);
      height: 100%;
      border-left: 1px solid grey;
    }
  }
  .line {
    &::before {
      content: '';
      position: absolute;
      // top: 0px;

      width: 9px;
      height: 100%;
      border-left: 1px solid grey;
    }
  }
  .line-end {
    &::before {
      content: '';
      position: absolute;
      // left: 10px;
      bottom: -1px;
      top: 0px;
      width: 9px;
      height: 100%;
      // border-left: 1px solid #3F3F3F;
      border-bottom: 1px solid grey;
      background-color: unset;
      z-index: 9999;
    }
  }
  .selected {
    &::before {
      content: '';
      position: absolute;
      top: 0px;
      bottom: -1px;
      left: 0px;
      right: -1px;
      border: 1px solid #1a73e8;
      z-index: 199;
    }
  }
}
</style>
