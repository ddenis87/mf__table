<template>
  <th class="head-column-group"
      :class="{
        'head-column-group_first-row': (currentRow === 1),
        'head-column-group_first-column': (currentLevel === 1),
        'head-column-group_first': (currentRow === 1 && currentLevel === 1),
      }"
      :style="shiftLeft"></th>
</template>

<script>
export default {
  name: 'SpreadSheetHeadCellGroup',
  props: {
    currentLevel: { type: Number },
    currentRow: { type: Number },
  },
  computed: {
    shiftLeft() {
      return {
        left: `${24 * (this.currentLevel - 1)}px`,
        top: `${24 * (this.currentRow - 1)}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.head-column-group {
  position: sticky;
  top: 0px;
  left: 0px;
  min-width: 24px;
  max-width: 24px;
  box-shadow: inset 0px -1px 0px grey, 1px 0px 0px grey;
  // box-shadow: inset 1px 1px 0 grey, 1px 0px 0 grey, inset 0px -1px 0 grey;
  // box-shadow: inset 0px -1px 0 grey, inset 1px 0px 0 grey;
  background-color: #dadce0;
  z-index: 500;
  
  &_first-column {
    box-shadow: inset 0px -1px 0px grey, 1px 0px 0px grey, inset 1px 0px 0px grey;
  }
  &_first-row {
    box-shadow: inset 0px -1px 0px grey, inset 0px 1px 0px grey, 1px 0px 0px grey;
  }
  &_first {
    box-shadow: inset 0px -1px 0px grey, 1px 0px 0px grey, inset 1px 1px 0px grey;
  }
}
</style>
