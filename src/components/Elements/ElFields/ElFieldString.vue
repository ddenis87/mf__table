<template>
  <div class="el-field el-field-string"
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <div class="el-field__anchor" tabindex="-1"></div>
    <v-text-field class="el-field__item"
                  v-bind="propsField"
                  :loading="(inUse == null && inputProperties.required && (fieldValue == null || fieldValue == ''))"
                  :maxLength="fieldMaxLength"
                  v-model="fieldValue"
                  @input="eventInput"
                  @keydown.stop.enter="eventKeydown"
                  @keydown.stop.tab="eventKeydown"
                  @keydown.stop.escape="eventKeydown"
                  @keydown.stop
                  @blur="blurField">
      <template v-slot:progress>
        <div v-if="(inUse == null && inputProperties.required && (fieldValue == null || fieldValue == ''))" class="el-field__item_required"></div>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
import { ElFieldProps } from './ElFieldProps.js';

export default {
  name: 'ElFieldString',
  mixins: [
    ElField,
    ElFieldProps,
  ],
  methods: {
    eventInput() {
      this.emitInputValue();
    },
    eventKeydown(event) {
      if (this.inUse == 'table') { event.preventDefault(); }
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
</style>