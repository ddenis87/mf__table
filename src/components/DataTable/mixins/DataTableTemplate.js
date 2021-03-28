export const DataTableTemplate = {
  computed: {
    headers() {
      return (this.propsTable.isMultiline) ? this.properties.templateMultiline : this.properties.templateUno;
    },
    listHeaders() {
      let headerStore = this.listOptions;
      let headerBase = this.headers;
      let newheaderBase = [];
      let headerReturn = [];
      if (Array.isArray(headerBase[0])) {
        for (let i = 0; i < headerBase.length; i++) { newheaderBase.push(...headerBase[i]) }
      } else {
        newheaderBase = headerBase;
      }
      newheaderBase.forEach(element => {
        if (element.value in headerStore) {
          headerReturn.push(Object.assign(element, headerStore[element.value], {'position_in_template': {'grid-area': element.value}}));
        }
      });
      return headerReturn;
      return [];
    },
    dataTableTemplate() {
      // if (this.isHierarchyMode == null) return null;

      let template = {
        'grid-template-areas': '',
        'grid-template-columns': '',
      };
      let headers = this.headers;
      if (!headers[0].length) {
        template['grid-template-areas'] = this.computedAreaUnoLine(headers);
        template['grid-template-columns'] = this.computedWidthUnoLine(headers);
      } else {
        template['grid-template-areas'] = this.computedAreaMultiLine(headers);
        template['grid-template-columns'] = this.computedWidthMultiLine(headers);
        template['grid-template-rows'] = `repeat(${headers.length}, ${(this.propsTable.typeRow == 'fixed') ? '43px' : (this.propsTable.typeRow == 'dense') ? '22px' : 'auto'})`;
      }
      // console.log(template);
      return template;
    },
    computedActionMax() { return (this.propsTable.typeRow != 'auto' && this.propsTable.isExpansion == true) ? true : false; },
  },
  methods: {
    computedAreaUnoLine(array) {
      let area = '"';
      if (this.computedActionMax) area += 'action_max ';
      // if (this.isHierarchyMode) area += 'group ';
      array.forEach(element => area += `${element.value} `);
      area = area.trim();
      area += `"`;
      return area;
    },
    computedAreaMultiLine(array) {
      let countRow = array.length;
      let area =`"`;
      let areaArray = [];
      for (let i = 0; i < countRow; i++) areaArray.push([]); // initial array
      for (let i = 0; i < countRow; i++) {
        // if (this.computedActionMax) areaArray[i].push('action_max ');
        // if (this.isHierarchyMode) areaArray[i].push('group');
        array[i].forEach(element => {
          if (element.column) {
            for (let k = 0; k < element.column; k++) areaArray[i].push(element.value);
          } else {
            areaArray[i].push((element.value) ? element.value : '.');
          }
        });
      }
      let countColumn = areaArray[0].length;
      for (let column = 0; column < countColumn; column++) {
        for (let row = 1; row < countRow; row++) {
          if (areaArray[row][column] == '.') {
            areaArray[row][column] = areaArray[row - 1][column];
          }
        }
      }
      for (let i = 0; i < countRow; i++) {
        area += areaArray[i].join(' ');
        area += (i != countRow - 1) ? '" "' : '"';
      }
      // console.log(area)
      return area;
    },

    computedWidthUnoLine(array) {
      let columnWidth = '';
      if (this.computedActionMax) columnWidth += 'minmax(22px,22px) ';

      // if (this.isHierarchyMode) columnWidth += `${(this.listDataGroupLevel * 10) + 40}px `;
      // if (this.isHierarchyMode) columnWidth += `${40}px `;

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
    computedWidthMultiLine(array) {
      let countRow = array.length;
      let columnWidth = '';

      let columnWidthArray = [];
      for (let i = 0; i < countRow; i++) columnWidthArray.push([]);
      for (let i = 0; i < countRow; i++) {
        // if (this.computedActionMax) columnWidthArray[i].push(`minmax(22px,22px) `);
        // if (this.isHierarchyMode) columnWidthArray[i].push(`${(this.listDataGroupLevel * 10) + 40}px `)
        // if (this.isHierarchyMode) columnWidthArray[i].push(`${40}px `)

        array[i].forEach(element => {
          if (element.value) {
            if (!element.column) {
              if (element.width) {
                if (Array.isArray(element.width)) {
                  columnWidthArray[i].push(`minmax(${(element.width[0] != undefined) ? element.width[0] : '100'}px,${(element.width[1] != undefined) ? element.width[1] + 'px' : '100vw'})`);
                } else {
                  columnWidthArray[i].push(`${element.width}px `);
                }
              } else {
                columnWidthArray[i].push(`minmax(100px,100vw)`);
              }
            } else {
              columnWidthArray[i].push(`auto`);
              for (let k = 0; k < element.column - 1; k++) columnWidthArray[i].push('auto');
            }
          } else {
            columnWidthArray[i].push(`.`);
          }
        })
      }

      let newColumnWidthArray = [];
      let countColumn = columnWidthArray[0].length;
      for (let column = 0; column < countColumn; column++) {
        if (columnWidthArray[0][column] == 'auto') {
          for (let row = 1; row < countRow; row++) {
            if (columnWidthArray[row][column] != 'auto') { 
              newColumnWidthArray.push(columnWidthArray[row][column]);
              break;
            } else {
              if (row == countRow - 1) newColumnWidthArray.push(columnWidthArray[row][column]);
            }
          }
        } else {
          newColumnWidthArray.push(columnWidthArray[0][column]);
        }
      }
      columnWidth = newColumnWidthArray.join(' ');
      // console.log(columnWidth);
      return columnWidth;
    },
  }
}