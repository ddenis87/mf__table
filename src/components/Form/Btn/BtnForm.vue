<template>
  <div class="btn-dialog">
    <v-btn class="btn-dialog__item"
           v-bind="btnProps"
           @click="(event) => $emit('click', event)"
           @keydown="(event) => $emit('keydown', event)">
      <slot></slot>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'BtnForm',
  props: {
    height: { type: String, default: '22' },
    isSmall: { type: Boolean, default: true },
  },
  computed: {
    btnProps() {
      return {
        depressed: true,
        dark: true,
        small: this.isSmall,
        color: 'blue darken-1',
        height: this.height,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
