<template>
  <div :class="{
    'spread-sheet': !isPrintMode,
    'spread-sheet-print': isPrintMode,
  }">
    <div class="sheet"
        :style="templateSheet">
      <div class="sheet__angle"></div>
      <div class="sheet__head">
        <spread-sheet-head ref="SheetHead"
                          v-if="!isPrintMode || !isTitle"
                          :columns="tableColumns"
                          :template-column-width="templateColumnWidth"
                          :template-table-width="templateTableWidth"
                          :max-level-group-column="maxLevelGroupColumn"
                          :set-open-group-column="setOpenGroupColumns"
                          :is-grid="isGrid"
                          @toggle-column-group="toggleColumnGroup"></spread-sheet-head>
      </div>
      <div class="sheet__body">
        <spread-sheet-body-print v-if="isPrintMode"
                                  :rows="tableRows"
                                  :columns="tableColumns"
                                  :cells="tableCells"
                                  :templateTableWidth="templateTableWidth"
                                  :templateColumnWidth="templateColumnWidth"
                                  :maxLevelGroupRow="maxLevelGroupRow"
                                  :setExcludedCells="setExcludedCells"
                                  :print-mode="isPrintMode"></spread-sheet-body-print>
        <spread-sheet-body v-show="!isPrintMode"
                           ref="SpreadSheetBody"
                           :rows="tableRows"
                           :rows-fixed="tableRowsFixed"
                           :columns="tableColumns"
                           :cells="tableCells"
                           :template-column-width="templateColumnWidth"
                           :max-level-group-row="maxLevelGroupRow"
                           :max-level-group-column="maxLevelGroupColumn"
                           :set-excluded-cells="setExcludedCells"
                           :template-table-width="templateTableWidth"
                           :set-open-group-rows="setOpenGroupRows"
                           :is-grid="isGrid"
                           @click:cell="evtClickCell"
                           @dblclick:cell="evtDblclickCell"
                           @keydown:cell="evtKeydownCell"
                           @toggle-row-group="toggleRowGroup"
                           @scroll-body-x="scrollBodyX"></spread-sheet-body>
      </div>
    </div>
  </div>
</template>

