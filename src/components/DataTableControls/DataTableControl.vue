<template>
  <div class="data-table-control">
    <v-toolbar class="toolbar"
               height="48"
               flat>
      <v-overlay :value="isDisabledControl" opacity="0.5" z-index="999" color="white" :absolute="true"></v-overlay>

      <!-- ACTIONS -->
      <data-table-control-actions :table-name="tableName"
                                  :guid="guid"
                                  :props-table="propsTable"></data-table-control-actions>
      <v-spacer></v-spacer>
      <!-- VIEWS -->
      <data-table-control-views :table-name="tableName"
                                :guid="guid"
                                :props-table="propsTable"></data-table-control-views>
      
      <!-- FILTERS -->
      <el-btn-icon icon="mdi-filter-outline" 
                 :icon-color="(isFilterActive) ? 'blue' : ''"
                 @click="isShowDialogFilter = !isShowDialogFilter">Фильтр</el-btn-icon>
    </v-toolbar>
    <!-- FILTERS -->
    <dialog-bar-right is-dialog-name="Фильтр"
                      :is-dialog-show="isShowDialogFilter"
                      width="600"
                      @close-dialog="isShowDialogFilter = false">
      <component :is="importComponentFilter"
                 :table-name="tableName"
                 :guid="guid"
                 :is-open="isShowDialogFilter"
                 @close-dialog="isShowDialogFilter = false"
                 @accept="isShowDialogFilter = false"></component>
    </dialog-bar-right>
  </div>
</template>

<script>
import { DataTableControl } from './DataTableControl.js';
import { DataTableControlFilter } from './DataTableControlFilter.js';

export default {
  name: 'DataTableControl',
  mixins: [
    DataTableControl,
    DataTableControlFilter,
  ]
}
</script>

<style lang="scss" scoped>

</style>