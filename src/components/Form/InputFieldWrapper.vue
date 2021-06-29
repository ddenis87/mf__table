<template>
  <div class="input-field-wrapper"
       :class="used">
    <component :is="field"></component>
  </div>
</template>

<script>
import TextField from './TextField.vue';
// import Wrapper from './Wrapper.vue';

export default {
  name: 'InputFieldWrapper',
  components: {
    TextField,
    // Wrapper,
  },
  props: {
    isUsed: { type: String, default: 'table' },
    fieldType: { type: String, default: 'string' },
  },
  data() {
    return {
      fields: {
        string: TextField,
      },
    };
  },
  computed: {
    field() {
      return this.fields[this.fieldType];
    },
    used() {
      return this.isUsed;
    },
  },
  methods: {
    fieldKeydown() {},
    fieldKeydownControl() {},
    fieldBlur() {},
  },
};
</script>

<style lang="scss" scoped>
.input-field-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 100px;
  height: 100%;
  min-height: 22px;
  overflow: hidden;
}
.table {
  padding: 0 3px;
  padding-bottom: 4px;
}
</style>
