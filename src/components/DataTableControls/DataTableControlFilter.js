import ElBtnIcon from '@/components/Elements/ElBtn/ElBtnIcon.vue';
import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue';

export const DataTableControlFilter = {
  components: {
    ElBtnIcon,
    DialogBarRight,
  },
  data() {
    return {
      isShowDialogFilter: false,
    }
  },
  computed: {
    isFilterActive() {
      return this.$store.getters[`DataTable/GET_FILTER_EXTENDED`]({
        tableName: this.tableName,
        guid: this.guid,
      });
    },
    importComponentFilter() {
      if (this.guid)
        // return () => import('@/components/DataFilter/DataFilterExtended/DataFilterExtended.vue');
        return () => import('@/components/DataFilter/FilterExtended/FilterExtended.vue');
      return null;
    },
  },
}