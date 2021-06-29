<template>
  <div class="input-field field-string">
    <v-text-field dense
                  hide-details="auto"
                  :label="fieldLabel"
                  :clearable="isClearable"
                  :disabled="isDisabled"
                  v-model="fieldValue"></v-text-field>
  </div>
</template>

<script>
import fieldProps from './filedProps';

export default {
  name: 'TextField',
  props: {
    ...fieldProps,
  },
  data() {
    return {
      fieldValue: '',
    };
  },
  methods: {
    evtKeydown() {},
    entKeydownControl() {},
    evtBlur() {},
  },
};
</script>
