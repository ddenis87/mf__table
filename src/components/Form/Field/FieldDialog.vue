<template>
  <div class="field">
    <v-autocomplete ref="fieldInput"
                    class="field-item choice"
                    return-object
                    no-data-text="Значение отсутствует"
                    append-icon="mdi-dots-horizontal"
                    :rules="(isRequired) ? [rules.required] : []"
                    :items="fieldItems"
                    :item-text="itemText"
                    :item-value="itemValue"
                    v-bind="fieldPropsNested"
                    v-model="fieldValue"
                    @click.stop
                    @click:append="evtOpenDialog"
                    @input="evtInput"
                    @keydown="evtKeydown"
                    @keydown.enter="evtKeydownControl"
                    @keydown.esc="evtKeydownControl"
                    @keydown.tab="evtKeydownControl"
                    @blur="evtBlur"
                    @focus="evtFocus"></v-autocomplete>
    <dialog-full :is-dialog-name="dialogName"
                 :is-dialog-show="isDialogShow"
                 @close="evtCloseDialog">
      <component :is="componentTable"
                 :isEditableInline="false"
                 :default-filters="filters"></component>
    </dialog-full>
  </div>
</template>

<script>
import DialogFull from '@/components/Dialogs/DialogFull.vue';

import fieldModel from './FieldModel';
import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldDialog',
  components: {
    DialogFull,
  },
  model: {
    ...fieldModel,
  },
  props: {
    ...fieldProps,
    itemText: { type: String, default: 'display_name' },
    items: {
      type: Array,
      default: () => [{
        display_name: 'Значения отсутствуют',
        value: null,
      }],
    },
    itemValue: { type: String, default: 'value' },
    relatedModelName: { type: String, default: null },
    filters: null,
  },
  data() {
    return {
      fieldValue: '',
      rules: {
        required(value) { return !!value || false; },
      },
      isDialogShow: false,
    };
  },
  computed: {
    ...fieldComputed,
    dialogName() {
      return this.$store.getters['DataTable/GET_DESCRIPTION']({
        tableName: this.relatedModelName,
      });
    },
    fieldItems() {
      return this.items;
    },
    componentTable() {
      if (!this.isDialogShow) return null;
      if (!this.relatedModelName) return null;
      return () => import(`@/components/TheTable/TheTable${this.relatedModelName[0].toUpperCase() + this.relatedModelName.slice('1')}`);
    },
  },
  mounted() {
    const element = this.$refs.fieldInput.$el.querySelector('input');
    setTimeout(() => {
      element.select();
      element.focus();
    }, 50);
  },
  methods: {
    evtOpenDialog() {
      this.isDialogShow = true;
    },
    evtCloseDialog() {
      this.$refs.fieldInput.focus();
      setTimeout(() => {
        this.isDialogShow = false;
      }, 30);
    },
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    evtKeydownControl() {},
    evtFocus() {},
    evtBlur(evt) {
      evt.preventDefault();
      if (!this.isDialogShow) {
        this.$emit('blur:input', evt);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Field.scss';

::v-deep {
  .v-input__slot {
    padding: 0px !important;
  }
  input {
    min-width: 46px !important;
  }
}
</style>
