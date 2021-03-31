<template>
  <div class="el-field el-field-history">
    <v-text-field class="el-field__item"
                  v-bind="propsField"
                  :loading="isLoadingData"
                  :disabled="(dimensionValue) ? false : true"
                  v-model="fieldValue"
                  @keydown.stop.enter="eventKeydownEnter"
                  @blur="eventBlurField">
      <div class="el-field__anchor" tabindex="-1"></div>
      <template v-slot:append>
        <el-btn-icon-small icon="mdi-history" @click="openDialog">Открыть историю изменений</el-btn-icon-small>
      </template>
      <template v-slot:progress>
        <v-progress-linear v-if="isLoadingData" indeterminate absolute></v-progress-linear>
      </template>
    </v-text-field>
    <dialog-modal class="history-dialog"
                  is-dialog-name="История изменений"
                  :width="800"
                  :is-dialog-show="isShowDialog"
                  @close-dialog="closeDialog">
      <v-card class="history-table">
        <div class="history-table__control">
          <data-table-control v-bind="propertiesControl"
                              :filters-form="filter"
                              type-control="informationRegister"></data-table-control>
        </div>
        <div class="history-table__body">
          <component :is="componentTable" class="table"
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
import { ElFieldProps } from './ElFieldProps.js';
import { DataTableControl_DataTable } from '@/componentsInteraction/DataTableControl_DataTable.js';

export default {
  name: 'ElFieldHistory',
  mixins: [
    ElField,
    ElFieldProps,
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
  },
  async created() {
    this.getCurrentHistoryValue();
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
    },

    eventKeydownEnter(event) {
      this.emitKeydown(event);
    },

    eventBlurField() {},
  }
}
</script>

<style lang="scss">
@import './ElField.scss';
.el-field-history {
  outline: none;
}
.history-table {
  position: relative;
  display: grid;
  grid-template-areas: "control" "body";
  grid-template-columns: 1fr;
  grid-template-rows: 44px 1fr;
  width: 100%;
  height: 400px;
  padding: 5px;
  gap: 8px;

  &__control {
    grid-area: control;
    z-index: 100;
  }
  &__body {

    grid-area: body;
    width: 100%;
    height: 338px;
    z-index: 50;
    // border: thin solid red;
  }
}
</style>