<template>
  <!-- <table class="sheet-left-bar">
    <tr class="sheet-left-bar__row"
        :style="rowStyle"> -->
    <template>

    </template>
      <th v-for="level in rowLevelGroupMax"
          :key="level"
          class="sheet-left-bar__column-group">
        <spread-sheet-btn-group :data-row-parent="row"
                                data-row-group-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
      </th>
      <!-- <th class="sheet-left-bar__column">{{ row }}</th> -->
    <!-- </tr>
  </table> -->
</template>

<script>
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetLeftBar',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    rowStyle: { type: Object, default() { return {}; } },
    row: { type: Number },
    rowLevelGroupMax: { type: Number, default: 0 },
  },
};
</script>

<style lang="scss" scoped>
.sheet-left-bar {
  position: relative;
  border-collapse: collapse;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  &__row {
    font-size: 0.75em;
    .sheet-left-bar__column {
      position: relative;
      max-width: 60px;
      min-width: 60px;
      height: 22px;
      border: thin solid grey;
      // border-top: 0px;
      // &:first-child {
      //   border-top: 0px;
      // }

    }
    .sheet-left-bar__column-group {
      max-width: 20px;
      min-width: 20px;
      &:first-child {
        border-left: thin solid grey;
      }
    }
    &:first-child {
      .sheet-left-bar__column {
        border-top: 0px;
      }
    }
  }
}
</style>
