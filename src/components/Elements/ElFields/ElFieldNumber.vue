<template>
  <div class="el-field el-field-number"
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <div class="el-field__anchor" tabindex="-1"></div>
    <v-text-field class="el-field__item"
                  type="number"
                  v-bind="propsField"
                  v-model="fieldValue"
                  @input="eventInput"
                  @keydown.stop.enter="eventKeydown"
                  @keydown.stop.tab="eventKeydown"
                  @keydown.stop.escape="eventKeydown"
                  @blur="blurField"></v-text-field>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
import { ElFieldProps } from './ElFieldProps.js';

export default {
  name: 'ElFieldNumber',
  mixins: [
    ElField,
    ElFieldProps,
  ],
  methods: {
    eventInput() {
      this.emitInputValue();
    },
    eventKeydown(event) {
      if (this.checkRequiredField(event)) return;
      let newEvent = new Event('click');
      event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
      this.emitInputValue();
      this.emitKeydown(event);
      this.isEmit = false;
    },
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