<template>
  <div class="svod">
    <spread-sheet-editing ref="SpreadSheetEditDOM"
                          :cell="editableCell"
                          :cell-type="editableCellType"
                          :cell-element="editableCellElement"
                          :edit-event="editableCellEvent"
                          :is-label="isShowEditableLabel"
                          @editing:accept="acceptEditingCell"
                          @editing:cancel="cancelEditingCell"></spread-sheet-editing>
    <div class="svod__progresss">
      <el-progress-bar :is-show="isLoading" :absolute="false"></el-progress-bar>
    </div>
    <div class="svod__nav">
      <v-tabs v-model="currentList"
              align-with-title>
        <v-tab v-for="list in lists"
              :key="list.name"
              class="nav-list"
              active-class="nav-list_active">{{ list.nameView }}</v-tab>
      </v-tabs>
    </div>
    <div class="svod__body">
      <div class="body-table">
        <spread-sheet ref="SpreadSheet"
                      v-bind="spreadSheetProps"
                      :isOuterBorderOff="true"
                      :delta-height-virtual-list="140"
                      :is-show-title="false"
                      :is-show-group="false"
                      table-layout-padding="0px 4px 4px 4px"
                      @click:cell="evtClickCell"
                      @dblclick:cell="evtDblClickCell"
                      @keydown:cell="evtKeydownCell"
                      @scroll:body="scrollBody"></spread-sheet>
      </div>
      <!-- <v-tabs-items v-model="currentList">
        <v-tab-item :transition="false"
                    v-for="list in lists"
                    :key="list.name">
          <div class="body-table">
            <spread-sheet ref="SpreadSheet"
                          v-bind="spreadSheetProps"
                          :isOuterBorderOff="true"
                          :delta-height-virtual-list="136"
                          :is-show-title="false"
                          :is-show-group="false"
                          table-layout-padding="0px 4px 4px 4px"
                          @click:cell="evtClickCell"
                          @dblclick:cell="evtDblClickCell"
                          @keydown:cell="evtKeydownCell"
                          @scroll:body="scrollBody"></spread-sheet>
          </div>
        </v-tab-item>
      </v-tabs-items> -->
    </div>
  </div>
</template>

<script>
import ElProgressBar from '@/components/Elements/ElProgressBar/ElProgressBar.vue';
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
import SpreadSheetEditing from '@/components/SpreadSheetEditing/SpreadSheetEditing.vue';

// import api from '@/logics/ApiRest';
import apiSpreadSheet from '@/plugins/apiSpreadSheet/apiSpreadSheet';
import TableDocumentApi from '@/components/TableDocument/TableDocumentApi';
// import TableDocumentGeneralError from '@/components/TableDocument/TableDocumentGeneralError';

