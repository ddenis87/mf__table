<template>
  <div class="data-table" :class="guid" >
    <v-overlay :value="isLoadingData && isBlock" light z-index="999" opacity="0.5" color="white" :absolute="true"></v-overlay>

    <data-table-tooltip :is-show="isShowTooltip"
                        :data-properties="propertiesTooltip"
                        @click="isShowTooltip = false" 
                        @mousemove="isShowTooltip = false">
      {{ propertiesTooltip.text }}
    </data-table-tooltip>

    <data-table-overflow :guid="guid"
                         :properties="propertiesTooltip"
                         @is-show="isShowTooltip = true" 
                         @is-hide="isShowTooltip = false"></data-table-overflow>
    <div class="data-table__header">

      <data-table-header :template="dataTableTemplate"
                         :type-row="propsTable.typeRow"
                         :type-column="propsTable.typeColumn"
                         :items="listHeaders"
                         :is-multiline="propsTable.isMultiline"
                         @set-sorting="setSorting"
                         @show-tooltip="showTooltip"
                         @hide-tooltip="hideTooltip"></data-table-header>
      <el-progress-bar :is-show="isLoadingData"></el-progress-bar>
    </div>
    <div :class="`${guid}__boot-anchor-previous data-table__boot-anchor-previous`"></div>
    <div class="data-table__body-group">
      <data-table-body-group :table-name="tableName"
                             :template="dataTableTemplate"
                             :group-level="listDataGroupLevel"
                             :start-column="(propsTable.typeColumn) ? headers[1] : headers[0]"
                             :type-row="propsTable.typeRow"
                             :type-column="propsTable.typeColumn"
                             :is-expansion="propsTable.isExpansion"
                             :is-multiline="propsTable.isMultiline"
                             :is-editable="isEditable"
                             :is-hierarchy-mode="propsTable.isHierarchy"
                             :items="listDataGroup"
                             :items-header="listHeaders"
                             @toggle-group="toggleGroup"></data-table-body-group>
    </div>

    <div class="data-table__body">
      <data-table-body :guid="guid"
                       :table-name="tableName"
                       :template="dataTableTemplate"
                       :type-row="propsTable.typeRow"
                       :type-column="propsTable.typeColumn"
                       :items="listData"
                       :items-header="listHeaders"
                       :group-level="listDataGroupLevel"

                       :is-editable="isEditable"
                       :is-adding-inline="isAddingInline"

                       :is-expansion="propsTable.isExpansion"
                       :is-multiline="propsTable.isMultiline"
                       :is-hierarchy-mode="propsTable.isHierarchy"
                       @toggle-group="toggleGroup"
                       @event-row-focused="focusedElement"
                       @event-row-selected="selectedElement"
                       @event-row-keydown="eventRowKeydown"
                       @event-body-blur="blurComponent"
                       @adding-new-element="addingNewElement"
                       @show-tooltip="showTooltip"
                       @hide-tooltip="hideTooltip"></data-table-body>
    </div>

    <!-- ANCHOR FOR LAZY LOAD DATA -->
    <div :class="`${guid}__boot-anchor`"></div>

    <div class="data-table__footer" v-show="propsTable.isFooter">
      <slot name="component-footer">
        <data-table-footer :listDataCount="countDataTotal"
                           :listDataCountLoad="countDataLoaded"
                           :type-column="propsTable.typeColumn"></data-table-footer>
      </slot>
    </div>
    <div class="data-table__dialog-modal">
      <data-table-empty-data :is-show="isShowDialogEmpty" @close-dialog="closeEmptyDialog"></data-table-empty-data>
    </div>
  </div>
</template>

<script>
import DataTableOverflow from './components/DataTableOverflow.vue';
import DataTableTooltip from './components/DataTableTooltip.vue'; 

import ElProgressBar from '@/components/Elements/ElProgressBar/ElProgressBar.vue';
import DataTableHeader from './components/DataTableHeader/DataTableHeader.vue';
import DataTableBodyGroup from './components/DataTableBodyGroup/DataTableBodyGroup.vue';
import DataTableBody from './components/DataTableBody/DataTableBody.vue';
import DataTableFooter from './components/DataTableFooter/DataTableFooter.vue';
import DataTableEmptyData from './components/DataTableEmptyData.vue';

import { DataTable } from './DataTable.js';
import { DataTableEvents } from './mixins/DataTableEvents.js';
import { DataTableTemplate } from './mixins/DataTableTemplate.js';
import { DataTableLazyLoad } from './mixins/DataTableLazyLoad.js';

export default {
  name: 'DataTable',
  components: {
    DataTableOverflow,
    DataTableTooltip,

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
  ],
  props: {
    properties: Object,

    defaultOptions: { type: Object, default: () => {}},
    defaultFilters: { type: Object, default: () => {}},

    typeRow: { type: String, default: 'fixed' },
    typeColumn: { type: String, default: 'fixed' },

    isAdding: { type: Boolean, default: true },
    isAddingForm: { type: Boolean, default: true },
    isAddingInline: { type: Boolean, default: true },
    isEditable: { type: Boolean, default: true },
    isEditableForm: { type: Boolean, default: true },
    isEditableInline: { type: Boolean, default: true },
    isFooter: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
    isHierarchy: { type: Boolean, default: true },
  },
  data() {
    return {
      tableName: this.properties.tableName,
      propertiesTooltip: { top: -300, left: -300, width: 0, height: 0, text: '' },
      isShowDialogEmpty: false,
      isShowTooltip: false,
      isBlock: true,
    }
  },
  computed: {
    computedTooltipShift() {
      let calcTooltipShift = { left: -7, top: -3, };
      // if (this.propsTable.typeRow == 'fixed' && this.propsTable.typeColumn == 'fixed') { calcTooltipShift.left = -1; calcTooltipShift.top = -2; return calcTooltipShift};
      if (this.propsTable.typeRow == 'fixed' && this.propsTable.typeColumn == 'dense') { calcTooltipShift.left = -7; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.propsTable.typeRow == 'auto' && this.propsTable.typeColumn == 'fixed') { calcTooltipShift.left = 3; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.propsTable.typeRow == 'dense' && this.propsTable.typeColumn == 'dense') { calcTooltipShift.left = -7; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.propsTable.typeRow == 'auto' && this.propsTable.typeColumn == 'dense') { calcTooltipShift.left = -1; calcTooltipShift.top = -3; return calcTooltipShift};
      return calcTooltipShift;
    },
  },
  methods: {
    showTooltip(parent) {
      // console.log(parent);
      this.propertiesTooltip = {
        top: (!parent.top) ? -300 : parent.top + this.computedTooltipShift.top,
        left: parent.left + this.computedTooltipShift.left,
        width: parent.width,
        height: parent.height,
        text: parent.text,
      };
    },
    hideTooltip(event) {
      this.propertiesTooltip = {
        top: -300,
        left: -300,
        width: 0,
        height: 0,
      };
      this.isShowTooltip = false;
    },
  }
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
  &__boot-anchor-previous {
    // height: 5px;
    width: 5px;
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