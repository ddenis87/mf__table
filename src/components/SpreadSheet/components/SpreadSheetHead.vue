<template>
  <div class="sheet-head" @click="eventClickHead">
    <template v-if="isShowGroup">
      <div v-for="level in maxColumnGroupingLevel"
           class="sheet-head__row"
           :key="level"
           :style="templateColumnHeight">
        <div v-for="(column, columnIndex) in columns"
             class="column column-group"
             :key="columnIndex"
             :class="getGroupClass(level, column, columnIndex)">
          <spread-sheet-btn-group v-if="isGroup(column, level)"
                                  :data-column-name="column.name">
            <v-icon small color="black">
              {{ (setOpenGroupColumns.includes(column.name)) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
            </v-icon>
          </spread-sheet-btn-group>
        </div>
        <div class="column column-group column-end"></div>
      </div>
    </template>

    <div v-if="isShowTitle" class="sheet-head__row"
         :style="templateColumnHeight">
      <template v-for="(column, columnIndex) in columns">
        <div :key="`head-title-${column.value}`"
             class="column column-title"
             :style="getStyleCellFixed(column, columnIndex)">
          <div class="content">{{ column.name.toUpperCase() }}</div>
        </div>
      </template>
      <div class="column column-title column-end">
        <div class="content"></div>
      </div>
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
    maxColumnGroupingLevel: { type: Number, default: 0 },
    setOpenGroupColumns: { type: Array, default() { return []; } },
    isGrid: { type: Boolean, default: true },
    isShowGroup: { type: Boolean, default: true },
    isShowTitle: { type: Boolean, default: true },
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
    isGroupEnd(level, columnIndex) {
      if ((this.columns[columnIndex + 1]?.level !== level)
        && this.columns[columnIndex + 1]?.level <= level - 1) return true;
      return false;
    },
    getGroupClass(level, column, columnIndex) {
      const { level: columnLevel } = column;
      const groupClass = [];
      if (this.setOpenGroupColumns.includes(column.name) && columnLevel === level - 1) {
        groupClass.push('line-start');
      }
      if (level <= columnLevel) groupClass.push('line');
      if (this.isGroupEnd(level, columnIndex) && level <= columnLevel) groupClass.push('line-end');
      return groupClass;
    },

    getStyleCellFixed(column, columnIndex, level = -1) {
      const fixed = {};
      if (column.fixed) {
        fixed.position = 'sticky';
        fixed['z-index'] = 100;
        fixed.left = 0; //  (20 * this.maxLevelGroupRow) + 60;
        for (let i = 0; i < columnIndex; i += 1) {
          fixed.left += this.columns[i].width;
        }
        fixed.left += 'px';
        if (!this.columns[columnIndex + 1]?.fixed && !this.isGrid) fixed['box-shadow'] = '2px 0px 0px rgba(0, 0, 0, .2)';
        if (!this.columns[columnIndex + 1]?.fixed && !this.isGrid && level === 1) fixed['box-shadow'] = 'inset 0px 1px 0px grey, 2px 0px 0px rgba(0, 0, 0, .2)';
      }
      return fixed;
    },
    eventClickHead(evt) {
      if (evt.target.closest('button')) {
        const columnName = evt.target.closest('button').getAttribute('data-column-name');
        this.toggleColumnGroup(columnName);
      }
    },
    toggleColumnGroup(columnName) {
      this.$emit('toggle-group:column', columnName);
    },
    isGroup(column, level) {
      return (Object.keys(column).includes('isGroup')
        && (column.level + 1) === level);
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
      // background-color: $backgroundColorTitle;
      &-group {
        background-color: $backgroundColorTitle;
      }
      &-title {
        padding: 0px 1px;
        // border: $borderStyle;
        // border-left: 0px;
        cursor: default;
        .content {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: $backgroundColorTitle;
          user-select: none;
        }
        &::after {
          content: '';
          position: absolute;
          left: 0px;
          top: 0px;
          right: -1px;
          bottom: 0px;
          border: $borderStyle;
          border-left: 0px;
          // z-index: 80;
        }
        &:first-child {
          border-left: 0px;
        }
      }
      &-end {
        min-width: 18px;
        // border-right: $borderStyle;
        &::after {
          content: '';
          position: absolute;
          left: 0px;
          top: 0px;
          right: 0px;
          bottom: 0px;
          border-right: $borderStyle;
        }
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
