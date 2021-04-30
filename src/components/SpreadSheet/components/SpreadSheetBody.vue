<template>
  <div ref="TableBody"
       class="spread-sheet-body"
       @click="eventClickBody"
       @dblclick="eventDblClickBody"
       @keydown="eventKeydown">
    <div ref="SheetBodyFixed"
         class="sheet-body-fixed">
      <div class="sheet-body-fixed__item" v-for="(rowFixed, rowFixedIndex) in rowsFixed"
           :style="{width: `${templateTableWidth}px`, position: 'relative'}" :key="rowFixedIndex">
        <!-- <template> -->
          <spread-sheet-body-item :source="rowFixed"
                                  :columns="columns"
                                  :cells="cells"
                                  :set-excluded-cell="[].concat(...Object.values(setExcludedCells))"
                                  :max-level-group-row="maxLevelGroupRow"
                                  :template-column-width="templateColumnWidth"></spread-sheet-body-item>
          <div class="sheet-body-fixed__item_end" :key="`end-${rowFixedIndex}`"></div>
        <!-- </template> -->
      </div>
    </div>
    <virtual-list ref="SheetBody"
                  class="sheet-body"
                  :style="[
                    heightVirtualList,
                    {'overflow-y': 'auto', 'width': 'calc(100vw - 10px)', 'position': 'relative',}
                  ]"
                  :wrap-style="{width: `${templateTableWidth}px`, position: 'relative'}"
                  :keeps="80"
                  :data-key="'value'"
                  :data-sources="rows"
                  :data-component="sheetBodyItem"
                  :extra-props="extraPropsComponent"
                  @scroll="scrollBodyX"
                  @resized="eventResized">
    </virtual-list>
  </div>
</template>

<script>
import SpreadSheetBodyItem from './SpreadSheetBodyItem.vue';

