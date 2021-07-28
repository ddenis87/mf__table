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
                       "group-rows rb";
  grid-template-columns: 1fr 60px;
  grid-template-rows: 1fr 22px;
  height: 100%;
  font-size: 0.7em;

  &_hidden {
    display: none;
  }
  .group {
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: flex-end;

    &__columns {
      grid-area: group-columns;
      flex-direction: column;
      padding-right: 2px;
    }

    &__rows {
      grid-area: group-rows;
      flex-direction: row;
      padding-bottom: 2px;
      align-items: center;
    }

    &__item {
      align-items: center;
      width: 16px;
      height: 16px;
      border: thin solid grey;
    }
  }
  .btn_text {
    font-family: $fontFamily;
    color: $headFontColor;
  }
}
</style>
