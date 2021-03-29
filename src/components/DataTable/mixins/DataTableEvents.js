export const DataTableEvents = {
  methods: {
    eventComponentCreated(option) {
      // this.eventComponent('')
      // this.$emit('component-created', option);
    },
    mountedComponent(option) {
      this.eventComponent('mounted-component', option)
      // this.$emit('component-mounted', option);
    },
    focusedElement(event, value) {
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', Object.assign({ value: value }, this.optionGetter));
      // console.log(option);
      // this.eventComponent('focused-element', option)
      // this.$emit('event-row-focused', option);
    },
    selectedElement(event, value) {
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', Object.assign({ value: value }, this.optionGetter));
      // console.log(option);
      this.eventComponent('selected-element', value)
      // this.$emit('event-row-selected', option, this.properties.tableName);
    },
    eventRowKeydown(event, option) {
      // console.log(option);
      // this.$emit('event-row-keydown', event, option);
    },
    blurComponent() {
      // console.log(this.optionGetter);
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', this.optionGetter);
      // this.eventComponent('blur-component');
      // this.$emit('event-component-blur');
    },

    eventComponent(eventName, option) {
      this.$emit('event-component', eventName, option);
    },
  },
}