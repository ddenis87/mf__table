<template>
  <div class="spread-sheet-edit"
       tabindex="0"
       @focus="focusSpreadSheetEdit">
    <div class="shild" v-if="isShild">{{ cellName.toUpperCase() }}</div>
    <div class="input">
      <spread-sheet-edit-field-wrapper ref="SpreadSheetEditWrapper"
                                       :cell-type="cellType"
                                       v-model="value"
                                       @event-keydown-enter="editingAccept"
                                       @event-keydown-escape="editBlur"
                                       @event-keydown-tab="editBlur"
                                       @event-blur="editBlur"></spread-sheet-edit-field-wrapper>
    </div>
  </div>
</template>

<script>
import SpreadSheetEditFieldWrapper from './SpreadSheetEditFieldWrapper.vue';

export default {
  name: 'SpreadSheetEdit',
  components: {
    SpreadSheetEditFieldWrapper,
  },
  props: {
    cellName: { type: String, defaul: '' },
    cellType: { type: String, default: 'string' },
    cellValue: { type: [String, Number, Date, Object] },
    isCellNameShow: { type: Boolean, default: false },
    isShild: { type: Boolean, default: false },
  },
  data() {
    return {
      value: this.cellValue,
    };
  },
  methods: {
    editingAccept(option) {
      this.$emit('editing-accept', { ...option, cellName: this.cellName });
    },
    editingCancel() {
      this.$emit('editing-cancel');
    },
    async focusSpreadSheetEdit() {
      await this.$nextTick().then(() => {
        setTimeout(() => {
          this.$refs.SpreadSheetEditWrapper.$el.querySelector('.v-text-field__slot input').focus();
        }, 100);
      });
    },
    editBlur(option) {
      console.log('edit-blur');
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
  width: 0px;
  height: 0px;
  border: 2px solid #1a73e8;
  border-color: #1a73e8;
  box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
  background-color: white;
  font-size: 16px;
  color: grey;
  z-index: 200;
  outline: none;
  .input {
    margin-top: -0px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
  }
  .shild {
    position: absolute;
    display: inline-flex;
    left: -2px;
    top: -21px;
    padding: 2px 5px;
    border-radius: 3px 3px 0px 0px;
    font-size: .65em;
    color: white;
    background-color: #1a73e8;
    z-index: 310;
  }
}
</style>
