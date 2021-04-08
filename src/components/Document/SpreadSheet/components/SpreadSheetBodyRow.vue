<template>
  <tr class="body-row"
      :style="rowStyle">
    <slot></slot>
  </tr>
</template>

<script>

export default {
  name: 'SpreadSheetBodyRow',
  components: {
  },
  props: {
    rowNumber: { type: Number, require: true },
    rowStyle: { type: Object, default() { return {}; } },
  },
  data() {
    return {
      isGroup: false,
    };
  },
};
</script>
