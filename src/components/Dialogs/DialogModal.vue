<template>
  <v-dialog class="dialog-modal" hide-overlay
            :width="width"
            v-model="isDialogShow"
            max-width="800"
            @click:outside="$emit('close-dialog')">
  <v-card min-height="300" class="dialog-body">
    <dialog-toolbar class="dialog-body__header"
                    :is-dialog-name="isDialogName"
                    :height="44"
                    @close-dialog="$emit('close-dialog')"></dialog-toolbar>
    <div class="dialog-body__body">
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
.dialog-body {
  display: grid;
  grid-template-areas: "header" "body";
  grid-template-columns: 100%;
  grid-template-rows: 44px 1fr;
  &__header {
    grid-area: header;
  }
  &__body {
    grid-area: body;
    padding: 5px;
  }
}

</style>