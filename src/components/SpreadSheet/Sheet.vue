<template>
  <div class="sheet"
       :style="{
         'grid-template-columns': `${(20 * maxLevelGroupRow) + 60}px 1fr`,
         'grid-template-rows': `${(22 * maxLevelGroupColumn) + 22}px 1fr`,
       }">
    <div class="sheet__angle"></div>
    <div class="sheet__head">
      <sheet-head ref="SheetHead"
                  :columns="tableColumns"
                  :template-row="templateRow"
                  :max-level-group-column="maxLevelGroupColumn"></sheet-head>
    </div>
    <div class="sheet__body">
      <sheet-body :rows="tableRows"
                  :columns="tableColumns"
                  :cells="tableCells"
                  :template-row="templateRow"
                  :max-level-group-row="maxLevelGroupRow"
                  :set-excluded-cell="setExcludedCells"
                  @toggle-row-group="toggleRowGroup"
                  @scroll-body-x="scrollBodyX"></sheet-body>
    </div>
  </div>
</template>

<script>
import SheetHead from './Sheet/SheetHead.vue';
import SheetBody from './Sheet/SheetBody.vue';

const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;

export default {
  name: 'Sheet',
  components: {
    SheetHead,
    SheetBody,
  },
  props: {
    rows: { type: Object },
    rowCount: { type: Number, default: 1000 },
    columns: { type: Object },
    columnCount: { type: Number, default: 30 },
    cells: { type: Object },
  },
  data() {
    return {
      setColumnName: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      setExcludedCells: [],
      maxLevelGroupRow: this.getMaxLevelGroupRow(),
      maxLevelGroupColumn: this.getMaxLevelGroupColumn(),
      tableRows: [],
      tableRowsChildren: {},
      tableColumns: [],
      tableColumnsChildren: {},
      tableCells: {},
    };
  },
  computed: {
    templateRow() {
      let templateRow = '';
      for (let i = 0; i < this.tableColumns.length; i += 1) {
        templateRow += `${this.tableColumns[i].width}px `;
      }
      return templateRow;
    },
  },
  created() {
    this.createRows();
    this.createColumns();
    this.createSetExcludedCells();
  },
  methods: {
    scrollBodyX(scrollLeft) {
      this.$refs.SheetHead.$el.scrollLeft = scrollLeft;
    },
    toggleRowGroup(rowParent) {
      console.log(rowParent);
      if (rowParent.status === 'close') {
        this.openRowGroup(rowParent);
        rowParent.target.setAttribute('data-row-status', 'open');
        // this.rowsBody.find((item) => item.value === rowParent.value).openGroup = 'open';
      } else {
        this.closeRowGroup(rowParent);
        rowParent.target.setAttribute('data-row-status', 'close');
        // this.rowsBody.find((item) => item.value === rowParent.value).openGroup = 'close';
      }
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
        const cellRow = +cellName.replace(/[a-z]/g, '');
        const cellColumn = cellName.replace(/[0-9]/g, '');
        const cellValueKeys = Object.keys(cellValue);

        this.tableCells[cellName] = { ...cellValue };
        let colspan = 0;
        if (cellValueKeys.includes('colspan')) {
          colspan = cellValue.colspan;
          // this.setExcludedCells[cellRow] = [];
          for (let i = 1; i < colspan; i += 1) {
            const columnNameNext = this.getColumnNameForNumber(this.getColumnNumberForName(cellColumn) + i);
            this.setExcludedCells.push(`${columnNameNext}${cellRow}`);
            // this.setExcludedCells[cellRow].push(`${columnNameNext}${cellRow}`);
          }
          this.tableCells[cellName]['grid-column-start'] = this.maxLevelGroupRow + 2;
          this.tableCells[cellName]['grid-column-end'] = this.maxLevelGroupRow + 2 + colspan;
        } else {
          this.tableCells[cellName]['grid-column-start'] = this.maxLevelGroupRow + 2;
          this.tableCells[cellName]['grid-column-end'] = this.maxLevelGroupRow + 2 + 1;
        }

        let cellHeight = (this.rows[`${cellRow}`]) ? this.rows[`${cellRow}`].height || 22 : 22;
        if (cellValueKeys.includes('rowspan')) {
          for (let i = 1; i < cellValue.rowspan; i += 1) {
            // if (!this.setExcludedCells[cellRow + i]) this.setExcludedCells[cellRow + i] = [];
            // this.setExcludedCells[cellRow + i].push(`${cellColumn}${cellRow + i}`);
            this.setExcludedCells.push(`${cellColumn}${cellRow + i}`);
            cellHeight += (this.rows[`${cellRow + i}`]) ? this.rows[`${cellRow + i}`].height || 22 : 22;
          }
        }
        this.tableCells[cellName].height = cellHeight;
      });
      console.log(this.tableCells);
      console.log(this.setExcludedCells);
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
        };
        if (columnsKeys.includes(columnName)) {
          Object.assign(columnItem, { ...this.columns[columnName] });
          if (Object.keys(this.columns[columnName]).includes('columnGroup')) {
            columnItem.openGroup = false;
            columnItem.columnLevel = this.getColumnLevel(columnName);
          }
          if (Object.keys(this.columns[columnName]).includes('parent')) {
            if (!this.tableColumnsChildren[this.columns[columnName].parent]) {
              this.tableColumnsChildren[this.columns[columnName].parent] = [];
            }
            this.tableColumnsChildren[this.columns[columnName].parent].push(columnItem);
          } else {
            this.tableColumns.push(columnItem);
          }
        } else {
          this.tableColumns.push(columnItem);
        }
      }
      // console.log(this.tableColumns);
    },

    createRows() {
      const rowsKeys = Object.keys(this.rows);
      for (let i = 1; i < this.rowCount + 1; i += 1) {
        const rowItem = {
          value: i,
          name: i,
          display_name: i,
          height: CELL_HEIGHT,
        };
        if (rowsKeys.includes(`${i}`)) {
          Object.assign(rowItem, { ...this.rows[i] });
          if (Object.keys(this.rows[`${i}`]).includes('rowGroup')) {
            rowItem.openGroup = false;
            rowItem.rowLevel = this.getRowLevel(`${i}`);
          }
          if (Object.keys(this.rows[`${i}`]).includes('parent')) {
            if (!this.tableRowsChildren[this.rows[`${i}`].parent]) {
              this.tableRowsChildren[this.rows[`${i}`].parent] = [];
            }
            this.tableRowsChildren[this.rows[`${i}`].parent].push(rowItem);
          } else {
            this.tableRows.push(rowItem);
          }
        } else {
          this.tableRows.push(rowItem);
        }
      }
      // console.log(this.tableRows);
    },

    // openRowGroup(rowParent) {
    //   console.time('FirstWay');
    //   this.rowsBody.splice(rowParent.index + 1, 0, ...this.rowsParents[rowParent.value]);
    //   console.timeEnd('FirstWay');
    //   const btnIcon = rowParent.target.querySelector('i');
    //   btnIcon.classList.remove('mdi-plus-box-outline');
    //   btnIcon.classList.add('mdi-minus-box-outline');
    // },
    // closeRowGroup(rowParent) {
    //   const rowsCut = [];
    //   for (let i = 1; i < rowParent.count + 1; i += 1) {
    //     const indexCut = this.rowsBody.findIndex((item) => +item.value === rowParent.value + i);
    //     if (indexCut > -1) rowsCut.push(indexCut);
    //   }
    //   this.rowsBody = this.rowsBody.filter((item, index) => !rowsCut.includes(index));
    //   const btnIcon = rowParent.target.querySelector('i');
    //   btnIcon.classList.add('mdi-plus-box-outline');
    //   btnIcon.classList.remove('mdi-minus-box-outline');
    // },
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
        if (!this.columns[currentColumn].parent) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns[currentColumn].parent;
      }
      return level;
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>
