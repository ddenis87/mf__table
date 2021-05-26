const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;

class TEMPLATE_AREAS {
  getArea(nameArea) {};
};

class TABLE_DOCUMENT {
  constructor({
    rows = {},
    columns = {},
    cells = {},
    styles = [],
    namedRanges = [],
  }) {
    this.rows = rows;
    this.columns = columns;
    this.cells = cells;
    this.styles = styles;
    this.namedRanges = namedRanges;
  };

  rows = {};
  columns = {};
  cells = {};
  styles = []; // ?
  namedRanges = {}; // ? []

  getTemplateAreas = (direction) => {
    const templatesAreas = template.namedRanges.filter((item) => {
      const [ v1, v2 ] = item.range.split(':');
      return (item.name.includes((direction === 'horizontal') ? 'row' : 'column') && v1 === v2);
    });

  };

};

function createNewDocument({
  rowCount = 1000,
  columnCount = 26,
  cellWidth = CELL_WIDTH,
  cellHeight = CELL_HEIGHT,
} = {}) {
  const newDocument = {
    rowCount: rowCount,
    rows: {},
    columnCount: columnCount,
    columns: {},
    cells: {},
    styles: [],
    cellWidth: cellWidth,
    cellHeight: cellHeight,
  };
  return newDocument;
};

function hasTemplate(template) {
  return (Object.keys(template).includes('template')
    && template.template === true);
};

function hasNamedRanges(template) {
  return (Object.keys(template).includes('namedRanges')
    && Object.keys(template.namedRanges))
};

function getAreasFromTemplate(jsonTemplate = null, direction = 'horizontal') {
  if (jsonTemplate === null) return null;
  let template = JSON.parse(jsonTemplate);
  if (!hasNamedRanges(template)) return null;
  const areas = template.namedRanges.filter((item) => {
    const [ v1, v2 ] = item.range.split(':');
    return (item.name.includes((direction === 'horizontal') ? 'row' : 'column') && v1 === v2);
  });
  areas.forEach((element) => {
    const [ indexBegin, indexEnd ] = element.range.split(':');
    element.parameters = template.namedRanges.filter((item) => {
      const [ v1, v2 ] = item.range.split(':');
      return (indexBegin <= v1.replace((direction === 'horizontal') ? /[A-z]/g : /[0-9]/g, '') <= indexEnd
        && v1 !== v2);
    });
  });
  return areas;
}

function getParametersFromArea(template = null, nameArea = null) {
  return template.find((item) => item.name === nameArea).parameters;
}

export {
  createNewDocument,
  getAreasFromTemplate,
  getParametersFromArea,
};
