export default class RableDocumentError {
  constructor(sourceName) {
    this.name = this.constructor.name;
    this.sourceName = sourceName;
  }
}
