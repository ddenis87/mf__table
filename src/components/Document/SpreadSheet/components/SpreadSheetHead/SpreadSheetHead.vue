<template>
  <thead>
    <tr v-if="isColumnsGroup"
        class="head-row">
      <th v-if="isRowsGroup"
          class="head-row__column head-row__column-group-row"
          :style="styleColumnGroupRow"></th>
      <th class="head-row__column head-row__column-group-title"
          :style="shiftTitle"></th>
      <template v-for="i in columnCount">
        <th :key="`head-row__column-group-${i}`"
            class="head-row__column head-row__column-group"
            :class="{'hidden': excludedColumns.has(`${i}`)}"
            :style="getStyleColumnGroup(i)"
            :data-column-parent="(excludedColumns.has(`${i}`) ? getColumnParent(i) : '0')">
          <spread-sheet-btn-group v-if="isColumnGroup(i)"
                                  :data-column-group-parent="getColumnTitle(i)"
                                  data-column-group-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
        </th>
      </template>

    </tr>
    <tr class="head-row">
      <th v-if="isRowsGroup"
          class="head-row__column head-row__column-row"
          :style="styleColumnGroupRow"></th>
      <th class="head-row__column head-row__column-title"
          :style="shiftTitle"></th>
      <template v-for="i in columnCount">
        <th :key="`head-row__column-${i}`"
            class="head-row__column"
            :class="{'hidden': excludedColumns.has(`${i}`)}"
            :style="getStyleColumn(i)"
            :data-column-parent="(excludedColumns.has(`${i}`) ? getColumnParent(i) : '0')">
          {{ getColumnTitle(i).toUpperCase() }}
        </th>
      </template>
    </tr>
  </thead>
</template>

<script>
import SpreadSheet from '../SpreadSheet';

import SpreadSheetBtnGroup from '../SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetHead',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SpreadSheet,
  ],
  props: {
    isRowsGroup: { type: Boolean, default: false },
    columnCount: { type: Number, default: 10 },
    columns: { type: Object },
    rowGroupLevel: { type: Number, default: 0 },

    shiftTitle: { type: Object, default() { return { left: '0px' }; } },
  },
  computed: {
    isColumnsGroup() {
      return Object.values(this.columns).find((item) => Object.keys(item).includes('columnGroup')) || false;
    },
    styleColumnGroupRow() {
      return {
        'max-width': this.shiftTitle.left,
        'min-width': this.shiftTitle.left,
      };
    },
    styleColumnTitle() {
      return { left: `${25 * this.rowGroupLevel * (this.isRowsGroup) ? 1 : 0}px` };
    },
  },
  methods: {
    getStyleColumnGroup(columnNumber) {
      return { ...this.getWidthColumn(columnNumber) };
    },
    getStyleColumn(columnNumber) {
      return { ...this.getWidthColumn(columnNumber) };
      // if (columnNumber) return { top: '22px', ...this.getWidthColumn(columnNumber), ...this.styleColumnTitle };
      // return { top: '22px', ...this.styleColumnTitle };
    },
    getShiftTitle() {

    },
    getWidthColumn(columnNumber) {
      const name = this.getColumnTitle(columnNumber);
      if (!this.columns[name] || !this.columns[name].width) return {};
      return {
        'max-width': `${this.columns[name].width}px`,
        'min-width': `${this.columns[name].width}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../SpreadSheet.scss';

thead {
  position: sticky;
  top: 0px;
  font-size: $gFontSize;
  z-index: 150;
  .head-row {
    height: 22px;
    font-size: 0.75em;
    color: rgba(0, 0, 0, 0.5);
    &__column {
      position: sticky;
      top: 0px;
      padding: 2px;
      min-width: 94px;
      border-left: thin solid grey;
      box-shadow: inset 0px 1px 0 grey, inset 0 -1px 0 grey, 1px 0 0 grey;
      background-color: #dadce0;
      z-index: 160;
      &-title {
        left: 0px;
        min-width: 60px;
        max-width: 60px;
        box-shadow: -1px 0px 0 grey, 1px 0px 0 grey, inset 0 1px 0 grey, inset 0 -1px 0 grey;
        z-index: 170;
      }
      &-row {
        left: 0px;
        // border-right: 0;

        min-width: 25px;
        max-width: 25px;
        box-shadow: -1px 0 0 grey, 1px 0 0 grey, inset 0px 1px 0 grey, inset -0px -1px 0 grey;
        z-index: 175;
      }
    }
    &__column-group {
      border-left: 0;
      box-shadow: inset 0px 1px 0 grey, inset 0 0px 0 grey, 1px 0 0 grey;
      z-index: 170;
      &-title {
        left: 0px;
        min-width: 60px;
        max-width: 60px;
        border-left: thin solid grey;
        box-shadow: -0px 0 0 grey, 1px 0 0 grey, inset 0 1px 0 grey, inset -0px 0px 0 grey;
        z-index: 180;
      }
      &-row {
        left: 0px;
        min-width: 25px;
        max-width: 25px;
        // border-right: thin solid grey;
        box-shadow: -1px 0 0 grey, 1px 0 0 grey, inset 0px 1px 0 grey, inset -0px -0px 0 grey;
        z-index: 190;
      }
    }
    .hidden { display: none; }
  }
}
</style>
