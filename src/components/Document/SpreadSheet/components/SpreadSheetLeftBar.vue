<template>
  <table class="spread-sheet-left-bar">
    <tr v-for="item in leftBarCount"
        :key="item"
        class="spread-sheet-left-bar__row">
      <td class="spread-sheet-left-bar__column">{{ item }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'SpreadSheetLeftBar',
  props: {
    leftBarCount: { type: Number, default: 100 },
  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-left-bar {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  &__row {
    .spread-sheet-left-bar__column {
      height: 24px;
      border: thin solid grey;
      background-color: #dadce0;
      &:first-child {
        border-top: 0px;
      }
    }
  }
  
}
</style>
