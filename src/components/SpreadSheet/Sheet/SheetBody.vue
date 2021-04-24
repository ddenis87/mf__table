<template>
  <div @click="eventClickBody">
    <virtual-list class="sheet-body"
                  style="height: calc(100vh - 202px); overflow-y: auto; width: calc(100vw - 10px);"
                  :keeps="100"
                  :data-key="'value'"
                  :data-sources="rows"
                  :data-component="sheetBodyItem"
                  :extra-props="extraPropsComponent"
                  @scroll="scrollBodyX">
    </virtual-list>
  </div>
</template>

<script>
import SheetBodyItem from './SheetBodyItem.vue';

export default {
  name: 'SheetBody',
  props: {
    rows: { type: Array },
    columns: { type: Array },
    cells: { type: Object },
    templateRow: { type: String, default: '' },
    maxLevelGroupRow: { type: Number, default: 0 },
    setExcludedCell: { type: Array },
  },
  data() {
    return {
      sheetBodyItem: SheetBodyItem,
    };
  },
  computed: {
    extraPropsComponent() {
      return {
        columns: this.columns,
        cells: this.cells,
        templateRow: this.templateRow,
        setExcludedCell: this.setExcludedCell,
        maxLevelGroupRow: this.maxLevelGroupRow,
      };
    },
  },

  methods: {
    scrollBodyX(evt) {
      this.$emit('scroll-body-x', evt.target.scrollLeft);
    },
    eventClickBody(evt) {
      console.log(evt);
      if (evt.target.closest('button') && evt.target.closest('button').getAttribute('data-row-parent')) {
        this.toggleRowGroup(evt.target.closest('button'));
        return true;
      }
      this.selectedCell(evt);
      return true;
    },
    toggleRowGroup(target) {
      this.$emit('toggle-row-group', {
        value: +target.getAttribute('data-row-parent'),
        index: +target.getAttribute('data-row-index'),
        count: +target.getAttribute('data-row-count'),
        status: target.getAttribute('data-row-status'),
        target,
      });
    },

    // selectedCell(evt) {
    //   if (!evt.target.closest('.column-body')) return;
    //   if (this.currentSelectedCell === evt.target) return;
    //   if (this.currentSelectedCell) this.currentSelectedCell.classList.remove('selected');
    //   evt.target.classList.add('selected');
    //   this.currentSelectedCell = evt.target;
    // },
  },
};
</script>

<style lang="scss" scoped>
@import './Variables.scss';
.sheet-body {
  &::-webkit-scrollbar {
    display: block;
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }
}
//     }
//     .line {
//       &::before {
//         content: '';
//         position: absolute;
//         // left: 11px;
//         border-left: thin solid #3F3F3F;
//         background-color: #3F3F3F;
//         width: 0px;
//         height: 100%;
//         top: 0px;
//       }
//     }
//     .selected::before {
//       content: '';
//       position: absolute;
//       top: 0px;
//       right: 0px;
//       bottom: 0px;
//       left: 0px;
//       // box-shadow: inset -1px -2px 0px #1a73e8, inset 2px 1px 0px #1a73e8;
//       border: 1px solid #1a73e8;
//       border-bottom: 2px solid #1a73e8;
//       border-right: 2px solid #1a73e8;
//       // z-index: 9999;
//       // box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
//     }
//   }
// }
</style>
