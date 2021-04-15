export default {
  computed: {
    rowLevelGroupMax() {
      if (this.rowLevelGroup) return this.rowLevelGroup;
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

  methods: {
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
    getRowHeight(rowNumber) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].height) return {};
      return {
        height: `${this.rows[rowNumber].height}px`,
      };
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
    getColumnWidth(columnNumber) {
      const name = this.getColumnTitle(columnNumber);
      if (!this.columns[name] || !this.columns[name].width) return {};
      return {
        'max-width': `${this.columns[name].width}px`,
        'min-width': `${this.columns[name].width}px`,
      };
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
