<template>
  <v-tooltip right
             v-bind="positionTooltip"
             v-model="isShow"
             @click="evtClose"
             @mouseover="evtClose">
    <div class="tooltip-text tooltip-text-body">{{ text }}</div>
  </v-tooltip>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    text: { type: String, default: 'qwe' },
    position: { type: Object, default() { return { left: -100, top: -100 }; } },
    isShow: { type: Boolean, default: false },
  },
  computed: {
    positionTooltip() {
      // console.log(this.position);
      return {
        'position-x': this.position.left,
        'position-y': this.position.top,
      };
    },
  },
  methods: {
    evtClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
