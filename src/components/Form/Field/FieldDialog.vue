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
                 :default-filters="filters"
                 @row-selected="evtRowSelected"></component>
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
    itemText: { type: String, default: 'text' },
    items: {
      type: Array,
      default: () => [{
        display_name: 'Значения отсутствуют',
        value: null,
      }],
    },
    itemValue: { type: String, default: 'id' },
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
      const fieldItemsStore = this.$store.getters['DataTable/GET_LIST_DATA']({
        tableName: this.relatedModelName,
      });
      const fieldItems = [];
      fieldItemsStore.forEach((element) => {
        const representation = this.$store.getters['DataTable/GET_LIST_DATA_ITEM_REPRESENTATION']({
          tableName: this.relatedModelName,
          id: element.id,
        });
        fieldItems.push({ ...element, text: representation });
      });
      return fieldItems;
    },
    componentTable() {
      if (!this.isDialogShow) return null;
      if (!this.relatedModelName) return null;
      const sourceName = this.relatedModelName[0].toUpperCase() + this.relatedModelName.slice(1);
      return () => import(`@/components/TheTable/TheTable${sourceName}`);
    },
  },
  watch: {
    fieldValueInput() {
      this.fieldValue = (typeof this.fieldValueInput === 'object'
        && this.fieldValueInput !== null) ? this.fieldValueInput[this.itemValue] : this.fieldValueInput;
    },
  },
  mounted() {
    if (!this.isSelected) return;
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
    evtRowSelected(valueObject) {
      this.$store.dispatch('DataTable/ADDING_DATA_LINK', {
        tableName: this.relatedModelName,
        value: valueObject,
      }).then(() => {
        this.fieldValue = valueObject;
        this.evtInput();
        this.evtCloseDialog();
      });
    },
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    evtKeydownControl(evt) {
      const isOpenCombobox = this.$refs.fieldInput.$el
        .querySelector('.v-input__slot').getAttribute('aria-expanded');
      if (isOpenCombobox === 'false') {
        this.$refs.fieldInput.isMenuActive = false;
        this.$emit('keydown:control', evt);
      }
    },
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
