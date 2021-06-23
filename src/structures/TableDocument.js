import {
  RANGE_TYPE,
  SHIFT_TYPE,
  getParseAtSymbolDigit,
  getColumnNameForNumber,
  getColumnNumberForName,
  getRangeType,
  getRangeSplit,
  getRangeLength,
  getRangeShift,
} from './TableDocumentHelpers';

const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;

const REG_OPERATORS = /[+-/*)(% ]/g;

const CELL_ATTRIBUTES = {
  VALUE: 'value',
  FORMULA: 'formula',
  ACTION: 'action',
};

const DELETE_MODE = {
  DATA: 'data',
  COLUMN: 'column',
  ROW: 'row',
};

const RETURN_FORMAT = {
  OBJECT: 'object',
  ENTRIES: 'entries',
  KEYS: 'keys',
};

function fillingFormula(operandsValues, formula) {
  let fillFormula = formula;
  Object.entries(operandsValues).forEach((operand) => {
    const [operandName, operandValue] = operand;
    fillFormula = fillFormula.replace(`$${operandName}`, operandValue);
  });
  return fillFormula;
}

function getCellNameShift(cellName, rangeCells, shiftColumn = 1, shiftRow = 1) {
  const [rangeRow, rangeColumn] = rangeCells;
  const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
  const cellColumnShift = getColumnNameForNumber(+getColumnNumberForName(cellColumn) - +rangeColumn[0] + shiftColumn);
  const cellRowShift = +cellRow - +rangeRow[0] + shiftRow;
  return `${cellColumnShift}${cellRowShift}`;
}

function getObjectOfJSON(data) {
  return (typeof data === 'string') ? JSON.parse(data) : data;
}

function getOperandsSet(formula) {
  return formula.replace(REG_OPERATORS, '').split('$').splice(1);
}

function getOperandsValues(operandsSet) {
  const operandsValues = {};
  operandsSet.forEach((operand) => {
    operandsValues[operand] = ` +this.getCellValue('${operand}')`;
  });
  return operandsValues;
}

function getRangeOfCellArea(cells) {
  const cellsEntries = (Array.isArray(cells)) ? cells : Object.entries(cells);
  const rows = [];
  const columns = [];
  cellsEntries.forEach((cell) => {
    const [cellName] = cell;
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    rows.push(cellRow);
    columns.push(getColumnNumberForName(cellColumn));
  });
  return [[Math.min(...rows), Math.max(...rows)], [Math.min(...columns), Math.max(...columns)]];
}

class TableDocument {
  constructor({
    template = false,
    methodName = null,
    rows = {},
    rowCount = ROW_COUNT,
    columns = {},
    columnCount = COLUMNS_COUNT,
    cells = {},
    styles = [],
    scripts = {},
    namedAreas = [],
    cellWidth = CELL_WIDTH,
    cellHeight = CELL_HEIGHT,
    JSONString = null,
  } = {}) {
    if (JSONString) {
      const JSONStringParse = JSON.parse(JSONString);
      ({
        template: this.template = false,
        methodName: this.methodName = null,
        rows: this.rows = {},
        rowCount: this.rowCount = ROW_COUNT,
        columns: this.columns = {},
        columnCount: this.columnCount = COLUMNS_COUNT,
        cells: this.cells = {},
        styles: this.styles = [],
        scripts: this.scripts = {},
        namedAreas: this.namedAreas = [],
        cellWidth: this.cellWidth = CELL_WIDTH,
        cellHeight: this.cellHeight = CELL_HEIGHT,
      } = JSONStringParse);
      return;
    }
    this.template = template;
    this.methodName = methodName;
    this.rows = rows;
    this.rowCount = rowCount;
    this.columns = columns;
    this.columnCount = columnCount;
    this.cells = cells;
    this.styles = styles;
    this.scripts = scripts;
    this.namedAreas = namedAreas;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  addArea(cellName, areaName, shiftType = SHIFT_TYPE.VERTICAL) {
    const area = this.documentTemplate.getNamedArea(areaName);
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    if (shiftType === SHIFT_TYPE.VERTICAL) {
      this.insertArea(1, cellRow, area, SHIFT_TYPE.VERTICAL);
    }
    if (shiftType === SHIFT_TYPE.HORIZONTAL) {
      this.insertArea(getColumnNumberForName(cellColumn), 1, area, SHIFT_TYPE.HORIZONTAL);
    }
  }

  // buildDocument(data, template, settings) {
  //   const insertMethods = {
  //     put: (buildData, buildArea, buildParameter) => { this.putArea(buildData, buildArea, buildParameter); },
  //     join: (buildData, buildArea, buildParameter) => { this.joinArea(buildData, buildArea, buildParameter); },
  //   };
  //   const documentData = getObjectOfJSON(data);
  //   const documentTemplate = getObjectOfJSON(template);
  //   const documentSettings = getObjectOfJSON(settings);

  //   if (!this.documentTemplate) this.documentTemplate = documentTemplate;
  //   if (!this.documentSettings) this.documentSettings = documentSettings;

  //   documentData.forEach((item) => {
  //     const [dataKey, dataValue] = Object.entries(item)[0];
  //     const dataSetting = documentSettings[dataKey] || null;
  //     let area = null;
  //     let insertMethod = null;
  //     let parameters = {};
  //     if (dataSetting) {
  //       ({ methodName: insertMethod, parameters } = dataSetting);
  //       area = this.documentTemplate.getNamedArea(dataSetting.templateSectionName);
  //     } else {
  //       area = this.documentTemplate.getNamedArea(dataKey);
  //       insertMethod = area.methodName;
  //     }
  //     if (!Array.isArray(dataValue)) {
  //       const nestedData = [
  //         { [dataKey]: [{ ...dataValue }] },
  //       ];
  //       this.buildDocument(nestedData, template, settings);
  //       return;
  //     }
  //     dataValue.forEach((dataValueItem) => {
  //       insertMethods[insertMethod](dataValueItem, area, parameters);
  //       Object.entries(dataValueItem).forEach((parameter) => {
  //         const [parameterKey, parameterValue] = parameter;
  //         if (Array.isArray(parameterValue)) {
  //           const nestedData = [
  //             { [parameterKey]: [...parameterValue] },
  //           ];
  //           this.buildDocument(nestedData, template, dataSetting.nestedData);
  //         }
  //       });
  //     });
  //   });
  // }

  // buildDocument(data, template, settings) {
  //   const buldMethods = {
  //     put: (buildData, buildArea, buildParameter) => { this.putArea(buildData, buildArea, buildParameter); },
  //     join: (buildData, buildArea, buildParameter) => { this.joinArea(buildData, buildArea, buildParameter); },
  //   };
  //   const documentData = getObjectOfJSON(data);
  //   const documentTemplate = getObjectOfJSON(template);
  //   const documentSettings = getObjectOfJSON(settings);
  //   this.documentTemplate = documentTemplate;
  //   this.documentSettings = documentSettings;
  //   console.log(documentSettings);
  //   documentData.forEach((item) => {
  //     const [itemDataKey, itemDataValue] = Object.entries(item)[0];
  //     const itemSetting = Object.entries(documentSettings).find((setting) => setting[0] === itemDataKey);
  //     let area = null;
  //     let buildMethodName = null;
  //     let areaParameters = {};

  //     if (itemSetting) {
  //       console.log(itemSetting);
  //       const [, tagValue] = itemSetting;
  //       const { templateSectionName, methodName, parameters } = tagValue;

  //       area = documentTemplate.getNamedArea(templateSectionName);
  //       areaParameters = parameters;
  //       buildMethodName = methodName;
  //     } else {
  //       area = documentTemplate.getNamedArea(itemDataKey);
  //       buildMethodName = area.methodName;
  //     }
  //     if (!Array.isArray(itemDataValue)) {
  //       const nestedData = [
  //         { [itemDataKey]: [{ ...itemDataValue }] },
  //       ];
  //       this.buildDocument(nestedData, template, settings);
  //       return;
  //     }
  //     itemDataValue.forEach((itemData) => {
  //       console.log(areaParameters);
  //       buldMethods[buildMethodName](itemData, area, areaParameters);

  //       Object.keys(itemData).forEach((parameterKey) => {
  //         if (Array.isArray(itemData[parameterKey])) {
  //           const nestedData = [
  //             { [parameterKey]: [...itemData[parameterKey]] },
  //           ];
  //           this.buildDocument(nestedData, template, settings);
  //         }
  //       });
  //     });
  //   });
  // }

  calculateCellValue(cellName) {
    const cellFormula = this.getCellParameter(cellName, CELL_ATTRIBUTES.FORMULA);
    const operandsSet = getOperandsSet(cellFormula);
    if (operandsSet.includes(cellName)) { this.updateCellValue(cellName, NaN); return NaN; }
    const operandsValues = getOperandsValues(operandsSet);
    const fillFormula = fillingFormula(operandsValues, cellFormula);
    // check formula
    const rezult = eval(fillFormula); // eslint-disable-line no-eval
    this.updateCellValue(cellName, rezult);
    return rezult;
  }

  deleteArea(range, shiftType = null) {
    // console.log(range);
    const rangeType = getRangeType(range);
    this.deleteRange(range);

    if (!shiftType || [RANGE_TYPE.CELL, RANGE_TYPE.RANGE].includes(rangeType)) return;

    const [rangeFrom, rangeTo] = getRangeSplit(range);
    const rangeShiftFrom = getRangeShift(rangeTo, SHIFT_TYPE.VERTICAL, 1);
    const rangeShiftArea = this.getRangeToEdge(rangeShiftFrom);
    const areaShift = this.getAreaForRange(rangeShiftArea);
    const shiftArea = {
      [SHIFT_TYPE.VERTICAL]: () => {
        this.deleteRange(rangeShiftArea, DELETE_MODE.ROW);
        this.insertArea(1, +rangeFrom, areaShift);
      },
      [SHIFT_TYPE.HORIZONTAL]: () => {
        this.deleteRange(rangeShiftArea, DELETE_MODE.COLUMN);
        this.insertArea(getColumnNumberForName(rangeFrom), 1, areaShift);
      },
      null: () => {},
    };
    shiftArea[shiftType]();
  }

  deleteRange(range, deleteMode = null) {
    const cellsInRange = this.getCellsInRange(range, RETURN_FORMAT.KEYS);
    // console.log(cellsInRange);
    const cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRange.includes(cellName));
    });
    this.cells = { ...Object.fromEntries(cells) };
    if (deleteMode === DELETE_MODE.ROW) {
      const rowKeys = this.getRowKeysInRange(range);
      const rows = Object.entries(this.rows).filter((row) => {
        const [rowName] = row;
        return (!rowKeys.includes(+rowName));
      });
      this.rows = { ...Object.fromEntries(rows) };
    }
    if (deleteMode === DELETE_MODE.COLUMN) {
      const columnKeys = this.getColumnKeysInRange(range);
      const columns = Object.entries(this.columns).filter((column) => {
        const [columnName] = column;
        return (!columnKeys.includes(columnName));
      });
      this.columns = { ...Object.fromEntries(columns) };
    }
  }

  deserialize(data, template, settings) {
    const documentData = getObjectOfJSON(data);
    const documentTemplate = getObjectOfJSON(template);
    const documentSettings = getObjectOfJSON(settings);
    if (!this.documentTemplate) this.documentTemplate = documentTemplate;
    if (!this.documentSettings) this.documentSettings = documentSettings;

    documentSettings.forEach((setting) => {
      const [key, keyValue] = Object.entries(setting)[0];
      if (Object.keys(keyValue).includes('nested')) return;
      const dataSection = documentData.find((item) => Object.keys(item).includes(key));
      const dataSectionItems = dataSection[key];
      if (Array.isArray(dataSectionItems)) {
        dataSectionItems.forEach((dataSectionItem) => {
          this.deserializeArea(key, dataSectionItem);
        });
        return;
      }
      this.deserializeArea(key, dataSectionItems);
    });
  }

  deserializeArea(key, dataItem) {
    const insertMethods = {
      put: (buildData, buildArea, buildParameter) => { this.putArea(buildData, buildArea, buildParameter); },
      join: (buildData, buildArea, buildParameter) => { this.joinArea(buildData, buildArea, buildParameter); },
    };
    console.log(key);
    if (Array.isArray(dataItem)) {
      dataItem.forEach((item) => {
        this.deserializeArea(key, item);
      });
      return;
    }
    const [, keyValue] = Object.entries(this.documentSettings.find((setting) => Object.keys(setting).includes(key)))[0];
    const {
      templateSectionName, methodName: insertMethod, parameters, nestedData,
    } = keyValue;
    const area = this.documentTemplate.getNamedArea(templateSectionName);
    insertMethods[insertMethod](dataItem, area, parameters);

    if (nestedData) {
      nestedData.forEach((nestedDataKey) => {
        if (Object.keys(dataItem).includes(nestedDataKey)) this.deserializeArea(nestedDataKey, dataItem[nestedDataKey]);
      });
    }
  }

  executeAction(cellName) {
    const actionName = this.getCellParameter(cellName, CELL_ATTRIBUTES.ACTION);
    const { script } = this.getScript(actionName);
    const actionFunction = eval(script); // eslint-disable-line no-eval

    actionFunction(cellName);
    this.recalculateFormulas();
  }

  exportData() {
    // console.log(this);
    const documentData = [];
    this.namedAreas.forEach((namedArea) => {
      const cells = this.getCellsInRange(namedArea.range);
      const cellsValue = {};
      // console.log(cells);
      const sectionSetting = Object.entries(this.documentSettings)
        .find((section) => section[1].templateSectionName === namedArea.name);
      if (sectionSetting) {
        const [key, keyValue] = sectionSetting;
        cells.forEach((cell) => {
          const [, cellValue] = cell;
          if (Object.keys(keyValue.parameters).includes(cellValue.parameter)) {
            cellsValue[keyValue.parameters[cellValue.parameter]] = cellValue.value;
          }
        });

        // const [presentationType, nestedData] = keyValue;
        const { presentationType, nestedData } = keyValue;
        if (nestedData) {
          console.log('rec');
          console.log(key);
          console.log(nestedData);
          console.log(cells);
        }
        const documentDataItem = documentData.find((item) => Object.keys(item).includes(key));
        if (!documentDataItem) {
          documentData.push({ [key]: (presentationType === 'unit') ? { ...cellsValue } : [{ ...cellsValue }] });
          // if (nestedData) {
          //   //recurse
          // }
          return;
        }
        if (presentationType === 'multiple') documentDataItem[key].push({ ...cellsValue });
        // console.log(documentDataItem[key]);
      }
    });
    console.log(documentData);
  }

  fillArea(dataArea, parameters) {
    // console.log(dataArea);
    // console.log(parameters);
    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      const parameterName = cellValue?.parameter || null;
      if (!parameterName) return;
      const parameterNameData = parameters[parameterName] || parameterName;
      if (!parameterName || !dataArea[parameterNameData]) return;
      cellValue.value = dataArea[parameterNameData];
    });
  }

  recalculateFormulas() {
    const formulasCellsSet = this.getFormularsCellsSet();
    formulasCellsSet.map((cellName) => this.calculateCellValue(cellName));
  }

  getAreaCopy() {
    const {
      rows, columns, cells, styles, scripts, namedAreas,
    } = JSON.parse(JSON.stringify({
      rows: this.rows,
      columns: this.columns,
      cells: this.cells,
      styles: this.styles,
      scripts: this.scripts,
      namedAreas: this.namedAreas,
    }));
    return new TableDocument({
      rangeType: this.rangeType,
      rows,
      rowCount: this.rowCount,
      columns,
      columnCount: this.columnCount,
      cells,
      styles,
      scripts,
      namedAreas,
    });
  }

  getAreaForRange(range) {
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [{
      name: 'insert',
      range,
    }];
    const cellsInRange = this.getCellsInRange(range);
    const rangeCellArea = getRangeOfCellArea(cellsInRange);

    cellsInRange.forEach((cell) => {
      const [cellNameCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea);
      const { parthSymbol: cellColumnCurrent, parthDigit: cellRowCurrent } = getParseAtSymbolDigit(cellNameCurrent);
      const { parthSymbol: cellColumnShift, parthDigit: cellRowShift } = getParseAtSymbolDigit(cellNameShift);

      cells[cellNameShift] = this.cells[cellNameCurrent];
      columns[cellColumnShift] = this.columns[cellColumnCurrent];
      rows[cellRowShift] = this.rows[cellRowCurrent];

      const cellStyles = this.getCellStyles(cellNameCurrent);
      if (cellStyles) styles.push(cellStyles);
    });
    return new TableDocument({
      methodName: (getRangeType(range) === 'row') ? 'put' : 'join',
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      columnCount: Object.keys(columns).length,
      cells,
      styles,
      namedAreas,
    });
  }

  getCell(cellName) {
    let cell = {};
    if (Object.keys(this.cells).includes(cellName)) {
      cell = this.cells[cellName];
    }
    return cell;
  }

  getCellParameter(cellName, cellParameter) {
    if (!this.cells[cellName]) return null;
    return this.cells[cellName][cellParameter] || null;
  }

  getCellStyles(cellName) {
    const cellStyle = this.styles.find((item) => item.name === cellName);
    if (!cellStyle) return null;
    return cellStyle;
  }

  getCellValue(cellName) {
    const cellFormula = this.getCellParameter(cellName, CELL_ATTRIBUTES.FORMULA);
    if (cellFormula) {
      const calculateValue = this.calculateCellValue(cellName);
      return calculateValue;
    }
    const cellValue = this.getCellParameter(cellName, CELL_ATTRIBUTES.VALUE);
    if (cellValue) return cellValue;
    return NaN;
  }

  getCellsInRange(range, returnFormat = RETURN_FORMAT.ENTRIES) {
    const rowKeys = this.getRowKeysInRange(range);
    const columnKeys = this.getColumnKeysInRange(range);
    const cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      const { parthSymbol: columnKey, parthDigit: rowKey } = getParseAtSymbolDigit(cellName);
      return (columnKeys.includes(columnKey) && rowKeys.includes(rowKey));
    });
    const formatRezult = {
      [RETURN_FORMAT.ENTRIES]: () => cells,
      [RETURN_FORMAT.KEYS]: () => Object.keys(Object.fromEntries(cells)),
      [RETURN_FORMAT.OBJECT]: () => Object.fromEntries(cells),
    };
    return formatRezult[returnFormat]();
  }

  getColumnKeysInRange(range) {
    const type = getRangeType(range);
    const columnKeys = [];
    const columnSet = {
      [RANGE_TYPE.CELL]: () => {
        const { parthSymbol: columnKey } = getParseAtSymbolDigit(range);
        columnKeys.push(columnKey);
        return columnKeys;
      },
      [RANGE_TYPE.COLUMN]: () => {
        let [rangeFrom, rangeTo] = getRangeSplit(range);
        rangeFrom = +getColumnNumberForName(rangeFrom);
        rangeTo = +getColumnNumberForName(rangeTo);
        for (let columnKey = rangeFrom; columnKey < rangeTo + 1; columnKey += 1) {
          columnKeys.push(getColumnNameForNumber(columnKey));
        }
        return columnKeys;
      },
      [RANGE_TYPE.ROW]: () => {
        columnKeys.push(...Object.keys(this.columns));
        return columnKeys;
      },
      [RANGE_TYPE.RANGE]: () => {
        // console.log(range);
        const [rangeFrom, rangeTo] = getRangeSplit(range);
        let { parthSymbol: columnFrom } = getParseAtSymbolDigit(rangeFrom);
        let { parthSymbol: columnTo } = getParseAtSymbolDigit(rangeTo);
        columnFrom = +getColumnNumberForName(columnFrom);
        columnTo = +getColumnNumberForName(columnTo);
        for (let columnKey = columnFrom; columnKey < columnTo + 1; columnKey += 1) {
          columnKeys.push(getColumnNameForNumber(columnKey));
        }
        return columnKeys;
      },
    };
    return columnSet[type]();
  }

  getSerializationDocument() {
    console.log(this.namedAreas);
    // const documentData = [];
    this.documentSettings.forEach((setting) => {
      const [, keyValue] = Object.entries(setting)[0];
      if (Object.keys(keyValue).includes('nested')) return;
      const { templateSectionName } = keyValue;
      // const namedAreas = this.namedAreas.filter((namedArea) => namedArea.name === );
      console.log(templateSectionName);
    });
    // this.namedAreas.forEach((namedArea) => {
    //   // const cells = this.getCellsInRange(namedArea.range);
    //   // const cellsValue = {};
    //   // console.log(namedArea);
    //   const settingSection = this.documentSettings.find((setting) => {
    //     const settingKey = Object.entries(setting)[0];
    //     // console.log(settingKey);
    //     return settingKey[1].templateSectionName === namedArea.name;
    //   });
    //   console.log(settingSection);
    // });
  }

  getDocumentData(JSONFormat = false) {
    const documentData = [];
    this.namedAreas.forEach((namedArea) => {
      const cells = this.getCellsInRange(namedArea.range);
      const cellsValue = {};
      // console.log(cells);
      const settingSection = Object.entries(this.documentSettings)
        .find((section) => section[1].templateSectionName === namedArea.name);
      if (settingSection) {
        const [sectionKey, sectionValue] = Object.entries(this.documentSettings)
          .find((section) => section[1].templateSectionName === namedArea.name);
        cells.forEach((cell) => {
          const [, cellValue] = cell;
          if (Object.keys(sectionValue.parameters).includes(cellValue.parameter)) {
            cellsValue[sectionValue.parameters[cellValue.parameter]] = cellValue.value;
          }
        });
        if (sectionValue.methodName === 'put') {
          const itemSection = documentData.find((item) => Object.keys(item).includes(sectionKey));
          if (!itemSection) {
            documentData.push({ [sectionKey]: [{ ...cellsValue }] });
          }
          if (itemSection) {
            itemSection[sectionKey].push({ ...cellsValue });
          }
        }
        if (sectionValue.methodName === 'join') {
          const [parentSection] = Object.entries(documentData[documentData.length - 1]);
          const [, parentSectionValue] = parentSection;
          if (Object.keys(parentSectionValue[parentSectionValue.length - 1]).includes(sectionKey)) {
            parentSectionValue[parentSectionValue.length - 1][sectionKey].push({ ...cellsValue });
          }
          if (!Object.keys(parentSectionValue[parentSectionValue.length - 1]).includes(sectionKey)) {
            parentSectionValue[parentSectionValue.length - 1][sectionKey] = [{ ...cellsValue }];
          }
        }
      }
      if (!settingSection) {
        console.log(namedArea);
        cells.forEach((cell) => {
          const [, cellValue] = cell;
          cellsValue[cellValue.parameter] = cellValue.value;
        });
        const section = documentData.find((item) => {
          console.log(item, namedArea.name);
          return Object.keys(item).includes(namedArea.name);
        });
        if (!section) documentData.push({ [namedArea.name]: [{ ...cellsValue }] });
        if (section) {
          section[namedArea.name].push({ ...cellsValue });
        }
      }
    });
    console.log(documentData);
    return (JSONFormat) ? JSON.stringify(documentData) : documentData;
  }

  getRangeByAreaName(areaName) {
    // console.log(areaName);
    // console.log(this.namedAreas);
    let range = null;
    if (!areaName) return null;
    if (areaName.includes('|')) {
      const [areaNameR1, areaNameR2] = areaName.split('|');
      const rangeR1 = this.namedAreas.find((item) => item.name === areaNameR1);
      const rangeR2 = this.namedAreas.find((item) => item.name === areaNameR2);
      // console.log(rangeR1);
      // console.log(rangeR2);
      let rangeRow = null;
      let rangeColumn = null;
      if (getRangeType(rangeR1) === RANGE_TYPE.ROW) {
        rangeRow = rangeR1;
        rangeColumn = rangeR2;
      } else {
        rangeRow = rangeR2;
        rangeColumn = rangeR1;
      }
      const [r1, r2] = rangeRow.range.split(':');
      const [c1, c2] = rangeColumn.range.split(':');
      range = `${c1}${r1}:${c2}${r2}`.toLowerCase();
    } else {
      const namedArea = this.namedAreas.find((item) => item.name === areaName);
      range = namedArea?.range.toLowerCase() || null;
    }
    // console.log(range);
    return range;
  }

  getRangeByCellName(cellName, areaName = null, rangeType = RANGE_TYPE.ROW) { // ??????
    if (rangeType === RANGE_TYPE.CELL) return cellName;
    let range = '';
    const rangeArea = this.getRangeByAreaName(areaName);
    const { parthSymbol: cellColumn, parthDigit: cellRow } = getParseAtSymbolDigit(cellName);
    if (rangeArea) {
      const rangeLength = getRangeLength(rangeArea);
      if (rangeType === RANGE_TYPE.ROW) range = `a${cellRow}:${cellColumn}${cellRow + (rangeLength - 1)}`;
      if (rangeType === RANGE_TYPE.COLUMN) range = `${cellColumn}1:${cellColumn + (rangeLength - 1)}${cellRow + (rangeLength - 1)}`; // ????
    }
    if (rangeArea === null) {
      if (rangeType === RANGE_TYPE.ROW) range = cellRow;
      if (rangeType === RANGE_TYPE.COLUMN) range = cellColumn;
    }
    return range;
  }

  getRangeToEdge(rangeFrom) {
    const rangeType = getRangeType(rangeFrom);
    const rangeEdge = {
      [RANGE_TYPE.CELL]: () => `${rangeFrom}:${getColumnNameForNumber(this.getLastColumn())}${this.getLastRow()}`,
      [RANGE_TYPE.ROW]: () => `${rangeFrom}:${this.getLastRow()}`,
      [RANGE_TYPE.COLUMN]: () => `${rangeFrom}:${getColumnNameForNumber(this.getLastColumn())}`,
    };
    return rangeEdge[rangeType]();
  }

  getRowKeysInRange(range) {
    const type = getRangeType(range);
    const rowKeys = [];
    const rowSet = {
      [RANGE_TYPE.CELL]: () => {
        const { parthDigit: rowKey } = getParseAtSymbolDigit(range);
        rowKeys.push(+rowKey);
        return rowKeys;
      },
      [RANGE_TYPE.COLUMN]: () => {
        Object.keys(this.rows).forEach((row) => rowKeys.push(+row));
        return rowKeys;
      },
      [RANGE_TYPE.ROW]: () => {
        const [rangeFrom, rangeTo] = getRangeSplit(range);
        for (let rowKey = +rangeFrom; rowKey < +rangeTo + 1; rowKey += 1) rowKeys.push(+rowKey);
        return rowKeys;
      },
      [RANGE_TYPE.RANGE]: () => {
        const [rangeFrom, rangeTo] = getRangeSplit(range);
        const { parthDigit: rowFrom } = getParseAtSymbolDigit(rangeFrom);
        const { parthDigit: rowTo } = getParseAtSymbolDigit(rangeTo);
        for (let rowKey = rowFrom; rowKey < rowTo + 1; rowKey += 1) rowKeys.push(+rowKey);
        return rowKeys;
      },
    };
    return rowSet[type]();
  }

  getFormularsCellsSet() {
    const formulasCellsSet = Object.keys(this.cells)
      .filter((cellName) => Object.keys(this.cells[cellName]).includes(CELL_ATTRIBUTES.FORMULA));
    return formulasCellsSet;
  }

  getDocument(JSONFormat = false) {
    const document = {
      rows: this.rows,
      rowCount: this.rowCount,
      columns: this.columns,
      columnCount: this.columnCount,
      cells: this.cells,
      styles: this.styles,
    };
    return (JSONFormat) ? JSON.stringify(document) : document;
  }

  getLastColumn() {
    const columns = [0];
    Object.keys(this.columns).forEach((column) => columns.push(+getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  getLastColumnInRow(numberRow) {
    const cellsInRow = this.getCellsInRange(`${numberRow}:${numberRow}`);
    return +getRangeOfCellArea(cellsInRow)[1][1];
  }

  getLastRow() {
    const rows = [0];
    Object.keys(this.rows).forEach((row) => rows.push(+row));
    return Math.max(...rows);
  }

  getNamedArea(areaName) {
    // console.log(areaName);
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const scripts = {};
    const range = this.getRangeByAreaName(areaName);
    const namedAreas = [{
      name: areaName,
      range,
    }];
    // console.log(range);
    const cellsInRange = this.getCellsInRange(range);
    const rangeCellArea = getRangeOfCellArea(cellsInRange);

    cellsInRange.forEach((cell) => {
      const [cellNameCurrent, cellValueCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea);
      const { parthSymbol: cellColumnCurrent, parthDigit: cellRowCurrent } = getParseAtSymbolDigit(cellNameCurrent);
      const { parthSymbol: cellColumnShift, parthDigit: cellRowShift } = getParseAtSymbolDigit(cellNameShift);

      cells[cellNameShift] = this.cells[cellNameCurrent];
      columns[cellColumnShift] = this.columns[cellColumnCurrent];
      rows[cellRowShift] = this.rows[cellRowCurrent];

      const cellStyles = this.getCellStyles(cellNameCurrent);
      if (cellStyles) styles.push(cellStyles);

      if (Object.keys(cellValueCurrent).includes('action')) {
        const actionName = cellValueCurrent.action;
        const script = Object.entries(this.scripts).find((scriptItem) => scriptItem[0] === actionName);
        // console.log(script);
        if (script) {
          scripts[actionName] = this.scripts[actionName];
        }
      }
      // console.log(cellValueCurrent);
    });
    // console.log(scripts);
    return new TableDocument({
      methodName: (getRangeType(range) === 'row') ? 'put' : 'join',
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      columnCount: Object.keys(columns).length,
      cells,
      styles,
      scripts,
      namedAreas,
    });
  }

  getNamedAreaCellShift(cellNameCurrent, cellNameShift, areaName) {
    const cellNamedArea = this.namedAreas.find((namedArea) => namedArea.range.split(':')[0].toLowerCase() === cellNameCurrent
      && namedArea.name !== areaName);
    if (!cellNamedArea) return null;
    return {
      name: cellNamedArea.name,
      range: cellNameShift,
    };
  }

  getScript(scriptName) {
    const script = this.scripts[scriptName];
    if (script) return script;
    return null;
  }

  insertArea(numberColumn, numberRow, area, shiftType = null) {
    // console.log(area);
    const rows = {};
    const columns = {};
    const cells = {};
    const {
      rows: areaRow,
      columns: areaColumn,
      cells: areaCells,
      styles: areaStyles,
      scripts: areaScripts,
      namedAreas: areaNamedArea,
    } = area;

    const rangeType = getRangeType(areaNamedArea[0].range);
    const rangeLength = getRangeLength(areaNamedArea[0].range);
    const rangeFrom = `${getColumnNameForNumber(numberColumn)}${numberRow}`;
    let rangeTo = `${getColumnNameForNumber(numberColumn + rangeLength[0] - 1)}${numberRow + rangeLength[1] - 1}`;
    if (rangeType === RANGE_TYPE.ROW) {
      rangeTo = `${getColumnNameForNumber(numberColumn)}${numberRow + rangeLength[1] - 1}`;
    }
    if (rangeType === RANGE_TYPE.COLUMN) {
      rangeTo = `${getColumnNameForNumber(numberColumn + rangeLength[0] - 1)}${numberRow}`;
    }
    areaNamedArea[0].range = `${rangeFrom}:${rangeTo}`;

    const rangeCellArea = getRangeOfCellArea(areaCells);
    const rangeShift = this.getRangeToEdge(`${rangeFrom}`);
    const areaShift = this.getAreaForRange(rangeShift);
    const shiftInsert = {
      [SHIFT_TYPE.HORIZONTAL]: () => {
        this.deleteRange(rangeShift, DELETE_MODE.COLUMN);
        this.insertArea(numberColumn + rangeLength[0], numberRow, areaShift);
      },
      [SHIFT_TYPE.VERTICAL]: () => {
        this.deleteRange(rangeShift, DELETE_MODE.ROW);
        this.insertArea(numberColumn, numberRow + rangeLength[1], areaShift);
      },
      null: () => {},
    };

    shiftInsert[shiftType]();

    Object.entries(areaCells).forEach((cell) => {
      const [cellNameCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea, numberColumn, numberRow);
      const { parthSymbol: cellColumnCurrent, parthDigit: cellRowCurrent } = getParseAtSymbolDigit(cellNameCurrent);
      const { parthSymbol: cellColumnShift, parthDigit: cellRowShift } = getParseAtSymbolDigit(cellNameShift);

      rows[cellRowShift] = areaRow[cellRowCurrent];
      columns[cellColumnShift] = areaColumn[cellColumnCurrent];
      cells[cellNameShift] = areaCells[cellNameCurrent];
    });

    areaStyles.forEach((itemAreaStyle) => {
      const style = this.styles.find((itemStyle) => itemStyle.name === itemAreaStyle.name);
      if (!style) this.styles.push(itemAreaStyle);
    });

    this.rows = { ...this.rows, ...rows };
    this.columns = { ...this.columns, ...columns };
    this.cells = { ...this.cells, ...cells };
    this.scripts = { ...this.scripts, ...areaScripts };
    this.namedAreas = [...this.namedAreas, ...areaNamedArea];
    this.rowCount = this.getLastRow();
    this.columnCount = this.getLastColumn();
  }

  joinArea(dataArea, area, parameters) {
    const areaCopy = area.getAreaCopy();
    const numberLastRow = this.getLastRow();
    const numberNewColumn = this.getLastColumnInRow(numberLastRow) + 1;
    areaCopy.fillArea(dataArea, parameters);
    this.insertArea(numberNewColumn, numberLastRow, areaCopy);
  }

  putArea(dataArea, area, parameters) {
    const areaCopy = area.getAreaCopy();
    const numberNewRow = this.getLastRow() + 1;
    areaCopy.fillArea(dataArea, parameters);
    this.insertArea(1, numberNewRow, areaCopy);
  }

  serialization() {
    this.documentData = [];
    this.documentSettings.forEach((setting) => {
      const [key] = Object.entries(setting)[0];
      // if (Object.keys(keyValue).includes('nested')) return;
      // const { templateSectionName } = keyValue;
      // console.log(this.namedAreas.filter((namedArea) => namedArea.name === templateSectionName));
      console.log(key);
      console.log(this.getNamedArea(key));
      // console.log(keyValue);
    });
  }

  serializationArea() {
    console.log(this.columnCount);
  }

  checkEditAccess(cellName) {
    if (Object.keys(this.cells).includes(cellName) && this.cells[cellName].disabled === true) return false;
    if (!Object.keys(this.cells).includes(cellName)) return true;
    if (Object.keys(this.cells[cellName]).includes('areaName')) return true;
    return true;
  }

  editingCell(cellName, cellValue) { // проверять существует строка/столбец
    // получать максимальный из имеющихся, сравнивать
    // если пусстое значение и больше ничего нет, то удалять ячейку из набора
    let cellValues = (Object.keys(this.cells).includes(cellName)) ? this.cells[cellName] : {};
    cellValues = { ...cellValues, ...{ value: cellValue } };
    if (!cellValue && !Object.keys(this.cells).includes(cellName)) return;
    this.cells = { ...this.cells, ...{ [cellName]: cellValues } };
    this.recalculateFormulas();
  }

  updateCellValue(cellName, cellValue) {
    this.cells[cellName].value = cellValue;
    this.cells = { ...this.cells, ...{ [cellName]: this.cells[cellName] } };
  }
}

export default TableDocument;
