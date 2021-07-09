<template>
  <div class="form-element">
    <v-form class="form-action" ref="formAction">
      <v-container fluid>
        <v-row>
          <v-col cols="3" >
            <forms-field-wrapper :field-options="fieldForm.registry_date"
                                 v-model="fieldFormValue.registry_date"></forms-field-wrapper>
          </v-col>
          <v-col cols="3" >
            <forms-field-wrapper :field-options="fieldForm.last_visited"
                                 v-model="fieldFormValue.last_visited"></forms-field-wrapper>
          </v-col>
          <v-col cols="3" >
            <forms-field-wrapper :field-options="fieldPropsHistory"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <forms-field-wrapper :field-options="fieldForm.organization_type"
                                 v-model="fieldFormValue.organization_type"
                                 @keydown:control="evtKeydownControl"></forms-field-wrapper>
          </v-col>
          <v-col cols="3">
            <forms-field-wrapper :field-options="fieldForm.institution_type"
                                 v-model="fieldFormValue.institution_type"></forms-field-wrapper>
          </v-col>
          <v-col cols="3">
            <forms-field-wrapper :field-options="fieldForm.institution_code"
                                 v-model="fieldFormValue.institution_code"></forms-field-wrapper>
          </v-col>
          <v-col cols="3">
            <forms-field-wrapper :field-options="fieldForm.industry_typing"
                                 v-model="fieldFormValue.industry_typing"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.title"
                                 v-model="fieldFormValue.title"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <forms-field-wrapper :field-options="fieldForm.inn"
                                 v-model="fieldFormValue.inn"></forms-field-wrapper>
          </v-col>
          <v-col cols="4">
            <forms-field-wrapper :field-options="fieldForm.kpp"
                                 v-model="fieldFormValue.kpp"></forms-field-wrapper>
          </v-col>
          <v-col cols="4">
            <forms-field-wrapper :field-options="fieldForm.budget_level"
                                 v-model="fieldFormValue.budget_level"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.egrul_status"
                                 v-model="fieldFormValue.egrul_status"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.rubpnubp_status"
                                 v-model="fieldFormValue.rubpnubp_status"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.bk"
                                 v-model="fieldFormValue.bk"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.parent"
                                 v-model="fieldFormValue.parent"></forms-field-wrapper>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="form-action__control">
        <v-spacer></v-spacer>
        <el-btn @click="eventFormCancel">Отменить</el-btn>
        <el-btn @click="eventFormAccept"
                @keydown="eventAcceptKeydown">Записать</el-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

import theFormProps from './FormsProps';
import FormsFieldWrapper from './FormsFieldWrapper.vue';

export default {
  name: 'OrganizationElement',
  components: {
    ElBtn,
    FormsFieldWrapper,
  },
  props: {
    ...theFormProps,
  },
  data() {
    return {
      tableName: 'organization',
      fieldFormValue: {},
    };
  },
  computed: {
    fieldForm() {
      if (!this.guid) return null;
      const fieldForm = this.$store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: this.tableName });
      if (this.focusedElement === null) return fieldForm;
      return fieldForm;
    },
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
  mounted() {
    if (this.focusedElement) {
      this.fieldFormValue = { ...this.fieldForm, ...this.focusedElement };
      return;
    }
    Object.keys(this.fieldForm).forEach((itemKey) => {
      this.fieldFormValue[itemKey] = null;
    });
  },
  methods: {
    eventFormCancel() {
      this.$emit('event-action-cancel');
      this.$refs.formAction.reset();
    },
    eventFormAccept() {},
    eventAcceptKeydown() {},

    evtKeydownControl(evt) {
      console.log(evt.target);
    },

    hasValidation() {
      if (!this.$refs.formAction.validate()) return false;
      let isValidate = true;
      Object.keys(this.fieldFormValue).forEach((key) => {
        if (this.fieldForm[key].required === true
          && (this.fieldFormValue[key] === ''
          || this.fieldFormValue[key] === null)) {
          isValidate = false;
        }
      });
      return isValidate;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
