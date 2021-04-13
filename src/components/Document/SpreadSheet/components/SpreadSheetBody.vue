<template>
  <table class="spread-sheet-body">
    <tr v-for="row in leftBarCount"
        :key="row"
        class="spread-sheet-body__row">
      <td v-for="column in headCount"
          :key="column"
          class="spread-sheet-body__column"></td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'SpreadSheetBody',
  props: {
    leftBarCount: { type: Number, default: 100 },
    headCount: { type: Number, default: 25 },
  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-body {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  &__row {
    .spread-sheet-body__column {
      min-width: 94px;
      height: 24px;
      border-right: thin solid grey;
      border-bottom: thin solid grey;
    }
  }
}
</style>
