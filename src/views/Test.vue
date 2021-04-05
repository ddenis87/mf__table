<template>
  <div class="test">
    <spread-sheet :columns="columns"
                  
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
        { name: 'a', style: { 'min-width': '50px', }, },
        { name: 'b', style: { 'min-width': '20px', 'max-width': '20px', 'width': '20px' }, },
        { name: 'c', style: { 'min-width': '20px', }, },
        { name: 'd', style: { 'min-width': '250px', }, },
        { name: 'e', style: { 'min-width': '20px', }, },
      ],
      
      cells: [
        { name: 'd3', spanColRow: [2, 2], value: 'Test form for display', style: 'c0', },
        { name: 'c3', value: 'Cell testing size', style: 'c3', },
        { name: 'b2', value: 'Cell testing', style: 'c1', },
        { name: 'a12', value: 'Cell testing', style: 'c2', },
        { name: 'b10', spanColRow: [2, ], value: 'Testing join', style: 'c4', },
        { name: 'd5', spanColRow: [1, 4], value: 'Testing join upper width 250px', style: 'c5', },
      ],

      cellsStyles: [
        {
          name: 'c0',
          list: {
            backgroundColor: 'orange',
            color: 'white',
            fontFamily: 'Area',
            fontSize: '0.7em',
          }
        },
        {
          name: 'c1',
          list: {
            color: 'green',
          }
        },
        {
          name: 'c2',
          list: {
            color: 'rgba(240, 0, 0)',
            fontWeight: 'bold',
          }
        },
        {
          name: 'c3',
          list: {
            borderLeft: '2px solid black',
            borderRight: '2px solid black',
          }
        },
        {
          name: 'c4',
          list: {
            borderTop: '2px solid black',
            borderBottom: '2px solid black',
          }
        },
        {
          name: 'c5',
          list: {
            textTransform: 'uppercase'
          }
        },
      ],
    };
  },
  methods: {
    test() {
    },
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
