<template>
  <v-card-actions class="form-control">
    <v-spacer></v-spacer>
    <el-btn ref="ControlCancel"
            @click="evtFormCancel"
            @keydown="evtKeydownControlCancel">Отменить</el-btn>
    <el-btn ref="ControlAccept"
            @click="evtClickControlAccept"
            @keydown="evtKeydownControlAccept">Записать</el-btn>
  </v-card-actions>
</template>

<script>
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

export default {
  name: 'FormControl',
  components: {
    ElBtn,
  },
  methods: {
    selectControlAccept() {
      this.$refs.ControlAccept.$el.querySelector('button').focus();
    },
    evtClickControlAccept() {
      this.$emit('control:accept');
    },
    evtFormCancel() {
      this.$emit('control:cancel');
    },
    evtKeydownControlCancel(evt) {
      if (evt.code === 'Enter') this.evtFormCancel();
    },
    evtKeydownControlAccept(evt) {
      console.log(evt.code);
      if (evt.code === 'Tab') {
        evt.preventDefault();
        this.$emit('control:tab');
        // return;
      }
      if (evt.code.includes('Enter')) this.$emit('control:accept');
    },
  },
};
</script>
