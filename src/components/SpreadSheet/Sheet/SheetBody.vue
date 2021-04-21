<template>
  <!-- <div class="sheet-body" @click="eventClickBody"> -->
    <RecycleScroller :items="rows"
                     :item-size="null"
                     sizeField="height"
                     key-field="value"
                     v-slot="{ item, index }"
                     class="sheet-body">
        <div :key="`body-row-${item.value}`"
            class="sheet-body__row"
            :style="[{
              'grid-template-columns': `
              repeat(${rowLevelGroupMax}, minmax(20px, 20px))
              60px
              ${templateRowBody}`,
              'grid-template-rows': `${(item.height) ? item.height : '22'}px`,
            }]">
          <div v-for="level in rowLevelGroupMax"
              :key="`${item.value}-${level}`"
              class="column column-group"
              :style="getStyleGroup(level)">
              <spread-sheet-btn-group v-if="isRowGroupLevel(item, level)">mdi-plus-box-outline</spread-sheet-btn-group>
          </div>
          <div class="column column-title"
              :style="shiftTitle">{{ item.value }}</div>
          <template v-for="(column, columnIndex) in columns">
            <div v-if="!excludedCells.has(`${column.name}${item.value}`)"
                :key="`body-${item.value}-${column.value}`"
                class="column column-body"
                :class="(cells[`${column.name}${item.value}`]) ? cells[`${column.name}${item.value}`].style : ''"
                :style="getCellGeometry(item, index, column, columnIndex)">
              {{ (cells[`${column.name}${item.value}`]) ? cells[`${column.name}${item.value}`].value : '' }}
            </div>
          </template>
        </div>
    </RecycleScroller>
    <!-- <div v-for="(row, rowIndex) in rows"
         :key="`body-row-${row.value}`"
         class="sheet-body__row"
         :style="[{
           'grid-template-columns': `
           repeat(${rowLevelGroupMax}, minmax(20px, 20px))
           60px
           repeat(${columns.length}, auto)`
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
    </div> -->

    <!-- <v-virtual-scroll :items="rows" item-height="24">
      <template v-slot:default="{ item }"> -->
      <!-- <div v-for="(item, index) in rows"
          :key="item.value"
          class="sheet-body__row">
        <div v-for="level in rowLevelGroupMax"
            :key="`${item.value}-${level}`"
            class="column column-group"
            :class="{'line': (item.parent) && getRowLevel(item) >= level }"
            :style="getStyleGroup(level)">
          <spread-sheet-btn-group v-if="isRowGroupLevel(item, level)"
                                  :data-row-index="index"
                                  :data-row-parent="item.value"
                                  :data-row-count="item.rowGroup - 1"
                                  data-row-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
        </div>
        <div class="column column-title"
            :style="getStyleTitle(item.value)">{{ item.value }}</div> -->
        <!-- <template v-for="column in columns">
          <div v-if="!excludedCells.has(`${getColumnTitle(column.value)}${item.value}`)"
            :key="`body-${item.value}-${column.value}`"
            class="column column-body"
            :class="getStyleContent(item.value, column.value)"
            :style="getStyleGeometry(item.value, column.value)"
            :colspan="getCellColspan(item.value, column.value)"
            :rowspan="getCellRowspan(item.value, column.value)">{{ getCellValue(item.value, column.value) }}</div>
        </template> -->
      <!-- </template> -->
    <!-- </v-virtual-scroll> -->
  <!-- </div> -->
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
    // columnsName: { type: Array, default() { return []; } },
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
  computed: {
    templateRowBody() {
      let templateRowBody = '';
      for (let i = 0; i < this.columns.length - 1; i += 1) {
        templateRowBody += `${this.columns[i].width || 94}px `;
      }
      console.log(templateRowBody);
      return templateRowBody;
    },
    // widthHead() {
    //   return {
    //     'max-width': `${60 + (20 * 3)}px`,
    //   };
    // },
  },
  mounted() {
    console.log(this.rows);
    console.log(this.columns);
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
    // getStyleTitle() {
    //   return {
    //     left: `${20 * this.rowLevelGroupMax}px`,
    //   };
    // },
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
      cellGeometry['grid-column-start'] = columnIndex + this.rowLevelGroupMax + 2;
      cellGeometry['grid-column-end'] = (columnIndex + this.rowLevelGroupMax + 2) + 1;

      let cellHeight = row.height || null;
      if (this.cells[`${column.name}${row.value}`]
        && this.cells[`${column.name}${row.value}`].rowspan) {
        const { rowspan } = { ...this.cells[`${column.name}${row.value}`] };
        for (let i = 1; i < rowspan - 1; i += 1) {
          cellHeight += this.rows[rowIndex + i].height || 22;
          this.excludedCells.add(`${column.name}${row.value + i}`);
        }
        cellGeometry['z-index'] = 1;
      }
      cellGeometry.height = `${cellHeight}px` || '';
      cellGeometry.width = `${cellWidth}px` || '';

      return cellGeometry;
    },

    // getStyleGeometry(row, column) {
    //   return {
    //     // ...this.getRowHeight(row),
    //     ...this.getColumnWidth(column),
    //   };
    // },
    // getCellValue(row, column) {
    //   const cellName = `${this.getColumnTitle(column)}${row}`;
    //   if (!this.cells[cellName]) return '';
    //   return this.cells[cellName].value;
    // },
    // getCellColspan(row, column) {
    //   const cellName = `${this.getColumnTitle(column)}${row}`;
    //   if (!this.cells[cellName] || !this.cells[cellName].colspan) return '';
    //   for (let i = 1; i < this.cells[cellName].colspan; i += 1) {
    //     this.excludedCells.add(`${this.getColumnTitle(column + i)}${row}`);
    //   }
    //   return this.cells[cellName].colspan;
    // },
    // getCellRowspan(row, column) {
    //   const columnChar = this.getColumnTitle(column);
    //   const cellName = `${columnChar}${row}`;
    //   if (!this.cells[cellName] || !this.cells[cellName].rowspan) return '';
    //   for (let i = 1; i < this.cells[cellName].rowspan; i += 1) {
    //     this.excludedCells.add(`${columnChar}${row + i}`);
    //     if (Object.keys(this.cells[cellName]).includes('colspan')) {
    //       for (let j = 1; j < this.cells[cellName].colspan; j += 1) {
    //         this.excludedCells.add(`${this.getColumnTitle(column + j)}${row + i}`);
    //       }
    //     }
    //   }
    //   return this.cells[cellName].rowspan;
    // },
    // getColumnWidth(columnNumber) {
    //   const column = this.columns.find((item) => item.value === columnNumber);
    //   return {
    //     // 'max-width': `${column.width}px`,
    //     // 'min-width': `${column.width}px`,
    //     width: `${column.width}px`,
    //   };
    // },
    // getRowHeight(rowNumber) {
    //   const row = this.rows.find((item) => item.value === rowNumber);
    //   return {
    //     height: `${row.height}px`,
    //   };
    // },
  },
};
</script>

<style lang="scss" scoped>
@import './SheetBody.scss';
.sheet-body {
  position: relative;
  display: block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  height: calc(100vh - 210px);
  &::-webkit-scrollbar {
    position: sticky;
    display: block;
    left: 0px;
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }
  &__row {
    position: relative;
    display: grid;
    grid-auto-rows: minmax(22px, 22px);
    .column {
      display: inline-flex;
      align-items: center;
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
      // box-shadow: inset -1px -2px 0px #1a73e8, inset 2px 1px 0px #1a73e8;
      border: 1px solid #1a73e8;
      border-bottom: 2px solid #1a73e8;
      border-right: 2px solid #1a73e8;
      // z-index: 9999;
      // box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
    }
  }
}
</style>
