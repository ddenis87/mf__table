export default class TableDocumentValidationCellError {
  constructor(source, value, messages) {
    this.name = this.constructor.name;
    this.source = source;
    this.value = value;
    this.addingMessage(messages);
  }

  messages = [];

  addingMessage(messages) {
    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        if (message !== true) this.messages.push(message);
      });
    }
    if (!Array.isArray(messages)) this.messages.push(messages);
  }

  getMessage() {
    return {
      source: this.source,
      value: this.value,
      messages: this.messages,
    };
  }
}
