<template>
  <v-navigation-drawer temporary hide-overlay right fixed
                       :width="width"
                       v-model="isOpen">
    <dialog-toolbar :is-dialog-name="dialogName"
                    orientation="right"
                    @close-dialog="$emit('close-dialog')"></dialog-toolbar>
      <slot></slot>
  </v-navigation-drawer>
</template>

<script>
import DialogToolbar from './DialogToolbar.vue';
export default {
  name: 'DialogBarRight',
  components: {
    DialogToolbar,
  },
  props: {
    tableName: { type: String, default: null },
    isDialogName: { type: String, default: '' },
    isDialogShow: { type: Boolean, default: false },
    width: { type: String, default: '400' },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    dialogName() {
      return (this.tableName) ? this.isDialogName + ' - ' + this.$store.getters[`DataTable/GET_DESCRIPTION`](this.tableName) : this.isDialogName;
    },
  },
  watch: {
    isDialogShow() { this.isOpen = this.isDialogShow; },
    isOpen() { if (!this.isOpen) this.$emit('close-dialog'); },
  },
}
</script>