<template>
  <v-dialog class="dialog"
            fullscreen
            :transition="transition"
            v-model="isOpen"
            @click:outside="$emit('close-dialog')">
    <v-card>
      <dialog-toolbar :is-dialog-name="isDialogName"
                      @close-dialog="$emit('close-dialog')"></dialog-toolbar>
      <div class="dialog__body">
        <slot></slot>
      </div>

    </v-card>
  </v-dialog>
</template>

<script>
import DialogToolbar from './DialogToolbar.vue';

export default {
  name: 'DialogFullPage',
  components: {
    DialogToolbar,
  },
  props: {
    isDialogShow: { type: Boolean, default: false },
    isDialogName: { type: String, default: '' },
    // isTransition: { type: String, default: 'bottom' },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    transition() { return 'dialog-bottom-transition'; },
  },
  watch: {
    isDialogShow() { this.isOpen = this.isDialogShow; },
    isOpen() { if (!this.isOpen) this.$emit('close-dialog'); },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  // &__title {
  //   color: white;
  // }
  &__body {
    height: calc(100vh - 66px);
    // border: thin solid green;
  }
}
</style>
