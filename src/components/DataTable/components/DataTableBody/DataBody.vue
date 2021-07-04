<template>
  <div class="body">

  </div>
</template>

<script>
export default {
  name: 'DataBody',
  props: {
    isEditable: { type: Boolean, default: false },
    isAddingInline: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
    isHierarchyMode: {type: Boolean, default: false},
  },
}
</script>

<style lang="scss" scoped>

</style>