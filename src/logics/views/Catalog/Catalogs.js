// import { Guid } from 'js-guid';
// import store from '@/store';

export default class Catalog {
  constructor(sourceName) {
    this.sourceName = sourceName;
    // this.guid = `d${Guid.newGuid().StringGuid}`;
    this.createTableSpace();
  }

  guid = undefined;

  focusedElement = null;

  createTableSpace() {
    console.log(`create table space ${this.sourceName}`);
  }

  getFocusedElement() {
    return this.focusedElement;
  }

  getTableOptions() {
    return {
      sourceName: this.sourceName,
      // guid: this.guid,
    };
  }

  setFocusedElement(element) {
    this.focusedElement = element;
  }

  mountedTable() {
    //   console.log(options);
    console.log(this.guid);
    //   // if (options.guid) this.guid = '32342';
    //   // this.guid = options.guid || null;
  }

  blurTable() {
    this.focusedElement = null;
  }
}
