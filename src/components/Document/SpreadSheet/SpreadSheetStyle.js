export default {
  computed: {
    widthHead() {
      return {
        'max-width': `${60 + (20 * this.getRowLevelGroupMax)}px`,
      };
    },
  },
  mounted() {
    this.addingStylesInHead();
  },
  methods: {
    addingStylesInHead() {
      const styleDomElement = document.createElement('style');
      styleDomElement.setAttribute('type', 'text/css');
      let style = '';

      this.styles.forEach((element) => {
        const styleKebabCase = {};
        Object.entries(element.list).forEach((item) => {
          const [styleName, styleValue] = [...item];
          styleKebabCase[styleName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)] = styleValue;
        });
        style += ` .sheet .spread-sheet .${element.name} ${this.formatedStyleString(styleKebabCase)}`;
      });
      styleDomElement.innerHTML = `${style}`;
      document.querySelector('head').append(styleDomElement);
    },
    formatedStyleString(object) {
      return JSON.stringify(object).replace(/,/g, ';').replace(/"/g, '').replace(/}/g, ';}');
    },
  },
};
