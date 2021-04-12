<template>
  <td class="column-title"
      :style="shiftTitleLeft">{{ row }}</td>
</template>

<script>
export default {
  name: 'SpreadSheetBodyCellTitle',
  props: {
    row: { type: Number },
    currentTableLevel: { type: Number, default: 0 },
  },
  computed: {
    shiftTitleLeft() {
      return { left: `${24 * this.currentTableLevel}px` };
    },
  },
};
</script>

<style lang="scss" scoped>
.column-title {
  position: sticky;
  left: 0px;
  border-bottom: thin solid grey;
  box-shadow: 1px 0px 0px grey;

  text-align: center;
  font-size: 0.75em;
  font-weight: bold;
  background-color: #dadce0;
  color: rgba(0, 0, 0, 0.5);
  z-index: 280;
}

</style>
