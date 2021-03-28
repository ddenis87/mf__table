<template>
  <div class="form">
    <v-form ref="formAction">
      <v-container fluid>
        <v-row dense>
          <v-col cols="3" >
            <el-field-date class="tabspace-start"
                           :input-properties="fieldForm.start_date" 
                           v-model="fieldFormValue.start_date"></el-field-date>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6" >
            <el-field-string :inputProperties="fieldForm.some_desc" 
                             v-model="fieldFormValue.some_desc"></el-field-string>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <el-field-dialog :inputProperties="assingObject(fieldForm.related, {})"
                             v-model="fieldFormValue.related"
                             @next-element="eventNextElement"></el-field-dialog>
          </v-col>
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
  name: 'TheActualdescElement',
  mixins: [
    TheTableForm,
  ],
  data() {
    return {
      tableName: 'actualdesc',
      fieldFormValue: {
        id: null,
        start_date: '',
        some_desc: '',
        related: null,
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>