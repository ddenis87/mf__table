export const DataTableSingleTemplate = {
  computed: {
    dataTableTemplate() {
      let template = {
        'grid-template-areas': '',
        'grid-template-columns': '',
      };
      // let headers = this.properties.headers;
        template['grid-template-areas'] = this.computedAreaUnoLine(this.headers);
        template['grid-template-columns'] = this.computedWidthUnoLine(this.headers);
        console.log(template);
      return template;
    },
    
  },
  methods: {
    computedAreaUnoLine(array) {
      let area = '"';
      array.forEach(element => area += `${element.value} `);
      area = area.trim();
      area += `"`;
      return area;
    },
    computedWidthUnoLine(array) {
      let columnWidth = '';
      array.forEach((element, index) => {
        if (element.width) {
          if (Array.isArray(element.width)) {
            columnWidth += `minmax(${(element.width[0] != undefined) ? element.width[0] : '100'}px,${(element.width[1] != undefined) ? element.width[1] + 'px' : '100vw'}) `;
          } else {
            columnWidth += `${element.width}px `;
          }
        } else {
          columnWidth += `minmax(100px,100vw) `;
        }
      });
      return columnWidth;
    },
  }
}