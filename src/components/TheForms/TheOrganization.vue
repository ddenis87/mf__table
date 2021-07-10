<template>
  <div class="form-element">
    <v-form class="form-action" ref="FormAction">
      <v-container fluid>
        <v-row>
          <v-col cols="3" >
            <form-field-wrapper ref="startForm"
                                 :field-options="fieldForm.registry_date"
                                 v-model="fieldFormValue.registry_date"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="3" >
            <form-field-wrapper :field-options="fieldForm.last_visited"
                                 v-model="fieldFormValue.last_visited"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="3" >
            <form-field-wrapper :field-options="fieldPropsHistory"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <form-field-wrapper :field-options="fieldForm.organization_type"
                                 v-model="fieldFormValue.organization_type"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="3">
            <form-field-wrapper :field-options="fieldForm.institution_type"
                                 v-model="fieldFormValue.institution_type"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="3">
            <form-field-wrapper :field-options="fieldForm.institution_code"
                                 v-model="fieldFormValue.institution_code"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="3">
            <form-field-wrapper :field-options="fieldForm.industry_typing"
                                 v-model="fieldFormValue.industry_typing"
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
          <v-col cols="4">
            <form-field-wrapper :field-options="fieldForm.inn"
                                 v-model="fieldFormValue.inn"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="4">
            <form-field-wrapper :field-options="fieldForm.kpp"
                                 v-model="fieldFormValue.kpp"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
          <v-col cols="4">
            <form-field-wrapper :field-options="fieldForm.budget_level"
                                 v-model="fieldFormValue.budget_level"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <form-field-wrapper :field-options="fieldForm.egrul_status"
                                 v-model="fieldFormValue.egrul_status"
                                 @keydown:control="evtKeydownField"></form-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <form-field-wrapper :field-options="fieldForm.rubpnubp_status"
                                 v-model="fieldFormValue.rubpnubp_status"
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
  name: 'TheOrganization',
  components: {
    ...FormComponents,
  },
  props: {
    ...FormProps,
  },
  data() {
    return {
      tableName: 'organization',
      fieldFormValue: {},
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
