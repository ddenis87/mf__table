<template>
  <div class="el-field el-field-date-time"
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
                  @blur="eventBlurField"
                  >
      <template v-slot:append>
        <el-btn-icon-small  icon="mdi-calendar-range" no-tooltip @keydown="eventOpenDialog" @click="eventOpenDialog"></el-btn-icon-small>
      </template>
    </v-text-field>
    <v-menu offset-y
            absolute
            class="el-field-date-time__dialog"
            :position-x="isDialogX"
            :position-y="isDialogY"
            v-model="isDialogShow"
            :close-on-click="true"
            :close-on-content-click="false" @input="eventClickOutsideMenu">
      <div :class="`el-field-date-time__date-time`">
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
  name: 'ElFieldDateTime',
  mixins: [
    ElField,
  ],
  data() {
    return {
      isDialogShow: false,
      isDialogX: 0,
      isDialogY: 0,
      fieldValue: (this.inputValue) ? this.inputValue.split('T')[0].split('-').reverse().join('.') + ' ' +
                                      this.inputValue.split('T')[1].slice(0, 5) : null,
      fieldValueDate: (this.inputValue) ? this.inputValue.split('T')[0] : null,
      fieldValueTime: (this.inputValue) ? this.inputValue.split('T')[1].slice(0, 5) : null,
      fieldMask: [/[0123]/,/\d/,'.',/[01]/,/\d/,'.',/[2]/,/[0]/,/\d/,/\d/,' ',/[012]/,/\d/,':',/[012345]/,/\d/],
      fieldMaskTime: [/[012]/,/\d/,':',/[012345]/,/\d/],
      fieldElementDOM: null,
    }
  },
  watch: {
    inputValue() {
      if (this.inputValue == null) {
        this.fieldValue = null;
        this.fieldValueDate = null;
        this.fieldValueTime = null;
        return;
      }
      this.fieldValue = (this.inputValue) ? this.inputValue.split('T')[0].split('-').reverse().join('.') + ' ' +
                                            this.inputValue.split('T')[1].slice(0, 5) : null;
      this.fieldValueDate = (this.inputValue) ? this.inputValue.split('T')[0] : null;
      this.fieldValueTime = (this.inputValue) ? this.inputValue.split('T')[1].slice(0, 5) : null;
    }
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
      let newTime = '';
      if (this.fieldValueTime != null) {
        newTime = (this.fieldValueTime.length != 5) ? '00:00' : this.fieldValueTime;
      } else { newTime = '00:00' }

      let newDate = '';
      if (this.fieldValueDate == null) {
        newDate = new Date();
        newDate = `${newDate.getFullYear()}-` + 
                  `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                  `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      } else {
        newDate = this.fieldValueDate;
      }
      let newDateTime = `${newDate}T${newTime}`;
      this.isDialogShow = false;
      this.fieldValue = newDateTime.split('T')[0].split('-').reverse().join('.') + ' ' +
                                            newDateTime.split('T')[1].slice(0, 5);
      this.emitInputValue(newDateTime);
      setTimeout(() => {
        this.fieldElementDOM.focus();
      }, 10);
    },
    eventClickToday() {
      let newTime = '00:00';
      let newDate = new Date();
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      let newDateTime = `${newDate}T${newTime}`;
      this.fieldValueDate = newDate;
      this.isDialogShow = false;
      this.fieldValue = newDateTime.split('T')[0].split('-').reverse().join('.') + ' ' +
                                            newDateTime.split('T')[1].slice(0, 5);
      this.emitInputValue(newDateTime);
      setTimeout(() => {
        this.fieldElementDOM.focus();
      }, 10);
    },
    eventInputValue() {
      if (!this.fieldValue) return;
      if (this.fieldValue.length != 16) return;
      let newDateTime = this.fieldValue.split(' ')[0].split('.').reverse().join('-') + 'T' + this.fieldValue.split(' ')[1];
      if (new Date(newDateTime) == 'Invalid Date') {
        this.fieldValue = '';
        return;
      }
      let newDate = new Date(newDateTime);
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      if (newDate.split('-').reverse().join('.') != this.fieldValue.split(' ')[0]) {
        this.fieldValue = '';
        return;
      }
      this.emitInputValue(newDateTime);
    },
    eventKeyEnter(event) {
      if (this.inputProperties.required && !this.isRequiredOff)
        if (this.fieldValue.length != 16) return;
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
      let newDateTime = this.fieldValue.split(' ')[0].split('.').reverse().join('-') + 'T' + this.fieldValue.split(' ')[1];
      if (new Date(newDateTime) == 'Invalid Date') {
        this.fieldValue = '';
        return;
      }
      let newDate = new Date(newDateTime);
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      if (newDate.split('-').reverse().join('.') != this.fieldValue.split(' ')[0]) {
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
        if (this.fieldValue.length != 16) return;
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
      let newDateTime = this.fieldValue.split(' ')[0].split('.').reverse().join('-') + 'T' + this.fieldValue.split(' ')[1];
      if (new Date(newDateTime) == 'Invalid Date') {
        this.fieldValue = '';
        return;
      }
      let newDate = new Date(newDateTime);
      newDate = `${newDate.getFullYear()}-` + 
                `${(+newDate.getMonth() < 9) ? '0' + (+newDate.getMonth() + 1) : +newDate.getMonth() + 1}-` + 
                `${(+newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}`;
      if (newDate.split('-').reverse().join('.') != this.fieldValue.split(' ')[0]) {
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
      this.fieldValueTime = null;
      setTimeout(() => {
        this.fieldValue = null;
        this.fieldValueDate = null;
        this.fieldValueTime = null;
        this.emitInputValue(null);
        this.emitClearValue();
      },10);
    },

    eventBlurField(event) {
      if (event.relatedTarget)
        if (event.relatedTarget.closest(`.el-field-date-time__date-time`)) { 
          event.relatedTarget.closest(`.el-field-date-time__date-time`).focus();
          this.fieldElementDOM = event.target;
          return;
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
.el-field-date-time {
  &__date-time {
    background-color: white;
    .control {
      padding: 12px 12px;
      padding-top: 0px;

    }
  }
}
</style>