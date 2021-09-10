<template>
  <div v-show="isShow"
       class="editing"
       :style="position"
       tabindex="0"
       @focus="evtFocusInput">
    <div class="label" v-if="isLabel">{{ cellName }}</div>
    <div class="input">
      <field-wrapper ref="wrapper"
                     :field-type="fieldType"
                     v-model="fieldValue"
                     @keydown:control="evtKeydownControl"
                     @blur:wrapper="editAccept"></field-wrapper>
    </div>
  </div>
</template>

<script>
import FieldWrapper from './FieldWrapper.vue';

export default {
  name: 'SpreadSheetEditing',
  components: { FieldWrapper },
  props: {
    cell: { type: Object, default() { return { value: '' }; } },
    cellType: { type: String, default: 'string' },
    cellElement: { type: HTMLDivElement, default: null },
    editEvent: { type: Event, default: null },
    isLabel: { type: Boolean, default: false },
    shiftTop: { type: Number, default: 0 },
    shiftLeft: { type: Number, default: 0 },
  },
  data() {
    return {
      fieldValue: null,
    };
  },
  computed: {
    position() {
      if (!this.cellElement) return {};
      const geometry = this.cellElement.getBoundingClientRect();
      return {
        width: `${geometry.width + 1}px`,
        height: `${geometry.height + 1}px`,
        left: `${geometry.left + this.shiftLeft}px`,
        top: `${geometry.top + this.shiftTop}px`,
      };
    },
    isShow() {
      return this.cell;
    },
    cellName() {
      return this.cellElement?.getAttribute('data-name').toUpperCase() || '';
    },
    fieldType() {
      return this.cellType;
    },
  },
  watch: {
    cell() {
      console.log(this.cell);
      this.fieldValue = null;
      if (this.editEvent && this.editEvent.type === 'keydown') {
        console.log(this.cell);
        if (this.editEvent.code === 'Delete') this.fieldValue = '';
        if (this.editEvent.code.includes('Key')
          || (this.editEvent.code.includes('Numpad') && !this.editEvent.code.includes('NumpadEnter'))
          || this.editEvent.code.includes('Digit')) {
          this.fieldValue = this.editEvent.key;
        }
        if (this.editEvent.code === 'Enter') this.fieldValue = this.cell?.value || '';
      } else {
        this.fieldValue = this.cell?.value || null;
      }
    },
  },
  methods: {
    editAccept(evt) {
      // console.log(evt);
      const cellValue = this.getCellValue();
      const option = {
        value: cellValue,
        cellName: this.cellName.toLowerCase(),
        evt: {
          code: evt?.code || '',
          target: this.cellElement,
        },
      };
      this.fieldValue = null;
      this.$emit('editing:accept', option);
      this.$refs.wrapper.clearComponent();
    },
    editCancel() {
      this.fieldValue = null;
      this.$emit('editing:cancel');
      this.$refs.wrapper.clearComponent();
    },
    evtKeydownControl(evt) {
      if (evt.code === 'Escape') {
        this.editCancel();
        return;
      }
      if (evt.code.includes('Enter')) {
        this.editAccept({ code: 'Enter' });
        return;
      }
      this.editAccept({});
    },
    async evtFocusInput() {
      await this.$nextTick().then(() => {
        setTimeout(() => {
          this.$refs.wrapper.$refs.field.$refs.fieldInput.focus();
        }, 100);
      });
    },
    getCellValue() {
      console.log(this.fieldValue);
      const valueFromType = {
        string: () => this.fieldValue,
        number: () => +this.fieldValue,
        date: () => this.fieldValue,
        choice: () => this.fieldValue?.value,
        field: () => {
          let result = this.fieldValue;
          if (typeof this.fieldValue === 'object') result = this.fieldValue.id;
          return result;
        },
      };
      const type = this.fieldType.split('.')[0];
      return valueFromType[type]();
    },
  },
};
</script>

<style lang="scss" scoped>
.editing {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 0px;
  height: 0px;
  padding: 0 3px;
  border: 2px solid #1a73e8;
  border-color: #1a73e8;
  box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
  background-color: white;
  font-size: 16px;
  color: grey;
  z-index: 200;
  outline: none;
  .input {
    display: flex;
    justify-content: flex-start;
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
