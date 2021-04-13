<template>
  <tr class="head-row">
    <spread-sheet-head-cell-group v-for="level in currentTableRowLevel"
                                  :key="level"
                                  :current-level="level"
                                  :current-row="1"></spread-sheet-head-cell-group>
    <spread-sheet-head-cell-title :current-level="currentTableRowLevel"
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
</template>

<script>
import SpreadSheetBtnGroup from '../SpreadSheetBtnGroup.vue';
import SpreadSheetHeadCellGroup from './SpreadSheetHeadCellGroup.vue';
import SpreadSheetHeadCellTitle from './SpreadSheetHeadCellTitle.vue';

export default {
  name: 'SpreadSheetHeadRowGroup',
  components: {
    SpreadSheetBtnGroup,
    SpreadSheetHeadCellGroup,
    SpreadSheetHeadCellTitle,
  },
  props: {
    currentTableRowLevel: { type: Number, default: 0 },
  },
};
</script>

<style lang="scss" scoped>

</style>
