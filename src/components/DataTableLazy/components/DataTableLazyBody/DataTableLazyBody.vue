<template>
  <div class="body" 
       @mouseover="eventMouseOver"
       @mouseout="eventMouseOut"
       >

    <div v-for="(itemRow, indexRow) in items"
          class="body-row"
          :key="`body-row-${indexRow}`"
          :style="template"
          
          @focus="(event) => eventRowFocus(event, itemRow)"
          @blur="eventRowBlur"
          @click="(event) => eventRowClick(event, itemRow)">

      <!-- <div class="body-column p-pp">{{ indexRow + 1 }}</div> EMPTY FIRST COLUMN -->

      <div v-for="(itemColumn, indexColumn) in headers"
           class="body-column"
           :key="`body-column-${indexColumn}`"
           :style="itemColumn.position_in_template"
           
           @focus="eventColumnFocus"
           @blur="eventColumnBlur">
        <div class="body-column__item">
          <component :is="componentField"
                     :is-hide-underline="true"
                     :is-single-line="true"
                     :is-hide-message="true"
                     :is-required-off="true"
                     :is-hide-label="true"
                     :is-selected="true"
                     :is-btn-clear="true"
                     :input-properties="inputProperties" 
                     :key="itemRow.uniqueIndex"
                     v-model="tableValue[itemRow.uniqueIndex]"
                     @input-value="eventInputValue"
                     @keydown-any="eventKeydown"
                     @keydown-enter="eventKeyEnter"
                     @clear-value="() => deletingItem(indexRow, itemRow.uniqueIndex)"
                     ></component>
        </div>
      </div>
    </div>

    <!-- <div class="body-row">
      <div class="body-column">
        <div class="body-column__message">Insert - для добавления</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { DataTableLazyBodyEvents } from './DataTableLazyBodyEvents.js';
// import ElButtonIcon from '@/components/Elements/ElBtnIcon.vue';

export default {
  name: 'DataTableLazyBody',
  mixins: [
    DataTableLazyBodyEvents,
  ],
  components: {
    // ElButtonIcon,
  },
  props: {
    headers: Array,
    items: Array,
    template: Object,
    isClearable: { type: Boolean, default: false },
    inputProperties: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      messageInserting: '',
      tableValue: {},
    }
  },
  computed: {

    componentField() {
      switch(this.inputProperties.type) {
        case 'choice': return () => import('@/components/Elements/ElField/ElFieldChoice.vue');
        case 'field': return () => import('@/components/Elements/ElField/ElFieldDialog.vue');
      }
    }
  },
  methods: {

    eventInputValue() {
      this.$emit('input-value', this.tableValue);
      // console.log(value);
      // console.log(this.tableValue);
    },
    eventKeydown(event) {
      // console.log(event);
      if (event.key == 'Insert') this.$emit('inserting-item', event);
      if (event.key == 'Tab') event.stopPropagation();
    },
    eventKeyEnter(value) {
      // console.log('enter');
      // console.log(value);
      this.$emit('keydown-enter');
      // console.log(value);
      // console.log(value.event);
      // value.event.target.closest('.body').focus();
    },
    deletingItem(indexRow, indexTableValue) {
      this.$emit('deleting-item', indexRow);
      delete this.tableValue[indexTableValue];
      this.$emit('input-value', this.tableValue);
      // document.getElementById(`column-component-${indexRow}`).remove();
    },
    eventKeyBody(event) {
      console.log(event);
      if (event.key == 'Insert') { this.$emit('insert-item'); }
    }
  },
}
</script>

<style lang="scss" scoped>
@import './DataTableLazyBody.scss';

.body {

  font-size: $fontSize;
  font-weight: $fontWeight;
  color: $fontColor;

  box-sizing: border-box;
  &-empty {
    font-size: .875rem;
    font-weight: bold;
    color: rgba(0, 0, 0, .6);
    padding: 5px 10px;
  }
  &-row {
    display: grid;
    grid-template-rows: 32px;
    // border-bottom: $rowBorder;
    outline: none;
    transition-delay: .05s;

    // &_hover { background-color: $rowBackgroundHover; }
    // &_focus { background-color: $rowBackgroundFocus; }

    .body-column {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0px 10px;
      // padding-left: 10px;
      border: thin solid rgba(0, 0, 255, 0);
      // border-right: $rowBorder;
      outline: none;
      overflow: hidden;
      &:last-child { border-right: 0px; }
      // &_focus { border: $columnBorderFocus; }
      // &_editing { background-color: white; }

      &__item {
        width: 100%;
        // margin-bottom: -2px;
        // padding-right: 42px;
        z-index: 999;
      }
      // &__message {
      //   font-size: .925rem;
      //   font-style: italic;
      //   color: rgba(0, 0, 0, .3);
      // }
    }
    .p-pp { grid-area: p-pp; }
    .p-clear {
      grid-area: p-clear;
      display: flex;
      justify-content: center;
      padding: 0px;
      margin-left: -2px;
    }
  }
}
</style>