<template>
  <table class="sheet-head">
    <template v-for="level in columnLevelGroupMax">
      <tr :key="level"
          class="sheet-head__row-group">
        <template v-for="column in columns">
          <th :key="`head-group-${column.value}`"
              class="sheet-head__column-group"
              :style="getColumnStyle(column.value)">
            <spread-sheet-btn-group v-if="isColumnGroupLevel(column, level)">
              mdi-plus-box-outline</spread-sheet-btn-group>
          </th>
        </template>
      </tr>
    </template>

    <tr class="sheet-head__row">
      <template v-for="column in columns">
      <th :key="`head-title-${column.value}`"
          class="sheet-head__column"
          :style="getColumnStyle(column.value)">{{ getColumnTitle(column.value).toUpperCase() }}</th>
      </template>
    </tr>
  </table>
</template>

<script>
import SheetComponent from './SheetComponent';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetHead',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SheetComponent,
  ],
  props: {
    columns: { type: Array },
    columnLevelGroupMax: { type: Number, default: 0 },
    // setCharacter: { type: Array },
  },
  methods: {
    isColumnGroupLevel(column, level) {
      if (!Object.keys(column).includes('columnGroup')) return false;
      return (level === this.getColumnLevel(column) + 1);
    },
    getColumnLevel(column) {
      let level = 0;
      let currentColumn = column;
      let condition = true;
      while (condition) {
        if (!Object.keys(currentColumn).includes('parent')) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns.find((item) => item.value === currentColumn.parent);
      }
      return level;
    },
    getColumnStyle(columnNumber) {
      return {
        ...this.getColumnWidth(columnNumber),
      };
    },
    getColumnWidth(columnNumber) {
      const column = this.columns.find((item) => item.value === columnNumber);
      return {
        'max-width': `${column.width}px`,
        'min-width': `${column.width}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sheet-head {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  &__row {
    .sheet-head__column {
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
    .sheet-head__column-group {
      min-width: 94px;
      height: 22px;
      background-color: #dadce0;
    }
    &:first-child {
      .sheet-head__column-group {
        border-top: thin solid grey;
      }
    }
  }
}
</style>
