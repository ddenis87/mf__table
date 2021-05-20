<template>
  <div class="sheet-head" @click="eventClickHead">
    <template v-for="level in maxLevelGroupColumn">
      <div :key="level"
           class="sheet-head__row"
           :style="templateColumnHeight">
        <template v-for="(column, index) in columns">
          <div :key="`head-group-${column.value}`"
               class="column column-group"
               :class="{
                 'line-start': (setOpenGroupColumn.includes(column.name) && column.columnLevel === level - 1),
                 'line': (column.parent && level <= column.columnLevel),
                 'line-end': (getEndGroup(index, level) && level <= column.columnLevel),
               }"
               :style="getStyleCellFixed(column, index, level)">
            <spread-sheet-btn-group v-if="isColumnGroup(column, level)"
                             :data-column-index="index"
                             :data-column-parent="column.value"
                             :data-column-name="column.name"
                             :data-column-count="column.columnGroup - 1"
                             :data-column-status="column.openGroup">
              {{ (setOpenGroupColumn.includes(column.name)) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
            </spread-sheet-btn-group>
          </div>
        </template>
        <div class="column column-group column-end"></div>
      </div>
    </template>

    <div class="sheet-head__row"
         :style="templateColumnHeight">
      <template v-for="(column, columnIndex) in columns">
        <div :key="`head-title-${column.value}`"
             class="column column-title"
             :style="getStyleCellFixed(column, columnIndex)">{{ column.display_name }}</div>
      </template>
      <div class="column column-title column-end"></div>
    </div>
  </div>
</template>

<script>
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

import {
  CELL_HEIGHT,
} from '../SpreadSheetConst';

export default {
  name: 'SpreadSheetHead',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    columns: { type: Array },
    templateColumnWidth: { type: String, default: '' },
    templateTableWidth: { type: Number, default: 0 },
    maxLevelGroupColumn: { type: Number, default: 0 },
    setOpenGroupColumn: { type: Array, default() { return []; } },
    isGridOff: { type: Boolean, default: false },
  },
  computed: {
    templateColumnHeight() {
      return {
        'grid-template-columns': `${this.templateColumnWidth} 8px`,
        'grid-template-rows': `${CELL_HEIGHT}px`,
        width: `${this.templateTableWidth}px`,
      };
    },
  },
  methods: {
    getEndGroup(indexColumn, currentLevel) {
      if (this.columns[indexColumn].parent
        && !this.columns[indexColumn].columnLevel <= currentLevel
        && (!this.columns[indexColumn + 1]?.parent
          || this.columns[indexColumn + 1]?.parent !== this.columns[indexColumn].parent)
        && this.columns[indexColumn + 1].columnLevel <= currentLevel - 1) return true;
      return false;
    },
    getStyleCellFixed(column, columnIndex, level = -1) {
      const fixed = {};
      if (column.fixed) {
        fixed.position = 'sticky';
        fixed['z-index'] = 100;
        fixed.left = 0; //  (20 * this.maxLevelGroupRow) + 60;
        // const columnCurrentIndex = this.columns.findIndex((item) => item === column);
        for (let i = 0; i < columnIndex; i += 1) {
          fixed.left += this.columns[i].width;
        }
        fixed.left += 'px';
        if (!this.columns[columnIndex + 1]?.fixed && this.isGridOff) fixed['box-shadow'] = '2px 0px 0px rgba(0, 0, 0, .2)';
        if (!this.columns[columnIndex + 1]?.fixed && this.isGridOff && level === 1) fixed['box-shadow'] = 'inset 0px 1px 0px grey, 2px 0px 0px rgba(0, 0, 0, .2)';
      }
      return fixed;
    },
    eventClickHead(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').getAttribute('data-column-parent')) {
        this.toggleColumnGroup(evt.target.closest('button'));
      }
    },
    toggleColumnGroup(target) {
      this.$emit('toggle-column-group', {
        value: +target.getAttribute('data-column-parent'),
        name: target.getAttribute('data-column-name'),
        index: +target.getAttribute('data-column-index'),
        count: +target.getAttribute('data-column-count'),
        status: !!target.getAttribute('data-column-status'),
        target,
      });
    },
    isColumnGroup(column, level) {
      return (Object.keys(column).includes('columnGroup') && level === column.columnLevel + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../SpreadSheet.scss';

.sheet-head {
  position: relative;
  display: block;
  overflow-x: hidden;
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
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $backgroundColorTitle;
      &-group {
        &:last-child {
          border-right: $borderStyle;
        }
      }
      &-title {
        border: $borderStyle;
        border-left: 0px;
        cursor: default;
        &:first-child {
          border-left: 0px;
        }
      }
      &-end {
        min-width: 17px;
        border-right: $borderStyle;
      }
    }
    .line-start {
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        right: 0px;
        width: calc(50% - 5px);
        height: 0px;
        border-bottom: thin solid #3F3F3F;
        background-color: #3F3F3F;
      }
    }
    .line {
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        width: 100%;
        height: 0px;
        border-bottom: thin solid #3F3F3F;
        background-color: #3F3F3F;
      }
    }
    .line-end {
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        width: 100%;
        height: 10px;
        border: 0;
        border-right: 1px solid #3F3F3F;
        border-top: 1px solid #3F3F3F;
        background-color: unset;
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
