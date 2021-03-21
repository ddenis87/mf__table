<template>
  <div class="el-field">
    <v-text-field class="el-field__item"
                  type="number"
                  :dense="isDense"
                  :single-line="isSingleLine"
                  :solo="isHideUnderline"
                  :flat="isHideUnderline"
                  :hide-details="isHideMessage"
                  :disabled="isDisabled"
                  :clearable="isBtnClear"
                  :label="fieldLabel"
                  :rules="fieldRequired"
                  v-model="fieldValue"
                  @input="eventInput"
                  @keydown.tab="eventKeydownTab"
                  @keydown.enter="eventKeydownEnter"
                  @keydown.esc="eventKeydownEsc"
                  @click:clear="eventClear"
                  @blur="eventBlur"></v-text-field>
  </div>
</template>

<script>
import { ElField } from './ElFiled.js';
export default {
  name: 'ElFieldNumber',
  mixins: [
    ElField,
  ]
}
</script>

<style lang="scss" scoped>

::v-deep {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>