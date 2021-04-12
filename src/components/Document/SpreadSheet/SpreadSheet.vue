<template>
  <div class="spread-sheet" ref="SpreadSheet">
    <table class="table" @click="eventClickTable">
      <spread-sheet-head :current-table-level="currentTableLevel"
                        :column-count="columnCount"
                         :columns="columns"
                         :row-group-level="rowGroupLevel"
                         :shift-title-column="columnGroupLevel"
                         :shift-title-row="shiftTitleRow"
                         :is-rows-group="isRowsGroup"></spread-sheet-head>
      <spread-sheet-body :current-table-level="currentTableLevel"
                        :row-count="rowCount"
                         :rows="rows"
                         :column-count="columnCount"
                         :columns="columns"
                         :cells="cells"
                         :row-group-level="rowGroupLevel"
                         :is-rows-group="isRowsGroup"></spread-sheet-body>
    </table>
  </div>
</template>

<script>
import Vue from 'vue';
import SpreadSheetProps from './SpreadSheetProps';
import SpreadSheetComputed from './SpreadSheetComputed';
import SpreaSheetRow from './SpreadSheetRow';

import SpreadSheetHead from './components/SpreadSheetHead/SpreadSheetHead.vue';
import SpreadSheetBody from './components/SpreadSheetBody/SpreadSheetBody.vue';

