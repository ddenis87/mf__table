<template>
  <table class="spread-sheet-head">
    <tr class="spread-sheet-head__row">
      <td v-for="item in headCount"
          :key="item"
          class="spread-sheet-head__column">{{ getColumnTitle(item).toUpperCase() }}</td>

    </tr>
  </table>
</template>

<script>
export default {
  name: 'SpreadSheetHead',
  props: {
    headCount: { type: Number, default: 25 },
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
        const columnTitle = this.setChar[columnNumber - 1];
        return columnTitle;
      }
      if ((columnNumber % this.setChar.length) === 0) {
        const columnTitle = `${this.setChar[((columnNumber - this.setChar.length) / this.setChar.length) - 1]}${this.setChar[this.setChar.length - 1]}`;
        return columnTitle;
      }
      const columnTitle = `${this.setChar[(Math.floor(columnNumber / this.setChar.length)) - 1]}${this.setChar[(columnNumber % this.setChar.length) - 1]}`;
      return columnTitle;
    },
  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-head {
  position: relative;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  &__row {
    .spread-sheet-head__column {
      min-width: 94px;
      height: 24px;
      border: thin solid grey;
      background-color: #dadce0;
      &:first-child {
        border-left: 0px;
      }
    }
  }
  
}
</style>
