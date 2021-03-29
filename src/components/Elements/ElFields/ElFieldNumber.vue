<template>
  <div class="el-field">
    <div class="el-field__anchor" tabindex="-2"></div>
    <v-text-field class="el-field__item"
                  type="number"
                  v-bind="propsField"
                  v-model="fieldValue"
                  @keydown.stop.enter="eventKeydownEnter"
                  @blur="blurInput"></v-text-field>
  </div>
</template>

<script>
import { ElField } from './ElFields.js';
import { ElFieldProps } from './ElFieldProps.js';

export default {
  name: 'ElFieldNumber',
  mixins: [
    ElField,
    ElFieldProps,
  ],
  methods: {
    eventKeydownEnter(event) {
      if (this.checkRequiredField(event)) return;
      let newEvent = new Event('click');
      event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
      this.emitInputValue();
      this.emitKeydown(event); // this.$emit('event-keydown', {event: event, value: this.fieldValue});
    },

    blurInput(event) {},
  }
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
::v-deep {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>