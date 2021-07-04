<template>
  <v-dialog class="dialog"
            fullscreen
            transition="bottom"
            v-model="isDialogShow"
            @click:outside="evtCloseDialog">
    <v-card>
      <dialog-toolbar :is-dialog-name="isDialogName"
                      @close-dialog="evtCloseDialog"></dialog-toolbar>
      <div class="dialog__body">
        <slot></slot>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogToolbar from './DialogToolbar.vue';

export default {
  name: 'DialogFull',
  components: {
    DialogToolbar,
  },
  props: {
    isDialogShow: { type: Boolean, default: false },
    isDialogName: { type: String, default: '' },
  },
  methods: {
    evtCloseDialog() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  &__body {
    height: calc(100vh - 66px);
  }
}
</style>
