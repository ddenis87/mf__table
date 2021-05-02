<template>
  <div class="layout-print">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'LayoutPrint',
};
</script>

<style lang="scss" scoped>
.layout-print {
  // overflow-x: scroll;
  width: 100%;
  padding: 10px;
  // border: thin solid red;
}
</style>
