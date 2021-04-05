<template>
  <div class="spread-sheet">
    <table class="table" @click="selectedCell" @mouseup="selectedCellEnd">
      <thead>
        <tr class="head-row">
          <th class="head-column head-column__title"></th>
          <th v-for="j in 25"
              :key="`head-column-${j}`"
              class="head-column"
              :style="columnStyle(j)">{{ getTitleForNumberColumn(j) }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in 60"
            :key="`body-row-${i}`"
            class="body-row">
          <td class="body-column body-column__title">{{ i }}</td>
          <td v-for="j in 25"
              :key="`body-column-${j}`"
              class="body-column" :style="cellStyle(`${getTitleForNumberColumn(j).toLowerCase()}${i}`)">
            {{ cellProperties(`${getTitleForNumberColumn(j).toLowerCase()}${i}`).value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SpreadSheetProps from './SpreadSheetProps';

export default {
  name: 'SpreadSheet',
  mixins: [
    SpreadSheetProps,
  ],
  data() {
    return {
      currentSelectedCell: null,
      setChar: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

      styleClass: {
        fontSize: '16px',
      },
    };
  },
  methods: {
    columnStyle(columnNumber) {
      const columnName = this.getTitleForNumberColumn(columnNumber).toLowerCase();
      return this.columns.find((item) => item.name === columnName)?.style || {};
    },
    cellProperties(cellName) {
      const cellProperties = this.cells.find((item) => item.name === cellName);
      if (!cellProperties) return {};
      return cellProperties;
    },
    cellStyle(cellName) {
      const cellStyle = {};
      const cellStyleList = this.cells.find((item) => item.name === cellName.toLowerCase())?.style;
      if (!cellStyleList) return cellStyle;
      return this.cellsStyles.find((item) => item.name === cellStyleList)?.list;
    },
    // columnStyle(columnName) {
    //   const columnStyle = {};
    //   const columnStyleList = this.columns.find((item) => item.name === columnName.toLowerCase())?.style;
    //   if (!columnStyleList) return columnStyle;
    //   if (typeof (columnStyleList) === 'string') {
    //     return this.columnsStyles.find((item) => item.name === columnStyleList).value;
    //   }
    //   columnStyleList.forEach((element) => {
    //     const style = this.columnsStyles.find((item) => item.name === element);
    //     if (style) {
    //       Object.assign(columnStyle, style.value);
    //     }
    //   });
    //   console.log(columnStyle);
    //   return columnStyle;
    // },
    // cellProperties(cellName) {
    //   const cellsProperties = this.cells.find((item) => item.name === cellName.toLowerCase());
    //   if (!cellsProperties) return {};

    //   if (Object.keys(cellsProperties).includes('spanColRow')) {
    //     if (typeof (cellsProperties.spanColRow) === 'number') {
    //       cellsProperties.colspan = cellsProperties.spanColRow;
    //       cellsProperties.rowspan = cellsProperties.spanColRow;
    //     } else {
    //       cellsProperties.colspan = cellsProperties.spanColRow[0] || 1;
    //       cellsProperties.rowspan = cellsProperties.spanColRow[1] || 1;
    //     }
    //   }
    //   return cellsProperties;
    // },
    // cellStyle(cellName) {
    //   const cellStyle = {};
    //   const cellStyleList = this.cells.find((item) => item.name === cellName.toLowerCase())?.style;
    //   if (!cellStyleList) return cellStyle;
    //   if (typeof (cellStyleList) === 'string') {
    //     return this.cellsStyles.find((item) => item.name === cellStyleList).value;
    //   }
    //   cellStyleList.forEach((element) => {
    //     const style = this.cellsStyles.find((item) => item.name === element);
    //     if (style) {
    //       Object.assign(cellStyle, style.value);
    //     }
    //   });
    //   // console.log(cellStyle);
    //   return cellStyle;
    // },
    // cellStyle(cellName) {
    //   const cellStyle = [];
    //   const cellStyleList = this.cells.find((item) => {
    //     item.name === cellName.toLowerCase()
    //   })?.style;
    //   if (!cellStyleList) return cellStyle;
    //   if (typeof (cellStyleList) === 'string') {
    //     return [this.cellsStyles.find((item) => item.name === cellStyleList).value];
    //   }
    //   cellStyleList.forEach((element) => {
    //     if (this.cellsStyles.find((item) => item.name === element)) {
    //       cellStyle.push(this.cellsStyles.find((item) => item.name === element).value);
    //     }
    //   });
    //   console.log(cellStyle);
    //   return cellStyle;
    // },
    selectedCell(event) {
      if (this.currentSelectedCell === event.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('body-column__selected');
      event.target.classList.add('body-column__selected');
      this.currentSelectedCell = event.target;
    },
    selectedCellStart() {
      // console.log(event.target);
    },
    selectedCellEnd() {
      // console.log(event.target);
    },

    getTitleForNumberColumn(number) {
      if (number > 702) return 'Infinity';
      if (number <= this.setChar.length) return this.setChar[number - 1];
      if ((number % this.setChar.length) === 0) return `${this.setChar[((number - this.setChar.length) / this.setChar.length) - 1]}${this.setChar[this.setChar.length - 1]}`;
      return `${this.setChar[(Math.floor(number / this.setChar.length)) - 1]}${this.setChar[(number % this.setChar.length) - 1]}`;
    },
  },
};
</script>

<style lang="scss" scoped>
$scrollWidth: 8px;
$scrollHeight: 8px;
$scrollBorderRadius: 4px;
$scrollThumbBorderRadius: 3px;
$scrollThumbBackgroundColor: rgba(0,0,0,0.2);

$borderRadius: 0px 0px 4px 4px;
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
    border-collapse: collapse;
    table-layout: fixed;
    font-family: Arial, Helvetica, sans-serif;

    font-size: 16px;
    thead {
      position: sticky;
      top: 0px;
      .head-row {
        height: 24px;
        font-size: 0.75em;
        background-color: rgba(0, 0, 0, 0.1);
        color: rgba(0, 0, 0, 0.5);
        .head-column {
          padding: 2px;
          min-width: 94px;
          border: thin solid grey;
          &__title {
            min-width: 60px;
          }
        }
      }
    }

    tbody {
      .body-row {
        height: 24px;
        box-sizing: border-box;
        .body-column {
          position: relative;
          padding: 2px 3px;
          font-size: 0.8em;
          border-bottom: thin solid grey;
          border-left: thin solid grey;
          box-sizing: border-box;
          overflow: hidden;
          &__title {
            border-bottom: thin solid grey;
            border-left: thin solid grey;
            text-align: center;
            font-size: 0.75em;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.1);
            color: rgba(0, 0, 0, 0.5);
          }
          &__selected::after {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            border: 2px solid #1a73e8;
            box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
          }
        }
      }
    }

  }

}
</style>
