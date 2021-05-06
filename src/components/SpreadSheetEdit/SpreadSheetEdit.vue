<template>
  <div class="spread-sheet-edit"
       tabindex="0"
       @focus="focusSpreadSheetEdit">
    <spread-sheet-edit-field-wrapper ref="SpreadSheetEditWrapper"
                                     :cell-type="cellType"
                                     v-model="value"
                                     @event-keydown-enter="editingAccept"
                                     @event-blur="editBlur"></spread-sheet-edit-field-wrapper>
  </div>
</template>

<script>
// import FieldWrapper from '@/components/Fields/FieldWrapper.vue';
import SpreadSheetEditFieldWrapper from './SpreadSheetEditFieldWrapper.vue';

export default {
  name: 'SpreadSheetEdit',
  components: {
    // FieldWrapper,
    SpreadSheetEditFieldWrapper,
  },
  props: {
    cellName: { type: String, defaul: '' },
    cellType: { type: String, default: 'string' },
    cellValue: { type: [String, Number, Date, Object] },
    isCellNameShow: { type: Boolean, default: false },
  },
  data() {
    return {
      value: this.cellValue,
    };
  },
  methods: {
    editingAccept(option) {
      console.log(option);
      this.$emit('editing-accept', { ...option, cellName: this.cellName });
    },
    focusSpreadSheetEdit() {
      setTimeout(() => {
        this.$refs.SpreadSheetEditWrapper.$el.querySelector('.v-text-field__slot input').focus();
      }, 80);
    },
    editBlur(option) {
      this.$emit('edit-blur', { ...option, cellName: this.cellName });
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.spread-sheet-edit {
  position: absolute;
  left: 0px;
  top: 0px;
  // display: flex;
  // align-items: center;
  width: 0px;
  height: 0px;
  padding: 0px 2px;
  border: 2px solid #1a73e8;
  border-color: #1a73e8;
  box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
  background-color: white;
  font-size: 16px;
  color: grey;
  z-index: 200;
  overflow: hidden;
}
</style>
