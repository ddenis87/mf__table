<template>
  <v-progress-linear class="data-progress-line"
                     color="blue" 
                     indeterminate 
                     absolute 
                     bottom
                     v-show="isShow"></v-progress-linear>
</template>

<script>
export default {
  name: 'ElProgressLine',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    }
  }
}
</script>