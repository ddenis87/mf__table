<template>
  <div class="footer" :class="`footer_${typeColumn}`">
    Всего записей в базе по таблице: {{ listDataCount }}, загружено и показано: {{ listDataCountLoad }}
  </div>
</template>

<script>
export default {
  name: 'DataTableFooter',
  props: {
    // tableName: { type: String, default: '' },
    typeColumn: { type: String, default: 'fixed' },
    listDataCount: { type: Number, default: 0 },
    listDataCountLoad: { type: Number, default: 0 },
  },
  computed: {
    // gettingCountRowInBase() {
    //   return this.$store.getters[`DataTable/GET_DATA_COUNT_TOTAL`](this.tableName);
    // },
    // gettingCountRowLoad() {
    //   return this.$store.getters[`DataTable/GET_DATA_COUNT_LOAD`](this.tableName);
    // }
  },
}
</script>

<style lang="scss" scoped>
@import './DataTableFooter.scss';

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 40px;
  border-top: $border;
  background-color: $background;

  font-size: $fontSize;
  font-weight: $fontWeight;
  line-height: $fontLineHeight;
  color: $fontColor;

  &_fixed { padding-left: $columnPaddingLRFixed; padding-right: $columnPaddingLRFixed;}
  &_dense { padding-left: $columnPaddingLRDense; padding-right: $columnPaddingLRDense;}
  &_auto  { padding-left: $columnPaddingLRAuto;  padding-right: $columnPaddingLRAuto;  }
}
</style>