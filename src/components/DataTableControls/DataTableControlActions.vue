<template>
  <div class="data-table-control-actions">
    <el-btn-icon v-if="propsTable.isAdding && propsTable.isAddingForm"
                 icon="mdi-plus"
                 @click="addingElement">Добавить элемент</el-btn-icon>
    <el-btn-icon v-if="propsTable.isAddingInline"
                 icon="mdi-table-row-plus-after" 
                 @click="addingElementInline">Добавить строку</el-btn-icon>
    <el-btn-icon v-if="propsTable.isHierarchy && propsTable.isAdding"
                 icon="mdi-folder-plus-outline"
                 @click="addingGroup">Добавить группу</el-btn-icon>

    <el-btn-icon v-if="(propsTable.isEditable && propsTable.isEditableForm)"
                 icon="mdi-pencil"
                 :disabled="!activeElement"
                 @click="editingElement">Изменить</el-btn-icon>
    <el-btn-icon v-if="propsTable.isMarkDeleted"
                 :disabled="!activeElement"
                 :icon="(isRecycleBin) ? 'mdi-text-box-remove-outline' : 'mdi-text-box-remove-outline'" 
                 @click="markDeletingElement" >
      {{ (isRecycleBin) ? 'Снять пометку на удаление' : 'Установить пометку на удаление'}}
    </el-btn-icon>
    <el-btn-icon v-if="propsTable.isMarkDeleted"
                 icon="mdi-delete-variant"
                 :icon-color="(isRecycleBin) ? 'blue' : ''"
                 @click="toggleRecycleBin">{{ (isRecycleBin) ? 'Выйти из корзины' : 'Показать помеченные на удаление' }}</el-btn-icon>
    <el-btn-icon v-if="!propsTable.isMarkDeleted && propsTable.isMarkDeleted != null"
                 :disabled="!activeElement"
                 icon="mdi-delete"
                 @click="deletingElement">{{ 'Удалить' }}</el-btn-icon>

    <dialog-full-page :is-dialog-name="buildActionTitle"
                      :is-dialog-show="isShowDialog" 
                      @close-dialog="closeDialog">
      <component :is="importComponentForm"
                 :guid="guid"
                 :focused-element="activeElement"
                 :filters-form="filtersForm"
                 @event-action-accept="eventActionAccept"
                 @event-action-cancel="closeDialog"></component>
    </dialog-full-page>
  </div>
</template>

<script>
import { DataTableControlActions } from './DataTableControlActions.js';

export default {
  name: 'DataTableControlActions',
  mixins: [
    DataTableControlActions,
  ]
}
</script>

<style lang="scss" scoped>
.data-table-control-actions {
  margin-left: -12px;
}
</style>