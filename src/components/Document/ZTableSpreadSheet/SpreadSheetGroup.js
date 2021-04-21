export default {
  data() {
    return {
      setCharacter: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    };
  },
  computed: {
    rowExcluded() {
      const rowExcluded = new Set();
      Object.entries(this.rows).forEach((row) => {
        if (Object.keys(row[1]).includes('rowGroup')) {
          for (let i = 1; i < row[1].rowGroup; i += 1) {
            rowExcluded.add(+row[0] + i);
          }
        }
      });
      console.log(rowExcluded);
      return rowExcluded;
    },
    columnExcluded() {
      const columnExcluded = new Set();
      Object.entries(this.columns).forEach((column) => {
        if (Object.keys(column[1]).includes('columnGroup')) {
          for (let i = 1; i < column[1].columnGroup; i += 1) {
            columnExcluded.add(this.getColumnNumber(column[0]) + i);
          }
        }
      });
      console.log(columnExcluded);
      return columnExcluded;
    },
  },
  methods: {
    getColumnNumber(columnTitle) {
      if (columnTitle.length === 1) return this.setCharacter.findIndex((item) => item === columnTitle) + 1;
      const indexFirst = this.setCharacter.findIndex((item) => item === columnTitle[0]) + 1;
      const indexSecond = this.setCharacter.findIndex((item) => item === columnTitle[1]) + 1;
      return (indexFirst * this.setCharacter.length) + indexSecond;
    },
  },
};
