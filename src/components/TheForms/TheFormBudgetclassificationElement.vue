<template>
<div class="form-element">
  <v-form class="form-action" ref="formAction">
    <v-container fluid>
      <v-row dense>
        <v-col cols="12"><el-field-string :input-properties="fieldForm.head_name"
                                          :is-autofocus="true"
                                          v-model="fieldFormValue.head_name"
                                          @event-keydown="eventKeydown"></el-field-string></v-col>
      </v-row>
      <v-row dense>
        <v-col cols="2"><el-field-number :input-properties="fieldForm.head_code" 
                                          v-model="fieldFormValue.head_code"
                                          @event-keydown="eventKeydown"></el-field-number></v-col>
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
import { TheTableForm } from './TheTableForm.js';

export default {
  name: 'TheFormBudgetclassificationElement',
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