export default {
  name: 'Svod',
  components: {
    ElProgressBar,
    SpreadSheet,
    SpreadSheetEditing,
  },
  data() {
    return {
      // lists: [
      //   { name: 'list1', value: 'Нежилые помещения' },
      //   { name: 'list2', value: 'Лист 2' },
      //   { name: 'list3', value: 'Лист 3' },
      // ],
      currentList: 0,
      tableDocument: new TableDocumentApi(),
      // tableDocument_list2: new TableDocumentApi({ rowCount: 100, columnCount: 30 }),
      // tableDocument_list3: new TableDocumentApi({ rowCount: 100, columnCount: 30 }),

      editableCell: null,
      editableCellType: 'string',
      editableCellEvent: null,
      editableCellElement: null,
      editableCellGeometry: null,
      isShowEditableLabel: false,

      isLoading: false,
    };
  },
  computed: {
    sheetName() {
      return this.lists[this.currentList].name;
    },
    lists() {
      const lists = [];
      this.tableDocument.sheetsList.forEach((sheet) => {
        lists.push({
          name: sheet.name,
          nameView: sheet.nameView,
        });
      });
      return lists;
    },
    // spreadSheetProps() {
    //   return {
    //     ...this[`tableDocument_list${this.currentList + 1}`],
    //     'is-show-grid': !(this[`tableDocument_list${this.currentList + 1}`].documentTemplate),
    //   };
    // },
    spreadSheetProps() {
      return {
        ...this.tableDocument,
        ...this.tableDocument.getPropsForView(this.sheetName),
        'is-show-grid': false,
      };
    },
  },
  watch: {
    currentList() {
      this.tableDocument.recalculateFormulas();
      this.tableDocument.recalculateFormulas(); // косяк в получении формул
    },
  },
  async created() {
    await this.$store.dispatch('Lists/readList', 'region');
    await this.$store.dispatch('Lists/readList', 'kodLgot');
    // await this.$store.dispatch('DataTable/REQUEST_OPTIONS', { tableName: 'organization' });
  },
  async mounted() {
    this.isLoading = true;
    const tableDocumentPrepare = new TableDocumentApi();
    let template = await import('@/assets/json/svod/templateMultiGood.json');
    template = template.default;
    // console.log(template);
    if (template.type === 'document') {
      this.tableDocument = new TableDocumentApi(template);
      await this.tableDocument.prepareRepresentation();
      this.tableDocument.recalculateFormulas();
      this.currentList = '0';
      console.log(this.tableDocument);
      this.isLoading = false;
      return;
    }
    tableDocumentPrepare.setTableDocumentTemplate(template);
    let settings = await import('@/assets/json/svod/settingsMulti.json');
    settings = settings.default;
    tableDocumentPrepare.setTableDocumentSettings(settings);
    let data = await import('@/assets/json/svod/dataMulti.json');
    data = data.default;
    // try {
    await tableDocumentPrepare.deserialize(data);
    // } catch (err) {
    //   if (err instanceof TableDocumentGeneralError) {
    //     this.showDialogMessage(err.getMessagesText());
    //   }
    // // console.log(err);
    // } finally {
    this.tableDocument = tableDocumentPrepare;
    this.tableDocument.recalculateFormulas();
    this.currentList = '0';
    this.isLoading = false;
    // }
    console.log(this.tableDocument);
  },
  methods: {
    evtClickCell(options) {
      const { cellName } = options;
      const action = this.tableDocument.getCellAction(this.sheetName, cellName);
      if (!action) return;
      if (Object.keys(this).includes(action)) {
        this[action]();
        return;
      }
      // try {
      this.tableDocument.executeCellAction(this.sheetName, cellName);
      // } catch (err) {
      // this.showDialogMessage(err.getMessagesText());
      // }
      // if (scripts) {
      //   // console.log(scripts);
      //   const { action } = scripts;
      //   // console.log(action);
      //   // console.log(Object.keys(this));
      //   if (Object.keys(this).includes(action)) {
      //     this[action]();
      //     return;
      //   }
      // }
      // if (cellName) {
      //   try {
      //     // this.tableDocument.actionCell(cellName, this.sheetName);
      //   } catch (err) {
      //     this.showDialogMessage(err.getMessagesText());
      //   }
      // }
    },
    evtDblClickCell(options) {
      const { cellName } = options;
      if (!this.tableDocument.hasEditing(this.sheetName, cellName)) {
        return;
      }
      this.editableCell = this.tableDocument.getCell(this.sheetName, cellName);
      this.editableCellType = this.tableDocument.getCellType(this.sheetName, cellName);
      this.editableCellEvent = options.evt;
      this.editableCellElement = options.evt.target;
      this.editableCellGeometry = options.evt.target.getBoundingClientRect();
      this.$nextTick().then(() => {
        this.$refs.SpreadSheetEditDOM.$el.focus();
      });
    },
    showDialogMessage(message) {
      this.isDialogMessageShow = true;
      this.isDialogMessageText = message;
    },
    closeDialogMessage() {
      this.isDialogMessageShow = false;
      this.isDialogMessageText = null;
    },
    evtKeydownCell(options) {
      this.evtDblClickCell(options);
    },

    clearEditCell() {
      if (this.editableCellElement) this.editableCellElement.focus();
      this.editableCell = { value: null };
      this.editableCellType = 'string';
      this.editableCellEvent = null;
      this.editableCellElement = null;
      this.isShowEditableLabel = false;
    },
    scrollBody() { // убрать в компонент ???
      if (this.editableCellElement) {
        const cellName = this.editableCellElement.getAttribute('data-name');
        const cellEdit = this.$refs.SpreadSheet.$el.querySelector(`[data-name="${cellName}"]`).getBoundingClientRect();
        if ((this.editableCellGeometry.left > cellEdit.left + 10
          || this.editableCellGeometry.left < cellEdit.left - 10)
          || (this.editableCellGeometry.top > cellEdit.top
          || this.editableCellGeometry.top < cellEdit.top)) {
          this.isShowEditableLabel = true;
        } else {
          this.isShowEditableLabel = false;
        }
      } else {
        this.isShowEditableLabel = false;
      }
    },
    acceptEditingCell(option) {
      // console.log(option);
      try {
        this.tableDocument.editingCell(this.sheetName, option.cellName, option.value);
      } catch (err) {
        console.log(err);
        this.showDialogMessage(err.getMessagesText());
      } finally {
        console.log('acsept and clear');
        this.clearEditCell();
      }
      this.tableDocument.recalculateFormulas();
      console.log(this.tableDocument);
    },
    cancelEditingCell() {
      console.log('cancel edit');
      this.clearEditCell();
    },

    save() {
      const JSONFormat = true;
      apiSpreadSheet.dowloadJSONFile(JSON.stringify(this.tableDocument.serializationDataSection()), JSONFormat);
    },
    print() {
      localStorage.setItem('SpreadSheetTableDocument', this.tableDocument.getDocument(this.sheetName, true));
      const pagePrint = this.$router.resolve({
        name: 'SpreadSheetPrint',
      });
      window.open(pagePrint.href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.svod {
  display: grid;
  grid-template-areas: "progresss" "nav" "body";
  grid-template-rows: 4px 44px 1fr;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;

  .svod__progresss {
    grid-area: progresss;
    overflow: hidden;
  }
  .svod__body {
    grid-area: body;
    // padding: 5px;
    // background-color: wheat;
    overflow: hidden;
  }

  .svod__nav {
    grid-area: nav;
    display: flex;
    align-items: center;
    overflow: hidden;
    // background-color: cadetblue;
  }

  .body-table {
    display: flex;
    // height: 100%;
    height: calc(100vh - 112px);
  }

  // .nav-list {
  //   background-color: rgb(238, 238, 238);
  //   border-left: thin solid rgb(225, 225, 225);
  //   &_active {
  //     background-color: white;
  //     box-shadow: 2px 0px 5px rgb(174, 174, 174), -2px 0px 5px rgb(174, 174, 174);
  //     z-index: 1;
  //   }
  // }
}
</style>
