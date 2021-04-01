<template>
  <div class="spread-sheet">
    <table class="table">
      <thead class="table-head">Head</thead>
      <tbody class="table-body">Body</tbody>
      <tfoot class="table-foot">Foot</tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SpreadSheet',
}
</script>

<style lang="scss" scoped>
.spread-sheet {
  width: 100%;
  height: 100%;
  .table {
    &-head {
      background-color: red;
    }
    &-body {
      background-color: green;
    }
    &-foot {
      background-color: grey;
    }
  }
}
</style>