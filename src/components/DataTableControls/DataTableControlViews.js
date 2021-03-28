import ElBtnIcon from '@/components/Elements/ElBtn/ElBtnIcon.vue';

export const DataTableControlViews = {
  components: {
    ElBtnIcon,
  },
  props: {
    tableName: { type: String, default: '' },
    guid: { type: String, default: '' },
    propsTable: {
      type: Object, default() {
        return {
          isFooter: null,
          isHierarchy: null,
          isMultiline: null,
        }
      }
    },
  },
  methods: {
    toggleView(option) {
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
      }
      console.log(option);
      switch(option) {
        case 'toggle-type-row': {
          let value = '';
          if (this.propsTable.typeRow == 'fixed') value = 'dense';
          if (this.propsTable.typeRow == 'dense') value = 'auto';
          if (this.propsTable.typeRow == 'auto') value = 'fixed';
          this.$store.commit('DataTable/SET_PROPS_TABLE', Object.assign(sendOption, {
            propsTable: {
              typeRow: value,
            }
          }));
          break;
        }
        case 'toggle-expansion': {
          this.$store.commit('DataTable/SET_PROPS_TABLE', Object.assign(sendOption, {
            propsTable: {
              isExpansion: !this.propsTable.isExpansion,
            }
          }));
          break;
        }
        case 'toggle-type-column': {
          this.$store.commit('DataTable/SET_PROPS_TABLE', Object.assign(sendOption, {
            propsTable: {
              typeColumn: (this.propsTable.typeColumn == 'fixed') ? 'dense' : 'fixed',
            }
          }));
          break;
        }
        case 'toggle-footer': {
          this.$store.commit('DataTable/SET_PROPS_TABLE', Object.assign(sendOption, {
            propsTable: {
              isFooter: !this.propsTable.isFooter,
            }
          }));
          break;
        }
        case 'toggle-hierarchy': {
          this.$store.dispatch('DataTable/TOGGLE_HIERARCHY_MODE', sendOption);
          break;
        }
        case 'toggle-multiline': {
          this.$store.commit('DataTable/SET_PROPS_TABLE', Object.assign(sendOption, {
            propsTable: {
              isMultiline: !this.propsTable.isMultiline,
              typeRow: (!this.propsTable.isMultiline) ? 'dense' : 'fixed',
            }
          }));
          break;
        }
      }
    }
  }
}