//  REQUIRED -------------------------------------------------------------------
  //  tableName
  //  guid
  //  typeControl
  
export const DataTableControl_DataTable = {
  data() {
    return {
      activeElement: null,

      typeHeightNumber: 0,
      typeHeight: ['fixed', 'dense', 'auto'],
      typeColumn: 'fixed',
      // isEditable: true,
      // isFooter: false,
      // isExpansion: false,
      // isMultiline: false,
    }
  },
  computed: {
    componentTables() {
      return () => import(`@/components/TheTable/TheTable${this.tableName[0].toUpperCase() + this.tableName.slice(1)}`);
    },
    propertiesControl() {
      return {
        'table-name': this.tableName,
        guid: this.guid,
        // 'type-control': this.typeControl,
        // 'focused-element': this.activeElement,
        // 'type-height-number': this.typeHeightNumber,
        // 'type-column': this.typeColumn,
        // 'is-footer': this.isFooter,
        // 'is-expansion': this.isExpansion,
        // 'is-multiline': this.isMultiline,
      }
    },
    // propertiesTable() {
    //   return {
    //     'type-row-number': this.typeHeightNumber,
    //     'type-column': this.typeColumn,
    //     'is-editable': this.isEditable,
    //     'is-footer': this.isFooter,
    //     'is-expansion': this.isExpansion,
    //     'is-multiline': this.isMultiline,
    //   }
    // },
  },
  methods: {
    focusedElement(option) {
      this.activeElement = Object.assign({}, option);
    },
    blurTable() {
      this.activeElement = null;
    },
    mountedTable(option) {
      this.guid = option.guid;
    },
    // toggleView(option) {
    //   // console.log(option);
    //   switch(option) {
    //     case 'toggle-type-row': {
    //       console.log(option)
    //       this.isExpansion = false;
    //       if (this.typeHeightNumber == this.typeHeight.length - 1) this.typeHeightNumber = 0;
    //       else this.typeHeightNumber = this.typeHeightNumber + 1;
    //       break;
    //     }
    //     case 'toggle-expansion': {
    //       this.isExpansion = !this.isExpansion;
    //       break;
    //     }
    //     case 'toggle-type-column': {
    //       (this.typeColumn == 'fixed') ? this.typeColumn = 'dense' : this.typeColumn = 'fixed';
    //       break;
    //     }
    //     // case 'toggle-footer': {
    //     //   this.isFooter = !this.isFooter;
    //     //   break;
    //     // }
    //     case 'toggle-multiline': {
    //       this.isMultiline = !this.isMultiline;
    //       if (this.isMultiline == true) this.typeHeightNumber = 1;
    //       else this.typeHeightNumber = 0;
    //       break;
    //     }
    //   }
    // },
  }
}