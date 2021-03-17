<template>
  <div class="data-table-control">
    <v-toolbar class="toolbar"
               height="40"
               flat>
      <!-- ACTIONS FOR TABLE -->
      <data-table-control-table class="toolbar-group"
                                :table-name="tableName"
                                :focused-element="focusedElementForm"
                                :guid="guid"
                                @blur-element="elementFocusedClear"></data-table-control-table>

      <v-divider vertical></v-divider>
      <data-table-control-element class="toolbar-group"
                                  :table-name="tableName"
                                  :focused-element="focusedElementForm"
                                  :guid="guid"
                                  @event-mark-deleted="eventMarkDeleted"
                                  @blur-element="elementFocusedClear"></data-table-control-element>
      <v-divider vertical></v-divider>
      <div class="toolbar-group">
        <el-btn-icon icon="mdi-delete-variant"
                   :icon-color="(isViewRecucleBin) ? 'blue' : ''"
                   @click="toggleRecycleBin">{{ (isViewRecucleBin) ? 'Выйти из корзины' : 'Показать помеченные на удаление' }}</el-btn-icon>
      </div>
      <v-divider vertical></v-divider>
      <v-spacer></v-spacer> 

      <!-- VIEW TABLE -->
      <data-table-control-view class="toolbar-group"
                               :type-height-number="typeHeightNumber"
                               :type-column="typeColumn"
                               :is-footer="isFooter"
                               :is-expansion="isExpansion"
                               :is-multiline="isMultiline"
                               @toggle-view="(option) => $emit('toggle-view', option)"></data-table-control-view> <!-- -->
      <!-- FILTER TABLE -->
      <v-divider vertical></v-divider>
      <div class="toolbar-group">
        <el-btn-icon icon="mdi-filter-outline" 
                   :icon-color="(isFilterFilds) ? 'blue' : ''"
                   :disabled="!isMountTable"
                   @click="isDialogFilterShow = !isDialogFilterShow">Фильтр</el-btn-icon>
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
// import DialogFullPage from '@/components/Dialogs/DialogFullPage.vue';
// import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue';

// import ElBtnIcon from '@/components/Elements/ElBtn/ElBtnIcon.vue';
import DataTableControlTable from './DataTableControlTable.vue';
import DataTableControlElement from './DataTableControlElement.vue';
import DataTableControlView from './DataTableControlView.vue';

import { DataTableControl } from './DataTableControl.js';
// 
// import DataTableControlActionsTable from './DataTableControlActionsTable.vue';
// import DataTableControlActionsElement from './DataTableControlActionsElement.vue';

export default {
  name: 'DataTableControl',
  components: {
    // DialogFullPage,
    // DialogBarRight,
    // ElBtnIcon,
    DataTableControlTable,
    DataTableControlView,
    // DataTableControlActionsTable,
    DataTableControlElement,
  },
  mixins: [
    DataTableControl,
  ],
  props: {
    // guid: { type: String, default: null },
    // tableName: { type: String, default: null },
    // focusedElement: null,
    // formProperties: Object,

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
      // isOpenFilterExtended: false,
      // isMarkDeleted: false,
      // typeHeight: ['fixed', 'dense', 'auto'],

      snackBar: {
        show: false,
        text: '',
        status: false,
      },
      
    }
  },
  computed: {
    // isMountTable() { return (this.guid) ? true : false },
    // tableName() { return (this.formProperties) ? this.formProperties.tableName : null },
    // componentFilterExtended() {
    //   if (!this.formProperties?.tableName) return null;
    //   return () => import('@/components/DataFilter/DataFilterExtended/DataFilterExtended.vue')
    //   // return () => import('@/components/Filters/DataFilter/DataFilter.vue')
    // },
    // isFilterExtendedActive() {
    //   if (this.formProperties) {
    //     let filterExtended = this.$store.getters[`DataTable/GET_FILTER_EXTENDED`]({tableName: this.formProperties.tableName, guid: this.guid});
    //     console.log(filterExtended);
    //     if (filterExtended == null || filterExtended == '') return false;
    //     else return true;
    //   } else {
    //     return false;
    //   }
    //   // return (this.formProperties) ? (this.$store.getters[`DataTable/GET_FILTER_EXTENDED`]({tableName: this.formProperties.tableName, guid: this.guid}) == null) ? false : true : false;
    // },
  },
  watch: {
    focusedElement() {
      // console.log(this.focusedElement);
      this.focusedElementForm = (this.focusedElement != null) ? this.focusedElement : null;
      // (this.focusedElement != null) ? this.focusedElementForm = this.focusedElement : null
    },
  },
  methods: {
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