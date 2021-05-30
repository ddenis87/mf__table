<template>
  <div class="spread-sheet-view">
    <!-- <spread-sheet-edit ref="SpreadSheetEditDOM"
                       v-if="isCellEditActive"
                       :style="cellEditStyle"
                       v-bind="cellEditProps"
                       :is-shild="isEditableCellLabel"
                       @editing-accept="editingAccept"
                       @edit-blur="editingAccept"></spread-sheet-edit> -->
    <div class="spread-sheet-view__control-top">
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="createNewDocument">
          <v-icon small left>mdi-file-table-outline</v-icon>Новый документ</v-btn>
      </div>
      <div class="item item_btn item_file">
        <v-file-input dense
                      label="Открыть шаблон"
                      :disabled="isFileTemplateDisabled"
                      v-model="fileTemplate"
                      @change="openJSONFileTemplate">
        </v-file-input>
      </div>
      <div class="item item_btn item_file">
        <v-file-input dense
                      label="Открыть данные"
                      :disabled="isFileDataDisabled"
                      v-model="fileData"
                      @change="openJSONFileData">
        </v-file-input>
      </div>
      <div class="item item_btn">
        <v-menu bottom
                :offset-y="true">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small dark color="blue darken-3" v-bind="attrs" v-on="on">
              <v-icon small left>mdi-cloud-download-outline</v-icon>Сохранить</v-btn>
          </template>
          <v-list>
            <v-list-item dense link @click="saveDocument">
              <v-list-item-title>Сохранить документ</v-list-item-title>
            </v-list-item>
            <v-list-item dense link @click="saveDocumentData">
              <v-list-item-title>Сохранить данные</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="openPrintPage">
          <v-icon small left>mdi-cloud-print-outline</v-icon>{{ 'Печать' }}</v-btn>
      </div>
      <div class="item item_btn">
        <v-checkbox label="Сетка"
                    v-model="isGridOff"
                    @input="isGridOff = !isGridOff"></v-checkbox>
      </div>
      <dialog-modal :is-dialog-show="isShowDialog"
                    is-dialog-name="Ошибка">
        <v-card>
          <v-card-text>Файл не является шаблоном или в шаблоне ошибка</v-card-text>
        </v-card>
      </dialog-modal>
    </div>
    <div class="spread-sheet-view__table">
      <spread-sheet-edit ref="SpreadSheetEditDOM"
                         :editable-cell="editableCell"
                         :editable-cell-event="editableCellEvent"
                         :editable-cell-element="editableCellElement"
                         :is-editable-cell-label="isEditableCellLabel"
                         @editing:accept="acceptEditingCell"
                         @editing:cancel="cancelEditingCell"></spread-sheet-edit>
      <spread-sheet ref="SpreadSheet"
                    v-bind="tableDocument"
                    :is-grid-off="!isGridOff"
                    @dblclick:cell="evtEditCell"
                    @keydown:cell="evtEditCell"
                    @scroll:body="scrollBody"></spread-sheet>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
import SpreadSheetEdit from '@/components/SpreadSheetEdit/SpreadSheetEdit.vue';
import DialogModal from '@/components/Dialogs/DialogModal.vue';

import apiSpreadSheet from '@/plugins/apiJSON/apiSpreadSheet';
import TableDocument from '@/structures/SpreadSheet';

