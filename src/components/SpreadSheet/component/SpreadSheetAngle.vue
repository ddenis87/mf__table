<template>
  <div class="spread-sheet__angle"
       :class="(isShowTitle) ? 'angle' : 'angle_no-group'"
       :style="angleStyle">
    <div v-if="isShowTitle && maxColumnGrouping"
         class="angle__columnGroup"
         :style="columnGroupStyle">
      <div v-for="levelColumn in maxColumnGrouping"
           class="item item_column"
           :key="levelColumn"
           :data-level="levelColumn">
        <spread-sheet-btn-group @click="evtClickGroupColumn">
          <span class="btn_text">{{ levelColumn }}</span>
        </spread-sheet-btn-group>
      </div>
    </div>
    <div v-if="isShowTitle && maxRowGrouping"
         class="angle__rowGroup"
         :style="rowGroupStyle">
      <div v-for="levelRow in maxRowGrouping"
           class="item"
           :key="levelRow"
           :data-level="levelRow">
        <spread-sheet-btn-group @click="evtClickGroupRow">
          <span class="btn_text">{{ levelRow }}</span>
        </spread-sheet-btn-group>
      </div>
    </div>
    <!-- <div v-if="maxRowGroupingLevel || maxColumnGroupingLevel"
         class="angle__rb"
         :class="{'angle__rb_left': maxRowGroupingLevel
          && maxColumnGroupingLevel, 'angle__rb_top': maxColumnGroupingLevel && isShowTitle}"
         :style="rbStyle"></div> -->
  </div>
</template>

<script>
import {
  CELL_WIDTH_GROUP,
  CELL_HEIGHT_GROUP,
  CELL_HEIGHT_TITLE,
  CELL_WIDTH_TITLE,
} from '../SpreadSheetConst';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetAngle',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    maxRowGroupingLevel: { type: Number, default: 0 },
    maxColumnGroupingLevel: { type: Number, default: 0 },
    isShowGroup: { type: Boolean, default: true },
    isShowTitle: { type: Boolean, default: true },
  },
  computed: {
    maxRowGrouping() {
      return (this.isShowGroup) ? this.maxRowGroupingLevel : 0;
    },
    maxColumnGrouping() {
      return (this.isShowGroup) ? this.maxColumnGroupingLevel : 0;
    },
    angleStyle() {
      // let angleStyle = {
      //   'grid-template-rows': `${(this.maxColumnGroupingLevel * CELL_HEIGHT_GROUP) + 4}px 1fr`,
      //   'grid-template-columns': `${(this.maxRowGroupingLevel * CELL_WIDTH_GROUP) + 4}px 1fr`,
      // };
      let angleStyle = {
        'grid-template-rows': `1fr ${CELL_HEIGHT_TITLE - 1}px`,
        'grid-template-columns': `1fr ${CELL_WIDTH_TITLE - 2}px`,
      };
      if (this.maxColumnGroupingLevel === 0) {
        angleStyle['grid-template-areas'] = '"rowGroup rb"';
        angleStyle['grid-template-rows'] = '1fr';
        angleStyle['grid-template-columns'] = `1fr ${CELL_WIDTH_TITLE - 2}px`;
        // angleStyle['padding-bottom'] = '2px';
      }
      if (!this.isShowTitle) {
        angleStyle = {
          'grid-template-rows': '1fr',
          'grid-template-columns': '1fr',
        };
      }
      return angleStyle;
    },
    columnGroupStyle() {
      const columnGroupStyle = {
        'grid-template-rows': `repeat(${this.maxColumnGroupingLevel}, ${CELL_HEIGHT_GROUP}px)`,
        // 'grid-template-columns': `${CELL_WIDTH_TITLE}px`,
        // 'grid-template-columns': '1fr',
      };
      return columnGroupStyle;
    },

    rowGroupStyle() {
      const rowGroupStyle = {
        'grid-template-columns': `repeat(${this.maxRowGroupingLevel}, ${CELL_WIDTH_GROUP}px)`,
        'grid-template-rows': `${CELL_HEIGHT_TITLE}px`,
      };
      if (this.maxColumnGroupingLevel === 0) {
        rowGroupStyle['padding-top'] = '2px';
        rowGroupStyle['align-items'] = 'flex-start';
      }
      return rowGroupStyle;
    },

    rbStyle() {
      const rbStyle = {};
      return rbStyle;
    },
  },
  methods: {
    evtClickGroupColumn(evt) {
      const level = evt.target.closest('.item').getAttribute('data-level');
      this.$emit('open-group:column', +level);
    },
    evtClickGroupRow(evt) {
      const level = evt.target.closest('.item').getAttribute('data-level');
      this.$emit('open-group:row', +level);
    },
  },
};
</script>

<style lang="scss" scoped>
.angle {
  display: grid;
  grid-template-areas: "lt columnGroup"
                       "rowGroup rb";
  font-size: .7em;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  &_no-group {
    grid-template-areas: "lt";
  }
  &__columnGroup {
    grid-area: columnGroup;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: end;
    align-items: end;
    padding-right: 4px;
    border-bottom: thin solid grey;
    // box-shadow: 0px 3px 0px grey;
  }
  &__rowGroup {
    position: relative;
    grid-area: rowGroup;
    display: grid;
    justify-items: end;
    align-items: start;
  //   padding-top: 3px;
    border-right: thin solid grey;
    // box-shadow: 3px 0px 0px grey;
    &::after {
      content: '';
      position: absolute;
      right: -1px;
      top: -1px;
      left: 0px;
      bottom: -1px;
      // border-top: thin solid grey;
      border-right: thin solid grey;
      pointer-events: none;
    }
  }
  &__rb {
  //   // top: 2px;
    position: relative;
    grid-area: rb;
    box-sizing: border-box;
    // border-left: thin solid grey;
    // border-top: thin solid grey;
  //   &_left {
  //     border-left: thin solid grey;
  //     &::after {
  //       // border-left: thin solid grey;
  //     }
    // }
  //   &_top {
  //     border-top: thin solid grey;
  //     &::after {
  //       // border-top: thin solid grey;
  //     }
  //   }
    // &::after {
    //   content: '';
    //   position: absolute;
    //   left: -1px;
    //   top: -1px;
    //   width: 5px;
    //   height: 5px;
    //   border-top: thin solid grey;
    //   border-left: thin solid grey;
    // }
  }
  // .item {
  //   display: flex;
  //   justify-content: flex-end;
  //   &_column {
  //     align-items: flex-end;
  //     padding-right: 4px;
  //   }
  // }
}
</style>
