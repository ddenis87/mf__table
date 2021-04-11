<template>
  <td v-if="isRowsGroup"
      class="body-row__column body-row__column-group">
    <spread-sheet-btn-group v-if="isRowGroup"
                            :data-row-group-parent="row"
                            data-row-group-status="close">mdi-plus-box-outline</spread-sheet-btn-group>
  </td>
</template>

<script>
import SpreadSheetBtnGroup from '../SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetBodyCellGroup',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    isRowsGroup: { type: Boolean, default: false },
    isRowGroup: { type: Boolean, default: false },
    row: { type: Number },
    rowGroupLevel: { type: Number, default: 1 },
  },
};
</script>

<style lang="scss" scoped>
.body-row__column {
  position: relative;
  border-left: thin solid grey;
  border-bottom: thin solid grey;
  z-index: 50;
  &-group {
    position: sticky;
    left: 0px;
    padding: 0px 3px;
    background-color: #dadce0;
    border-bottom: 0;
    box-shadow: -1px 0px 0 grey, 0px 0px 0 grey;
    text-align: left;
    z-index: 60;
  }
  .line {
    display: inline-flex;
    justify-content: center;
    width: 16px;

  }
}
</style>
