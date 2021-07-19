class ValueValidate extends Error {
  constructor(source, messages) {
    super('ValueValidate');
    this.name = source;
    // console.log(`${this.name}: ${this.message}`);
    messages.forEach((message) => {
      if (message === true) return;
      this.message.push(message);
      // console.log(`%c ${source} - %c Type - ${message}`, 'color: green; font: Tahoma;', 'color: red; font: Tahoma;');
      // console.log(`%c ${message}`, 'color: red; font: Tahoma;');
      // console.log(this.stack);
    });
  }
}

export default ValueValidate;
