<template>
  <table class="spread-sheet-head">
    <template v-for="level in columnLevelGroupMax">
      <tr :key="level"
          class="spread-sheet-head__row-group">
        <template v-for="column in columnCount">
          <th v-if="!columnExcluded.has(column)"
              :key="column"
              class="spread-sheet-head__column-group"
              :style="getColumnStyle(column)">
            <spread-sheet-btn-group v-if="isColumnGroupLevel(column, level)">
              mdi-plus-box-outline</spread-sheet-btn-group>
          </th>
          <th v-if="!columnExcluded.has(column) && isColumnGroup(column)"
              :key="`slot-${column}`"
              class="spread-sheet-head__column-group hidden"
              :rowspan="columnLevelGroupMax + 1"
              :data-column-parent-slot="getColumnParent(column + 1)"></th>
        </template>
      </tr>
    </template>

    <tr class="spread-sheet-head__row">
      <template v-for="column in columnCount">
      <th v-if="!columnExcluded.has(column)"
          :key="column"
          class="spread-sheet-head__column"
          :style="getColumnStyle(column)">{{ getColumnTitle(column).toUpperCase() }}</th>
      <!-- <th v-if="!columnExcluded.has(column) && isColumnGroup(column)"
              :key="`slot-${column}`"
              class="spread-sheet-head__column hidden"></th> -->
      </template>
    </tr>
  </table>
</template>

<script>
import SpreadSheet from './SpreadSheet';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetHead',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SpreadSheet,
  ],
  props: {
    columnCount: { type: Number, default: 25 },
    columnExcluded: { type: Set, default() { return new Set(); } },
    columns: { type: Object },
    setCharacter: { type: Array },
  },
  methods: {
    isColumnGroup(columnNumber) {
      const name = this.getColumnTitle(columnNumber);
      if (!this.columns[name] || !this.columns[name].columnGroup) return false;
      return true;
    },
    isColumnGroupLevel(columnNumber, level = false) {
      const name = this.getColumnTitle(columnNumber);
      if (!this.columns[name] || !this.columns[name].columnGroup) return false;
      return (level === this.getColumnLevel(name) + 1);
    },
    getColumnParent(columnNumber) {
      const name = this.getColumnTitle(columnNumber);
      return this.columns[name].parent;
    },
    getColumnStyle(columnNumber) {
      return {
        ...this.getColumnWidth(columnNumber),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-head {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  &__row {
    .spread-sheet-head__column {
      min-width: 94px;
      height: 22px;
      border: thin solid grey;
      background-color: #dadce0;
      &:first-child {
        border-left: 0px;
      }
    }
  }
  &__row-group {
    .spread-sheet-head__column-group {
      min-width: 94px;
      height: 22px;
      background-color: #dadce0;
    }
    &:first-child {
      .spread-sheet-head__column-group {
        border-top: thin solid grey;
      }
    }
  }
  .hidden { display: none; }
}
</style>
