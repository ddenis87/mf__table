export default {
  mounted() {
    const stylesDomElement = document.createElement('style');
    stylesDomElement.setAttribute('type', 'text/css');
    cellsStyles.forEach(element => {
      let style = `.${element.name} { `;
      element.list
    });
    document.querySelector('head').prepend(stylesDomElement);
  },
};
