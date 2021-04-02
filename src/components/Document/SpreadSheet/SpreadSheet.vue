<template>
  <div class="spread-sheet">
    <table class="table" @click="selectedCell" @mouseup="selectedCellEnd">
      <thead>
        <tr class="head-row">
          <th class="head-column head-column__title"></th>
          <th v-for="j in 50"
              :key="`head-column-${j}`"
              class="head-column">{{ getTitleForNumberColumn(j) }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in 50"
            :key="`body-row-${i}`"
            class="body-row">
          <td class="body-column body-column__title">{{ i }}</td>
          <cell v-for="j in 50"
                :key="`body-column-${j}`"
                class="body-column"
                :cellProperties="cellProperties(`cell_${i}_${j}`)"
                :data-cell-name="`cell_${i}_${j}`"></cell>
        </tr>
      </tbody>
    </table>
  </div>
  
</template>

<script>
import Cell from './components/Cell.vue';
export default {
  name: 'SpreadSheet',
  components: {
    Cell,
  },
  props: {
    // Boolean, можно ли выбирать
  },
  data() {
    return {
      currentSelectedCell: null,
      setChar: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      dataJson: {
        cell_4_7: {  // имя А1
          // защита ечейки
          value: 'Cell testing', // значение на определенного типа
          style: { // попробовать в класс стиля
            'background-color': 'grey',
            'color': 'white',
          }
        },
        cell_10_13: {
          colspan: '2',
          rowspan: '1',
          
          value: '21-03-2021',
          style: {
            'color': 'green',
          }
        },
        cell_6_3: {
          colspan: '1',
          rowspan: '3',
          value: 'Cell.. testing.. union... row.....',
          style: {
            'color': 'grey',
          }
        },
      }
    }
  },
 
  methods: {
    cellProperties(cellName) {
      if (Object.keys(this.dataJson).includes(cellName)) return this.dataJson[cellName];
      return {};
    },

    cellValue(cellName) {
      if (Object.keys(this.dataJson).includes(cellName)) return this.dataJson[cellName].value;
    },
    cellStyle(cellName) {
      if (Object.keys(this.dataJson).includes(cellName)) return this.dataJson[cellName].style;
      return {};
    },
    selectedCell(event) {
      if (this.currentSelectedCell == event.target) return;
      if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('body-column__selected');
      event.target.classList.add('body-column__selected')
      this.currentSelectedCell = event.target;
    },
    selectedCellStart() {
      // console.log(event.target);
    },
    selectedCellEnd() {
      // console.log(event.target);
    },

    getTitleForNumberColumn(number) {
      if (number > 702) return 'Infinity';
      if (number <= this.setChar.length) return this.setChar[number - 1];
      if ((number % this.setChar.length) == 0) return `${this.setChar[((number - this.setChar.length) / this.setChar.length) - 1]}${this.setChar[this.setChar.length - 1]}`;
      return `${this.setChar[(Math.floor(number / this.setChar.length)) - 1]}${this.setChar[(number % this.setChar.length) - 1]}`;
    }
  }
}
</script>

<style lang="scss" scoped>
$scrollWidth: 8px;
$scrollHeight: 8px;
$scrollBorderRadius: 4px;
$scrollThumbBorderRadius: 3px;
$scrollThumbBackgroundColor: rgba(0,0,0,0.2);

$borderRadius: 0px 0px 4px 4px;
$boxShadow: 0 -1px 1px -1px rgba(0,0,0,.2), 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);

.spread-sheet {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }

  .table {
    position: relative;
    border-collapse: collapse;
    table-layout: fixed;
    font-family: Arial, Helvetica, sans-serif;
    
    font-size: 16px;
    thead {
      position: sticky;
      top: 0px;
      .head-row {
        
        height: 24px;
        font-size: 0.75em;
        background-color: rgba(0, 0, 0, 0.1);
        color: rgba(0, 0, 0, 0.5);
        .head-column {
          padding: 2px;
          min-width: 94px;
          border: thin solid grey;
          &__title {
            min-width: 60px;
          }
        }
      }
    }
    
    tbody {
      .body-row {
        height: 32px;
        box-sizing: border-box;
        .body-column {
          position: relative;
          padding: 2px 3px;
          font-size: 0.8em;
          border-bottom: thin solid grey;
          border-left: thin solid grey;
          box-sizing: border-box;
          &__title {
            border-bottom: thin solid grey;
            border-left: thin solid grey;
            text-align: center;
            font-size: 0.75em;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.1);
            color: rgba(0, 0, 0, 0.5);
          }
          &__selected::after {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px; 
            bottom: 0px;    
            left: 0px;
            border: 2px solid #1a73e8;

            // border: 2px solid #1a73e8;
            // border-top: 2px solid #1a73e8;
            // border-left: 2px solid #1a73e8;
            box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
          }
        }
      }
    }
    
  }
  

}
</style>