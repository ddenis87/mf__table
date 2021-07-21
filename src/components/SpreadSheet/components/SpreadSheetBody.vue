<template>
  <div ref="TableBody"
       class="spread-sheet-body"
       @click="evtClickBody"
       @dblclick="evtDblClickBody"
       @keydown="evtKeydownBody"
       @mousedown="evtMousedown"
       >
    <div class="select-area" :style="rangeSelect"></div>
    <div ref="SheetBodyFixed"
         class="sheet-body-fixed"
         :class="{'sheet-body-fixed_grid-off': (!isGrid && rowsFixed.length)}">
      <div v-for="(rowFixed, rowFixedIndex) in rowsFixed"
           class="sheet-body-fixed__item"
           :key="rowFixedIndex"
           :style="{width: `${templateTableWidth}px`, position: 'relative'}">
        <spread-sheet-body-item :index="rowFixedIndex"
                                :source="rowFixed"
                                :rows="rows"
                                :columns="columns"
                                :cells="cells"
                                :representations="representations"
                                :set-excluded-cell="setExcludedCellsArray"
                                :max-level-group-row="maxLevelGroupRow"
                                :template-column-width="templateColumnWidth"
                                :is-grid="isGrid"></spread-sheet-body-item>
        <div class="sheet-body-fixed__item_end" :key="`end-${rowFixedIndex}`"></div>
      </div>
    </div>
    <virtual-list ref="SheetBody"
                  class="sheet-body"
                  :style="[
                    heightVirtualList,
                    widthVirtualList,
                    {'overflow-y': 'auto', 'position': 'relative',}
                  ]"
                  :wrap-style="{width: `${templateTableWidth}px`, position: 'relative'}"
                  :keeps="120"
                  :data-key="'value'"
                  :data-sources="rows"
                  :data-component="sheetBodyItem"
                  :extra-props="extraPropsComponent"
                  @scroll="evtScrollList"
                  @resized="evtResizedList">
    </virtual-list>
  </div>
</template>

<script>
import SpreadSheetBodyItem from './SpreadSheetBodyItem.vue';

import {
  CELL_WIDTH_LEFT_TITLE,
  CELL_WIDTH_LEFT_GROUP,
} from '../SpreadSheetConst';

