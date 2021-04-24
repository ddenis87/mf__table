<template>
  <div class="sheet-head">
    <template v-for="level in maxLevelGroupColumn">
      <div :key="level"
           class="sheet-head__row"
           :style="[{
             'grid-template-columns': `${templateRow} 8px`,
             'grid-template-rows': `${'22'}px`,
           }]">
        <template v-for="column in columns">
          <div :key="`head-group-${column.value}`"
               class="column column-group"
               :style="{'width': column.width}">
            <spread-sheet-btn-group v-if="isColumnGroup(column, level)">
              mdi-plus-box-outline
            </spread-sheet-btn-group>
          </div>
        </template>
        <div class="column column-group column-end"></div>
      </div>
    </template>

    <div class="sheet-head__row"
         :style="[{
            'grid-template-columns': `${templateRow} 8px`,
            'grid-template-rows': `${'22'}px`,
          }]">
      <template v-for="column in columns">
        <div :key="`head-title-${column.value}`"
             class="column column-title"
             :style="{'width': column.width}">{{ column.display_name }}</div>
      </template>
      <div class="column column-title column-end"></div>
    </div>
  </div>
</template>

<script>
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetHead',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    columns: { type: Array },
    maxLevelGroupColumn: { type: Number, default: 0 },
    templateRow: { type: String, default: '' },
  },
  methods: {
    isColumnGroup(column, level) {
      return (Object.keys(column).includes('columnGroup') && level === column.columnLevel + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Variables.scss';

.sheet-head {
  position: relative;
  display: block;
  overflow-x: scroll;
  font-size: $headFontSize;
  font-weight: $headFontWeight;
  color: $headFontColor;
  &::-webkit-scrollbar {
    display: none;
  }
  &__row {
    position: relative;
    display: grid;
    .column {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $backgroundColor;
      &-group {
        &:last-child {
          border-right: $borderStyle;
        }
      }
      &-title {
        border: $borderStyle;
        border-left: 0px;
        &:first-child {
          border-left: 0px;
        }
      }
      &-end {
        border-right: $borderStyle;
      }
    }
    &:first-child {
      .column {
        &-group {
          box-shadow:  inset 0px 1px 0px grey;
        }
      }
    }
  }
}
</style>
