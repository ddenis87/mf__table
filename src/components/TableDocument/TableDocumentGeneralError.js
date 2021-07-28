import TableDocumentError from './TableDocumentError';

export default class TableDocumentGeneralError extends TableDocumentError {
  constructor(sourceName, messages) {
    super(sourceName);
    this.messages = messages;
  }

  getMessagesText() {
    let text = this.messages;
    text += '\n Обработка остановлена';
    return text;
  }
}
