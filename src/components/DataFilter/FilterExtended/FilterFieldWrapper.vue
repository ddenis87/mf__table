<template>
  <div class="field-wrapper">
    <component :is="field"
               ref="field"
               v-bind="fieldProps"
               v-model="fieldValue"
               @input="evtInput"
               @keydown:control="evtKeydownControl"
               @blur:input="evtBlur"></component>
  </div>
</template>

<script>
import FieldText from '@/components/Form/Field/FieldText.vue';
import FieldNumber from '@/components/Form/Field/FieldNumber.vue';
import FieldNumberRange from '@/components/Form/Field/FieldNumberRange.vue';
import FieldChoice from '@/components/Form/Field/FieldChoice.vue';
import FieldDate from '@/components/Form/Field/FieldDate.vue';
import FieldDateTime from '@/components/Form/Field/FieldDateTime.vue';
import FieldDialog from '@/components/Form/Field/FieldDialog.vue';
import FieldCompare from '@/components/Form/Field/FieldCompare.vue';

import FIELD_MODE from './FilterExtended';

export default {
  name: 'FilterFieldWrapper',
  components: {
    FieldText,
    FieldNumber,
    FieldNumberRange,
    FieldChoice,
    FieldDate,
    FieldDateTime,
    FieldDialog,
    FieldCompare,
  },
  model: {
    prop: 'fieldValueInput',
    event: 'input',
  },
  props: {
    fieldValueInput: { type: [String, Number, Date, Array, Object], default: null },
    fieldOptions: {
      type: Object,
      default() {
        return { type: 'string', required: false };
      },
    },
    fieldMode: { type: String, default: FIELD_MODE.SINGLE },
  },
  data() {
    return {
      fieldValue: null,
      fields: {
        string: FieldText,
        integer: FieldNumber,
        integerRange: FieldNumberRange,
        compare: FieldCompare,
        choice: FieldChoice,
        date: FieldDate,
        datetime: FieldDateTime,
        field: FieldDialog,
      },
    };
  },
  computed: {
    field() {
      const type = `${this.fieldOptions.type}${this.fieldMode}`;
      return this.fields[type];
    },
    fieldProps() {
      const props = {
        typeField: this.fieldOptions.typeField,
        fieldLabel: this.fieldOptions.label,
        isClearable: true,
      };
      if (this.fieldOptions.isClearable === false) {
        props.isClearable = this.fieldOptions.isClearable;
      }
      if (this.fieldOptions.choices) props.items = this.fieldOptions.choices;
      if (this.fieldOptions.related_model_name) {
        props.relatedModelName = this.fieldOptions.related_model_name;
        props.itemText = 'text';
        props.itemValue = 'id';
      }
      return props;
    },
  },
  watch: {
    fieldValueInput() {
      this.fieldValue = this.fieldValueInput;
      // console.log(this.fieldValueInput);
    },
  },
  mounted() {
    setTimeout(() => this.evtInput(), 500);
  },
  methods: {
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydownControl(evt) {
      evt.preventDefault();
      if (evt.code === 'Escape') return;
      this.evtInput();
      this.$emit('keydown:control', evt);
    },
    evtBlur() {
      this.evtInput();
    },
  },
};
</script>
