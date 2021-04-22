<template>
  <div class="sheet-body__row"
       :style="[{
         'grid-template-columns': `
         repeat(${rowLevelGroupMax}, minmax(20px, 20px))
         60px
         repeat(${columns.length}, auto)`,
         'grid-template-rows': `${(row.height) ? row.height : '22'}px`,
       }]">
    <div v-for="level in rowLevelGroupMax"
         :key="`${row.value}-${level}`"
         class="column column-group"
         :style="getStyleGroup(level)">
        <spread-sheet-btn-group v-if="isRowGroupLevel(row, level)">mdi-plus-box-outline</spread-sheet-btn-group>
    </div>
    <div class="column column-title"
          :style="shiftTitle">{{ row.value }}</div>
    <template v-for="(column, columnIndex) in columns">
      <div v-if="!excludedCells.has(`${column.name}${row.value}`)"
            :key="`body-${row.value}-${column.value}`"
            class="column column-body"
            :class="(cells[`${column.name}${row.value}`]) ? cells[`${column.name}${row.value}`].style : ''"
            :style="getCellGeometry(row, rowIndex, column, columnIndex)">
        {{ (cells[`${column.name}${row.value}`]) ? cells[`${column.name}${row.value}`].value : '' }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SheetBodyItem',
  props: {
    source: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
