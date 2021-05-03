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
        <!-- <spread-sheet-body-static v-if="printMode"
                                  :rows="tableRows"
                                  :columns="tableColumns"
                                  :cells="tableCells"
                                  :templateTableWidth="templateTableWidth"
                                  :templateColumnWidth="templateColumnWidth"
                                  :maxLevelGroupRow="maxLevelGroupRow"
                                  :setExcludedCells="setExcludedCells"
                                  :print-mode="printMode"></spread-sheet-body-static> -->
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
                          @toggle-row-group="toggleRowGroup"
                          @scroll-body-x="scrollBodyX"></spread-sheet-body>
      </div>
    </div>
  </div>
</template>

<script>
import SpreadSheetHead from './components/SpreadSheetHead.vue';
import SpreadSheetBody from './components/SpreadSheetBody.vue';
// import SpreadSheetBodyStatic from './components/SpreadSheetBodyPrint.vue';

import {
  CELL_HEIGHT,
  CELL_WIDTH_LEFT_TITLE,
  CELL_WIDTH_LEFT_GROUP,
} from './SpreadSheetConst';

export default {
  name: 'SpreadSheet',
  components: {
    SpreadSheetHead,
    SpreadSheetBody,
    // SpreadSheetBodyStatic,
  },
  props: {
    columns: { type: Array, default() { return []; } },
    rows: { type: Array, default() { return []; } },
    rowsFixed: { type: Array, default() { return []; } },
    cells: { type: Object, default() { return {}; } },
    maxLevelGroupRow: { type: Number, default: 0 },
    maxLevelGroupColumn: { type: Number, default: 0 },
    printMode: { type: Boolean, default: false },
  },
  data() {
    return {
      setOpenGroupColumns: [],
      setOpenGroupRows: [],
      setExcludedCells: {},
      // maxLevelGroupRow: this.getMaxLevelGroupRow(),
      // maxLevelGroupColumn: this.getMaxLevelGroupColumn(),
    };
  },
  computed: {
    tableColumns() {
      return this.columns.filter((column) => this.setOpenGroupColumns.includes(column.parent) || !column.parent);
    },
    tableRows() {
      // console.log(this.rows.filter((row) => this.setOpenGroupRows.includes(+row.parent) || !row.parent));
      return this.rows.filter((row) => this.setOpenGroupRows.includes(+row.parent) || !row.parent);
    },
    tableRowsFixed() {
      return this.rowsFixed;
    },
    tableCells() {
      return this.cells;
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
  methods: {
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
      this.rows.filter((row) => (+row.parent === rowParent && row.rowGroup)).forEach((item) => {
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
      this.columns.filter((column) => (column.parent === columnParent && column.columnGroup)).forEach((item) => {
        if (this.setOpenGroupColumns.findIndex((element) => element === item.name) > -1) {
          this.setOpenGroupColumns.splice(this.setOpenGroupColumns.findIndex((element) => element === item.name), 1);
        }
        this.recursiveClosingRowGroup(item.name);
      });
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
