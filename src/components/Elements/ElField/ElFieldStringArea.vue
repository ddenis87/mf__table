<template>
  <div class="el-field el-field-string" 
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <v-textarea class="el-field__item"
                dense
                tabindex="1"
                auto-grow
                rows="3"
                :single-line="isSingleLine"
                :hide-details="isHideMessage"
                :disabled="isDisabled"
                :label="fieldLabel"
                :clearable="isBtnClear"
                :solo="isHideUnderline"
                :flat="isHideUnderline"
                :maxLength="fieldMaxLength"
                :rules="(fieldRequired) ? [rules.required] : []"
                v-model="fieldValue"
                @click:clear="eventClearValue"
                @click.stop
                @input="eventInputValue"
                @keydown.enter="eventKeyEnter"
                @keydown.tab="eventKeyTab"
                @keydown.esc="eventKeyEsc"
                @keydown.stop
                @blur="eventBlurField">
    </v-textarea>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
export default {
  name: 'ElFiledString',
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
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
</style>