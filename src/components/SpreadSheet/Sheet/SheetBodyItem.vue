<template>
  <div :key="`body-row-${source.value}`"
       class="sheet-body__row"
       :style="[{
         'grid-template-columns': `
         repeat(${rowLevelGroupMax}, minmax(20px, 20px))
         60px
         ${templateRowBody}`,
         'grid-template-rows': `${(source.height) ? source.height : '22'}px`,
       }]">
    <div v-for="level in rowLevelGroupMax"
        :key="`${source.value}-${level}`"
        class="column column-group"
        :class="{'column-stop': (source.value === 1)}"
        :style="getStyleGroup(level)">
        <spread-sheet-btn-group v-if="isRowGroupLevel(source, level)"
                                :data-row-index="index"
                                :data-row-parent="source.value"
                                :data-row-count="source.rowGroup - 1"
                                data-row-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
    </div>
    <div class="column column-title"
        :style="shiftTitle">{{ source.value }}</div>
    <template v-for="(column, columnIndex) in columns">
      <div v-if="!excludedCells.has(`${column.name}${source.value}`)"
          :key="`body-${source.value}-${column.value}`"
          class="column column-body"
          :class="(cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].style : ''"
          :style="getCellGeometry(source, index, column, columnIndex)">
        {{ (cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].value : '' }}
      </div>
    </template>
  </div>
</template>

<script>
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetBodyItem',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    index: { type: Number },
    source: { type: Object, default() { return {}; } },
    
    rows: Array,
    columns: Array,
    cells: Object,
    shiftTitle: Object,
    excludedCells: Set,
    rowLevelGroupMax: Number,
    templateRowBody: String,
  },
  data() {
    return {
      // cRows: this.rows,
      // columns: this.extraProps.columns,
      // cells: this.extraProps.cells,
      // cTemplateRowBody: this.templateRowBody,
      // shiftTitle: this.extraProps.shiftTitle,
      // excludedCells: this.extraProps.excludedCells,
      // cRowLevelGroupMax: this.rowLevelGroupMax,
    };
  },
  computed: {
    // cTemplateRowBody() {
    //   console.log(this.templateRowBody);
    //   return this.templateRowBody;
    // },
  },
  methods: {
    eventClickRow(evt) {
      this.$emit('toggleGroup', evt);
    },
    getStyleGroup(level) {
      return {
        left: `${20 * (+level - 1)}px`,
      };
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
    getCellGeometry(row, rowIndex, column, columnIndex) {
      const cellGeometry = {};
      let cellWidth = column.width || null;
      if (this.cells[`${column.name}${row.value}`]
        && this.cells[`${column.name}${row.value}`].colspan) {
        const { colspan } = { ...this.cells[`${column.name}${row.value}`] };
        for (let i = 1; i < colspan; i += 1) {
          cellWidth += this.columns[columnIndex + i].width || 94;
          // this.excludedCells.add(`${this.columns[columnIndex + i].name}${row.value}`);
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
          // this.excludedCells.add(`${column.name}${row.value + i}`);
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
.sheet-body__row {
  position: relative;
  display: grid;
  grid-auto-rows: minmax(22px, 22px);
  .column {
    display: inline-flex;
    align-items: center;
    background-color: white;
    &-stop {
      position: sticky;
      top: 0px;
    }
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
      border: thin solid grey;
      // box-shadow:  inset 1px 0px 0px grey, inset -1px 0px 0px grey, 0px -1px 0px grey;
      border-top: 0px;
      width: 60px;
      z-index: 400;
    }
    &-body {
      position: relative;
      padding: 0px 2px;
      width: 94px;
      border-right: thin solid grey;
      border-bottom: thin solid grey;
      // box-shadow: inset -1px 0px 0px grey, inset 0px -1px 0px grey;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
