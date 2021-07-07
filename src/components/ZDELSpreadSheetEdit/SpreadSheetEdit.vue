<template>
  <div v-show="editableCellElement"
       class="spread-sheet-edit"
       :style="blockPosition"
       tabindex="0"
       @focus="focusSpreadSheetEdit">
    <div class="label" v-if="isEditableCellLabel">{{ cellName.toUpperCase() }}</div>
    <div class="input">
      <spread-sheet-edit-field-wrapper ref="SpreadSheetEditWrapper"
                                       :cell-type="cellType"
                                       v-model="value"
                                       @event-keydown-enter="evtEditAccept"
                                       @event-keydown-escape="evtEditCancel"
                                       @event-keydown-tab="evtEditAccept"
                                       @event-blur="evtEditAccept"></spread-sheet-edit-field-wrapper>
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
    editableCell: { type: Object, default() {} },
    editableCellEvent: { type: Event, default: null },
    editableCellElement: { type: HTMLDivElement, default: null },
    isEditableCellLabel: { type: Boolean, default: false },
  },
  data() {
    return {
      value: this.editableCell?.value,
    };
  },
  computed: {
    blockPosition() {
      if (!this.editableCellElement) return {};
      const geometry = this.editableCellElement.getBoundingClientRect();
      return {
        width: `${geometry.width + 1}px`,
        height: `${geometry.height + 1}px`,
        left: `${geometry.left}px`,
        top: `${geometry.top - 124}px`,
      };
    },
    cellName() {
      if (!this.editableCellElement) return '';
      return this.editableCellElement.getAttribute('data-name');
    },
    cellType() {
      return this.editableCell?.type || 'string';
    },
  },
  watch: {
    editableCell() {
      if (this.editableCellEvent && this.editableCellEvent.type === 'keydown') {
        console.log(this.editableCellEvent.code);
        if (this.editableCellEvent.code === 'Delete') this.value = '';
        if (this.editableCellEvent.code.includes('Key')
          || (this.editableCellEvent.code.includes('Numpad') && !this.editableCellEvent.code.includes('NumpadEnter'))
          || this.editableCellEvent.code.includes('Digit')) {
          this.value = this.editableCellEvent.key;
        }
        if (this.editableCellEvent.code === 'Enter') this.value = this.editableCell?.value || '';
      } else {
        this.value = this.editableCell?.value || '';
      }
    },
  },
  methods: {
    evtEditAccept(option) {
      this.$emit('editing:accept', { ...option, cellName: this.cellName });
    },
    evtEditCancel(option) {
      this.$emit('editing:cancel', option);
    },
    async focusSpreadSheetEdit() {
      await this.$nextTick().then(() => {
        setTimeout(() => {
          this.$refs.SpreadSheetEditWrapper.$el.querySelector('.v-text-field__slot input').focus();
        }, 100);
      });
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
  .label {
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
