export default {
  computed: {
  },
  methods: {
    isGroupColumn(columnNumber) {
      if (this.columns[columnNumber] && this.columns[columnNumber].columnGroup) {
        return +this.columns[columnNumber].columnGroup;
      }
      return false;
    },
  },
};
