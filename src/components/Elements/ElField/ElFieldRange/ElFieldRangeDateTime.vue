<template>
  <div class="el-field">
    <el-field-date-time class="el-field__item"
                        :is-single-line="isSingleLine"
                        :is-required-off="true"
                        :is-disabled="isDisabled"
                        :input-properties="{label: 'Начало'}"
                        v-model="fieldValue.start"
                        @input-value="eventInputValue"
                        @clear-value="eventClearValue"></el-field-date-time>
                   
    <el-field-date-time class="el-field__item"
                        
                        :is-single-line="isSingleLine"
                        
                        :is-required-off="true"
                        :is-disabled="isDisabled"
                        :input-properties="{label: 'Окончание'}"
                        v-model="fieldValue.end"
                        @input-value="eventInputValue"
                        @clear-value="eventClearValue"></el-field-date-time>
  </div>
</template>

<script>
import { ElFieldRange } from './ElFieldRange.js';
import ElFieldDateTime from '../ElFieldDateTime.vue';
export default {
  name: 'ElFieldRangeDateTime',
  components: {
    ElFieldDateTime,
  },
  mixins: [
    ElFieldRange,
  ],
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