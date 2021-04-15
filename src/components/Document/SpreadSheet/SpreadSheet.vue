<template>
  <div class="sheet">
    <table class="spread-sheet" @click="eventClickTable">
      <tr>
        <td class="spread-sheet__angle"
            :style="widthHead">
          <spread-sheet-angle :rows="rows"
                              :columns="columns"></spread-sheet-angle>
        </td>
        <td class="spread-sheet__head">
          <spread-sheet-head :column-count="columnCount"
                             :column-excluded="columnExcluded"
                             :columns="columns"
                             :set-character="setCharacter"></spread-sheet-head>
        </td>
      </tr>
      <tr>
        <td class="spread-sheet__left-bar"
            :style="widthHead">
          <spread-sheet-left-bar :row-count="rowCount"
                                 :row-excluded="rowExcluded"
                                 :rows="rows"></spread-sheet-left-bar>
        </td>
        <td class="spread-sheet__body">
          <spread-sheet-body :row-count="rowCount"
                             :row-excluded="rowExcluded"
                             :rows="rows"
                             :column-count="columnCount"
                             :column-excluded="columnExcluded"
                             :columns="columns"
                             :cells="cells"
                             :set-character="setCharacter"></spread-sheet-body>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import SpreadSheetStyle from './SpreadSheetStyle';
import SpreadSheetGroup from './SpreadSheetGroup';

import SpreadSheetAngle from './components/SpreadSheetAngle.vue';
import SpreadSheetHead from './components/SpreadSheetHead.vue';
import SpreadSheetLeftBar from './components/SpreadSheetLeftBar.vue';
import SpreadSheetBody from './components/SpreadSheetBody.vue';

export default {
  name: 'SpreadSheet',
  components: {
    SpreadSheetAngle,
    SpreadSheetHead,
    SpreadSheetLeftBar,
    SpreadSheetBody,
  },
  mixins: [
    SpreadSheetStyle,
    SpreadSheetGroup,
  ],
  props: {
    columnCount: { type: Number, default: 25 },
    rowCount: { type: Number, default: 100 },

    columns: { type: Object },
    rows: { type: Object },

    cells: { type: Object },
    styles: { type: Array },
  },
  data() {
    return {
      currentSelectedCell: null,
    };
  },
  methods: {
    eventClickTable(evt) {
      this.selectedCell(evt);
    },
    selectedCell(evt) {
      if (!evt.target.closest('.spread-sheet-body__column')) return;
      if (this.currentSelectedCell === evt.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('selected');
      evt.target.classList.add('selected');
      this.currentSelectedCell = evt.target;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './SpreadSheet.scss';

.sheet {
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
  .spread-sheet {
    position: relative;
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;

    &__angle {
      position: sticky;
      top: 0px;
      left: 0px;
      min-width: 60px;
      background-color: #dadce0;
      z-index: 900;
    }
    &__head {
      position: sticky;
      top: 0px;
      height: 22px;
      background-color: #dadce0;
      width: auto;
      z-index: 800;
    }
    &__left-bar {
      position: sticky;
      left: 0px;
      background-color: #dadce0;
      z-index: 700;
    }
    &__body {
      z-index: 600;
    }
  }
}
</style>
