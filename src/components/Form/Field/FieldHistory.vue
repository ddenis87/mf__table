<template>
  <div class="field">
    <v-text-field ref="fieldInput"
                  class="field-item history"
                  v-bind="fieldPropsNested"
                  :append-icon="'mdi-history'"
                  :rules="(isRequired) ? [rules.required] : []"
                  v-model="fieldValue"
                  @click:append="evtOpenDialog"
                  @keydown.stop.enter="evtKeydownControl"
                  @blur="evtBlur">
      <template v-slot:progress>
        <v-progress-linear v-if="isLoadingData"
                           indeterminate
                           absolute></v-progress-linear>
      </template>
    </v-text-field>
    <dialog-modal class="history-dialog"
                  is-dialog-name="История изменений"
                  :width="800"
                  :is-dialog-show="isDialogShow"
                  @close-dialog="evtCloseDialog">
      <v-card class="history-table">
        <div class="history-table__control">
          <data-table-control v-bind="propsControl"
                              :filters-form="filterTable"
                              type-control="informationRegister"></data-table-control>
        </div>
        <div class="history-table__body">
          <component :is="componentTable" class="table"
                     :default-filters="filterTable"
                     @component-mounted="evtMountTable"></component>
        </div>
      </v-card>
    </dialog-modal>
  </div>
</template>

<script>
import DialogModal from '@/components/Dialogs/DialogModal.vue';
import DataTableControl from '@/components/DataTableControls/DataTableControl.vue';

import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldHistory',
  components: {
    DialogModal,
    DataTableControl,
  },
  props: {
    ...fieldProps,
    relatedModelName: { type: String, default: null },
    filters: null,
    dimension: { type: String, default: '' },
    dimensionValue: { type: [String, Number, Object], default: null },
    idElement: { type: Number, default: null },
  },
  data() {
    return {
      fieldValue: '',
      rules: {
        required(value) { return !!value || false; },
      },
      isDialogShow: false,
      guid: null,
    };
  },
  computed: {
    ...fieldComputed,
    componentTable() {
      console.log(this.$props);
      if (!this.relatedModelName) return null;
      const sourceName = this.relatedModelName[0].toUpperCase() + this.relatedModelName.slice(1);
      return () => import(`@/components/TheTable/TheTable${sourceName}`);
    },
    propsControl() {
      return {
        'table-name': this.relatedModelName,
        guid: this.guid,
      };
    },
    filterTable() {
      return { [this.dimension]: this.dimensionValue || '' };
    },
  },
  async created() {
    if (!this.idElement) return;
    this.isLoadingData = true;
    const relatedModelView = this.$store.getters['DataTable/GET_RELATED_MODEL_VIEW']({ tableName: this.relatedModelName });
    const templateValue = relatedModelView.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1)
      .split('}{');
    await this.$store.dispatch('DataTable/HISTORY_REQUEST_DATA', {
      tableName: this.relatedModelName,
      mode: 'element',
      id: this.idElement,
    })
      .then((element) => {
        let newValue = relatedModelView;
        // console.log(element);
        templateValue.forEach((item) => {
          newValue = newValue.replace(`{${item}}`, element[item]);
        });
        // console.log(newValue);
        if (newValue !== 'undefined') {
          this.fieldValue = newValue;
        } else {
          this.fieldValue = '';
        }
        this.isLoadingData = false;
      });
  },
  methods: {
    evtMountTable(option) {
      this.guid = option.guid;
    },
    evtOpenDialog() {
      this.isDialogShow = true;
    },
    evtCloseDialog() {
      this.isDialogShow = false;
    },
    evtKeydownControl(evt) { this.$emit('keydown:control', evt); },
    evtBlur(evt) { this.$emit('blur:input', evt); },
  },
};
</script>

<style lang="scss" scoped>

</style>
