export default {
  data() {
    return {
      setChar: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      excludedColumns: new Set(),
    };
  },
  computed: {
  },
  methods: {
    isColumnGroup(columnNumber, level = false) {
      const name = this.getColumnTitle(columnNumber);
      if (!this.columns[name] || !this.columns[name].columnGroup) return false;
      for (let i = 1; i < this.columns[name].columnGroup; i += 1) {
        this.excludedColumns.add(`${columnNumber + i}`);
      }
      return (level === this.getLevelColumn(name));
    },
    getColumnParent(columnNumber) {
      const name = this.getColumnTitle(columnNumber);
      return this.columns[name].parent;
    },
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
    getLevelColumn(columnName) {
      let level = 1;
      let currentColumn = columnName;
      let condition = true;
      while (condition) {
        if (!this.columns[currentColumn]?.parent) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns[currentColumn].parent;
      }
      return level;
    },
  },
};
