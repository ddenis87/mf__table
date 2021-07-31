<template>
  <div :class="{
    'spread-sheet': !isPrintMode,
    'spread-sheet-print': isPrintMode,
  }">
    <div class="sheet"
         :style="templateSheet">
      <div class="sheet__angle">
        <spread-sheet-angle v-show="isTitle"
                            :max-column-grouping-level="maxColumnGroupingLevel"
                            :max-row-grouping-level="maxRowGroupingLevel"
                            @open-group:column="evtOpenGroupColumn"
                            @open-group:row="evtOpenGroupRow"></spread-sheet-angle>
      </div>
      <div class="sheet__head">
        <spread-sheet-head ref="SheetHead"
                           v-if="!isPrintMode"
                           :columns="tableColumns"
                           :template-column-width="templateColumnWidth"
                           :template-table-width="templateTableWidth"
                           :max-column-grouping-level="maxColumnGroupingLevel"
                           :set-open-group-columns="setOpenGroupColumns"
                           :is-show-title="isTitle"
                           @toggle-group:column="toggleColumnGroup"></spread-sheet-head>
      </div>
      <div class="sheet__body">
        <spread-sheet-body-print v-if="isPrintMode"
                                  :rows="tableRows"
                                  :columns="tableColumns"
                                  :cells="tableCells"
                                  :templateTableWidth="templateTableWidth"
                                  :templateColumnWidth="templateColumnWidth"
                                  :maxLevelGroupRow="maxRowGroupingLevel"
                                  :setExcludedCells="setExcludedCells"
                                  :print-mode="isPrintMode"></spread-sheet-body-print>
        <spread-sheet-body v-show="!isPrintMode"
                           ref="SpreadSheetBody"
                           :rows="tableRows"
                           :rows-fixed="tableRowsFixed"
                           :columns="tableColumns"
                           :cells="tableCells"
                           :representations="representations"
                           :images="images"
                           :template-column-width="templateColumnWidth"
                           :max-row-grouping-level="maxRowGroupingLevel"
                           :max-column-grouping-level="maxColumnGroupingLevel"
                           :set-excluded-cells="setExcludedCells"
                           :template-table-width="templateTableWidth"
                           :set-open-group-rows="setOpenGroupRows"
                           :is-show-grid="isGrid"
                           :is-show-title="isTitle"
                           @click:cell="evtClickCell"
                           @dblclick:cell="evtDblclickCell"
                           @keydown:cell="evtKeydownCell"
                           @buffer:copy="evtBufferCopy"
                           @buffer:paste="evtBufferPaste"
                           @open-group:row="toggleRowGroup"
                           @scroll-body-x="scrollBodyX"></spread-sheet-body>
      </div>
    </div>
  </div>
</template>

<script>
import SpreadSheetAngle from './components/SpreadSheetAngle.vue';
import SpreadSheetHead from './components/SpreadSheetHead.vue';
import SpreadSheetBody from './components/SpreadSheetBody.vue';
import SpreadSheetBodyPrint from './components/SpreadSheetBodyPrint.vue';

import {
  CELL_HEIGHT,
  CELL_WIDTH,
  CELL_WIDTH_LEFT_TITLE,
  CELL_WIDTH_LEFT_GROUP,
  // CELL_TYPE_DEFAULT,
} from './SpreadSheetConst';

