<template>
  <div class="body">
    <div v-for="(itemRow, indexRow) in items"
         class="body-row"
         :class="`body-row_${typeRow}`"
         :key="`body-row-${indexRow}`"
         :style="template"
         :tabindex="indexRow"
         :data-rowId="itemRow.id">

      <!-- EXPANSION ROW -->
      <div class="body-column__action-max"
           :class="`body-column_${typeColumn}`"
           v-if="computedActionMax && !isMultiline">
        <v-btn x-small icon class="action-btn">
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </div> <!---->

      <div v-for="(itemColumn, indexColumn) in itemsHeader"
           class="body-column"
           :class="`body-column_${typeColumn}`"
           :key="`body-column-${indexColumn}`"
           :style="(indexColumn == 0) ? computedTemplateItem(itemColumn.position_in_template) : itemColumn.position_in_template"
           :tabindex="(isEditable) ? indexColumn : ''"
           :data-overflow-text="gettingValueForType(itemColumn, itemRow[itemColumn.value])">
        <hierarchy-column class="body-column__group"
                          v-if="isHierarchyMode && indexColumn == 0"
                          :item-row="itemRow"
                          :data-id="itemRow.id"
                          @toggle-group="$emit('toggle-group', itemRow)"></hierarchy-column>
          <div class="box-display">
          <data-table-content-display :value="itemRow[itemColumn.value]"
                                      :properties="itemColumn"
                                      :type-row="typeRow"></data-table-content-display>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import DataTableOverflow from '../DataTableOverflow.vue';
// import DataTableTooltip from '../DataTableTooltip.vue'; 
import DataTableContentDisplay from '../DataTableContentDisplay.vue';
import HierarchyColumn from './components/HierarchyColumn.vue';

import { gettingValueForType } from '../Helpers';

export default {
  name: 'DataBody',
  components: {
    // DataTableOverflow,
    // DataTableTooltip,
    DataTableContentDisplay,
    HierarchyColumn,
  },
  props: {
    guid: { type: String, default: '' },
    tableName: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    itemsHeader: { type: Array, default: () => [] },
    groupLevel: { type: Number, default: 0 },
    template: Object,
    typeRow: { type: String, default: 'fixed' },
    typeColumn: { type: String, default: 'fixed' },

    isEditable: { type: Boolean, default: false },
    isAddingInline: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
    isHierarchyMode: {type: Boolean, default: false},
  },
  data() {
    return {
      isDataLoad: false,
      isTimerLoad: null,
    }
  },
  computed: {
    computedActionMax() { return (this.typeRow != 'auto' && this.isExpansion == true) ? true : false; },
  },
  methods: {
    gettingValueForType(properties, value) {
      return gettingValueForType(properties, value);
    },
    computedTemplateItem(option) {
      option['padding-left'] = (!this.isHierarchyMode) ? '5px' :`${(this.groupLevel * 20)}px`;
      return option;
    },
  },
}
</script>

<style lang="scss" scoped>
@import './DataTableBody.scss';

.body {

  font-size: $fontSize;
  font-weight: $fontWeight;
  color: $fontColor;

  box-sizing: border-box;
  &-empty {
    font-size: .875rem;
    font-weight: bold;
    color: rgba(0, 0, 0, .6);
    padding: 5px 0px;

    &_fixed { padding-left: $columnPaddingLRFixed; padding-right: $columnPaddingLRFixed; }
    &_dense { padding-left: $columnPaddingLRDense; padding-right: $columnPaddingLRDense; }
    &_auto  { padding-left: $columnPaddingLRAuto;  padding-right: $columnPaddingLRAuto;  }
  }
  &-row {
    display: grid;
    border-bottom: $rowBorder;
    outline: none;
    transition-delay: .05s;

    &_fixed { grid-template-rows: repeat(auto-fit, $rowHeightFixed); min-height: 1 + $rowHeightFixed; }
    &_dense { grid-template-rows: repeat(auto-fit, $rowHeightDense); min-height: 2 + $rowHeightDense; }
    &_auto  { grid-template-rows: $rowHeightAuto; /* repeat(auto-fill, $rowHeightAuto); */ }

    &_hover { background-color: $rowBackgroundHover; }
    &_focus { background-color: $rowBackgroundFocus; }

    .body-column {
      display: flex;
      gap: 5px;
      border: thin solid rgba(0, 0, 255, 0);
      width: 100%;
      outline: none;
      overflow: hidden;
      box-sizing: border-box;
      &_fixed { padding-left: $columnPaddingLRFixed; padding-right: $columnPaddingLRFixed; }
      &_dense { padding-left: $columnPaddingLRDense; padding-right: $columnPaddingLRDense; }
      &_auto  { padding-left: $columnPaddingLRAuto;  padding-right: $columnPaddingLRAuto;  }

      &_focus { border: $columnBorderFocus; }
      &_editing { background-color: white; }

      &__action-max {
        grid-area: action_max;
        justify-content: center;
        align-items: flex-start;
        .action-btn {
          margin-left: 0px;
          &_action {
            transform: rotate(-180deg);
          }
        }
      }
      &__group {
        grid-area: group;
        display: flex;
        justify-content: flex-end;
        // gap: 3px;
        align-items: flex-start;
        min-width: 37px;
        // .action-btn {
        //   margin-right: 5px;
        //   &_action {
        //     transform: rotate(90deg);
        //   }
        // }
      }
      
      .box-editing, .box-display {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      .box-display {
        position: relative;
        display: flex;
        align-items: $columnVerticalAlign;
        &__group {
          display: flex;
        }
      }
      .display-none { display: none; }
    }
  }
}
</style>