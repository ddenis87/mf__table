<template>
  <div class="field">
    <v-text-field ref="fieldInput"
                  class="field-item date"
                  v-bind="fieldPropsNested"
                  :rules="(isRequired) ? [rules.required] : []"
                  v-model="fieldValue"
                  v-mask="fieldMask"
                  @input="evtInput"
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
          <btn-dialog @click="evtSelectToday">Сегодня</btn-dialog>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import BtnDialog from '@/components/Form/Btn/BtnDialog.vue';
import BtnField from '@/components/Form/Btn/BtnField.vue';

import formattedDataDisplay from '@/plugins/formattedDataDisplay/formattedDataDisplay';
import fieldModel from './FieldModel';
import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldDate',
  components: {
    BtnField,
    BtnDialog,
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
    fieldValueInput() {
      this.fieldValue = formattedDataDisplay(this.fieldValueInput, { valueType: 'date' }) || null;
      this.fieldValueDate = this.fieldValueInput || null;
    },
  },
  mounted() {
    const element = this.$refs.fieldInput.$el.querySelector('input');
    setTimeout(() => {
      element.select();
      element.focus();
    }, 50);
  },
  methods: {
    evtClickOutside() {
      const evt = new KeyboardEvent('keydown', { code: 'Escape' });
      this.evtKeydownControl(evt);
    },
    evtOpenDialog(evt) {
      if (evt.type === 'keydown' && evt.code !== 'Space') return;
      const elementTarget = this.$refs.fieldInput.$el.getBoundingClientRect();
      this.isDialogX = elementTarget.left;
      this.isDialogY = elementTarget.top + 40;
      this.isDialogShow = !this.isDialogShow;
    },
    evtSelectDate() {
      this.fieldValue = (this.fieldValueDate) ? formattedDataDisplay(this.fieldValueDate, { valueType: 'date' }) : null;
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
