<template>
  <thead>
    <tr v-for="level in currentTableColumnLevel"
        :key="level"
        class="head-row">
      <spread-sheet-head-cell-group v-for="levelRow in currentTableRowLevel"
                                    :key="levelRow"
                                    :current-level="levelRow"
                                    :current-row="level"></spread-sheet-head-cell-group>
      <spread-sheet-head-cell-title :current-level="currentTableRowLevel"
                                    :current-row="level"></spread-sheet-head-cell-title>

      <template v-for="i in columnCount">
        <th :key="`head-row__column-group-${i}`"
            class="head-row__column-group"
            :class="{
              'hidden': excludedColumns.has(`${i}`),
              'head-row__column-group_first-row': (level === 1),
            }"
            :style="getStyleColumnGroup(level, i)"
            :data-column-parent="(excludedColumns.has(`${i}`) ? getColumnParent(i) : '0')"
            :data-column-count-group="getColumnCountGroup(i)"
            :data-column-number="i + currentTableRowLevel + 1">
          <spread-sheet-btn-group v-if="isColumnGroup(i, level)"
                                  :data-column-group-parent="getColumnTitle(i)"
                                  data-column-group-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
        </th>
      </template>

    </tr>
    <tr class="head-row">
      <spread-sheet-head-cell-group v-for="levelRow in currentTableRowLevel"
                                    :key="levelRow"
                                    :current-level="levelRow"
                                    :current-row="currentTableColumnLevel + 1"></spread-sheet-head-cell-group>
      <spread-sheet-head-cell-title :current-level="currentTableRowLevel"
                                    :current-row="currentTableColumnLevel + 1"></spread-sheet-head-cell-title>

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
    currentTableColumnLevel: { type: Number, default: 0 },
    currentTableRowLevel: { type: Number, default: 0 },
    columns: { type: Object },
    columnCount: { type: Number, default: 10 },
  },
  computed: {
  },
  methods: {
    getColumnCountGroup(columnNumber) {
      const name = this.getColumnTitle(columnNumber);
      if (!this.columns[name] || !this.columns[name].columnGroup) return 0;
      return this.columns[name].columnGroup;
    },

    getStyleColumnGroup(level, columnNumber) {
      return {
        top: `${24 * (level - 1)}px`,
        height: '22px',
        ...this.getWidthColumn(columnNumber),
      };
    },
    getStyleColumn(columnNumber) {
      return {
        top: `${24 * this.currentTableColumnLevel}px`,
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
      box-shadow: inset 0px -1px 0px grey, inset 1px 0px 0px grey, 0px -1px 0px grey;
      background-color: #dadce0;
      z-index: 310;
    }
    &__column-group {
      position: sticky;
      top: 0px;
      vertical-align: middle;
      background-color: #dadce0;
      box-shadow: inset 0px -0px 0px grey;
      z-index: 300;
      &_first-row {
        box-shadow: inset 0px -0px 0px grey, inset 0px 1px 0px grey;
      }
      &_child {
        &::before {
          content: '';
          position: absolute;
          border: 1px solid #3F3F3F;
          background-color: #3F3F3F;
          width: 100px;
          height: 0px;
          left: 0px;
          top: 12px;
        }
        &-last {
          &::before {
            content: '';
            position: absolute;
            border: 0;
            background-color: unset;
            border-right: 2px solid #3F3F3F;
            border-top: 2px solid #3F3F3F;
            width: 100%;
            height: 8px;
            left: 0px;
            bottom: 4px;
          }
        }
        &-first {
          &::before {
            content: '';
            position: absolute;
            border: 0;
            border: 1px solid #3F3F3F;
            background-color: #3F3F3F;
            width: calc(50% - 7px);
            height: 0px;
            right: 0px;
            top: 12px;
          }
        }
      }

    }
    .hidden { display: none; }
  }
}
</style>
