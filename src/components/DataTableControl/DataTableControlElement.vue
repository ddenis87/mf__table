<template>
  <div class="data-table-control-actions-element">
    <el-btn-icon icon="mdi-pencil" :disabled="!focusedElement" @click="editingElement">Изменить</el-btn-icon>
    <el-btn-icon :icon="(isViewRecucleBin) ? 'mdi-text-box-remove-outline' : 'mdi-text-box-remove-outline'" 
                    :disabled="!focusedElement" 
                    @click="eventActionMarkDeleting">{{ (isViewRecucleBin) ? 'Снять пометку на удаление' : 'Установить пометку на удаление'}}</el-btn-icon>
  
    <dialog-full-page :is-dialog-name="`Редактирование ${(typeElement == 'element') ? 'записи' : 'группы'} ${(isMarkDeletedRecord) ? '(помечен на удаление)' : ''}`"
                      :is-dialog-show="isDialogShow" 
                      @close-dialog="eventCloseDialog">
      <component :is="componentTableForm"
                 :guid="guid"
                 :focused-element="focusedElement"
                 @event-action-accept="eventActionAccept"
                 @event-action-cancel="eventActionCancel"></component>
    </dialog-full-page>
  </div>
</template>

<script>
import { DataTableControl } from  './DataTableControl.js';

export default {
  name: 'DataTableControlElement',
  mixins: [
    DataTableControl,
  ],
  props: {
    isMarkDeletedView: { type: Boolean, default: false },
    // elementFocused: { type: Object, default() { return null } },
  },
  data() {
    return {
      // typeElement: 'element',
    }
  },
  computed: {
    // isMarkDeletedRecord() { return (this.elementFocused) ? this.elementFocused.is_deleted : false; },
    isMarkDeletedRecord() { return (this.focusedElement) ? this.focusedElement.is_deleted : false; },
  },
  methods: {
    editingElement() {
      if ('is_group' in this.focusedElement) {
        if (this.focusedElement.is_group) this.typeElement = 'group';
        else this.typeElement = 'element';
      } else {
        this.typeElement = 'element';
      }
      this.eventOpenForm();
      console.log(this.focusedElement);
    },
    async eventActionMarkDeleting() {
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
        id: this.focusedElement['id'],
      }
      let snackBar = {
        show: true,
      };
      await this.$store.dispatch('DataTable/MARK_DELETED_ELEMENT', sendOption)
        .then(() => {
           snackBar.text = (this.isMarkDeletedView) ? 'Пометка на удаление снята' : 'Пометка на удаление установлена';
           snackBar.status = true;
         })
         .catch(() => {
           snackBar.text = 'Ошибка, изменения не сохранены';
           snackBar.status = false;
         })
         .finally(() => {
           this.$emit('event-mark-deleted', snackBar);
         })
    },
  }
}
</script>