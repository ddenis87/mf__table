<template>
  <div class="spread-sheet">
    <sheet :column-count="columnCount"
           :row-count="rowCount"
           :columns="columns"
           :rows="rows"
           :cells="cells"></sheet>
  </div>
</template>

<script>
import Sheet from './Sheet.vue';
import SpreadSheetStyle from './SpreadSheetStyle';

export default {
  name: 'SpreadSheet',
  components: {
    Sheet,
  },
  mixins: [
    SpreadSheetStyle,
  ],
  props: {
    columnCount: { type: Number, default: 25 },
    rowCount: { type: Number, default: 100 },

    columns: { type: Object },
    rows: { type: Object },

    cells: { type: Object },
    styles: { type: Array },
  },
};
</script>

<style lang="scss" scoped>
@import './Sheet.scss';

.spread-sheet {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }
}
</style>
