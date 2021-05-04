<template>
  <div :class="{
    'spread-sheet': !printMode,
    'spread-sheet-print': printMode,
  }">
    <div class="sheet"
        :style="templateSheet">
      <div class="sheet__angle"></div>
      <div class="sheet__head">
        <spread-sheet-head ref="SheetHead"
                          v-if="!printMode"
                          :columns="tableColumns"
                          :template-column-width="templateColumnWidth"
                          :template-table-width="templateTableWidth"
                          :max-level-group-column="maxLevelGroupColumn"
                          :set-open-group-column="setOpenGroupColumns"
                          @toggle-column-group="toggleColumnGroup"></spread-sheet-head>
      </div>
      <div class="sheet__body">
        <spread-sheet-body-static v-if="printMode"
                                  :rows="tableRows"
                                  :columns="tableColumns"
                                  :cells="tableCells"
                                  :templateTableWidth="templateTableWidth"
                                  :templateColumnWidth="templateColumnWidth"
                                  :maxLevelGroupRow="maxLevelGroupRow"
                                  :setExcludedCells="setExcludedCells"
                                  :print-mode="printMode"></spread-sheet-body-static>
        <spread-sheet-body v-if="!printMode"
                          :rows="tableRows"
                          :rows-fixed="tableRowsFixed"
                          :columns="tableColumns"
                          :cells="tableCells"
                          :template-column-width="templateColumnWidth"
                          :max-level-group-row="maxLevelGroupRow"
                          :set-excluded-cells="setExcludedCells"
                          :template-table-width="templateTableWidth"
                          :set-open-group-rows="setOpenGroupRows"
                          @edit-cell="editCell"
                          @toggle-row-group="toggleRowGroup"
                          @scroll-body-x="scrollBodyX"
                          @touchmove="touchMove"></spread-sheet-body>
      </div>
    </div>
  </div>
</template>

<script>
import SpreadSheetHead from './components/SpreadSheetHead.vue';
import SpreadSheetBody from './components/SpreadSheetBody.vue';
import SpreadSheetBodyStatic from './components/SpreadSheetBodyPrint.vue';

import {
  CELL_HEIGHT,
  CELL_WIDTH,
  CELL_WIDTH_LEFT_TITLE,
  CELL_WIDTH_LEFT_GROUP,
  CELL_TYPE_DEFAULT,
} from './SpreadSheetConst';

