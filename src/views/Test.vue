<template>
  <div class="test">
    <spread-sheet :columns="columns"
                  :columns-styles="columnsStyles"
                  :cells="cells"
                  :cells-styles="cellsStyles"></spread-sheet>
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
      columns: [
        {
          name: 'd',
          style: 'c0',
        }
      ],
      columnsStyles: [
        {
          name: 'c0',
          value: {
            minWidth: '250px',
          },
        },
      ],
      cells: [
        {
          name: 'c3',
          value: 'Cell testing size',
          style: ['c0','c1'],
        },
        {
          name: 'b2',
          value: 'Cell testing',
          style: 'c1',
        },
        {
          name: 'a12',
          value: 'Cell testing',
          style: ['c1','c2'],
        },
        {
          name: 'b10',
          spanColRow: [2, ],
          value: 'Testing join',
          style: ['c4'],
        },
        {
          name: 'd5',
          spanColRow: [1, 4],
          value: 'Testing join upper width 250px',
          style: ['c3','c4','c5'],
        },
      ],
      cellsStyles: [
        {
          name: 'c0',
          value: {
            backgroundColor: 'orange',
            color: 'white',
            fontFamily: 'Area',
            fontSize: '0.7em',
          }
        },
        {
          name: 'c1',
          value: {
            color: 'green',
          }
        },
        {
          name: 'c2',
          value: {
            color: 'rgba(240, 0, 0)',
            fontWeight: 'bold',
          }
        },
        {
          name: 'c3',
          value: {
            borderLeft: '2px solid black',
            borderRight: '2px solid black',
          }
        },
        {
          name: 'c4',
          value: {
            borderTop: '2px solid black',
            borderBottom: '2px solid black',
          }
        },
        {
          name: 'c5',
          value: {
            borderBottom: '2px solid black',
            textTransform: 'uppercase'
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
