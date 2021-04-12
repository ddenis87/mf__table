<template>
  <tbody>
    <tr v-for="i in rowCount"
        :key="`body-row-${i}`"
        class="body-row"
        :class="{'hidden': excludedRow.has(`${i}`)}"
        :data-row-parent="(excludedRow.has(`${i}`) ? getRowParent(i) : '0')"
        :data-row-count-group="getRowCountGroup(i)">
      <spread-sheet-body-cell-group v-for="level in currentTableLevel"
                                    :key="level"
                                    :isRowGroup="isRowGroup(i, level)"
                                    :current-row="i"
                                    :current-level="level"></spread-sheet-body-cell-group>

      <spread-sheet-body-cell-title :row="i"
                                    :current-table-level="currentTableLevel" ></spread-sheet-body-cell-title>

      <template v-for="j in columnCount">
        <td v-if="(!excludedCells.has(`${getColumnTitle(j)}${i}`))"
            :key="`body-row__column-${j}`"
            class="body-row__column"
            :colspan="getCellColspan(i, j)"
            :rowspan="getCellRowspan(i, j)"
            :class="[{'hidden': excludedColumns.has(`${j}`)}, getCellStyle(i, j)]"
            :data-column-parent="(excludedColumns.has(`${j}`) ? getColumnParent(j) : '0')">
          {{ getCellValue(i, j) }}
        </td>
      </template>
    </tr>
  </tbody>
</template>

<script>
import SpreadSheet from '../SpreadSheet';
import SpreadSheetBodyCellGroup from './SpreadSheetBodyCellGroup.vue';
import SpreadSheetBodyCellTitle from './SpreadSheetBodyCellTitle.vue';

export default {
  name: 'SpreadSheetBody',
  components: {
    SpreadSheetBodyCellGroup,
    SpreadSheetBodyCellTitle,
  },
  mixins: [
    SpreadSheet,
  ],
  props: {
    currentTableLevel: { type: Number, default: 0 },

    rowCount: { type: Number, default: 1 },
    rows: { type: Object },
    rowGroupLevel: { type: Number, default: 1 },
    columnCount: { type: Number, default: 10 },
    columns: { type: Object },
    cells: { type: Object },

    // shiftTitleRow: { type: Object, default() { return { left: '0px' }; } },
    isRowsGroup: { type: Boolean, default: false },
  },
  data() {
    return {
      excludedRow: new Set(),
      excludedCells: new Set(),
    };
  },
  methods: {
    getCellColspan(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].colspan) return '';
      for (let i = 1; i < this.cells[cellName].colspan; i += 1) {
        this.excludedCells.add(`${this.getColumnTitle(column + i)}${row}`);
      }
      return this.cells[cellName].colspan;
    },
    getCellRowspan(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].rowspan) return '';
      for (let i = 1; i < this.cells[cellName].rowspan; i += 1) {
        this.excludedCells.add(`${this.getColumnTitle(column)}${row + i}`);
        if (Object.keys(this.cells[cellName]).includes('colspan')) {
          for (let j = 1; j < this.cells[cellName].colspan; j += 1) {
            this.excludedCells.add(`${this.getColumnTitle(column + j)}${row + i}`);
          }
        }
      }
      return this.cells[cellName].rowspan;
    },
    getCellValue(row, column) {
      this.isColumnGroup(column);
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName]) return '';
      return this.cells[cellName].value;
    },
    getCellStyle(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].style) return {};
      return this.cells[cellName].style;
    },
    getRowCountGroup(rowNumber) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].rowGroup) return 0;
      return this.rows[rowNumber].rowGroup;
    },
    getRowParent(rowNumber) {
      return this.rows[rowNumber].parent;
    },
    isRowGroup(rowNumber, level) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].rowGroup) return false;
      for (let i = 1; i < this.rows[rowNumber].rowGroup; i += 1) {
        this.excludedRow.add(`${rowNumber + i}`);
      }
      return (level === this.getLevelRow(rowNumber));
    },
    // isRowGroup(rowNumber) {
    //   if (!this.rows[rowNumber] || !this.rows[rowNumber].rowGroup) return false;
    //   for (let i = 1; i < this.rows[rowNumber].rowGroup; i += 1) {
    //     this.excludedRow.add(`${rowNumber + i}`);
    //   }
    //   return true;
    // },
    getLevelRow(rowNumber) {
      let level = 1;
      let currentRow = rowNumber;
      let condition = true;

      while (condition) {
        if (!this.rows[currentRow]?.parent) { condition = false; return level; }
        level += 1;
        currentRow = this.rows[currentRow].parent;
      }
      return level;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../SpreadSheet.scss';

tbody {
  position: relative;
  .body-row {
    height: 24px;
    &__column {
      position: relative;
      padding: 0px 3px;
      border-left: thin solid grey;
      border-bottom: thin solid grey;
      z-index: 50;
      &:first-child {
        border-left: thin solid grey;
      }
      &:last-child {
        border-right: thin solid grey;
      }

      &_selected::after {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        border: 2px solid #1a73e8;
      }
    }
    .hidden { display: none; }
  }
  .hidden { display: none; }
}
</style>
