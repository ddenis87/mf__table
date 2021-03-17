export const DataTableEvents = {
  methods: {
    eventComponentCreated(option) {
      this.$emit('component-created', option);
    },
    eventComponentMounted(option) {
      this.$emit('component-mounted', option);
    },
    eventRowFocused(event, option) {
      this.$emit('event-row-focused', option);
    },
    eventRowSelected(event, option) {
      this.$emit('event-row-selected', option, this.properties.tableName);
    },
    eventRowKeydown(event, option) {
      // console.log(option);
      this.$emit('event-row-keydown', event, option);
    },
    eventBodyBlur() {
      this.$emit('event-component-blur');
    }
  },
}