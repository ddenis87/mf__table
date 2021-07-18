<template>
  <div class="filter-extended">
    <div class="body">
      <div v-for="item in listFields" :key="item.key">
        <filter-extended-item :field-options="item"
                              @keydown:control="evtKeydownControl"></filter-extended-item>
      </div>
    </div>
    <div class="control">
      <btn-form height="24">Сбросить все</btn-form>
      <btn-form height="24">Применить</btn-form>
    </div>
  </div>
</template>

<script>
import BtnForm from '@/components/Form/Btn/BtnForm.vue';
import FilterExtendedItem from './FilterExtendedItem.vue';

export default {
  name: 'FilterExtended',
  components: { FilterExtendedItem, BtnForm },
  props: {
    sourceName: { type: String, default: null },
    guid: { type: String, default: null },
    excludedFields: { type: Array, default() { return ['id', 'is_deleted', 'is_group', 'parent', 'related']; } },
  },
  computed: {
    listFields() {
      const listFields = [];
      const listOptions = this.$store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: this.sourceName });
      Object.entries(listOptions).forEach((field) => {
        const [fieldKey, fieldValue] = field;
        if (this.excludedFields.includes(fieldKey)) return;
        listFields.push({
          key: fieldKey,
          value: fieldValue,
        });
      });
      console.log(listFields);
      return listFields;
    },
  },
  methods: {
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
    padding: 5px 11px;
    border-top: thin solid rgba(128, 128, 128, .4);
  }
}
</style>
