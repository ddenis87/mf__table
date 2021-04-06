<template>
  <div class="spread-sheet">
    <table class="table" @click="selectedCell" @mouseup="selectedCellEnd">
      <thead>
        <tr class="head-row">
          <th class="head-column head-column__title"></th>
          <th v-for="j in countColumn"
              :key="`head-column-${j}`"
              class="head-column"
              :style="columnWidth(getcolumnsTitle(j))">{{ getcolumnsTitle(j).toUpperCase() }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in countRow"
            :key="`body-row-${i}`"
            class="body-row"
            :style="rowHeight(i)">
          <td class="body-column body-column__title">{{ i }}</td>
          <template v-for="j in countColumn">
            <td v-if="!executeCells.includes(`${columnsTitle[j]}${i}`)"
                :key="`body-column-${i}${j}`"
                :colspan="cellProperties(`${columnsTitle[j]}${i}`).colspan"
                :rowspan="cellProperties(`${columnsTitle[j]}${i}`).rowspan"
                class="body-column"
                :class="(cellsMap[`${columnsTitle[j]}${i}`]) ?
                  cellsMap[`${columnsTitle[j]}${i}`].style : ''">
              {{ (cellsMap[`${columnsTitle[j]}${i}`]) ? cellsMap[`${columnsTitle[j]}${i}`].value : '' }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SpreadSheetProps from './SpreadSheetProps';
import SpreadSheetComputed from './SpreadSheetComputed';

export default {
  name: 'SpreadSheet',
  mixins: [
    SpreadSheetProps,
    SpreadSheetComputed,
  ],
  data() {
    return {
      currentSelectedCell: null,
      setChar: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      columnsTitle: {}, // {1: a, 2: b, ..., 24: aa}
      executeCells: [],
    };
  },
  computed: {
    cellsMap() {
      const cellMap = {};
      this.cells.forEach((element) => { cellMap[element.name] = element; });
      return cellMap;
    },
  },
  methods: {
    cellProperties(cellName) {
      const cellProperties = this.cells.find((item) => item.name.toLowerCase() === cellName);
      if (!cellProperties) return '';
      if (Object.keys(cellProperties).includes('spanColRow')) {
        if (typeof (cellProperties.spanColRow) === 'number') {
          cellProperties.colspan = cellProperties.spanColRow;
          cellProperties.rowspan = cellProperties.spanColRow;
        } else {
          cellProperties.colspan = cellProperties.spanColRow[0] || 1;
          cellProperties.rowspan = cellProperties.spanColRow[1] || 1;
        }
      }
      return cellProperties;
    },

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

    getcolumnsTitle(number) {
      if (number > 702) return 'Infinity';
      if (number <= this.setChar.length) {
        const title = this.setChar[number - 1];
        this.columnsTitle[number] = title;
        return title;
      }
      if ((number % this.setChar.length) === 0) {
        const title = `${this.setChar[((number - this.setChar.length) / this.setChar.length) - 1]}${this.setChar[this.setChar.length - 1]}`;
        this.columnsTitle[number] = title;
        return title;
      }
      const title = `${this.setChar[(Math.floor(number / this.setChar.length)) - 1]}${this.setChar[(number % this.setChar.length) - 1]}`;
      this.columnsTitle[number] = title;
      return title;
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
    thead {
      .head-row {
        height: 24px;
        font-size: 0.75em;
        color: rgba(0, 0, 0, 0.5);
        .head-column {
          position: sticky;
          top: 0px;
          padding: 2px;
          min-width: 94px;
          border-left: thin solid grey;
          box-shadow: inset 0 1px 0 grey, inset 0 -1px 0 grey;
          background-color: #dadce0;
          z-index: 100;
          &__title {
            position: sticky;
            top: 0px;
            left: 0px;
            box-shadow: -1px 0px 0 grey, 1px 0px 0 grey, inset 0 1px 0 grey, inset 0 -1px 0 grey;
            min-width: 60px;
            max-width: 60px;
            width: 60px;
            z-index: 200;
          }
        }
      }
    }

    tbody {
      position: relative;
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
            position: sticky;
            left: 0px;
            border-left: 0px;
            box-shadow: inset 1px 0px 0 grey, 1px 0px 0 grey;
            text-align: center;
            font-size: 0.75em;
            font-weight: bold;
            background-color: #dadce0;
            color: rgba(0, 0, 0, 0.5);
            z-index: 150;
          }
          &__selected::after {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            border: 2px solid #1a73e8;
          }
        }
      }
    }
  }
}
</style>
