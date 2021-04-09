<template>
  <div class="spread-sheet" ref="SpreadSheet">
    <table class="table" @click="selectedCell">
      <thead>
        <tr class="head-row">
          <th v-show="isGroup"
              class="head-column head-column__group"
              ></th>
          <th class="head-column head-column__title"
              :class="{'head-column__title_group': isGroup}"
              :style="shiftCellTitle"></th>
          <th v-for="j in countColumn"
              :key="`head-column-${j}`"
              class="head-column"
              :style="getColumnWidth(j)">{{ getColumnTitle(j).toUpperCase() }}</th>
        </tr>
      </thead>
      <!-- Variant 3 -->
      <tbody>
        <template v-for="i in countRow">
          <tr v-if="(!excludedRows.has(`${i}`))"
              :key="`body-row-${i}`"
              class="body-row"
              :style="getRowHeight(i)">
            <td v-show="isGroup" class="body-column body-column__group">
              <group-element :level="getLevelRow(i)"
                             :is-group="(isGroupElement(i)) ? true : false"
                             :row-number="i"
                             :row-group-count="isGroupElement(i)"></group-element>
              <!-- <row-btn-icon v-show="isGroupElement(i)"
                            :data-row-group-number="i"
                            :data-row-group="isGroupElement(i)">mdi-plus-box-outline</row-btn-icon> -->
            </td>
            <td class="body-column body-column__title"
                :class="{'body-column__title_group': isGroup}"
                :style="shiftCellTitle">{{ i }}</td>
            <template v-for="j in countColumn">
              <td v-if="(!excludedCells.has(`${columnsTitle[j]}${i}`))"
                  :key="`body-column-${i}-${j}`"
                  class="body-column"
                  :colspan="getColspan(`${columnsTitle[j]}${i}`)"
                  :rowspan="getRowspan(`${columnsTitle[j]}${i}`)"
                  :class="getCellStyle(`${columnsTitle[j]}${i}`)">
                {{ getCellValue(i, j) }}
              </td>
            </template>
          </tr>

          <tr v-if="(excludedRows.has(`${i}`))"
              :key="`body-row-${i}`"
              class="body-row body-row-group body-row-group_hidden"
              :data-group-row="getRowParent(i)"
              :style="getRowHeight(i)">
            <td v-show="isGroup" class="body-column body-column__group">
              <group-element :level="getLevelRow(i)"
                             :is-group="(isGroupElement(i)) ? true : false"
                             :row-number="i"
                             :row-group-count="isGroupElement(i)"></group-element>
              <!-- <row-btn-icon v-show="isGroupElement(i)"
                            :data-row-group-number="i"
                            :data-row-group="isGroupElement(i)">mdi-plus-box-outline</row-btn-icon> -->
            </td>
            <td class="body-column body-column__title"
                :class="{'body-column__title_group': isGroup}"
                :style="shiftCellTitle">{{ i }}</td>
            <template v-for="j in countColumn">
              <td v-if="(!excludedCells.has(`${columnsTitle[j]}${i}`))"
                  :key="`body-column-${i}-${j}`"
                  class="body-column"
                  :colspan="getColspan(`${columnsTitle[j]}${i}`)"
                  :rowspan="getRowspan(`${columnsTitle[j]}${i}`)"
                  :class="getCellStyle(`${columnsTitle[j]}${i}`)">
                {{ getCellValue(i, j) }}
              </td>
            </template>
          </tr>
        </template>
      </tbody>

      <!-- Variant 2 -->
      <!-- <tbody>
        <template v-for="i in countRow">
          <tr v-if="(!excludedRows.has(`${i}`))"
              :key="`body-row-${i}`"
              class="body-row"
              :style="getRowHeight(i)">
            <td v-show="isGroup" class="body-column body-column__group">
              <row-btn-icon v-show="isGroupElement(i)" :data-row-group-number="i">mdi-plus-box-outline</row-btn-icon>
            </td>
            <td class="body-column body-column__title"
                :class="{'body-column__title_group': isGroup}">{{ i }}</td>
            <template v-for="j in countColumn">
              <td v-if="(!excludedCells.has(`${columnsTitle[j]}${i}`))"
                  :key="`body-column-${i}-${j}`"
                  class="body-column"
                  :colspan="getColspan(`${columnsTitle[j]}${i}`)"
                  :rowspan="getRowspan(`${columnsTitle[j]}${i}`)"
                  :class="getCellStyle(`${columnsTitle[j]}${i}`)">
                {{ getCellValue(i, j) }}
              </td>
            </template>
          </tr>

          <template v-if="isGroupElement(i)">
            <tr v-for="k in isGroupElement(i) - 1"
                :key="`body-row-group-${i + k}`"
                class="body-row body-row-group body-row-group_hidden"
                :data-group-row="i">
              <td v-show="isGroup" class="body-column body-column__group">
                <v-divider vertical></v-divider>
                <row-btn-icon v-show="isGroupElement(i + k)">mdi-plus-box-outline</row-btn-icon>
              </td>
              <td class="body-column body-column__title"
                  :class="{'body-column__title_group': isGroup}">{{ i + k }}</td>
              <template v-for="l in countColumn">
                <td v-if="(!excludedCells.has(`${columnsTitle[l]}${i + k}`))"
                    :key="`body-column-${i + k}-${l}`"
                    class="body-column"
                    :colspan="getColspan(`${columnsTitle[l]}${i + k}`)"
                    :rowspan="getRowspan(`${columnsTitle[l]}${i + k}`)"
                    :class="getCellStyle(`${columnsTitle[l]}${i + k}`)">
                  {{ getCellValue(i + k, l) }}
                </td>
              </template>
            </tr>
          </template>
        </template>
      </tbody> -->
      <!-- no group -->
      <!-- <tbody>
        <tr v-for="i in countRow"
            :key="`body-row-${i}`"
            class="body-row"
            :style="getRowHeight(i)">
          <td v-show="isGroup" class="body-column body-column__group">
            <row-btn-icon v-show="isGroupElement(i)">mdi-plus-box-outline</row-btn-icon>
          </td>
          <td class="body-column body-column__title"
              :class="{'body-column__title_group': isGroup}">{{ i }}</td>
          <template v-for="j in countColumn">
            <td v-if="(!excludedCells.has(`${columnsTitle[j]}${i}`))"
                :key="`body-column-${i}-${j}`"
                class="body-column"
                :colspan="getColspan(`${columnsTitle[j]}${i}`)"
                :rowspan="getRowspan(`${columnsTitle[j]}${i}`)"
                :class="getCellStyle(`${columnsTitle[j]}${i}`)">
              {{ getCellValue(i, j) }}
            </td>
          </template>
        </tr>
      </tbody> -->
    </table>
  </div>
