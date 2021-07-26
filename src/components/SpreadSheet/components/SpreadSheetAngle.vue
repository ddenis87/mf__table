<template>
  <div class="angle">123</div>
</template>

<script>
export default {
  name: 'SpreadSheetAngle',
  props: {
    maxColumnGroupingLevel: { type: Number, default: 0 },
    maxRowGroupingLevel: { type: Number, default: 0 },
    isTitle: { type: Boolean, default: true },
  },
};
</script>

<style lang="scss" scoped>
.angle {
}
</style>
