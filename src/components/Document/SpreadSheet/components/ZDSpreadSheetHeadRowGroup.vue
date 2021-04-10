<template>
  <thead>
    <tr class="head-row">
      <th v-show="isRowsGroup"
          class="head-column head-column__group"
          ></th>
      <th class="head-column head-column__title"
          :class="{'head-column__title_group': isRowsGroup}"></th>
      <th v-for="j in countColumn"
          :key="`head-column-${j}`"
          class="head-column"
          :style="getColumnWidth(j)">
        <group-element :level="getLevelRow(i)"
                       :is-group="(isGroupElement(i)) ? true : false"
                       :row-number="i"
                       :row-group-count="isGroupElement(i)"></group-element>
      </th>
    </tr>
  </thead>
</template>

<script>

export default {
  name: 'SpreadSheetHeadRowGroup',
  props: {
    countColumn: { type: Number, default: 1 },
    columns: { type: Object },
    isRowsGroup: { type: Boolean, default: false },
  },
  data() {
    return {
      setChar: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    };
  },
  methods: {
    getColumnTitle(columnNumber) {
      if (columnNumber > 702) return 'Infinity';
      if (columnNumber <= this.setChar.length) {
        const title = this.setChar[columnNumber - 1];
        // this.columnsTitle[columnNumber] = title;
        return title;
      }
      if ((columnNumber % this.setChar.length) === 0) {
        const title = `${this.setChar[((columnNumber - this.setChar.length) / this.setChar.length) - 1]}${this.setChar[this.setChar.length - 1]}`;
        // this.columnsTitle[columnNumber] = title;
        return title;
      }
      const title = `${this.setChar[(Math.floor(columnNumber / this.setChar.length)) - 1]}${this.setChar[(columnNumber % this.setChar.length) - 1]}`;
      // this.columnsTitle[columnNumber] = title;
      return title;
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
  },
};
</script>

<style lang="scss" scoped>
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
      // border-left: thin solid grey;
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
</style>
