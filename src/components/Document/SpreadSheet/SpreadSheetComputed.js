export default {
  mounted() {
    this.addingStylesInHead();
    // this.setColumnWidth();
  },
  methods: {
    // columnWidth(name) {
    //   const columnWidth = this.columns.find((item) => item.name.toLowerCase() === name)?.width;
    //   if (columnWidth) return {
    //   'min-width': `${columnWidth}px`, 'max-width': `${columnWidth}px`, width: `${columnWidth}px`
    //  };
    //   return '';
    // },
    // rowHeight(name) {
    //   const rowHeight = this.rows.find((item) => item.name === name)?.height;
    //   if (rowHeight) return `height: ${rowHeight}px`;
    //   return '';
    // },
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
        style += ` .spread-sheet .table tbody .body-row .${element.name} ${this.formatedStyleString(styleKebabCase)}`;
      });
      styleDomElement.innerHTML = `${style}`;
      document.querySelector('head').append(styleDomElement);
    },
    formatedStyleString(object) {
      return JSON.stringify(object).replace(/,/g, ';').replace(/"/g, '').replace(/}/g, ';}');
    },
  },
};