export default {
  name: 'SpreadSheetView',
  components: {
    SpreadSheet,
    SpreadSheetEdit,
    DialogModal,
  },
  data() {
    return {
      tableDocument: new TableDocument({}),
      tableDocumentTemplate: {},
      fileTemplate: [],
      fileData: [],

      editableCell: null,
      editableCellEvent: null,
      editableCellElement: null,
      editableCellGeometry: null,
      isEditableCellLabel: false,

      isGridOff: true,
      isFileDataDisabled: true,
      isFileTemplateDisabled: false,
      isShowDialog: false,
    };
  },
  computed: {
  },
  methods: {
    saveDocument() { alert('save document'); },
    saveDocumentData() {
      console.log(this.tableDocument.getDocumentData());
    },
    evtEditCell(evt) {
      const cellName = evt.target.getAttribute('data-name');
      this.editableCell = this.tableDocument.getCellByName(cellName);
      this.editableCellEvent = evt;
      this.editableCellElement = evt.target;
      this.editableCellGeometry = evt.target.getBoundingClientRect();
      this.$nextTick().then(() => {
        this.$refs.SpreadSheetEditDOM.$el.focus();
      });
    },
    clearEditCell() {
      this.editableCell = null;
      this.editableCellEvent = null;
      this.editableCellElement = null;
      this.isEditableCellLabel = false;
    },
    scrollBody() { // убрать в компонент ???
      if (this.editableCellElement) {
        const cellName = this.editableCellElement.getAttribute('data-name');
        const cellEdit = this.$refs.SpreadSheet.$el.querySelector(`[data-name="${cellName}"]`).getBoundingClientRect();
        if ((this.editableCellGeometry.left > cellEdit.left + 10
          || this.editableCellGeometry.left < cellEdit.left - 10)
          || (this.editableCellGeometry.top > cellEdit.top
          || this.editableCellGeometry.top < cellEdit.top)) {
          this.isEditableCellLabel = true;
        } else {
          this.isEditableCellLabel = false;
        }
      } else {
        this.isEditableCellLabel = false;
      }
    },
    acceptEditingCell(option) {
      this.tableDocument.editingCell(option.cellName, option.value);
      this.clearEditCell();
    },
    cancelEditingCell() {
      this.clearEditCell();
    },
    // editingAccept(option) {
    //   // console.log(option);
    //   if (!this.cells[option.cellName]) this.$set(this.cells, option.cellName, {});
    //   if (!this.cells[option.cellName].value) {
    //     this.$set(this.cells[option.cellName], 'value', option.value);
    //   } else {
    //     this.cells[option.cellName].value = option.value;
    //   }
    //   this.editBlur(option);
    // },

    // async editCell(cellProps) {
    //   // console.log(cellProps);
    //   if (cellProps.evt.type === 'keydown') {
    //     this.editCellBefore(cellProps); // !!!!!Не верно, убрать в компонент редактирования
    //   }
    //   this.cellEditGeometry.width = cellProps.width + 1;
    //   this.cellEditGeometry.height = cellProps.height + 1;
    //   this.cellEditGeometry.left = cellProps.left - 1;
    //   this.cellEditGeometry.top = cellProps.top + 1;

    //   this.cellEditProps.cellName = cellProps.name;
    //   this.cellEditProps.cellType = cellProps.type;
    //   this.cellEditProps.cellValue = (this.cells[cellProps.name] && this.cells[cellProps.name].value) ? this.cells[cellProps.name].value : '';
    //   this.isCellEditActive = true;
    //   await this.$nextTick().then(() => {
    //     setTimeout(() => this.$refs.SpreadSheetEditDOM.$el.focus(), 100);
    //   });
    // },
    // editCellBefore(cellProps) { // !!!!!Не верно, убрать в компонент редактирования
    //   // if (cellProps.evt.type === 'keydown') {
    //   if (cellProps.evt.code === 'Delete') {
    //     if (this.cells[cellProps.name] && this.cells[cellProps.name].value) this.cells[cellProps.name].value = '';
    //   }
    //   if (cellProps.evt.code.includes('Key')
    //     || cellProps.evt.code.includes('Numpad')
    //     || cellProps.evt.code.includes('Digit')) {
    //     if (!this.cells[cellProps.name]) this.$set(this.cells, cellProps.name, {});
    //     if (!this.cells[cellProps.name].value) this.$set(this.cells[cellProps.name], 'value', cellProps.evt.key);
    //     // this.cells[cellProps.name].value = cellProps.evt.key;
    //   }
    //   // }
    // },

    // editBlur(option) {
    //   // console.log(option);
    //   this.isCellEditActive = false;
    //   if (option.event.code === 'Escape') {
    //     this.$refs.SpreadSheet.pFocusCellByCellName({ cellName: this.cellEditProps.cellName });
    //   }
    //   this.clearPropsSpreadSheetEdit();
    // },
    // clearPropsSpreadSheetEdit() {
    //   this.cellEditGeometry.width = 0;
    //   this.cellEditGeometry.height = 0;
    //   this.cellEditGeometry.left = 0;
    //   this.cellEditGeometry.top = 0;
    //   this.cellEditProps.cellName = undefined;
    //   this.cellEditProps.cellType = undefined;
    //   this.cellEditProps.cellValue = undefined;
    //   this.isEditableCellLabel = false;
    // },

    createNewDocument() {
      this.tableDocument = new TableDocument();
      this.tableDocumentTemplate = {};
      this.$refs.SpreadSheet.createNewDocument();
      this.isGridOff = true;

      this.isFileTemplateDisabled = false;
      this.isFileDataDisabled = true;

      this.fileTemplate = [];
      this.fileData = [];
    },
    // saveJSONFile() {
    //   apiJSON.dowloadJSONFile({
    //     rows: this.rows,
    //     columns: this.columns,
    //     cells: this.cells,
    //     styles: this.styles,
    //   });
    // },
    openJSONFileTemplate(file) {
      if (!file) return;
      apiSpreadSheet.uploadJSONFile(file).then((JSONTemplate) => {
        this.tableDocumentTemplate = new TableDocument({ JSONString: JSONTemplate });
        this.isFileTemplateDisabled = true;
        this.isFileDataDisabled = false;
      });
    },
    openJSONFileData(file) {
      if (!file) return;
      apiSpreadSheet.uploadJSONFile(file).then((JSONData) => {
        this.tableDocument.buildDocument(this.tableDocumentTemplate, JSONData);
        this.isFileDataDisabled = true;
        this.isGridOff = false;
        console.log(this.tableDocument);
      });
    },
    openPrintPage() {
      localStorage.setItem('SpreadSheetTableDocument', this.tableDocument.getDocument(true));
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
    z-index: 100;
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
    z-index: 50;
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
