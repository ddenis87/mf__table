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
      <data-table-control :tableName="tableName"
                          :focused-element="focusedElement"
                          :guid="guid"

                          :type-row-number="typeHeightNumber"
                          :type-column="typeColumn"
                          :is-footer="isFooter"
                          :is-expansion="isExpansion"
                          :is-multiline="isMultiline"

                          @toggle-view="toggleView"></data-table-control>
    </div>
    <div class="tables-page__body">
      <component class="table" 
                 :is="componentTheTables"

                 :type-row-number="typeHeightNumber"
                 :type-column="typeColumn"
                 :is-footer="isFooter"
                 :is-expansion="isExpansion"
                 :is-multiline="isMultiline"

                 @component-mounted="componentTableMouted"
                 @row-focused="rowFocused"
                 @component-blur="componentBlur"></component>
    </div>
  </div>
</template>

<script>
import DataTableControl from '@/components/DataTableControl/DataTableControl.vue';
import ElFieldSearch from '@/components/Elements/ElField/ElFieldSearch.vue';
export default {
  name: 'TablesPage',
  components: {
    DataTableControl,
    ElFieldSearch,
  },
  data() {
    return {
      tableName: this.$route.query.tableName,
      guid: null,
      focusedElement: null,
      freeSearchValue: '',
      // Убрать на стор!!!!!!!
      typeHeightNumber: 0,
      typeHeight: ['fixed', 'dense', 'auto'],
      typeColumn: 'fixed',
      isFooter: false,
      isExpansion: false,
      isMultiline: false,
    }
  },
  computed: {
    eventFilterExtendedReset() {
      if (this.$store.getters['DataTable/GET_MARK_EVENTS_FILTER_EXTENDE_RESET']({tableName: this.tableName, guid: this.guid}))
        return true;
      return null;
    },
    tableDiscription() { return this.$store.getters['DataTable/GET_TABLE_DESCRIPTION']({tableName: this.tableName}) },
    componentTheTables() {
      return () => import(`@/components/TheTable/TheTable${this.tableName[0].toUpperCase() + this.tableName.slice(1)}`);
    }
  },
  watch: {
    eventFilterExtendedReset() {
      if (this.eventFilterExtendedReset)
        this.freeSearchValue = '';
    }
  },
  mounted() {},
  methods: {
    freeSearch(option) {
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.tableName,
        guid: this.guid,
        defaultFilters: { 'search': option.value, 'ordering': null }
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
    rowFocused(option) {
      this.focusedElement = Object.assign({}, option);
    },
    componentBlur() {
      this.focusedElement = null;
    },
    componentTableMouted(option) {
      this.guid = option.guid;
    },
    toggleView(option) {
      console.log(option);
      switch(option) {
        case 'toggle-type-row': {
          this.isExpansion = false;
          if (this.typeHeightNumber == this.typeHeight.length - 1) this.typeHeightNumber = 0;
          else this.typeHeightNumber = this.typeHeightNumber + 1;
          break;
        }
        case 'toggle-expansion': {
          this.isExpansion = !this.isExpansion;
          break;
        }
        case 'toggle-type-column': {
          (this.typeColumn == 'fixed') ? this.typeColumn = 'dense' : this.typeColumn = 'fixed';
          break;
        }
        case 'toggle-footer': {
          this.isFooter = !this.isFooter;
          break;
        }
        case 'toggle-multiline': {
          this.isMultiline = !this.isMultiline;
          break;
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.tables-page {
  display: grid;
  grid-template-areas: "tables-page__header" "tables-page__control" "tables-page__body";
  grid-template-columns: 1fr;
  grid-template-rows: 42px 40px 1fr;
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