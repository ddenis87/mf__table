<template>
  <div class="spread-sheet" ref="SpreadSheet">
    <table class="table" @click="eventClickTable">
      <spread-sheet-head :column-count="columnCount"
                         :columns="columns"
                         :row-group-level="rowGroupLevel"
                         :shift-title-column="shiftTitleColumn"
                         :shift-title-row="shiftTitleRow"
                         :is-rows-group="isRowsGroup"></spread-sheet-head>
      <spread-sheet-body :row-count="rowCount"
                         :rows="rows"
                         :column-count="columnCount"
                         :columns="columns"
                         :cells="cells"
                         :row-group-level="rowGroupLevel"
                         :shift-title-row="shiftTitleRow"
                         :is-rows-group="isRowsGroup"></spread-sheet-body>
    </table>
  </div>
</template>

<script>
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
      columnGroupLevel: 1,
    };
  },
  computed: {
    shiftTitleColumn() {
      return { top: `${22 * this.columnGroupLevel}px` };
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
    // thead {
    //   .head-row {
    //     height: 24px;
    //     font-size: 0.75em;
    //     color: rgba(0, 0, 0, 0.5);
    //     .head-column {
    //       position: sticky;
    //       top: 0px;
    //       padding: 2px;
    //       min-width: 94px;
    //       border-left: thin solid grey;
    //       box-shadow: inset 0 1px 0 grey, inset 0 -1px 0 grey, 1px 0 0 grey;
    //       background-color: #dadce0;
    //       z-index: 100;
    //       &__title {
    //         position: sticky;
    //         top: 0px;
    //         left: 0px;
    //         box-shadow: -1px 0px 0 grey, 1px 0px 0 grey, inset 0 1px 0 grey, inset 0 -1px 0 grey;
    //         min-width: 60px;
    //         max-width: 60px;
    //         width: 60px;
    //         z-index: 200;
    //         // &_group {
    //         //   left: 25px;
    //         // }
    //       }
    //       &__group {
    //         position: sticky;
    //         left: 0px;
    //         min-width: 25px;
    //         max-width: 25px;
    //         width: 25px;
    //         box-shadow: -1px 0px 0 grey, 1px 0px 0 grey, inset 0 1px 0 grey, inset 0 -1px 0 grey;
    //         z-index: 210;
    //       }
    //     }
    //   }
    // }

    // tbody {
    //   position: relative;
      // .body-row {
        // &__column {
    //     height: 24px;
    //     box-sizing: border-box;
    //     &-group {
    //       &_hidden {
    //         display: none;
    //         // visibility: hidden;
    //       }
    //     }
    //     .body-column {
    //       position: relative;
    //       padding: 2px 3px;
    //       font-size: 0.8em;
    //       border-bottom: thin solid grey;
    //       border-left: thin solid grey;
    //       box-sizing: border-box;
    //       overflow: hidden;
    //       &:last-child {
    //         border-right: thin solid grey;
    //       }
    //       &__title {
    //         position: sticky;
    //         left: 0px;
    //         border-left: 0px;
    //         box-shadow: inset 1px 0px 0 grey, 1px 0px 0 grey;
    //         text-align: center;
    //         font-size: 0.75em;
    //         font-weight: bold;
    //         background-color: #dadce0;
    //         color: rgba(0, 0, 0, 0.5);
    //         z-index: 150;
    //         // &_group {
    //         //   left: 25px;
    //         // }
    //       }
    //       &__group {
    //         position: sticky;
    //         left: 0px;
    //         border-bottom: 0px;
    //         background-color: #dadce0;
    //         box-shadow: -1px 0px 0 grey, 0px 0px 0 grey;
    //         z-index: 160;

    //       }
          // &_selected::after {
          //   content: '';
          //   position: absolute;
          //   top: 0px;
          //   right: 0px;
          //   bottom: 0px;
          //   left: 0px;
          //   border: 2px solid #1a73e8;
          // }
        // }
      // }
    // }
  }
}
</style>
