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
                      label="Открыть настройки"
                      :disabled="isFileSettingDisabled"
                      v-model="fileSetting"
                      @change="openJSONFileSetting">
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
        <v-menu bottom
                :offset-y="true"
                min-width="200">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small dark color="blue darken-3" v-bind="attrs" v-on="on">
              <v-icon small left>mdi-tune-vertical</v-icon>Вид</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-checkbox dense
                          label="Сетка"
                          v-model="isGrid"
                          @input="isGrid = !isGrid"></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-checkbox dense
                          label="Заголовоки"
                          v-model="isTitle"
                          @input="isTitle = !isTitle"></v-checkbox>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <!-- <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="insertColumn">
          <v-icon small left>mdi-cloud-print-outline</v-icon>Test button</v-btn>
      </div> -->
      <dialog-modal :is-dialog-show="isShowDialog"
                    is-dialog-name="Ошибка">
        <v-card>
          <v-card-text>Файл не является шаблоном или в шаблоне ошибка</v-card-text>
        </v-card>
      </dialog-modal>
    </div>
    <div class="spread-sheet-view__table">
      <spread-sheet-editing ref="SpreadSheetEditDOM"
                            :cell="editableCell"
                            :cell-type="editableCellType"
                            :cell-element="editableCellElement"
                            :edit-event="editableCellEvent"
                            :is-label="isEditableCellLabel"
                            @editing:accept="acceptEditingCell"
                            @editing:cancel="cancelEditingCell"></spread-sheet-editing>
      <spread-sheet ref="SpreadSheet"
                    v-bind="tableDocument"
                    :is-grid="isGrid"
                    :is-title="isTitle"
                    @click:cell="evtClickCell"
                    @dblclick:cell="evtDblClickCell"
                    @keydown:cell="evtKeydownCell"
                    @scroll:body="scrollBody"></spread-sheet>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
// import SpreadSheetEdit from '@/components/SpreadSheetEdit/SpreadSheetEdit.vue';
import SpreadSheetEditing from '@/components/SpreadSheetEditing/SpreadSheetEditing.vue';

import DialogModal from '@/components/Dialogs/DialogModal.vue';

import apiSpreadSheet from '@/plugins/apiSpreadSheet/apiSpreadSheet';
import TableDocument from '@/components/TableDocument/TableDocument';
import TableDocumentApi from '@/components/TableDocument/TableDocumentApi';

// import setting from '@/assets/json/crossSetting';

export default {
  name: 'SpreadSheetView',
  components: {
    SpreadSheet,
    // SpreadSheetEdit,
    SpreadSheetEditing,
    DialogModal,
  },
  data() {
    return {
      tableDocument: new TableDocument(),
      tableDocumentTemplate: {},
      fileTemplate: [],
      fileSetting: [],
      fileData: [],

      editableCell: null,
      editableCellType: null,
      editableCellEvent: null,
      editableCellElement: null,
      editableCellGeometry: null,
      isEditableCellLabel: false,

      isGrid: true,
      isTitle: true,
      isFileTemplateDisabled: false,
      isFileDataDisabled: true,
      isFileSettingDisabled: true,
      isShowDialog: false,
    };
  },
  mounted() {
    // console.log(this.tableDocument);
  },
  methods: {
    saveDocument() {
      const JSONFormat = true;
      apiSpreadSheet.dowloadJSONFile(JSON.stringify(this.tableDocument.getDocument()), JSONFormat);
    },
    saveDocumentData() {
      const JSONFormat = true;
      apiSpreadSheet.dowloadJSONFile(JSON.stringify(this.tableDocument.serializationDataSection()), JSONFormat);
    },
    evtClickCell(options) {
      const { cellName } = options;
      const selectedCell = this.tableDocument.getCell(cellName);
      if (Object.keys(selectedCell).includes('action')) this.tableDocument.executeAction(cellName);
      if (Object.keys(selectedCell).includes('formula')) this.tableDocument.calculateCellValue(cellName);
    },

    evtDblClickCell(options) {
      const { cellName } = options;
      if (!this.tableDocument.hasEditing(cellName)) return;
      this.editableCell = this.tableDocument.getCell(cellName);
      this.editableCellType = this.tableDocument.getCellType(cellName);
      this.editableCellEvent = options.evt;
      this.editableCellElement = options.evt.target;
      this.editableCellGeometry = options.evt.target.getBoundingClientRect();
      this.$nextTick().then(() => {
        this.$refs.SpreadSheetEditDOM.$el.focus();
      });
    },

    evtKeydownCell(options) {
      this.evtDblClickCell(options);
    },

    clearEditCell() {
      // console.log(this.editableCellElement);
      if (this.editableCellElement) this.editableCellElement.focus();
      this.editableCell = null;
      this.editableCellType = null;
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

    createNewDocument() {
      this.tableDocument = new TableDocumentApi();
      this.tableDocumentTemplate = {};
      this.$refs.SpreadSheet.createNewDocument();
      this.isGrid = true;

      this.isFileTemplateDisabled = false;
      this.isFileDataDisabled = true;
      this.isFileSettingDisabled = true;

      this.fileTemplate = [];
      this.fileSetting = [];
      this.fileData = [];
    },

    openJSONFileTemplate(file) {
      if (!file) return;
      apiSpreadSheet.uploadJSONFile(file).then(async (JSONTemplate) => {
        const { template } = JSON.parse(JSONTemplate);
        // console.log(template);
        // console.log(cells);
        if (template) {
          this.tableDocumentTemplate = new TableDocument({ JSONString: JSONTemplate });
          this.isFileTemplateDisabled = true;
          this.isFileSettingDisabled = false;
        } else {
          const temp = await new TableDocumentApi({ JSONString: JSONTemplate });
          this.tableDocument = temp;
          // console.log(this.tableDocument);
          this.isFileTemplateDisabled = true;
          this.isGrid = false;
        }
      });
    },
    openJSONFileSetting(file) {
      if (!file) return;
      apiSpreadSheet.uploadJSONFile(file).then((JSONSetting) => {
        this.documentSetting = JSONSetting;
        this.isFileSettingDisabled = true;
        this.isFileDataDisabled = false;
      });
    },

    openJSONFileData(file) {
      if (!file) return;
      apiSpreadSheet.uploadJSONFile(file).then((JSONData) => {
        const tableDocument = new TableDocumentApi();
        tableDocument.deserialize(JSONData, this.tableDocumentTemplate, this.documentSetting);
        this.tableDocument = tableDocument;
        this.tableDocument.recalculateFormulas();
        this.isFileDataDisabled = true;
        this.isGrid = false;
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
