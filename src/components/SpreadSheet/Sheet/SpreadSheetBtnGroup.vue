<template>
  <v-btn class="action-btn"
         icon
         width="16"
         height="16"
         :disabled="isDisabled"
         @click="(event) => $emit('click', event)">
    <v-icon small :color="iconColor">
      <slot></slot>
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'SpreadSheetBtnGroup',
  props: {
    iconColor: { type: String, default: 'black' },
    isDisabled: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.action-btn {
  margin: 0px 1px;
}
</style>
