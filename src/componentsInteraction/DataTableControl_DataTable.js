//  REQUIRED -------------------------------------------------------------------
  //  tableName
  //  guid
  
export const DataTableControl_DataTable = {
  computed: {
    componentTable() {
      return () => import(`@/components/TheTable/TheTable${this.tableName[0].toUpperCase() + this.tableName.slice(1)}`);
    },
    propertiesControl() {
      return {
        'table-name': this.tableName,
        guid: this.guid,
      }
    },
  },
  methods: {
    mountedTable(option) {
      this.guid = option.guid;
    },
  }
}