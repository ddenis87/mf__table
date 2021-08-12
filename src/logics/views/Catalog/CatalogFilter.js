import store from '@/store';
import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue';
import PFilter from '@/components/Form/PFilter/PFilter.vue';

export default {
  components: {
    DialogBarRight,
    PFilter,
  },
  data: {
    isDialogFilterShow: false,
  },
  computed: {
    filterDialogProps() {
      return {
        isDialogName: 'Фильтр',
        isDialogShow: this.isDialogFilterShow,
        width: '600',
      };
    },

    filterProps() {
      return {
        isOpen: this.isDialogFilterShow,
        filterList: store.getters['DataTable/GET_LIST_OPTIONS']({ tableName: this.sourceName }),
        selectionSize: store.getters['DataTable/GET_COUNT_DATA_TOTAL']({
          tableName: this.sourceName,
          guid: this.guid,
        }),
      };
    },
  },
  methods: {
    async evtFilterAccept(value) {
      const options = {
        tableName: this.sourceName,
        guid: this.guid,
        value,
      };
      this.isDialogFilterShow = false;
      await store.dispatch('DataTable/SET_FILTER_EXTENDED', options);
    },

    async evtFilterReset() {
      const options = {
        tableName: this.sourceName,
        guid: this.guid,
        value: null,
      };
      this.isDialogFilterShow = false;
      await store.dispatch('DataTable/SET_FILTER_EXTENDED', options);
    },
  },
};
