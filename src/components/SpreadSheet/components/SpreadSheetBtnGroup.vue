<template>
  <div class="spread-sheet-btn-group">
    <v-btn class="action-btn"
         icon
         width="16"
         height="16"
         :disabled="isDisabled"
         @click="(event) => $emit('click', event)">
    <slot></slot>
  </v-btn>
  </div>
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
.spread-sheet-btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  border: thin solid grey;
  overflow: hidden;
  .action-btn {
    font-size: 1em;
  }
}
</style>
