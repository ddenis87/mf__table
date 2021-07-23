<template>
  <v-tooltip right
             content-class="tooltip-box tooltip-box_body"
             v-bind="positionTooltip"
             v-model="isShow"
             @click="evtClose"
             @mouseover="evtClose">{{ text }}</v-tooltip>
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
