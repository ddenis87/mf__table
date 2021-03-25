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
                  :width="800"

                  :is-dialog-show="isShowDialog"
                  @close-dialog="closeDialog">
      <!-- <v-card class="history-table"> -->
        <component :is="componentTable"
                   :default-filters="filters"></component>
      <!-- </v-card> -->
    </dialog-modal>
  </div>
</template>

<script>
import DialogModal from '@/components/Dialogs/DialogModal.vue';

import { ElField } from './ElFiled.js';
export default {
  name: 'ElFieldHistory',
  mixins: [
    ElField,
  ],
  components: {
    DialogModal,
  },
  props: {
    // isDisabled: { type: Boolean, default: true },
    isBtnClear: { type: Boolean, default: false },
    idElement: { type: Number, default: null },
    relatedModelName: { type: String, default: null },

    // filters: null,
  },
  data() {
    return {
      fieldValue: '',
      isLoadingData: false,
      isShowDialog: false,
      filters: (this.idElement) ? {related: this.idElement} : null,
    }
  },
  computed: {
    componentTable() {
      if (!this.isShowDialog) return null;
      if (!this.relatedModelName) return null;
      return () => import(`@/components/TheTable/TheTable${this.relatedModelName[0].toUpperCase() + this.relatedModelName.slice(1)}`);
    }
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
        console.log(element);
        templateValue.forEach(item => {
          newValue = newValue.replace(`{${item}}`, element[item]);
        });
        console.log(newValue);
        if (newValue != 'undefined') {
          this.fieldValue = newValue;
        } else {
          this.fieldValue = '';
        }
        this.isLoadingData = false;
      })
  },
  methods: {
    // async loadHistoryDataList() {
    //   await this.$store.dispatch('DataTable/HISTORY_REQUEST_DATA',{
    //       tableName: this.relatedModelName,
    //       mode: 'element_list',
    //       id: this.idElement
    //     })
    //     .then(response => {
    //       console.log(response.results);
    //       this.tableItem = response.results;
    //     })
    // },
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