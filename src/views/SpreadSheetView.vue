<template>
  <div class="spread-sheet-view">
    <spread-sheet-edit ref="SpreadSheetEditDOM"
                       v-if="isCellEditActive"
                       :style="cellEditStyle"
                       v-bind="cellEditProps"
                       @editing-accept="editingAccept"
                       @edit-blur="editingAccept"></spread-sheet-edit>
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
      cells: {},
      isShowDialog: false,
      isCellEditActive: false,
      cellEditGeometry: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      cellEditProps: {},
    };
  },
  computed: {
    rows() { return JSON.parse(this.rowsJSON); },
    columns() { return JSON.parse(this.columnsJSON); },
    // cells() { return JSON.parse(this.cellsJSON); },
    cellEditStyle() {
      return {
        width: `${this.cellEditGeometry.width}px`,
        height: `${this.cellEditGeometry.height}px`,
        left: `${this.cellEditGeometry.left}px`,
        top: `${this.cellEditGeometry.top}px`,
      };
    },
  },
  created() {
    this.cells = JSON.parse(this.cellsJSON);
  },
  methods: {
    editingAccept(option) {
      if (!this.cells[option.cellName]) this.$set(this.cells, option.cellName, {});
      this.cells[option.cellName].value = option.value;
      this.editBlur();
      // console.log(option);
    },
    editCell(cellProps) {
      console.log(cellProps);
      this.cellEditGeometry.width = cellProps.width + 1;
      this.cellEditGeometry.height = cellProps.height + 1;
      this.cellEditGeometry.left = cellProps.left - 1;
      this.cellEditGeometry.top = cellProps.top + 1;

      this.cellEditProps.cellName = cellProps.name;
      this.cellEditProps.cellType = cellProps.type;
      this.cellEditProps.cellValue = (this.cells[cellProps.name] && this.cells[cellProps.name].value) ? this.cells[cellProps.name].value : '';
      this.isCellEditActive = true;
      setTimeout(() => this.$refs.SpreadSheetEditDOM.$el.focus(), 50);
    },
    editBlur() {
      this.isCellEditActive = false;
      this.cellEditGeometry.width = 0;
      this.cellEditGeometry.height = 0;
      this.cellEditGeometry.left = 0;
      this.cellEditGeometry.top = 0;
      this.cellEditProps.cellName = undefined;
      this.cellEditProps.cellType = undefined;
      this.cellEditProps.cellValue = undefined;
    },
    commitSpace() {
      this.sheetSpace.column = +this.countColumn;
      this.sheetSpace.row = +this.countRow;
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
