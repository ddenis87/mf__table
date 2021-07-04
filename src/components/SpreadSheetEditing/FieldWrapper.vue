<template>
  <div class="field-wrapper">
    <component :is="field"
               ref="field"
               v-model="fieldValue"
               v-bind="fieldProps"
               @keydown:control="evtKeydownControl"
               @blur:input="evtBlur"></component>
  </div>
</template>

<script>
import FieldText from '@/components/Form/Field/FieldText.vue';
import FieldNumber from '@/components/Form/Field/FieldNumber.vue';
import FieldChoice from '@/components/Form/Field/FieldChoice.vue';
import FieldDate from '@/components/Form/Field/FieldDate.vue';
import FieldDialog from '@/components/Form/Field/FieldDialog.vue';

export default {
  name: 'InputFieldWrapper',
  components: {
    FieldText,
    FieldNumber,
    FieldChoice,
    FieldDate,
    FieldDialog,
  },
  model: {
    prop: 'fieldValueInput',
    event: 'input',
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
        choice: FieldChoice,
        date: FieldDate,
        field: FieldDialog,
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
        isSingleLine: true,
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
