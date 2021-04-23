<template>
  <div class="sheet-head">
    <template v-for="level in columnLevelGroupMax">
      <div :key="level"
           class="sheet-head__row"
           :style="[{
              'grid-template-columns': `${templateRowBody} 8px`,
              'grid-template-rows': `${'22'}px`,
            }]">
        <template v-for="column in columns">
          <div :key="`head-group-${column.value}`"
               class="column column-group"
               :style="getColumnStyle(column.value)">
            <spread-sheet-btn-group v-if="isColumnGroupLevel(column, level)">
              mdi-plus-box-outline</spread-sheet-btn-group>
          </div>
        </template>
        <div class="column column-group column-end"></div>
      </div>
    </template>

    <div class="sheet-head__row"
         :style="[{
            'grid-template-columns': `${templateRowBody} 8px`,
            'grid-template-rows': `${'22'}px`,
          }]">
      <template v-for="column in columns">
        <div :key="`head-title-${column.value}`"
             class="column column-title"
             :style="getColumnStyle(column.value)">{{ column.display_name }}</div>
      </template>
      <div class="column column-title column-end"></div>
    </div>
  </div>
</template>

<script>
import SheetComponent from './SheetComponent';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SheetHead',
  components: {
    SpreadSheetBtnGroup,
  },
  mixins: [
    SheetComponent,
  ],
  props: {
    columns: { type: Array },
    columnLevelGroupMax: { type: Number, default: 0 },
    // setCharacter: { type: Array },
  },
  computed: {
    templateRowBody() {
      let templateRowBody = '';
      for (let i = 0; i < this.columns.length; i += 1) {
        templateRowBody += `${this.columns[i].width || 94}px `;
      }
      console.log(templateRowBody);
      return templateRowBody;
    },
  },
  methods: {
    isColumnGroupLevel(column, level) {
      if (!Object.keys(column).includes('columnGroup')) return false;
      return (level === this.getColumnLevel(column) + 1);
    },
    getColumnLevel(column) {
      let level = 0;
      let currentColumn = column;
      let condition = true;
      while (condition) {
        if (!Object.keys(currentColumn).includes('parent')) { condition = false; return level; }
        level += 1;
        currentColumn = this.columns.find((item) => item.value === currentColumn.parent);
      }
      return level;
    },
    getColumnStyle(columnNumber) {
      return {
        ...this.getColumnWidth(columnNumber),
      };
    },
    getColumnWidth(columnNumber) {
      const column = this.columns.find((item) => item.value === columnNumber);
      return {
        'max-width': `${column.width}px`,
        'min-width': `${column.width}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sheet-head {
  position: relative;
  display: block;
  // margin-right: 18px;
  // width: 100%;
  overflow-x: scroll;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  &__row {
    position: relative;
    display: grid;
    // grid-auto-rows: minmax(22px, 22px);
    .column {
      display: flex;
      font-size: 0.75em;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
      background-color: #dadce0;
      &-group {
        // background-color: #dadce0;
        &:last-child {
          border-right: thin solid grey;
        }
      }
      &-title {
        // background-color: #dadce0;
        border: thin solid grey;
        border-left: 0px;
        // box-shadow:  inset 1px 0px 0px grey, inset -1px 0px 0px grey, 0px -1px 0px grey;
        // border-top: 0px;
        // width: 60px;
        &:first-child {
          border-left: 0px;
        }
      }
      &-end {
        // border: 0px;
        // box-shadow: 1px 0px 0px grey;
        // border-left: thin solid grey;
        border-right: thin solid grey;
      }
    }
    &:first-child {
      .column {
        &-group {
          box-shadow:  inset 0px 1px 0px grey;
        }
      }
    }
  }
}
// .sheet-head {
//   position: relative;
//   border-collapse: collapse;
//   width: 100%;
//   font-size: 0.75em;
//   color: rgba(0, 0, 0, 0.6);
//   text-align: center;
//   &__row {
//     .sheet-head__column {
//       min-width: 94px;
//       height: 22px;
//       // border-right: thin solid grey;
//       box-shadow: inset -1px 0px 0px grey, inset 0px -1px 0px grey, 0px -1px 0px grey;
//       background-color: #dadce0;
//       &:first-child {
//         border-left: 0px;
//       }
//     }
//   }
//   &__row-group {
//     .sheet-head__column-group {
//       min-width: 94px;
//       height: 22px;
//       background-color: #dadce0;
//       &:last-child {
//         border-right: thin solid grey;
//       }
//     }
//     &:first-child {
//       .sheet-head__column-group {
//         border-top: thin solid grey;
//       }
//     }
//   }
// }
</style>
