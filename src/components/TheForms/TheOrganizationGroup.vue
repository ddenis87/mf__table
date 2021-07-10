<template>
  <div class="form-group">
    <v-form class="form-action" ref="FormAction">
      <v-container fluid>
        <v-row>
          <v-col cols="3">
            <form-field-wrapper ref="startForm"
                                :field-options="fieldForm.registry_date"
                                v-model="fieldFormValue.registry_date"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="3">
            <form-field-wrapper :field-options="fieldPropsHistory"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <form-field-wrapper :field-options="fieldForm.institution_code"
                                v-model="fieldFormValue.institution_code"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="3">
            <form-field-wrapper :field-options="fieldForm.budget_level"
                                v-model="fieldFormValue.budget_level"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <form-field-wrapper :field-options="fieldForm.title"
                                v-model="fieldFormValue.title"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <form-field-wrapper :field-options="fieldForm.bk"
                                v-model="fieldFormValue.bk"
                                @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <form-field-wrapper :field-options="fieldForm.parent"
                                v-model="fieldFormValue.parent"
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
  name: 'TheOrganizationGroup',
  components: {
    ...FormComponents,
  },
  props: {
    ...FormProps,
  },
  data() {
    return {
      tableName: 'organization',
      fieldFormValue: {
        is_group: true,
      },
    };
  },
  computed: {
    ...FormComputed,
    fieldPropsHistory() {
      return {
        type: 'history',
        label: 'История',
        related_model_name: 'actualdesc',
        dimension: 'related',
        dimension_value: this.fieldFormValue?.id || null,
      };
    },
  },
  ...FormHooks,
  methods: {
    ...FormMethods,
  },
};
</script>
