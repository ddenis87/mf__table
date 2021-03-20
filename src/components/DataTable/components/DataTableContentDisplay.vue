<template>
  <div class="content-display"
       :class="`content-display_${typeHeight}`"
       :style="`text-align: ${properties['align']}`">
    {{ displayValue }}
  </div>
</template>

<script>
import { DataTable } from './DataTable.js';

export default {
  name: 'DataTableContentDisplay',
  mixins: [
    DataTable,
  ],
  props: {
    value: null,
    properties: { type: Object, default: () => {} },
    typeHeight: { type: String, default: 'fixed' },
  },
  computed: {
    displayValue() {
      
      return this.gettingValueForType(this.properties, this.value);
    },
  },
}
</script>

<style lang="scss" scoped>
.content-display {
  // position: relative;
  width: 100%;
  // box-sizing: border-box;
  -webkit-user-select: none;
  // user-select: none;
  text-overflow: ellipsis;
  overflow: hidden;

  // &__sort {
  //   position: absolute;
  //   top: -2px;
  //   right: -8px;
  //   z-index: 9999;
  // }

  &_fixed {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  &_dense {
    // display: inline-flex;
    // width: 100%;
    white-space: nowrap;
  }
  &_auto { 
    display: block;
    -webkit-box-orient: unset;
    white-space: unset;
  }
}
</style>