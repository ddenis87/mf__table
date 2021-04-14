<template>
  <table class="spread-sheet-body">
    <template v-for="row in rowCount">
      <tr v-if="!rowExcluded.has(row)"
          :key="row"
          class="spread-sheet-body__row">
        <template v-for="column in columnCount">
          <td v-if="!excludedCells.has(`${getColumnTitle(column)}${row}`) && !columnExcluded.has(column)"
              :key="column"
              class="spread-sheet-body__column"
              :class="getCellStyle(row, column)"
              :style="getCellGeometry(row, column)"
              :colspan="getColspan(row, column)"
              :rowspan="getRowspan(row, column)">
            {{ getValue(row, column) }}
          </td>
        </template>
      </tr>
    </template>
    
  </table>
</template>

<script>
import SpreadSheet from './SpreadSheet';

export default {
  name: 'SpreadSheetBody',
  mixins: [
    SpreadSheet,
  ],
  props: {
    rowCount: { type: Number, default: 100 },
    rowExcluded: { type: Set, default() { return new Set(); } },
    rows: { type: Object },
    columnCount: { type: Number, default: 25 },
    columnExcluded: { type: Set, default() { return new Set(); } },
    columns: { type: Object },
    cells: { type: Object },
    setCharacter: { type: Array },
  },
  data() {
    return {
      excludedCells: new Set(),
    };
  },
  methods: {
    getValue(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName]) return '';
      return this.cells[cellName].value;
    },
    getColspan(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].colspan) return '';
      for (let i = 1; i < this.cells[cellName].colspan; i += 1) {
        this.excludedCells.add(`${this.getColumnTitle(column + i)}${row}`);
      }
      return this.cells[cellName].colspan;
    },
    getRowspan(row, column) {
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
    getCellStyle(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].style) return {};
      return this.cells[cellName].style;
    },
    getCellGeometry(row, column) {
      return {
        ...this.getRowHeight(row),
        ...this.getColumnWidth(column),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-body {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  // font-size: 0.75em;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  &__row {
    .spread-sheet-body__column {
      position: relative;
      min-width: 94px;
      height: 24px;
      border-right: thin solid grey;
      border-bottom: thin solid grey;
      font-size: 0.875em;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
