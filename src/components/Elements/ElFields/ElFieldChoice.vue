<template>
  <div class="el-field">
    <v-autocomplete class="el-field__item"
                    no-data-text="Значение отсутствует"
                    return-object
                    :dense="isDense"
                    :single-line="isSingleLine"
                    :solo="isHideUnderline"
                    :flat="isHideUnderline"
                    :hide-details="isHideMessage"
                    :disabled="isDisabled"
                    :clearable="isBtnClear"
                    :label="fieldLabel"
                    :rules="fieldRequired"
                    :items="fieldItems"
                    :item-text="'display_name'"
                    :item-value="'value'"
                    v-model="fieldValue"

                    @input="eventInput"
                    @keydown.tab="eventKeydownTab"
                    @keydown.enter="eventKeydownEnter"
                    @keydown.esc="eventKeydownEsc"
                    @click:clear="eventClear"
                    @blur="eventBlur"></v-autocomplete>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
export default {
  name: 'ElFieldChoice',
  mixins: [
    ElField,
  ],
  computed: {
    fieldItems() { return this.inputProperties.choices; },
  },
  methods: {
    eventKeydownEnter(event) {
      let eventClick = new Event('click');
      console.log(event.target.closest('.el-field'));
      event.target.closest('.el-field').dispatchEvent(eventClick);
      if (this.checkRequiredField(event)) return;
      this.isEmit = false;

      setTimeout(() => {
        this.emitInputValue();
        this.emitKeydown(event);
      }, 10);
    },
    eventInput(event) {
      console.log(event);
    },
  },
}
</script>