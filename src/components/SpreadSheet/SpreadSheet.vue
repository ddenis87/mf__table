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
                         @edit-cell="startCellEditing"
                         @toggle-row-group="toggleRowGroup"
                         @scroll-body-x="scrollBodyX"></spread-sheet-body>
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
    rows: { type: Object },
    rowCount: { type: Number, default: 1000 },
    columns: { type: Object },
    columnCount: { type: Number, default: 30 },
    cells: { type: Object },
    styles: { type: Array },

    printMode: { type: Boolean, default: false },
  },
  data() {
    return {
      setColumnName: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      setExcludedCells: {},
      maxLevelGroupRow: this.getMaxLevelGroupRow(),
      maxLevelGroupColumn: this.getMaxLevelGroupColumn(),
      tableRows: [],
      tableRowsChildren: {},
      tableRowsFixed: [],
      tableColumns: [],
      tableColumnsChildren: {},
      tableCells: {},
    };
  },
  computed: {
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
  watch: {
    rowCount() {
      this.tableRows = [];
      this.tableRowsChildren = {};
      this.tableRowsFixed = [];
      this.createRows();
    },
    columnCount() {
      this.tableColumns = [];
      this.tableColumnsChildren = {};
      this.createColumns();
    },
  },
  created() {
    this.addingDocumentStyles();
    this.createRows();
    this.createColumns();
    this.createSetExcludedCells();
  },
  methods: {
    startCellEditing(evt) {
      const cellName = evt.target.getAttribute('data-name');
      const cellType = this.getCellType(cellName);
      const targetInsert = evt.target;
      console.log(evt.target.getAttribute('data-name'));
      console.log(cellType);
      console.log(targetInsert);
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
      // console.log('SpreadSheet - Call function scrollX', new Date().getTime());
      // console.log('----------------');
      this.$refs.SheetHead.$el.scrollLeft = scrollLeft;
    },
    toggleRowGroup(rowParent) {
      // console.log(rowParent);
      if (!rowParent.status) {
        this.openRowGroup(rowParent);
        this.tableRows.find((item) => item.value === rowParent.value).openGroup = true;
      } else {
        this.closeRowGroup(rowParent);
        this.tableRows.find((item) => item.value === rowParent.value).openGroup = false;
      }
    },
    toggleColumnGroup(columnParent) {
      // console.log(columnParent);
      if (!columnParent.status) {
        this.openColumnGroup(columnParent);
        this.tableColumns.find((item) => item.value === columnParent.value).openGroup = true;
      } else {
        this.closeColumnGroup(columnParent);
        this.tableColumns.find((item) => item.value === columnParent.value).openGroup = false;
      }
    },

    openRowGroup(rowParent) {
      console.time('RowWay');
      this.tableRows.splice(rowParent.index + 1, 0, ...this.tableRowsChildren[rowParent.value]);
      console.timeEnd('RowWay');
    },
    closeRowGroup(rowParent) {
      const rowsCut = [];
      for (let i = 1; i < rowParent.count + 1; i += 1) {
        const indexCut = this.tableRows.findIndex((item) => +item.value === rowParent.value + i);
        if (indexCut > -1) {
          rowsCut.push(indexCut);
          if (this.tableRows[rowParent.index + i].rowGroup) this.tableRows[rowParent.index + i].openGroup = false;
        }
      }
      this.tableRows = this.tableRows.filter((item, index) => !rowsCut.includes(index));
    },
    openColumnGroup(columnParent) {
      console.time('ColumnWay');
      const columnName = this.getColumnNameForNumber(columnParent.value);
      this.tableColumns.splice(columnParent.index + 1, 0, ...this.tableColumnsChildren[columnName]);
      console.timeEnd('ColumnWay');
    },
    closeColumnGroup(columnParent) {
      const columnCut = [];
      for (let i = 1; i < columnParent.count + 1; i += 1) {
        const indexCut = this.tableColumns.findIndex((item) => +item.value === columnParent.value + i);
        if (indexCut > -1) {
          columnCut.push(indexCut);
          if (this.tableColumns[columnParent.index + i].columnGroup) {
            this.tableColumns[columnParent.index + i].openGroup = false;
          }
        }
      }
      this.tableColumns = this.tableColumns.filter((item, index) => !columnCut.includes(index));
    },

    getMaxLevelGroupColumn() {
      const maxLevelGroup = [0];
      Object.entries(this.columns).filter((item) => Object.keys(item[1]).includes('parent')).forEach((column) => {
        maxLevelGroup.push(this.getColumnLevel(column[0]));
      });
      return Math.max(...maxLevelGroup);
    },
    getMaxLevelGroupRow() {
      const maxLevelGroup = [0];
      Object.entries(this.rows).filter((item) => Object.keys(item[1]).includes('parent')).forEach((row) => {
        maxLevelGroup.push(this.getRowLevel(row[0]));
      });
      return Math.max(...maxLevelGroup);
    },

    createSetExcludedCells() {
      Object.entries(this.cells).forEach((item) => {
        const [cellName, cellValue] = item;
        const { cellNameColumn, cellNameRow } = this.parseCellName(cellName);
        const cellValueKeys = Object.keys(cellValue);

        this.tableCells[cellName] = { ...cellValue };
        let colspan = 0;
        if (cellValueKeys.includes('colspan')) {
          colspan = cellValue.colspan;
          this.setExcludedCells[cellName] = [];
          for (let i = 1; i < colspan; i += 1) {
            const columnNameNext = this.getColumnNameForNumber(this.getColumnNumberForName(cellNameColumn) + i);
            // this.setExcludedCells.push(`${columnNameNext}${cellNameRow}`);
            this.setExcludedCells[cellName].push(`${columnNameNext}${cellNameRow}`);
          }
          this.tableCells[cellName]['grid-column-start'] = (this.printMode) ? 1 : (this.maxLevelGroupRow + 2);
          this.tableCells[cellName]['grid-column-end'] = ((this.printMode) ? 1 : (this.maxLevelGroupRow + 2)) + colspan;
        } else {
          this.tableCells[cellName]['grid-column-start'] = (this.printMode) ? 1 : (this.maxLevelGroupRow + 2);
          this.tableCells[cellName]['grid-column-end'] = ((this.printMode) ? 1 : (this.maxLevelGroupRow + 2)) + 1;
        }

        let cellHeight = (this.rows[`${cellNameRow}`]) ? this.rows[`${cellNameRow}`].height || CELL_HEIGHT : CELL_HEIGHT;
        if (cellValueKeys.includes('rowspan')) {
          if (!Object.keys(this.setExcludedCells).includes(cellName)) this.setExcludedCells[cellName] = [];
          for (let i = 1; i < cellValue.rowspan; i += 1) {
            // this.setExcludedCells.push(`${cellNameColumn}${cellNameRow + i}`);
            this.setExcludedCells[cellName].push(`${cellNameColumn}${cellNameRow + i}`);
            // if colspan
            if (cellValueKeys.includes('colspan')) {
              colspan = cellValue.colspan;
              for (let j = 1; j < colspan; j += 1) {
                const cellNameColumnNext = this.getColumnNameForNumber(this.getColumnNumberForName(cellNameColumn) + j);
                // this.setExcludedCells.push(`${cellNameColumnNext}${cellNameRow + i}`);
                this.setExcludedCells[cellName].push(`${cellNameColumnNext}${cellNameRow + i}`);
              }
            }
            cellHeight += (this.rows[`${cellNameRow + i}`]) ? this.rows[`${cellNameRow + i}`].height || CELL_HEIGHT : CELL_HEIGHT;
          }
        }
        this.tableCells[cellName].height = cellHeight;
      });
      console.log(this.tableCells);
      // console.log([].concat(...Object.values(this.setExcludedCells)));
    },

    createColumns() {
      const columnsKeys = Object.keys(this.columns);
      for (let i = 1; i < this.columnCount + 1; i += 1) {
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
            // columnItem.columnLevel = this.getColumnLevel(columnName);
          }
          if (Object.keys(this.columns[columnName]).includes('parent')) {
            if (!this.tableColumnsChildren[this.columns[columnName].parent]) {
              this.tableColumnsChildren[this.columns[columnName].parent] = [];
            }
            this.tableColumnsChildren[this.columns[columnName].parent].push(columnItem);
            const columnNumberParent = this.getColumnNumberForName(this.columns[columnName].parent);
            const columnParentGroupCount = +this.columns[this.columns[columnName].parent].columnGroup - 1;
            if (i === (columnNumberParent + columnParentGroupCount)) {
              columnItem.columnGroupEnd = true;
            }
          } else {
            this.tableColumns.push(columnItem);
          }
        } else {
          this.tableColumns.push(columnItem);
        }
      }
      console.log(this.tableColumns);
    },

    createRows() {
      const rowsKeys = Object.keys(this.rows);
      for (let i = 1; i < this.rowCount + 1; i += 1) {
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
            // rowItem.rowLevel = this.getRowLevel(`${i}`);
          }
          if (Object.keys(this.rows[`${i}`]).includes('parent')) {
            if (!this.tableRowsChildren[this.rows[`${i}`].parent]) {
              this.tableRowsChildren[this.rows[`${i}`].parent] = [];
            }
            this.tableRowsChildren[this.rows[`${i}`].parent].push(rowItem);
            const rowNumberParent = +this.rows[`${i}`].parent;
            const rowParentGroupCount = +this.rows[this.rows[`${i}`].parent].rowGroup - 1;
            if (i === (rowNumberParent + rowParentGroupCount)) {
              rowItem.rowGroupEnd = true;
            }
          } else if (rowItem.fixed) {
            this.tableRowsFixed.push(rowItem);
          } else {
            this.tableRows.push(rowItem);
          }
        } else {
          this.tableRows.push(rowItem);
        }
      }
      // console.log(this.tableRows);
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
.spread-sheet-print {
  display: grid;
  grid-template-areas: "head" "body";
  height: 100%;
  box-shadow: $boxShadow;
  font-family: $fontFamily;
  font-size: 14px;
  .sheet {
    &__head {
      grid-area: head;
    }
    &__body {
      grid-area: body;
    }
  }
}
</style>
