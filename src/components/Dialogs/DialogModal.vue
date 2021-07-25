<template>
  <v-dialog class="dialog-modal"
            overlay-color="white"
            :overlay-opacity="opacity"
            persistent
            no-click-animation
            :width="width"
            v-model="isDialogShow"
            max-width="800">

    <v-card calss="dialog-modal__body">
      <dialog-toolbar class="dm__header"
                      :is-dialog-name="isDialogName"
                      :height="44"
                      @close-dialog="closeDialog"></dialog-toolbar>
      <div class="dm__body">
        <v-card-text>
          <slot></slot>
        </v-card-text>
        <v-card-actions v-if="isControl" class="form-control">
          <v-spacer></v-spacer>
          <el-btn v-if="isCancel.isShow"
                  ref="ControlCancel"
                  @click="evtCancel"
                  @keydown="evtKeydownCancel">{{ isCancel.text }}</el-btn>
          <el-btn v-if="isAccept.isShow"
                  ref="ControlAccept"
                  @click="evtAccept"
                  @keydown="evtKeydownAccept">{{ isAccept.text }}</el-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

import DialogToolbar from './DialogToolbar.vue';

export default {
  name: 'DialogModal',
  components: {
    DialogToolbar,
    ElBtn,
  },
  props: {
    isDialogShow: { type: Boolean, default: false },
    isDialogName: { type: String, default: '' },
    isControl: { type: Boolean, default: false },
    opacity: { type: Number, default: 0.5 },
    isAccept: {
      type: Object,
      default() {
        return {
          isShow: true,
          text: 'Записать',
        };
      },
    },
    isCancel: {
      type: Object,
      default() {
        return {
          isShow: true,
          text: 'Отменить',
        };
      },
    },
    width: { type: Number, default: 500 },
  },
  methods: {
    evtCancel() { this.$emit('dialog:cancel'); },
    evtAccept() { this.$emit('dialog:accept'); },
    evtKeydownCancel() { this.$emit('dialog:cancel'); },
    evtKeydownAccept() { this.$emit('dialog:accept'); },
    closeDialog() {
      this.$emit('close-dialog'); // потом убрать
      this.$emit('dialog:cancel');
    },
  },
};
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
