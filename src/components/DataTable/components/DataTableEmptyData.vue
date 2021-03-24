<template>
  <dialog-modal is-dialog-name="Сообщение"
                :is-dialog-show="isShow"
                @close-dialog="closeDialogModal('cancel')">
    <v-card>
      <v-card-text>По заданным условиям записи отсутствуют, отключить или сбросить фильтры?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <el-btn @click="closeDialogModal('cancel')">Отменить</el-btn>
        <el-btn class="tabspace-end" @click="closeDialogModal('off')" @keydown="closeDialogModal('off')">Отключить</el-btn>
        <!-- <el-btn class="tabspace-end" 
                    @click="closeDialogModal('reset')"
                    @keydown="closeDialogModal('reset')">Сбросить</el-btn> -->
      </v-card-actions>
    </v-card>
    
  </dialog-modal>
</template>

<script>
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue'
import DialogModal from '@/components/Dialogs/DialogModal.vue';
export default {
  name: 'DataTableEmptyData',
  components: {
    DialogModal,
    ElBtn,
  },
  props: {
    isShow: { type: Boolean, default: false },
  },
  methods: {
    closeDialogModal(option) {
      this.$emit('close-dialog', option);
      
    },
  }
}
</script>