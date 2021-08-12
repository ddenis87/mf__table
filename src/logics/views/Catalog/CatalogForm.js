import DialogFullPage from '@/components/Dialogs/DialogFullPage.vue';

export default {
  components: {
    DialogFullPage,
  },
  data: {
    isDialogFormShow: false,
    typeForm: 'element',
  },
  computed: {
    formName() {
      let formName = this.sourceName[0].toUpperCase() + this.sourceName.slice(1);
      if (this.typeForm === 'group') formName += this.typeForm[0].toUpperCase() + this.typeForm.slice(1);
      return formName;
    },
    componentForm() {
      if (!this.isDialogFormShow) return null;
      return () => import(`@/components/TheForms/The${this.formName}`);
    },

    formDialogProps() {
      return {
        isDialogName: '', // ?
        isDialogShow: this.isDialogFormShow,
      };
    },

    formProps() {
      return {
        guid: this.guid,
        focusedElement: this.focusedTableElement,
        // filtersForm: {}, // ?
      };
    },
  },
  methods: {
    evtFormCancel() {
      this.closeDialogForm();
    },

    async evtFormAccept() {
      this.closeDialogForm();
    },

    closeDialogForm() {
      this.focusedTableElement = null;
      this.isDialogFormShow = false;
    },
  },
};
