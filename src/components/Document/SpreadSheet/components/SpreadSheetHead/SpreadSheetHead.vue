<template>
  <thead>
    <tr v-if="isColumnsGroup"
        class="head-row">
      <spread-sheet-head-cell-group v-for="level in currentTableLevel"
                                    :key="level"
                                    :current-level="level"
                                    :current-row="1"></spread-sheet-head-cell-group>
      <spread-sheet-head-cell-title :current-level="currentTableLevel"
                                    :current-row="1"></spread-sheet-head-cell-title>

      <template v-for="i in columnCount">
        <th :key="`head-row__column-group-${i}`"
            class="head-row__column-group"
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
      <spread-sheet-head-cell-group v-for="level in currentTableLevel"
                                    :key="level"
                                    :current-level="level"
                                    :current-row="2"></spread-sheet-head-cell-group>
      <spread-sheet-head-cell-title :current-level="currentTableLevel"
                                    :current-row="2"></spread-sheet-head-cell-title>

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

import SpreadSheetHeadCellGroup from './SpreadSheetHeadCellGroup.vue';
import SpreadSheetHeadCellTitle from './SpreadSheetHeadCellTitle.vue';
import SpreadSheetBtnGroup from '../SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetHead',
  components: {
    SpreadSheetBtnGroup,
    SpreadSheetHeadCellGroup,
    SpreadSheetHeadCellTitle,
  },
  mixins: [
    SpreadSheet,
  ],
  props: {
    currentTableLevel: { type: Number, default: 0 },

    isRowsGroup: { type: Boolean, default: false },
    columnCount: { type: Number, default: 10 },
    columns: { type: Object },
    rowGroupLevel: { type: Number, default: 1 },

    shiftTitleColumn: { type: Number },
    shiftTitleRow: { type: Object, default() { return { left: '0px' }; } },
  },
  computed: {
    isColumnsGroup() {
      return Object.values(this.columns).find((item) => Object.keys(item).includes('columnGroup')) || false;
    },
    styleColumnTitleRowTitle() {
      return {
        ...this.shiftTitleColumn,
        // top: (this.isColumnsGroup) ? '22px' : '0px',
        ...this.shiftTitleRow,
      };
    },
    styleColumnGroupRowGroup() {
      return {
        top: '0px',
        'max-width': '24px', // this.shiftTitleRow.left,
        'min-width': '24px', // this.shiftTitleRow.left,
      };
    },
    styleColumnGroupRowTitle() {
      return {
        ...this.shiftTitleColumn,
        // top: (this.isColumnsGroup) ? '22px' : '0px',
        'max-width': '24px', // this.shiftTitleRow.left,
        'min-width': '24px', // this.shiftTitleRow.left,
      };
    },
  },
  methods: {
    getStyleColumnGroup(columnNumber) {
      return {
        height: this.shiftTitleColumn.top,
        ...this.getWidthColumn(columnNumber),
      };
    },
    getStyleColumn(columnNumber) {
      return {
        top: '24px',
        // top: (this.isColumnsGroup) ? '22px' : '0px',
        ...this.getWidthColumn(columnNumber),
      };
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
  .head-row {
    height: 24px;
    font-size: 0.75em;
    color: rgba(0, 0, 0, 0.5);
    &__column {
      position: sticky;
      top: 0px;
      padding: 2px;
      min-width: 94px;
      box-shadow: inset 0px -1px 0px grey, inset 1px 0px 0px grey;
      background-color: #dadce0;
      z-index: 280;
    }
    &__column-group {
      position: sticky;
      top: 0px;
      vertical-align: middle;
      background-color: #dadce0;
      box-shadow: inset 0px -1px 0px grey, inset 0px 1px 0px grey;
      z-index: 300;
    }
    .hidden { display: none; }
  }
}
</style>
