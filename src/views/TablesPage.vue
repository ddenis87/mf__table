<template>
  <div class="tables-page">
    <div class="tables-page__header">
      <v-toolbar height="50" flat>
       <v-toolbar-title>{{ tableDiscription || 'Загрузка...' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-card min-width="380" max-height="34" flat v-if="tableDiscription">
          <el-field-search :is-label="true"
                           :input-properties="{label: 'Найти в таблице'}"
                           v-model="freeSearchValue"
                           @keydown-enter="freeSearch" 
                           @clear-value="clearValueFreeSearch"></el-field-search>
        </v-card><!--  -->
      </v-toolbar>
    </div>
    <div class="tables-page__control">
      <data-table-control v-bind="propertiesControl"></data-table-control>
    </div>
    <div class="tables-page__body">
      <component class="table" 
                 :is="componentTables"
                 
                 @component-mounted="mountedTable"
                 @row-focused="focusedElement"
                 @component-blur="blurTable"></component>
    </div>
  </div>
</template>

<script>
import DataTableControl from '@/components/DataTableControls/DataTableControl.vue';
import ElFieldSearch from '@/components/Elements/ElField/ElFieldSearch.vue';

import { DataTableControl_DataTable } from '@/componentsInteraction/DataTableControl_DataTable.js';
export default {
  name: 'TablesPage',
  components: {
    DataTableControl,
    ElFieldSearch,
  },
  mixins: [
    DataTableControl_DataTable,
  ],
  data() {
    return {
      tableName: this.$route.query.tableName,
      guid: null,
      freeSearchValue: '',
      typeControl: 'catalog',
    }
  },
  computed: {
    optionGetter() { return { tableName: this.tableName, guid: this.guid } },
    eventFilterExtendedReset() {
      if (this.$store.getters['DataTable/GET_MARK_EVENTS_FILTER_EXTENDE_RESET']({tableName: this.tableName, guid: this.guid}))
        return true;
      return null;
    },
    tableDiscription() { return this.$store.getters['DataTable/GET_DESCRIPTION'](this.optionGetter) },
  },
  watch: {
    eventFilterExtendedReset() {
      if (this.eventFilterExtendedReset)
        this.freeSearchValue = '';
    }
  },
  methods: {
    freeSearch(option) {
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: { 'search': option.value }
      });
    },
    clearValueFreeSearch() {
      let isHierarchyMode = this.$store.getters['DataTable/GET_HIERARCHY_MODE']({tableName: this.tableName});
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: { 'search': null, 'ordering': (isHierarchyMode) ? '-is_group' : null }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.tables-page {
  display: grid;
  grid-template-areas: "tables-page__header" "tables-page__control" "tables-page__body";
  grid-template-columns: 1fr;
  grid-template-rows: 42px 44px 1fr;
  width: 100%;
  height: 100%;

  &__header {
    grid-area: tables-page__header;
    overflow: hidden;
    z-index: 15;
  }
  &__control {
    grid-area: tables-page__control;
    overflow: hidden;
    z-index: 15;
  }
  &__body {
    padding: 5px;
    grid-area: tables-page__body;
    width: 100vw;
    height: calc(100vh - 152px);
    z-index: 10;
    .table {
      z-index: 9;
    }
  }
}
</style>