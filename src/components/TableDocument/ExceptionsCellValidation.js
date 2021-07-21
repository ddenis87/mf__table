export default class ExceptionCellValidation {
  constructor(source, messages) {
    this.name = this.constructor.name;
    this.source = source;
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

  getException() {
    return {
      source: this.source,
      messages: this.messages,
    };
  }
}
