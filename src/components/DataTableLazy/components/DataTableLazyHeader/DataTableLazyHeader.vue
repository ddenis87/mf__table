<template>
  <div class="header">
    <div class="header-row" 
         :style="template">
      <!-- <div class="header-column p-pp"></div> -->
      <div v-for="(item, index) in items"
           class="header-column"
           :key="`header-${index}`"
           :style="item.position_in_template"
           :data-key="item.key">
        {{ item.text }}
      </div>
      <!-- <div class="header-column p-clear" v-if="isClearable"></div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTableLazyHeader',
  props: {
    items: Array,
    template: Object,
    isClearable: { type: Boolean, default: false },
  }
}
</script>

<style lang="scss" scoped>
@import './DataTableLazyHeader.scss';
.header {
  &-row {
    display: grid;
    grid-template-rows: 32px;
    align-items: center;
    border-bottom: $rowBorder;
    background-color: white;
    
    font-size: $fontSize;
    font-weight: $fontWeight;
    color: $fontColor;
    .header-column {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      padding: 3px 10px;
      // border-right: $rowBorder;
      &:last-child { border-right: 0px; }
    }
    .p-pp { grid-area: p-pp; }
    .p-clear { grid-area: p-clear; }
  }
}
</style>