const WIDTH_TITLE_LEFT = 60;
const WIDTH_COLUMN_GROUP = 20;

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
    templateColumnWidth: { type: String, default: '' },
    templateTableWidth: { type: Number, default: 0 },
    maxLevelGroupRow: { type: Number, default: 0 },
    setExcludedCells: { type: Object, default() { return {}; } },
  },
  data() {
    return {
      sheetBodyItem: SpreadSheetBodyItem,
      currentSelectedCell: null,
      currentCursorPosition: {
        cellName: null,
        cellRow: null,
        cellColumn: null,
      },
    };
  },
  computed: {
    widthFixedColumn() {
      let width = (WIDTH_COLUMN_GROUP * this.maxLevelGroupRow) + WIDTH_TITLE_LEFT;
      this.columns.forEach((column) => {
        if (column.fixed) width += column.width;
      });
      console.log(width);
      return width;
    },
    heightVirtualList() {
      let heightBodyFixed = 202; //  поправить 202 высота
      for (let i = 0; i < this.rowsFixed.length; i += 1) {
        heightBodyFixed += this.rowsFixed[i].height;
      }
      return {
        height: `calc(100vh - ${heightBodyFixed}px)`,
      };
    },
    extraPropsComponent() {
      return {
        columns: this.columns,
        cells: this.cells,
        templateColumnWidth: this.templateColumnWidth,
        setExcludedCell: [].concat(...Object.values(this.setExcludedCells)),
        maxLevelGroupRow: this.maxLevelGroupRow,
      };
    },
  },
  methods: {
    eventResized() {
      // setTimeout(() => {}, 50);
      if (!this.currentCursorPosition.cellName) return;
      this.focusCell(this.getCellNodeForName(this.currentCursorPosition.cellName));
    },
    eventKeydown(evt) {
      evt.preventDefault();
      // console.log('SpreadSheetBody - Event keydown', new Date().getTime());
      // this.$emit('scroll-body-x', evt.target.closest('.sheet-body').scrollLeft);
      if (evt.code === 'ArrowRight') this.moveCursorNext(evt.target);
      if (evt.code === 'ArrowLeft') this.moveCursorPrevious(evt.target);
      if (evt.code === 'ArrowUp') this.moveCursorUp(evt.target);
      if (evt.code === 'ArrowDown') this.moveCursorDown(evt.target);
    },
    moveCursorNext(target) {
      const elementNextDOM = target.nextSibling;
      if (!elementNextDOM) return false;
      if (elementNextDOM.classList) {
        this.focusCell(elementNextDOM);
        return true;
      }
      const elementNext = target.nextElementSibling;
      if (Object.keys(this.setExcludedCells).includes(this.currentCursorPosition.cellName)) {
        this.focusCell(elementNext);
        return true;
      }
      const cellName = target.getAttribute('data-name');
      const { cellRow, cellColumn } = this.parseCellName(cellName);
      const cellColumnNumber = this.columns.find((column) => column.name === cellColumn).value;
      const cellColumnNext = this.columns.find((column) => column.value === cellColumnNumber + 1).name;
      const cellNameJoin = Object.entries(this.setExcludedCells).find((item) => item[1].includes(`${cellColumnNext}${cellRow}`))[0];
      this.focusCell(this.getCellNodeForName(cellNameJoin));
      return true;
    },

    moveCursorPrevious(target) {
      const elementPreviousDOM = target.previousSibling;
      if (!elementPreviousDOM) return false;
      if (elementPreviousDOM.classList) {
        this.focusCell(elementPreviousDOM);
        return true;
      }
      const elementPrevious = target.previousElementSibling;
      if (Object.keys(this.setExcludedCells).includes(this.currentCursorPosition.cellName)) {
        this.focusCell(elementPrevious);
        return true;
      }
      const cellName = target.getAttribute('data-name');
      const { cellRow, cellColumn } = this.parseCellName(cellName);
      const cellColumnNumber = this.columns.find((column) => column.name === cellColumn).value;
      const cellColumnPrevious = this.columns.find((column) => column.value === cellColumnNumber - 1).name;
      const cellNameJoin = Object.entries(this.setExcludedCells).find((item) => item[1].includes(`${cellColumnPrevious}${cellRow}`))[0];
      this.focusCell(this.getCellNodeForName(cellNameJoin));
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
      if (this.getCellNodeForName(cellNamePrevious)) {
        this.focusCell(this.getCellNodeForName(cellNamePrevious));
      } else {
        cellRow = this.rows[this.rows.findIndex((row) => row.value === cellRow) - 1].value;
        cellNamePrevious = `${cellColumn}${cellRow}`;
        if (this.getCellNodeForName(cellNamePrevious)) {
          this.focusCell(this.getCellNodeForName(cellNamePrevious));
        } else {
          console.log(cellNamePrevious);
          const cellNameJoin = Object.entries(this.setExcludedCells)
            .find((item) => item[1].includes(cellNamePrevious))[0];
          this.focusCell(this.getCellNodeForName(cellNameJoin));
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
      if (this.getCellNodeForName(cellNameNext)) {
        this.focusCell(this.getCellNodeForName(cellNameNext));
      } else {
        cellRow = this.rows[this.rows.findIndex((row) => row.value === cellRow) + rowspan].value;
        cellNameNext = `${cellColumn}${cellRow}`;
        if (this.getCellNodeForName(cellNameNext)) {
          this.focusCell(this.getCellNodeForName(cellNameNext));
        } else {
          const cellNameJoin = Object.entries(this.setExcludedCells)
            .find((item) => item[1].includes(cellNameNext))[0];
          this.focusCell(this.getCellNodeForName(cellNameJoin));
        }
        // console.log(cellNameNext);
      }
      return true;
    },

    focusCell(target) {
      const eventClick = new Event('click', { bubbles: true });
      if (!target) return;
      if (target.getBoundingClientRect().left < this.widthFixedColumn) {
        this.$refs.SheetBody.$el.scrollLeft -= (this.widthFixedColumn - target.getBoundingClientRect().left) + 5;
      }
      target.focus();
      target.dispatchEvent(eventClick);
    },
    eventDblClickBody(evt) {
      if (evt.target.hasAttribute('data-name')) this.$emit('edit-cell', evt);
    },
    scrollBodyX(evt) {
      this.$refs.SheetBodyFixed.scrollLeft = evt.target.scrollLeft;
      console.log('SpreadSheetBody - Event scroll', new Date().getTime());
      this.$emit('scroll-body-x', evt.target.scrollLeft);
    },
    eventClickBody(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').getAttribute('data-row-parent')) {
        if (this.currentSelectedCell) {
          this.currentSelectedCell.classList.remove('selected');
          this.currentSelectedCell = null;
          this.currentCursorPosition.cellName = null;
        }
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
        status: !!target.getAttribute('data-row-status'),
        target,
      });
    },

    selectedCell(evt) {
      if (!evt.target.closest('.column-body')) return;
      if (this.currentSelectedCell === evt.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('selected');
      evt.target.classList.add('selected');
      this.currentSelectedCell = evt.target;
      this.setCurrentCursorPosition(evt.target);
    },

    setCurrentCursorPosition(target) {
      const cellName = target.getAttribute('data-name');
      this.currentCursorPosition = {
        cellName,
        cellRowPrevious: this.currentCursorPosition.cellRow,
        ...this.parseCellName(cellName),
      };
    },
    getCellNodeForName(cellName) {
      return this.$refs.TableBody.querySelector(`[data-name="${cellName}"]`);
    },
    parseCellName(cellName) {
      return {
        cellColumn: cellName.replace(/[0-9]/g, ''),
        cellRow: +cellName.replace(/[a-z]/g, ''),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../SpreadSheet.scss';
.spread-sheet-body {
  font-size: $bodyFontSize;
  font-weight: $bodyFontWeight;
  color: $bodyFontColor;
  .sheet-body-fixed {
    position: relative;
    width: calc(100vw - 10px);
    overflow-y: auto;
    &__item {
      display: flex;
      &_end {
        display:  block;
        min-width: 10px;
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .sheet-body {
    &::-webkit-scrollbar {
      display: block;
      width: $scrollWidth;
      height: $scrollHeight;
      border-radius: $scrollBorderRadius;
      &-thumb {
        border-radius: $scrollThumbBorderRadius;
        background-color: $scrollThumbBackgroundColor;
      }
    }
  }
}

</style>
