<template>
  <div class="spread-sheet-view">
    <spread-sheet-edit v-if="isEditCellActive"
                       :style="cellEditStyle"></spread-sheet-edit>
    <div class="spread-sheet-view__control-top">
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
        <v-btn small dark color="blue darken-3" @click="() => isShowDialog = true">Setting</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="movePrintPage">Print</v-btn>
      </div>
    </div>
    <div class="spread-sheet-view__table">
      <spread-sheet :columns="columns"
                    :columnsCount="sheetSpace.column"
                    :rows="rows"
                    :rowsCount="sheetSpace.row"
                    :cells="cells"
                    :styles="styles"
                    @edit-cell="editCell"></spread-sheet>
    </div>
    <dialog-bar-right is-dialog-name="Setting" class="dialog"
                      :is-dialog-show="isShowDialog"
                      width="700"
                      @close-dialog="isShowDialog = false">
      <v-card class="dialog__item" >
        <v-textarea rows="7" label="Columns" v-model="columnsJSON"></v-textarea>
        <v-textarea rows="7" label="Rows" v-model="rowsJSON"></v-textarea>
        <v-textarea rows="7" label="Cells" v-model="cellsJSON"></v-textarea>
      </v-card>
    </dialog-bar-right>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
import SpreadSheetEdit from '@/components/SpreadSheetEdit/SpreadSheetEdit.vue';
import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue';

import SpreadSheetData from './SpreadSheetData';

export default {
  name: 'SpreadSheetView',
  components: {
    SpreadSheet,
    SpreadSheetEdit,
    DialogBarRight,
  },
  data() {
    return {
      ...SpreadSheetData,
      isShowDialog: false,
      isEditCellActive: false,
      editCellGeometry: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
    };
  },
  computed: {
    rows() { return JSON.parse(this.rowsJSON); },
    columns() { return JSON.parse(this.columnsJSON); },
    cells() { return JSON.parse(this.cellsJSON); },
    cellEditStyle() {
      console.log({
        width: `${this.editCellGeometry.width}px`,
        height: `${this.editCellGeometry.height}px`,
        left: `${this.editCellGeometry.left}px`,
        top: `${this.editCellGeometry.top}px`,
      });
      return {
        width: `${this.editCellGeometry.width}px`,
        height: `${this.editCellGeometry.height}px`,
        left: `${this.editCellGeometry.left}px`,
        top: `${this.editCellGeometry.top}px`,
      };
    },
  },
  methods: {
    editCell(cell) {
      const cellGeometry = cell.target.getBoundingClientRect();
      this.editCellGeometry.width = cellGeometry.width;
      this.editCellGeometry.height = cellGeometry.height;
      this.editCellGeometry.left = cellGeometry.left;
      this.editCellGeometry.top = cellGeometry.top;
      console.log(this.editCellGeometry);
      this.isEditCellActive = true;
      console.log(cell);
      console.log(cell.target.getBoundingClientRect());
    },
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
.spread-sheet-view {
  position: relative;
  display: grid;
  grid-template-areas: "control-top" "table";
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr;
  max-width: 100%;

  // border: thin solid red;
  &__control-top {
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
  &__table {
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
