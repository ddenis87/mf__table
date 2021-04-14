<template>
  <table class="spread-sheet-left-bar">
    <template v-for="row in rowCount">
      <tr v-if="!rowExcluded.has(row)"
          :key="row"
          class="spread-sheet-left-bar__row"
          :style="getRowStyle(row)">
        <th v-for="level in rowLevelGroupMax"
            :key="level"
            class="spread-sheet-left-bar__column-group">
          <spread-sheet-btn-group v-if="isRowGroup(row, level)">mdi-plus-box-outline</spread-sheet-btn-group>
        </th>
        <th class="spread-sheet-left-bar__column">{{ row }}</th>
      </tr>
    </template>
  </table>
</template>

<script>
import SpreadSheet from './SpreadSheet';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetLeftBar',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SpreadSheet,
  ],
  props: {
    rowCount: { type: Number, default: 100 },
    rowExcluded: { type: Set, default() { return new Set(); } },
    rows: { type: Object },
  },
  methods: {
    isRowGroup(rowNumber, level) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].rowGroup) return false;
      return (level === this.getRowLevel(rowNumber) + 1);
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
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  &__row {
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
