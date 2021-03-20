<template>
  <div class="el-field">
      <el-field-number class="el-field__item range-start"
                       :is-single-line="isSingleLine"
                       :is-required-off="true"
                       :is-disabled="isDisabled"
                       :input-properties="{label: 'Начало'}"
                       v-model="fieldValue.start"
                       @input-value="eventInputValue"
                       @keydown="eventKeydown"
                       @clear-value="eventClearValue"></el-field-number>
    
      <el-field-number class="el-field__item range-end"
                       :is-single-line="isSingleLine"
                       :is-required-off="true"
                       :is-disabled="isDisabled"
                       :input-properties="{label: 'Окончание'}"
                       v-model="fieldValue.end"
                       @input-value="eventInputValue"
                       @clear-value="eventClearValue"></el-field-number>
  </div>
</template>

<script>
import { ElFieldRange } from './ElFieldRange.js';
import ElFieldNumber from '../ElFieldNumber.vue';
export default {
  name: 'ElFieldRangeNumber',
  components: {
    ElFieldNumber,
  },
  mixins: [
    ElFieldRange,
  ],
  methods: {
    eventKeydown(event) {
      console.log(event);
      // let eventTab = new Event('keydown', {key: 'Tab', code: 'Tab'})
      // event.target.dispatchEvent(eventTab);

    }
  },
}
</script>

<style lang="scss" scoped>
@import '../ElField.scss';

.el-field {
  display: flex;
  justify-content: space-between;
  gap: 0px 10px;
}
</style>