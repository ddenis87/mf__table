<template>
  <tbody>
    <tr v-for="i in rowCount"
        :key="`body-row-${i}`"
        class="body-row"
        :class="{'hidden': excludedRow.has(`${i}`)}"
        :data-row-parent="(excludedRow.has(`${i}`) ? getRowParent(i) : '0')">
      <spread-sheet-body-cell-group :isRowsGroup="isRowsGroup"
                                    :isRowGroup="isRowGroup(i)"
                                    :row="i"></spread-sheet-body-cell-group>
      <!-- <td v-if="isRowsGroup"
          class="body-row__column body-row__column-group"
          >
        <spread-sheet-btn-group v-if="isRowGroup(i)"
                                :data-row-group-parent="i"
                                data-row-group-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
      </td> -->
      <td class="body-row__column body-row__column-title"
          :style="shiftTitleRow">{{ i }}</td>

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

export default {
  name: 'SpreadSheetBody',
  components: {
    SpreadSheetBodyCellGroup,
  },
  mixins: [
    SpreadSheet,
  ],
  props: {
    rowCount: { type: Number, default: 1 },
    rows: { type: Object },
    columnCount: { type: Number, default: 10 },
    columns: { type: Object },
    cells: { type: Object },

    shiftTitleRow: { type: Object, default() { return { left: '0px' }; } },
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
    getRowParent(rowNumber) {
      return this.rows[rowNumber].parent;
    },
    isRowGroup(rowNumber) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].rowGroup) return false;
      for (let i = 1; i < this.rows[rowNumber].rowGroup; i += 1) {
        this.excludedRow.add(`${rowNumber + i}`);
      }
      return true;
    },
    eventClickBody(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').hasAttribute('data-row-group-parent')) {
        this.toggleRowGroup(evt.target.closest('button'));
      }
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
      border-left: thin solid grey;
      border-bottom: thin solid grey;
      z-index: 50;
      &-group {
        position: sticky;
        left: 0px;
        background-color: #dadce0;
        border-bottom: 0;
        box-shadow: -1px 0px 0 grey, 0px 0px 0 grey;
        text-align: center;
        z-index: 60;
      }
      &-title {
        position: sticky;
        left: 0px;
        border-left: 0px;
        box-shadow: inset 1px 0px 0 grey, 1px 0px 0 grey;
        text-align: center;
        font-size: 0.75em;
        font-weight: bold;
        background-color: #dadce0;
        color: rgba(0, 0, 0, 0.5);
        z-index: 70;
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
