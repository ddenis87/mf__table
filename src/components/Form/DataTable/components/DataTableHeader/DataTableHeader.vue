<template>
  <div class="header"
       @mouseover="eventMouseOver"
       @mouseout="eventMouseOut">

    <div class="header-row" 
         :class="`header-row_${typeRow}`"
         :style="template" @click="(event) => eventClickColumn(event)">
      
      <div class="header-column header-column__action-max"
           :class="`header-column_${typeColumn}`"
           v-if="computedActionMax && !isMultiline">
        <span style="visibility: hidden">1</span>
      </div>

      <div v-for="(item, index) in items"
           class="header-column"
           :class="`header-column_${typeColumn}`"
           :key="`header-${index}`"
           :style="item.position_in_template"
           :data-overflow-text="item.label"
           :data-key="item.value">
        <data-table-content-display :value="item.label"
                                    :properties="{type: 'string'}"
                                    :type-row="typeRow"></data-table-content-display>
        <div class="header-column__sort">
          <v-icon>mdi-menu-down</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataTableContentDisplay from '../DataTableContentDisplay.vue';

import { DataTable } from '../DataTable.js';
import { Events } from './mixins/Events.js';

export default {
  name: 'DataTableHeader',
  components: {
    DataTableContentDisplay,
  },
  mixins: [
    DataTable,
    Events,
  ],
  props: {
    template: Object,
    typeRow: { type: String, default: 'fixed' },
    typeColumn: { type: String, default: 'fixed' },
    items: { type: Array, default: () => [] },
    isMultiline: {type: Boolean, default: false},
  },
  computed: {
    computedTemplate() {
      let newTemplate = Object.assign({}, this.template);
      if (this.items.length != 0)
        newTemplate['grid-template-areas'] = newTemplate['grid-template-areas'].replace('group', this.items[0].value);
      return newTemplate;
    },
  },
}
</script>

<style lang="scss" scoped>
@import './DataTableHeader.scss';

.header {
  &-row {
    display: grid;
    border-bottom: $rowBorder;
    background-color: white;
    
    font-size: $fontSize;
    font-weight: $fontWeight;
    color: $fontColor;

    &_fixed { grid-template-rows: repeat(auto-fit, $rowHeightFixed); }
    &_dense { grid-template-rows: repeat(auto-fit, $rowHeightDense); }
    &_auto  { grid-template-rows: repeat(auto-fit, $rowHeightAuto);  }
    .header-column {
      position: relative;
      &:hover {
        cursor: pointer;
        // background-color: rgba(242, 242, 242, .6);
      }
      // &:hover > .header-column__sort { visibility: visible; }
      &__sort {
        position: absolute;
        top: -1px;
        right: -7px;
        visibility: hidden;
        &_active {
          visibility: visible;
          &_asc {
            transform: rotate(180deg);
          }
        }
      }
        
      &__action-max {
        grid-area: action_max;
        visibility: hidden;
      }
      &_fixed {
        padding-left: $columnPaddingLRFixed; 
        padding-right: $columnPaddingLRFixed;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &_dense {
        padding-left: $columnPaddingLRDense; 
        padding-right: $columnPaddingLRDense;

        // white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &_auto {
        padding-left: $columnPaddingLRAuto; 
        padding-right: $columnPaddingLRAuto;

        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>