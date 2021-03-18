<template>
  <div class="el-field el-field-choice"
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <v-autocomplete class="el-field__item"
                    dense
                    return-object
                    no-data-text="Значение отсутствует"

                    :single-line="isSingleLine"
                    :hide-details="isHideMessage"
                    :disabled="isDisabled"
                    :label="fieldLabel"
                    :clearable="isBtnClear"
                    :solo="isHideUnderline"
                    :flat="isHideUnderline"
                    :items="fieldItems"
                    :item-text="'display_name'"
                    :item-value="'value'"
                    :rules="(fieldRequired) ? [rules.required] : []"
                    v-model="fieldValue"
                    @click:clear="eventClearValue"
                    @click.stop
                    @input="eventInputValue"
                    @change="eventChangeValue"
                    
                    @keydown.enter="eventKeyEnter"
                    @keydown.tab="eventKeyTab"
                    @keydown.esc="eventKeyEsc"
                    @keydown.stop="eventKeydown"
                    @focus="eventFocusField"
                    @blur="eventBlurField">
    </v-autocomplete>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
export default {
  name: 'ElFiledChoice',
  mixins: [
    ElField,
  ],
  data() {
    return {
      // isEmit: false,
      isChangeValue: false,
    }
  },
  computed: {
    fieldItems() { return this.inputProperties.choices; },
  },
  methods: {
    eventChangeValue(event) {
      this.isChangeValue = true;
      this.emitInputValue();
    },
    eventKeydown(event) { // ???????
      if (event.key == 'Delete' || event.key == 'Backspace') {
        this.fieldValue = null;
        this.emitInputValue();
      }
      this.emitKeydown(event);
    },
    eventKeyEnter(event) {
      if (this.checkRequiredField(event)) return;

      if (this.isChangeValue) {
        let sendOption = {
          key: event.key,
          value: this.fieldValue,
          event: event,
        }
        this.isEmit = true;
        this.emitKeyEnter(sendOption);
        // this.emitNextElement(event);
        // return;
      }
      if (this.fieldValue == null) {
        this.isEmit = true;
        // this.emitNextElement(event);
      }
      this.emitNextElement(event);
    },
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
.el-field-choice {
  z-index: 9999;
}
</style>