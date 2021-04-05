export default {
  mounted() {
    const stylesDomElement = document.createElement('style');
    stylesDomElement.setAttribute('type', 'text/css');
    let style = '';
    this.styles.forEach((element) => {
      style += ` .${element.name} ${JSON.stringify(element.list).replace('/\','/g', ';').replace('"', '')}`;
    });
    console.log(style);
    document.querySelector('head').prepend(stylesDomElement);
  },
};
