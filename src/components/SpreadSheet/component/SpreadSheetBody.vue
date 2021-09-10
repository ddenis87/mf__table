<template>
  <div ref="TableBody"
       class="spread-sheet__body"
       @click="evtClickBody"
       @dblclick="evtDblClickBody"
       @keydown="evtKeydownBody"
       @mousedown="evtMousedown">
    <tooltip v-bind="propsTooltip"></tooltip>
    <div ref="SheetBodyFixed" v-if="rowsFixed.length"
         class="body-fixed"
         :class="classBodyFixed">
      <div v-for="(rowFixed, rowFixedIndex) in rowsFixed"
           class="body-fixed__wrapper"
           :key="rowFixedIndex"
           :style="styleFixedWrapRow">
        <spread-sheet-body-item :index="rowFixedIndex"
                                :source="rowFixed"
                                :is-fixed="(rowFixedIndex === rowsFixed.length - 1) ? true : false"
                                v-bind="propsItemBodyFixed"></spread-sheet-body-item>
        <div class="body-fixed__wrapper_end"
             :style="styleFixedEnd"></div>
      </div>
      <div class="separator"></div>
    </div>
    <virtual-list ref="SheetBody"
                  class="body-virtual"
                  :style="styleBody"
                  :wrap-style="styleWrapRow"
                  :keeps="120"
                  :data-key="'value'"
                  :data-sources="rows"
                  :data-component="sheetBodyItem"
                  :extra-props="propsItemBody"
                  @scroll="evtScrollList"
                  @resized="evtResizedList">
    </virtual-list>
  </div>
</template>

<script>
import {
  getParseAtSymbolDigit,
} from '@/helpers/spreadSheet';
import Tooltip from '@/components/Form/Tooltip/Tooltip.vue';
import SpreadSheetBodyItem from './SpreadSheetBodyItem.vue';

import {
  // CELL_WIDTH_TITLE,
  CELL_WIDTH_GROUP,
  CELL_HEIGHT_BODY,
  CELL_HEIGHT_GROUP,
  CELL_WIDTH_TITLE,
} from '../SpreadSheetConst';

