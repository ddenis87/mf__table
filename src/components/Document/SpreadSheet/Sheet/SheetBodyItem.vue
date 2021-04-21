<template>
  <div>{{ source.value }}</div>
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
