<template>
  <div class="form-element">
    <v-form class="form-action" ref="formAction">
      <v-container fluid>
        <v-row>
          <v-col cols="3" >
            <forms-field-wrapper :field-options="fieldForm.registry_date"></forms-field-wrapper>
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
            <forms-field-wrapper :field-options="fieldForm.organization_type"></forms-field-wrapper>
          </v-col>
          <v-col cols="3">
            <forms-field-wrapper :field-options="fieldForm.institution_type"></forms-field-wrapper>
          </v-col>
          <v-col cols="3">
            <forms-field-wrapper :field-options="fieldForm.institution_code"></forms-field-wrapper>
          </v-col>
          <v-col cols="3">
            <forms-field-wrapper :field-options="fieldForm.industry_typing"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.title"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <forms-field-wrapper :field-options="fieldForm.inn"
                                 v-model="inn"></forms-field-wrapper>
          </v-col>
          <v-col cols="4">
            <forms-field-wrapper :field-options="fieldForm.kpp"></forms-field-wrapper>
          </v-col>
          <v-col cols="4">
            <forms-field-wrapper :field-options="fieldForm.budget_level"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.egrul_status"></forms-field-wrapper>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <forms-field-wrapper :field-options="fieldForm.rubpnubp_status"></forms-field-wrapper>
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
      fieldFormValue: {
        // id: null,
        // title: '',
        // registry_date: '',
        // last_visited: '',
        // institution_code: '',
        inn: '',
        // kpp: '',
        // organization_type: null,
        // rubpnubp_status: null,
        // egrul_status: null,
        // institution_type: null,
        // industry_typing: null,
        // budget_level: null,
        bk: null,
        // parent: null,
      },
      inn: '',
    };
  },
  computed: {
    async fieldForm() {
      if (!this.guid) return null;
      const fieldForm = this.$store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: this.tableName });
      if (this.focusedElement === null) return fieldForm;
      await this.fillValue();
      // console.log(fieldForm);
      // Object.keys(fieldForm)
      // for (const key of Object.keys(fieldForm)) {
      //   this.fieldFormValue[key] = this.focusedElement[key];
      // }
      // console.log(this.fieldFormValue);
      return fieldForm;
    },
    fieldPropsHistory() {
      return {
        lebel: 'История',
        'related-model-name': 'actualdesc',
        dimension: 'related',
        'dimension-value': this.fieldFormValue?.id || null,
      };
    },
  },
  async mount() {
    // await this.$nextTick().then(() => {
    //   Object.keys(this.fieldForm).forEach((field) => {
    //     this.fieldFormValue[field] = this.focusedElement[field] || null;
    //   });
    // });
    // setTimeout(() => this.inn = this.focusedElement.inn, 3000);
    // console.log(this.inn);
  //   if (this.focusedElement == null) {
  //     let filtersStor = this.$store.getters['DataTable/GET_FILTERS']({ tableName: this.tableName, guid: this.guid });
  //     Object.keys(this.fieldFormValue).forEach((key) => {
  //       if (!this.fieldFormValue[key]) {
  //         if (key in filtersStor) this.fieldFormValue[key] = filtersStor[key];
  //       }
  //     });
  //   }
  //   if (this.focusedElement == null && this.filtersForm) {
  //     // console.log('fill filters');
  //     Object.keys(this.filtersForm).forEach((key) => {
  //       this.fieldFormValue[key] = this.filtersForm[key];
  //     });
  //   }
  //   // this.fieldArray = Array.from(document.querySelectorAll('.table-form .el-field__item input[tabindex="1"]'));
  // },
  // watch: {
  //   focusedElement() {
  //     console.log(this.focusedElement);
  //     this.fieldFormValue = this.focusedElement;
  //   },
  },
  methods: {
    fillValue() {
      return new Promise((resolve) => {
        Object.keys(this.fieldForm).forEach((field) => {
          this.fieldFormValue[field] = this.focusedElement[field] || null;
        });
        resolve();
      });
    },
    eventFormCancel() {},
    eventFormAccept() {},
    eventAcceptKeydown() {},
  },
};
</script>

<style lang="scss" scoped>

</style>
