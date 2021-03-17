<template>
  <v-tooltip bottom :disabled="noTooltip">
    <template v-slot:activator="{ on }">
      <v-btn icon class="el-button-icon"
             height="40"
             width="40"
             :disabled="disabled"
             :x-small="isSmall"
             v-on="on"
             @click="(event) => $emit('click', event)"
             @keydown="(event) => $emit('keydown', event)">
        <v-icon :small="isSmall" :color="iconColor">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span class="tooltip-text tooltip-text-control"><slot></slot></span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'ElBtnIcon',
  props: {
    icon: { type: String, default: '' },
    iconColor: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    noTooltip: { type: Boolean, default: false },
    isSmall: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>

</style>