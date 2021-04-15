<template>
  <table class="spread-sheet-left-bar" @click.stop="eventClickTable">
    <template v-for="row in rowCount">
      <tr v-if="!rowExcluded.has(currentRow(row))"
          :key="row"
          class="spread-sheet-left-bar__row"
          :style="getRowStyle(row)">
        <th v-for="level in rowLevelGroupMax"
            :key="level"
            class="spread-sheet-left-bar__column-group">
          <spread-sheet-btn-group v-if="isRowGroupLevel(currentRow(row), level)"
                                  :data-row-parent="currentRow(row)">mdi-plus-box-outline</spread-sheet-btn-group>
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
import SpreadSheet from './SpreadSheet';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

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
      console.log(level, ' - ', (this.getRowLevel(rowNumber) + 1));
      // return (level === this.getRowLevel(rowNumber) + 1);
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
  &__row {
    font-size: 0.75em;
    .spread-sheet-left-bar__column {
      max-width: 60px;
      min-width: 60px;
      height: 24px;
      border: thin solid grey;
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
    &:first-child {
      .spread-sheet-left-bar__column {
        border-top: 0px;
      }
    }
  }
  .hidden { display: none; }
}
</style>
