<template>
  <div class="el-field el-field-number"
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <v-text-field class="el-field__item"
                  dense
                  tabindex="1"
                  :single-line="isSingleLine"
                  :hide-details="isHideMessage"
                  :disabled="isDisabled"
                  :label="fieldLabel"
                  :clearable="isBtnClear"
                  :solo="isHideUnderline"
                  :flat="isHideUnderline"
                  :rules="(fieldRequired) ? [rules.required] : []"
                  v-model="fieldValue"
                  @click:clear="eventClearValue"
                  @click.stop
                  @input="eventInputValue"
                  @keydown.enter="eventKeyEnter"
                  @keydown.tab="eventKeyTab"
                  @keydown.esc="eventKeyEsc"
                  @keydown.stop="eventKey"
                  @blur="eventBlurField">
    </v-text-field>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
export default {
  name: 'ElFiledNumber',
  mixins: [
    ElField,
  ],
  methods: {
    eventKeyEnter(event) {
      if (this.checkRequiredField(event)) return;

      let sendOption = {
        key: event.key,
        value: this.fieldValue,
        event: event,
      }
      this.isEmit = true;
      this.emitKeyEnter(sendOption);
      this.emitNextElement(event);
    },
    eventKey(event) {
      if (event.code.includes('Key') || 
          event.code == 'BracketLeft' || 
          event.code == 'BracketRight' ||
          event.code == 'Backslash' ||
          event.code == 'Space' ||
          event.code == 'Semicolon' || 
          event.code == 'Quote' || 
          event.code == 'Comma' ||
          event.code == 'Period' ||
          event.key == '/') { event.preventDefault(); return; }

      if (event.code == 'NumpadDecimal' || event.code == 'Slash') {
        if ((this.fieldValue.match(/[\.\,]/g)) && (this.fieldValue.match(/[\.\,]/g).length > 0)) { event.preventDefault(); return; }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
</style>