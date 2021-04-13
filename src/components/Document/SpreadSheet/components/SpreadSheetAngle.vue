<template>
  <table class="angle">
    <tr class="angle__row"><td class="angle__column"></td></tr>
  </table>
</template>

<script>
export default {
  name: 'SpreadSheetAngle',
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
      height: 24px;
      border: thin solid grey;
    }
  }
}
</style>
