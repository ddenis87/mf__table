<template>
  <div class="test">
    <div class="test-control-top">
      <div class="item">
        <v-text-field label="Столбцы" v-model="countColumn"></v-text-field>
      </div>
      <div class="item">
        <v-text-field label="Строки" v-model="countRow"></v-text-field>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="commitSpace">Commit</v-btn>
      </div>
      <div class="item item_btn">
        <v-btn small dark color="blue darken-3" @click="() => isShowDialog = true">Setting</v-btn>
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
      
    </div>
    <dialog-bar-right is-dialog-name="Setting" class="dialog"
                      :is-dialog-show="isShowDialog"
                      width="700"
                      @close-dialog="isShowDialog = false">
      <v-card class="dialog__item" >
        <v-textarea rows="3" label="Columns" v-model="columnsJSON"></v-textarea>
        <v-textarea rows="2" label="Rows" v-model="rowsJSON"></v-textarea>
        <v-textarea rows="7" label="Cells" v-model="cellsJSON"></v-textarea>
        <!-- <v-textarea rows="12" label="Styles" v-model="stylesJSON"></v-textarea> -->
      </v-card>
      
    </dialog-bar-right>
  </div>
</template>

<script>
import SpreadSheet from '@/components/Document/SpreadSheet/SpreadSheet.vue';
import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue'

export default {
  name: 'Test',
  components: {
    SpreadSheet,
    DialogBarRight,
  },
  data() {
    return {
      isShowDialog: false,
      countColumn: 25,
      countRow: 100,
      sheetSpace: {
        column: 25,
        row: 100,
      },
      columnsJSON: '{"a":{"width":120},"b":{"width":20},"c":{"width":20},"d":{"width":250},"e":{"width":100}}',
      rowsJSON: '{"5":{"height":40},"6":{"height":30},"7":{"height":30},"8":{"height":80}, "14": {"rowGroup": "3"}}',
      cellsJSON: '{"b2":{"value":"Testing color","style":"c1"},"c3":{"value":"Cell testing size","style":"c3"},"d3":{"value":"Test form for display","colspan":2,"rowspan":2,"style":"c0"},"d5":{"value":"Testing upper","rowspan":4,"style":"c5"},"e8":{"value":"Testing lowercase","colspan":2,"rowspan":2,"style":"c6"},"b10":{"value":"Testing join column","colspan":4,"style":"c4"},"a12":{"value":"Testing font-weight","style":"c2"}}',
      stylesJSON: '[{"name":"c0","list":{"backgroundColor":"orange","color":"white","fontFamily":"Area","fontSize":"0.7em"}},{"name":"c1","list":{"color":"green"}},{"name":"c2","list":{"color":"rgba(240, 0, 0)","fontWeight":"bold"}},{"name":"c3","list":{"borderLeft":"2px solid black","borderRight":"2px solid black"}},{"name":"c4","list":{"borderTop":"2px solid black","borderBottom":"2px solid black"}},{"name":"c5","list":{"textTransform":"uppercase","borderTop":"2px solid black","borderBottom":"2px solid black","borderLeft":"2px solid black","borderRight":"2px solid black"}},{"name":"c6","list":{"textTransform":"lowercase","borderTop":"2px solid black","borderBottom":"2px dashed red","borderLeft":"2px solid black","borderRight":"2px solid black"}}]',
      // columns: {
      //   'a': { width: 120 },
      //   'b': { width: 20 },
      //   'c': { width: 20 },
      //   'd': { width: 250 },
      //   'e': { width: 100 },
      // },

      // rows: {
      //   '5': { height: 40 },
      //   '6': { height: 30 },
      //   '7': { height: 30 },
      //   '8': { height: 80 },
      // },
      

      // cells: {
      //   'b2': { value: 'Testing color', style: 'c1', },
      //   'c3': { value: 'Cell testing size', style: 'c3', },
      //   'd3': { value: 'Test form for display', colspan: 2, rowspan: 2, style: 'c0', },
      //   'd5': { value: 'Testing upper', rowspan: 4, style: 'c5', },
      //   'e8': { value: 'Testing lowercase', colspan: 2, rowspan: 2, style: 'c6' },
      //   'b10': { value: 'Testing join column', colspan: 4, style: 'c4', },
      //   'a12': { value: 'Testing font-weight', style: 'c2', },
      // },

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
            // borderTop: '2px solid black',
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
            textTransform: 'lowercase',
            borderTop: '2px solid black',
            borderBottom: '2px dashed red',
            borderLeft: '2px solid black',
            borderRight: '2px solid black',
          }
        },
      ],
    };
  },
  computed: {
    columns() { return JSON.parse(this.columnsJSON); },
    rows() { return JSON.parse(this.rowsJSON); },
    cells() { return JSON.parse(this.cellsJSON); },
    // styles() { return JSON.parse(this.stylesJSON); },
  },
  mounted() {
    // console.log(JSON.stringify(this.styles));
    // console.log(JSON.stringify(this.cells));

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
  grid-template-areas: "control-top" "table";
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr;
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
      &_btn {
        align-self: center;
      }
    }
    // border: thin solid green;
  }
  &-table {
    grid-area: table;
    padding: 5px;
    width: calc(100vw - 0px);
    height: calc(100vh - 126px);
  }
  // &-control-right {
  //   grid-area: control-right;
  //   border: thin solid peru;
  // }
  .dialog {
    // position: relative;
    // padding: 10px;
    height: calc(100vh - 65px);
    z-index: 9999;
    &__item {
      padding: 20px;
      height: calc(100vh - 65px);
    }
  }
}
</style>
