<template>
  <div class="el-field el-field-date"
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <v-text-field class="el-field__item"
                  dense
                  
                  
                  :single-line="isSingleLine"
                  :hide-details="isHideMessage"
                  :disabled="isDisabled"
                  :label="fieldLabel"
                  :clearable="isBtnClear"
                  :solo="isHideUnderline"
                  :flat="isHideUnderline"
                  :rules="(fieldRequired) ? [rules.required] : []"
                  v-model="fieldValue"
                  v-mask="fieldMask"
                  @click:clear="eventClearValue"
                  
                  @input="eventInputValue"
                  @keydown.enter="eventKeyEnter"
                  @keydown.tab="eventKeyTab"
                  @keydown.esc="eventKeyEsc"
                  @keydown.stop
                  @blur.stop="eventBlurField"
                  >
      <template v-slot:append>
        <el-btn-icon-small  icon="mdi-calendar-range" no-tooltip @keydown="eventOpenDialog" @click="eventOpenDialog"></el-btn-icon-small>
      </template>
    </v-text-field>
    <v-menu offset-y
            absolute
            class="el-field-date__dialog"
            :position-x="isDialogX"
            :position-y="isDialogY"
            v-model="isDialogShow"
            :close-on-click="true"
            :close-on-content-click="false" @input="eventClickOutsideMenu">
      <div :class="`el-field-date__date-time`">
        <div class="date">
          <v-date-picker v-model="fieldValueDate"
                        locale="ru"
                        first-day-of-week="1"
                        no-title
                        scrollable 
                        show-adjacent-months
                        @input="eventSelectDate"></v-date-picker>
        </div>
        <div class="control">
          <el-btn is-orientation="left" @click="eventClickToday">Сегодня</el-btn>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
export default {
  name: 'ElFieldDate',
  mixins: [
    ElField,
  ],
  data() {
    return {
      isDialogShow: false,
      isDialogX: 0,
      isDialogY: 0,
      fieldValue: (this.inputValue) ? this.inputValue.split('-').reverse().join('.') : null,
      fieldValueDate: (this.inputValue) ? this.inputValue : null,
      fieldMask: [/[0123]/,/\d/,'.',/[01]/,/\d/,'.',/[2]/,/[0]/,/\d/,/\d/],
      fieldElementDOM: null,
    }
  },
  watch: {
    inputValue() {
      if (this.inputValue == null) {
        this.fieldValue = null;
        this.fieldValueDate = null;
        return;
      }
      this.fieldValue = (this.inputValue) ? this.inputValue.split('-').reverse().join('.') : null;
      this.fieldValueDate = (this.inputValue) ? this.inputValue : null;
    },
  },
  methods: {
    eventOpenDialog(event) {
      if (event.type == 'keydown') {
        if (event.key != 'Space') return;
      }
      this.fieldElementDOM = event.target.closest('.el-field').querySelector('.v-text-field__slot input');
      let elementTarget = event.target.closest('.el-field').getBoundingClientRect();
      this.isDialogX = elementTarget.left;
      this.isDialogY = elementTarget.top + 40;
      this.isDialogShow = !this.isDialogShow;
    },
    eventClickOutsideMenu() { this.emitBlurField(); },

    eventSelectDate(event) {
      let newDate = '';
      if (this.fieldValueDate == null) {
        newDate = new Date();
        newDate = `${newDate.getFullYear()}-` + 
                  `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                  `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      } else {
        newDate = this.fieldValueDate;
      }
      this.isDialogShow = false;
      this.fieldValue = newDate.split('-').reverse().join('.');
      this.emitInputValue(newDate);
      setTimeout(() => {
        this.fieldElementDOM.focus();
      }, 10);
    },
    eventClickToday() {
      let newDate = new Date();
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      this.fieldValueDate = newDate;
      this.isDialogShow = false;
      this.fieldValue = newDate.split('-').reverse().join('.');
      this.emitInputValue(newDate);
      setTimeout(() => {
        this.fieldElementDOM.focus();
      }, 10);
    },
    eventInputValue() {
      if (!this.fieldValue) return;
      if (this.fieldValue.length != 10) return;
      let newDateTime = this.fieldValue.split('.').reverse().join('-');
      if (new Date(newDateTime) == 'Invalid Date') {
        this.fieldValue = '';
        return;
      }
      let newDate = new Date(newDateTime);
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      if (newDate.split('-').reverse().join('.') != this.fieldValue) {
        this.fieldValue = '';
        return;
      }
      this.emitInputValue(newDateTime);
    },
    eventKeyEnter(event) {
      if (this.inputProperties.required && !this.isRequiredOff)
        if (this.fieldValue.length != 10) return;
      if (!this.fieldValue || this.fieldValue.length == 0) {
        let sendOption = {
          key: event.key,
          value: null,
          event: event,
        }
        this.emitInputValue(null);
        this.emitKeyEnter(sendOption);
        this.$emit('next-element', {event: event});
        return;
      }
      let newDateTime = this.fieldValue.split('.').reverse().join('-');
      if (new Date(newDateTime) == 'Invalid Date') {
        this.fieldValue = '';
        return;
      }
      let newDate = new Date(newDateTime);
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      if (newDate.split('-').reverse().join('.') != this.fieldValue) {
        this.fieldValue = '';
        return;
      }
      let sendOption = {
        key: event.key,
        value: newDateTime,
        event: event,
      }
      this.isEmit = true;
      this.isDialogShow = false;
      this.emitInputValue(newDateTime);
      this.emitKeyEnter(sendOption);
      this.$emit('next-element', {event: event});
    },
    
    eventKeyTab(event) {
      if (this.inputProperties.required && !this.isRequiredOff)
        if (this.fieldValue.length != 10) return;
      if (!this.fieldValue || this.fieldValue.length == 0) {
        let sendOption = {
          key: event.key,
          shift: event.shiftKey,
          value: null,
          event: event,
        }
        this.emitInputValue(null);
        this.emitKeyEnter(sendOption);
        return;
      }
      let newDateTime = this.fieldValue.split('.').reverse().join('-');
      if (new Date(newDateTime) == 'Invalid Date') {
        this.fieldValue = '';
        return;
      }
      let newDate = new Date(newDateTime);
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      if (newDate.split('-').reverse().join('.') != this.fieldValue) {
        this.fieldValue = '';
        return;
      }
      let sendOption = {
        key: event.key,
        shift: event.shiftKey,
        value: newDateTime,
        event: event,
      }
      this.isEmit = true;
      this.isDialogShow = false;
      this.emitInputValue(newDateTime);
      this.emitKeyTab(sendOption);
    },


    eventClearValue() {
      this.fieldValue = null;
      this.fieldValueDate = null;
      setTimeout(() => {
        this.fieldValue = null;
        this.fieldValueDate = null;
        this.emitInputValue(null);
        this.emitClearValue();
      },10);
    },

    eventBlurField(event) {
      if (event.relatedTarget)
        if (event.relatedTarget.closest(`.el-field-date__date-time`)) {
          event.preventDefault();
          event.relatedTarget.closest(`.el-field-date__date-time`).focus();
          this.fieldElementDOM = event.target;
          return;
        } else {
          this.emitBlurField({value: this.fieldValue.split('.').reverse().join('-'), key: 'Enter', shift: false, ev: 'blur'});
        }
      if (!this.isEmit) {
        this.isDialogShow = false;
        this.emitKeyEsc();
      }
    },

    // emitInputValue(value) { this.$emit('input-value', value); },
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
.el-field-date {
  &__date-time {
    background-color: white;
    .control {
      padding: 12px 12px;
      padding-top: 0px;

    }
  }
}

</style>