<template>
  <div class="spread-sheet-edit-field-wrapper">
    <component :is="componentField"
               :in-use="'spreadSheetEdit'"
               :is-hide-underline="true"
               :is-required-off="true"
               :is-btn-clear="false"
               v-model="value"
               @event-keydown="eventKeydown"
               @event-blur="eventBlur"></component>
  </div>
</template>

<script>
export default {
  name: 'SpreadSheetEditFieldWrapper',
  model: {
    prop: 'cellValue',
    event: 'input',
  },
  props: {
    cellValue: [String, Number, Date, Object],
    cellType: { type: String, default: 'string' },
  },
  data() {
    return {
      value: this.cellValue,
    };
  },
  computed: {
    componentField() {
      // eslint-disable-next-line prefer-template
      return () => import('@/components/Elements/ElFields/ElField' + this.getToUpperFirstChar(this.cellType) + '.vue');
    },
  },
  methods: {
    eventKeydown(option) {
      console.log(option);
      if (option.event.key === 'Escape') this.$emit('event-keydown-escape', { ...option });
      if (option.event.key === 'Enter') this.$emit('event-keydown-enter', { ...option });
      if (option.event.key === 'Tab') this.$emit('event-keydown-tab', { ...option });
      this.$emit('input', this.value);
      this.$emit('event-keydown', { ...option });
    },
    eventBlur(option) {
      // console.log(option);
      this.$emit('input', this.value);
      this.$emit('event-blur', { ...option });
    },
    getToUpperFirstChar(value) {
      // console.log(value[0].toUpperCase() + value.slice(1));
      return value[0].toUpperCase() + value.slice(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-edit-field-wrapper {
  overflow: hidden;
  margin: 0 3px;
  margin-top: -18.5px;
  font-size: 0.8rem;
}
</style>
