<template>
  <div class="data-table-control-view">
    <el-btn-icon :icon="(this.typeHeight[typeHeightNumber] == 'fixed') ? 'mdi-view-sequential' : (this.typeHeight[typeHeightNumber] == 'dense') ? 'mdi-view-sequential-outline' : 'mdi-view-agenda'" 
                 @click="toggleView('toggle-type-row')">{{ (typeHeight[typeHeightNumber] == 'fixed') ? 'Строки сжато' : (typeHeight[typeHeightNumber] == 'dense') ? 'Строки свободно' : 'Строки фиксировано' }}</el-btn-icon>
    <el-btn-icon icon="mdi-view-split-horizontal"
                 :icon-color="(propsTable.isExpansion) ? 'blue' : ''"
                 :disabled="(propsTable.isMultiline)"
                 @click="toggleView('toggle-expansion')">Раскрытие строк</el-btn-icon>
    <el-btn-icon :icon="(typeColumn == 'fixed') ? 'mdi-view-parallel-outline' : 'mdi-view-parallel'" 
                 @click="toggleView('toggle-type-column')">{{ (typeColumn == 'fixed') ? 'Столбцы сжато' : 'Столбцы фиксировано' }}</el-btn-icon>
    <el-btn-icon icon="mdi-page-layout-footer"
                 :icon-color="(propsTable.isFooter) ? 'blue' : ''"
                 @click="toggleView('toggle-footer')">Итоги</el-btn-icon>
    <el-btn-icon icon="mdi-file-tree"
                 :icon-color="(propsTable.isHierarchy) ? 'blue' : ''"
                 @click="toggleView('toggle-hierarchy')">Иерархический вид</el-btn-icon>
    <el-btn-icon icon="mdi-view-quilt"
                 :icon-color="(propsTable.isMultiline) ? 'blue' : ''"
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
    // isFooter: { type: Boolean, default: false },
    // isExpansion: { type: Boolean, default: false },
    // isMultiline: { type: Boolean, default: false },
    // isHierarchy: { type: Boolean, default: false },
  },
  data() {
    return {
      typeHeight: ['fixed', 'dense', 'auto'],
    }
  },
  computed: {
    propsTable() {
      if (!this.guid) return {};
      console.log(this.$store.getters['DataTable/GET_PROPS_TABLE']({
        tableName: this.tableName,
        guid: this.guid,
      }));
      return this.$store.getters['DataTable/GET_PROPS_TABLE']({
        tableName: this.tableName,
        guid: this.guid,
      });
    },
  },
  methods: {
    toggleView(option) {
      this.$emit('toggle-view', option);
    }
  },
}
</script>