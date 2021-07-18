<template>
  <div class="field">
    <v-text-field ref="fieldInput"
                  class="field-item datetime"
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
    <div v-if="isRequired" class="required"></div>
    <v-menu class="field-item dialog"
            v-bind="dialogProps"
            v-model="isDialogShow"
            @input="evtClickOutside">
      <div class="dialog-datetime">
        <div class="dialog-datetime__item">
          <v-date-picker v-model="fieldValueDate"
                         locale="ru"
                         first-day-of-week="1"
                         no-title
                         scrollable
                         show-adjacent-months
                         @input="evtSelectDate"></v-date-picker>
        </div>
        <div class="dialog-datetime__control">
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
  name: 'FieldDateTime',
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
      fieldMask: [
        /[0123]/, /\d/, '.',
        /[01]/, /\d/, '.',
        /[2]/, /[0]/, /\d/, /\d/, ' ',
        /[012]/, /\d/, ':', /[012345]/, /\d/,
      ],
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
      this.fieldValue = new Date(this.fieldValueInput).toLocaleString('ru').slice(0, -3).replace(',', '') || null;
      this.fieldValueDate = (new Date(this.fieldValueInput).toString() !== 'Invalid Date') ? this.fieldValueInput?.split('T')[0] : null;
    },
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
      this.fieldValue = (this.fieldValueDate)
        ? `${display.formate(this.fieldValueDate, { valueType: 'date' })} 00:00` : null;
      this.isDialogShow = false;
      this.$refs.fieldInput.focus();
      this.evtInput();
    },
    evtSelectToday() {
      this.fieldValue = new Date().toLocaleString('ru').slice(0, -3).replace(',', '');
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

.dialog-datetime {
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
