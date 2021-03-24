<template>
  <div class="el-field el-field-history">
    <v-text-field class="el-field__item"
                  :dense="isDense" :loading="isLoadingData"
                  :single-line="isSingleLine"
                  :solo="isHideUnderline"
                  :flat="isHideUnderline"
                  :hide-details="isHideMessage"
                  :disabled="isDisabled"
                  :clearable="isBtnClear"
                  :label="fieldLabel"
                  :rules="fieldRequired"
                  v-model="fieldValue"
                  @keydown.tab="eventKeydownTab"
                  @keydown.enter="eventKeydownEnter"
                  @keydown.esc="eventKeydownEsc"
                  @click:clear="eventClear"
                  @blur="eventBlur">
      <template v-slot:append>
        <el-btn-icon-small icon="mdi-history" @click="openDialog">Открыть историю изменений</el-btn-icon-small>
      </template>
      <template v-slot:progress>
        <v-progress-linear v-if="isLoadingData" indeterminate absolute></v-progress-linear>
      </template>
    </v-text-field>
    <dialog-modal is-dialog-name="История изменений"
                  :width="700"
                  :is-dialog-show="isShowDialog"
                  @close-dialog="closeDialog">
      <v-card class="history-table">
        <data-table-single :headers="tableHeader" :items="tableItem"></data-table-single>
      </v-card>
    </dialog-modal>
  </div>
</template>

<script>
import ElProgressBar from '@/components/Elements/ElProgressBar/ElProgressBar.vue';
import DialogModal from '@/components/Dialogs/DialogModal.vue';
import DataTableSingle from '@/components/DataTableSingle/DataTableSingle.vue';

import { ElField } from './ElFiled.js';
// import { ElFieldHistory } from './ElFieldHistory.js';
export default {
  name: 'ElFieldHistory',
  mixins: [
    ElField,
    // ElFieldHistory,
  ],
  components: {
    ElProgressBar,
    DialogModal,
    DataTableSingle,
  },
  props: {
    // isDisabled: { type: Boolean, default: true },
    isBtnClear: { type: Boolean, default: false },
    idElement: { type: Number, default: null },
    relatedModelName: { type: String, default: null },
  },
  data() {
    return {
      fieldValue: '',
      isLoadingData: false,
      isShowDialog: false,
      tableHeader: [
        {value: 'start_date', text: 'Период', 'position_in_template': 'grid-area: start_date', width: [100, 200]},
        {value: 'some_desc', text: 'Значение', 'position_in_template': 'grid-area: some_desc', width: [100, ]},
      ],
      tableItem: [],
      //   {value: 'Редактирование КПП', period: '01.01.2021'},
      //   {value: 'Добавление ИНН', period: '03.03.2021'},
      // ],
    }
  },
  computed: {
    // async tableItem() {
    //   if (this.isShowDialog) {
    //     await this.$store.dispatch('DataTable/HISTORY_REQUEST_DATA',{
    //       tableName: this.relatedModelName,
    //       mode: 'element_list',
    //       id: this.idElement
    //     })
    //     .then(items => {
    //       console.log(items);
    //     })
    //   }
    //   return [];
    // },
  },
  async created() {
    if (!this.idElement) return;
    this.isLoadingData = true;
    let relatedModelView = this.$store.getters['DataTable/GET_RELATED_MODEL_VIEW']({ tableName: this.relatedModelName });
    let templateValue = relatedModelView.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1).split('}{');
    await this.$store.dispatch('DataTable/HISTORY_REQUEST_DATA',{
      tableName: this.relatedModelName,
      mode: 'element',
      id: this.idElement
    })
      .then(element => {
        let newValue = relatedModelView;
        templateValue.forEach(item => {
          newValue = newValue.replace(`{${item}}`, element[item]);
        });
        console.log(newValue);
        this.fieldValue = newValue;
        this.isLoadingData = false;
        this.loadHistoryDataList();
      })
    
  },
  methods: {
    async loadHistoryDataList() {
      await this.$store.dispatch('DataTable/HISTORY_REQUEST_DATA',{
          tableName: this.relatedModelName,
          mode: 'element_list',
          id: this.idElement
        })
        .then(response => {
          console.log(response.results);
          this.tableItem = response.results;
        })
    },
    openDialog() {
      this.isShowDialog = true;
    },
    closeDialog() {
      this.isShowDialog = false;
    },
  }
}
</script>

<style lang="scss">
@import './ElField.scss';
.history-table {
  padding: 2px;
}
</style>