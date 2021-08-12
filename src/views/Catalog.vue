<template>
  <div class="tables-page">
    <div class="tables-page__header">
      <v-toolbar height="50" flat>
        <v-toolbar-title>{{ tableDiscription || titleLoading }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-card min-width="380" max-height="34" flat v-if="tableDiscription">
          <field-search field-label="Найти в таблице"
                        :is-clearable="true"
                        v-model="freeSearchValue"
                        @keydown:control="freeSearch"
                        @search:clear="clearValueFreeSearch"></field-search>
        </v-card>
      </v-toolbar>
    </div>
    <div class="tables-page__control">
      <p-toolbar v-bind="toolbarProps"
                 @click="evtClickToolbar"></p-toolbar>
    </div><!--  -->
    <div class="tables-page__body">
      <component class="table"
                 :is="componentTable"
                 @row-focused="evtFocusedElement"
                 @component-mounted="evtMountedTable"
                 @component-blur="evtBlurTable"></component>
    </div>
    <div class="tables-page__filter">
      <dialog-bar-right v-bind="filterDialogProps"
                        @close-dialog="isDialogFilterShow = false">
        <p-filter v-bind="filterProps"
                  @accept="evtFilterAccept"
                  @reset="evtFilterReset"></p-filter>
      </dialog-bar-right>
    </div>
    <div class="tables-page__form">
      <dialog-full-page v-bind="formDialogProps"
                        @close-dialog="evtFormCancel">
        <component :is="componentForm"
                   v-bind="formProps"
                   @event-action-accept="evtFormAccept"
                   @event-action-cancel="evtFormCancel"></component>
      </dialog-full-page>
    </div><!--  -->
  </div>
</template>

<script>
import catalog from '@/logics/views/Catalog/Catalog';
import catalogTable from '@/logics/views/Catalog/CatalogTable';
import catalogToolbar from '@/logics/views/Catalog/CatalogToolbar';
import catalogFilter from '@/logics/views/Catalog/CatalogFilter';
import catalogForm from '@/logics/views/Catalog/CatalogForm';

export default {
  name: 'Catalog',
  components: {
    ...catalog.components,
    ...catalogToolbar.components,
    ...catalogFilter.components,
    ...catalogForm.components,
  },
  props: {
    ...catalogToolbar.props,
  },
  data() {
    return {
      sourceName: this.$route.query.sourceName,
      ...catalog.data,
      ...catalogTable.data,
      ...catalogFilter.data,
      ...catalogForm.data,
    };
  },
  computed: {
    ...catalog.computed,
    ...catalogTable.computed,
    ...catalogToolbar.computed,
    ...catalogFilter.computed,
    ...catalogForm.computed,
  },
  methods: {
    ...catalog.methods,
    ...catalogTable.methods,
    ...catalogToolbar.methods,
    ...catalogFilter.methods,
    ...catalogForm.methods,
  },
};
</script>

<style lang="scss" scoped>
.tables-page {
  display: grid;
  grid-template-areas: "tables-page__header" "tables-page__control" "tables-page__body";
  grid-template-columns: 1fr;
  grid-template-rows: 42px 48px 1fr;
  width: 100%;
  height: 100%;

  &__header {
    grid-area: tables-page__header;
    padding-top: 4px;
    overflow: hidden;
    z-index: 15;
  }
  &__control {
    grid-area: tables-page__control;
    overflow: hidden;
    margin-left: -12px;
    z-index: 15;
  }
  &__body {
    padding: 5px;
    grid-area: tables-page__body;
    width: 100vw;
    height: calc(100vh - 156px);
    z-index: 10;
    .table {
      z-index: 9;
    }
  }
  &__filter {
    z-index: 20;
  }
}
</style>
