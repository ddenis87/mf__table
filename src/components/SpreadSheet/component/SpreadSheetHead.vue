<template>
  <div class="spread-sheet__head"
       @click="eventClickHead">
    <div v-for="level in maxColumnGroupingLevel"
         class="rows rows__group"
         :key="level"
         :style="templateRowGroup(level)">
      <div v-for="(column, columnIndex) in columns"
            class="column column-group"
            :key="columnIndex"
            :class="getGroupClass(level, column, columnIndex)"
            :style="getGroupStyle(level)">
        <spread-sheet-btn-group v-if="isGroup(column, level)"
                                :data-column-name="column.name">
          <v-icon small color="black">
            {{ (setOpenGroupColumns.includes(column.name)) ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
        </spread-sheet-btn-group>
      </div>
      <div class="column column-group column-end"></div>
    </div>

    <div v-if="isShowTitle"
         class="rows rows__title"
         :style="templateRow">
      <template v-for="(column, columnIndex) in columns">
        <div :key="`head-title-${column.value}`"
             class="column column-title"
             :style="getCellStyle(column, columnIndex)">
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
import {
  CELL_HEIGHT_GROUP,
  CELL_HEIGHT_TITLE,
} from '../SpreadSheetConst';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetHead',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    columns: { type: Array },
    templateColumnWidth: { type: String, default: '' },
    tableWidth: { type: Number, default: 0 },
    maxColumnGroupingLevel: { type: Number, default: 0 },
    setOpenGroupColumns: { type: Array, default() { return []; } },
    isShowTitle: { type: Boolean, default: true },
  },
  computed: {
    templateRow() {
      const templateRow = {
        'grid-template-columns': `${this.templateColumnWidth} 8px`,
        'grid-template-rows': `${CELL_HEIGHT_TITLE}px`,
        width: `${this.tableWidth}px`,
      };
      return templateRow;
    },
  },
  methods: {
    templateRowGroup(level) {
      let rowHeight = CELL_HEIGHT_GROUP;
      if (level === this.maxColumnGroupingLevel) rowHeight += 5;
      const templateRow = {
        'grid-template-columns': `${this.templateColumnWidth} 8px`,
        'grid-template-rows': `${rowHeight}px`,
        width: `${this.tableWidth}px`,
      };
      return templateRow;
    },
    eventClickHead(evt) {
      if (evt.target.closest('button')) {
        const columnName = evt.target.closest('button').parentElement.getAttribute('data-column-name');
        console.log(columnName);
        this.$emit('toggle-group:column', columnName);
      }
    },
    getCellStyle(column, columnIndex) {
      const cellStyle = {};
      if (column.fixed) {
        cellStyle.position = 'sticky';
        cellStyle['z-index'] = 100;
        cellStyle.left = 0;
        for (let i = 0; i < columnIndex; i += 1) {
          cellStyle.left += this.columns[i].width;
        }
        cellStyle.left += 'px';
      }
      return cellStyle;
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

    getGroupStyle(level) {
      const groupStyle = {};
      if (level === this.maxColumnGroupingLevel) groupStyle['border-bottom'] = 'thin solid grey';
      if (level === 1) groupStyle['border-top'] = 'thin solid rgb(240, 240, 240)';
      return groupStyle;
    },

    isGroup(column, level) {
      return (Object.keys(column).includes('isGroup')
        && (column.level + 1) === level);
    },

    isGroupEnd(level, columnIndex) {
      if ((this.columns[columnIndex + 1]?.level !== level)
        && this.columns[columnIndex + 1]?.level <= level - 1) return true;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../Spread.scss';
.rows {
  position: relative;
  display: grid;
  background-color: $headBackgroundColor;
  .column {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: $headBackgroundColor;
    &-title {
      box-shadow: 1px 0px 0px grey;
      border-bottom: thin solid grey;
    }
    &-group {
      display: flex;
      align-items: flex-end;
      background-color: $headBackgroundColor;
      // padding-bottom: 1px;
    }
    &-end {
      min-width: 20px;
      max-width: 20px;
      box-shadow: 0px 0px 0px grey;
      border-bottom: 0;
    }
  }
  .line-start {
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      right: 0px;
      width: calc(50% - 8px);
      border-bottom: thin solid grey;
    }
  }
  .line {
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      width: 100%;
      border-bottom: thin solid grey;
    }
  }
  .line-end {
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      width: 100%;
      height: 10px;
      border-top: thin solid grey;
      border-bottom: 0;
      border-right: thin solid grey;
    }
  }
}

</style>
