<template>
  <div class="body">
    <div class="left-bar"
         :style="`width: ${(22 * rowLevelGroupMax) + 62}px`">
      <RecycleScroller :items="rows"
                      :item-size="null"
                      sizeField="height"
                      key-field="value"
                      v-slot="{ item }"
                      class="sheet-body"
                      ref="BodyLeft">
        <div :key="`body-row-${item.value}`"
              class="sheet-body__row"
              :style="[{
                'grid-template-columns': `
                repeat(${rowLevelGroupMax}, minmax(20px, 20px))
                60px
                ${templateRowBody}`,
                'grid-template-rows': `${(item.height) ? item.height : '22'}px`,
              }]">
          <div v-for="level in rowLevelGroupMax"
              :key="`${item.value}-${level}`"
              class="column column-group"
              :style="getStyleGroup(level)">
              <spread-sheet-btn-group v-if="isRowGroupLevel(item, level)">mdi-plus-box-outline</spread-sheet-btn-group>
          </div>
          <div class="column column-title"
              :style="shiftTitle">{{ item.value }}</div>
        </div>
      </RecycleScroller>
    </div>
    <div class="content">
      <RecycleScroller :items="rows"
                      :item-size="null"
                      sizeField="height"
                      key-field="value"
                      v-slot="{ item, index }"
                      class="sheet-body"
                      :emitUpdate="true"
                      @update="scrollBody"
                      ref="BodyContent">
          <div :key="`body-row-${item.value}`"
              class="sheet-body__row"
              :style="[{
                'grid-template-columns': `
                ${templateRowBody}`,
                'grid-template-rows': `${(item.height) ? item.height : '22'}px`,
              }]">
            
            <template v-for="(column, columnIndex) in columns">
              <div v-if="!excludedCells.has(`${column.name}${item.value}`)"
                  :key="`body-${item.value}-${column.value}`"
                  class="column column-body"
                  :class="(cells[`${column.name}${item.value}`]) ? cells[`${column.name}${item.value}`].style : ''"
                  :style="getCellGeometry(item, index, column, columnIndex)">
                {{ (cells[`${column.name}${item.value}`]) ? cells[`${column.name}${item.value}`].value : '' }}
              </div>
            </template>
          </div>
      </RecycleScroller>
    </div>
    <div class="scroll" ref="BodyContentScroll" @scroll="scrollBodyScroll">
      <div class="scroll-empty" :style="`height: ${22 * rows.length}px`"></div>
    </div>
  </div>
  
</template>

