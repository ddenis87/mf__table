<template>
  <div class="filter-extended">
    <div ref="FormFilter"
         class="body">
      <div v-for="item in listFields"
           :key="item.key">
        <filter-extended-item ref="FilterField" :field-options="item"
                              v-model="fieldsValue[item.key]"
                              @keydown:control="evtKeydownControl"></filter-extended-item>
      </div>
    </div>
    <div class="control">
      <btn-form height="24" @click="evtFilterReset">Сбросить все</btn-form>
      <btn-form height="24" @click="evtFilterAccept">Применить</btn-form>
    </div>
    <dialog-modal :is-dialog-show="isDataTotalCountNull"
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
import api from '@/api/DataTable';

import BtnForm from '@/components/Form/Btn/BtnForm.vue';
import DialogModal from '@/components/Dialogs/DialogModal.vue';
import FilterExtendedItem from './FilterExtendedItem.vue';

export default {
  name: 'FilterExtended',
  components: {
    BtnForm,
    DialogModal,
    FilterExtendedItem,
  },
  props: {
    excludedFields: { type: Array, default() { return ['id', 'is_deleted', 'is_group', 'parent', 'related']; } },
    guid: { type: String, default: null },
    isOpen: { type: Boolean, default: false },
    sourceName: { type: String, default: null },
  },
  data() {
    return {
      fieldsValue: {},
      isShowDialog: false,
    };
  },
  computed: {
    isDataTotalCountNull() {
      const dataCount = api.getDataTotalCount(this.getSendOptions());
      const filterExtend = api.getFilterExtend(this.getSendOptions());
      if (!this.isShowDialog) return false;
      return !!(dataCount === 0 && filterExtend);
    },

    listFields() {
      const listFields = [];
      const listOptions = api.getListOptions(this.sourceName);
      Object.entries(listOptions).forEach((field) => {
        const [fieldKey, fieldValue] = field;
        if (this.excludedFields.includes(fieldKey)) return;
        listFields.push({
          key: fieldKey,
          value: fieldValue,
        });
      });
      return listFields;
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
      console.log('close');
      this.isShowDialog = false;
    },

    evtDialogFilterOff() {
      api.resetFilterExtend(this.getSendOptions(true));
      this.isShowDialog = false;
      this.$emit('accept');
      this.$refs.FilterField.map((field) => field.filterExtendedItemOff());
    },

    evtFilterAccept() {
      api.setFilterExtend(this.getSendOptions());
      this.isShowDialog = true;
      this.$emit('accept');
    },

    evtFilterReset() {
      api.resetFilterExtend(this.getSendOptions(true));
      this.isShowDialog = false;
      this.$emit('accept');
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

    getSendOptions(reset = false) {
      return {
        tableName: this.sourceName,
        guid: this.guid,
        value: (reset) ? null : this.getFilterString(),
      };
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
