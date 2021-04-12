<template>
  <th class="head-column-title"
      :style="shiftTitleLeft">{{ }}</th>
</template>

<script>
export default {
  name: 'SpreadSheetHeadCellTitle',
  props: {
    currentLevel: { type: Number, default: 0 },
    currentRow: { type: Number },
  },
  computed: {
    shiftTitleLeft() {
      return {
        left: `${24 * this.currentLevel}px`,
        top: `${24 * (this.currentRow - 1)}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.head-column-title {
  position: sticky;
  top: 0px;
  left: 0px;
  padding: 2px;
  min-width: 60px;
  max-width: 60px;
  box-shadow: inset 0px -1px 0px grey, 1px 0px 0px grey;;
  background-color: #dadce0;
  z-index: 480;
}
</style>