<script>
import SheetComponent from './SheetComponent';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetBody',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SheetComponent,
  ],
  props: {
    rowsCount: { type: Number, default: 0 },
    rows: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    rowLevelGroupMax: { type: Number, default: 0 },
  },
  data() {
    return {
      excludedCells: new Set(),

      currentSelectedCell: null,

      shiftTitle: { left: `${20 * this.rowLevelGroupMax}px` },

      bodyLeft: null,
      bodyContent: null,
      bodyContentScroll: null,
    };
  },
  computed: {
    templateRowBody() {
      let templateRowBody = '';
      for (let i = 0; i < this.columns.length - 1; i += 1) {
        templateRowBody += `${this.columns[i].width || 94}px `;
      }
      console.log(templateRowBody);
      return templateRowBody;
    },
  },
  mounted() {
    this.bodyLeft = this.$refs.BodyLeft.$el.querySelector('div').parentElement;
    this.bodyContent = this.$refs.BodyContent.$el.querySelector('div').parentElement;
    this.bodyContentScroll = this.$refs.BodyContentScroll.querySelector('div').parentElement;
  },
  methods: {
    scrollBody() {
      this.bodyLeft.scrollTop = this.bodyContent.scrollTop;
      this.bodyContentScroll.scrollTop = this.bodyContent.scrollTop;
      setTimeout(() => {
        this.bodyLeft.scrollTop = this.bodyContent.scrollTop;
        this.bodyContentScroll.scrollTop = this.bodyContent.scrollTop;
      }, 80);
    },
    scrollBodyLeft() {
      console.log('scroll left');
    },
    scrollBodyScroll() {
    },
    eventClickBody(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').getAttribute('data-row-parent')) {
        this.toggleRowGroup(evt.target.closest('button'));
        return true;
      }
      this.selectedCell(evt);
      return true;
    },
    toggleRowGroup(target) {
      this.$emit('toggle-row-group', {
        value: +target.getAttribute('data-row-parent'),
        index: +target.getAttribute('data-row-index'),
        count: +target.getAttribute('data-row-count'),
        status: target.getAttribute('data-row-status'),
        target,
      });
    },
    selectedCell(evt) {
      if (!evt.target.closest('.column-body')) return;
      if (this.currentSelectedCell === evt.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('selected');
      evt.target.classList.add('selected');
      this.currentSelectedCell = evt.target;
    },
    isRowGroupLevel(row, level) {
      if (!Object.keys(row).includes('rowGroup')) return false;
      return (level === this.getRowLevel(row) + 1);
    },
    getRowLevel(row) {
      let level = 0;
      let currentRow = row;
      let condition = true;
      while (condition) {
        if (!currentRow) { condition = false; return level; }
        if (!Object.keys(currentRow).includes('parent')) { condition = false; return level; }
        level += 1;
        currentRow = this.rows.find((item) => item.value === currentRow.parent);
      }
      return level;
    },
    getStyleGroup(level) {
      return {
        left: `${20 * (+level - 1)}px`,
      };
    },
    getStyleContent(row, column) {
      const cellName = `${this.getColumnTitle(column)}${row}`;
      if (!this.cells[cellName] || !this.cells[cellName].style) return {};
      return this.cells[cellName].style;
    },
    getCellGeometry(row, rowIndex, column, columnIndex) {
      const cellGeometry = {};
      let cellWidth = column.width || null;
      if (this.cells[`${column.name}${row.value}`]
        && this.cells[`${column.name}${row.value}`].colspan) {
        const { colspan } = { ...this.cells[`${column.name}${row.value}`] };
        for (let i = 1; i < colspan; i += 1) {
          cellWidth += this.columns[columnIndex + i].width || 94;
          this.excludedCells.add(`${this.columns[columnIndex + i].name}${row.value}`);
        }
        cellGeometry['grid-column-start'] = columnIndex + 1;
        cellGeometry['grid-column-end'] = (columnIndex + 1) + colspan;
      }
      cellGeometry['grid-column-start'] = columnIndex + 1;
      cellGeometry['grid-column-end'] = (columnIndex + 1) + 1;

      let cellHeight = row.height || null;
      if (this.cells[`${column.name}${row.value}`]
        && this.cells[`${column.name}${row.value}`].rowspan) {
        const { rowspan } = { ...this.cells[`${column.name}${row.value}`] };
        for (let i = 1; i < rowspan - 1; i += 1) {
          cellHeight += this.rows[rowIndex + i].height || 22;
          this.excludedCells.add(`${column.name}${row.value + i}`);
        }
        cellGeometry['z-index'] = 1;
      }
      cellGeometry.height = `${cellHeight}px` || '';
      cellGeometry.width = `${cellWidth}px` || '';

      return cellGeometry;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './SheetBody.scss';

.body {
  position: relative;
  display: flex;
  height: calc(100vh - 210px);
  // border: thin solid green;
  .scroll {
    position: sticky;
    right: 0px;
    width: 10px;
    height: 100%;
    background-color: white;
    // border: thin solid grey;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      position: sticky;
      display: block;
      left: 0px;
      width: $scrollWidth;
      height: $scrollHeight;
      border-radius: $scrollBorderRadius;
      &-thumb {
        border-radius: $scrollThumbBorderRadius;
        background-color: $scrollThumbBackgroundColor;
      }
    }

  }
  .left-bar {
    position: sticky;
    left: 0px;
    height: 100%;
    // width: 150px;
    // border: thin solid red;
    background-color: #dadce0;
    z-index: 100;
    .sheet-body {
      height: 100%;
      overflow-y: hidden;
      &::-webkit-scrollbar {
        display: none;
      }
      // overflow: hidden;
      &__row {
        position: relative;
        display: grid;
        grid-auto-rows: minmax(22px, 22px);
        .column {
          display: inline-flex;
          align-items: center;
          height: 100%;
          // background-color: white;
          &-group, &-title {
            position: sticky;
            background-color: unset;
            justify-content: center;

            font-size: 0.75em;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.6);
          }

          &-group {
            left: 0px;
            width: 20px;
            z-index: 500;
            &:first-child {
              // box-shadow:  inset 1px 0px 0px grey;
              border-left: thin solid grey;
            }
          }

          &-title {
            border: thin solid grey;
            // box-shadow:  inset 1px 0px 0px grey, inset -1px 0px 0px grey, 0px -1px 0px grey;
            border-top: 0px;
            width: 60px;
            z-index: 400;
          }
        }
      }
    }
  }
  .content {
    height: 100%;
    width: 100%;
    .sheet-body {
      position: relative;
      height: 100%;
       &::-webkit-scrollbar {
        display: none;
      }
      &__row {
        position: relative;
        display: grid;
        grid-auto-rows: minmax(22px, 22px);
        .column {
          display: inline-flex;
          align-items: center;
          height: 100%;
          background-color: white;
          &-group, &-title {
            position: sticky;
            background-color: #dadce0;
            justify-content: center;

            font-size: 0.75em;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.6);
          }

          &-group {
            left: 0px;
            width: 20px;
            z-index: 500;
            &:first-child {
              box-shadow:  inset 1px 0px 0px grey;
            }
          }

          &-title {
            box-shadow:  inset 1px 0px 0px grey, inset -1px 0px 0px grey, 0px -1px 0px grey;
            border-top: 0px;
            width: 60px;
            z-index: 400;
          }
          &-body {
            position: relative;
            padding: 0px 2px;
            width: 94px;
            // border-left: thin solid grey;
            // border-bottom: thin solid grey;
            box-shadow: inset -1px 0px 0px grey, inset 0px -1px 0px grey;
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
          }

        }
        .line {
          &::before {
            content: '';
            position: absolute;
            border-left: thin solid #3F3F3F;
            background-color: #3F3F3F;
            width: 0px;
            height: 100%;
            top: 0px;
          }
        }
        .selected::before {
          content: '';
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          border: 1px solid #1a73e8;
          border-bottom: 2px solid #1a73e8;
          border-right: 2px solid #1a73e8;
        }
      }
    }
  }
}
</style>
