<template>
  <div class="field-wrapper">
    <component :is="field"
               ref="field"
               v-model="fieldValue"
               v-bind="fieldProps"
               @keydown:key.stop
               @keydown:control.prevent="evtKeydownControl"
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
  name: 'FieldWrapper',
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
    fieldOptions: { type: Object, default: () => { type: 'string' } },
    fieldValueInput: { type: [String, Number, Date, Object], default: null },
    // isRequired: { type: Boolean, default: false },
  },
  data() {
    return {
      fieldValue: '',
      fields: {
        string: FieldText,
        integer: FieldNumber,
        choice: FieldChoice,
        date: FieldDate,
        field: FieldDialog,
      },
      isEmit: false,
    };
  },
  computed: {
    field() {
      console.log(this.fieldOptions);
      return this.fields[this.fieldOptions.type];
    },
    fieldProps() {
      const props = {
        isFlat: true,
        isSolo: true,
        isSingleLine: true,
        isSelected: true,
      };
      if (this.fieldOptions.choices) props.items = this.fieldOptions.choices;
      console.log(this.fieldOptions);
      return props;
    },
  },
  watch: {
    fieldValueInput() {
      console.log(this.fieldValueInput);
      this.$nextTick().then(() => {
        console.log(this.fieldValueInput);
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
      this.isEmit = true;
      this.evtInput();
      if (evt.code === 'Escape') {
        this.$emit('control:esc');
        return;
      }
      this.$emit('keydown:control', evt);
      this.clearComponent();
    },
    evtBlur(evt) {
      this.evtInput();
      if (!this.isEmit) this.$emit('blur:wrapper', evt);
      this.clearComponent();
    },
  },
};
</script>

<style lang="scss" scoped>
.field-wrapper {
  display: flex;
  align-items: center;
  padding: 0px 0px;
  margin-top: -1px;
  width: 100%;
  min-width: 80px;
  height: 100%;
  min-height: 22px;
  max-height: 22px;
  font-size: 10.5pt;
  overflow: hidden;
  // padding-bottom: 10px;
  // border: thin solid black;
}
</style>
