<template>
  <div :key="`body-row-${source.value}`"
       class="sheet-body__row"
       :style="[{
         'grid-template-columns': `
         repeat(${cRowLevelGroupMax}, minmax(20px, 20px))
         60px
         ${cTemplateRowBody}`,
         'grid-template-rows': `${(source.height) ? source.height : '22'}px`,
       }]">
    <div v-for="level in cRowLevelGroupMax"
        :key="`${source.value}-${level}`"
        class="column column-group"
        :style="getStyleGroup(level)">
        <spread-sheet-btn-group v-if="isRowGroupLevel(source, level)">mdi-plus-box-outline</spread-sheet-btn-group>
    </div>
    <div class="column column-title"
        :style="shiftTitle">{{ source.value }}</div>
    <!-- <template v-for="(column, columnIndex) in columns">
      <div v-if="!excludedCells.has(`${column.name}${source.value}`)"
          :key="`body-${source.value}-${column.value}`"
          class="column column-body"
          :class="(cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].style : ''"
          :style="getCellGeometry(source, index, column, columnIndex)">
        {{ (cells[`${column.name}${source.value}`]) ? cells[`${column.name}${source.value}`].value : '' }}
      </div>
    </template> -->
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
    extraProps: {
      type: Object,
      default() {
        return {
          columns: [],
          cells: {},
          // templateRowBody: '',
          shiftTitle: {},
          excludedCells: [],
          rowLevelGroupMax: 0,
        };
      },
    },
    rows: Array,
    rowLevelGroupMax: Number,
    templateRowBody: String,
  },
  data() {
    return {
      cRows: this.rows,
      columns: this.extraProps.columns,
      cells: this.extraProps.cells,
      cTemplateRowBody: this.templateRowBody,
      shiftTitle: this.extraProps.shiftTitle,
      excludedCells: this.extraProps.excludedCells,
      cRowLevelGroupMax: this.rowLevelGroupMax,
    };
  },
  computed: {
    // cTemplateRowBody() {
    //   console.log(this.templateRowBody);
    //   return this.templateRowBody;
    // },
  },
  methods: {
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
        currentRow = this.cRows.find((item) => item.value === currentRow.parent);
      }
      return level;
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
      // border-left: thin solid grey;
      // border-bottom: thin solid grey;
      box-shadow: inset -1px 0px 0px grey, inset 0px -1px 0px grey;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
