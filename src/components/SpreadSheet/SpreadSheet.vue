<template>
  <table-layout :padding="tableLayoutPadding"
                :display="tableLayoutDisplay"
                :border-off="isPrintMode || isOuterBorderOff">
    <div :class="{
            'spread-sheet': !isPrintMode,
            'spread-sheet-print': isPrintMode,
          }"
         :style="spreadSheetStyle">
      <spread-sheet-angle v-if="!isPrintMode" :max-column-grouping-level="maxColumnGroupingLevel"
                          :max-row-grouping-level="maxRowGroupingLevel"
                          :is-show-group="isShowGroup"
                          :is-show-title="isShowTitle"
                          @open-group:column="evtOpenGroupColumn"
                          @open-group:row="evtOpenGroupRow"></spread-sheet-angle>
      <spread-sheet-head v-if="!isPrintMode" ref="SheetHead"
                         :columns="tableColumns"
                         :template-column-width="templateColumnWidth"
                         :table-width="tableWidth"
                         :max-column-grouping-level="maxColumnGroupingLevel"
                         :set-open-group-columns="setOpenGroupColumns"
                         :is-show-title="isShowTitle"
                         @toggle-group:column="toggleColumnGroup"></spread-sheet-head>

      <spread-sheet-body-print v-if="isPrintMode"
                              :rows="tableRows"
                              :columns="tableColumns"
                              :cells="tableCells"
                              :templateTableWidth="templateTableWidth"
                              :templateColumnWidth="templateColumnWidth"
                              :maxLevelGroupRow="maxRowGroupingLevel"
                              :setExcludedCells="setExcludedCells"
                              :representations="representations"
                              :print-mode="isPrintMode"></spread-sheet-body-print>
      <spread-sheet-body v-if="!isPrintMode"
                         ref="SpreadSheetBody"
                         :rows="tableRows"
                         :rows-fixed="tableRowsFixed"
                         :columns="tableColumns"
                         :cells="tableCells"
                         :delta-height-virtual-list="deltaHeightVirtualList"
                         :representations="representations"
                         :images="images"
                         :template-column-width="templateColumnWidth"
                         :max-row-grouping-level="maxRowGroupingLevel"
                         :max-column-grouping-level="maxColumnGroupingLevel"
                         :set-excluded-cells="setExcludedCells"
                         :table-width="tableWidth"
                         :set-open-group-rows="setOpenGroupRows"
                         :is-show-grid="isShowGrid"
                         :is-show-group="isShowGroup"
                         :is-show-title="isShowTitle"
                         @click:cell="evtClickCell"
                         @dblclick:cell="evtDblclickCell"
                         @keydown:cell="evtKeydownCell"
                         @buffer:copy="evtBufferCopy"
                         @buffer:paste="evtBufferPaste"
                         @open-group:row="toggleRowGroup"
                         @scroll-body-x="scrollBodyX"></spread-sheet-body>
    </div>
  </table-layout>
</template>

<script>
import {
  getColumnNameForNumber,
  getColumnNumberForName,
  getParseAtSymbolDigit,
} from '@/helpers/spreadSheet';

import TableLayout from '../TableLayout.vue';
import SpreadSheetAngle from './component/SpreadSheetAngle.vue';
import SpreadSheetHead from './component/SpreadSheetHead.vue';
import SpreadSheetBody from './component/SpreadSheetBody.vue';
import SpreadSheetBodyPrint from './component/SpreadSheetBodyPrint.vue';

import {
  CELL_WIDTH_TITLE,
  CELL_WIDTH_GROUP,
  CELL_WIDTH_BODY,
  CELL_HEIGHT_TITLE,
  CELL_HEIGHT_GROUP,
  CELL_HEIGHT_BODY,
} from './SpreadSheetConst';

