<template>
  <v-dialog class="dialog-modal" overlay-color="white" overlay-opacity="0.5" persistent no-click-animation
            :width="width"
            v-model="isDialogShow"
            max-width="800"
            >
  
  <v-card calss="dialog-modal__body">
    <dialog-toolbar class="dm__header"
                    :is-dialog-name="isDialogName"
                    :height="44"
                    @close-dialog="$emit('close-dialog')"></dialog-toolbar>
    <div class="dm__body">
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

<style lang="scss" scoped>

::v-deep {
  .v-dialog {
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      &-thumb {
        border-radius: 3px;
        background-color: rgba(0,0,0,0.2);
      }
    }
  }
}
</style>