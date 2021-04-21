<template>
  <table class="angle">
    <tr v-for="row in columnLevelGroupMax"
        :key="row"
        class="angle__row-group">
      <td v-for="column in rowLevelGroupMax"
          :key="column"
          class="angle__column-group"></td>
      <td class="angle__column"></td>
    </tr>
    <tr class="angle__row">
      <td v-for="column in rowLevelGroupMax"
          :key="column"
          class="angle__column-group"></td>
      <td class="angle__column"></td>
    </tr>
  </table>
</template>

<script>
import SpreadSheet from './SpreadSheet';

export default {
  name: 'SpreadSheetAngle',
  mixins: [
    SpreadSheet,
  ],
  props: {
    rows: { type: Object },
    columns: { type: Object },
  },
};
</script>

<style lang="scss" scoped>
.angle {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  &__row {
    .angle__column {
      max-width: 60px;
      min-width: 60px;
      height: 22px;
      border-bottom: thin solid grey;
      border-right: thin solid grey;
    }
    .angle__column-group {
      max-width: 20px;
      min-width: 20px;
      border-bottom: thin solid grey;
      &:first-child {
        border-left: thin solid grey;
      }
    }
  }
  &__row-group {
    .angle__column {
      max-width: 60px;
      min-width: 60px;
      height: 22px;
      border-right: thin solid grey;
    }
    .angle__column-group {
      max-width: 20px;
      min-width: 20px;
      &:first-child {
        border-left: thin solid grey;
      }
    }
    &:first-child {
      .angle__column {
        border-top: thin solid grey;
      }
      .angle__column-group {
        border-top: thin solid grey;
      }
    }
  }
}
</style>
