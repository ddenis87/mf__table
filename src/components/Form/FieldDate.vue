<template>
  <div class="field">
    <v-text-field class="field-item date"
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
      <field-button no-tooltip
                    icon="mdi-calendar-range"
                    @keydown="evtOpenDialog"
                    @click="evtOpenDialog"></field-button>
    </template>
    </v-text-field>
    <v-menu class="el-field-date__dialog"
            v-bind="dialogProps"
            v-model="isDialogShow"
            @input="evtClickOutside">
      <div :class="`el-field-date__date-time`">
        <div class="date">
          <v-date-picker v-model="fieldValueDate"
                        locale="ru"
                        first-day-of-week="1"
                        no-title
                        scrollable
                        show-adjacent-months
                        @input="evtSelectDate"></v-date-picker>
        </div>
        <div class="control">
          <el-btn is-orientation="left" @click="evtClickToday">Сегодня</el-btn>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import fieldModel from './FieldModel';
import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

import FieldButton from './FieldButton.vue';

export default {
  name: 'FieldDate',
  components: {
    FieldButton,
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
  methods: {
    evtSelectDate() {},
    evtClickToday() {},
    evtClickOutside() {},
    evtOpenDialog() {},
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydown(evt) { this.$emit('keydown:key', evt); },
    evtKeydownControl(evt) { this.$emit('keydown:control', evt); },
    evtFocus() {},
    evtBlur(evt) {
      this.$emit('blur:input', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Field.scss';

::v-deep {
  .v-input__slot {
    padding: 0px !important;
  }
}
</style>
