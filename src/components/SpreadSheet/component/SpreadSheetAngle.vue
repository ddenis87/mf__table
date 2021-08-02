<template>
  <div class="spread-sheet__angle"
       :class="(isShowTitle) ? 'angle' : 'angle_no-group'"
       :style="angleStyle">
    <div v-if="isShowTitle" class="angle__columnGroup"
         :style="columnGroupStyle">
      <div v-for="levelColumn in maxColumnGroupingLevel"
           class="item item_column"
           :key="levelColumn"
           :data-level="levelColumn">
        <spread-sheet-btn-group @click="evtClickGroupColumn">
          <span class="btn_text">{{ levelColumn }}</span>
        </spread-sheet-btn-group>
      </div>
    </div>
    <div v-if="isShowTitle" class="angle__rowGroup"
         :style="rowGroupStyle">
      <div v-for="levelRow in maxRowGroupingLevel"
           class="item"
           :key="levelRow"
           :data-level="levelRow">
        <spread-sheet-btn-group @click="evtClickGroupRow">
          <span class="btn_text">{{ levelRow }}</span>
        </spread-sheet-btn-group>
      </div>
    </div>
    <div v-if="maxRowGroupingLevel || maxColumnGroupingLevel"
         class="angle__rb"
         :class="{'angle__rb_left': maxRowGroupingLevel
          && maxColumnGroupingLevel, 'angle__rb_top': maxColumnGroupingLevel && isShowTitle}"
         :style="rbStyle"></div>
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
    isShowTitle: { type: Boolean, default: true },
  },
  computed: {
    angleStyle() {
      let angleStyle = {
        'grid-template-rows': `${this.maxColumnGroupingLevel * CELL_HEIGHT_GROUP + 2.5}px 1fr`,
        'grid-template-columns': `${(this.maxRowGroupingLevel * CELL_WIDTH_GROUP + 4)}px 1fr`,
      };
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
        'grid-template-columns': `${CELL_WIDTH_TITLE}px`,
      };
      return columnGroupStyle;
    },

    rowGroupStyle() {
      const rowGroupStyle = {
        'grid-template-columns': `repeat(${this.maxRowGroupingLevel}, ${CELL_WIDTH_GROUP}px)`,
        'grid-template-rows': `${CELL_HEIGHT_TITLE}px`,
      };
      if (this.maxColumnGroupingLevel === 0) {
        rowGroupStyle['padding-top'] = '0px';
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
  &_no-group {
    grid-template-areas: "lt";
  }
  &__columnGroup {
    grid-area: columnGroup;
    display: grid;
  }
  &__rowGroup {
    grid-area: rowGroup;
    display: grid;
    padding-top: 2px;
  }
  &__rb {
    position: relative;
    grid-area: rb;
    &_left {
      &::after {
        border-left: thin solid grey;
      }
    }
    &_top {
      &::after {
        border-top: thin solid grey;
      }
    }
    &::after {
      content: '';
      position: absolute;
      left: 0px;
      top: 1px;
      right: 0px;
      bottom: 0px;
    }
  }
  .item {
    display: flex;
    justify-content: flex-end;
    &_column {
      align-items: flex-end;
      padding-right: 4px;
    }
  }
}
</style>