export default {
  name: 'SpreadSheet',
  components: {
    TableLayout,
    SpreadSheetAngle,
    SpreadSheetHead,
    SpreadSheetBody,
    SpreadSheetBodyPrint,
  },
  props: {
    cells: { type: Object, default() { return {}; } },
    cellHeight: { type: Number, default: CELL_HEIGHT_BODY },
    cellWidth: { type: Number, default: CELL_WIDTH_BODY },
    columnCount: { type: Number, default: 50 },
    columns: { type: Object, default() { return {}; } },
    deltaHeightVirtualList: { type: Number, default: 168 },
    rowCount: { type: Number, default: 1000 },
    rows: { type: Object, default() { return {}; } },
    representations: { type: Map, default() { return new Map(); } },
    styles: { type: Array, default() { return []; } },
    tableLayoutDisplay: { type: String, default: 'block' },
    tableLayoutPadding: { type: String, default: '4px 4px 4px 4px' },
    images: { type: Object, default() { return {}; } },
    isShowGrid: { type: Boolean, default: true },
    isShowGroup: { type: Boolean, default: true },
    isShowTitle: { type: Boolean, default: true },
    isPrintMode: { type: Boolean, default: false },
    isOuterBorderOff: { type: Boolean, default: false },
  },
  data() {
    return {
      setOpenGroupColumns: [],
      setOpenGroupRows: [],
      setExcludedCells: {},
    };
  },
  computed: {
    maxColumnGroupingLevel() {
      const maxLevelGroup = [0];
      this.prepareColumns.filter((column) => Object.keys(column).includes('level')).forEach((column) => {
        maxLevelGroup.push(column.level);
      });
      const result = (Math.max(...maxLevelGroup) === 0) ? Math.max(...maxLevelGroup) : Math.max(...maxLevelGroup) + 1;
      return result;
    },

    maxRowGroupingLevel() {
      const maxLevelGroup = [0];
      this.prepareRows.filter((row) => Object.keys(row).includes('level')).forEach((row) => {
        maxLevelGroup.push(row.level);
      });
      const result = (Math.max(...maxLevelGroup) === 0) ? Math.max(...maxLevelGroup) : Math.max(...maxLevelGroup) + 1;
      return result;
    },

    prepareCells() {
      // console.log('prepare cells');
      const maxRowGroupingLevel = (this.isShowGroup) ? this.maxRowGroupingLevel : 0;
      const prepareCells = {};
      Object.entries(this.cells).forEach((item) => {
        const [cellName, cellValue] = item;
        const { parthSymbol: cellNameColumn, parthDigit: cellNameRow } = getParseAtSymbolDigit(cellName);
        const cellValueKeys = Object.keys(cellValue);

        prepareCells[cellName] = { ...cellValue };
        let colspan = 0;
        if (cellValueKeys.includes('colspan')) {
          colspan = cellValue.colspan;
          this.setExcludedCells[cellName] = [];
          for (let i = 1; i < colspan; i += 1) {
            const columnNameNext = getColumnNameForNumber(getColumnNumberForName(cellNameColumn) + i);
            this.setExcludedCells[cellName].push(`${columnNameNext}${cellNameRow}`);
          }
          prepareCells[cellName]['grid-column-start'] = (this.isPrintMode) ? 1 : (maxRowGroupingLevel + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.isPrintMode) ? 1 : (maxRowGroupingLevel + 2)) + colspan;
        } else {
          prepareCells[cellName]['grid-column-start'] = (this.isPrintMode) ? 1 : (maxRowGroupingLevel + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.isPrintMode) ? 1 : (maxRowGroupingLevel + 2)) + 1;
        }

        let cellHeight = (this.rows[`${cellNameRow}`]) ? this.rows[`${cellNameRow}`].height || this.cellHeight : this.cellHeight;
        if (cellValueKeys.includes('rowspan')) {
          if (!Object.keys(this.setExcludedCells).includes(cellName)) this.setExcludedCells[cellName] = [];
          for (let i = 1; i < cellValue.rowspan; i += 1) {
            this.setExcludedCells[cellName].push(`${cellNameColumn}${cellNameRow + i}`);
            if (cellValueKeys.includes('colspan')) {
              colspan = cellValue.colspan;
              for (let j = 1; j < colspan; j += 1) {
                const cellNameColumnNext = getColumnNameForNumber(getColumnNumberForName(cellNameColumn) + j);
                this.setExcludedCells[cellName].push(`${cellNameColumnNext}${cellNameRow + i}`);
              }
            }
            cellHeight += (this.rows[`${cellNameRow + i}`]) ? this.rows[`${cellNameRow + i}`].height || this.cellHeight : this.cellHeight;
          }
        }
        prepareCells[cellName].height = cellHeight;
      });
      // console.log(tableCells);
      return prepareCells;
    },

    prepareColumns() {
      const prepareColumns = [];
      const columnsKeys = Object.keys(this.columns);
      for (let i = 1; i < this.columnCount + 1; i += 1) {
        const columnName = getColumnNameForNumber(i);
        const columnItem = {
          value: i,
          name: columnName,
          width: this.cellWidth,
          level: 0,
        };
        if (columnsKeys.includes(columnName)) {
          Object.assign(columnItem, { ...this.columns[columnName] });
        }
        prepareColumns.push(columnItem);
      }
      return prepareColumns;
    },

    prepareRows() {
      const prepareRows = [];
      const rowsKeys = Object.keys(this.rows);
      for (let i = 1; i < this.rowCount + 1; i += 1) {
        const rowItem = {
          value: i,
          height: this.cellHeight,
          level: 0,
        };
        if (rowsKeys.includes(`${i}`)) {
          Object.assign(rowItem, { ...this.rows[i] });
        }
        prepareRows.push(rowItem);
      }
      console.log('prepare row');
      return prepareRows;
    },

    tableCells() {
      // console.log('table cells');
      return this.prepareCells;
    },

    tableColumns() {
      const columns = [];
      let showLevel = 0;
      this.prepareColumns.forEach((column) => {
        const { level } = column;
        if (level === showLevel || level < showLevel) {
          columns.push(column);
        }
        if (level < showLevel) showLevel = level;
        if (this.setOpenGroupColumns.includes(column.name)
          && showLevel === level) showLevel = level + 1;
      });
      return columns;
    },

    tableRows() {
      if (this.isPrintMode) return this.prepareRows;
      const rows = [];
      let showLevel = 0;
      this.prepareRows.forEach((row) => {
        const { level, fixed } = row;
        if ((level === showLevel && !fixed)
          || (level < showLevel)) {
          rows.push(row);
        }
        if (level < showLevel) showLevel = level;
        if (this.setOpenGroupRows.includes(row.value)
          && showLevel === level) showLevel = level + 1;
      });
      console.log('table row');
      // console.log(rows);
      return rows;
    },

    tableRowsFixed() {
      return this.prepareRows.filter((row) => row.fixed);
    },

    templateColumnWidth() {
      let templateColumnWidth = '';
      for (let i = 0; i < this.tableColumns.length; i += 1) {
        templateColumnWidth += `${this.tableColumns[i].width}px `;
      }
      return templateColumnWidth;
    },

    tableWidth() {
      let tableWidth = 0;
      this.tableColumns.forEach((item) => {
        tableWidth += item.width;
      });
      return tableWidth;
    },

    spreadSheetStyle() {
      const maxRowGroupingLevel = (this.isShowGroup) ? this.maxRowGroupingLevel : 0;
      const maxColumnGroupingLevel = (this.isShowGroup) ? this.maxColumnGroupingLevel : 0;
      let titleColumn = CELL_WIDTH_GROUP * maxRowGroupingLevel;
      let titleRow = CELL_HEIGHT_GROUP * maxColumnGroupingLevel;
      if (this.isShowTitle) {
        titleColumn += CELL_WIDTH_TITLE;
        titleRow += CELL_HEIGHT_TITLE;
      }
      if (maxRowGroupingLevel !== 0) titleColumn += (this.isShowTitle) ? 4 : 5;
      if (maxColumnGroupingLevel !== 0) titleRow += (this.isShowTitle) ? 5 : 5;

      const style = {
        'grid-template-rows': `${titleRow}px 1fr`,
        'grid-template-columns': `${titleColumn}px 1fr`,
      };
      return style;
    },
  },
  watch: {
    cells() {
      this.setExcludedCells = {};
    },
    rows() {
      const rowsOpen = Object.entries(this.rows).filter((row) => {
        const [, rowValue] = row;
        return Object.keys(rowValue).includes('isOpen');
      });
      rowsOpen.forEach((row) => {
        const [rowName] = row;
        this.setOpenGroupRows.push(+rowName);
      });
    },
    columns() {
      const columnOpen = Object.entries(this.columns).filter((column) => {
        const [, columnValue] = column;
        return Object.keys(columnValue).includes('isOpen');
      });
      columnOpen.forEach((column) => {
        const [columnName] = column;
        this.setOpenGroupColumns.push(columnName);
      });
    },
    styles() {
      this.updateDocumentStyles();
    },
  },
  mounted() {
    this.updateDocumentStyles();
  },
  beforeDestroy() {
    this.updateDocumentStyles(false);
  },
  methods: {
    evtClickCell(options) {
      this.$emit('click:cell', options);
    },

    evtDblclickCell(options) {
      this.$emit('dblclick:cell', options);
    },

    evtKeydownCell(options) {
      this.$emit('keydown:cell', options);
    },
    evtBufferCopy(cellName) {
      this.$emit('buffer:copy', cellName);
    },
    evtBufferPaste(cellName) {
      this.$emit('buffer:paste', cellName);
    },

    evtOpenGroupColumn(level) {
      const openGroup = [];
      const closeGroup = [];
      this.prepareColumns.forEach((column) => {
        if (Object.keys(column).includes('isGroup')) {
          if (column.level < level - 1) openGroup.push(column.name);
          if (column.level === level - 1) closeGroup.push(column.name);
        }
      });
      this.setOpenGroupColumns = this.setOpenGroupColumns.filter((x) => !closeGroup.includes(x));
      this.setOpenGroupColumns = [...new Set([...this.setOpenGroupColumns, ...openGroup])];
    },

    evtOpenGroupRow(level) {
      const openGroup = [];
      const closeGroup = [];
      this.prepareRows.forEach((row) => {
        if (Object.keys(row).includes('isGroup')) {
          if (row.level < level - 1) openGroup.push(row.value);
          if (row.level === level - 1) closeGroup.push(row.value);
        }
      });
      // this.prepareRows.forEach((row) => {
      //   if (Object.keys(row).includes('isGroup') && row.level === level - 1) {
      //     closeGroup.push(row.value);
      //   }
      // });
      this.setOpenGroupRows = this.setOpenGroupRows.filter((x) => !closeGroup.includes(x));
      this.setOpenGroupRows = [...new Set([...this.setOpenGroupRows, ...openGroup])];
    },

    toggleColumnGroup(columnName) {
      if (this.setOpenGroupColumns.includes(columnName)) {
        this.setOpenGroupColumns.splice(this.setOpenGroupColumns.findIndex((item) => item === columnName), 1);
      } else {
        this.setOpenGroupColumns.push(columnName);
      }
    },

    toggleRowGroup(rowName) {
      if (this.setOpenGroupRows.includes(rowName)) {
        this.setOpenGroupRows.splice(this.setOpenGroupRows.findIndex((item) => item === rowName), 1);
      } else {
        this.setOpenGroupRows.push(rowName);
      }
      console.log(this.setOpenGroupRows);
    },

    scrollBodyX(scrollLeft) {
      this.$refs.SheetHead.$el.scrollLeft = scrollLeft;
      this.$emit('scroll:body');
    },

    updateDocumentStyles(create = true) {
      const styles = document.querySelector('head [data-style="style-cell"]');
      if (styles) styles.remove();
      if (create) this.addingDocumentStyles();
    },

    addingDocumentStyles() {
      let stylesPath = '';
      const prepareStyles = [];
      // stylesPath = ' .spread-sheet .sheet .sheet-body .sheet-body__row ';
      stylesPath = ' .spread-sheet .spread-sheet__body .sheet-body__row ';
      if (this.isPrintMode) {
        stylesPath = '.spread-sheet-print .spread-sheet-body-print .sheet-body__row ';
      }
      const elementDOMStyle = document.createElement('style');
      let stylesString = '';
      elementDOMStyle.setAttribute('type', 'text/css');
      elementDOMStyle.setAttribute('data-style', 'style-cell');

      this.styles.forEach((element) => {
        const listKeys = Object.keys(element.list);
        if (listKeys.includes('borderBottom') || listKeys.includes('borderRight')) {
          prepareStyles.push(this.getPseudoBorder(element));
        }
        prepareStyles.push(this.getStyleCell(element));
      });
      // console.log(prepareStyles);
      prepareStyles.forEach((element) => {
        const stylesObject = {};
        Object.entries(element.list).forEach((item) => {
          const [styleName, styleValue] = [...item];
          stylesObject[this.transformStringToKebabCase(styleName)] = styleValue;
        });
        stylesString += `${stylesPath} .${element.name} ${this.transformObjectToStringStyle(stylesObject)}`;
      });
      elementDOMStyle.innerText = `${stylesString} ${(this.isPrintMode) ? '.no-print {display: none !important}}' : ''}`;
      document.querySelector('head').append(elementDOMStyle);
    },

    getPseudoBorder(style) {
      const pseudoBorder = {
        name: `${style.name}::after`,
        list: {
          content: "''",
          position: 'absolute',
          left: '0px',
          top: '-1.4px',
          right: '-1px',
          bottom: '-0.6px',
          'z-index': '80',
        },
      };
      const listKeys = Object.keys(style.list);
      if (listKeys.includes('borderRight')) {
        pseudoBorder.list.borderRight = style.list.borderRight;
        pseudoBorder.list.right = `-${(0.8 * +style.list.borderRight[0])}px`;
      }
      if (listKeys.includes('borderBottom')) {
        pseudoBorder.list.borderBottom = style.list.borderBottom;
        // pseudoBorder.list.bottom = `-${(1 * +style.list.borderBottom[0])}px`;
      }
      if (listKeys.includes('borderLeft')) {
        pseudoBorder.list.left = `-${(1 * +style.list.borderLeft[0])}px`;
      }
      return pseudoBorder;
    },

    getStyleCell(style) {
      const styleCell = {
        name: style.name,
        list: {},
      };
      Object.entries(style.list).forEach((element) => {
        const [key, value] = element;
        styleCell.list[key] = value;
      });
      if (Object.keys(styleCell.list).includes('borderRight')) delete styleCell.list.borderRight;
      if (Object.keys(styleCell.list).includes('borderBottom')) delete styleCell.list.borderBottom;
      return styleCell;
    },

    transformStringToKebabCase(styleName) {
      return styleName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    },

    transformObjectToStringStyle(object) {
      return JSON.stringify(object).replace(/","/g, ';').replace(/"/g, '').replace(/}/g, ';}');
    },

    // public methods ---------
    newDocument() {
      this.setOpenGroupColumns = [];
      this.setOpenGroupRows = [];
      this.setExcludedCells = {};
    },
  },
};
</script>

<style lang="scss" scoped>
@import './SpreadSheet.scss';

.spread-sheet {
  display: grid;
  grid-template-areas: "angle head" "body body";
  width: 100%;
  height: 100%;
  border: $borderBase;
  &__angle {
    grid-area: angle;
    border-right: thin solid grey;
    border-bottom: thin solid grey;
    background-color: $headBackgroundColor;
    // background: blue;
  }
  &__head {
    grid-area: head;
    font-size: $headFontSize;
    font-weight: $headFontWeight;
    color: $headFontColor;
    background-color: $headBackgroundColor;
    overflow: hidden;
    &_bottom-line {
      border-bottom: thin solid grey;
    }
  }
  &__body {
    grid-area: body;
    // background: cadetblue;
  }
}
</style>
