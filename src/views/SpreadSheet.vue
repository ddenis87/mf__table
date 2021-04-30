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
                    :columnCount="sheetSpace.column"
                    :rowCount="sheetSpace.row"></spread-sheet>
    </div>
  </div>
</template>

<script>
import SpreadSheet from '@/components/SpreadSheet/SpreadSheet.vue';

export default {
  name: 'Test',
  components: {
    SpreadSheet,
  },
  data() {
    return {
      isShowDialog: false,
      countColumn: 50,
      countRow: 30000,
      sheetSpace: {
        column: 50,
        row: 30000,
      },
      columnsJSON: `{
        "a":{"width":120,"fixed":"true"},
        "b":{"width":20},
        "c":{"width":20},
        "d":{"width":250,"type":"number"},
        "e":{"width":100},
        "f":{"type":"data"},
        "h":{"columnGroup":"6"},
        "i":{"parent":"h","width":50},
        "j":{"columnGroup":"4","parent":"h"},
        "k":{"parent":"j"},
        "l":{"parent":"j"},
        "m":{"parent":"j"},
        "n":{"width":20}
      }`,
      //  Variant 3
      rowsJSON: `{
        "1":{"fixed":"true"},
        "2":{"fixed":"true"},
        "3":{"type":"choice"},
        "5":{"height":30},
        "6":{"height":30},
        "7":{"height":40},
        "8":{"height":40},
        "14": {"rowGroup": "10"},
        "15": {"parent": "14"},
        "16": {"rowGroup": "7","parent": "14"},
        "17": {"parent": "16"},
        "18": {"parent": "16"},
        "19": {"rowGroup": "3","parent": "16"},
        "20": {"parent": "19"},
        "21": {"parent": "19"},
        "22": {"parent": "16"},
        "23": {"parent": "14"},
        "27": {"rowGroup": "8"},
        "28": {"parent": "27"},
        "29": {"parent": "27"},
        "30": {"rowGroup":"3","parent": "27"},
        "31": {"parent": "30"},
        "32": {"parent": "30"},
        "33": {"parent": "27"},
        "34": {"parent": "27"}
      }`,
      
      cellsJSON: `{
        "k1":{"value":"Text - k1","style":"c1"},
        "l2":{"value":"Text - l2","style":"c1"},
        "a3":{"value":"Type choice in row"},
        "m3":{"value":"Text - m3","style":"c1"},
        "b2":{"value":"Testing color","style":"c1"},
        "c3":{"value":"Cell testing size","style":"c3"},
        "d1":{"value":"Type data in cell","type":"data"},
        "d2":{"value":"Type number in column"},
        "d3":{"value":"Type column","colspan":2,"style":"c0"},
        "h3":{"value":"Open Me","style":"c1"},
        "j4":{"value":"Open Me","style":"c1"},
        "d5":{"value":"Testing upper","rowspan":4,"style":"c5"},
        "e8":{"value":"Testing lowercase","colspan":2,"rowspan":2,"style":"c6"},
        "b10":{"value":"Testing join column","colspan":4,"style":"c4"},
        "a12":{"value":"Testing font-weight","style":"c1"},
        "a14":{"value":"Title group","style":"c2"},
        "a15":{"value":"","style":"c7 c9"},
        "b15":{"value":"","style":"c7"},
        "c15":{"value":"","style":"c7"},
        "d15":{"value":"Test group","style":"c7"},
        "e15":{"value":"","style":"c7"},
        "f1":{"value":"type - data"},
        "f15":{"value":"","style":"c7"},
        "g15":{"value":"","style":"c7 c10"},
        "a16":{"value":"","style":"c9"},
        "c16":{"value":"Test group"},
        "d16":{"value":"Test group","style":"c0 c11"},
        "g16":{"value":"","style":"c10"},
        "h16":{"value":"Разверни меня","style":"c1"},
        "i16":{"value":"Hidden column","style":"c1"},
        "a17":{"value":"","style":"c8 c9"},
        "b17":{"value":"","style":"c8"},
        "c17":{"value":"","style":"c8"},
        "d17":{"value":"","style":"c8"},
        "e17":{"value":"","style":"c8"},
        "f17":{"value":"","style":"c8"},
        "g17":{"value":"Test group","style":"c8 c10"},
        "d19":{"value":"Заголовок вложенной группы","style":"c1"},
        "d20":{"value":"Строка вложенной группы","style":"c1"},
        "d21":{"value":"Строка вложенной группы","style":"c1"},
        "d23":{"value":"Последняя строка группы","style":"c1"},
        "a27":{"value":"Еще одна группа","style":"c1"},
        "a28":{"value":"Строка группы вся оранжевая","style":"c11 c1"}
      }`,
      stylesJSON: `[
        {"name":"c0","list":{"backgroundColor":"orange","color":"white","fontFamily":"Area","fontSize":"0.7em"}},
        {"name":"c1","list":{"color":"green","fontSize":"0.9em"}},
        {"name":"c2","list":{"color":"rgba(240, 0, 0)","fontWeight":"bold"}},
        {"name":"c3","list":{"borderLeft":"2px solid black","borderRight":"2px solid black"}},
        {"name":"c4","list":{"borderTop":"2px solid black","borderBottom":"2px solid black"}},
        {"name":"c5","list":{"textTransform":"uppercase","borderTop":"2px solid black","borderBottom":"2px solid black","borderLeft":"2px solid black","borderRight":"2px solid black"}},
        {"name":"c6","list":{"textTransform":"lowercase","borderTop":"2px solid black","borderBottom":"2px dashed red","borderLeft":"2px solid black","borderRight":"2px solid black"}},
        {"name":"c7","list":{"borderTop":"2px solid black"}},
        {"name":"c8","list":{"borderBottom":"2px solid black"}},
        {"name":"c9","list":{"borderLeft":"2px solid black"}},
        {"name":"c10","list":{"borderRight":"2px solid black"}},
        {"name":"c11","list":{"backgroundColor":"orange","fontSize":"0.5em","fontWeight":"bold","textTransform":"uppercase"}},
      ]`,

      styles: [
        { name: 'c0', list: { backgroundColor: 'orange', color: 'white', fontFamily: 'Area', fontSize: '0.7em', } },
        { name: 'c1', list: { color: 'green', fontSize: '0.9em', } },
        { name: 'c2', list: { fontWeight: 'bold', fontSize: '1em' } },
        { name: 'c3', list: { borderLeft: '2px solid black', borderRight: '2px solid black', } },
        { name: 'c4', list: { borderBottom: '2px solid black', } },
        { name: 'c5', list: {
          textTransform: 'uppercase', borderTop: '2px solid black', borderBottom: '2px solid black',
          borderLeft: '2px solid black', borderRight: '2px solid black', } },
        { name: 'c6', list: {
          textTransform: 'lowercase', borderTop: '2px solid black', borderBottom: '2px dashed red',
          borderLeft: '2px solid black', borderRight: '2px solid black', } },
        { name: 'c7', list: {borderTop:'2px solid black' } },
        { name: 'c8', list: { borderBottom: '2px solid black' } },
        { name: 'c9', list: { borderLeft: '2px solid black' } },
        { name: 'c10', list: { borderRight: '2px solid black' } },
        { name: 'c11', list: { backgroundColor: 'orange', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' } },
      ],
    };
  },
  computed: {
    columns() { return JSON.parse(this.columnsJSON); },
    rows() { return JSON.parse(this.rowsJSON); },
    cells() { return JSON.parse(this.cellsJSON); },
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

  // border: thin solid red;
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
    // border: thin solid black;
  }

  .dialog {
    height: calc(100vh - 65px);
    z-index: 9999;
    &__item {
      padding: 20px;
      height: calc(100vh - 65px);
    }
  }
}
</style>
