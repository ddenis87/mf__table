<template>
  <div class="sheet">
    <table class="spread-sheet">
      <tr>
        <td class="spread-sheet__angle">
          <spread-sheet-angle></spread-sheet-angle>
        </td>
        <td class="spread-sheet__head">
          <spread-sheet-head></spread-sheet-head>
        </td>
      </tr>
      <tr>
        <td class="spread-sheet__left-bar">
          <spread-sheet-left-bar></spread-sheet-left-bar>
        </td>
        <td class="spread-sheet__body">
          <spread-sheet-body></spread-sheet-body>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
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
    table-layout: fixed;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;

    &__angle {
      position: sticky;
      top: 0px;
      left: 0px;
      width: 60px;
      background-color: #dadce0;
      z-index: 900;
    }
    &__head {
      position: sticky;
      top: 0px;
      z-index: 800;
    }
    &__left-bar {
      position: sticky;
      left: 0px;
      z-index: 700;
    }
    &__body {
      z-index: 600;
    }
  }
}
</style>
