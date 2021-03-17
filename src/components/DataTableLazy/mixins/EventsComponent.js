export const EventsComponent = {
  methods: {
    focusedRow(event, option) {
      this.$emit('focused-row', option);
    },
    inputValue(tableValue) {
      this.$emit('input-value', tableValue);
    },
    deletingItem(index) {
      this.$emit('deleting-item', index);
    },
    insertingItem(event) {
      this.$emit('inserting-item', event);
    },
    eventKeydownEnter() {
      this.$emit('keydown-enter');
      // console.log('enter');
    },
    // inputValue(value, indexRow) {
    //   this.$emit('input-value', value, indexRow);
    // },
  }
}