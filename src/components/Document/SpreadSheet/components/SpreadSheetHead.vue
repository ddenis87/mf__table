<template>
  <thead class="spread-sheet-head">
    <tr class="head-row">
      <th class="head-column head-column__title"></th>
      <th v-for="j in countColumn"
          :key="`head-column-${j}`"
          class="head-column"
          :style="columnWidth(getcolumnsTitle(j))">{{ getcolumnsTitle(j).toUpperCase() }}</th>
    </tr>
  </thead>
</template>

<script>

export default {
  name: 'SpreadSheetHead',
  props: {
    countColumn: { type: Number, default: 26 },
    columns: {
      type: Object,
      validator: (value) => { Object.keys(value).includes('width'); },
    },
  },
  methods: {
    getColumnTitle(number) {
      if (number > 702) return 'Infinity';
      if (number <= this.setChar.length) {
        const title = this.setChar[number - 1];
        // this.columnsTitle[number] = title;
        return title;
      }
      if ((number % this.setChar.length) === 0) {
        const title = `${this.setChar[((number - this.setChar.length) / this.setChar.length) - 1]}${this.setChar[this.setChar.length - 1]}`;
        // this.columnsTitle[number] = title;
        return title;
      }
      const title = `${this.setChar[(Math.floor(number / this.setChar.length)) - 1]}${this.setChar[(number % this.setChar.length) - 1]}`;
      // this.columnsTitle[number] = title;
      return title;
    },
  },
};
</script>
