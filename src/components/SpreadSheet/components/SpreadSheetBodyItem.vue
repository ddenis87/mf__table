<template>
  <div :key="`body-row-${source.value}`"
       class="sheet-body__row"
       :style="templateRow(source.height)">
    <template v-if="!printMode">
      <div v-show="isTitle"
           v-for="level in maxLevelGroupRow"
           :key="`${source.value}-${level}`"
           class="column column-group"
           :class="{
             'line-start': (setOpenGroupRows.includes(source.value) && source.rowLevel === level - 1),
             'line': (source.parent && level <= source.rowLevel),
             'line-end': (getEndGroup(index, level) && level <= source.rowLevel),
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
      <div v-show="isTitle"
           class="column column-title"
           :style="shiftTitle"><div class="content">{{ source.value }}</div></div>
    </template>
    <template v-for="(column, columnIndex) in columns">

      <div v-if="!setExcludedCell.includes(`${column.name}${source.value}`)"
          :key="`body-${source.value}-${column.value}`"
          class="column column-body"
          :class="[
            (hasCell(column.name, source.value))
              ? getCellStyle(column.name, source.value) : '',
            (!isGrid) ? 'column-body_grid-off' : '',
          ]"
          :style="[
            getCellGeometry(source, column, columnIndex),
            fixedCell(column, columnIndex)
          ]"
          :data-name="`${column.name}${source.name}`"
          :tabindex="columnIndex">
            <div v-if="hasImg(column.name)" class="content" v-html="getImg(column.name)"></div>
            <div v-else
                 class="content"
                 v-html="formattedData(column.name)"></div>
      </div>
    </template>
  </div>
</template>

<script>
// import formattedData from '@/plugins/formattedDataDisplay/formattedDataDisplay';
import display from '@/plugins/formattingView/formattingView';
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
      shiftTitle: { left: `${20 * this.maxLevelGroupRow}px` },
    };
  },
  computed: {
  },
  methods: {
    hasImg(columnName) {
      const cellName = `${columnName}${this.source.value}`;
      if (!this.cells[cellName]) return false;
      if (!Object.keys(this.cells[cellName]).includes('image')) return false;
      return true;
    },
    getImg(columnName) {
      const cellName = `${columnName}${this.source.value}`;
      // console.log(this.images);
      return this.images[this.cells[cellName].image];
    },
    formattedData(columnName) {
      const cell = this.hasCell(columnName);
      if (!cell) return '';
      if (!Object.keys(cell).includes('value')) return '';
      // console.log(this.representations);
      // if (!cell.value) return '';
      // const options = {
      //   type: cell.type,
      //   formatString: cell.formatString,
      //   representations: this.representations,
      // };
      // console.log(options);
      return display.formate(cell.value, { ...cell, representations: this.representations });
    },
    // formattedData(columnName) {
    //   // const cellName = `${columnName}${this.source.value}`;
    //   const cell = this.hasCell(columnName);
    //   if (!cell) return '';
    //   const formattedOption = {
    //     representations: this.representations,
    //   };
    //   // const cell = this.cells[`${columnName}${this.source.value}`];
    //   const cellValue = cell.value;
    //   const cellType = this.getCellType(cell, columnName);
    //   // if (cellType.includes('field')) return cell.representation;
    //   formattedOption.valueType = cellType;
    //   const cellFormatString = this.getCellFormatString(cell, columnName);
    //   if (cellFormatString) formattedOption.formatString = cellFormatString;
    //   return formattedData(cellValue, formattedOption);
    // },
    hasCell(column) {
      const cellName = `${column}${this.source.value}`;
      return (this.cells[cellName]) || false;
    },
    // hasCellInvalid(column) {
    //   const cellName = `${column}${this.source.value}`;
    //   if (!this.hasCell(column, this.source.value)) return false;
    //   if (!Object.keys(this.cells[cellName]).includes('invalid')) return false;
    //   console.log(cellName);
    //   return true;
    // },
    // getCellInvalidMessage(column) {
    //   const cellName = `${column}${this.source.value}`;
    //   return this.cells[cellName]?.invalid || 'Unknown error';
    // },

    getCellStyle(column) {
      const cellName = `${column}${this.source.value}`;
      return this.cells[cellName].style || '';
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
      // console.log(this.templateColumnWidth);
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
        if (!this.columns[columnIndex + 1].fixed && !this.isGrid) fixed['box-shadow'] = '2px 0px 0px rgba(0, 0, 0, .2)';
      }
      return fixed;
    },
    getEndGroup(indexRow, currentLevel) {
      if (this.rows[indexRow].parent
        && !this.rows[indexRow].rowLevel <= currentLevel
        && (!this.rows[indexRow + 1]?.parent
          || this.rows[indexRow + 1]?.parent !== this.rows[indexRow].parent)
        && this.rows[indexRow + 1].rowLevel <= currentLevel - 1) return true;
      return false;
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
@import '../SpreadSheet.scss';

.sheet-body__row {
  position: relative;
  display: grid;
  grid-auto-rows: $bodyGridAutoRow;
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
      padding-top: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      left: 0px;
      width: 20px;
      background-color: $backgroundColorTitle;
      z-index: 500;
      &:first-child {
        box-shadow:  inset 1px 0px 0px grey;
      }
    }

    &-title {
      padding-top: 1px;
      width: 60px;
      z-index: 400;
      &::after {
        content: '';
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: -1px;
        border-left: thin solid grey;
        border-right: thin solid grey;
        border-bottom: thin solid grey;
        z-index: 401;
      }
      .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        background-color: $backgroundColorTitle;
        overflow: hidden;
        user-select: none;
      }
    }
    &-body {
      width: 100%;
      box-sizing: border-box;
      line-height: $bodyLineHeight;
      white-space: nowrap;
      outline: none;
      cursor: cell;
      background-color: $backgroundColorbody;
      .content {
        display: flex;
        justify-content: inherit;
        align-items: inherit;
        height: 100%;
        width: 100%;
        padding: 0px 3px;
        overflow: hidden;
        user-select: none;
        &_invalid {
          content: '';
          position: absolute;
          top: 0px;
          right: 0px;
          width: 18px;
          height: 18px;
          // background-color: #E53935;
          background: linear-gradient(45deg, rgba(0,0,0,0) 70%,#E53935 50% );
          // cursor: default;
          z-index: 81;
        }
        &-tooltip_invalid {
          background-color: grey;
        }
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
