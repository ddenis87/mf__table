<template>
  <div class="test">
    <div class="test-control-top">
      <div class="item">
        <v-text-field label="Столбцы" v-model="countColumn"></v-text-field>
      </div>
      <div class="item">
        <v-text-field label="Строки" v-model="countRow"></v-text-field>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="commitSpace">Commit</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3">Setting</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="movePrintPage">Print</v-btn>
      </div>
    </div>
    <div class="test-table">
      <spread-sheet :columns="columns"
                    :columnsCount="sheetSpace.column"
                    :rows="rows"
                    :rowsCount="sheetSpace.row"
                    :cells="cells"
                    :styles="styles"></spread-sheet>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
import SpreadSheetData from './SpreadSheetData';

export default {
  name: 'Spread',
  components: {
    SpreadSheet,
  },
  data() {
    return {
      ...SpreadSheetData,
      tableRowsFixed: [],
      setExcludedCells: {},
    };
  },
  computed: {
    rows() { return JSON.parse(this.rowsJSON) },
    columns() { return JSON.parse(this.columnsJSON) },
    cells() { return JSON.parse(this.cellsJSON) },
  },
  methods: {
    commitSpace() {
      this.sheetSpace.column = +this.countColumn;
      this.sheetSpace.row = +this.countRow;
      console.log(this.sheetSpace);
    },
    movePrintPage() {
      this.$router.push('/SpreadSheetPrint');
    },
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: grid;
  grid-template-areas: "control-top" "table";
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr;
  max-width: 100%;

  // border: thin solid red;
  &-control-top {
    grid-area: control-top;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5px;
    .item {
      width: 100px;
      padding-right: 20px;
      &_btn {
        align-self: center;
      }
    }
    // border: thin solid green;
  }
  &-table {
    grid-area: table;
    padding: 5px;
    width: calc(100vw - 0px);
    height: calc(100vh - 126px);
    // border: thin solid black;
  }

  .dialog {
    height: calc(100vh - 65px);
    z-index: 9999;
    &__item {
      padding: 20px;
      height: calc(100vh - 65px);
    }
  }
}
</style>
