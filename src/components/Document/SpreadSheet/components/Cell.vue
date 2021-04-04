<template>
  <td class="cell"
      :style="cellStyle"
      :colspan="cellProperties.colspan"
      :rowspan="cellProperties.rowspan">
    {{ cellProperties.value }}
  </td>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    cellProperties: { type: Object, default: () => ({ style: {}, value: '' }) },
    cellStyle: { type: Array },

    // collspan: { type: Number, default: 0 }, //  ???
    // rowspan: { type: Number, default: 0 }, //  ???

    // fontFamily: { type: String, default: '' },
    // fontSize: { type: String, default: '' },
    // fontWeight: { type: String, default: '' }, //  normal, lighter, bold, bolder
    // fontStyle: { type: String, default: '' }, //  normal, italic, oblique
    // textDecoration: { type: String, default: '' }, // underline, overline, line-through
    // textTransform: { type: String, default: '' }, // uppercase, lowercase, capitalize
    // color: { type: String, default: '' },
    // textAlign: { type: String, default: '' },
    // verticalAlign: { type: String, default: '' },
    // // justifyContent: { type: String, default: '' },
    // // alignItems: { type: String, default: '' },

    // borderBottom: { type: String, default: '' },
    // borderLeft: { type: String, default: '' },

    backgroundColor: { type: String, default: '' },

  },
  computed: {
    // cellStyle() {
    //   return {
    //     'background-color': this.backgroundColor,
    //   };
    // },
  },
};
</script>

<style lang="scss" scoped>

</style>