export default {
  name: 'SpreadSheet',
  components: {
    SpreadSheetHead,
    SpreadSheetBody,
    SpreadSheetBodyStatic,
  },
  props: {
    columns: { type: Object, default() { return {}; } },
    columnsCount: { type: Number, default: 20 },
    rows: { type: Object, default() { return {}; } },
    rowsCount: { type: Number, default: 100 },
    cells: { type: Object, default() { return {}; } },
    styles: { type: Array, default() { return []; } },
    printMode: { type: Boolean, default: false },
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
      return this.prepareColumns.filter((column) => this.setOpenGroupColumns.includes(column.parent) || !column.parent);
    },
    prepareColumns() {
      const prepareColumns = [];
      const columnsKeys = Object.keys(this.columns);
      for (let i = 1; i < this.columnsCount + 1; i += 1) {
        const columnName = this.getColumnNameForNumber(i);
        const columnItem = {
          value: i,
          name: columnName,
          display_name: columnName.toUpperCase(),
          width: CELL_WIDTH,
          columnLevel: this.getColumnLevel(columnName),
        };
        if (columnsKeys.includes(columnName)) {
          Object.assign(columnItem, { ...this.columns[columnName] });
          if (Object.keys(this.columns[columnName]).includes('columnGroup')) {
            columnItem.openGroup = false;
          }
          if (Object.keys(this.columns[columnName]).includes('parent')) {
            const columnNumberParent = this.getColumnNumberForName(this.columns[columnName].parent);
            const columnParentGroupCount = +this.columns[this.columns[columnName].parent].columnGroup - 1;
            if (i === (columnNumberParent + columnParentGroupCount)) {
              columnItem.columnGroupEnd = true;
            }
            prepareColumns.push(columnItem);
          } else {
            prepareColumns.push(columnItem);
          }
        } else {
          prepareColumns.push(columnItem);
        }
      }
      // console.log(columnsTable);
      return prepareColumns;
    },
    tableRows() {
      return this.prepareRows.filter((row) => ((this.setOpenGroupRows.includes(+row.parent)
        || !row.parent) && !row.fixed));
    },
    prepareRows() {
      const prepareRows = [];
      const rowsKeys = Object.keys(this.rows);
      for (let i = 1; i < this.rowsCount + 1; i += 1) {
        const rowItem = {
          value: i,
          name: i,
          display_name: i,
          height: CELL_HEIGHT,
          rowLevel: this.getRowLevel(`${i}`),
        };
        if (rowsKeys.includes(`${i}`)) {
          Object.assign(rowItem, { ...this.rows[i] });
          if (Object.keys(this.rows[`${i}`]).includes('rowGroup')) {
            rowItem.openGroup = false;
          }
          if (Object.keys(this.rows[`${i}`]).includes('parent')) {
            const rowNumberParent = +this.rows[`${i}`].parent;
            const rowParentGroupCount = +this.rows[this.rows[`${i}`].parent].rowGroup - 1;
            if (i === (rowNumberParent + rowParentGroupCount)) {
              rowItem.rowGroupEnd = true;
            }
            prepareRows.push(rowItem);
          } else {
            prepareRows.push(rowItem);
          }
        } else {
          prepareRows.push(rowItem);
        }
      }
      return prepareRows;
    },
    tableRowsFixed() {
      return this.prepareRows.filter((row) => row.fixed);
    },
    tableCells() {
      return this.prepareCells;
    },
    prepareCells() {
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
          prepareCells[cellName]['grid-column-start'] = (this.printMode) ? 1 : (this.maxLevelGroupRow + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.printMode) ? 1 : (this.maxLevelGroupRow + 2)) + colspan;
        } else {
          prepareCells[cellName]['grid-column-start'] = (this.printMode) ? 1 : (this.maxLevelGroupRow + 2);
          prepareCells[cellName]['grid-column-end'] = ((this.printMode) ? 1 : (this.maxLevelGroupRow + 2)) + 1;
        }

        let cellHeight = (this.rows[`${cellNameRow}`]) ? this.rows[`${cellNameRow}`].height || CELL_HEIGHT : CELL_HEIGHT;
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
            cellHeight += (this.rows[`${cellNameRow + i}`]) ? this.rows[`${cellNameRow + i}`].height || CELL_HEIGHT : CELL_HEIGHT;
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
        'grid-template-rows': `${(CELL_HEIGHT * this.maxLevelGroupColumn) + CELL_HEIGHT}px 1fr`,
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
  created() {
    this.addingDocumentStyles();
  },
  methods: {
    touchMove(evt) {
      console.log(evt);
    },

    editCell(evt) {
      const cellName = evt.target.getAttribute('data-name');
      const cellProps = {
        name: cellName,
        target: evt.target,
        type: this.getCellType(cellName),
      };
      this.$emit('edit-cell', cellProps);
      // const cellType = this.getCellType(cellName);
      // const targetInsert = evt.target;
      // console.log(evt.target.getAttribute('data-name'));
      // console.log(cellType);
      // console.log(targetInsert);
    },

    getCellType(cellName) {
      const { cellNameColumn, cellNameRow } = this.parseCellName(cellName);
      const cellType = this.tableCells[cellName]?.type
        || this.tableRows.find((row) => row.name === cellNameRow).type
        || this.tableColumns.find((column) => column.name === cellNameColumn).type
        || CELL_TYPE_DEFAULT;
      return cellType;
    },

    scrollBodyX(scrollLeft) {
      this.$refs.SheetHead.$el.scrollLeft = scrollLeft;
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
      if (this.setOpenGroupColumns.includes(columnGroup.name)) {
        this.recursiveClosingColumnGroup(columnGroup.name);
        this.setOpenGroupColumns.splice(this.setOpenGroupColumns.findIndex((item) => item === columnGroup.name), 1);
      } else {
        this.setOpenGroupColumns.push(columnGroup.name);
      }
    },

    recursiveClosingColumnGroup(columnParent) {
      this.prepareColumns.filter((column) => (column.parent === columnParent && column.columnGroup)).forEach((item) => {
        if (this.setOpenGroupColumns.findIndex((element) => element === item.name) > -1) {
          this.setOpenGroupColumns.splice(this.setOpenGroupColumns.findIndex((element) => element === item.name), 1);
        }
        this.recursiveClosingRowGroup(item.name);
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
    
    addingDocumentStyles() {
      let stylesPath = '';
      stylesPath = ' .spread-sheet .sheet .sheet-body .sheet-body__row ';
      if (this.printMode) {
        stylesPath = ' .spread-sheet-print .sheet .sheet-body-print .sheet-body__row ';
      }
      // const stylesPath = ' .spread-sheet .sheet .sheet-body .sheet-body__row ';
      const elementDOMStyle = document.createElement('style');
      let stylesString = '';
      elementDOMStyle.setAttribute('type', 'text/css');
      this.styles.forEach((element) => {
        const stylesObject = {};
        Object.entries(element.list).forEach((item) => {
          const [styleName, styleValue] = [...item];
          stylesObject[this.transformStringToKebabCase(styleName)] = styleValue;
        });
        stylesString += `${stylesPath} .${element.name} ${this.transformObjectToStringStyle(stylesObject)}`;
      });
      elementDOMStyle.innerText = `${stylesString}`;
      document.querySelector('head').append(elementDOMStyle);
    },

    transformStringToKebabCase(styleName) {
      return styleName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    },

    transformObjectToStringStyle(object) {
      return JSON.stringify(object).replace(/,/g, ';').replace(/"/g, '').replace(/}/g, ';}');
    },
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
      background-color: #dadce0;
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
