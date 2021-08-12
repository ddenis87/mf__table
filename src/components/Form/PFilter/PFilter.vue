<template>
  <div class="filter-extended">
    <div ref="FormFilter"
         class="body">
      <div v-for="item in filterListFields"
           :key="item.key">
        <p-filter-item ref="FilterField" :field-options="item"
                       v-model="fieldsValue[item.key]"
                       @keydown:control="evtKeydownControl"></p-filter-item>
      </div>
    </div>
    <div class="control">
      <btn-form height="24" @click="evtFilterReset">Сбросить все</btn-form>
      <btn-form height="24" @click="evtFilterAccept">Применить</btn-form>
    </div>
    <dialog-modal :is-dialog-show="isSelectionSizeNull"
                  :is-control="true"
                  :is-accept="{ isShow: true, text: 'Отключить' }"
                  :is-cancel="{ isShow: true, text: 'Отменить' }"
                  @dialog:cancel="evtDialogCancel"
                  @dialog:accept="evtDialogFilterOff">
      По заданным условиям записи отсутствуют, отключить фильтры?
    </dialog-modal>
  </div>
</template>

<script>
import DialogModal from '@/components/Dialogs/DialogModal.vue';
import BtnForm from '@/components/Form/Btn/BtnForm.vue';
import PFilterItem from './PFilterItem.vue';

export default {
  name: 'PFilter',
  components: {
    DialogModal,
    BtnForm,
    PFilterItem,
  },
  props: {
    filterList: { type: Object, default: () => {} },
    filterExcluded: { type: Array, default: () => ['id', 'is_deleted', 'is_group', 'parent', 'related'] },
    isOpen: { type: Boolean, default: false },
    selectionSize: { type: Number, default: 0 },
  },
  data() {
    return {
      fieldsValue: {},
      isShowDialog: false,
    };
  },
  computed: {
    isSelectionSizeNull() {
      if (!this.isShowDialog) return false;
      return !!(this.selectionSize === 0 && Object.keys(this.fieldsValue).length);
    },
    filterListFields() {
      const filterListFields = [];
      Object.entries(this.filterList).forEach((element) => {
        const [elementKey, elementValue] = element;
        if (this.filterExcluded.includes(elementKey)) return;
        filterListFields.push({
          key: elementKey,
          value: elementValue,
        });
      });
      return filterListFields;
    },
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        const firstFiled = this.$refs.FormFilter.querySelector('.v-select__slot input');
        setTimeout(() => firstFiled.focus(), 100);
      }
    },
  },
  methods: {
    evtDialogCancel() {
      this.isShowDialog = false;
    },

    evtDialogFilterOff() {
      this.isShowDialog = false;
      this.$emit('reset');
      this.$refs.FilterField.map((field) => field.filterExtendedItemOff());
    },

    evtFilterAccept() {
      this.isShowDialog = true;
      this.$emit('accept', this.getFilterString());
    },

    evtFilterReset() {
      this.isShowDialog = false;
      this.$emit('reset');
      this.$refs.FilterField.map((field) => field.filterExtendedItemReset());
    },

    evtKeydownControl(evt) {
      let nextItem = evt.target.closest('.filter-extended-item').parentElement.nextElementSibling;
      let nextField = nextItem.querySelector('.item__compare input');
      if (evt.shiftKey) {
        nextItem = evt.target.closest('.filter-extended-item').parentElement.previousElementSibling;
        nextField = nextItem.querySelector('.item__data input');
      }
      nextField.dispatchEvent(new Event('click'));
      nextField.focus();
    },

    getFilterString() {
      let fieldsValuesString = '';
      Object.values(this.fieldsValue).forEach((fieldValue) => {
        if (fieldValue) fieldsValuesString += fieldValue;
      });
      return fieldsValuesString;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-extended {
  padding: 0px;
  padding-top: 10px;
  z-index: 999;
  .control {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    padding: 12px 11px;
    border-top: thin solid rgba(128, 128, 128, .4);
  }
}
</style>
