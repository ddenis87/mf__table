<template>
  <div class="data-table-control-actions-table">
    <el-btn-icon icon="mdi-plus" :disabled="isDisabledControl" @click="addingElement">Добавить элемент</el-btn-icon>
    <el-btn-icon icon="mdi-table-row-plus-after" :disabled="isDisabledControl" @click="addingElementInline">Добавить строку</el-btn-icon>
    <el-btn-icon icon="mdi-folder-plus-outline" :disabled="isDisabledControl || !isHierarchyMode" @click="addingGroup">Добавить группу</el-btn-icon>
    
     <dialog-full-page :is-dialog-name="`Добавление ${(typeElement == 'element') ? 'записи' : 'группы'}`" 
                       :is-dialog-show="isDialogShow" 
                       @close-dialog="eventCloseDialog">
     <component :is="componentTableForm"
                :guid="guid"
                @event-action-accept="eventActionAccept"
                @event-action-cancel="eventActionCancel"></component>
    </dialog-full-page> 
  </div>
</template>

<script>
import { DataTableControl } from './DataTableControl.js';

export default {
  name: 'DataTableControlTable',
  mixins: [
    DataTableControl,
  ],
  props: {
    // tableName: { type: String, default: null },
    // guid: { type: String, default: null },
    // elementFocused: { type: Object, default() { return null } },
  },
  data() {
    return {
      // isDialogShow: false,
      // typeElement: 'element',
    }
  },
  computed: {
    // componentTableForm() {
    //   if (!this.isDialogShow) return null;
    //   if (this.typeElement == 'element')
    //     return () => import(`@/components/TheTableForm/TheTableForm${this.tableName[0].toUpperCase() + this.tableName.slice(1)}`);
    //   else 
    //     return () => import(`@/components/TheTableForm/TheTableForm${this.tableName[0].toUpperCase() + this.tableName.slice(1)}Group`);
    // },
  },
  methods: {
    eventClickAddingTable() {
      // console.log(this.elementFocused);
      // let sendOption = {
      //   tableName: this.tableName,
      //   guid: this.guid,
      //   id: (this.elementFocused) ? this.elementFocused.id : -1,
      // }
      // // this.$store.commit('DataTable/DATA_STORE_ADDING_ELEMENT', sendOption);
      // this.$store.commit('DataTable/ADDING_INLINE_ELEMENT', sendOption);
    },
    // eventOpenForm() {
    //   this.isDialogShow = true;
    // },
    addingElement() {
      this.typeElement = 'element';
      this.eventOpenForm();
    },
    addingGroup() {
      this.typeElement = 'group';
      this.eventOpenForm();
    },
    // eventCloseDialog() {
    //   this.isDialogShow = false;
    //   this.$emit('blur-element');
    // },
  },
}
</script>

<style lang="scss" scoped>
.data-table-control-actions-table {
  margin-left: -12px;
}
</style>