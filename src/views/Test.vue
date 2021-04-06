<template>
  <div class="test">
    <div class="test-control-top">
      <div class="item">
        <v-text-field label="Столбцы" v-model="countColumn"></v-text-field>
      </div>
      <div class="item">
        <v-text-field label="Строки" v-model="countRow"></v-text-field>
      </div>
      <div class="item">
        <v-btn dense @click="commitSpace">Commit</v-btn>
      </div>
    </div>
    <div class="test-table">
      <spread-sheet :columns="columns"
                    :rows="rows"
                    :cells="cells"
                    :styles="styles"
                    
                    :countColumn="sheetSpace.column"
                    :countRow="sheetSpace.row"></spread-sheet>
    </div>
    <div class="test-control-right">
      123
    </div>
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
      countColumn: 25,
      countRow: 100,
      sheetSpace: {
        column: 25,
        row: 100,
      },

      columns: [
        { name: 'a', width: 100 },
        { name: 'b', width: 20 },
        { name: 'c', width: 20 },
        { name: 'D', width: 250 },
        { name: 'e', width: 100 },
      ],

      rows: [
        { name: 5, height: 40 },
        { name: 6, height: 30 },
        { name: 7, height: 30 },
        { name: 8, height: 80 },
      ],
      
      cells: [
        { name: 'd3', value: 'Test form for display', spanColRow: [2, 2], style: 'c0', },
        { name: 'c3', value: 'Cell testing size', style: 'c3', },
        { name: 'b2', value: 'Testing color', style: 'c1', },
        { name: 'a12', value: 'Testing font-weight', style: 'c2', },
        { name: 'b10', value: 'Testing join column', spanColRow: [2, ], style: 'c4', },
        { name: 'D5', value: 'Testing upper', spanColRow: [1, 4], style: 'c5', },
        { name: 'd8', value: 'Testing heigth join row and col (wrong?)', style: 'c6', spanColRow: [2, 2] },
      ],

      styles: [
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
            textTransform: 'uppercase',
            borderTop: '2px solid black',
            borderBottom: '2px solid black',
            borderLeft: '2px solid black',
            borderRight: '2px solid black',
          }
        },
        {
          name: 'c6',
          list: {
            textTransform: 'uppercase',
            borderTop: '2px solid black',
            borderBottom: '2px dashed red',
            borderLeft: '2px solid black',
            borderRight: '2px solid black',
          }
        },
      ],
    };
  },
  methods: {
    commitSpace() {
      this.sheetSpace.column = +this.countColumn;
      this.sheetSpace.row = +this.countRow;
      console.log(this.sheetSpace);
    },
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: grid;
  grid-template-areas: "control-top control-top" "table control-right";
  grid-template-rows: 60px 1fr;
  grid-template-columns: 100% 300px;
  max-width: 100%;

  border: thin solid red;
  &-control-top {
    grid-area: control-top;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5px;
    .item {
      width: 100px;
      padding-right: 20px;
    }
    // border: thin solid green;
  }
  &-table {
    grid-area: table;
    padding: 5px;
    width: calc(100vw - 300px);
    height: calc(100vh - 126px);
  }
  &-control-right {
    grid-area: control-right;
    border: thin solid peru;
  }
}
</style>
