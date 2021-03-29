<template>
  <div class="el-field">
    <div class="el-field__anchor" tabindex="-1"></div>
    <v-autocomplete class="el-field__item"
                    v-bind="propsField"
                    :items="fieldItems"
                    :item-text="'display_name'"
                    :item-value="'value'"
                    v-model="fieldValue"
                    @click.stop
                    @change="changeValue"
                    @keydown.stop.enter="eventKeydownEnter"
                    
                    @blur="blurInput"
                    ></v-autocomplete>
  </div>
</template>

<script>
import { ElField } from './ElFields.js';
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
      isKey: '',
    }
  },
  methods: {
    changeValue() {
      console.log('change');
      this.isChange = true;
    },
    
    eventKeydownEnter(event) {
      if (this.checkRequiredField(event)) return;
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

    blurInput(event) {

    },
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
// .el-field {
//   &__anchor {
//     width: 100%;
//     height: 0px;
//     outline: no;
//     // border: thin solid grey;

//   }
// }
</style>