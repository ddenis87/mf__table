<template>
  <div class="el-field el-field-choice"
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <div class="el-field__anchor" tabindex="-1"></div>
    <v-autocomplete class="el-field__item"
                    v-bind="propsField"
                    :items="fieldItems"
                    :loading="(inUse == null && inputProperties.required && (fieldValue == null || fieldValue == ''))"
                    :item-text="'display_name'"
                    :item-value="'value'"
                    v-model="fieldValue"
                    @click.stop
                    @change="changeValue"
                    @keydown.stop.enter="eventKeydown"
                    @keydown.stop.tab="eventKeydown"
                    @keydown.stop.escape="eventKeydown"
                    @keydown.stop
                    @blur="blurField">
        <template v-slot:progress>
          <div v-if="(inUse == null && inputProperties.required && (fieldValue == null || fieldValue == ''))" class="el-field__item_required"></div>
        </template>
      </v-autocomplete>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
import { ElFieldProps } from './ElFieldProps.js';
export default {
  name: 'ElFieldChoice',
  mixins: [
    ElField,
    ElFieldProps,
  ],
  data() {
    return {
      isChange: false,
    }
  },
  methods: {
    changeValue() {
      this.isChange = true;
      this.emitInputValue();
    },
    
    eventKeydown(event) {
      if (this.inUse == 'table') { event.preventDefault(); }
      // console.log(this.fieldValue);
      if (this.fieldValue) {
        this.isEmit = false;
        setTimeout(() => { this.emitKeydown(event);  }, 100);
        let newEvent = new Event('click');
        // console.log('element');
        event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
        return;
      }
      if (this.checkRequiredField(event)) return;
      this.isEmit = false;
      let newEvent = new Event('click');
      event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
      
      setTimeout(() => {
        if (this.isChange == true) {
          this.isChange = false;
          event.target.focus();
        } else {
          this.emitInputValue();
          this.emitKeydown(event); // this.$emit('event-keydown', {event: event, value: this.fieldValue});
          
        }
      }, 100);
    },

    // blurInput(event) {

    // },
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
</style>