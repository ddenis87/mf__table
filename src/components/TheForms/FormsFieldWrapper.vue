<template>
  <div class="field-wrapper"
       :class="{'required': isRequired}">
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
import FieldDateTime from '@/components/Form/Field/FieldDateTime.vue';
import FieldDialog from '@/components/Form/Field/FieldDialog.vue';
import FieldHistory from '@/components/Form/Field/FieldHistory.vue';

export default {
  name: 'FormsFieldWrapper',
  components: {
    FieldText,
    FieldNumber,
    FieldChoice,
    FieldDate,
    FieldDateTime,
    FieldDialog,
    FieldHistory,
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
      fieldValue: '',
      fields: {
        string: FieldText,
        integer: FieldNumber,
        choice: FieldChoice,
        date: FieldDate,
        datetime: FieldDateTime,
        field: FieldDialog,
        history: FieldHistory,
      },
      isEmit: false,
    };
  },
  computed: {
    isRequired() {
      return this.fieldOptions.required || false;
    },
    field() {
      return this.fields[this.fieldOptions.type];
    },
    fieldProps() {
      const props = {
        fieldLabel: this.fieldOptions.label,
        isClearable: true,
      };
      if (this.fieldOptions.choices) props.items = this.fieldOptions.choices;
      if (this.fieldOptions.related_model_name) {
        props.relatedModelName = this.fieldOptions.related_model_name;
        props.itemText = 'text';
        props.itemValue = 'id';
      }
      if (this.fieldOptions.type === 'history') {
        props.dimension = this.fieldOptions.dimension;
        props.dimensionValue = this.fieldOptions.dimension_value;
      }
      return props;
    },
  },
  watch: {
    fieldValueInput() {
      this.$nextTick().then(() => {
        this.fieldValue = this.fieldValueInput;
      });
    },
  },
  methods: {
    evtKeydownControl(evt) {
      console.log(this.fieldValue);
      this.$emit('keydown:control', evt);
    },
    evtBlur() {},
  },
};
</script>

<style lang="scss" scoped>

</style>
