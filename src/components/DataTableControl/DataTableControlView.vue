<template>
  <div class="data-table-control-view">
    <el-btn-icon :icon="(this.typeHeight[typeHeightNumber] == 'fixed') ? 'mdi-view-sequential' : (this.typeHeight[typeHeightNumber] == 'dense') ? 'mdi-view-sequential-outline' : 'mdi-view-agenda'" 
                    @click="toggleView('toggle-type-row')">{{ (typeHeight[typeHeightNumber] == 'fixed') ? 'Строки сжато' : (typeHeight[typeHeightNumber] == 'dense') ? 'Строки свободно' : 'Строки фиксировано' }}</el-btn-icon>
    <el-btn-icon icon="mdi-view-split-horizontal"
                    :icon-color="(isExpansion) ? 'blue' : ''"
                    :disabled="(isMountTable )"
                    @click="toggleView('toggle-expansion')">Раскрытие строк</el-btn-icon>
    <el-btn-icon :icon="(typeColumn == 'fixed') ? 'mdi-view-parallel-outline' : 'mdi-view-parallel'" 
                    @click="toggleView('toggle-type-column')">{{ (typeColumn == 'fixed') ? 'Столбцы сжато' : 'Столбцы фиксировано' }}</el-btn-icon>
    <el-btn-icon icon="mdi-page-layout-footer"
                    :icon-color="(isFooter) ? 'blue' : ''"
                    @click="toggleView('toggle-footer')">Итоги</el-btn-icon>
    <el-btn-icon icon="mdi-view-quilt"
                    :icon-color="(isMultiline) ? 'blue' : ''"
                    @click="toggleView('toggle-multiline')">Многострочность</el-btn-icon>
  </div>
</template>

<script>
import { DataTableControl } from './DataTableControl.js';

export default {
  name: 'DataTableControlView',
  mixins: [
    DataTableControl,
  ],
  props: {
    typeHeightNumber: { type: Number, default: 0 },
    typeColumn: { type: String, default: 'fixed' },
    isFooter: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
  },
  data() {
    return {
      typeHeight: ['fixed', 'dense', 'auto'],
    }
  },
  methods: {
    toggleView(option) {
      this.$emit('toggle-view', option);
    }
  },
}
</script>