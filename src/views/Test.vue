<template>
  <div class="test">
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <el-field-number data-tab="1" v-model="f1" @keydown="eventKeydown" @clear-value="eventClearValue" @blur="eventBlur"></el-field-number>
        </v-col>
        <v-col cols="3">
          <el-field-number data-tab="2" v-model="f2" @keydown="eventKeydown" @clear-value="eventClearValue" @blur="eventBlur"></el-field-number>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <el-field-choice data-tab="3"
                           v-model="f3"
                           :input-properties="{choices: [
                            {display_name: 'First', value: 0},                           
                            {display_name: 'Second', value: 1},                           
                            {display_name: 'Three', value: 2},                           
                           ]}"
                           @keydown="eventKeydown"
                           @clear-value="eventClearValue"
                           @blur="eventBlur"></el-field-choice>
        </v-col>
        <v-col cols="3">
          <el-field-number data-tab="4" v-model="f4" @keydown="eventKeydown" @clear-value="eventClearValue" @blur="eventBlur"></el-field-number>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ElFieldNumber from '@/components/Elements/ElFields/ElFieldNumber';
import ElFieldChoice from '@/components/Elements/ElFields/ElFieldChoice';
export default {
  name: 'Test',
  components: {
    ElFieldNumber,
    ElFieldChoice,
  },
  data() {
    return {
      f1: '',
      f2: '120',
      f3: '',
      f4: '',
      DOMElements: [],
    }
  },
  mounted() {
    this.DOMElements = Array.from(document.querySelectorAll('.el-field'));
  },
  methods: {
    eventKeydown(option) {
      // let DOMElements = Array.from(document.querySelectorAll('.el-field'));
      if (option.event.key == 'Enter') {
        let index = option.event.target.closest('.el-field').getAttribute('data-tab');
        console.log(index);
        if (this.DOMElements[index])
          this.DOMElements[index].querySelector('input').focus();
        // console.log(DOMElements);
      }
      console.log(option);
      console.log(this.f1);
      console.log(this.f2);
      console.log(this.f3);
    },
    eventClearValue() {
      console.log('clear value');
      console.log(this.f1);
      console.log(this.f2);
      console.log(this.f3);
    },
    eventBlur() {
      console.log('blur');
    },
  }
}
</script>