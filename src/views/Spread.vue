<template>
  <div class="test">
    <div class="test-control-top">
      <div class="item">
        <v-text-field label="Столбцы" v-model="countColumn"></v-text-field>
      </div>
      <div class="item">
        <v-text-field label="Строки" v-model="countRow"></v-text-field>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3">Commit</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3">Setting</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3">Print</v-btn>
      </div>
    </div>
    <div class="test-table">
      <spread-sheet :columns="columnsTable"
                    :rows="rowsTable"
                    :max-level-group-column="maxLevelGroupColumn"
                    :max-level-group-row="maxLevelGroupRow"></spread-sheet>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/Spread/SpreadSheet.vue';
import SpreadData from './SpreadSheetData';

const CELL_HEIGHT = 22;
const CELL_WIDTH = 94;
// const CELL_WIDTH_LEFT_TITLE = 60;
// const CELL_WIDTH_LEFT_GROUP = 20;
// const CELL_TYPE_DEFAULT = 'string';

export default {
  name: 'Spread',
  components: {
    SpreadSheet,
  },
  props: {
  },
  data() {
    return {
      setColumnName: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      ...SpreadData,
      tableRowsFixed: [],
    };
  },
  computed: {
    rows() { return JSON.parse(this.rowsJSON) },
    columns() { return JSON.parse(this.columnsJSON) },
    maxLevelGroupColumn() {
      const maxLevelGroup = [0];
      Object.entries(this.columns).filter((item) => Object.keys(item[1]).includes('parent')).forEach((column) => {
        maxLevelGroup.push(this.getColumnLevel(column[0]));
      });
      return Math.max(...maxLevelGroup);
    },
    maxLevelGroupRow() {
      const maxLevelGroup = [0];
      Object.entries(this.rows).filter((item) => Object.keys(item[1]).includes('parent')).forEach((row) => {
        maxLevelGroup.push(this.getRowLevel(row[0]));
      });
      return Math.max(...maxLevelGroup);
    },
    rowsTable() {
      const rowsTable = [];
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
            // if (!this.tableRowsChildren[this.rows[`${i}`].parent]) {
            //   this.tableRowsChildren[this.rows[`${i}`].parent] = [];
            // }
            // this.tableRowsChildren[this.rows[`${i}`].parent].push(rowItem);
            const rowNumberParent = +this.rows[`${i}`].parent;
            const rowParentGroupCount = +this.rows[this.rows[`${i}`].parent].rowGroup - 1;
            if (i === (rowNumberParent + rowParentGroupCount)) {
              rowItem.rowGroupEnd = true;
            }
            rowsTable.push(rowItem);
          } else if (rowItem.fixed) {
            this.tableRowsFixed.push(rowItem);
          } else {
            rowsTable.push(rowItem);
          }
        } else {
          rowsTable.push(rowItem);
        }
      }
      return rowsTable;
    },
    columnsTable() {
      const columnsTable = [];
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
            // if (!this.tableColumnsChildren[this.columns[columnName].parent]) {
            //   this.tableColumnsChildren[this.columns[columnName].parent] = [];
            // }
            // this.tableColumnsChildren[this.columns[columnName].parent].push(columnItem);
            const columnNumberParent = this.getColumnNumberForName(this.columns[columnName].parent);
            const columnParentGroupCount = +this.columns[this.columns[columnName].parent].columnGroup - 1;
            if (i === (columnNumberParent + columnParentGroupCount)) {
              columnItem.columnGroupEnd = true;
            }
            columnsTable.push(columnItem);
          } else {
            columnsTable.push(columnItem);
          }
        } else {
          columnsTable.push(columnItem);
        }
      }
      console.log(columnsTable);
      return columnsTable;
    },
  },
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: grid;
  grid-template-areas: "control-top" "table";
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr;
  max-width: 100%;

  // border: thin solid red;
  &-control-top {
    grid-area: control-top;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5px;
    .item {
      width: 100px;
      padding-right: 20px;
      &_btn {
        align-self: center;
      }
    }
    // border: thin solid green;
  }
  &-table {
    grid-area: table;
    padding: 5px;
    width: calc(100vw - 0px);
    height: calc(100vh - 126px);
    // border: thin solid black;
  }

  .dialog {
    height: calc(100vh - 65px);
    z-index: 9999;
    &__item {
      padding: 20px;
      height: calc(100vh - 65px);
    }
  }
}
</style>
