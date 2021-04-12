<template>
  <td class="column-group"
      :class="{'column-group_first': (currentLevel === 1)}"
      :style="shiftLeft">
    <spread-sheet-btn-group v-if="isGroup"
                            :data-row-group-parent="currentRow"
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
    isRowGroup: { type: Boolean, default: false },
    currentRow: { type: Number },
    currentLevel: { type: Number },
  },
  computed: {
    isGroup() {
      return this.isRowGroup;
    },
    shiftLeft() {
      return { left: `${24 * (this.currentLevel - 1)}px` };
    },
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.column-group {
  position: sticky;
  left: 0px;
  box-shadow: 1px 0px 0px grey;
  background-color: #dadce0;
  text-align: center;
  z-index: 300;
  &_first {
    box-shadow: 1px 0px 0px grey, inset 1px 0px 0px grey;
  }
}
</style>
