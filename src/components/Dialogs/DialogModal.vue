<template>
  <v-dialog class="dialog-modal" hide-overlay
            :width="width"
            v-model="isDialogShow"
            @click:outside="$emit('close-dialog')">
  <v-card>
    <dialog-toolbar :is-dialog-name="isDialogName"
                    :height="44"
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
  name: 'DialogModal',
  components: {
    DialogToolbar,
  },
  props: {
    isDialogShow: { type: Boolean, default: false },
    isDialogName: { type: String, default: '' },
    width: { type: Number, default: 500 },
  }
}
</script>