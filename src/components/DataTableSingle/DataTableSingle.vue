<template>
  <div class="data-table-single">
    <div class="data-table__header">
      <data-table-single-header 
                          :template="dataTableTemplate"

                          :items="headers"></data-table-single-header>
    </div>
    <div class="data-table__body">
      <data-table-single-body 
                       :template="dataTableTemplate"

                       :items="items"
                       :items-header="headers"></data-table-single-body>
    </div>
  </div>
</template>

<script>
import DataTableSingleHeader from './DataTableSingleHeader.vue';
import DataTableSingleBody from './DataTableSingleBody.vue';

import { DataTableSingleTemplate } from './DataTableSingleTemplate.js';
export default {
  name: 'DataTableSingle',
  mixins: [
    DataTableSingleTemplate,
  ],
  components: {
    DataTableSingleHeader,
    DataTableSingleBody,
  },
  props: {
    headers: Array,
    items: Array,
  },
}
</script>

<style lang="scss" scoped>
@import './DataTableSingle.scss';

.data-table-single {
  position: relative;
  height: 100%;
  
  font-family: $dtFontFamily;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: auto;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }

  &__block {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .12);
    z-index: 999;
  }

  &__header {
    position: sticky;
    top: 0px;
    display: flex;
    min-height: 5px;
    z-index: 300;
  }
  &__boot-anchor-previous {
    // height: 5px;
    width: 5px;
  }
  &__body-group {
    position: relative;
    display: flex;
    z-index: 150;
  }
  &__body {
    position: relative;
    display: flex;
    z-index: 100;
  }
  &__boot-anchor {
    height: 5px;
    width: 5px;
  }
  &__footer {
    position: sticky;
    bottom: 0px;
    left: 0px;
    display: flex;
    z-index: 200;
  }

  &__dialog-modal {
    z-index: 400;
  }
}
</style>