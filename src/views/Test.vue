<template>
  <div class="test">
    <spread-sheet></spread-sheet>
  </div>
</template>

<script>
import SpreadSheet from '@/components/Document/SpreadSheet/SpreadSheet.vue';

export default {
  name: 'Test',
  components: {
    SpreadSheet,
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.test {
  height: calc(100vh - 64px);
  padding: 5px;
  // border: thin solid orange;
}
</style>