<template>
  <div class="form-element">
    <v-form class="form-action" ref="FormAction">
      <v-container fluid>
        <v-row>
          <v-col cols="3">
            <form-field-wrapper ref="startForm"
                                :field-options="fieldForm.start_date"
                                v-model="fieldFormValue.start_date"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <form-field-wrapper :field-options="fieldForm.some_desc"
                                v-model="fieldFormValue.some_desc"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
      </v-container>
      <form-control ref="FormControl"
                    @control:accept="evtControlAccept"
                    @control:cancel="evtControlCancel"
                    @control:tab="selectStartForm"></form-control>
    </v-form>
  </div>
</template>

<script>
import FormComponents from './FormComponents';
import FormProps from './FormProps';
import FormComputed from './FormComputed';
import FormHooks from './FormHooks';
import FormMethods from './FormMethods';

export default {
  name: 'TheActualdesc',
  components: {
    ...FormComponents,
  },
  props: {
    ...FormProps,
  },
  data() {
    return {
      tableName: 'actualdesc',
      fieldFormValue: {},
    };
  },
  computed: {
    ...FormComputed,
  },

  ...FormHooks,

  methods: {
    ...FormMethods,
  },
};
</script>
