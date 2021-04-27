<template>
  <div @click="eventClickBody"
       @dblclick="eventDblClickBody"
       @keydown="eventKeydown">
    <virtual-list class="sheet-body"
                  style="height: calc(100vh - 202px); overflow-y: auto; width: calc(100vw - 10px);"
                  :wrap-style="{width: `${templateTableWidth}px`}"
                  :keeps="100"
                  :data-key="'value'"
                  :data-sources="rows"
                  :data-component="sheetBodyItem"
                  :extra-props="extraPropsComponent"
                  @scroll="scrollBodyX">
    </virtual-list>
  </div>
</template>

<script>
import SheetBodyItem from './SheetBodyItem.vue';

export default {
  name: 'SheetBody',
  props: {
    rows: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    templateRow: { type: String, default: '' },
    templateTableWidth: { type: Number, default: 0 },
    maxLevelGroupRow: { type: Number, default: 0 },
    setExcludedCells: { type: Object, default() { return {}; } },
  },
  data() {
    return {
      sheetBodyItem: SheetBodyItem,
      currentCursorPosition: {
        cellName: null,
        row: null,
        column: null,
      },
    };
  },
  computed: {
    extraPropsComponent() {
      return {
        columns: this.columns,
        cells: this.cells,
        templateRow: this.templateRow,
        setExcludedCell: [].concat(...Object.values(this.setExcludedCells)),
        maxLevelGroupRow: this.maxLevelGroupRow,
      };
    },
  },

  methods: {
    eventKeydown(evt) {
      evt.preventDefault();
      if (evt.code === 'ArrowRight') this.shiftCursorNext();
      if (evt.code === 'ArrowLeft') this.shiftCursorPrevious();
      if (evt.code === 'ArrowUp') this.shiftCursorUp();
      if (evt.code === 'ArrowDown') this.shiftCursorDown();
      // console.log(evt.target);
      if (evt.code === 'ArrowRight' && evt.target.nextElementSibling) {
        const eventClick = new Event('click', { bubbles: true });
        evt.target.nextElementSibling.focus();
        evt.target.nextElementSibling.dispatchEvent(eventClick);
      }
      if (evt.code === 'ArrowLeft' && evt.target.previousElementSibling) {
        const eventClick = new Event('click', { bubbles: true });
        evt.target.previousElementSibling.focus();
        evt.target.previousElementSibling.dispatchEvent(eventClick);
      }
      if (evt.code === 'ArrowDown' && evt.target.parentElement.parentElement.nextElementSibling) {
        const elementIndex = +evt.target.getAttribute('tabindex') + 1;
        const elementParentNext = evt.target.parentElement.parentElement.nextElementSibling;
        const elementNext = elementParentNext.firstChild.children[this.maxLevelGroupRow + elementIndex];
        const eventClick = new Event('click', { bubbles: true });
        elementNext.focus();
        elementNext.dispatchEvent(eventClick);
      }
      if (evt.code === 'ArrowUp' && evt.target.parentElement.parentElement.previousElementSibling) {
        const elementIndex = +evt.target.getAttribute('tabindex') + 1;
        const elementParentPrevious = evt.target.parentElement.parentElement.previousElementSibling;
        const elementPrevious = elementParentPrevious.firstChild.children[this.maxLevelGroupRow + elementIndex];
        const eventClick = new Event('click', { bubbles: true });
        elementPrevious.focus();
        elementPrevious.dispatchEvent(eventClick);
      }
      // console.log(evt);
    },
    shiftCursorNext(target) {
      if (!target.nextElementSibling) return false;
      const newTarget = null;
      this.focusCell(newTarget);
      return true;
    },
    shiftCursorPrevious(target) {
      if (!target.previousElementSibling) return false;
      const newTarget = null;
      this.focusCell(newTarget);
      return true;
    },
    shiftCursorUp(target) {
      if (!target.parentElement.parentElement.nextElementSibling) return false;
      const newTarget = null;
      this.focusCell(newTarget);
      return true;
    },
    shiftCursorDown(target) {
      if (!target.parentElement.parentElement.previousElementSibling) return false;
      const newTarget = null;
      this.focusCell(newTarget);
      return true;
    },
    focusCell(target) {
      const eventClick = new Event('click', { bubbles: true });
      target.focus();
      target.dispatchEvent(eventClick);
    },
    eventDblClickBody(evt) {
      if (evt.target.hasAttribute('data-name')) this.$emit('edit-cell', evt);
    },
    scrollBodyX(evt) {
      this.$emit('scroll-body-x', evt.target.scrollLeft);
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
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Variables.scss';
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
</style>
