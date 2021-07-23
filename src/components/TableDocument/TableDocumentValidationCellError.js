import TableDocumentError from './TableDocumentError';

export default class TableDocumentValidationCellError extends TableDocumentError {
  constructor(sourceName, sourceType, value, messages) {
    super(sourceName);
    this.sourceType = sourceType;
    if (value) this.value = value;
    this.addingMessages(messages);
  }

  messages = [];

  addingMessages(messages) {
    this.messages = messages;
    if (!Array.isArray(messages)) this.messages = [messages];
    this.messages = this.messages.filter((message) => message !== true);
  }

  getMessages() {
    const BaseClass = this.constructor;
    return new BaseClass(this.sourceName, this.sourceType, this.value, this.messages);
  }

  getMessagesText() {
    let text = '';
    this.messages.forEach((item) => {
      text += `${item} \n`;
    });
    return text;
  }
}
