<template>
  <div class="sheet-head" @click="eventClickHead">
    <template v-for="level in maxLevelGroupColumn">
      <div :key="level"
           class="sheet-head__row"
           :style="[{
             'grid-template-columns': `${templateRow} 8px`,
             'grid-template-rows': `${'22'}px`,
           }]">
        <template v-for="(column, index) in columns">
          <div :key="`head-group-${column.value}`"
               class="column column-group"
               :class="{
                 'line-start': (column.openGroup === true && column.columnLevel === level - 1),
                 'line': (column.parent && level <= column.columnLevel),
                 'line-end': (column.columnGroupEnd),
               }"
               :style="{'width': column.width}">
            <sheet-btn-group v-if="isColumnGroup(column, level)"
                             :data-column-index="index"
                             :data-column-parent="column.value"
                             :data-column-count="column.columnGroup - 1"
                             :data-column-status="column.openGroup">
              {{ (column.openGroup) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
            </sheet-btn-group>
          </div>
        </template>
        <div class="column column-group column-end"></div>
      </div>
    </template>

    <div class="sheet-head__row"
         :style="[{
            'grid-template-columns': `${templateRow} 8px`,
            'grid-template-rows': `${'22'}px`,
          }]">
      <template v-for="column in columns">
        <div :key="`head-title-${column.value}`"
             class="column column-title"
             :style="{'width': column.width}">{{ column.display_name }}</div>
      </template>
      <div class="column column-title column-end"></div>
    </div>
  </div>
</template>

<script>
import SheetBtnGroup from './SheetBtnGroup.vue';

export default {
  name: 'SheetHead',
  components: {
    SheetBtnGroup,
  },
  props: {
    columns: { type: Array },
    maxLevelGroupColumn: { type: Number, default: 0 },
    templateRow: { type: String, default: '' },
  },
  methods: {
    eventClickHead(evt) {
      if (evt.target.closest('button') && evt.target.closest('button').getAttribute('data-column-parent')) {
        this.toggleColumnGroup(evt.target.closest('button'));
      }
    },
    toggleColumnGroup(target) {
      this.$emit('toggle-column-group', {
        value: +target.getAttribute('data-column-parent'),
        index: +target.getAttribute('data-column-index'),
        count: +target.getAttribute('data-column-count'),
        status: !!target.getAttribute('data-column-status'),
        target,
      });
    },
    isColumnGroup(column, level) {
      return (Object.keys(column).includes('columnGroup') && level === column.columnLevel + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Variables.scss';

.sheet-head {
  position: relative;
  display: block;
  overflow-x: scroll;
  font-size: $headFontSize;
  font-weight: $headFontWeight;
  color: $headFontColor;
  &::-webkit-scrollbar {
    display: none;
  }
  &__row {
    position: relative;
    display: grid;
    .column {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $backgroundColor;
      &-group {
        &:last-child {
          border-right: $borderStyle;
        }
      }
      &-title {
        border: $borderStyle;
        border-left: 0px;
        cursor: default;
        &:first-child {
          border-left: 0px;
        }
      }
      &-end {
        border-right: $borderStyle;
      }
    }
    .line-start {
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        right: 0px;
        width: calc(50% - 5px);
        height: 0px;
        border-bottom: thin solid #3F3F3F;
        background-color: #3F3F3F;
      }
    }
    .line {
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        width: 100%;
        height: 0px;
        border-bottom: thin solid #3F3F3F;
        background-color: #3F3F3F;
      }
    }
    .line-end {
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        width: 100%;
        height: 10px;
        border: 0;
        border-right: 1px solid #3F3F3F;
        border-top: 1px solid #3F3F3F;
        background-color: unset;
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
</style>
