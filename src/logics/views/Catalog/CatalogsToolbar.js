export default class CatalogToolbar {
  constructor(table) {
    this.table = table;
  }

  toolbarProps() {
    return {
      mode: 'default',
      isActive: !!(this.table.getFocusedElement()),
    };
  }

  evtClickToolbar(options) {
    console.log(options);
    console.log(this.table);
  }
}
