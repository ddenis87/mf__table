<template>
  <div class="input-field-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Wrapper',
  props: {
    isUse: { type: String, default: 'string' },
    idDisabled: { type: Boolean, default: false },
  },
};
</script>
