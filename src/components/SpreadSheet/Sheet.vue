<template>
  <table class="sheet">
    <tr>
      <td class="sheet__angle"
          :style="{ 'min-width': `${60 + (20 * rowLevelGroupMax)}px` }"></td>
      <td class="sheet__head">
        <sheet-head :columns="columnsBody"
                    :columnLevelGroupMax="columnLevelGroupMax"></sheet-head>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <sheet-body :rows="rowsBody"
                    :columns="columnsBody"
                    :cells="cells"
                    :rowLevelGroupMax="rowLevelGroupMax"
                    @toggle-row-group="toggleRowGroup"></sheet-body>
      </td>
    </tr>
  </table>
</template>

<script>
import SheetHead from './Sheet/SheetHead.vue';
import SheetBody from './Sheet/SheetBody.vue';

export default {
  name: 'Sheet',
  components: {
    SheetHead,
    SheetBody,
  },
  props: {
    columnCount: { type: Number, default: 25 },
    rowCount: { type: Number, default: 100 },

    columns: { type: Object },
    rows: { type: Object },
    cells: { type: Object },
  },
  data() {
    return {
      setCharacter: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      rowsBody: [],
      columnsBody: [],

      rowsEntries: [],
      rowsParents: {},
    };
  },
  computed: {
    rowLevelGroupMax() {
      const levelGroupMax = [];
      Object.entries(this.rows).filter((item) => Object.keys(item[1]).includes('parent')).forEach((row) => {
        levelGroupMax.push(this.getRowLevel(row[0]));
      });
      console.log('max row group - ', Math.max(...levelGroupMax));
      return Math.max(...levelGroupMax);
    },
    columnLevelGroupMax() {
      const levelGroupMax = [];
      Object.entries(this.columns).filter((item) => Object.keys(item[1]).includes('parent')).forEach((column) => {
        levelGroupMax.push(this.getColumnLevel(column[0]));
      });
      console.log('max column group - ', Math.max(...levelGroupMax));
      return Math.max(...levelGroupMax);
    },
  },
  created() {
    // rows array
    for (let i = 1; i < this.rowCount + 1; i += 1) {
      let rowsBodyItem = {};
      if (this.rows[i]) {
        if (!this.rows[i].parent) {
          rowsBodyItem = { value: i, ...this.rows[i] };
          this.rowsBody.push(rowsBodyItem);
        }
      } else {
        rowsBodyItem.value = i;
        this.rowsBody.push(rowsBodyItem);
      }
      if (this.rows[i] && this.rows[i]?.rowGroup) this.rowsParents[i] = [];
    }
    Object.entries(this.rows).filter((item) => Object.keys(item[1]).includes('parent')).forEach((row) => {
      this.rowsParents[row[1].parent].push({ value: row[0], ...row[1] });
    });

    // columns array
    for (let i = 1; i < this.columnCount + 1; i += 1) {
      const name = this.getColumnTitle(i);
      let columnsBodyItem = {};
      if (this.columns[name]) {
        if (!this.columns[name].parent) {
          columnsBodyItem = { value: i, ...this.columns[name] };
          this.columnsBody.push(columnsBodyItem);
        }
      } else {
        columnsBodyItem.value = i;
        this.columnsBody.push(columnsBodyItem);
      }
    }
  },
  methods: {
    toggleRowGroup(rowParent) {
      console.log(rowParent);
      if (rowParent.status === 'close') {
        this.openRowGroup(rowParent);
        rowParent.target.setAttribute('data-row-status', 'open');
      } else {
        this.closeRowGroup(rowParent);
        rowParent.target.setAttribute('data-row-status', 'close');
      }
    },
    openRowGroup(rowParent) {
      this.rowsBody.splice(rowParent.index + 1, 0, ...this.rowsParents[rowParent.value]);
    },
    closeRowGroup(rowParent) {
      const rowsCut = [];
      for (let i = 1; i < rowParent.count + 1; i += 1) {
        const indexCut = this.rowsBody.findIndex((item) => +item.value === rowParent.value + i);
        if (indexCut > -1) rowsCut.push(indexCut);
      }
      this.rowsBody = this.rowsBody.filter((item, index) => !rowsCut.includes(index));
    },
    getRowLevel(rowNumber) {
      let level = 0;
      let currentRow = rowNumber;
      let condition = true;
      while (condition) {
        if (!this.rows[currentRow]?.parent) { condition = false; return level; }
        level += 1;
        currentRow = this.rows[currentRow].parent;
      }
      return level;
    },
    getColumnLevel(columnName) {
      let level = 0;
      let currentColumn = columnName;
      let condition = true;
      while (condition) {
        if (!this.columns[currentColumn].parent) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns[currentColumn].parent;
      }
      return level;
    },
    getColumnTitle(columnNumber) {
      if (columnNumber > 702) return 'Infinity';
      if (columnNumber <= this.setCharacter.length) {
        const columnTitle = this.setCharacter[columnNumber - 1];
        return columnTitle;
      }
      if ((columnNumber % this.setCharacter.length) === 0) {
        const columnTitle = `${this.setCharacter[
          ((columnNumber - this.setCharacter.length) / this.setCharacter.length) - 1
        ]}${this.setCharacter[this.setCharacter.length - 1]}`;
        return columnTitle;
      }
      const columnTitle = `${this.setCharacter[
        (Math.floor(columnNumber / this.setCharacter.length)) - 1
      ]}${this.setCharacter[(columnNumber % this.setCharacter.length) - 1]}`;
      return columnTitle;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Sheet.scss';

.sheet {
  position: relative;
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  &__angle {
    position: sticky;
    top: 0px;
    left: 0px;
    min-width: 60px;
    box-shadow: inset -1px -1px 0px grey, inset 1px 1px 0px grey;
    background-color: #dadce0;
    z-index: 900;
  }
  &__head {
    position: sticky;
    top: 0px;
    height: 22px;
    background-color: #dadce0;
    width: auto;
    z-index: 800;
  }
}
</style>
