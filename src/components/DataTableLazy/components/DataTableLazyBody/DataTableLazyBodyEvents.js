export const DataTableLazyBodyEvents = {
  data() {
    return {
      isRowFocus: false,
      isColumnEditing: false,
      isColumnFocus: false,
    }
  },
  methods: {
    eventMouseOver(event) {
      if (!this.isColumnFocus && !this.isColumnEditing && !this.isRowFocus)
        event.target.closest('.body-row')?.classList.add('body-row_hover');
      // this.tooltipShow(event);
      
    },
    eventMouseOut(event) {
      if (event.relatedTarget?.classList?.contains('tooltip')) return;
      if (!this.isColumnFocus && !this.isColumnEditing && !this.isRowFocus)
        event.target.closest('.body-row')?.classList.remove('body-row_hover');
      // this.tooltipHide(event);
      
    },

    // EVENT FOCUS/SELECT/BLUR ROW
    eventRowFocus(event, itemRow) {
      this.isRowFocus = true;
      event.target.classList.remove('body-row_hover');
      event.target.classList.add('body-row_focus');
      // console.log('focused row');
      // this.$emit('focused-row', event, itemRow);
    },
    eventRowBlur(event) {
      this.isRowFocus = false;
      event.target.classList.remove('body-row_focus');
      if (event.relatedTarget == null) {
        this.$emit('blur-body');
      }
    },
    eventRowClick(event, itemRow) {
      this.$emit('focused-row', event, itemRow);
    },

    // EVENT FOCUS/BLUR COLUMN
    eventColumnFocus(event) {
      // this.isTooltipShow = false; // hide tooltip
      this.isColumnFocus = true;
      event.target.parentElement.classList.remove('body-row_hover');
      event.target.parentElement.classList.add('body-row_focus');
      event.target.classList.add('body-column_focus');
    },
    eventColumnBlur(event) {  // work if not editable
      // if (!this.isColumnEditing) {
        this.isColumnFocus = false;
        event.target.parentElement.classList.remove('body-row_focus');
        event.target.classList.remove('body-column_focus');
      // }
      if (event.relatedTarget == null) {
        this.$emit('blur-body');
      }
    },
  }
}