export default {
  name: 'SpreadSheetBody',
  components: {
    SpreadSheetBodyItem,
    Tooltip,
  },
  props: {
    cells: { type: Object },
    columns: { type: Array },
    deltaHeightVirtualList: { type: Number, default: 168 },
    rows: { type: Array },
    rowsFixed: { type: Array, default() { return []; } },
    tableWidth: { type: Number, default: 0 },
    templateColumnWidth: { type: String, default: '' },
    maxRowGroupingLevel: { type: Number, default: 0 },
    maxColumnGroupingLevel: { type: Number, default: 0 },
    images: { type: Object, default() { return {}; } },
    representations: { type: Map, default() { return new Map(); } },
    setExcludedCells: { type: Object, default() { return {}; } },
    setOpenGroupRows: { type: Array, default() { return []; } },
    isShowGrid: { type: Boolean, default: true },
    isShowGroup: { type: Boolean, default: true },
    isShowTitle: { type: Boolean, default: true },
  },
  data() {
    return {
      sheetBodyItem: SpreadSheetBodyItem,
      propsTooltip: {
        isShow: false,
        position: {
          left: -100,
          top: -100,
        },
      },
      isTooltipTimer: null,
      sheetBodyGeometry: null,
    };
  },
  computed: {
    classBodyFixed() {
      const classNamed = [];
      if (!this.isShowGrid) classNamed.push('body-fixed_grid-off');
      if (this.rowsFixed.length) classNamed.push('body-fixed_separator');
      return classNamed;
    },
    propsItem() {
      return {
        columns: this.columns,
        rows: this.rows,
        cells: this.cells,
        'set-representations': this.representations,
        'set-excluded-cells': [].concat(...Object.values(this.setExcludedCells)),
        'max-row-grouping-level': this.maxRowGroupingLevel,
        'template-column-width': this.templateColumnWidth,
        'is-show-grid': this.isShowGrid,
        'is-show-group': this.isShowGroup,
        'is-show-title': this.isShowTitle,
      };
    },

    propsItemBody() {
      return {
        ...this.propsItem,
        'set-open-group-rows': this.setOpenGroupRows,
        images: this.images,
      };
    },

    propsItemBodyFixed() {
      // console.log(this.templateColumnWidth);
      return {
        ...this.propsItem,
        'template-column-width': `${this.templateColumnWidth} 25px`,
        images: this.images,
      };
    },

    styleBody() {
      return [
        this.heightVirtualList,
        this.widthVirtualList,
        {
          'overflow-y': 'auto',
          position: 'relative',
        },
      ];
    },

    styleFixedEnd() {
      return {
        'grid-column-start': this.columns.length + 2 - 1,
        'grid-column-end': this.columns.length + 2,
      };
    },

    styleWrapRow() {
      return {
        position: 'relative',
        width: `${this.tableWidth}px`,
      };
    },
    styleFixedWrapRow() {
      return {
        position: 'relative',
        width: `${this.tableWidth + 25}px`,
      };
    },
    heightVirtualList() {
      let heightBodyFixed = this.deltaHeightVirtualList + (this.maxColumnGroupingLevel * CELL_HEIGHT_GROUP);
      if (this.maxColumnGroupingLevel !== 0) heightBodyFixed += 4;
      for (let i = 0; i < this.rowsFixed.length; i += 1) {
        heightBodyFixed += this.rowsFixed[i].height;
      }
      if (!this.isShowTitle) heightBodyFixed -= CELL_HEIGHT_BODY;
      return {
        height: `calc(100vh - ${heightBodyFixed}px)`,
      };
    },

    widthFixedArea() {
      const maxRowGroupingLevel = (this.isShowGroup) ? this.maxRowGroupingLevel : 0;
      let width = (maxRowGroupingLevel * CELL_WIDTH_GROUP) + CELL_WIDTH_TITLE + 6;
      this.columns.forEach((column) => {
        if (column.fixed) width += column.width;
      });
      console.log(width);
      return width;
    },

    widthVirtualList() {
      // let title = 0;
      // if (!this.isShowTitle) title = this.maxRowGroupingLevel * CELL_WIDTH_GROUP;
      const width = {
        // width: `calc(100vw - 20px + ${title}px)`,
        width: '100%',
      };
      return width;
    },
  },
  mounted() {
    this.sheetBodyGeometry = this.$refs.SheetBody.$el.getBoundingClientRect();
  },
  methods: {
    evtClickBody(evt) {
      if (evt.target.closest('button')) {
        const rowName = evt.target.closest('button').parentElement.getAttribute('data-row-name');
        this.$emit('open-group:row', +rowName);
        // this.toggleRowGroup(+rowName);
      }
    },

    evtDblClickBody(evt) {
      if (!evt.target.hasAttribute('data-name')) return;
      const cellName = evt.target.getAttribute('data-name');
      // console.log(evt.target.getBoundingClientRect());
      const cellGeometry = {};
      ({
        top: cellGeometry.top,
        left: cellGeometry.left,
        width: cellGeometry.width,
        height: cellGeometry.height,
      } = evt.target.getBoundingClientRect());
      this.$emit('dblclick:cell', { evt, cellName, cellGeometry });
    },

    evtKeydownBody(evt) {
      if (this.isNavigationKey(evt)) return;
      const setTemplateKey = ['Key', 'Numpad', 'Digit', 'Enter', 'Delete', 'Space'];
      if (!setTemplateKey.find((item) => evt.code.includes(item))) return;

      if (this.isCopyKey(evt) || this.isPasteKey(evt)) return;
      if (evt.ctrlKey) return;
      console.log(evt.target);
      evt.preventDefault();
      if (evt.target.hasAttribute('data-name')) {
        const cellName = evt.target.getAttribute('data-name');
        this.$emit('keydown:cell', { evt, cellName });
      }
    },

    evtMousedown(evt) {
      if (evt.target.closest('.column-body')) {
        this.selectEnd = null;
        this.selectStart = evt.target;
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
      this.focusCell(this.getCellNodeForName(cellName), evt);
    },

    evtMouseout() {
      clearTimeout(this.isTooltipTimer);
      if (!this.propsTooltip.isShow) return;
      this.propsTooltip = {
        text: '',
        isShow: false,
        position: {
          left: -100,
          top: -100,
        },
      };
    },

    evtMouseover(evt) {
      this.isTooltipTimer = setTimeout(() => {
        const titleText = evt.target.closest('.column-body')?.getAttribute('data-tooltip');
        if (titleText) {
          const targetPosition = evt.target.closest('.column-body').getBoundingClientRect();
          this.propsTooltip = {
            text: titleText,
            isShow: true,
            position: {
              left: targetPosition.right,
              top: targetPosition.top,
            },
          };
        }
      }, 300);
    },

    evtResizedList() {
      if (!this.currentSelectedCellName) return;
      const cellSelectedNode = this.getCellNodeForName(this.currentSelectedCellName);
      if (!cellSelectedNode) return;
      const cellSelectedGeometry = cellSelectedNode.getBoundingClientRect();
      if (cellSelectedGeometry.top > this.sheetBodyGeometry.top - 10
        && cellSelectedGeometry.bottom < this.sheetBodyGeometry.bottom) {
        this.focusCell(cellSelectedNode, { type: 'mousedown' });
      }
    },

    evtScrollList(evt) {
      this.selectStart = null;
      this.selectEnd = null;
      if (this.$refs.SheetBodyFixed) this.$refs.SheetBodyFixed.scrollLeft = evt.target.scrollLeft;
      this.$emit('scroll-body-x', evt.target.scrollLeft);
    },

    resetScroll() {
      if (this.$refs.SheetBodyFixed) this.$refs.SheetBodyFixed.scrollLeft = 0;
      this.$refs.SheetBody.$el.scrollLeft = 0;
    },

    focusCell(target, evt) {
      if (evt?.type === 'mousedown') {
        target.focus();
        this.selectedCell(target.getAttribute('data-name'));
        return;
      }
      if (target.getBoundingClientRect().left < this.widthFixedArea) {
        this.$refs.SheetBody.$el.scrollLeft -= (this.widthFixedArea - target.getBoundingClientRect().left) + 8;
        this.$refs.SheetBodyFixed.scrollLeft -= (this.widthFixedArea - target.getBoundingClientRect().left) + 8;
      }
      const geometryVirtualScroll = target.closest('.spread-sheet__body').getBoundingClientRect();
      if (target.getBoundingClientRect().right > geometryVirtualScroll.right) {
        const delta = target.getBoundingClientRect().right - geometryVirtualScroll.right;
        this.$refs.SheetBody.$el.scrollLeft += delta + 18;
        this.$refs.SheetBodyFixed.scrollLeft += delta + 18;
      }
      target.focus();
      this.selectedCell(target.getAttribute('data-name'));
    },

    getCellNodeForName(cellName) {
      return this.$refs.TableBody.querySelector(`[data-name="${cellName}"]`);
    },

    getExpectedCellName(target, direction) {
      const currentCellName = target.getAttribute('data-name');
      let { parthDigit: cellRow, parthSymbol: cellColumn } = getParseAtSymbolDigit(currentCellName);
      if (direction === 'next') {
        cellColumn = this.columns[this.columns.findIndex((item) => item.name === cellColumn) + 1].name;
      }
      if (direction === 'previous') {
        cellColumn = this.columns[this.columns.findIndex((item) => item.name === cellColumn) - 1].name;
      }
      if (direction === 'up') {
        cellRow -= 1;
        while (cellRow > 1) {
          if (this.rows.find((row) => row.value === cellRow)
            || this.rowsFixed.find((row) => row.value === cellRow)) break;
          cellRow -= 1;
        }
      }
      if (direction === 'down') {
        cellRow += 1;
        while (cellRow < this.rows[this.rows.length - 1].value) {
          if (this.rows.find((row) => row.value === cellRow)
            || this.rowsFixed.find((row) => row.value === cellRow)) {
            if (!this.setExcludedCells[currentCellName]?.includes(`${cellColumn}${cellRow}`)) {
              break;
            }
          }
          cellRow += 1;
        }
      }
      // console.log(`${cellColumn}${cellRow}`);
      return `${cellColumn}${cellRow}`;
    },

    getMergedCellName(target, direction) {
      const mergedCellName = Object.entries(this.setExcludedCells)
        .find((item) => item[1].includes(this.getExpectedCellName(target, direction)))[0];
      return mergedCellName;
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
      if (direction === 'up') {
        if (!target.parentElement.parentElement.previousSibling
          && !target.closest('.sheet-body')?.previousSibling) return false;
      }
      if (direction === 'down') {
        if (!target.parentElement.parentElement.nextSibling
          && !target.closest('.sheet-body-fixed')?.nextSibling) return false;
      }
      return true;
    },

    isCopyKey(evt) {
      const cellName = evt.target.getAttribute('data-name');
      if (!cellName) return false;
      if (!(evt.ctrlKey && evt.code === 'KeyC')) return false;
      this.$emit('buffer:copy', cellName);
      return true;
    },

    isNavigationKey(evt) {
      evt.preventDefault();
      if (evt.code === 'ArrowRight' || (evt.code === 'Tab' && !evt.shiftKey)) this.moveCursorNext(evt.target);
      if (evt.code === 'ArrowLeft' || (evt.code === 'Tab' && evt.shiftKey)) this.moveCursorPrevious(evt.target);
      if (evt.code === 'ArrowUp') this.moveCursorUp(evt.target);
      if (evt.code === 'ArrowDown') this.moveCursorDown(evt.target);
      return evt.code.includes('Arrow');
    },

    isPasteKey(evt) {
      const cellName = evt.target.getAttribute('data-name');
      if (!cellName) return false;
      if (!(evt.ctrlKey && evt.code === 'KeyV')) return false;
      this.$emit('buffer:paste', cellName);
      return true;
    },

    moveCursorDown(target) {
      if (!this.hasElement(target, 'down')) return false;
      const expectedCellName = this.getExpectedCellName(target, 'down');
      const expectedCell = this.getCellNodeForName(expectedCellName);
      if (expectedCell) {
        this.shiftBodyScrollDown(expectedCell);
        this.focusCell(expectedCell);
        return true;
      }
      const mergedCellName = this.getMergedCellName(target, 'down');
      const mergedCell = this.getCellNodeForName(mergedCellName);
      if (mergedCell) {
        this.shiftBodyScrollDown(mergedCell);
        this.focusCell(mergedCell);
        return true;
      }
      return false;
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

    moveCursorUp(target) {
      if (!this.hasElement(target, 'up')) return false;
      const expectedCellName = this.getExpectedCellName(target, 'up');
      const expectedCell = this.getCellNodeForName(expectedCellName);
      if (expectedCell) {
        this.shiftBodyScrollUp(expectedCell);
        this.focusCell(expectedCell);
        return true;
      }
      const mergedCellName = this.getMergedCellName(target, 'up');
      const mergedCell = this.getCellNodeForName(mergedCellName);
      if (mergedCell) {
        this.shiftBodyScrollUp(mergedCell);
        this.focusCell(mergedCell);
        return true;
      }
      return false;
    },

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

    shiftBodyScrollDown(currentCell) {
      const bodyBorders = this.$refs.TableBody.getBoundingClientRect();
      const cellBorders = currentCell.getBoundingClientRect();
      if (cellBorders.bottom > bodyBorders.bottom) {
        const delta = cellBorders.bottom - bodyBorders.bottom;
        this.$refs.SheetBody.$el.scrollTop += delta + 18;
      }
    },

    shiftBodyScrollUp(currentCell) {
      const bodyBorders = this.$refs.TableBody.getBoundingClientRect();
      const cellBorders = currentCell.getBoundingClientRect();
      if (cellBorders.top < bodyBorders.top + 10) {
        const delta = (bodyBorders.top + 10) - cellBorders.top;
        this.$refs.SheetBody.$el.scrollTop -= delta + 12;
      }
    },

    nextElement(evt) {
      if (evt?.code.includes('Enter')) {
        this.moveCursorDown(evt.target);
      }
      console.log(evt);
    },
  },
};
</script>

<style lang="scss" scoped>
.body-fixed {
  overflow-x: hidden;
  overflow-y: 'auto';
  overflow: hidden;
  position: relative;
  margin-bottom: -1px;
  z-index: 3;
  .separator {
    border-bottom: thin solid rgba(0, 0, 0, .3);
    display: none;
    // z-index: 4;
  }
    &__wrapper {
      &_end {
        display:  block;
        min-width: 25px;
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
