<template>
  <div class="field">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FieldWrapper',
  props: {
    inUse: { type: String, default: null },
    isDense: { type: Boolean, default: true },
  },
  computed: {
    fieldProps() {
      return {
        dense: this.isDense,
      }
    },
  },
}
</script>