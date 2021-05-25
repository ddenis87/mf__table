<template>
  <div class="spread-sheet-view">
    <spread-sheet-edit ref="SpreadSheetEditDOM"
                       v-if="isCellEditActive"
                       :style="cellEditStyle"
                       v-bind="cellEditProps"
                       :is-shild="isCellEditShild"
                       @editing-accept="editingAccept"
                       @edit-blur="editingAccept"></spread-sheet-edit>
    <div class="spread-sheet-view__control-top">
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="newDocument">
          <v-icon small left>mdi-file-table-outline</v-icon>Новый документ</v-btn>
      </div>
      <div class="item item_btn item_file">
        <v-file-input dense
                      label="Открыть шаблон"
                      @change="openJSONFileTemplate">
        </v-file-input>
      </div>
      <div class="item item_btn item_file">
        <v-file-input dense
                      label="Открыть данные"
                      @change="openJSONFileData">
        </v-file-input>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="saveJSONFile">
          <v-icon small left>mdi-cloud-download-outline</v-icon>Сохранить документ</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark :color="(printMode) ? 'blue darken-1' : 'blue darken-3'" @click="openPagePrint">
          <v-icon small left>mdi-cloud-print-outline</v-icon>{{ (printMode) ? 'Редактирование' : 'Печать'}}</v-btn>
      </div>
      <div class="item item_btn">
        <v-checkbox label="Сетка"
                    v-model="isGridOff"
                    @input="isGridOff = !isGridOff"></v-checkbox>
      </div>
    </div>
    <div class="spread-sheet-view__table">
      <spread-sheet ref="SpreadSheet"
                    :rowsCount="rowCount"
                    :columnsCount="columnCount"
                    :rows="rows"
                    :columns="columns"
                    :cells="cells"
                    :styles="styles"
                    :cell-width="cellWidth"
                    :cell-height="cellHeight"
                    :print-mode="printMode"
                    :is-grid-off="!isGridOff"
                    @edit:cell="editCell"
                    @scroll:body="scrollBody"></spread-sheet>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
import SpreadSheetEdit from '@/components/SpreadSheetEdit/SpreadSheetEdit.vue';

import apiJSON from '@/plugins/apiJSON/apiJSON';

