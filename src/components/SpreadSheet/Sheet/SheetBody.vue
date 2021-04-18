<template>
  <table class="sheet-body" @click="eventClickBody">
    <!-- <v-virtual-scroll :items="rows" item-height="24">
      <template v-slot:default="{ item }"> -->
      <tr v-for="(item, index) in rows"
          :key="item.value"
          class="sheet-body__row">
        <th v-for="level in rowLevelGroupMax"
            :key="`${item.value}-${level}`"
            class="column column-group"
            :class="{'line': (item.parent) && getRowLevel(item) >= level }"
            :style="getStyleGroup(level)">
          <spread-sheet-btn-group v-if="isRowGroupLevel(item, level)"
                                  :data-row-index="index"
                                  :data-row-parent="item.value"
                                  :data-row-count="item.rowGroup - 1"
                                  data-row-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
        </th>
        <th class="column column-title"
            :style="getStyleTitle(item.value)">{{ item.value }}</th>
        <template v-for="column in columns">
          <td v-if="!excludedCells.has(`${getColumnTitle(column.value)}${item.value}`)"
            :key="`body-${item.value}-${column.value}`"
            class="column column-body"
            :class="getStyleContent(item.value, column.value)"
            :style="getStyleGeometry(item.value, column.value)"
            :colspan="getCellColspan(item.value, column.value)"
            :rowspan="getCellRowspan(item.value, column.value)">{{ getCellValue(item.value, column.value) }}</td>
        </template>
      </tr>
      <!-- </template> -->
    <!-- </v-virtual-scroll> -->
    
  </table>
</template>

<script>
import SheetComponent from './SheetComponent';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetBody',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SheetComponent,
  ],
  props: {
    rows: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    rowLevelGroupMax: { type: Number, default: 0 },
  },
  data() {
    return {
      excludedCells: new Set(),

      currentSelectedCell: null,
    };
  },
  computed: {
    // widthHead() {
    //   return {
    //     'max-width': `${60 + (20 * 3)}px`,
    //   };
    // },
  },
  methods: {
    eventClickBody(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').getAttribute('data-row-parent')) {
        this.toggleRowGroup(evt.target.closest('button'));
        return true;
      }
      this.selectedCell(evt);
      return true;
    },
    toggleRowGroup(target) {
      this.$emit('toggle-row-group', {
        value: +target.getAttribute('data-row-parent'),
        index: +target.getAttribute('data-row-index'),
        count: +target.getAttribute('data-row-count'),
        status: target.getAttribute('data-row-status'),
        target,
      });
    },
    selectedCell(evt) {
      if (!evt.target.closest('.column-body')) return;
      if (this.currentSelectedCell === evt.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('selected');
      evt.target.classList.add('selected');
      this.currentSelectedCell = evt.target;
    },
    isRowGroupLevel(row, level) {
      if (!Object.keys(row).includes('rowGroup')) return false;
      return (level === this.getRowLevel(row) + 1);
    },
    getRowLevel(row) {
      let level = 0;
      let currentRow = row;
      let condition = true;
      while (condition) {
        if (!currentRow) { condition = false; return level; }
        if (!Object.keys(currentRow).includes('parent')) { condition = false; return level; }
        level += 1;
        currentRow = this.rows.find((item) => item.value === currentRow.parent);
      }
      return level;
    },
    getStyleGroup(level) {
      return {
        left: `${20 * (+level - 1)}px`,
      };
    },
    getStyleTitle() {
      return {
        left: `${20 * this.rowLevelGroupMax}px`,
      };
    },
    getStyleContent(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].style) return {};
      return this.cells[cellName].style;
    },
    getStyleGeometry(row, column) {
      return {
        ...this.getRowHeight(row),
        ...this.getColumnWidth(column),
      };
    },
    getCellValue(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName]) return '';
      return this.cells[cellName].value;
    },
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
    getColumnWidth(columnNumber) {
      const column = this.columns.find((item) => item.value === columnNumber);
      return {
        'max-width': `${column.width}px`,
        'min-width': `${column.width}px`,
      };
    },
    getRowHeight(rowNumber) {
      const row = this.rows.find((item) => item.value === rowNumber);
      return {
        height: `${row.height}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sheet-body {
  display: table;
  position: relative;
  border-collapse: collapse;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  &__row {
    display: table-row;
    .column {
      display: table-cell;
      position: relative;
      height: 24px;

      &-group, &-title {
        position: sticky;
        background-color: #dadce0;
        font-size: 0.75em;
        color: rgba(0, 0, 0, 0.6);
      }

      &-group {
        min-width: 20px;
        z-index: 500;
        &:first-child {
          box-shadow:  inset 1px 0px 0px grey;
        }
      }

      &-title {
        box-shadow:  inset 1px 0px 0px grey, inset -1px 0px 0px grey, 0px -1px 0px grey;
        border-top: 0px;
        min-width: 60px;
        z-index: 400;
      }
      &-body {
        padding: 0px 2px;
        min-width: 94px;
        max-width: 94px;
        box-shadow: 1px 0px 0px grey, inset 0px -1px 0px grey;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .line {
      &::before {
        content: '';
        position: absolute;
        // left: 11px;
        border-left: thin solid #3F3F3F;
        background-color: #3F3F3F;
        width: 0px;
        height: 100%;
        top: 0px;
      }
    }
    .selected::before {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      box-shadow: inset -1px -2px 0px #1a73e8, inset 2px 1px 0px #1a73e8;
      // border: 2px solid #1a73e8;
      // box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
    }
  }
}
</style>
