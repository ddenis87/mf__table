<template>
  <div class="editing"
       :style="position">
    <div class="label" v-if="isLabel">{{ cellName }}</div>
    <!-- <field-wrapper ref="wrapper"
                   :field-type="fieldType"
                   v-model="fieldValue"
                   @keydown:control="evtKeydownControl"
                   @blur:wrapper="editAccept"></field-wrapper> -->
  </div>
</template>

<script>
// import FieldWrapper from './FieldWrapper.vue';

export default {
  name: 'SpreadSheetEditing',
  // components: { FieldWrapper },
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
    // Отображает имя редактируемой ячейки
    isLabel: { type: Boolean, defalut: false },
    // Смещение компонента от левого края
    shiftLeft: { type: Number, default: 0 },
    // Смещение компонента от верхнего края
    shiftTop: { type: Number, default: 0 },
  },
  computed: {
    position() {
      return {
        top: `${this.cellGeometry.top + this.shiftTop}px`,
        left: `${this.cellGeometry.left + this.shiftLeft}px`,
        width: `${this.cellGeometry.width}px`,
        height: `${this.cellGeometry.height}px`,
      };
    },
  },
  methods: {
    editAccept() {},
    evtKeydownControl() {},
  },
};
</script>
