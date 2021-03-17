<template>
  <div class="data-table-lazy">
    <!-- <div class="data-table-lazy__header">
      <data-table-lazy-header :items="headers" 
                              :template="computedTemplateTable"
                              :is-clearable="isClearable"></data-table-lazy-header>
    </div> -->
    <div class="data-table-lazy__body">
      <data-table-lazy-body :headers="headers"
                            :items="items"
                            :template="computedTemplateTable"
                            :is-clearable="isClearable"
                            :input-properties="inputProperties"
                            @focused-row="focusedRow"
                            @input-value="inputValue"
                            @keydown-enter="eventKeydownEnter"
                            @inserting-item="insertingItem"
                            @deleting-item="deletingItem">
      </data-table-lazy-body>
    </div>
    <div class="data-table-lazy__footer">
      <div class="footer-item">Insert - добавить</div>
      <!-- <div class="footer-item">Enter - применить</div> -->
    </div>
  </div>
  
</template>

<script>
import DataTableLazyHeader from './components/DataTableLazyHeader/DataTableLazyHeader.vue';
import DataTableLazyBody from './components/DataTableLazyBody/DataTableLazyBody.vue';

import { ComputedTemplate } from './mixins/ComputedTemplate.js'; // computedTemplateTable
import { EventsComponent } from './mixins/EventsComponent.js';

export default {
  name: 'DataTableLazy',
  components: {
    DataTableLazyHeader,
    DataTableLazyBody,
  },
  mixins: [
    ComputedTemplate,
    EventsComponent,
  ],
  props: {
    headers: Array,
    items: Array,
    isClearable: { type: Boolean, default: false },
    inputProperties: {
      type: Object,
      default() {
        return {}
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import './DataTableLazy.scss';

.data-table-lazy {
  position: relative;
  height: 100%;
  
  font-family: $dtFontFamily;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  // border: $border;
  overflow: auto;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }

  &__header {
    position: sticky;
    top: 0px;
    display: flex;
    z-index: 300;
  }
  &__body {
    position: relative;
    display: flex;
    z-index: 100;
  }
  &__footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    // justify-content: flex-end;
    padding: 10px;
    font-size: .925rem;
    font-style: italic;
    color: rgba(0, 0, 0, .3);
  }
}
</style>