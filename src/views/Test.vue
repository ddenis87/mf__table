<template>
  <div class="test">
    <spread-sheet :cells="cells" :cells-styles="cellsStyles"></spread-sheet>
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
      cells: [
        {
          name: 'g4',
          value: 'Cell testing',
          style: ['c0', 'c1'],
        },
        {
          name: 'b6',
          value: 'Cell testing',
          style: 'c1',
        },
      ],
      cellsStyles: [
        {
          name: 'c0',
          value: {
            'background-color': 'orange',
            color: 'white',
            'qwe-er': 2
          }
        },
        {
          name: 'c1',
          value: {
            color: 'green',
          }
        },
      ],
    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.test {
  height: calc(100vh - 64px);
  padding: 5px;
  // border: thin solid orange;
}
</style>
