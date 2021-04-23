<template>
  <div class="sheet"
       :style="{
         'grid-template-columns': `${(20 * rowLevelGroupMax) + 60}px 1fr`,
         'grid-template-rows': `${(22 * columnLevelGroupMax) + 22}px 1fr`,
       }">
    <div class="sheet__angle"></div>
    <div class="sheet__head">
      <sheet-head :columns="columnsBody"
                  :columnLevelGroupMax="columnLevelGroupMax"
                  ref="SheetHead"></sheet-head>
    </div>
    <div class="sheet__body">
      <sheet-body :rowsCount="rowCount"
                  :rows="rowsBody"
                  :columns="columnsBody"
                  :cells="cells"
                  :rowLevelGroupMax="rowLevelGroupMax"
                  @toggle-row-group="toggleRowGroup"
                  @scroll-body-x="scrollBodyX"></sheet-body>
    </div>
  </div>
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
      columnsNameBody: [],
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
          if (this.rows[i].rowGroup) {
            rowsBodyItem.openGroup = 'close';
          }
          rowsBodyItem.height = (this.rows[i].height) ? this.rows[i].height : 22;
          this.rowsBody.push(rowsBodyItem);
        }
      } else {
        rowsBodyItem.value = i;
        rowsBodyItem.height = 22;
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
          columnsBodyItem = {
            value: i,
            name,
            display_name: name.toUpperCase(),
            ...this.columns[name],
          };
          this.columnsBody.push(columnsBodyItem);
        }
      } else {
        columnsBodyItem = {
          value: i,
          name,
          display_name: name.toUpperCase(),
        };
        this.columnsBody.push(columnsBodyItem);
      }
    }
    // console.log(this.rowsBody);
  },
  methods: {
    scrollBodyX(scrollLeft) {
      this.$refs.SheetHead.$el.scrollLeft = scrollLeft;
    },
    toggleRowGroup(rowParent) {
      console.log(rowParent);
      if (rowParent.status === 'close') {
        this.openRowGroup(rowParent);
        rowParent.target.setAttribute('data-row-status', 'open');
        // this.rowsBody.find((item) => item.value === rowParent.value).openGroup = 'open';
      } else {
        this.closeRowGroup(rowParent);
        rowParent.target.setAttribute('data-row-status', 'close');
        // this.rowsBody.find((item) => item.value === rowParent.value).openGroup = 'close';
      }
    },
    openRowGroup(rowParent) {
      console.time('FirstWay');
      this.rowsBody.splice(rowParent.index + 1, 0, ...this.rowsParents[rowParent.value]);
      console.timeEnd('FirstWay');
      const btnIcon = rowParent.target.querySelector('i');
      btnIcon.classList.remove('mdi-plus-box-outline');
      btnIcon.classList.add('mdi-minus-box-outline');
    },
    closeRowGroup(rowParent) {
      const rowsCut = [];
      for (let i = 1; i < rowParent.count + 1; i += 1) {
        const indexCut = this.rowsBody.findIndex((item) => +item.value === rowParent.value + i);
        if (indexCut > -1) rowsCut.push(indexCut);
      }
      this.rowsBody = this.rowsBody.filter((item, index) => !rowsCut.includes(index));
      const btnIcon = rowParent.target.querySelector('i');
      btnIcon.classList.add('mdi-plus-box-outline');
      btnIcon.classList.remove('mdi-minus-box-outline');
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
  display: grid;
  grid-template-areas: "angle head" "body body";
  height: 100%;
  box-sizing: border-box;
  &__angle {
    grid-area: angle;
    border: thin solid grey;
    background-color: #dadce0;
    box-sizing: border-box;
  }
  &__head {
    grid-area: head;
    overflow: hidden;
    box-sizing: border-box;
    // margin-right: 18px;
  }
  &__body {
    grid-area: body;
  }
}
</style>