</template>

<script>
import SpreadSheetProps from './SpreadSheetProps';
import SpreadSheetComputed from './SpreadSheetComputed';

import GroupElement from './components/GroupElement.vue';
// import RowBtnIcon from './components/RowBtnIcon.vue';

export default {
  name: 'SpreadSheet',
  mixins: [
    SpreadSheetProps,
    SpreadSheetComputed,
  ],
  components: {
    GroupElement,
    // RowBtnIcon,
    // SpreadSheetBodyRow,
  },
  data() {
    return {
      isGroup: false,
      openGroup: new Map(),
      currentSelectedCell: null,
      setChar: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      columnsTitle: {}, // {1: a, 2: b, ..., 24: aa}
      excludedCells: new Set(),
      excludedRows: new Set(),
    };
  },
  computed: {
    shiftCellTitle() {
      return { left: '25px' };
    },
  },
  methods: {
    getLevelRow(rowNumber) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].parent) return 1;
      // console.log('go level');
      let level = 1;
      let condition = true;
      let currentParent = this.rows[rowNumber].parent;
      while (condition) {
        if (this.rows[currentParent].parent) {
          level += 1;
          currentParent = this.rows[currentParent].parent;
        } else condition = false;
      }
      // console.log(level);
      return level;
    },
    getRowParent(rowNumber) {
      return this.rows[rowNumber].parent;
    },
    isGroupElement(rowNumber) { // insert element "+"
      if (this.rows[rowNumber] && this.rows[rowNumber].rowGroup) return +this.rows[rowNumber].rowGroup;
      return false;
    },
    getRowspan(cellName) {
      if (!this.cells[cellName] || !this.cells[cellName].rowspan) return 1;
      return this.cells[cellName].rowspan;
    },
    getColspan(cellName) {
      if (!this.cells[cellName] || !this.cells[cellName].colspan) return 1;
      return this.cells[cellName].colspan;
    },
    getCellStyle(cellName) {
      if (!this.cells[cellName] || !this.cells[cellName].style) return {};
      return this.cells[cellName].style;
    },
    getCellValue(row, column) {
      const cellName = `${this.columnsTitle[column]}${row}`;
      if (!this.cells[cellName]) return '';
      if (Object.keys(this.cells[cellName]).includes('colspan')) {
        for (let i = 1; i < this.cells[cellName].colspan; i += 1) {
          this.excludedCells.add(`${this.columnsTitle[column + i]}${row}`);
        }
      }
      if (Object.keys(this.cells[cellName]).includes('rowspan')) {
        for (let i = 1; i < this.cells[cellName].rowspan; i += 1) {
          this.excludedCells.add(`${this.columnsTitle[column]}${row + i}`);
          if (Object.keys(this.cells[cellName]).includes('colspan')) {
            for (let j = 1; j < this.cells[cellName].colspan; j += 1) {
              this.excludedCells.add(`${this.columnsTitle[column + j]}${row + i}`);
            }
          }
        }
      }
      return this.cells[cellName].value;
    },
    getRowHeight(rowNumber) {
      const rowProps = {};
      if (this.rows[rowNumber]) {
        if (this.rows[rowNumber].rowGroup) {
          this.isGroup = true;
          for (let i = 1; i < this.rows[rowNumber].rowGroup; i += 1) {
            this.excludedRows.add(`${rowNumber + i}`);
          }
          // console.log(this.excludedRows);
          rowProps.rowGroup = +this.rows[rowNumber].rowGroup;
        }
        return { height: `${this.rows[rowNumber].height}px`, ...rowProps } || {};
      }
      return {};
    },
    getColumnWidth(columnNumber) {
      const name = this.getColumnTitle(columnNumber);
      if (this.columns[name]) {
        return {
          'max-width': `${this.columns[name].width}px`,
          'min-width': `${this.columns[name].width}px`,
        };
      }
      return {};
    },
    getColumnTitle(columnNumber) {
      if (columnNumber > 702) return 'Infinity';
      if (columnNumber <= this.setChar.length) {
        const title = this.setChar[columnNumber - 1];
        this.columnsTitle[columnNumber] = title;
        return title;
      }
      if ((columnNumber % this.setChar.length) === 0) {
        const title = `${this.setChar[((columnNumber - this.setChar.length) / this.setChar.length) - 1]}${this.setChar[this.setChar.length - 1]}`;
        this.columnsTitle[columnNumber] = title;
        return title;
      }
      const title = `${this.setChar[(Math.floor(columnNumber / this.setChar.length)) - 1]}${this.setChar[(columnNumber % this.setChar.length) - 1]}`;
      this.columnsTitle[columnNumber] = title;
      return title;
    },
    selectedCell(event) {
      if (event.target.closest('button')) {
        this.toggleGroup(event.target.closest('button'));
        return;
      }
      if (this.currentSelectedCell === event.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('body-column__selected');
      event.target.classList.add('body-column__selected');
      this.currentSelectedCell = event.target;
    },
    toggleGroup(btnGroupElement) {
      const btnGroupImg = btnGroupElement.querySelector('i');
      const rowNumber = btnGroupElement.getAttribute('data-row-group-number');
      if (btnGroupImg.classList.contains('mdi-plus-box-outline')) {
        btnGroupImg.classList.remove('mdi-plus-box-outline');
        btnGroupImg.classList.add('mdi-minus-box-outline');

        const elementsGroup = document.querySelectorAll(`[data-group-row="${rowNumber}"]`);
        elementsGroup.forEach((element) => {
          element.classList.remove('body-row-group_hidden');
        });
        this.openGroup.set(rowNumber, this.getLevelRow(rowNumber));
      } else {
        btnGroupImg.classList.remove('mdi-minus-box-outline');
        btnGroupImg.classList.add('mdi-plus-box-outline');

        let currentRow = btnGroupElement.closest('.body-row');
        for (let i = 0; i < btnGroupElement.getAttribute('data-row-group') - 1; i += 1) {
          currentRow = currentRow.nextElementSibling;
          if (currentRow.querySelector('button')) {
            currentRow.querySelector('button i').classList.remove('mdi-minus-box-outline');
            currentRow.querySelector('button i').classList.add('mdi-plus-box-outline');
          }
          currentRow.classList.add('body-row-group_hidden');
          this.openGroup.delete(rowNumber);
        }
      }
      console.log(this.openGroup);
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
          box-shadow: inset 0 1px 0 grey, inset 0 -1px 0 grey, 1px 0 0 grey;
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
            // &_group {
            //   left: 25px;
            // }
          }
          &__group {
            position: sticky;
            left: 0px;
            min-width: 25px;
            max-width: 25px;
            width: 25px;
            box-shadow: -1px 0px 0 grey, 1px 0px 0 grey, inset 0 1px 0 grey, inset 0 -1px 0 grey;
            z-index: 210;
          }
        }
      }
    }

    tbody {
      position: relative;
      .body-row {
        height: 24px;
        box-sizing: border-box;
        &-group {
          &_hidden {
            display: none;
            // visibility: hidden;
          }
        }
        .body-column {
          position: relative;
          padding: 2px 3px;
          font-size: 0.8em;
          border-bottom: thin solid grey;
          border-left: thin solid grey;
          box-sizing: border-box;
          overflow: hidden;
          &:last-child {
            border-right: thin solid grey;
          }
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
            // &_group {
            //   left: 25px;
            // }
          }
          &__group {
            position: sticky;
            left: 0px;
            border-bottom: 0px;
            background-color: #dadce0;
            box-shadow: -1px 0px 0 grey, 0px 0px 0 grey;
            z-index: 160;

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
