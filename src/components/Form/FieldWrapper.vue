<template>
  <div class="field-wrapper">
    <component :is="field"
               v-model="fieldValue"
               v-bind="fieldProps"
               @keydown:control="evtKeydownControl"
               @blur:input="evtBlur"></component>
  </div>
</template>

<script>
import FieldText from './FieldText.vue';
import FieldNumber from './FieldNumber.vue';
import FieldDate from './FieldDate.vue';

export default {
  name: 'InputFieldWrapper',
  model: {
    prop: 'fieldValueInput',
    event: 'input',
  },
  components: {
    FieldText,
    FieldNumber,
    FieldDate,
  },
  props: {
    fieldType: { type: String, default: 'string' },
    fieldValueInput: { type: [String, Number, Date, Object], default: null },
    isRequired: { type: Boolean, default: false },
  },
  data() {
    return {
      fieldValue: '',
      fields: {
        string: FieldText,
        number: FieldNumber,
        date: FieldDate,
      },
    };
  },
  computed: {
    field() {
      return this.fields[this.fieldType];
    },
    fieldProps() {
      return {
        isFlat: true,
        isSolo: true,
      };
    },
  },
  watch: {
    fieldValueInput() {
      console.log(this.fieldValueInput);
      this.$nextTick().then(() => {
        this.fieldValue = this.fieldValueInput;
      });
    },
  },
  methods: {
    clearComponent() {
      this.fieldValue = null;
    },
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydownControl(evt) {
      this.evtInput();
      this.$emit('keydown:control', evt);
      this.clearComponent();
    },
    evtBlur() {
      this.evtInput();
      this.$emit('blur:wrapper');
      this.clearComponent();
    },
  },
};
</script>

<style lang="scss" scoped>
.field-wrapper {
  display: flex;
  align-items: center;
  padding: 0 3px;
  width: 100%;
  min-width: 80px;
  height: 100%;
  min-height: 22px;
  max-height: 22px;
  font-size: 10pt;
  overflow: hidden;
  // padding-bottom: 10px;
  // border: thin solid black;
}
</style>
