<template>
  <div class="data-table-control">
    
    <v-toolbar class="toolbar"
               height="48"
               flat>
      <!-- ACTIONS FOR TABLE -->
      <!-- <v-overlay :value="isLoadingData" opacity="0.02" light z-index="999"></v-overlay> -->
      <data-table-control-table class="toolbar-group"
                                :table-name="tableName"
                                :focused-element="focusedElementForm"
                                :guid="guid"
                                :type-control="typeControl"
                                @blur-element="elementFocusedClear"></data-table-control-table>

      <!-- <v-divider vertical></v-divider> -->
      <data-table-control-element class="toolbar-group"
                                  :table-name="tableName"
                                  :focused-element="focusedElementForm"
                                  :is-mark-deleted-view="isViewRecucleBin"
                                  :guid="guid"
                                  :type-control="typeControl"
                                  @event-mark-deleted="eventMarkDeleted"
                                  @blur-element="elementFocusedClear"></data-table-control-element>
      <!-- <v-divider vertical></v-divider> -->
      <div class="toolbar-group">
        <el-btn-icon icon="mdi-delete-variant"
                     :disabled="isDisabledControl"
                     :icon-color="(isViewRecucleBin) ? 'blue' : ''"
                     @click="toggleRecycleBin" v-if="accessControl.has('recycle')">{{ (isViewRecucleBin) ? 'Выйти из корзины' : 'Показать помеченные на удаление' }}</el-btn-icon>
      </div>
      <!-- <v-divider vertical></v-divider> -->
      <v-spacer></v-spacer> 

      <!-- VIEW TABLE -->
      <data-table-control-view class="toolbar-group"
                               :type-height-number="typeHeightNumber"
                               :type-column="typeColumn"
                               :is-footer="isFooter"
                               :is-expansion="isExpansion"
                               :is-multiline="isMultiline"
                               :is-hierarchy="isHierarchyMode"
                               @toggle-view="toggleView"></data-table-control-view> <!-- -->
      <!-- FILTER TABLE -->
      <v-divider vertical></v-divider>
      <div class="toolbar-group">
        <el-btn-icon icon="mdi-filter-outline" 
                   :icon-color="(isFilterFilds) ? 'blue' : ''"
                   :disabled="isDisabledControl"
                   @click="isDialogFilterShow = !isDialogFilterShow" v-if="accessControl.has('filters')">Фильтр</el-btn-icon>
      </div>
    </v-toolbar>

    <dialog-bar-right is-dialog-name="Фильтр"
                      :is-dialog-show="isDialogFilterShow"
                      width="600"
                      @close-dialog="isDialogFilterShow = false">
      <component :is="componentFilter"
                 :table-name="tableName"
                 :guid="guid"
                 :is-open="isDialogFilterShow"
                 @close-dialog="isDialogFilterShow = false"
                 @accept="isDialogFilterShow = false"></component><!--  -->
    </dialog-bar-right>

    <v-snackbar light
                elevation="4"
                v-model="snackBar.show">
      <div class="snack">
        <v-icon small color="green darken-3" v-if="snackBar.status">mdi-check</v-icon>
        <v-icon small color="red darken-4" v-else>mdi-close</v-icon>
        {{ snackBar.text }}</div>
    </v-snackbar>
  </div>
</template>

<script>
import DataTableControlTable from './DataTableControlTable.vue';
import DataTableControlElement from './DataTableControlElement.vue';
import DataTableControlView from './DataTableControlView.vue';

import { DataTableControl } from './DataTableControl.js';

export default {
  name: 'DataTableControl',
  components: {
    DataTableControlTable,
    DataTableControlView,
    DataTableControlElement,
  },
  mixins: [
    DataTableControl,
  ],
  props: {

    typeHeightNumber: { type: Number, default: 0 },
    typeColumn: { type: String, default: 'fixed' },
    isFooter: { type: Boolean, default: false },
    isExpansion: { type: Boolean, default: false },
    isMultiline: { type: Boolean, default: false },
    // isHierarchy: { type: Boolean, default: false },
  },
  data() {
    return {
      focusedElementForm: null,
      snackBar: {
        show: false,
        text: '',
        status: false,
      },
    }
  },
  watch: {
    focusedElement() {
      // console.log(this.focusedElement);
      this.focusedElementForm = (this.focusedElement != null) ? this.focusedElement : null;
      // (this.focusedElement != null) ? this.focusedElementForm = this.focusedElement : null
    },
  },
  methods: {
    toggleView(option) {
      switch(option) {
        case 'toggle-hierarchy': {
          this.toggleHierarchy();
          break;
        }
        default: this.$emit('toggle-view', option);
      }
      console.log(option);
    },
    toggleHierarchy() {
      this.$store.dispatch('DataTable/TOGGLE_HIERARCHY_MODE', {
        tableName: this.tableName,
        guid: this.guid,
      })
    },
    eventMarkDeleted(option) {
      this.focusedElementForm = null;
      this.snackBar = option;
      setTimeout(() => { this.snackBar.show = false; this.snackBar.text = '' }, 4000);
    },
    elementFocusedClear() {
      this.focusedElementForm = null;
    },
  },
}
</script>

<style lang="scss" scoped>
.data-table-control {
  .toolbar {
    overflow: hidden;
    overflow-x: scroll;
    &::-webkit-scrollbar {
      width: 2px;
      height: 4px;
      border-radius: 4px;
      &-thumb {
        border-radius: 3px;
        background-color: rgba(0,0,0,0.2);
      }
    }
    &-group {
      display: flex;
      flex-wrap: nowrap;
    }
    &-group:last-child {
      margin-right: -10px;
    }
  }
  .snack {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
.dialog {
  &__title {
    color: white;
  }
  &__text {
    font-size: 1em;
    padding: 5px 0px;

    &_bold {
      text-indent: 10px;
      font-weight: bold;
    }
  }
}
::v-deep {
  .v-icon { margin-right: 0px; }
  .v-navigation-drawer--temporary {
    z-index: 9998;
  }
}
</style>