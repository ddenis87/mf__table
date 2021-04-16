import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import SpreadSeetBody from './SpreadSheetBody.vue';

export default {
  data() {
    return {
      openRowGroup: [],
      currentRowChildLevel: this.rowChildLevel,
    };
  },
  methods: {
    toggleRowGroup(parent) {
      const targetInserting = this.$refs.ssBody.querySelector(`[data-row-parent-slot="${parent}"]`);
      const status = this.$refs.ssBody.querySelector(`[data-row-parent-slot="${parent}"]`).getAttribute('data-row-group-status');
      if (status === 'close') {
        const rowsOption = this.getRowsGroup(+parent);
        const propertiesComponentMounted = {
          parent,
          targetInserting,
          rowCount: +rowsOption.rowCount - 1,
          rows: rowsOption.rows,
        };
        
        this.mountedRowGroup(propertiesComponentMounted);

        this.$refs.ssBody.querySelector(`[data-row-parent-slot="${parent}"]`).setAttribute('data-row-group-status', 'open');
      }
    },
    mountedRowGroup(properties) {
      const SubClassVue = Vue.extend(SpreadSeetBody);
      this.openRowGroup[properties.parent] = new SubClassVue({
        vuetify,
        propsData: {
          rowCount: properties.rowCount,
          rowExcluded: this.getRowExcluded(properties.rows),
          rows: properties.rows,
          
          rowParent: +properties.parent,
          rowLevelGroup: this.rowLevelGroupMax,
          rowChildLevel: this.currentRowChildLevel + 1,
        },
      }).$mount();
      properties.targetInserting.prepend(this.openRowGroup[properties.parent].$el);
      properties.targetInserting.closest('tr').classList.remove('hidden');
    },
    getRowsGroup(parent) {
      const rowCount = this.rows[parent].rowGroup;
      const rows = {};
      for (let i = 1; i < rowCount; i += 1) {
        rows[parent + i] = this.rows[parent + i];
      }
      return {
        rowCount,
        rows,
      };
    },
  },
};
