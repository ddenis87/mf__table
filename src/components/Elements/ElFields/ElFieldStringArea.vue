<template>
  <div class="el-field el-field-string" 
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <div class="el-field__anchor" tabindex="-1"></div>
    <v-textarea class="el-field__item"
                rows="3"
                auto-grow
                v-bind="propsField"
                :loading="(inUse == null && inputProperties.required)"
                :maxLength="fieldMaxLength"
                v-model="fieldValue"
                @input="eventInput"
                @keydown.stop.enter="eventKeydownEnter"
                @blur="blurInput">
      <template v-slot:progress>
        <div v-if="(inUse == null && inputProperties.required)" class="el-field__item_required"></div>
      </template>
    </v-textarea>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
import { ElFieldProps } from './ElFieldProps.js';
export default {
  name: 'ElFiledStringArea',
  mixins: [
    ElField,
    ElFieldProps,
  ],
  methods: {
    eventInput() {
      this.emitInputValue();
    },
    eventKeydownEnter(event) {
      console.log('enter');
      event.preventDefault();
      if (this.checkRequiredField(event)) return;
      let newEvent = new Event('click');
      event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
      this.emitInputValue();
      this.emitKeydown(event);
    },
    blurInput(event) {},
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
</style>