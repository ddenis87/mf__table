<template>
  <div class="el-button">
    <v-btn class="el-button__item"
           :class="{'el-button__item_right': orientation}"
           depressed
           dark
           small
           color="blue darken-1" 
           :height="isHeight"
           @click="(event) => $emit('click', event)"
           @keydown="(event) => $emit('keydown', event)">
      <slot></slot>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ElBtn',
  props: {
    isHeight: {type: String, default: '26'},
    isOrientation: {type: String, default: 'right'},
  },
  computed: {
    orientation() { return (this.isOrientation == 'left') ? true : false; },
  },
}
</script>

<style lang="scss" scoped>
.el-button {
  &__item {
    margin-left: 10px;
    &_right {
      margin-left: 0px;
      margin-right: 10px;
    }
  }
}
</style>