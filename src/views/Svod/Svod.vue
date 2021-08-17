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
    <div class="svod__body">
      <v-tabs-items v-model="currentList">
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
      </v-tabs-items>
    </div>
    <div class="svod__nav">
      <v-tabs v-model="currentList"
              align-with-title>
        <v-tab v-for="list in lists"
              :key="list.name"
              class="nav-list"
              active-class="nav-list_active">{{ list.value }}</v-tab>
      </v-tabs>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';
import SpreadSheetEditing from '@/components/SpreadSheetEditing/SpreadSheetEditing.vue';

// import api from '@/logics/ApiRest';
import TableDocumentApi from '@/components/TableDocument/TableDocumentApi';
import TableDocumentGeneralError from '@/components/TableDocument/TableDocumentGeneralError';

export default {
  name: 'Svod',
  components: {
    SpreadSheet,
    SpreadSheetEditing,
  },
  data() {
    return {
      lists: [
        { name: 'list1', value: 'Нежилые помещения' },
        { name: 'list2', value: 'Лист 2' },
        { name: 'list3', value: 'Лист 3' },
      ],
      currentList: 0,
      tableDocument_list1: new TableDocumentApi(),
      tableDocument_list2: new TableDocumentApi({ rowCount: 100, columnCount: 30 }),
      tableDocument_list3: new TableDocumentApi({ rowCount: 100, columnCount: 30 }),

      editableCell: null,
      editableCellType: 'string',
      editableCellEvent: null,
      editableCellElement: null,
      editableCellGeometry: null,
      isShowEditableLabel: false,
    };
  },
  computed: {
    spreadSheetProps() {
      return {
        ...this[`tableDocument_list${this.currentList + 1}`],
        'is-show-grid': !(this[`tableDocument_list${this.currentList + 1}`].documentTemplate),
      };
    },
  },
  async created() {
    await this.$store.dispatch('Lists/readList', 'region');
    // await this.$store.dispatch('DataTable/REQUEST_OPTIONS', { tableName: 'organization' });
  },
  async mounted() {
    const tableDocumentPrepare = new TableDocumentApi();
    let template = await import('@/assets/json/svod/template.json');
    template = template.default;
    tableDocumentPrepare.setTableDocumentTemplate(template);
    let settings = await import('@/assets/json/svod/settings.json');
    settings = settings.default;
    tableDocumentPrepare.setTableDocumentSettings(settings);
    let data = await import('@/assets/json/svod/data.json');
    data = data.default;
    try {
      await tableDocumentPrepare.deserialize(data);
    } catch (err) {
      if (err instanceof TableDocumentGeneralError) {
        this.showDialogMessage(err.getMessagesText());
      }
      console.log(err);
    } finally {
      this.tableDocument_list1 = tableDocumentPrepare;
      this.tableDocument_list1.recalculateFormulas();
    }
  },
  methods: {
    evtClickCell(options) {
      const { cellName } = options;
      const { scripts } = this.tableDocument_list1.getCell(cellName);
      if (scripts) {
        // console.log(scripts);
        const { action } = scripts;
        // console.log(action);
        // console.log(Object.keys(this));
        if (Object.keys(this).includes(action)) {
          this[action]();
          return;
        }
      }
      if (cellName) {
        try {
          this.tableDocument_list1.actionCell(cellName);
        } catch (err) {
          this.showDialogMessage(err.getMessagesText());
        }
      }
    },
    evtDblClickCell(options) {
      const { cellName } = options;
      if (!this.tableDocument_list1.hasEditing(cellName)) {
        return;
      }
      this.editableCell = this.tableDocument_list1.getCell(cellName);
      this.editableCellType = this.tableDocument_list1.getCellType(cellName);
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
      this.editableCell = null;
      this.editableCellType = 'string';
      this.editableCellEvent = null;
      this.editableCellElement = null;
      this.isShowEditableLabel = false;
    },
    scrollBody() { // убрать в компонент ???
      if (this.editableCellElement) {
        const cellName = this.editableCellElement.getAttribute('data-name');
        const cellEdit = this.$refs.SpreadSheet[this.currentList].$el.querySelector(`[data-name="${cellName}"]`).getBoundingClientRect();
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
      try {
        this.tableDocument_list1.editingCell(option.cellName, option.value);
      } catch (err) {
        console.log(err);
        this.showDialogMessage(err.getMessagesText());
      } finally {
        this.clearEditCell();
      }
    },
    cancelEditingCell() {
      this.clearEditCell();
    },

    print() {
      localStorage.setItem('SpreadSheetTableDocument', this.tableDocument_list1.getDocument(true));
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
  grid-template-areas: "nav" "body";
  grid-template-rows: 44px 1fr;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;

  .svod__body {
    grid-area: body;
    // padding: 5px;
    background-color: wheat;
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
    height: calc(100vh - 108px);
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
