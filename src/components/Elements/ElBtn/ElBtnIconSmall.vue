<template>
  <v-tooltip bottom :disabled="noTooltip">
    <template v-slot:activator="{ on }">
      <v-btn class="el-button-icon"  tabindex="1" width="24" height="24"
             icon
             small
             :disabled="isDisabled"
             v-on="on"
             tile
             @click="(event) => $emit('click', event)" @keydown="(event) => $emit('keydown', event)">
        <v-icon  :color="iconColor">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span class="tooltip-text tooltip-text-control"><slot></slot></span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'ElButtonIconSmall',
  props: {
    icon: { type: String, default: '' },
    iconColor: { type: String, default: '' },
    isDisabled: { type: Boolean, default: false },
    noTooltip: { type: Boolean, default: false },
  },
}
</script>