import TableDocumentError from './TableDocumentError';

export default class TableDocumentDeserializeError extends TableDocumentError {
  constructor(sourceName, messages) {
    super(sourceName);
    this.addingErrors(messages);
  }

  // TableDocumentValidationCellError = [];

  addingErrors(messages) {
    let messagesList = messages;
    // this.validationCellError = validationCellError;
    if (!Array.isArray(messages)) messagesList = [messages];
    messagesList.forEach((messageItem) => {
      if (!this[messageItem.name]) this[messageItem.name] = [];
      this[messageItem.name].push(messageItem.getMessages());
    });
  }
}
