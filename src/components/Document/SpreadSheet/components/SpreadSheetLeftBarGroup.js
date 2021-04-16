import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import SpreadSheetLeftBar from './SpreadSheetLeftBar.vue';

export default {
  data() {
    return {
      openRowGroup: [],
      currentRowChildLevel: this.rowChildLevel,
    };
  },
  methods: {
    toggleRowGroup(target) {
      const parent = target.getAttribute('data-row-parent');
      const status = target.getAttribute('data-row-group-status');
      const targetInserting = target.closest('tr').nextElementSibling.querySelector(`[data-row-parent-slot="${parent}"]`);
      const btnIcon = target.querySelector('i');

      this.$emit('open-row-group', parent);

      if (status === 'close') {
        const rowsOption = this.getRowsGroup(+parent);
        const propertiesComponentMounted = {
          parent,
          targetInserting,
          rowCount: +rowsOption.rowCount - 1,
          rows: rowsOption.rows,
        };
        this.mountedRowGroup(propertiesComponentMounted);

        btnIcon.classList.remove('mdi-plus-box-outline');
        btnIcon.classList.add('mdi-minus-box-outline');
        target.closest('th').classList.add('line_start');

        target.setAttribute('data-row-group-status', 'open');
      } else {
        targetInserting.querySelector('table').remove();

        this.openRowGroup[parent] = null;
        delete this.openRowGroup[parent];

        btnIcon.classList.add('mdi-plus-box-outline');
        btnIcon.classList.remove('mdi-minus-box-outline');
        target.closest('th').classList.remove('line_start');

        target.setAttribute('data-row-group-status', 'close');
      }
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
    
    mountedRowGroup(properties) {
      const SubClassVue = Vue.extend(SpreadSheetLeftBar);
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
    getRowExcluded(rows) {
      const rowExcluded = new Set();
      Object.entries(rows).forEach((row) => {
        if (Object.keys(row[1]).includes('rowGroup')) {
          for (let i = 1; i < row[1].rowGroup; i += 1) {
            rowExcluded.add(+row[0] + i);
          }
        }
      });
      console.log(rowExcluded);
      return rowExcluded;
    },
  },
};
