<template>
  <td v-if="isRowsGroup"
      class="body-row__column body-row__column-group"
      :style="shiftLeft">
    <spread-sheet-btn-group v-if="(currentColumn == getLevelRowGroup(row) && isRowGroup)"
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
    rows: { type: Object },
    currentColumn: { type: Number, default: 1 },
  },
  computed: {
    shiftLeft() {
      return { left: `${24 * (this.currentColumn - 1)}px` };
    },
  },
  methods: {
    getLevelRowGroup(rowNumber) {
      let level = 1;
      let currentRow = rowNumber;
      let condition = true;

      while (condition) {
        if (!this.rows[currentRow]?.parent) { condition = false; return level; }
        level += 1;
        currentRow = this.rows[currentRow].parent;
      }
      return level;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
