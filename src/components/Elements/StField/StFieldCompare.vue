<template>
  <div class="el-field">
    <v-autocomplete class="el-field__item"

                    placeholder="Выбрать"
                    no-data-text="Значение отсутствует"
                    background-color="rgba(242, 242, 242, 1)"
                    rounded
                    :disable-lookup="true"
                    :dense="isDense"
                    :single-line="isSingleLine"
                    :label="fieldLabel"
                    :items="fieldList"
                    :item-text="'display_name'"
                    :item-value="'value'"
                    v-model="fieldValue"
                    v-if="fieldList"
                    @click.stop
                    @input="emitInputValue"
                    @keydown.enter="eventKeydownEnter"
                    @keydown.stop
                    @focus="eventFocus"></v-autocomplete>
  </div>
  
</template>

<script>

export default {
  name: 'ElFieldChoiceCompare',
  model: {
    prop: 'inputValue',
    event: 'input-value'
  },
  props: {
    isDense: { type: Boolean, default: true, },
    isSingleLine: { type: Boolean, default: true, },  // show or hide label
    isLabel: { type: Boolean, default: false, },  // hidden or show label
    inputProperties: {
      type: Object,
      default() {
        return {
          label: '',
          type: null,
        }
      }
    },
    inputValue: null,
  },
  data() {
    return {
      rEqually: {value: 'equally', display_name: 'Равно'},
      // rMore: {value: 'more', display_name: 'Больше'},
      rMoreOrEqually: {value: 'moreOrEqually', display_name: 'Больше или равно'},
      // rLess: {value: 'less', display_name: 'Меньше '},
      rLessOrEqually: {value: 'lessOrEqually', display_name: 'Меньше или равно'},
      rInList: {value: 'inList', display_name: 'В списке'},
      rContains: {value: 'contains', display_name: 'Содержит'},
      rBetween: {value: 'between', display_name: 'Диапазон'},
      fieldValue: null,
      isChange: false,
    }
    
  },
  computed: {
    fieldLabel() { if (this.isLabel) return this.inputProperties.label; return; },
    fieldList() {
      return (this.inputProperties) ? this.fieldListMap(this.inputProperties.type) : [];
    },
  },
  watch: {
    inputValue() { this.fieldValue = this.inputValue; }, 
  },
  mounted() {
    if (this.inputProperties.type == 'string') {
      this.fieldValue ='contains';
    } else {
      this.fieldValue ='equally';
    }
    this.$emit('input-value', this.fieldValue);
  },
  methods: {
    fieldListMap(type) {
      switch(type) {
        case 'integer': return [this.rEqually, this.rContains, this.rMoreOrEqually, this.rLessOrEqually, this.rBetween];
        case 'string': return [this.rEqually, this.rContains];
        case 'choice': return [this.rEqually, this.rInList];
        case 'date': return [this.rEqually, this.rMoreOrEqually, this.rLessOrEqually, this.rBetween];
        case 'datetime': return [this.rEqually, this.rMoreOrEqually, this.rLessOrEqually, this.rBetween];
        case 'field': return [this.rEqually, this.rInList];

        case 'boolean': { this.$emit('input-value', 'equally'); }
      }
    },
    eventKeydownEnter(event) {
      // console.log(this.fieldValue);
      // setTimeout(() => {
      //   if (this.fieldValue != 'inList') this.$emit('next-element', {event: event});
      // }, 10);
      // if (!this.isChange) 
        this.$emit('next-element', {event: event});
    },
    emitInputValue() { this.$emit('input-value', this.fieldValue); }, // for form, emit only value
    eventFocus(event) {
      let fieldElement = event.target;
      fieldElement.setSelectionRange(0, 0);
    },
  },
}
</script>

<style lang="scss" scoped>
.v-input {
  text-align: center;
  font-size: 14px;
  z-index: 999;
}
.v-text-field {
  margin-top: -3.5px;
   input {
    padding: 0px;
  }
}
::v-deep {
  .v-input__append-inner {
    margin-top: 0px !important;
    cursor: pointer;
  }
  .v-input__append-outer {
    margin-top: -0px;
  }
}
</style>