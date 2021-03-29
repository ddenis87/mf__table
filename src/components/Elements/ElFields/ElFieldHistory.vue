<template>
  <div class="el-field el-field-history">
    <v-text-field class="el-field__item"
                  :dense="isDense" :loading="isLoadingData"
                  :single-line="isSingleLine"
                  :solo="isHideUnderline"
                  :flat="isHideUnderline"
                  :hide-details="isHideMessage"
                  :disabled="(dimensionValue) ? false : true"
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
      <v-card height="400" class="history-table">
        <div class="history-table__control">
          <data-table-control v-bind="propertiesControl"
                              :filters-form="filter"
                              type-control="informationRegister"></data-table-control>
        </div>
        <div class="history-table__body">
          <component :is="componentTable"
                     :default-filters="filter"
                     @component-mounted="mountedTable"></component>
        </div>
        
      </v-card>
    </dialog-modal>
  </div>
</template>

<script>
import DialogModal from '@/components/Dialogs/DialogModal.vue';
import DataTableControl from '@/components/DataTableControls/DataTableControl.vue';


import { ElField } from './ElField.js';
import { DataTableControl_DataTable } from '@/componentsInteraction/DataTableControl_DataTable.js';
export default {
  name: 'ElFieldHistory',
  mixins: [
    ElField,
    DataTableControl_DataTable,
  ],
  components: {
    DialogModal,
    DataTableControl,
  },
  props: {
    // isDisabled: { type: Boolean, default: true },
    isBtnClear: { type: Boolean, default: false },
    // idElement: { type: Number, default: null },
    relatedModelName: { type: String, default: null },

    // isEditable: { type: Boolean, default: false },
    dimension: { type: String, default: '' },
    dimensionValue: null, // { type: String, default: '' },
  },
  data() {
    return {
      tableName: this.relatedModelName,
      guid: null,
      fieldValue: '',
      isLoadingData: false,
      isShowDialog: false,
      // filtersForm: (this.idElement) ? {related: this.idElement} : null,
      isEditable: false,
    }
  },
  computed: {
    filter() {
      return { [this.dimension]: this.dimensionValue };
    }
    // componentTable() {
    //   if (!this.isShowDialog) return null;
    //   if (!this.relatedModelName) return null;
    //   // if (!this.idElement) return null
    //   return () => import(`@/components/TheTable/TheTable${this.relatedModelName[0].toUpperCase() + this.relatedModelName.slice(1)}`);
    // }
  },
  async created() {
    this.getCurrentHistoryValue();
    // if (!this.dimensionValue) return;
    // this.isLoadingData = true;
    // let relatedModelView = this.$store.getters['DataTable/GET_RELATED_MODEL_VIEW']({ tableName: this.relatedModelName });
    // let templateValue = relatedModelView.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1).split('}{');
    // await this.$store.dispatch('DataTable/HISTORY_REQUEST_DATA',{
    //   tableName: this.relatedModelName,
    //   mode: 'element',
    //   id: this.dimensionValue
    // })
    //   .then(element => {
    //     let newValue = relatedModelView;
    //     // console.log(element);
    //     templateValue.forEach(item => {
    //       newValue = newValue.replace(`{${item}}`, element[item]);
    //     });
    //     // console.log(newValue);
    //     if (newValue != 'undefined') {
    //       this.fieldValue = newValue;
    //     } else {
    //       this.fieldValue = '';
    //     }
    //     this.isLoadingData = false;
    //   })
  },
  mounted() {
    console.log(this.fieldValue);
    console.log(this.filter);
    // console.log(this.idElement);
    console.log(this.relatedModelName);

  },
  methods: {
    openDialog() {
      this.isShowDialog = true;
    },
    
    closeDialog() {
      this.isShowDialog = false;
      this.getCurrentHistoryValue();
    },

    async getCurrentHistoryValue() {
      if (!this.dimensionValue) return;
      this.isLoadingData = true;
      let relatedModelView = this.$store.getters['DataTable/GET_RELATED_MODEL_VIEW']({ tableName: this.relatedModelName });
      let templateValue = relatedModelView.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1).split('}{');
      await this.$store.dispatch('DataTable/HISTORY_REQUEST_DATA',{
        tableName: this.relatedModelName,
        mode: 'element',
        id: this.dimensionValue
      })
        .then(element => {
          let newValue = relatedModelView;
          // console.log(element);
          templateValue.forEach(item => {
            newValue = newValue.replace(`{${item}}`, element[item]);
          });
          // console.log(newValue);
          if (newValue != 'undefined') {
            this.fieldValue = newValue;
          } else {
            this.fieldValue = '';
          }
          this.isLoadingData = false;
        })
    }
  }
}
</script>

<style lang="scss">
@import './ElField.scss';
.history-table {
  display: grid;
  grid-template-areas: "control" "body";
  grid-template-columns: 1fr;
  grid-template-rows: 44px 1fr;
  width: 100%;
  height: 100%;
  padding: 5px;
  gap: 8px;
  &__control {
    grid-area: control;
  }
  &__body {
    width: 100%;
    height: 100%;
  }
}
</style>