<template>
  <div class="field">
    <v-text-field ref="fieldInput"
                  class="field-item date"
                  v-bind="fieldPropsNested"
                  :rules="(isRequired) ? [rules.required] : []"
                  v-model="fieldValue"
                  v-mask="fieldMask"
                  @input="evtInput"
                  @click:clear="evtClickClear"
                  @keydown="evtKeydown"
                  @keydown.enter="evtKeydownControl"
                  @keydown.esc="evtKeydownControl"
                  @keydown.tab="evtKeydownControl"
                  @blur="evtBlur"
                  @focus="evtFocus">
      <template v-slot:append>
        <btn-field no-tooltip
                      icon="mdi-calendar-range"
                      @keydown="evtOpenDialog"
                      @click="evtOpenDialog"></btn-field>
      </template>
    </v-text-field>
    <div v-if="isRequired" class="required"></div>
    <v-menu class="field-item dialog"
            v-bind="dialogProps"
            v-model="isDialogShow"
            @input="evtClickOutside">
      <div class="dialog-date">
        <div class="dialog-date__item">
          <v-date-picker v-model="fieldValueDate"
                         locale="ru"
                         first-day-of-week="1"
                         no-title
                         scrollable
                         show-adjacent-months
                         @input="evtSelectDate"></v-date-picker>
        </div>
        <div class="dialog-date__control">
          <btn-form @click="evtSelectToday">Сегодня</btn-form>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import BtnForm from '@/components/Form/Btn/BtnForm.vue';
import BtnField from '@/components/Form/Btn/BtnField.vue';

// import formattedDataDisplay from '@/plugins/formattedDataDisplay/formattedDataDisplay';
import display from '@/plugins/formattingView/formattingView';
import fieldModel from './FieldModel';
import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldDate',
  components: {
    BtnField,
    BtnForm,
  },
  model: {
    ...fieldModel,
  },
  props: {
    ...fieldProps,
  },
  data() {
    return {
      fieldValue: null,
      fieldValueDate: null,
      fieldMask: [/[0123]/, /\d/, '.', /[01]/, /\d/, '.', /[2]/, /[0]/, /\d/, /\d/],
      isDialogShow: false,
      isDialogX: 0,
      isDialogY: 0,
    };
  },
  computed: {
    ...fieldComputed,
    dialogProps() {
      return {
        'offset-y': true,
        absolute: true,
        'position-x': this.isDialogX,
        'position-y': this.isDialogY,
        'close-on-click': true,
        'close-on-content-click': false,
      };
    },
  },
  watch: {
    fieldValue() {
      // console.log('watch filedValue', this.fieldValue);
      // this.fieldValue = null;
      // this.fieldValueDate = null;
    },

    fieldValueInput() {
      // this.fieldValue = formattedDataDisplay(this.fieldValueInput, { valueType: 'date' }) || null;
      this.fieldValue = display.formate(this.fieldValueInput, { type: 'date' }) || null;
      this.fieldValueDate = (new Date(this.fieldValueInput).toString() !== 'Invalid Date') ? this.fieldValueInput : null;
    },
  },
  mounted() {
    if (!this.isSelected) return;
    const element = this.$refs.fieldInput.$el.querySelector('input');
    setTimeout(() => {
      element.select();
      element.focus();
    }, 50);
  },
  methods: {
    evtClickClear() {
      this.fieldValue = null;
      this.fieldValueDate = null;
      this.evtInput();
    },
    evtClickOutside() {
      const evt = new KeyboardEvent('keydown', { code: 'Escape' });
      this.evtKeydownControl(evt);
    },
    evtOpenDialog(evt) {
      // console.log(this.fieldValueDate);
      if (evt.type === 'keydown' && evt.code !== 'Space') return;
      const elementTarget = this.$refs.fieldInput.$el.getBoundingClientRect();
      this.isDialogX = elementTarget.left;
      this.isDialogY = elementTarget.top + 40;
      this.isDialogShow = !this.isDialogShow;
    },
    evtSelectDate() {
      // this.fieldValue = (this.fieldValueDate)
      //   ? formattedDataDisplay(this.fieldValueDate, { valueType: 'date' }) : null;
      this.fieldValue = (this.fieldValueDate)
        ? display.formate(this.fieldValueDate, { type: 'date' }) : null;
      this.isDialogShow = false;
      this.$refs.fieldInput.focus();
      this.evtInput();
    },
    evtSelectToday() {
      this.fieldValue = new Date().toLocaleString('ru');
      ([this.fieldValueDate] = new Date().toJSON().split('T'));
      this.isDialogShow = false;
      this.$refs.fieldInput.focus();
      this.evtInput();
    },
    evtInput() { this.$emit('input', this.fieldValueDate); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    evtKeydownControl(evt) { this.$emit('keydown:control', evt); },
    evtFocus() {},
    evtBlur(evt) {
      evt.preventDefault();
      if (!this.isDialogShow) this.$emit('blur:input', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Field.scss';

.dialog-date {
  background-color: white;
  &__control {
    padding: 14px 14px;
    padding-top: 0px;
  }
}

::v-deep {
  .v-input__slot {
    padding: 0px !important;
  }
}
</style>
