export const Cell = {
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
}