export default {
  name: 'SpreadSheet',
  components: {
    SpreadSheetAngle,
    SpreadSheetHead,
    SpreadSheetBody,
    SpreadSheetBodyPrint,
  },
  props: {
    rows: { type: Object, default() { return {}; } },
    rowCount: { type: Number, default: 1000 },
    columns: { type: Object, default() { return {}; } },
    columnCount: { type: Number, default: 50 },
    cells: { type: Object, default() { return {}; } },
    representations: { type: Map, default() { return new Map(); } },
    styles: { type: Array, default() { return []; } },
    images: { type: Object, default() { return {}; } },
    cellWidth: { type: Number, default: CELL_WIDTH },
    cellHeight: { type: Number, default: CELL_HEIGHT },
    isPrintMode: { type: Boolean, default: false },
    isGrid: { type: Boolean, default: true },
    isTitle: { type: Boolean, default: true },
  },
  data() {
    return {
      setColumnName: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
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
      const prepareCells = {};
      Object.entries(this.cells).forEach((item) => {
        const [cellName, cellValue] = item;
        const { cellNameColumn, cellNameRow } = this.parseCellName(cellName);
        const cellValueKeys = Object.keys(cellValue);

        prepareCells[cellName] = { ...cellValue };
        let colspan = 0;
        if (cellValueKeys.includes('colspan')) {
          colspan = cellValue.colspan;
          this.setExcludedCells[cellName] = [];
          for (let i = 1; i < colspan; i += 1) {
            const columnNameNext = this.getColumnNameForNumber(this.getColumnNumberForName(cellNameColumn) + i);
            this.setExcludedCells[cellName].push(`${columnNameNext}${cellNameRow}`);
          }
          prepareCells[cellName]['grid-column-start'] = (this.isPrintMode) ? 1 : (this.maxRowGroupingLevel + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.isPrintMode) ? 1 : (this.maxRowGroupingLevel + 2)) + colspan;
        } else {
          prepareCells[cellName]['grid-column-start'] = (this.isPrintMode) ? 1 : (this.maxRowGroupingLevel + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.isPrintMode) ? 1 : (this.maxRowGroupingLevel + 2)) + 1;
        }

        let cellHeight = (this.rows[`${cellNameRow}`]) ? this.rows[`${cellNameRow}`].height || this.cellHeight : this.cellHeight;
        if (cellValueKeys.includes('rowspan')) {
          if (!Object.keys(this.setExcludedCells).includes(cellName)) this.setExcludedCells[cellName] = [];
          for (let i = 1; i < cellValue.rowspan; i += 1) {
            this.setExcludedCells[cellName].push(`${cellNameColumn}${cellNameRow + i}`);
            if (cellValueKeys.includes('colspan')) {
              colspan = cellValue.colspan;
              for (let j = 1; j < colspan; j += 1) {
                const cellNameColumnNext = this.getColumnNameForNumber(this.getColumnNumberForName(cellNameColumn) + j);
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
      console.log(this.maxRowGroupingLevel);
      const prepareColumns = [];
      const columnsKeys = Object.keys(this.columns);
      for (let i = 1; i < this.columnCount + 1; i += 1) {
        const columnName = this.getColumnNameForNumber(i);
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
      // console.log(prepareColumns);
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

    templateTableWidth() {
      let templateTableWidth = 0;
      this.tableColumns.forEach((item) => {
        templateTableWidth += item.width;
      });
      return templateTableWidth;
    },

    templateSheet() {
      let shiftTop = (CELL_WIDTH_LEFT_GROUP * this.maxRowGroupingLevel) + 5; // + CELL_WIDTH_LEFT_TITLE;
      let shiftLeft = CELL_HEIGHT * this.maxColumnGroupingLevel; // + (this.isTitle) ? CELL_HEIGHT : 0;
      if (this.isTitle) {
        shiftTop += CELL_WIDTH_LEFT_TITLE;
        shiftLeft += CELL_HEIGHT;
      }
      if (!this.isTitle) shiftLeft += 1;
      const style = {
        'grid-template-columns': `${shiftTop}px 1fr`,
        'grid-template-rows': `${shiftLeft}px 1fr`,
      };
      // const shift = {
      //   // 'margin-top': `-${shiftLeft}px`,
      //   // 'margin-left': `-${shiftTop}px`,
      // };
      // if (!this.isTitle) Object.assign(style, shift);
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
      if (level === 1) {
        this.setOpenGroupColumns = [];
        return;
      }
      const openGroup = [];
      this.prepareColumns.forEach((column, columnIndex) => {
        if (column.level >= level) return;
        if (!this.prepareColumns[columnIndex - 1]) return;
        if (Object.keys(this.prepareColumns[columnIndex - 1]).includes('isGroup')) {
          openGroup.push(this.prepareColumns[columnIndex - 1].name);
        }
      });
      console.log(openGroup);
      this.setOpenGroupColumns = [...openGroup];
    },

    // evtOpenGroupRow(level) {
    //   if (level === 1) {
    //     this.setOpenGroupRows = [];
    //     return;
    //   }
    //   const openGroup = [];
    //   this.prepareRows.forEach((row, rowIndex) => {
    //     if (row.level >= level) return;
    //     if (!this.prepareRows[rowIndex - 1]) return;
    //     if (Object.keys(this.prepareRows[rowIndex - 1]).includes('isGroup')) {
    //       openGroup.push(this.prepareRows[rowIndex - 1].value);
    //     }
    //   });
    //   this.setOpenGroupRows = [...openGroup];
    // },
    evtOpenGroupRow(level) {
      const openGroup = [];
      this.prepareRows.forEach((row) => {
        if (Object.keys(row).includes('isGroup') && row.level === level - 1) {
          openGroup.push(row.value);
          // this.toggleRowGroup(row.value);
        }
      });
      console.log(openGroup);
    },

    scrollBodyX(scrollLeft) {
      this.$refs.SheetHead.$el.scrollLeft = scrollLeft;
      this.$emit('scroll:body');
    },

    toggleRowGroup(rowName) {
      if (this.setOpenGroupRows.includes(rowName)) {
        this.setOpenGroupRows.splice(this.setOpenGroupRows.findIndex((item) => item === rowName), 1);
      } else {
        this.setOpenGroupRows.push(rowName);
      }
      console.log(this.setOpenGroupRows);
    },

    toggleColumnGroup(columnName) {
      if (this.setOpenGroupColumns.includes(columnName)) {
        this.setOpenGroupColumns.splice(this.setOpenGroupColumns.findIndex((item) => item === columnName), 1);
      } else {
        this.setOpenGroupColumns.push(columnName);
      }
    },

    getColumnNameForNumber(columnNumber) {
      if (columnNumber > 702) return 'Infinity';
      if (columnNumber <= this.setColumnName.length) {
        const columnName = this.setColumnName[columnNumber - 1];
        return columnName;
      }
      if ((columnNumber % this.setColumnName.length) === 0) {
        const columnName = `${this.setColumnName[
          ((columnNumber - this.setColumnName.length) / this.setColumnName.length) - 1
        ]}${this.setColumnName[this.setColumnName.length - 1]}`;
        return columnName;
      }
      const columnName = `${this.setColumnName[
        (Math.floor(columnNumber / this.setColumnName.length)) - 1
      ]}${this.setColumnName[(columnNumber % this.setColumnName.length) - 1]}`;
      return columnName;
    },

    getColumnNumberForName(columnName) {
      if (columnName.length === 1) return this.setColumnName.findIndex((item) => item === columnName) + 1;
      const indexFirst = this.setColumnName.findIndex((item) => item === columnName[0]) + 1;
      const indexSecond = this.setColumnName.findIndex((item) => item === columnName[1]) + 1;
      return (indexFirst * this.setColumnName.length) + indexSecond;
    },

    parseCellName(cellName) {
      return {
        cellNameColumn: cellName.replace(/[0-9]/g, ''),
        cellNameRow: +cellName.replace(/[a-z]/g, ''),
      };
    },

    updateDocumentStyles(create = true) {
      const styles = document.querySelector('head [data-style="style-cell"]');
      if (styles) styles.remove();
      if (create) this.addingDocumentStyles();
    },

    addingDocumentStyles() {
      let stylesPath = '';
      const prepareStyles = [];
      stylesPath = ' .spread-sheet .sheet .sheet-body .sheet-body__row ';
      if (this.isPrintMode) {
        stylesPath = '.spread-sheet-print .sheet .sheet-body-print .sheet-body__row ';
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
          top: '0px',
          right: '-1px',
          bottom: '-0.6px',
          'z-index': '80',
        },
      };
      const listKeys = Object.keys(style.list);
      if (listKeys.includes('borderRight')) {
        pseudoBorder.list.borderRight = style.list.borderRight;
        pseudoBorder.list.right = `-${(1 * +style.list.borderRight[0])}px`;
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
    // ------ ------- ---------
  },
};
</script>

<style lang="scss" scoped>
@import './SpreadSheet.scss';
.spread-sheet {
  width: 100%;
  height: 100%;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: hidden;
  font-family: $fontFamily;
  font-size: $fontSize;
  .sheet {
    display: grid;
    grid-template-areas: "angle head" "body body";
    height: 100%;
    box-sizing: border-box;
    // &_noTitle {
    //   grid-template-areas: "angle head" "body body";
    //   // .sheet__angle { display: none; }
    //   // .sheet__head { display: none; }
    // }
    &__angle {
      padding-left: 2px;
      grid-area: angle;
      border: thin solid grey;
      background-color: $backgroundColorTitle;
      box-sizing: border-box;
    }
    &__head {
      grid-area: head;
      overflow: hidden;
      box-sizing: border-box;
    }
    &__body {
      // padding-left: 1px;
      grid-area: body;
      border-left: thin solid grey;
    }
  }
}
</style>
