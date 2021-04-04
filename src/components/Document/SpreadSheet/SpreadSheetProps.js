export const SpreadSheetProps = {
  props: {
    columns: { // столбцы
      type: Array,
      default() {
        return {
          name: String,
          style: { type: [String, Array], default: '' },
        };
      },
    },
    columnsStyles: { // стили столбцов
      type: Array,
      default() {
        return {
          name: String,
          value: {
            type: Object,
            default() {
              return {
                minWidth: String,
              };
            },
          },
        };
      },
    },
    cells: { // ячейки
      type: Array,
      default() {
        return {
          name: String,
          spanColRow: { type: [Number, Array], default: 1 },
          value: { type: [String, Number, Boolean, Array, Object, Date, Function], default: '' },
          style: { type: [String, Array], default: '' },
          protected: { type: Boolean, default: false },
        };
      },
    },
    cellsStyles: { // стили ячеек
      type: Array,
      default() {
        return {
          name: { type: String, default: '' },
          value: { type: Object, default() { return { }; } },
        };
      },
    },
  },
}