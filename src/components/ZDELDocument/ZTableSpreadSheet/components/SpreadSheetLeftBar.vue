<template>
  <table class="spread-sheet-left-bar" @click="eventClickTable">
    <template v-for="row in rowCount">
      <tr v-if="!rowExcluded.has(currentRow(row))"
          :key="row"
          class="spread-sheet-left-bar__row"
          :style="getRowStyle(row)">
        <th v-for="level in rowLevelGroupMax"
            :key="level"
            class="spread-sheet-left-bar__column-group"
            :class="{
              'line': (rowChildLevel > 1 && level <= rowChildLevel - 1 && row != rowCount),
              'line_end': (level === rowChildLevel - 1 && row === rowCount)
            }">
          <spread-sheet-btn-group v-if="isRowGroupLevel(currentRow(row), level)"
                                  :data-row-parent="currentRow(row)"
                                  data-row-group-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
        </th>
        <th class="spread-sheet-left-bar__column">{{ currentRow(row) }}</th>
      </tr>

      <tr v-if="!rowExcluded.has(currentRow(row)) && isRowGroup(currentRow(row))"
          :key="`slot-${row}`"
          class="spread-sheet-left-bar__row hidden">
        <th :colspan="rowLevelGroupMax + 1"
            :data-row-parent-slot="getRowParent(currentRow(row + 1))"></th>
      </tr>
    </template>
  </table>
</template>

<script>
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

import SpreadSheet from './SpreadSheet';
import SpreadSheetLeftBarGroup from './SpreadSheetLeftBarGroup';

export default {
  name: 'SpreadSheetLeftBar',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SpreadSheet,
    SpreadSheetLeftBarGroup,
  ],
  props: {
    rowCount: { type: Number, default: 100 },
    rowExcluded: { type: Set, default() { return new Set(); } },
    rows: { type: Object },

    rowParent: { type: Number, default: 0 },
    rowLevelGroup: { type: Number, default: null },
    rowChildLevel: { type: Number, default: 1 },
  },
  computed: {

  },
  methods: {
    eventClickTable(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').getAttribute('data-row-parent')) {
        this.toggleRowGroup(evt.target.closest('button'));
      }
    },
    currentRow(rowNumber) {
      return +rowNumber + +this.rowParent;
    },
    isRowGroup(rowNumber) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].rowGroup) return false;
      return true;
    },
    isRowGroupLevel(rowNumber, level) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].rowGroup) return false;
      // console.log(level, ' - ', (this.getRowLevel(rowNumber) + 1));
      return (level === this.rowChildLevel);
    },
    getRowParent(rowNumber) {
      return this.rows[rowNumber].parent;
    },
    getRowStyle(rowNumber) {
      return {
        ...this.getRowHeight(rowNumber),
      };
    },

  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-left-bar {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;

  margin-right: -2px;
  margin-top: -2px;
  &__row {
    font-size: 0.75em;
    .spread-sheet-left-bar__column {
      position: relative;
      max-width: 60px;
      min-width: 60px;
      height: 24px;
      border: thin solid grey;
      border-top: 0px;
      &:first-child {
        border-top: 0px;
      }

    }
    .spread-sheet-left-bar__column-group {
      max-width: 20px;
      min-width: 20px;
      &:first-child {
        border-left: thin solid grey;
      }
    }
    .line_start {
      position: relative;
      &::before {
        content: ' ';
        position: absolute;
        // left: 11px;
        border-left: thin solid #3F3F3F;
        background-color: #3F3F3F;
        width: 0px;
        height: 20px;
        left: 10px;
        height: calc(50% - 7px);
        bottom: 0px;
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
    .line_end {
      &::before {
        content: '';
        position: absolute;
        // border: 0;
        border-left: 1px solid #3F3F3F;
        border-bottom: 1px solid #3F3F3F;
        width: 8px;
        // height: 100%;
        // left: 11px;
        bottom: 0px;
      }
    }
    &:first-child {
      .spread-sheet-left-bar__column {
        border-top: 0px;
      }
    }
  }
  .hidden { display: none; }
}
</style>
