<template>
<div class="table-form">
  <v-form ref="formAction">
    <v-container fluid>
      <v-row dense>
        <v-col cols="12"><el-field-string :input-properties="fieldForm.head_name" 
                                          v-model="fieldFormValue.head_name"
                                          @next-element="eventNextElement"></el-field-string></v-col>
      </v-row>
      <v-row dense>
        <v-col cols="2"><el-field-number :input-properties="fieldForm.head_code" 
                                          v-model="fieldFormValue.head_code"
                                          @next-element="eventNextElement"></el-field-number></v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <el-btn @click="eventClickActionCancel">Отменить</el-btn>
      <el-btn class="tabspace-end" 
                 @click="eventClickActionAccept"
                 @keydown="eventKeydownAccept">Записать</el-btn>
    </v-card-actions>
  </v-form>
</div>

</template>

<script>
import { TheTableForm } from './TheTableForm.js';

export default {
  name: 'TableFormBudgetclassification',
  mixins: [
    TheTableForm,
  ],
  data() {
    return {
      tableName: 'budgetclassification',
      fieldFormValue: {
        head_name: '',
        head_code: '',
      },
    }
  },
  methods: {
    fieldFormValueClear() {
      this.fieldFormValue = {
        head_name: '',
        head_code: '',
      }
    },
  },
}
</script>