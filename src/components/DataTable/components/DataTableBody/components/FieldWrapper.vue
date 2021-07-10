<template>
  <div class="field-wrapper"
       :class="[`field-wrapper_${typeRow}`, {'required': isRequired}]">
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
    typeRow: { type: String, default: 'fixed' },
    isSelected: { type: Boolean, default: false },
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
    isRequired() {
      return this.fieldOptions.required || false;
    },
    field() {
      return this.fields[this.fieldOptions.type];
    },
    fieldProps() {
      const props = {
        isFlat: true,
        isSolo: true,
        isSingleLine: true,
        isSelected: this.isSelected,
      };
      if (this.fieldOptions.choices) props.items = this.fieldOptions.choices;
      if (this.fieldOptions['related_model_name']) {
        props.relatedModelName = this.fieldOptions['related_model_name'];
        props.itemText = 'text';
        props.itemValue = 'id';
      }
      return props;
    },
  },
  watch: {
    fieldValueInput() {
      // console.log(this.fieldValueInput);
      this.$nextTick().then(() => {
        // console.log(this.fieldValueInput);
        this.fieldValue = this.fieldValueInput;
      });
    },
  },
  methods: {
    evtInput() { this.$emit('input', this.fieldValue); },
    evtKeydownControl(evt) {
      this.isEmit = true;
      this.evtInput();
      if (evt.code === 'Escape') {
        this.$emit('control:esc');
        return;
      }
      this.$emit('keydown:control', { event: evt, fieldKey: this.fieldOptions.value });
    },
    evtBlur(evt) {
      this.evtInput();
      if (!this.isEmit) this.$emit('blur:wrapper', { event: evt, fieldKey: this.fieldOptions.value });
    },
  },
};
</script>

<style lang="scss" scoped>
.field-wrapper {
  overflow: hidden;
  margin: 0 3px;
  border-bottom: 2px solid rgba(21, 101, 192, .3);
  &_dense { margin-top: -10.5px; }
  &_fixed { margin-top: -10px; }
  &_auto { margin-top: -10px; }
}
.required {
  border-bottom: 3px solid rgba(255, 0, 0,.6);
}
</style>
