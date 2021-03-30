<template>
  <div class="el-field el-field-number"
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <div class="el-field__anchor" tabindex="-2"></div>
    <v-text-field class="el-field__item"
                  type="number"
                  v-bind="propsField"
                  v-model="fieldValue"
                  @input="eventInput"
                  @keydown.stop.enter="eventKeydownEnter"
                  @blur="blurInput"></v-text-field>
  </div>
</template>

<script>
import { ElField } from './ElFields.js';
import { ElFieldProps } from './ElFieldsProps.js';

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
    eventKeydownEnter(event) {
      if (this.checkRequiredField(event)) return;
      let newEvent = new Event('click');
      event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
      this.emitInputValue();
      this.emitKeydown(event);
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