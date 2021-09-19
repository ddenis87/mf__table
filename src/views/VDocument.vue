<template>
  <div class="svod">
    <!-- <spread-sheet-editing ref="SpreadSheetEditDOM"
                          :cell="editableCell"
                          :cell-type="editableCellType"
                          :cell-element="editableCellElement"
                          :edit-event="editableCellEvent"
                          :is-label="isShowEditableLabel"
                          @editing:accept="acceptEditingCell"
                          @editing:cancel="cancelEditingCell"></spread-sheet-editing> -->
    <div class="svod__progresss">
      <!-- <el-progress-bar :is-show="isLoading" :absolute="false"></el-progress-bar> -->
    </div>
    <div class="svod__nav">
      <v-tabs v-model="currentList"
              align-with-title>
        <v-tab v-for="list in lists"
              :key="list.name"
              class="nav-list"
              active-class="nav-list_active">{{ list.title }}</v-tab>
      </v-tabs>
    </div>
    <div class="svod__body">
      <div class="body-table">
        <spread-sheet ref="SpreadSheet"
                      v-bind="spreadSheetProps"
                      :isOuterBorderOff="true"
                      :delta-height-virtual-list="140"
                      :is-show-title="true"
                      :is-show-group="false"
                      table-layout-padding="0px 4px 4px 4px"></spread-sheet>
      </div>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';

import TDocument from '../components/TDocument/TDocument';

export default {
  name: 'VDocument',
  components: {
    SpreadSheet,
  },
  data() {
    return {
      currentList: 0,
      tableDocument: new TDocument(),
    };
  },
  computed: {
    lists() {
      return this.tableDocument.getSheetsList();
    },
    // sheetName() {
    //   return this.lists[this.currentList].name;
    // },
    spreadSheetProps() {
      console.log(this.lists[this.currentList]);
      return {
        ...this.lists[this.currentList],
      };
    },
  },
  async mounted() {
    let template = await import('@/assets/json/svod/templateModify.json');
    template = template.default;
    this.tableDocument.setTemplate(template);
  },
};
</script>
