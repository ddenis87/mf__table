<template>
  <div class="table-layout"
       :style="tableLayoutStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TableLayout',
  props: {
    padding: { type: String, default: '0px 0px 0px 0px' },
    borderOff: { type: Boolean, default: false },
    display: { type: String, default: 'block' },
  },
  computed: {
    tableLayoutStyle() {
      const layouteStyle = {
        padding: this.padding,
        display: this.display,
      };
      if (this.borderOff) {
        layouteStyle['box-shadow'] = 'unset';
      }
      return layouteStyle;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-layout {
  width: 100%;
  height: 100%;
  border-radius: 4px;;
  box-shadow: 0 -1px 1px -1px rgba(0,0,0,.3),
              0 2px 1px -1px rgba(0,0,0,.3),
              0 1px 1px 0 rgba(0,0,0,.24),
              0 1px 3px 0 rgba(0,0,0,.22);
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}
</style>