export default {
  name: 'SpreadSheet',
  mixins: [
    SpreadSheetProps,
    SpreadSheetComputed,
    SpreaSheetRow,
  ],
  components: {
    SpreadSheetHead,
    SpreadSheetBody,
  },
  data() {
    return {
      openColumnGroup: new Map(),
      openRowGroup: {},
      columnGroupLevel: 1,
    };
  },
  computed: {
    currentTableLevel() {
      if (Object.keys(this.openRowGroup).length === 0) {
        if (Object.values(this.rows).find((item) => Object.keys(item).includes('rowGroup'))) return 1;
        return 0;
      }
      return Math.max(...Object.values(this.openRowGroup));
    },
    
    shiftTitleColumn() {
      return { top: `${24 * this.columnGroupLevel}px` };
    },
  },
  methods: {
    eventClickTable(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').hasAttribute('data-column-group-parent')) {
        this.toggleColumnGroup(evt.target.closest('button'));
        return;
      }
      if (evt.target.closest('button') && evt.target.closest('button').hasAttribute('data-row-group-parent')) {
        this.toggleRowGroup(evt.target.closest('button'));
        return;
      }
      this.selectedCell(evt);
    },
    toggleRowGroup(evt) {
      const groupParent = evt.getAttribute('data-row-group-parent');
      const groupStatus = evt.getAttribute('data-row-group-status');
      const rowsGroup = evt.closest('tbody').querySelectorAll(`[data-row-parent="${groupParent}"]`);
      const btnIcon = evt.querySelector('i');
      if (groupStatus === 'close') {
        const countRowInGroup = evt.closest('.body-row').getAttribute('data-row-count-group') - 1;
        let currentRow = evt.closest('.body-row');
        // const currentLevel = this.currentTableLevel - 1;
        rowsGroup.forEach((element) => {
          element.classList.remove('hidden');
        });
        setTimeout(() => {
          for (let i = 0; i < countRowInGroup - 1; i += 1) {
            currentRow = currentRow.nextElementSibling;
            // console.log(this.getLevelRow(groupParent));
            currentRow.children[this.getLevelRow(groupParent) - 1].classList.add('column-group_child');
          }
          currentRow.nextElementSibling.children[this.getLevelRow(groupParent) - 1].classList.add('column-group_child-last');
        }, 300);
        btnIcon.classList.remove('mdi-plus-box-outline');
        btnIcon.classList.add('mdi-minus-box-outline');
        evt.setAttribute('data-row-group-status', 'open');
        if (Object.values(this.rows).filter((item) => item.parent === groupParent).find((item) => Object.keys(item).includes('rowGroup'))) {
          Vue.set(this.openRowGroup, groupParent, this.getLevelRow(groupParent) + 1);
        }
      } else {
        const countRowInGroup = evt.closest('.body-row').getAttribute('data-row-count-group') - 1;
        let currentRow = evt.closest('.body-row');
        for (let i = 0; i < countRowInGroup; i += 1) {
          currentRow = currentRow.nextElementSibling;
          if (currentRow.querySelector('button')) {
            currentRow.querySelector('button').setAttribute('data-row-group-status', 'close');
            currentRow.querySelector('button i').classList.remove('mdi-minus-box-outline');
            currentRow.querySelector('button i').classList.add('mdi-plus-box-outline');

            const parentChild = currentRow.querySelector('button').getAttribute('data-row-group-parent');
            this.openRowGroup[parentChild] = 0;
            delete this.openRowGroup[parentChild];
          }
          currentRow.classList.add('hidden');
        }
        btnIcon.classList.add('mdi-plus-box-outline');
        btnIcon.classList.remove('mdi-minus-box-outline');
        evt.setAttribute('data-row-group-status', 'close');

        this.openRowGroup[groupParent] = 0;
        delete this.openRowGroup[groupParent];
      }
    },

    getLevelRow(rowNumber) {
      let level = 1;
      let currentRow = rowNumber;
      let condition = true;

      while (condition) {
        if (!this.rows[currentRow].parent) { condition = false; return level; }
        level += 1;
        currentRow = this.rows[currentRow].parent;
      }
      return level;
    },

    closeRowGroup(evt, groupParent) {
      const rowsGroup = evt.closest('tbody').querySelectorAll(`[data-row-parent="${groupParent}"]`);
      rowsGroup.forEach((element) => {
        element.classList.add('hidden');
      });
    },

    toggleColumnGroup(evt) {
      const columnGroupParent = evt.getAttribute('data-column-group-parent');
      const columnGroupStatus = evt.getAttribute('data-column-group-status');
      const columnsGroup = document.querySelectorAll(`[data-column-parent="${columnGroupParent}"]`);
      const btnGroupImg = evt.querySelector('i');
      if (columnGroupStatus === 'close') {
        columnsGroup.forEach((element) => {
          element.classList.remove('hidden');
        });
        evt.setAttribute('data-column-group-status', 'open');
        this.openColumnGroup.set(columnGroupParent, this.getLevelColumnGroup(columnGroupParent));
      } else {
        columnsGroup.forEach((element) => {
          element.classList.add('hidden');
        });
        evt.setAttribute('data-column-group-status', 'close');
        this.openColumnGroup.delete(columnGroupParent);
      }
      btnGroupImg.classList.toggle('mdi-plus-box-outline');
      btnGroupImg.classList.toggle('mdi-minus-box-outline');

      let shift = 0;
      this.openColumnGroup.forEach((value) => {
        if (value > shift) shift = value;
      });
      this.columnGroupLevel = shift + 1;
      console.log(this.columnGroupLevel);
    },
    getLevelColumnGroup(columnNumber) {
      let level = 1;
      let currentColumn = columnNumber;
      let condition = true;

      while (condition) {
        if (!this.columns[currentColumn].parent) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns[currentColumn].parent;
      }
      return level;
    },
    selectedCell(event) {
      // console.log(event);
      if (this.currentSelectedCell === event.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('body-row__column_selected');
      event.target.classList.add('body-row__column_selected');
      this.currentSelectedCell = event.target;
    },
  },
};
</script>

<style lang="scss">
$scrollWidth: 8px;
$scrollHeight: 8px;
$scrollBorderRadius: 4px;
$scrollThumbBorderRadius: 3px;
$scrollThumbBackgroundColor: rgba(0,0,0,0.2);

$borderRadius: 0px 4px 4px 4px;
$boxShadow: 0 -1px 1px -1px rgba(0,0,0,.2),
            0 2px 1px -1px rgba(0,0,0,.2),
            0 1px 1px 0 rgba(0,0,0,.14),
            0 1px 3px 0 rgba(0,0,0,.12);

.spread-sheet {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }

  .table {
    position: relative;
    border-collapse: collapse;
    table-layout: fixed;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
  }
}
</style>
