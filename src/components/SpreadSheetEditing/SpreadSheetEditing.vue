<template>
  <div></div>
</template>

<script>
export default {
  name: 'SpreadSheetEditing',
  props: {
    // Объект содержащий сведения о редактируемой ячейки
    cell: {
      type: Object,
      default() {
        return {
          value: null,
          type: 'string',
        };
      },
    },
    // Объект содержащий сведения о расположении и размерах редактируемой ячейки
    cellGeometry: {
      type: Object,
      default() {
        return {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        };
      },
    },
    // Смещение компонента от левого края
    shiftLeft: { type: Number, default: 0 },
    // Смещение компонента от верхнего края
    shiftTop: { type: Number, default: 0 },
  },
  computed: {
    stylePosition() {
      return {
        top: `${this.cellGeometry.top + this.shiftTop}px`,
        left: `${this.cellGeometry.left + this.shiftLeft}px`,
        width: `${this.cellGeometry.width}px`,
        height: `${this.cellGeometry.height}px`,
      };
    },
  },
};
</script>
