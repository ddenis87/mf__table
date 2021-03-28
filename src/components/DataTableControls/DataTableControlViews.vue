<template>
  <div class="data-table-control-views">
    <el-btn-icon :icon="(propsTable.typeRow == 'fixed') ? 
      'mdi-view-sequential' : 
      (propsTable.typeRow == 'dense') ? 
        'mdi-view-sequential-outline' :
        'mdi-view-agenda'" 
                 @click="toggleView('toggle-type-row')">
                  {{ (propsTable.typeRow == 'fixed') ?
                    'Строки сжато' : 
                    (propsTable.typeRow == 'dense') ? 
                      'Строки свободно' :
                      'Строки фиксировано' }}
    </el-btn-icon>
    <el-btn-icon v-if="(propsTable.isExpansion != null)"
                 :disabled="propsTable.isMultiline"
                 icon="mdi-view-split-horizontal"
                 :icon-color="(propsTable.isExpansion) ? 'blue' : ''"
                 @click="toggleView('toggle-expansion')">Раскрытие строк</el-btn-icon>
    <el-btn-icon v-if="(propsTable.typeColumn != null)"
                 :icon="(propsTable.typeColumn == 'fixed') ? 'mdi-view-parallel-outline' : 'mdi-view-parallel'" 
                 @click="toggleView('toggle-type-column')">{{ (propsTable.typeColumn == 'fixed') ? 'Столбцы сжато' : 'Столбцы фиксировано' }}</el-btn-icon>

    <el-btn-icon v-if="(propsTable.isFooter != null)"
                 icon="mdi-page-layout-footer"
                 :icon-color="(propsTable.isFooter) ? 'blue' : ''"
                 @click="toggleView('toggle-footer')">Итоги</el-btn-icon>
    <el-btn-icon v-if="(propsTable.isHierarchy != null)"
                 icon="mdi-file-tree"
                 :icon-color="(propsTable.isHierarchy) ? 'blue' : ''"
                 @click="toggleView('toggle-hierarchy')">Иерархический вид</el-btn-icon>
    <el-btn-icon v-if="(propsTable.isMultiline != null)"
                 icon="mdi-view-quilt"
                 :icon-color="(propsTable.isMultiline) ? 'blue' : ''"
                 @click="toggleView('toggle-multiline')">Многострочность</el-btn-icon>
  </div>
</template>

<script>
import { DataTableControlViews } from './DataTableControlViews.js';
export default {
  name: 'DataTableControlViews',
  mixins: [
    DataTableControlViews,
  ],
}
</script>

<style lang="scss" scoped>

</style>