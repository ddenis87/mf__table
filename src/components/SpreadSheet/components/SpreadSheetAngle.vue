<template>
  <div class="angle"
       :class="{'angle_hidden': !isShowTitle}">
    <div class="group group__columns">
      <div v-for="levelColumn in maxColumnGroupingLevel"
           class="group group__item"
           :key="levelColumn"
           :data-level="levelColumn">
        <spread-sheet-btn-group @click="evtClickGroupColumn">
          <span class="btn_text">{{ levelColumn }}</span>
        </spread-sheet-btn-group>
      </div>
    </div>
    <div class="group group__rows">
      <div v-for="levelRow in maxRowGroupingLevel"
           class="group group__item"
           :key="levelRow"
           :data-level="levelRow">
        <spread-sheet-btn-group @click="evtClickGroupRow">
          <span class="btn_text">{{ levelRow }}</span>
        </spread-sheet-btn-group>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CELL_WIDTH_LEFT_GROUP,
  CELL_WIDTH_LEFT_TITLE,
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
        'grid-template-columns': `repeat(${this.maxRowGroupingLevel}, minmax(${CELL_WIDTH_LEFT_GROUP}px,${CELL_WIDTH_LEFT_GROUP}px)`,
      };
      if (this.isShowTitle) rowStyle['grid-column'] += ` ${CELL_WIDTH_LEFT_TITLE}px`;
      console.log(rowStyle);
      return rowStyle;
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
      display: flex;
      grid-area: group-columns;
      flex-direction: column;
      padding-right: 2px;
    }

    &__rows {
      // padding-bottom: 1px;
      // margin-left: -1px;
      // gap: 1px;
      grid-area: group-rows;
      display: grid;
      grid-row: 22px;
      grid-template-columns: repeat(4, 20px);
      justify-items: center;
    }

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
    }
  }
  .btn_text {
    font-family: $fontFamily;
    color: $headFontColor;
  }
}
</style>
