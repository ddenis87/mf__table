<template>
  <div class="field-wrapper">
    <component :is="field"
               ref="field"
               v-bind="fieldProps"
               v-model="fieldValue"
               @keydown:control="evtKeydownControl"
               @blur:input="evtBlur"></component>
  </div>
</template>

<script>
import FieldText from '@/components/Form/Field/FieldText.vue';
import FieldNumber from '@/components/Form/Field/FieldNumber.vue';
import FieldChoice from '@/components/Form/Field/FieldChoice.vue';
import FieldDate from '@/components/Form/Field/FieldDate.vue';
import FieldDateTime from '@/components/Form/Field/FieldDateTime.vue';
import FieldDialog from '@/components/Form/Field/FieldDialog.vue';
import FieldCompare from '@/components/Form/Field/FieldCompare.vue';

export default {
  name: 'FilterFieldWrapper',
  components: {
    FieldText,
    FieldNumber,
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
    fieldOptions: {
      type: Object,
      default() {
        return { type: 'string', required: false };
      },
    },
    fieldValueInput: { type: [String, Number, Date, Object], default: null },
  },
  data() {
    return {
      fieldValue: null,
      fields: {
        string: FieldText,
        integer: FieldNumber,
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
      return this.fields[this.fieldOptions.type];
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
      console.log(this.fieldValueInput);
    },
  },
  methods: {
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydownControl(evt) {
      // evt.preventDefault();
      this.evtInput();
      this.$emit('keydown:control', evt);
    },
    evtBlur() {
      this.evtInput();
    },
  },
};
</script>
