export default {
  mounted() {
    const stylesDomElement = document.createElement('style');
    stylesDomElement.setAttribute('type', 'text/css');
    let style = '';

    this.styles.forEach((element) => {
      const styleKebabCase = {};
      Object.entries(element.list).forEach((item) => {
        const [styleName, styleValue] = [...item];
        styleKebabCase[styleName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)] = styleValue;
      });
      style += ` .spread-sheet .table .body-row .${element.name} ${this.formatedStyleString(styleKebabCase)}`;
    });
    stylesDomElement.innerHTML = `${style}`;
    document.querySelector('head').append(stylesDomElement);
  },
  methods: {
    formatedStyleString(object) {
      return JSON.stringify(object).replace(/,/g, ';').replace(/"/g, '').replace(/}/g, ';}');
    },
  },
};
