<template>
  <div class="field">
    <v-autocomplete ref="fieldInput"
                    class="field-item choice"
                    append-icon="mdi-dots-horizontal"
                    v-bind="fieldPropsNested"
                    :rules="(isRequired) ? [rules.required] : []"
                    :items="fieldItems"
                    :item-text="itemText"
                    :item-value="itemValue"
                    v-model="fieldValue"
                    @click="evtClick"
                    @input="evtInput"
                    @keydown="evtKeydown"
                    @keydown.enter="evtKeydownControl"
                    @keydown.esc="evtKeydownControl"
                    @keydown.tab="evtKeydownControl"
                    @blur="evtBlur"
                    @focus="evtFocus"></v-autocomplete>
  <dialog-full-page :is-dialog-name="dialogName"
                    :is-dialog-show="isDialogShow" ></dialog-full-page>
  </div>
</template>

<script>
import DialogFullPage from '@/components/Dialogs/DialogFullPage.vue';

import fieldModel from './FieldModel';
import fieldProps from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldDialog',
  components: {
    DialogFullPage,
  },
  model: {
    ...fieldModel,
  },
  props: {
    ...fieldProps,
    filters: null,
  },
  data() {
    return {
      dialogName: '',
      isDialogShow: false,
    };
  },
  computed: {
    ...fieldComputed,
  },
};
</script>

<style lang="scss" scoped>

</style>
