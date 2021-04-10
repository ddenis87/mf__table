<template>
  <td class="cell"
      :style="style"
      :colspan="cellProperties.colspan"
      :rowspan="cellProperties.rowspan">
    {{ cellProperties.value }}
  </td>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    cellProperties: {
      type: Object,
      default() {
        return {
          value: { type: [String, Number, Boolean, Array, Object, Date, Function], default: '' },
          colspan: { type: Number, default: 1 },
          rowspan: { type: Number, default: 1 },
        };
      },
    },

    fontFamily: { type: String, default: '' },
    fontSize: { type: String, default: '' },
    fontWeight: { type: String, default: '' }, //  normal, lighter, bold, bolder
    fontStyle: { type: String, default: '' }, //  normal, italic, oblique
    textDecoration: { type: String, default: '' }, // underline, overline, line-through
    textTransform: { type: String, default: '' },
    color: { type: String, default: '' },

    textAlign: { type: String, default: '' },
    verticalAlign: { type: String, default: '' },

    borderTop: { type: String, default: '' },
    borderRight: { type: String, default: '' },
    borderBottom: { type: String, default: '' },
    borderLeft: { type: String, default: '' },
    backgroundColor: { type: String, default: '' },
  },
  computed: {
    style() {
      return {
        'font-family': this.fontFamily,
        'font-size': this.fontSize,
        'font-weight': this.fontWeight,
        'font-style': this.fontStyle,
        'text-decoration': this.textDecoration,
        'text-transform': this.textTransform,
        color: this.color,

        'text-align': this.textAlign,
        'vertical-align': this.verticalAlign,

        'border-top': this.borderTop,
        'border-right': this.borderRight,
        'border-bottom': this.borderBottom,
        'border-left': this.borderLeft,
        'background-color': this.backgroundColor,
      };
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
