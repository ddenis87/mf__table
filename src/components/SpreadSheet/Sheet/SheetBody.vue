<template>
  <div @click="eventClickBody"
       @dblclick="eventDblclickBody">
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
    setExcludedCell: { type: Array },
  },
  data() {
    return {
      sheetBodyItem: SheetBodyItem,
    };
  },
  computed: {
    extraPropsComponent() {
      return {
        columns: this.columns,
        cells: this.cells,
        templateRow: this.templateRow,
        setExcludedCell: this.setExcludedCell,
        maxLevelGroupRow: this.maxLevelGroupRow,
      };
    },
  },

  methods: {
    eventDblclickBody(evt) {
      console.log(evt.target);
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
