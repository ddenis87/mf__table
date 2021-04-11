export default {
  data() {
    return {
      openRowGroup: new Map(),
      rowGroupLevel: 1,
    };
  },
  computed: {
    shiftTitleRow() {
      return { left: `${25 * this.rowGroupLevel}px` };
    },
    isRowsGroup() {
      return !!Object.values(this.rows).find((item) => Object.keys(item).includes('rowGroup')) || false;
    },
  },
  methods: {
    toggleRowGroup(evt) {
      const rowGroupParent = evt.getAttribute('data-row-group-parent');
      const rowGroupStatus = evt.getAttribute('data-row-group-status');
      const rowsGroup = document.querySelectorAll(`[data-row-parent="${rowGroupParent}"]`);
      const btnGroupImg = evt.querySelector('i');
      if (rowGroupStatus === 'close') {
        rowsGroup.forEach((element) => {
          element.classList.remove('hidden');
        });
        evt.setAttribute('data-row-group-status', 'open');
        this.openRowGroup.set(rowGroupParent, this.getLevelRowGroup(rowGroupParent));
      } else {
        rowsGroup.forEach((element) => {
          element.classList.add('hidden');
        });
        evt.setAttribute('data-row-group-status', 'close');
        this.openRowGroup.delete(rowGroupParent);
      }
      btnGroupImg.classList.toggle('mdi-plus-box-outline');
      btnGroupImg.classList.toggle('mdi-minus-box-outline');
      
      let shift = 0;
      this.openRowGroup.forEach((value) => {
        if (value > shift) shift = value;
      });
      this.rowGroupLevel = shift + 1;
    },
    getLevelRowGroup(rowNumber) {
      let level = 1;
      let currentRow = rowNumber;
      let condition = true;

      while (condition) {
        if (!this.rows[currentRow].parent) { condition = false; return level; }
        level += 1;
        currentRow = this.rows[currentRow].parent;
      }
      return level;
    },
  },
};
