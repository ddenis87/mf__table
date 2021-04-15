import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import SpreadSheetLeftBar from './components/SpreadSheetLeftBar.vue';

export default {
  data() {
    return {
      openRowGroup: [],
    };
  },
  methods: {
    toggleRowGroup(target) {
      const parent = target.getAttribute('data-row-parent');
      const targetInserting = target.closest('tr').nextElementSibling.querySelector(`[data-row-parent-slot="${parent}"]`);

      const rowsOption = this.getRowsGroup(parent);
      const propertiesComponentMounted = {
        parent,
        targetInserting,
        rowCount: rowsOption.rowCount,
        rows: rowsOption.rows,
      };
      // console.log(propertiesComponentMounted);
      this.mountedRowGroup(propertiesComponentMounted);
    },
    getRowsGroup(parent) {
      const rowsMap = new Map(Object.entries(this.rows));
      return {
        rowCount: Array.from(rowsMap).filter((item) => (item[1].parent === parent)).length,
        rows: Object.fromEntries(Array.from(rowsMap).filter((item) => (item[1].parent === parent))),
      };
    },
    mountedRowGroup(properties) {
      const SubClassVue = Vue.extend(SpreadSheetLeftBar);
      this.openRowGroup[properties.parent] = new SubClassVue({
        vuetify,
        propsData: {
          rowCount: properties.rowCount,
          rows: properties.rows,

          rowParent: +properties.parent,
        },
      }).$mount();
      properties.targetInserting.prepend(this.openRowGroup[properties.parent].$el);
      properties.targetInserting.closest('tr').classList.remove('hidden');
    },
  },
};
