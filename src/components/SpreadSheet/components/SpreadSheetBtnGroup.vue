<template>
  <v-btn class="action-btn"
         icon
         width="16"
         height="16"
         :disabled="isDisabled"
         @click="(event) => $emit('click', event)">
    <!-- <slot name="text"></slot> -->
    <slot></slot>
    <!-- <v-icon small :color="iconColor">
      <slot></slot>
    </v-icon> -->
  </v-btn>
</template>

<script>
export default {
  name: 'SpreadSheetBtnGroup',
  props: {
    // iconColor: { type: String, default: 'black' },
    isDisabled: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.action-btn {
  font-size: 1em;
  // color: red;
}
</style>
