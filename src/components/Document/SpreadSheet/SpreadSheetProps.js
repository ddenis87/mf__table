export default {
  props: {
    countColumn: { type: Number, default: 25 },
    countRow: { type: Number, default: 100 },

    spreadSheet: {
      type: Object,
      default() {
        return {
          styleDefault: {
            type: Object,
            default() {
              return {
                fontFamily: { type: String, default: 'Arial, Helvetica, sans-serif' },
                fontSize: { type: String, default: '16px' },
              };
            },
          },
        };
      },
    },

    columns: {
      type: Array,
      default() {
        return [
          {
            name: String,
            width: Number,
          },
        ];
      },
    },

    rows: {
      type: Array,
      default() {
        return {
          name: String,
          height: Number,
        };
      },
    },

    cells: { // ячейки
      type: Array,
      default() {
        return [
          {
            name: String,
            value: { type: [String, Number, Boolean, Array, Object, Date, Function], default: '' },
            spanColRow: { type: [Number, Array], default: 1 },
            style: { type: String, default: '' },
            protected: { type: Boolean, default: false },
          },
        ];
      },
    },

    styles: { // стили
      type: Array,
      default() {
        return {
          name: String,
          list: {
            type: Object,
            default() {
              return {
                fontFamily: { type: String, default: '' },
                fontSize: { type: String, default: '' },
                fontWeight: { type: String, default: '' }, //  normal, lighter, bold, bolder
                fontStyle: { type: String, default: '' }, //  normal, italic, oblique
                textDecoration: { type: String, default: '' }, // underline, overline, line-through
                textTransform: { type: String, default: '' },
                color: { type: String, default: '' },

                textAlign: { type: String, default: '' },
                verticalAlign: { type: String, default: '' },

                backgroundColor: { type: String, default: '' },

                borderTop: { type: String, default: '' },
                borderRight: { type: String, default: '' },
                borderBottom: { type: String, default: '' },
                borderLeft: { type: String, default: '' },
              };
            },
          },
        };
      },
    },
  },
};
