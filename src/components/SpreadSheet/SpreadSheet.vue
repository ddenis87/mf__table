<template>
  <div class="spread-sheet">
    <sheet :rows="rows"
           :row-count="rowCount"
           :columns="columns"
           :column-count="columnCount"
           :cells="cells"></sheet>
  </div>
</template>

<script>
import Sheet from './Sheet.vue';

export default {
  name: 'SpreadSheet',
  components: {
    Sheet,
  },
  props: {
    rows: { type: Object },
    rowCount: { type: Number, default: 1000 },
    columns: { type: Object },
    columnCount: { type: Number, default: 30 },
    cells: { type: Object },
    styles: { type: Array },
  },
  mounted() {
    this.addingDocumentStyles();
  },
  methods: {
    addingDocumentStyles() {
      const stylesPath = ' .spread-sheet .sheet .sheet-body .sheet-body__row ';
      const elementDOMStyle = document.createElement('style');
      let stylesString = '';
      elementDOMStyle.setAttribute('type', 'text/css');

      this.styles.forEach((element) => {
        const stylesObject = {};
        Object.entries(element.list).forEach((item) => {
          const [styleName, styleValue] = [...item];
          stylesObject[this.transformStringToKebabCase(styleName)] = styleValue;
        });
        stylesString += `${stylesPath} .${element.name} ${this.transformObjectToStringStyle(stylesObject)}`;
      });

      elementDOMStyle.innerText = `${stylesString}`;
      document.querySelector('head').append(elementDOMStyle);
    },

    transformStringToKebabCase(styleName) {
      return styleName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    },

    transformObjectToStringStyle(object) {
      return JSON.stringify(object).replace(/,/g, ';').replace(/"/g, '').replace(/}/g, ';}');
    },
  },
};
</script>

<style lang="scss" scoped>
@import './SpreadSheet.scss';

.spread-sheet {
  width: 100%;
  height: 100%;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: hidden;
}
</style>
