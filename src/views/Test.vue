<template>
  <div class="test">
    <v-form class="form-action" ref="formAction">
      <v-container fluid>
        <v-row class="form__row" dense>
          <v-col class="form__col" cols="3">
            <el-field-choice data-tab="3"
                            v-model="f1"
                            :input-properties="{choices: [
                              {display_name: 'First', value: 0},                           
                              {display_name: 'Second', value: 1},                           
                              {display_name: 'Three', value: 2},                           
                            ]}"
                            @event-keydown="eventKeydown"></el-field-choice>
          </v-col>
          <v-col class="form__col" cols="3">
            <el-field-number data-tab="2" v-model="f2" @event-keydown="eventKeydown"></el-field-number>
          </v-col>
        </v-row>
        <v-row class="form__row" dense>
          <v-col class="form__col" cols="3">
            <el-field-choice data-tab="3"
                            v-model="f3"
                            :input-properties="{choices: [
                              {display_name: 'First', value: 'fi'},                           
                              {display_name: 'Second', value: 'sec'},                           
                              {display_name: 'Three', value: 'three'},                           
                            ],
                              required: true}"
                            @event-keydown="eventKeydown"></el-field-choice>
          </v-col>
          <v-col class="form__col" cols="3">
            <el-field-number data-tab="3" v-model="f4" @event-keydown="eventKeydown"></el-field-number>
          </v-col>
        </v-row>
        <!-- <v-row dense>
          <v-col cols="3">
            <el-field-history data-tab="4" v-model="f3" @event-keydown="eventKeydown" @clear-value="eventClearValue" @event-blur="eventBlur"></el-field-history>
          </v-col>
          <v-col cols="3">
            <el-field-number data-tab="5" v-model="f3" @event-keydown="eventKeydown" @clear-value="eventClearValue" @event-blur="eventBlur"></el-field-number>
          </v-col>
        </v-row> -->
      </v-container>
    </v-form>
  </div>
</template>

<script>
import ElFieldNumber from '@/components/Elements/ElFields/ElFieldNumber';
import ElFieldHistory from '@/components/Elements/ElFields/ElFieldHistory';
import ElFieldChoice from '@/components/Elements/ElFields/ElFieldChoice';
export default {
  name: 'Test',
  components: {
    ElFieldNumber,
    ElFieldChoice,
    ElFieldHistory,
  },
  data() {
    return {
      f1: 2,
      f2: '',
      f3: '',
      f4: '21',
    }
  },
  methods: {
    eventKeydown(option) {
      console.log('keydown form');
      console.log(option);
      if (option.event.key == 'Enter') {
        let nextElement = this.nextElement(option.event.target.closest('.el-field'));
        if (nextElement) nextElement.focus();
      }
    },
    nextElement(currentElement) {
      if (currentElement.className.indexOf('form-action') != -1) return null;
      if (currentElement.parentElement.nextElementSibling)
        return currentElement.parentElement.nextElementSibling.querySelector('.el-field > .el-field__item').querySelector('input').focus();
      this.nextElement(currentElement.parentElement);
    },
    eventClearValue() {
      // console.log('clear value');
      // console.log(this.f1);
      // console.log(this.f2);
      // console.log(this.f3);
    },
    eventBlur() {
      // console.log('blur');
    },
  }
}
</script>