<template>
  <div class="spread-sheet" ref="SpreadSheet">
    <table class="table" @click="eventClickTable">
      <spread-sheet-head :columns="columns"
                         :column-count="columnCount"
                         :current-table-column-level="currentTableColumnLevel"
                         :current-table-row-level="currentTableLevel"></spread-sheet-head>

      <spread-sheet-body :rows="rows"
                         :row-count="rowCount"
                         :columns="columns"
                         :column-count="columnCount"
                         :cells="cells"
                         :current-table-level="currentTableLevel"></spread-sheet-body>
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
      openColumnGroup: {},
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
    currentTableColumnLevel() {
      if (Object.keys(this.openColumnGroup).length === 0) {
        if (Object.values(this.columns).find((item) => Object.keys(item).includes('columnGroup'))) return 1;
        return 0;
      }
      return Math.max(...Object.values(this.openColumnGroup));
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
          currentRow.children[this.getLevelRow(groupParent) - 1].classList.add('column-group_child-first');
          for (let i = 0; i < countRowInGroup - 1; i += 1) {
            currentRow = currentRow.nextElementSibling;
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
        evt.closest('.body-row').children[this.getLevelRow(groupParent) - 1].classList.remove('column-group_child-first');
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

    // closeRowGroup(evt, groupParent) {
    //   const rowsGroup = evt.closest('tbody').querySelectorAll(`[data-row-parent="${groupParent}"]`);
    //   rowsGroup.forEach((element) => {
    //     element.classList.add('hidden');
    //   });
    // },

    toggleColumnGroup(evt) {
      const groupParent = evt.getAttribute('data-column-group-parent');
      const groupStatus = evt.getAttribute('data-column-group-status');
      // const columnsGroup = evt.closest('table').querySelectorAll(`[data-column-parent="${groupParent}"]`);
      const btnIcon = evt.querySelector('i');
      if (groupStatus === 'close') {
        const countColumnInGroup = evt.closest('th').getAttribute('data-column-count-group') - 1;
        let currentColumn = evt.closest('th');
        currentColumn.classList.add('head-row__column-group_child-first');
        for (let i = 0; i < countColumnInGroup - 1; i += 1) {
          currentColumn = currentColumn.nextElementSibling;
          currentColumn.classList.add('head-row__column-group_child');
        }
        currentColumn.nextElementSibling.classList.add('head-row__column-group_child-last');
        
        btnIcon.classList.remove('mdi-plus-box-outline');
        btnIcon.classList.add('mdi-minus-box-outline');
        evt.setAttribute('data-column-group-status', 'open');
        if (Object.values(this.columns).filter((item) => item.parent === groupParent).find((item) => Object.keys(item).includes('columnGroup'))) {
          Vue.set(this.openColumnGroup, groupParent, this.getLevelColumn(groupParent) + 1);
        }
        setTimeout(() => {
          const columnsGroup = evt.closest('table').querySelectorAll(`[data-column-parent="${groupParent}"]`);
          columnsGroup.forEach((element) => {
            element.classList.remove('hidden');
          });
        }, 100);
        console.log(this.openColumnGroup);
      } else {
        const groupStart = +evt.closest('th').getAttribute('data-column-number');
        const countColumnInGroup = evt.closest('th').getAttribute('data-column-count-group') - 1;

        const rowsHead = evt.closest('thead').querySelectorAll('tr');
        rowsHead.forEach((element) => {
          const columns = element.querySelectorAll('th');
          let currentColumn = columns[groupStart];
          for (let i = 0; i < countColumnInGroup; i += 1) {
            currentColumn.classList.add('hidden');
            currentColumn = currentColumn.nextElementSibling;
          }
        });
        const rowsBody = evt.closest('table').querySelector('tbody').querySelectorAll('tr');
        rowsBody.forEach((element) => {
          const columns = element.querySelectorAll('td');
          let currentColumn = columns[groupStart];
          for (let i = 0; i < countColumnInGroup; i += 1) {
            currentColumn.classList.add('hidden');
            currentColumn = currentColumn.nextElementSibling;
          }
        });
        evt.closest('th').classList.remove('head-row__column-group_child-first');
        btnIcon.classList.add('mdi-plus-box-outline');
        btnIcon.classList.remove('mdi-minus-box-outline');
        evt.setAttribute('data-column-group-status', 'close');

        this.openColumnGroup[groupParent] = 0;
        delete this.openColumnGroup[groupParent];
      }
    },

    getLevelColumn(columnName) {
      let level = 1;
      let currentColumn = columnName;
      let condition = true;
      while (condition) {
        if (!this.columns[currentColumn].parent) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns[currentColumn].parent;
      }
      return level;
    },

    closeColumnGroup(evt) {
      const groupParent = evt.getAttribute('data-column-group-parent');
      const btnIcon = evt.querySelector('i');
      const columnsGroup = evt.closest('table').querySelectorAll(`[data-column-parent="${groupParent}"]`);
      columnsGroup.forEach((element) => {
        element.classList.add('hidden');
      });
      btnIcon.classList.add('mdi-plus-box-outline');
      btnIcon.classList.remove('mdi-minus-box-outline');
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
