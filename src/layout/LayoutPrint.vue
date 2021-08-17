<template>
  <div class="layout-print">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'LayoutPrint',
};
</script>

<style lang="scss" scoped>
.layout-print {
  display: contents;
  width: auto;
  border: thin solid red;
  padding: 10px;
}
</style>