<script>
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
    styles: { type: Array, default() { return []; } },

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
    maxLevelGroupRow() {
      const maxLevelGroup = [0];
      this.prepareRows.filter((row) => Object.keys(row).includes('parent')).forEach((row) => {
        maxLevelGroup.push(row.rowLevel);
      });
      return Math.max(...maxLevelGroup);
    },
    maxLevelGroupColumn() {
      const maxLevelGroup = [0];
      this.prepareColumns.filter((column) => Object.keys(column).includes('parent')).forEach((column) => {
        maxLevelGroup.push(column.columnLevel);
      });
      return Math.max(...maxLevelGroup);
    },
    tableColumns() {
      // console.log('table columns');
      return this.prepareColumns.filter((column) => this.setOpenGroupColumns.includes(column.parent) || !column.parent);
    },
    prepareColumns() {
      console.log('prepare columns');
      const prepareColumns = [];
      const columnsKeys = Object.keys(this.columns);
      for (let i = 1; i < this.columnCount + 1; i += 1) {
        const columnName = this.getColumnNameForNumber(i);
        const columnItem = {
          value: i,
          name: columnName,
          display_name: columnName.toUpperCase(),
          width: this.cellWidth,
          columnLevel: this.getColumnLevel(columnName),
        };
        if (columnsKeys.includes(columnName)) {
          Object.assign(columnItem, { ...this.columns[columnName] });
          if (Object.keys(this.columns[columnName]).includes('columnGroup')) {
            columnItem.openGroup = false;
          }
          prepareColumns.push(columnItem);
        } else {
          prepareColumns.push(columnItem);
        }
      }
      // console.log(prepareColumns);
      return prepareColumns;
    },
    tableRows() {
      // console.log('table rows');
      return this.prepareRows.filter((row) => ((this.setOpenGroupRows.includes(+row.parent)
        || !row.parent) && !row.fixed));
    },
    prepareRows() {
      console.log('prepare rows');
      const prepareRows = [];
      const rowsKeys = Object.keys(this.rows);
      for (let i = 1; i < this.rowCount + 1; i += 1) {
        const rowItem = {
          value: i,
          name: i,
          display_name: i,
          height: this.cellHeight,
          rowLevel: this.getRowLevel(`${i}`),
        };
        if (rowsKeys.includes(`${i}`)) {
          Object.assign(rowItem, { ...this.rows[i] });
          if (Object.keys(this.rows[`${i}`]).includes('rowGroup')) {
            rowItem.openGroup = false;
          }
          prepareRows.push(rowItem);
        } else {
          prepareRows.push(rowItem);
        }
      }
      // console.log(prepareRows);
      return prepareRows;
    },
    tableRowsFixed() {
      return this.prepareRows.filter((row) => row.fixed);
    },
    tableCells() {
      // console.log('table cells');
      return this.prepareCells;
    },
    prepareCells() {
      console.log('prepare cells');
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
          prepareCells[cellName]['grid-column-start'] = (this.isPrintMode) ? 1 : (this.maxLevelGroupRow + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.isPrintMode) ? 1 : (this.maxLevelGroupRow + 2)) + colspan;
        } else {
          prepareCells[cellName]['grid-column-start'] = (this.isPrintMode) ? 1 : (this.maxLevelGroupRow + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.isPrintMode) ? 1 : (this.maxLevelGroupRow + 2)) + 1;
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
    templateSheet() {
      return {
        'grid-template-columns': `${(CELL_WIDTH_LEFT_GROUP * this.maxLevelGroupRow) + CELL_WIDTH_LEFT_TITLE}px 1fr`,
        'grid-template-rows': `${(this.cellHeight * this.maxLevelGroupColumn) + this.cellHeight}px 1fr`,
      };
    },
    templateTableWidth() {
      let templateTableWidth = 0;
      this.tableColumns.forEach((item) => {
        templateTableWidth += item.width;
      });
      return templateTableWidth;
    },
    templateColumnWidth() {
      let templateColumnWidth = '';
      for (let i = 0; i < this.tableColumns.length; i += 1) {
        templateColumnWidth += `${this.tableColumns[i].width}px `;
      }
      return templateColumnWidth;
    },
  },
  watch: {
    cells() {
      this.setExcludedCells = {};
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
    evtClickCell(evt) {
      // console.log(evt);
      this.$emit('click:cell', evt);
    },
    evtDblclickCell(evt) {
      this.$emit('dblclick:cell', evt);
    },
    evtKeydownCell(evt) {
      this.$emit('keydown:cell', evt);
    },

    scrollBodyX(scrollLeft) {
      this.$refs.SheetHead.$el.scrollLeft = scrollLeft;
      this.$emit('scroll:body');
    },

    toggleRowGroup(rowGroup) {
      if (this.setOpenGroupRows.includes(rowGroup.value)) {
        this.recursiveClosingRowGroup(rowGroup.value);
        this.setOpenGroupRows.splice(this.setOpenGroupRows.findIndex((item) => item === rowGroup.value), 1);
      } else {
        this.setOpenGroupRows.push(rowGroup.value);
      }
    },

    recursiveClosingRowGroup(rowParent) {
      this.prepareRows.filter((row) => (+row.parent === rowParent && row.rowGroup)).forEach((item) => {
        if (this.setOpenGroupRows.findIndex((element) => element === item.value) > -1) {
          this.setOpenGroupRows.splice(this.setOpenGroupRows.findIndex((element) => element === item.value), 1);
        }
        this.recursiveClosingRowGroup(item.value);
      });
    },

    toggleColumnGroup(columnGroup) {
      console.log(columnGroup);
      console.log(this.setOpenGroupColumns);
      if (this.setOpenGroupColumns.includes(columnGroup.name)) {
        this.setOpenGroupColumns.splice(this.setOpenGroupColumns.findIndex((item) => item === columnGroup.name), 1);
        this.recursiveClosingColumnGroup(columnGroup.name);
      } else {
        this.setOpenGroupColumns.push(columnGroup.name);
      }
    },

    recursiveClosingColumnGroup(columnParent) {
      this.prepareColumns.filter((column) => (column.parent === columnParent && column.columnGroup)).forEach((item) => {
        if (this.setOpenGroupColumns.findIndex((element) => element === item.name) > -1) {
          this.setOpenGroupColumns.splice(this.setOpenGroupColumns.findIndex((element) => element === item.name), 1);
        }
        this.recursiveClosingColumnGroup(item.name);
      });
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

    getRowLevel(rowNumber) {
      let level = 0;
      let currentRow = rowNumber;
      let condition = true;
      while (condition) {
        if (!this.rows[currentRow]?.parent) { condition = false; return level; }
        level += 1;
        currentRow = this.rows[currentRow].parent;
      }
      return level;
    },

    getColumnLevel(columnName) {
      let level = 0;
      let currentColumn = columnName;
      let condition = true;
      while (condition) {
        if (!this.columns[currentColumn]?.parent) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns[currentColumn].parent;
      }
      return level;
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
          bottom: '-1px',
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
        pseudoBorder.list.bottom = `-${(1 * +style.list.borderBottom[0])}px`;
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
    createNewDocument() {
      this.setOpenGroupColumns = [];
      this.setOpenGroupRows = [];
      this.setExcludedCells = {};
      this.updateDocumentStyles(false);
    },
    // pFocusCellByCellName(option) {
    //   if (Object.keys(option).includes('cellName')) {
    //     this.$refs.SpreadSheetBody.focusCellByCellName(option.cellName);
    //   }
    // },
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
    &__angle {
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
      grid-area: body;
    }
  }
}
</style>
