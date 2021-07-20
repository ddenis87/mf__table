class ValueValidate {
  constructor(source, messages) {
    // super('ValueValidate');
    this.name = source;
    this.messages = [];
    if (!Array.isArray(messages)) {
      this.messages.push(messages);
      return;
    }
    messages.forEach((message) => {
      if (message === true) return;
      this.messages.push(message);
    });
    // this.messages = messages;
    // console.log(`${this.name}: ${this.message}`);
    // messages.forEach((message) => {
    // if (message === true) return;
    // this.message.push(message);
    // console.log(`%c ${source} - %c Type - ${message}`, 'color: green; font: Tahoma;', 'color: red; font: Tahoma;');
    // console.log(`%c ${message}`, 'color: red; font: Tahoma;');
    // console.log(this.stack);
    // });
  }
}

export default ValueValidate;
