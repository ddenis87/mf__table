<template>
  <div class="data-table" :class="`${guid}`" >
    <div class="data-table__header">
       <data-table-header 
                          :table-name="tableName"
                          :template="dataTableTemplate"
                          :type-height="typeHeight"
                          :type-column="typeColumn"
                          :items="listOptions"
                          :is-expansion="isExpansion"
                          :is-multiline="isMultiline"
                          :is-hierarchy-mode="isHierarchyMode"
                          @set-sorting="setSorting"></data-table-header>
      <el-progress-bar :is-show="isLoadingData"></el-progress-bar>
    </div>

    <div class="data-table__body-group">
      <data-table-body-group :table-name="tableName"
                             :template="dataTableTemplate"
                             :start-column="(isExpansion) ? properties.headers[1] : properties.headers[0]"
                             :type-height="typeHeight"
                             :type-column="typeColumn"
                             :is-expansion="isExpansion"
                             :is-multiline="isMultiline"
                             :is-editable="isEditable"
                             :is-hierarchy-mode="isHierarchyMode"
                             :items="listDataGroup"
                             :items-header="listOptions"
                             @toggle-group="toggleGroup"></data-table-body-group>
    </div>

    <div class="data-table__body">
      <data-table-body :guid="guid"
                       :table-name="tableName"
                       :template="dataTableTemplate"
                       :type-height="typeHeight"
                       :type-column="typeColumn"
                       :items="listData"
                       :items-header="listOptions"
                       :is-editable="isEditable"
                       :is-expansion="isExpansion"
                       :is-multiline="isMultiline"
                       :is-hierarchy-mode="isHierarchyMode"
                       @toggle-group="toggleGroup"
                       @event-row-focused="eventRowFocused"
                       @event-row-selected="eventRowSelected"
                       @event-row-keydown="eventRowKeydown"
                       @event-body-blur="eventBodyBlur"
                       @adding-new-element="addingNewElement"></data-table-body>
    </div>

    <!-- ANCHOR FOR LAZY LOAD DATA -->
    <div :class="`${guid}__boot-anchor`"></div>

    <div class="data-table__footer" v-show="isFooter">
      <slot name="component-footer">
        <data-table-footer :listDataCount="listDataCount"
                            :listDataCountLoad="listDataCountLoad"
                            :type-column="typeColumn"></data-table-footer>
      </slot>
    </div> <!---->
    <div class="data-table__dialog-modal">
      <data-table-empty-data :is-show="isDialogEmptyShow" @close-dialog="closeEmptyDialog"></data-table-empty-data>
    </div>
  </div>
</template>

<script>
import ElProgressBar from '@/components/Elements/ElProgressBar/ElProgressBar.vue';
import DataTableHeader from './components/DataTableHeader/DataTableHeader.vue';
import DataTableBodyGroup from './components/DataTableBodyGroup/DataTableBodyGroup.vue';
import DataTableBody from './components/DataTableBody/DataTableBody.vue';
import DataTableFooter from './components/DataTableFooter/DataTableFooter.vue';
import DataTableEmptyData from './components/DataTableEmptyData.vue';

// import { DataTableStore } from './DataTableStore.js';

// import { LoadingData } from './mixins/LoadingData.js';
// import { GettingData } from './mixins/GettingData.js';
// import { ComputedTemplate } from './mixins/ComputedTemplate.js'; // computedTemplateTable
// import { EventsComponent } from './mixins/EventsComponent.js';
// import { HierarchyGroup } from './mixins/HierarchyGroup.js';

import { DataTable } from './DataTable.js';
import { DataTableEvents } from './mixins/DataTableEvents.js';
import { DataTableTemplate } from './mixins/DataTableTemplate.js';
import { DataTableLazyLoad } from './mixins/DataTableLazyLoad.js';

export default {
  name: 'DataTable',
  components: {
    ElProgressBar,
    DataTableHeader,
    DataTableBodyGroup,
    DataTableBody,
    DataTableFooter,
    DataTableEmptyData,
  },
  mixins: [
    DataTable,
    DataTableEvents,
    DataTableTemplate,
    DataTableLazyLoad,
    
    // DataTableStore,
    // LoadingData,
    // GettingData,
    // ComputedTemplate,
    // EventsComponent,
    // HierarchyGroup,
  ],
  props: {
    
    properties: Object,
    
    defaultFilters: Object,

    id: { type: String, default: 'dataTable' },
    typeHeight: { type: String, default: 'fixed' },
    typeColumn: { type: String, default: 'fixed' },
    isEditable: { type: Boolean, default: false },
    isFooter: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
  },
  data() {
    return {
      tableName: this.properties.tableName,
      isDialogEmptyShow: false,
    }
  },
  // created() {
  //   this.eventComponentCreated();
  // },
}
</script>

<style lang="scss" scoped>
@import './DataTable.scss';

.data-table {
  position: relative;
  height: 100%;
  
  font-family: $dtFontFamily;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: auto;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }

  &__block {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .12);
    z-index: 999;
  }

  &__header {
    position: sticky;
    top: 0px;
    display: flex;
    min-height: 5px;
    z-index: 300;
  }
  &__body-group {
    position: relative;
    display: flex;
    z-index: 150;
  }
  &__body {
    position: relative;
    display: flex;
    z-index: 100;
  }
  &__boot-anchor {
    height: 5px;
    width: 5px;
  }
  &__footer {
    position: sticky;
    bottom: 0px;
    left: 0px;
    display: flex;
    z-index: 200;
  }

  &__dialog-modal {
    z-index: 400;
  }
}
</style>