export default {
  name: 'SpreadSheetBody',
  components: {
    SpreadSheetBodyItem,
  },
  props: {
    rows: { type: Array },
    rowsFixed: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    representations: { type: Map, default() { return new Map(); } },
    images: { type: Object, default() { return {}; } },
    templateColumnWidth: { type: String, default: '' },
    templateTableWidth: { type: Number, default: 0 },
    maxLevelGroupRow: { type: Number, default: 0 },
    maxLevelGroupColumn: { type: Number, default: 0 },
    setExcludedCells: { type: Object, default() { return {}; } },
    setOpenGroupRows: { type: Array, default() { return []; } },
    isGrid: { type: Boolean, default: true },
    isTitle: { type: Boolean, default: true },
  },
  data() {
    return {
      sheetBodyItem: SpreadSheetBodyItem,
      sheetBodyGeometry: null,
      currentSelectedCellName: null,

      selectStart: null,
      selectEnd: null,
    };
  },
  computed: {
    rangeSelect() {
      if (!this.selectEnd) return {};
      if (this.selectStart === this.selectEnd) return {};
      if (!this.selectStart || !this.selectEnd) return {};
      const startRange = {
        left: -100, top: -100, width: 0, height: 0,
      };
      const endRange = {
        left: -100, top: -100, width: 0, height: 0,
      };

      ({
        left: startRange.left, top: startRange.top, width: startRange.width, height: startRange.height,
      } = this.selectStart.getBoundingClientRect());
      ({
        left: endRange.left, top: endRange.top, width: endRange.width, height: endRange.height,
      } = this.selectEnd.getBoundingClientRect());

      if (endRange?.left < startRange?.left) {
        const tLeft = startRange?.left;
        startRange.left = endRange?.left;
        endRange.left = tLeft;
        const tWidth = startRange?.width;
        startRange.width = endRange?.width;
        endRange.width = tWidth;
      }

      if (endRange?.top < startRange?.top) {
        const tTop = startRange?.top;
        startRange.top = endRange?.top;
        endRange.top = tTop;
        const tHeight = startRange?.height;
        startRange.height = endRange?.height;
        endRange.height = tHeight;
      }

      const selectPosition = {
        left: `${startRange?.left - 6 || -100}px`,
        top: `${startRange?.top - 152.5 || -100}px`,
        width: `${(endRange?.left - startRange?.left) + endRange?.width + 3 || 0}px`,
        height: `${(endRange?.top - startRange?.top) + endRange?.height + 3 || 0 }px`,
      };
      return selectPosition;
    },
    setExcludedCellsArray() { return [].concat(...Object.values(this.setExcludedCells)); },
    widthFixedColumn() {
      let width = (CELL_WIDTH_LEFT_GROUP * this.maxLevelGroupRow) + CELL_WIDTH_LEFT_TITLE;
      this.columns.forEach((column) => {
        if (column.fixed) width += column.width;
      });
      // console.log(width);
      return width;
    },
    heightVirtualList() {
      let heightBodyFixed = 156 + (this.maxLevelGroupColumn * (22 + 1));
      for (let i = 0; i < this.rowsFixed.length; i += 1) {
        heightBodyFixed += this.rowsFixed[i].height;
      }
      // console.log(this.maxLevelGroupColumn * (22 + 1));
      if (!this.isTitle) heightBodyFixed -= (this.maxLevelGroupColumn || 1 * (22));
      return {
        height: `calc(100vh - ${heightBodyFixed}px)`,
      };
    },
    widthVirtualList() {
      const title = (this.isTitle) ? 0 : (this.maxLevelGroupRow || 1 * 22) + 38;
      const width = {
        width: `calc(100vw - 10px + ${title}px)`,
      };
      return width;
    },
    extraPropsComponent() {
      return {
        rows: this.rows,
        columns: this.columns,
        cells: this.cells,
        representations: this.representations,
        images: this.images,
        templateColumnWidth: this.templateColumnWidth,
        setExcludedCell: [].concat(...Object.values(this.setExcludedCells)),
        maxLevelGroupRow: this.maxLevelGroupRow,
        setOpenGroupRows: this.setOpenGroupRows,
        isGrid: this.isGrid,
        isTitle: this.isTitle,
      };
    },
  },
  mounted() {
    if ('ontouchstart' in window) { console.log('touch screen'); }
    this.sheetBodyGeometry = this.$refs.SheetBody.$el.getBoundingClientRect();
  },
  methods: {
    evtMousemove(evt) {
      if (evt.buttons === 1) {
        if (evt.target.closest('.column-body')) {
          this.selectEnd = evt.target; // .getAttribute('data-name');
        }
      }
    },
    evtMousedown(evt) {
      if (evt.target.closest('.column-body')) {
        this.selectEnd = null;
        this.selectStart = evt.target; // .getAttribute('data-name');
      }
      const target = evt.target.closest('.column-body');
      if (!target) return;
      if (!target.hasAttribute('data-name')) return;
      const cellName = target.getAttribute('data-name');
      this.$emit('click:cell', { evt, cellName });
      const cell = Object.entries(this.cells).find((item) => item[0] === cellName);
      if (cell) {
        const [, cellValue] = cell;
        const isTrySelected = cellValue.noSelect || false;
        if (isTrySelected) return;
      }
      this.focusCell(this.getCellNodeForName(cellName));
    },
    evtMouseup(evt) {
      if (evt.target.closest('.column-body')) {
        this.selectEnd = evt.target; // .getAttribute('data-name');
      }
    },

    evtDblClickBody(evt) {
      if (!evt.target.hasAttribute('data-name')) return;
      const cellName = evt.target.getAttribute('data-name');
      this.$emit('dblclick:cell', { evt, cellName });
    },
    evtClickBody(evt) {
      if (evt.target.closest('button')) {
        this.toggleRowGroup(evt.target.closest('button'));
      }
    },
    evtKeydownBody(evt) {
      if (this.hasNavigationKey(evt)) return;
      const setTemplateKey = ['Key', 'Numpad', 'Digit', 'Enter', 'Delete', 'Space'];
      if (!setTemplateKey.find((item) => evt.code.includes(item))) return;

      if (this.hasCopy(evt) || this.hasPast(evt)) return;
      if (evt.ctrlKey) return;
      console.log(evt.target);
      evt.preventDefault();
      if (evt.target.hasAttribute('data-name')) {
        const cellName = evt.target.getAttribute('data-name');
        this.$emit('keydown:cell', { evt, cellName });
      }
    },
    hasNavigationKey(evt) {
      if (evt.code === 'ArrowRight' || (evt.code === 'Tab' && evt.shiftKey === false)) this.moveCursorNext(evt.target);
      if (evt.code === 'ArrowLeft' || (evt.code === 'Tab' && evt.shiftKey === true)) this.moveCursorPrevious(evt.target);
      if (evt.code === 'ArrowUp') this.moveCursorUp(evt.target);
      if (evt.code === 'ArrowDown') this.moveCursorDown(evt.target);
      return evt.code.includes('Arrow');
    },

    hasCopy(evt) {
      const cellName = evt.target.getAttribute('data-name');
      if (!cellName) return false;
      if (!(evt.ctrlKey && evt.code === 'KeyC')) return false;
      this.$emit('buffer:copy', cellName);
      return true;
    },
    hasPast(evt) {
      const cellName = evt.target.getAttribute('data-name');
      if (!cellName) return false;
      if (!(evt.ctrlKey && evt.code === 'KeyV')) return false;
      this.$emit('buffer:paste', cellName);
      return true;
    },
    // getSelectedRange() {
    //   let range = null;
    //   if (this.selectStart.hasAttribute('data-name')) {
    //     range = this.selectStart.getAttribute('data-name');
    //   }
    //   if (this.selectEnd.hasAttribute('data-name')) {
    //     range += `:${this.selectEnd.getAttribute('data-name')}`;
    //   }
    //   return range;
    // },

    evtScrollList(evt) {
      this.selectStart = null;
      this.selectEnd = null;
      this.$refs.SheetBodyFixed.scrollLeft = evt.target.scrollLeft;
      this.$emit('scroll-body-x', evt.target.scrollLeft);
    },
    evtResizedList() {
      if (!this.currentSelectedCellName) return;
      const cellSelectedNode = this.getCellNodeForName(this.currentSelectedCellName);
      if (!cellSelectedNode) return;
      const cellSelectedGeometry = cellSelectedNode.getBoundingClientRect();
      if (cellSelectedGeometry.top > this.sheetBodyGeometry.top - 10
        && cellSelectedGeometry.bottom < this.sheetBodyGeometry.bottom) {
        this.focusCell(cellSelectedNode);
      }
    },

    focusCell(target) {
      if (target.getBoundingClientRect().left < this.widthFixedColumn) {
        this.$refs.SheetBody.$el.scrollLeft -= (this.widthFixedColumn - target.getBoundingClientRect().left) + 5;
        this.$refs.SheetBodyFixed.scrollLeft -= (this.widthFixedColumn - target.getBoundingClientRect().left) + 5;
      }
      const geometryVirtualScroll = target.closest('.spread-sheet-body').getBoundingClientRect();
      if (target.getBoundingClientRect().right > geometryVirtualScroll.right) {
        const delta = target.getBoundingClientRect().right - geometryVirtualScroll.right;
        this.$refs.SheetBody.$el.scrollLeft += delta + 17;
        this.$refs.SheetBodyFixed.scrollLeft += delta + 17;
      }
      target.focus();
      this.selectedCell(target.getAttribute('data-name'));
    },
    // focusCellByCellName(cellName) {
    //   this.focusCell(this.getCellNodeForName(cellName));
    // },

    selectedCell(cellName) {
      const cellNode = this.getCellNodeForName(cellName);
      if (cellName === this.currentSelectedCellName) {
        cellNode.classList.add('selected');
        return;
      }
      if (this.currentSelectedCellName && this.getCellNodeForName(this.currentSelectedCellName)) {
        this.getCellNodeForName(this.currentSelectedCellName).classList.remove('selected');
      }
      if (!cellNode) return;
      cellNode.classList.add('selected');
      this.currentSelectedCellName = cellName;
    },

    getMergedCellName(target, direction) {
      const mergedCellName = Object.entries(this.setExcludedCells)
        .find((item) => item[1].includes(this.getExpectedCellName(target, direction)))[0];
      console.log(mergedCellName);
      return mergedCellName;
    },
    getExpectedCellName(target, direction) {
      const currentCellName = target.getAttribute('data-name');
      const { cellRow, cellColumn } = this.parseCellName(currentCellName);
      let column = cellColumn;
      let row = cellRow;
      if (direction === 'next') {
        column = this.columns[this.columns.findIndex((item) => item.name === cellColumn) + 1].name;
      }
      if (direction === 'previous') {
        column = this.columns[this.columns.findIndex((item) => item.name === cellColumn) - 1].name;
      }
      if (direction === 'up') row += 1;
      if (direction === 'down') row -= 1;

      return `${column}${row}`;
    },
    moveCursorNext(target) {
      if (!this.hasElement(target, 'next')) return false;
      if (target.nextSibling.nodeName === 'DIV') {
        this.focusCell(target.nextSibling);
        return true;
      }
      const currentCellName = target.getAttribute('data-name');
      if (this.setExcludedCells[currentCellName]) {
        this.focusCell(target.nextElementSibling);
        return true;
      }
      this.focusCell(this.getCellNodeForName(this.getMergedCellName(target, 'next')));
      return true;
    },

    moveCursorPrevious(target) {
      if (!this.hasElement(target, 'previous')) return false;
      if (target.previousSibling.nodeName === 'DIV' && target.previousSibling.closest('.column-body')) {
        this.focusCell(target.previousSibling);
        return true;
      }
      this.focusCell(this.getCellNodeForName(this.getMergedCellName(target, 'previous')));
      return true;
    },

    hasElement(target, direction) {
      if (direction === 'previous') {
        if (!target.previousSibling) return false;
        if (target.previousSibling.nodeName === 'DIV'
          && target.previousSibling.closest('.column-title')) return false;
      }
      if (direction === 'next') {
        if (!target.nextSibling) return false;
        if (!target.nextElementSibling) return false;
      }
      return true;
    },

    moveCursorUp(target) {
      if (!target.parentElement.parentElement.previousElementSibling) {
        if (!target.closest('.sheet-body') || !target.closest('.sheet-body').previousElementSibling) return false;
      }
      const cellName = target.getAttribute('data-name');
      const { cellColumn } = this.parseCellName(cellName);
      let { cellRow } = this.parseCellName(cellName);
      let cellNamePrevious = `${cellColumn}${cellRow - 1}`;
      // let cellNamePrevious = this.getExpectedCellName(target, 'up');

      let geometryBody = target.closest('.spread-sheet-body').getBoundingClientRect();
      if (!geometryBody) {
        geometryBody = target.closest('.spread-sheet-fixed').getBoundingClientRect();
      }
      let geometryPreviousNode = this.getCellNodeForName(cellNamePrevious);
      if (geometryPreviousNode) {
        // console.log(geometryPreviousNode.getBoundingClientRect().top, ' - ', geometryBody.top + 10);
        if (geometryPreviousNode.getBoundingClientRect().top < geometryBody.top + 10) {
          const delta = (geometryBody.top + 10) - geometryPreviousNode.getBoundingClientRect().top;
          // console.log(delta);
          this.$refs.SheetBody.$el.scrollTop -= delta + 12;
        }
        this.focusCell(geometryPreviousNode);
      } else {
        // console.log(this.rows[this.rows.findIndex((row) => row.value === cellRow) - 1]);
        if (!this.rows[this.rows.findIndex((row) => row.value === cellRow) - 1]) return false;
        cellRow = this.rows[this.rows.findIndex((row) => row.value === cellRow) - 1].value;
        cellNamePrevious = `${cellColumn}${cellRow}`;
        geometryPreviousNode = this.getCellNodeForName(cellNamePrevious);
        if (geometryPreviousNode) {
          // console.log(geometryPreviousNode.getBoundingClientRect().top, ' - ', geometryBody.top + 10);
          if (geometryPreviousNode.getBoundingClientRect().top < geometryBody.top + 10) {
            const delta = (geometryBody.top + 10) - geometryPreviousNode.getBoundingClientRect().top;
            // console.log(delta);
            this.$refs.SheetBody.$el.scrollTop -= delta + 12;
          }
          this.focusCell(geometryPreviousNode);
        } else {
          // console.log(cellNamePrevious);
          const cellNameJoin = Object.entries(this.setExcludedCells)
            .find((item) => item[1].includes(cellNamePrevious))[0];
          geometryPreviousNode = this.getCellNodeForName(cellNameJoin);
          // console.log(geometryPreviousNode.getBoundingClientRect().top, ' - ', geometryBody.top + 10);
          if (geometryPreviousNode.getBoundingClientRect().top < geometryBody.top + 10) {
            const delta = (geometryBody.top + 10) - geometryPreviousNode.getBoundingClientRect().top;
            // console.log(delta);
            this.$refs.SheetBody.$el.scrollTop -= delta + 12;
          }
          this.focusCell(geometryPreviousNode);
        }
        // console.log(cellNamePrevious);
      }
      return true;
    },
    moveCursorDown(target) {
      if (!target.parentElement.parentElement.nextElementSibling) {
        if (!target.closest('.sheet-body-fixed') || !target.closest('.sheet-body-fixed').nextElementSibling) return false;
      }
      const cellName = target.getAttribute('data-name');
      const { cellColumn } = this.parseCellName(cellName);
      let { cellRow } = this.parseCellName(cellName);
      const rowspan = this.cells[cellName] ? this.cells[cellName].rowspan || 1 : 1;
      let cellNameNext = `${cellColumn}${cellRow + rowspan}`;

      const geometryVirtualScroll = target.closest('.spread-sheet-body').getBoundingClientRect();

      let geometryNextNode = this.getCellNodeForName(cellNameNext);
      if (geometryNextNode) {
        if (geometryNextNode.getBoundingClientRect().bottom > geometryVirtualScroll.bottom) {
          const delta = geometryNextNode.getBoundingClientRect().bottom - geometryVirtualScroll.bottom;
          this.$refs.SheetBody.$el.scrollTop += delta + 8;
        }
        this.focusCell(geometryNextNode);
      } else {
        cellRow = this.rows[this.rows.findIndex((row) => row.value === cellRow) + rowspan].value;
        cellNameNext = `${cellColumn}${cellRow}`;
        geometryNextNode = this.getCellNodeForName(cellNameNext);
        if (geometryNextNode) {
          if (geometryNextNode.getBoundingClientRect().bottom > geometryVirtualScroll.bottom) {
            const delta = geometryNextNode.getBoundingClientRect().bottom - geometryVirtualScroll.bottom;
            this.$refs.SheetBody.$el.scrollTop += delta + 8;
          }
          this.focusCell(geometryNextNode);
        } else {
          const cellNameJoin = Object.entries(this.setExcludedCells)
            .find((item) => item[1].includes(cellNameNext))[0];
          geometryNextNode = this.getCellNodeForName(cellNameJoin);
          if (geometryNextNode) {
            if (geometryNextNode.getBoundingClientRect().bottom > geometryVirtualScroll.bottom) {
              const delta = geometryNextNode.getBoundingClientRect().bottom - geometryVirtualScroll.bottom;
              this.$refs.SheetBody.$el.scrollTop += delta + 8;
            }
          }
          this.focusCell(this.getCellNodeForName(cellNameJoin));
        }
        // console.log(cellNameNext);
      }
      return true;
    },

    toggleRowGroup(target) {
      this.$emit('toggle-row-group', {
        value: +target.getAttribute('data-row-parent'),
        index: +target.getAttribute('data-row-index'),
        count: +target.getAttribute('data-row-count'),
        status: !!target.getAttribute('data-row-status'),
        target,
      });
    },

    getCellNodeForName(cellName) {
      return this.$refs.TableBody.querySelector(`[data-name="${cellName}"]`);
    },
    parseCellName(cellName) {
      return {
        cellColumn: cellName.replace(/[0-9]/g, ''),
        cellRow: +cellName.replace(/[A-z]/g, ''),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../SpreadSheet.scss';

.select-area {
  position: absolute;
  left: -100px;
  top: -100px;
  // width: 100px;
  // height: 60px;
  // right: 400px;
  // bottom: 600px;
  border: 2px solid rgb(26, 115, 232);
  z-index: 99;
  background-color: rgba(26, 115, 232, .1);
  pointer-events: none;
}
.spread-sheet-body {
  position: relative;
  font-size: $bodyFontSize;
  font-weight: $bodyFontWeight;
  color: $bodyFontColor;
  .sheet-body-fixed {
    position: relative;
    width: calc(100vw - 10px);
    overflow: hidden;
    &_grid-off {
      border-bottom: 2px solid rgba(0, 0, 0, .3);
    }
    &__item {
      display: flex;
      &_end {
        display:  block;
        min-width: 20px;
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

</style>
