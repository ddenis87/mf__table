<template>
  <div class="form-element">
    <v-form class="form-action" ref="formAction">
      <v-container fluid>
        <v-row dense>
          <v-col cols="3" >
            <el-field-date :input-properties="fieldForm.start_date"
                           :is-autofocus="true"
                           v-model="fieldFormValue.start_date"
                           @event-keydown="eventKeydown"></el-field-date>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" >
            <el-field-string :inputProperties="fieldForm.some_desc" 
                             v-model="fieldFormValue.some_desc"
                             @event-keydown="eventKeydown"></el-field-string>
          </v-col>
        </v-row>
        <!-- <v-row dense>
          <v-col cols="12">
            <el-field-dialog :inputProperties="fieldForm.related"
                             v-model="fieldFormValue.related"
                             @next-element="eventNextElement"></el-field-dialog>
          </v-col>
        </v-row> -->
      </v-container>
      <v-card-actions class="form-action__control">
        <v-spacer></v-spacer>
        <el-btn @click="eventClickActionCancel">Отменить</el-btn>
        <el-btn @click="eventClickActionAccept"
                @keydown="eventAcceptKeydown">Записать</el-btn>
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