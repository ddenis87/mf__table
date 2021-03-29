import ElBtnIcon from '@/components/Elements/ElBtn/ElBtnIcon.vue';
import DialogFullPage from '@/components/Dialogs/DialogFullPage.vue';
import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue';

import DataTableControlActions from './DataTableControlActions.vue';
import DataTableControlViews from './DataTableControlViews.vue';

export const DataTableControl = {
  components: {
    ElBtnIcon,
    DialogFullPage,
    DialogBarRight,

    DataTableControlActions,
    DataTableControlViews,
  },
  props: {
    tableName: { type: String, default: null },
    guid: { type: String, default: null },

    filtersForm: { type: Object, default: () => {} },
  },
  computed: {
    isDisabledControl() {
      if (!this.guid) return true;
      let statusLoading = this.$store.getters['DataTable/GET_LOADING_API']({
        tableName: this.tableName,
        guid: this.guid,
      });
      let statusAdding = (this.$store.getters['DataTable/GET_ADDING_MODE']({
        tableName: this.tableName,
        guid: this.guid,
      }).index != null) ? true : false;
      return (statusLoading || statusAdding) ? true : false;
    },
    propsTable() {
      if (!this.guid) return {};
      return this.$store.getters['DataTable/GET_PROPS_TABLE']({
        tableName: this.tableName,
        guid: this.guid,
      });
    },
  },
  methods: {

  }
}