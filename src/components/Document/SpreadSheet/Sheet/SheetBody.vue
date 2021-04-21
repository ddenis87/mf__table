<template>
  <div class="sheet-body" @click="eventClickBody">
        
    <div v-for="(row, rowIndex) in rows"
         :key="`body-row-${row.value}`"
         class="sheet-body__row"
         :style="[{
           'grid-template-columns': `
           repeat(${rowLevelGroupMax}, minmax(20px, 20px))
           60px
           repeat(${columns.length}, auto)`,
           'grid-template-rows': `${(row.height) ? row.height : '22'}px`,
         }]">
      <div v-for="level in rowLevelGroupMax"
           :key="`${row.value}-${level}`"
           class="column column-group"
           :style="getStyleGroup(level)">
          <spread-sheet-btn-group v-if="isRowGroupLevel(row, level)">mdi-plus-box-outline</spread-sheet-btn-group>
      </div>
      <div class="column column-title"
           :style="shiftTitle">{{ row.value }}</div>
      <template v-for="(column, columnIndex) in columns">
        <div v-if="!excludedCells.has(`${column.name}${row.value}`)"
             :key="`body-${row.value}-${column.value}`"
             class="column column-body"
             :class="(cells[`${column.name}${row.value}`]) ? cells[`${column.name}${row.value}`].style : ''"
             :style="getCellGeometry(row, rowIndex, column, columnIndex)">
          {{ (cells[`${column.name}${row.value}`]) ? cells[`${column.name}${row.value}`].value : '' }}
        </div>
      </template>
    </div>
  </div>
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
    rowsCount: { type: Number, default: 0 },
    rows: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    rowLevelGroupMax: { type: Number, default: 0 },
  },
  data() {
    return {
      excludedCells: new Set(),
      currentSelectedCell: null,
      shiftTitle: { left: `${20 * this.rowLevelGroupMax}px` },
    };
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
    getStyleContent(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].style) return {};
      return this.cells[cellName].style;
    },
    getCellGeometry(row, rowIndex, column, columnIndex) {
      const cellGeometry = {};
      let cellWidth = column.width || null;
      if (this.cells[`${column.name}${row.value}`]
        && this.cells[`${column.name}${row.value}`].colspan) {
        const { colspan } = { ...this.cells[`${column.name}${row.value}`] };
        for (let i = 1; i < colspan; i += 1) {
          cellWidth += this.columns[columnIndex + i].width || 94;
          this.excludedCells.add(`${this.columns[columnIndex + i].name}${row.value}`);
        }
        cellGeometry['grid-column-start'] = columnIndex + this.rowLevelGroupMax + 2;
        cellGeometry['grid-column-end'] = (columnIndex + this.rowLevelGroupMax + 2) + colspan;
      }

      let cellHeight = row.height || null;
      if (this.cells[`${column.name}${row.value}`]
        && this.cells[`${column.name}${row.value}`].rowspan) {
        const { rowspan } = { ...this.cells[`${column.name}${row.value}`] };
        for (let i = 1; i < rowspan - 1; i += 1) {
          cellHeight += this.rows[rowIndex + i].height || 22;
        }
        cellGeometry['z-index'] = 1;
      }
      cellGeometry.height = `${cellHeight}px` || '';
      cellGeometry.width = `${cellWidth}px` || '';
      return cellGeometry;
    },
  },
};
</script>

<style lang="scss" scoped>
.sheet-body {
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  .scroller {
    height: calc(100vh - 210px);
    width: calc(100vw - 18px);
  }
  &__row {
    position: relative;
    display: grid;
    grid-auto-rows: minmax(22px, 22px);
    .column {
      display: inline-flex;
      align-items: center;
      height: 100%;
      background-color: white;
      &-group, &-title {
        position: sticky;
        background-color: #dadce0;
        justify-content: center;
        
        font-size: 0.75em;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.6);
      }

      &-group {
        left: 0px;
        width: 20px;
        z-index: 500;
        &:first-child {
          box-shadow:  inset 1px 0px 0px grey;
        }
      }

      &-title {
        box-shadow:  inset 1px 0px 0px grey, inset -1px 0px 0px grey, 0px -1px 0px grey;
        border-top: 0px;
        width: 60px;
        z-index: 400;
      }
      &-body {
        position: relative;
        padding: 0px 2px;
        width: 94px;
        // border-left: thin solid grey;
        // border-bottom: thin solid grey;
        box-shadow: inset -1px 0px 0px grey, inset 0px -1px 0px grey;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
      }
      
    }
    .line {
      &::before {
        content: '';
        position: absolute;
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
      border: 1px solid #1a73e8;
      border-bottom: 2px solid #1a73e8;
      border-right: 2px solid #1a73e8;
    }
  }
}
</style>
