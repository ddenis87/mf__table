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
          :data-name="`${column.name}${source.value}`"
          :tabindex="columnIndex">
        <div class="content" v-html="formattedData(column.name, source)"></div>
      </div>
    </template>
  </div>
</template>

<script>
// import display from '@/plugins/formattingView/formattingView';
import {
  CELL_TYPE_DEFAULT,
} from '../SpreadSheetConst';

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
    setRepresentations: { type: Map, default() { return new Map(); } },
    printMode: { type: Boolean, default: true },
  },
  // data() {
  //   return {
  //     shiftTitle: { left: `${20 * this.maxLevelGroupRow}px` },
  //   };
  // },
  computed: {
  },
  methods: {
    formattedData(columnName) {
      const cell = this.hasCell(columnName);
      if (!cell) return '';
      // if (!Object.keys(cell).includes('value')) return '';
      console.log(this.setRepresentations);
      // const formattingParameters = {
      //   ...cell,
      //   representations: this.setRepresentations,
      // };
      return cell.value;
      // return display.formate(cell.value || null, formattingParameters);
    },
    hasCell(column) {
      const cellName = `${column}${this.source.value}`;
      // console.log(column, this.source.value);
      return (this.cells[cellName]) || false;
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
    getCellGeometry(row, column, columnIndex) {
      const cellGeometry = {};
      const cellName = `${column.name}${row.value}`;
      if (this.cells[cellName]) {
        const {
          'grid-column-start': columnStart,
          'grid-column-end': columnEnd,
          height,
        } = this.hasCell(column.name);
        cellGeometry['grid-column-start'] = +columnStart + columnIndex;
        cellGeometry['grid-column-end'] = +columnEnd + columnIndex;
        cellGeometry.height = `${height}px`;
        // cellGeometry['z-index'] = 1;
      } else {
        cellGeometry['grid-column-start'] = columnIndex + 1;
        cellGeometry['grid-column-end'] = (columnIndex + 1) + 1;
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
  // grid-auto-rows: $bodyGridAutoRow;
  grid-row: $bodyGridAutoRow;
  box-sizing: border-box;
  .column {
    position: relative;
    display: inline-flex;
    align-items: flex-end;
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
        background-color: $backgroundColorBody;
        .active-element {
          display: none;
        }
      }
      .active-element {
        display: none;
      }
      &::after {
        content: '';
        position: absolute;
        left: 0px;
        top: 0px;
        right: -1px;
        bottom: -1px;
        // border-right: $bodyGridColor;
        // border-bottom: $bodyGridColor;
        z-index: 80;
        // content: '';
        // position: absolute;
        // left: 0px;
        // top: 0px;
        // right: -1px;
        // bottom: -1px;
        // // border-right: $bodyGridColor;
        // // border-bottom: $bodyGridColor;
        // z-index: 80;
      }
    }
  }
}
</style>
