import store from '@/store';
import PToolbar from '@/components/Form/PToolbar/PToolbar.vue';

const TOOLBAR_MODE = {
  DEFAULT: 'default',
  RECYCLE: 'recycle',
};

export default {
  components: {
    PToolbar,
  },
  data: {
    toolbarMode: TOOLBAR_MODE.DEFAULT,
  },
  computed: {
    toolbarProps() {
      return {
        mode: this.toolbarMode,
        isActive: !!(this.focusedTableElement),
      };
    },
  },
  methods: {
    evtClickToolbar(btnName) {
      const TOOLBAR_ACTIONS = {
        create: () => this.create(),
        'create-group': () => this.createGroup(),
        'create-inline': () => this.createInline(),
        edit: () => this.edit(),
        filter: () => { this.isDialogFilterShow = !this.isDialogFilterShow; },
        'mark-delete': () => this.markDelete(),
        recycle: () => this.toggleRecycleBin(),
        refresh: () => this.refreshTable(),
      };
      TOOLBAR_ACTIONS[btnName]();
    },

    create() {
      this.typeForm = 'element';
      this.focusedTableElement = null;
      this.isDialogFormShow = true;
    },

    createGroup() {
      this.typeForm = 'group';
      this.focusedTableElement = null;
      this.isDialogFormShow = true;
    },

    async createInline() {
      console.log('add inline');
      this.$store.commit('DataTable/MARK_EVENT_ADDING', {
        tableName: this.sourceName,
        guid: this.guid,
        status: true,
      });
      await this.$store.dispatch('DataTable/ADDING_NEW_ELEMEN_INLINE', {
        tableName: this.sourceName,
        guid: this.guid,
        id: (this.focusedTableElement) ? this.focusedTableElement.id : -1,
      });
    },

    edit() {
      this.typeForm = (this.focusedTableElement.is_group) ? 'group' : 'element';
      this.isDialogFormShow = true;
    },

    async markDelete() {
      const { id: elementId } = this.focusedTableElement;
      const sendOption = {
        tableName: this.sourceName,
        guid: this.guid,
        id: elementId,
      };
      await this.$store.dispatch('DataTable/DELETED_ELEMENT', sendOption);
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
        tableName: this.sourceName,
        guid: this.guid,
      });
      this.focusedTableElement = null;
    },

    refreshTable() {
      const isHierarchy = store.getters['DataTable/GET_PROP_TABLE_VALUE']({
        tableName: this.sourceName,
        guid: this.guid,
        key: 'isHierarchy',
      });
      const filterParams = {
        is_deleted: false,
        parent: null,
        parent__isnull: (isHierarchy) ? true : null,
        ordering: (isHierarchy) ? '-is_group' : null,
      };
      this.$store.dispatch('DataTable/RESET_TABLE', {
        tableName: this.sourceName,
        guid: this.guid,
        defaultFilters: filterParams,
      });
    },

    toggleRecycleBin() {
      this.$store.commit('DataTable/CLEAR_DATA_GROUP_LEGEND', {
        tableName: this.sourceName,
        guid: this.guid,
      });
      const filterParams = {
        'parent': null,
      };
      if (this.toolbarMode === TOOLBAR_MODE.DEFAULT) {
        filterParams.is_deleted = true;
        filterParams.parent = null;
        filterParams.parent__isnull = null;
        this.toolbarMode = TOOLBAR_MODE.RECYCLE;
      } else {
        this.toolbarMode = TOOLBAR_MODE.DEFAULT;
        filterParams.is_deleted = false;
        filterParams.parent__isnull = store.getters['DataTable/GET_PROP_TABLE_VALUE']({
          tableName: this.sourceName,
          guid: this.guid,
          key: 'isHierarchy',
        });
      }
      this.$store.dispatch('DataTable/SET_FILTER_DEFAULT', {
        tableName: this.sourceName,
        guid: this.guid,
        defaultFilters: filterParams,
      });
    },

  },
};