export default {
  name: 'SpreadSheetView',
  components: {
    SpreadSheet,
    SpreadSheetEdit,
  },
  data() {
    return {
      rowCount: undefined,
      columnCount: undefined,
      rows: {},
      columns: {},
      cells: {},
      styles: [],
      cellWidth: undefined,
      cellHeight: undefined,
      isShowDialog: false,
      isCellEditActive: false,
      isCellEditShild: false,
      cellEditGeometry: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      cellEditProps: {},
      printMode: false,
      isGridOff: true,
    };
  },
  computed: {
    cellEditStyle() {
      return {
        width: `${this.cellEditGeometry.width}px`,
        height: `${this.cellEditGeometry.height}px`,
        left: `${this.cellEditGeometry.left}px`,
        top: `${this.cellEditGeometry.top}px`,
      };
    },
  },
  methods: {
    scrollBody() {
      if (this.cellEditProps.cellName) {
        const cellEdit = this.$refs.SpreadSheet.$el.querySelector(`[data-name="${this.cellEditProps.cellName}"]`);
        if (!cellEdit) return;
        const cellEditGeometry = cellEdit.getBoundingClientRect();
        // console.log(this.cellEditGeometry.top, ' < ', cellEditGeometry.top - 65);
        if ((this.cellEditGeometry.left > cellEditGeometry.left + 10
          || this.cellEditGeometry.left < cellEditGeometry.left - 10)
          || (this.cellEditGeometry.top > cellEditGeometry.top - 65
          || this.cellEditGeometry.top < cellEditGeometry.top - 65)) {
          this.isCellEditShild = true;
        } else {
          this.isCellEditShild = false;
        }
      }
    },
    editingAccept(option) {
      // console.log(option);
      if (!this.cells[option.cellName]) this.$set(this.cells, option.cellName, {});
      if (!this.cells[option.cellName].value) {
        this.$set(this.cells[option.cellName], 'value', option.value);
      } else {
        this.cells[option.cellName].value = option.value;
      }
      this.editBlur(option);
    },

    async editCell(cellProps) {
      // console.log(cellProps);
      if (cellProps.evt.type === 'keydown') {
        this.editCellBefore(cellProps);
      }
      this.cellEditGeometry.width = cellProps.width + 1;
      this.cellEditGeometry.height = cellProps.height + 1;
      this.cellEditGeometry.left = cellProps.left - 1;
      this.cellEditGeometry.top = cellProps.top + 1;

      this.cellEditProps.cellName = cellProps.name;
      this.cellEditProps.cellType = cellProps.type;
      this.cellEditProps.cellValue = (this.cells[cellProps.name] && this.cells[cellProps.name].value) ? this.cells[cellProps.name].value : '';
      this.isCellEditActive = true;
      await this.$nextTick().then(() => {
        setTimeout(() => this.$refs.SpreadSheetEditDOM.$el.focus(), 100);
      });
    },
    editCellBefore(cellProps) { // !!!!!Не верно, убрать в компонент редактирования
      // if (cellProps.evt.type === 'keydown') {
      if (cellProps.evt.code === 'Delete') {
        if (this.cells[cellProps.name] && this.cells[cellProps.name].value) this.cells[cellProps.name].value = '';
      }
      if (cellProps.evt.code.includes('Key')
        || cellProps.evt.code.includes('Numpad')
        || cellProps.evt.code.includes('Digit')) {
        if (!this.cells[cellProps.name]) this.$set(this.cells, cellProps.name, {});
        if (!this.cells[cellProps.name].value) this.$set(this.cells[cellProps.name], 'value', cellProps.evt.key);
        // this.cells[cellProps.name].value = cellProps.evt.key;
      }
      // }
    },

    editBlur(option) {
      // console.log(option);
      this.isCellEditActive = false;
      if (option.event.code === 'Escape') {
        this.$refs.SpreadSheet.pFocusCellByCellName({ cellName: this.cellEditProps.cellName });
      }
      this.clearPropsSpreadSheetEdit();
    },
    clearPropsSpreadSheetEdit() {
      this.cellEditGeometry.width = 0;
      this.cellEditGeometry.height = 0;
      this.cellEditGeometry.left = 0;
      this.cellEditGeometry.top = 0;
      this.cellEditProps.cellName = undefined;
      this.cellEditProps.cellType = undefined;
      this.cellEditProps.cellValue = undefined;
      this.isCellEditShild = false;
    },
    clearPropsSpreadSheet() {
      this.columns = {};
      this.rows = {};
      this.cells = {};
      this.styles = [];
    },

    newDocument() {
      this.clearPropsSpreadSheet();
      this.$refs.SpreadSheet.pDocumentNew();
      this.isGridOff = true;
    },
    saveJSONFile() {
      apiJSON.dowloadJSONFile({
        rows: this.rows,
        columns: this.columns,
        cells: this.cells,
        styles: this.styles,
      });
    },
    openJSONFileTemplate(file) {
      if (!file) return;
      this.newDocument();
      apiJSON.uploadJSONFile(file).then((data) => {
        if (Object.keys(data).includes('columns')) this.columns = data.columns;
        if (Object.keys(data).includes('rows')) this.rows = data.rows;
        if (Object.keys(data).includes('cells')) this.cells = data.cells;
        if (Object.keys(data).includes('styles')) this.styles = data.styles;
        if (Object.keys(data).includes('namedRanges')) console.log(data.namedRanges);
      });
      this.isGridOff = false;
    },
    openJSONFileData(file) {
      if (!file) return;
      apiJSON.uploadJSONFile(file).then((data) => {
        console.log(data);
      });
    },
    openPagePrint() {
      const dataPrint = {
        rows: this.rows,
        columns: this.columns,
        cells: this.cells,
        styles: this.styles,
      };
      localStorage.setItem('dataPrint', JSON.stringify(dataPrint));
      const pagePrint = this.$router.resolve({
        name: 'SpreadSheetPrint',
      });
      window.open(pagePrint.href, '_blank');
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

  &__control-top {
    grid-area: control-top;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5px;
    padding-left: 18px;
    .item {
      padding-right: 20px;
      &_btn {
        align-self: center;
      }
      &_file {
        width: 240px;
        padding-top: 10px;
      }
    }
  }
  &__table {
    position: relative;
    grid-area: table;
    padding: 5px;
    width: calc(100vw - 0px);
    height: calc(100vh - 126px);
  }
}

@media print {
  .spread-sheet-view {
    grid-template-areas: "table";
    grid-template-rows: 1fr;
    &__control-top {
      display: none;
    }
  }
}
</style>
