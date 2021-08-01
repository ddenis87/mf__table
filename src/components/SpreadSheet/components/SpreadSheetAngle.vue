<template>
  <div class="angle"
       :class="{'angle_hidden': !isShowTitle}">
    <div class="group group__columns"
         :style="groupColumnStyle">
      <div v-for="levelColumn in maxColumnGroupingLevel"
           class="group group__item"
           :key="levelColumn"
           :data-level="levelColumn">
        <spread-sheet-btn-group @click="evtClickGroupColumn">
          <span class="btn_text">{{ levelColumn }}</span>
        </spread-sheet-btn-group>
      </div>
    </div>
    <div class="group group__rows"
         :style="groupRowStyle">
      <div v-for="levelRow in maxRowGroupingLevel"
           class="group group__item"
           :key="levelRow"
           :data-level="levelRow">
        <spread-sheet-btn-group @click="evtClickGroupRow">
          <span class="btn_text">{{ levelRow }}</span>
        </spread-sheet-btn-group>
      </div>
      <div class="group group__angle"></div>
    </div>
  </div>
</template>

<script>
import {
  CELL_WIDTH_LEFT_GROUP,
  CELL_WIDTH_LEFT_TITLE,
  CELL_HEIGHT_GROUP,
  // CELL_HEIGHT,
} from '../SpreadSheetConst';
import SpreadSheetBtnGroup from './SpreadSheetBtnGroup.vue';

export default {
  name: 'SpreadSheetAngle',
  components: {
    SpreadSheetBtnGroup,
  },
  props: {
    maxColumnGroupingLevel: { type: Number, default: 0 },
    maxRowGroupingLevel: { type: Number, default: 0 },
    isShowTitle: { type: Boolean, default: true },
  },
  computed: {
    groupRowStyle() {
      const rowStyle = {
        'grid-template-columns': `repeat(${this.maxRowGroupingLevel}, minmax(${CELL_WIDTH_LEFT_GROUP}px, ${CELL_WIDTH_LEFT_GROUP}px))`,
      };
      if (this.isShowTitle) rowStyle['grid-template-columns'] += ` ${CELL_WIDTH_LEFT_TITLE}px`;
      return rowStyle;
    },
    groupColumnStyle() {
      const columnStyle = {
        'grid-template-rows': `repeat()${this.maxColumnGroupingLevel}, minmax(${CELL_HEIGHT_GROUP}, ${CELL_HEIGHT_GROUP})`,
      };
      // if (this.isShowTitle) columnStyle['grid-template-rows'] += ` ${CELL_HEIGHT}px`;
      return columnStyle;
    },
  },
  methods: {
    evtClickGroupColumn(evt) {
      const level = evt.target.closest('.group__item').getAttribute('data-level');
      this.$emit('open-group:column', +level);
    },
    evtClickGroupRow(evt) {
      const level = evt.target.closest('.group__item').getAttribute('data-level');
      this.$emit('open-group:row', +level);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../SpreadSheet.scss';

.angle {
  display: grid;
  grid-template-areas: "lt group-columns"
                       "group-rows group-rows";
  grid-template-columns: 1fr 60px;
  grid-template-rows: 1fr 22px;
  height: 100%;
  font-size: 0.7em;

  &_hidden {
    display: none;
  }
  .group {
    gap: 0px;
    align-items: flex-end;
    &__columns {
      grid-area: group-columns;
      display: grid;
      grid-column: 22px;
      justify-content: end;
      // flex-direction: column;
      padding-bottom: 2px;
    }

    &__rows {
      grid-area: group-rows;
      display: grid;
      grid-row: 22px;
      justify-items: center;
    }

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
    }
    &__angle {
      position: relative;
      padding-top: 1px;
      padding-left: 1px;
      width: 100%;
      height: 100%;
      // border-top: thin solid grey;
      // border-left: thin solid grey;
      // box-shadow: 1px 0px 0px grey;
      &::after {
        position: absolute;
        content: '';
        left: 2px;
        top: 1px;
        width: 100%;
        height: 100%;
        border-top: thin solid grey;
        border-left: thin solid grey;
      }
    }
  }
  .btn_text {
    font-family: $fontFamily;
    color: $headFontColor;
  }
}
</style>
