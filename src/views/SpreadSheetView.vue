<template>
  <div class="spread-sheet-view">
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
          <v-icon small left>mdi-cloud-print-outline</v-icon>Печать</v-btn>
      </div>
      <div class="item item_btn">
        <v-checkbox label="Сетка"
                    v-model="isGridOff"
                    @input="isGridOff = !isGridOff"></v-checkbox>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="computedCell">Computed formula</v-btn>
      </div>
      <!-- <div class="item item_btn">
        <v-btn small dark color="red darken-3" @click="deleteRow">
          <v-icon>mdi-delete-empty-outline</v-icon>
        </v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="insertColumn">Shift column, step 1</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="red darken-3" @click="deleteColumn">
          <v-icon>mdi-delete-empty-outline</v-icon>
        </v-btn>
      </div> -->
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
                    @click:cell="evtClickCell"
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

import apiSpreadSheet from '@/plugins/apiSpreadSheet/apiSpreadSheet';
import TableDocument from '@/structures/TableDocument';

import setting from '@/assets/json/crossSetting';

export default {
  name: 'SpreadSheetView',
  components: {
    SpreadSheet,
    SpreadSheetEdit,
    DialogModal,
  },
  data() {
    return {
      tableDocument: new TableDocument(),
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
  mounted() {
    // console.log(this.tableDocument);
  },
  methods: {
    computedCell() {
      const formula = '$e5 + $e6 + $e7 + $e8 + $e9 + $e10 + $e11 + $e12 + $e13';
      // const form = { ab: 5, bc: 10, zx: 2 };
      console.log(formula);
      // const rezult = math.eval('ab + bc / 2', form);
      // console.log(rezult);
    },
    saveDocument() { alert('save document'); },
    saveDocumentData() {
      const JSONFormat = true;
      apiSpreadSheet.dowloadJSONFile(this.tableDocument.getDocumentData(JSONFormat), JSONFormat);
    },
    evtClickCell(evt) {
      const cellName = evt.target.getAttribute('data-name');
      const selectedCell = this.tableDocument.getCellByName(cellName);
      console.log(selectedCell);
      if (!Object.keys(selectedCell).includes('action')) return;
      this.tableDocument.action(cellName);
      // eval(selectedCell.script); // eslint-disable-line no-eval
    },
    evtEditCell(evt) {
      const cellName = evt.target.getAttribute('data-name');
      if (!this.tableDocument.checkEditAccess(cellName)) return;
      this.editableCell = this.tableDocument.getCellByName(cellName);
      this.editableCellEvent = evt;
      this.editableCellElement = evt.target;
      this.editableCellGeometry = evt.target.getBoundingClientRect();
      this.$nextTick().then(() => {
        this.$refs.SpreadSheetEditDOM.$el.focus();
      });
    },
    clearEditCell() {
      this.editableCellElement.focus();
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
    insertRow() {
      // console.log(this.tableDocument.getAreaForRange('a2:d2'));
      this.tableDocument.insertArea(1, 2, this.tableDocument.getAreaForRange('a2:d2'), 'vertical');
      // this.tableDocument.shiftRows({ shiftStart: 2, shiftBefore: false, shiftStep: 2 });
      console.log(this.tableDocument);
    },
    insertColumn() {
      this.tableDocument.insertArea(2, 1, this.tableDocument.getAreaForRange('b1:b4'), 'horizontal');
      // this.tableDocument.shiftColumns({ shiftStart: 4, shiftBefore: false, shiftStep: 1 });
      console.log(this.tableDocument);
    },
    deleteRow() {
      this.tableDocument.deleteRows('a2:d2');
      console.log(this.tableDocument);
    },
    deleteColumn() {
      this.tableDocument.deleteColumns('b1:b4');
      console.log(this.tableDocument);
    },

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

    openJSONFileTemplate(file) {
      if (!file) return;
      apiSpreadSheet.uploadJSONFile(file).then((JSONTemplate) => {
        this.tableDocumentTemplate = new TableDocument({ JSONString: JSONTemplate });
        this.tableDocument.direction = this.tableDocumentTemplate.direction;
        this.isFileTemplateDisabled = true;
        this.isFileDataDisabled = false;
        // console.log(this.tableDocumentTemplate);
      });
    },
    openJSONFileData(file) {
      if (!file) return;
      apiSpreadSheet.uploadJSONFile(file).then((JSONData) => {
        const tableDocument = new TableDocument();
        tableDocument.buildDocument(JSONData, this.tableDocumentTemplate, setting);
        this.tableDocument = tableDocument;
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
