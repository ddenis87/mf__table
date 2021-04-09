export default {
  computed: {
    shiftCellTitle() {
      return { left: '25px' };
    },
  },
  methods: {
    getLevelRow(rowNumber) {
      if (!this.rows[rowNumber] || !this.rows[rowNumber].parent) return 1;
      // console.log('go level');
      let level = 1;
      let condition = true;
      let currentParent = this.rows[rowNumber].parent;
      while (condition) {
        if (this.rows[currentParent].parent) {
          level += 1;
          currentParent = this.rows[currentParent].parent;
        } else condition = false;
      }
      // console.log(level);
      return level;
    },
    isGroupElement(rowNumber) { // insert element "+"
      if (this.rows[rowNumber] && this.rows[rowNumber].rowGroup) return +this.rows[rowNumber].rowGroup;
      return false;
    },
    getRowspan(cellName) {
      if (!this.cells[cellName] || !this.cells[cellName].rowspan) return 1;
      return this.cells[cellName].rowspan;
    },
    getColspan(cellName) {
      if (!this.cells[cellName] || !this.cells[cellName].colspan) return 1;
      return this.cells[cellName].colspan;
    },
    getRowParent(rowNumber) {
      return this.rows[rowNumber].parent;
    },
    getRowHeight(rowNumber) {
      const rowProps = {};
      if (this.rows[rowNumber]) {
        if (this.rows[rowNumber].rowGroup) {
          this.isGroup = true;
          for (let i = 1; i < this.rows[rowNumber].rowGroup; i += 1) {
            this.excludedRows.add(`${rowNumber + i}`);
          }
          // console.log(this.excludedRows);
          rowProps.rowGroup = +this.rows[rowNumber].rowGroup;
        }
        return { height: `${this.rows[rowNumber].height}px`, ...rowProps } || {};
      }
      return {};
    },
    toggleGroup(btnGroupElement) {
      const btnGroupImg = btnGroupElement.querySelector('i');
      const rowNumber = btnGroupElement.getAttribute('data-row-group-number');
      if (btnGroupImg.classList.contains('mdi-plus-box-outline')) {
        btnGroupImg.classList.remove('mdi-plus-box-outline');
        btnGroupImg.classList.add('mdi-minus-box-outline');

        const elementsGroup = document.querySelectorAll(`[data-group-row="${rowNumber}"]`);
        elementsGroup.forEach((element) => {
          element.classList.remove('body-row-group_hidden');
        });
        this.openGroup.set(rowNumber, this.getLevelRow(rowNumber));
      } else {
        btnGroupImg.classList.remove('mdi-minus-box-outline');
        btnGroupImg.classList.add('mdi-plus-box-outline');

        let currentRow = btnGroupElement.closest('.body-row');
        for (let i = 0; i < btnGroupElement.getAttribute('data-row-group') - 1; i += 1) {
          currentRow = currentRow.nextElementSibling;
          if (currentRow.querySelector('button')) {
            currentRow.querySelector('button i').classList.remove('mdi-minus-box-outline');
            currentRow.querySelector('button i').classList.add('mdi-plus-box-outline');
          }
          currentRow.classList.add('body-row-group_hidden');
          this.openGroup.delete(rowNumber);
        }
      }
      console.log(this.openGroup);
    },
  },
};
