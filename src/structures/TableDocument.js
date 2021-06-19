const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;
const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const REG_SYMBOLS = /[A-Z]/gi;
const REG_DIGITS = /[0-9]/g;
const REG_OPERATORS = /[+-/*)(% ]/g;

const CELL_ATTRIBUTES = {
  VALUE: 'value',
  FORMULA: 'formula',
  ACTION: 'action',
};

const SHIFT_TYPE = {
  vertical: 'vertical',
  horizontal: 'horizontal',
};

function fillingFormula(operandsValues, formula) {
  let fillFormula = formula;
  Object.entries(operandsValues).forEach((operand) => {
    const [operandName, operandValue] = operand;
    fillFormula = fillFormula.replace(`$${operandName}`, operandValue);
  });
  return fillFormula;
}

function getColumnNameForNumber(number) {
  if (number > 702) return 'Infinity';
  const settLength = SET_COLUMN_NAME.length;
  if (number <= settLength) {
    const columnName = SET_COLUMN_NAME[number - 1];
    return columnName;
  }
  if ((number % settLength) === 0) {
    const columnName = `${SET_COLUMN_NAME[
      ((number - settLength) / settLength) - 1
    ]}${SET_COLUMN_NAME[settLength - 1]}`;
    return columnName;
  }
  const columnName = `${SET_COLUMN_NAME[
    (Math.floor(number / settLength)) - 1
  ]}${SET_COLUMN_NAME[(number % settLength) - 1]}`;
  return columnName;
}

function getColumnNumberForName(name) {
  const nameLowerCase = name.toLowerCase();
  if (nameLowerCase.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === nameLowerCase[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
}

function getParseAtSymbolDigit(str) {
  return {
    parthSymbol: str.replace(REG_DIGITS, ''),
    parthDigit: +str.replace(REG_SYMBOLS, ''),
  };
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

function parseCellName(cellName) {
  return {
    cellColumn: cellName.replace(REG_DIGITS, ''),
    cellRow: +cellName.replace(REG_SYMBOLS, ''),
  };
}

function getRangeType(range) {
  const [v1, v2] = `${range}`.toLowerCase().split(':');
  if (!v2) return 'cell';
  if (+v1 && +v2) return 'row';
  if (v1.match(REG_DIGITS) && v1.match(REG_SYMBOLS)
    && v2.match(REG_DIGITS) && v2.match(REG_SYMBOLS)) return 'range';
  if (getColumnNumberForName(v1) && getColumnNumberForName(v2)) return 'column';
  return 'RaN';
}

function getRangeSize(range) {
  const rangeType = getRangeType(range);
  const [v1, v2] = range.toLowerCase().split(':');
  const rangeSize = {
    cell: () => [1, 1],
    row: () => [+v1, +v2],
    column: () => [+getColumnNumberForName(v1), getColumnNumberForName(v2)],
    range: () => {
      const { parthSymbol: fromCellColumn, parthDigit: fromCellRow } = getParseAtSymbolDigit(v1);
      const { parthSymbol: toCellColumn, parthDigit: toCellRow } = getParseAtSymbolDigit(v2);
      return [
        [fromCellRow, getColumnNumberForName(fromCellColumn)],
        [toCellRow, getColumnNumberForName(toCellColumn)],
      ];
    },
  };
  return rangeSize[rangeType]();
}

function getRangeOfCellArea(cells) {
  const cellsEntries = (Array.isArray(cells)) ? cells : Object.entries(cells);
  const rows = [];
  const columns = [];
  cellsEntries.forEach((cell) => {
    const [cellName] = cell;
    const { cellColumn, cellRow } = parseCellName(cellName);
    rows.push(cellRow);
    columns.push(getColumnNumberForName(cellColumn));
  });
  return [[Math.min(...rows), Math.max(...rows)], [Math.min(...columns), Math.max(...columns)]];
}

function getRangeLength(range) {
  if (Array.isArray(range)) return range[1] - range[0] + 1;
  // if (typeof range === 'string') {
  const rangeType = getRangeType(range);
  const [v1, v2] = range.toLowerCase().split(':');
  const rangeLength = {
    cell: () => 1,
    row: () => +v2 - +v1 + 1,
    column: () => +getColumnNumberForName(v2) - +getColumnNumberForName(v1) + 1,
  };
  return rangeLength[rangeType]();
  // }
}

class TableDocument {
  constructor({
    template = false,
    // rangeType = null,
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
        // rangeType: this.rangeType = null,
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
    // this.rangeType = rangeType;
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

  buildDocument(data, template, settings) {
    const buldMethods = {
      put: (buildData, buildArea, buildParameter) => { this.putArea(buildData, buildArea, buildParameter); },
      join: (buildData, buildArea, buildParameter) => { this.joinArea(buildData, buildArea, buildParameter); },
    };
    const documentData = getObjectOfJSON(data);
    const documentTemplate = getObjectOfJSON(template);
    const documentSettings = getObjectOfJSON(settings);
    this.documentTemplate = documentTemplate;
    this.documentSettings = documentSettings;

    documentData.forEach((item) => {
      const [itemDataKey, itemDataValue] = Object.entries(item)[0];
      const itemSetting = Object.entries(documentSettings).find((setting) => setting[0] === itemDataKey);
      let area = null;
      let buildMethodName = null;
      let areaParameters = {};

      if (itemSetting) {
        const [, tagValue] = itemSetting;
        const { templateSectionName, methodName, parameters } = tagValue;

        area = documentTemplate.getNamedArea(templateSectionName);
        areaParameters = parameters;
        buildMethodName = methodName;
      } else {
        area = documentTemplate.getNamedArea(itemDataKey);
        buildMethodName = area.methodName;
      }
      if (!Array.isArray(itemDataValue)) {
        const nestedData = [
          { [itemDataKey]: [{ ...itemDataValue }] },
        ];
        this.buildDocument(nestedData, template, settings);
        return;
      }
      itemDataValue.forEach((itemData) => {
        // console.log(areaParameters);
        buldMethods[buildMethodName](itemData, area, areaParameters);

        Object.keys(itemData).forEach((parameterKey) => {
          if (Array.isArray(itemData[parameterKey])) {
            const nestedData = [
              { [parameterKey]: [...itemData[parameterKey]] },
            ];
            this.buildDocument(nestedData, template, settings);
          }
        });
      });
    });
  }

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

  // deleteRange(range, shift = null) {
  //   const cells = this.getCellsInRange(range);

  // }

  executeAction(cellName) {
    const actionName = this.getCellParameter(cellName, CELL_ATTRIBUTES.ACTION);
    const { script } = this.getScript(actionName);
    const actionFunction = eval(script); // eslint-disable-line no-eval

    actionFunction(cellName);
    this.recalculateFormulas();
  }

  recalculateFormulas() {
    const formulasCellsSet = this.getFormularsCellsSet();
    formulasCellsSet.map((cellName) => this.calculateCellValue(cellName));
    console.log(formulasCellsSet);
  }

  getCell(cellName) {
    let cell = {};
    if (Object.keys(this.cells).includes(cellName)) {
      cell = this.cells[cellName];
    }
    return cell;
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

  getCellParameter(cellName, parametarCell) {
    if (!this.cells[cellName]) return null;
    return this.cells[cellName][parametarCell] || null;
  }

  getCellStyles(cellName) {
    const cellStyle = this.styles.find((item) => item.name === cellName);
    if (!cellStyle) return null;
    return cellStyle;
  }

  // getCellsInRange(range) {
  //   const cells = {}

  // }

  deleteRows(range) {
    let cellsInRangeDelete = this.getCellsInRange(range);
    let cellsInRangeDeleteKey = Object.keys(Object.fromEntries(cellsInRangeDelete));
    let cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRangeDeleteKey.includes(cellName));
    });
    this.cells = Object.fromEntries(cells);

    const rangeAreaDelete = getRangeOfCellArea(cellsInRangeDelete);
    const [rangeDeleteFrom] = range.split(':');
    const {
      parthSymbol: rangeDeleteFromColumn,
      parthDigit: rangeDeleteFromRow,
    } = getParseAtSymbolDigit(rangeDeleteFrom);
    const areaDeleteHeigth = getRangeLength(rangeAreaDelete[0]);
    const rangeAreaShiftFrom = `${rangeDeleteFromColumn}${rangeDeleteFromRow + areaDeleteHeigth}`;
    const rangeAreaShiftTo = `${getColumnNameForNumber(this.getLastColumn())}${this.getLastRow()}`;
    const rangeAreaShift = `${rangeAreaShiftFrom}:${rangeAreaShiftTo}`;

    const areaShift = this.getAreaForRange(rangeAreaShift);
    console.log(rangeAreaShift);
    cellsInRangeDelete = this.getCellsInRange(rangeAreaShift);
    cellsInRangeDeleteKey = Object.keys(Object.fromEntries(cellsInRangeDelete));
    cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      if (cellsInRangeDeleteKey.includes(cellName)) {
        const { cellRow } = parseCellName(cellName);
        delete this.rows[cellRow];
      }
      return (!cellsInRangeDeleteKey.includes(cellName));
    });
    delete this.rows[this.getLastRow()];
    this.cells = Object.fromEntries(cells);
    this.insertArea(getColumnNumberForName(rangeDeleteFromColumn), rangeDeleteFromRow, areaShift);
    this.rowCount = this.getLastRow();
  }

  deleteColumns(range) {
    let cellsInRangeDelete = this.getCellsInRange(range);
    let cellsInRangeDeleteKey = Object.keys(Object.fromEntries(cellsInRangeDelete));
    let cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRangeDeleteKey.includes(cellName));
    });
    this.cells = Object.fromEntries(cells);

    const rangeAreaDelete = getRangeOfCellArea(cellsInRangeDelete);
    const [rangeDeleteFrom] = range.split(':');
    const { cellColumn: rangeDeleteFromColumn, cellRow: rangeDeleteFromRow } = parseCellName(rangeDeleteFrom);
    const areaDeleteWidth = getRangeLength(rangeAreaDelete[1]);
    const rangeAreaShiftFrom = `${getColumnNameForNumber(getColumnNumberForName(rangeDeleteFromColumn) + areaDeleteWidth)}${rangeDeleteFromRow}`;
    const rangeAreaShiftTo = `${getColumnNameForNumber(this.getLastColumn())}${this.getLastRow()}`;
    const rangeAreaShift = `${rangeAreaShiftFrom}:${rangeAreaShiftTo}`;
    const areaShift = this.getAreaForRange(rangeAreaShift);
    console.log(areaShift);
    cellsInRangeDelete = this.getCellsInRange(rangeAreaShift);
    console.log(cellsInRangeDelete);
    cellsInRangeDeleteKey = Object.keys(Object.fromEntries(cellsInRangeDelete));
    cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRangeDeleteKey.includes(cellName));
    });
    this.cells = Object.fromEntries(cells);
    this.insertArea(getColumnNumberForName(rangeDeleteFromColumn), rangeDeleteFromRow, areaShift);

    const lastColumn = this.getLastColumn();
    for (let i = 0; i < areaDeleteWidth; i += 1) {
      const deleteColumn = lastColumn - i;
      delete this.columns[getColumnNameForNumber(deleteColumn)];
    }
    this.columnCount = this.getLastColumn();
  }

  fillArea(dataArea, parameters) {
    // console.log(dataArea);
    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      const parameterName = cellValue?.parameter || null;
      if (!parameterName) return;
      const parameterNameData = parameters[parameterName] || parameterName;
      if (!parameterName || !dataArea[parameterNameData]) return;
      cellValue.value = dataArea[parameterNameData];
    });
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

  // getCellValue(cellName) {
  //   if (!this.cells[cellName]) return null;
  //   return this.cells[cellName].value || null;
  // }

  // getCellFormula(cellName) {
  //   if (!this.cells[cellName]) return null;
  //   return this.cells[cellName].formula || null;
  // }

  getCellsInColumn(column) {
    const columnName = (+column) ? getColumnNameForNumber(column) : column;
    const cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      const { cellColumn } = parseCellName(cellName);
      console.log(cellColumn, columnName);
      return (cellColumn === columnName);
    });
    return Object.fromEntries(cells);
  }

  getCellsInRange(range) {
    const rangeType = getRangeType(range);
    const [rangeFrom, rangeTo] = getRangeSize(range);
    const setRange = [];
    if (rangeType === 'cell') {
      return Object.entries(this.cells).filter((cell) => {
        const [cellName] = cell;
        return cellName === range;
      });
    }
    if (['column', 'row'].includes(rangeType)) {
      for (let n = rangeFrom; n <= rangeTo; n += 1) setRange.push(n);
      return Object.entries(this.cells).filter((cell) => {
        const [cellName] = cell;
        const { cellColumn, cellRow } = parseCellName(cellName);
        const condition = {
          row: () => setRange.includes(cellRow),
          column: () => setRange.includes(getColumnNumberForName(cellColumn)),
        };
        return (condition[rangeType]());
      });
    }
    if (rangeType === 'range') {
      for (let n = rangeFrom[0]; n <= rangeTo[0]; n += 1) setRange.push(n);
      for (let n = rangeFrom[1]; n <= rangeTo[1]; n += 1) setRange.push(getColumnNameForNumber(n));
      return Object.entries(this.cells).filter((cell) => {
        const [cellName] = cell;
        const { cellColumn, cellRow } = parseCellName(cellName);
        return (setRange.includes(cellRow) && setRange.includes(cellColumn));
      });
    }
    return Object.entries({});
  }

  getCellsInRow(row, columnFrom = 1) {
    const cellKeys = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      const { cellColumn, cellRow } = parseCellName(cellName);
      return (+cellRow === +row && getColumnNumberForName(cellColumn) >= columnFrom);
    });
    return Object.fromEntries(cellKeys);
  }

  getFormularsCellsSet() {
    // const formulasCellsSet = Object.entries(this.cells).filter((cell) => Object.keys(cell[1]).includes(CELL_ATTRIBUTES.FORMULA));
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

  // getDocumentData(JSONFormat = false) {
  //   const documentData = [];
  //   this.namedAreas.forEach((namedArea) => {
  //     const cells = this.getCellsInRange(namedArea.range);
  //     const cellsValue = {};
  //     // console.log(cells);
  //     const settingSection = Object.entries(this.documentSettings)
  //       .find((section) => section[1].templateSectionName === namedArea.name);
  //     if (settingSection) {
  //       const [sectionKey, sectionValue] = Object.entries(this.documentSettings)
  //         .find((section) => section[1].templateSectionName === namedArea.name);
  //       cells.forEach((cell) => {
  //         const [, cellValue] = cell;
  //         if (Object.keys(sectionValue.parameters).includes(cellValue.parameter)) {
  //           cellsValue[sectionValue.parameters[cellValue.parameter]] = cellValue.value;
  //         }
  //       });
  //       if (sectionValue.methodName === 'put') {
  //         const itemSection = documentData.find((item) => Object.keys(item).includes(sectionKey));
  //         if (!itemSection) {
  //           documentData.push({ [sectionKey]: [{ ...cellsValue }] });
  //         }
  //         if (itemSection) {
  //           itemSection[sectionKey].push({ ...cellsValue });
  //         }
  //       }
  //       if (sectionValue.methodName === 'join') {
  //         const [parentSection] = Object.entries(documentData[documentData.length - 1]);
  //         const [, parentSectionValue] = parentSection;
  //         if (Object.keys(parentSectionValue[parentSectionValue.length - 1]).includes(sectionKey)) {
  //           parentSectionValue[parentSectionValue.length - 1][sectionKey].push({ ...cellsValue });
  //         }
  //         if (!Object.keys(parentSectionValue[parentSectionValue.length - 1]).includes(sectionKey)) {
  //           parentSectionValue[parentSectionValue.length - 1][sectionKey] = [{ ...cellsValue }];
  //         }
  //       }
  //     }
  //     if (!settingSection) {
  //       console.log(namedArea);
  //       cells.forEach((cell) => {
  //         const [, cellValue] = cell;
  //         cellsValue[cellValue.parameter] = cellValue.value;
  //       });
  //       const section = documentData.find((item) => {
  //         console.log(item, namedArea.name);
  //         return Object.keys(item).includes(namedArea.name);
  //       });
  //       if (!section) documentData.push({ [namedArea.name]: [{ ...cellsValue }] });
  //       if (section) {
  //         section[namedArea.name].push({ ...cellsValue });
  //       }
  //     }
  //   });
  //   console.log(documentData);
  //   return (JSONFormat) ? JSON.stringify(documentData) : documentData;
  // }

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
    const range = this.getNamedAreaRange(areaName);
    const namedAreas = [{
      name: areaName,
      range: null,
    }];

    const cellsInRange = this.getCellsInRange(range);
    const rangeCellArea = getRangeOfCellArea(cellsInRange);

    cellsInRange.forEach((cell) => {
      const [cellNameCurrent, cellValueCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea);
      const { cellColumn: cellColumnCurrent, cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
      const { cellColumn: cellColumnShift, cellRow: cellRowShift } = parseCellName(cellNameShift);

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

  getNamedAreaRange(areaName) {
    let range = null;
    if (areaName.includes('|')) {
      const [areaNameRow, areaNameColumn] = areaName.split('|');
      const rangeRow = this.namedAreas.find((item) => item.name === areaNameRow);
      const [r1, r2] = rangeRow.range.split(':');
      const rangeColumn = this.namedAreas.find((item) => item.name === areaNameColumn);
      const [c1, c2] = rangeColumn.range.split(':');
      range = `${c1}${r1}:${c2}${r2}`.toLowerCase();
    } else {
      const namedArea = this.namedAreas.find((item) => item.name === areaName);
      range = namedArea.range.toLowerCase();
    }
    return range;
  }

  getScript(scriptName) {
    const script = this.scripts[scriptName];
    if (script) return script;
    return null;
  }

  insertArea(numberColumn, numberRow, area, shift = null) {
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
    const rangeCellArea = getRangeOfCellArea(areaCells);

    const areaNamedAreaFrom = `${getColumnNameForNumber(numberColumn)}${numberRow}`;
    const areaNamedAreaTo = `${getColumnNameForNumber(numberColumn + (getRangeLength(rangeCellArea[1]) - 1))}${numberRow + (getRangeLength(rangeCellArea[0]) - 1)}`;
    if (areaNamedArea[0]) areaNamedArea[0].range = `${areaNamedAreaFrom}:${areaNamedAreaTo}`;
    const shiftInsert = {
      [SHIFT_TYPE.horizontal]: () => {
        this.shiftHorizontal({
          shiftStart: numberColumn,
          shiftStep: getRangeLength(rangeCellArea[1]),
        });
      },
      [SHIFT_TYPE.vertical]: () => {
        console.log('shift');
        this.shiftVertical({
          shiftStart: numberRow,
          shiftStep: getRangeLength(rangeCellArea[0]),
        });
      },
      null: () => {},
    };
    shiftInsert[shift]();

    Object.entries(areaCells).forEach((cell) => {
      const [cellNameCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea, numberColumn, numberRow);
      const { cellColumn: cellColumnCurrent, cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
      const { cellColumn: cellColumnShift, cellRow: cellRowShift } = parseCellName(cellNameShift);

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

  shiftVertical({ shiftStart, shiftStep = 1 }) {
    const rangeShiftArea = `a${shiftStart}:${getColumnNameForNumber(this.getLastColumn())}${this.getLastRow()}`;
    const shiftArea = this.getAreaForRange(rangeShiftArea);

    const cellsInRangeDelete = this.getCellsInRange(rangeShiftArea);
    const cellsInRangeDeleteKey = Object.keys(Object.fromEntries(cellsInRangeDelete));
    const cells = Object.entries(this.cells).filter((cell) => {
      const [cellName] = cell;
      return (!cellsInRangeDeleteKey.includes(cellName));
    });
    this.cells = Object.fromEntries(cells);

    this.insertArea(1, shiftStart + shiftStep, shiftArea);
  }

  // shiftRows({ shiftStart, shiftStep = 1 }) {
  //   const cells = {};
  //   const lastRow = this.getLastRow();
  //   for (let i = 0; i < lastRow - (shiftStart - 1); i += 1) {
  //     const newRowName = lastRow - i + shiftStep;
  //     this.rows[newRowName] = this.rows[lastRow - i];
  //     Object.entries(this.getCellsInRow(lastRow - i)).forEach((cell) => {
  //       const [cellName, cellValue] = cell;
  //       cells[`${cellName.replace(REG_DIGITS, '')}${newRowName}`] = cellValue;
  //       delete this.cells[cellName];
  //     });
  //   }
  //   this.cells = { ...this.cells, ...cells };
  //   this.rows[shiftStart + shiftStep] = this.rows[shiftStart];
  //   this.rowCount = Object.keys(this.rows).length;
  // }

  shiftHorizontal({ shiftStart, shiftStep = 1 }) {
    const rangeShiftArea = `${getColumnNameForNumber(shiftStart)}1:${getColumnNameForNumber(this.getLastColumn())}${this.getLastRow()}`;
    const shiftArea = this.getAreaForRange(rangeShiftArea);
    this.insertArea(shiftStart + shiftStep, 1, shiftArea);
  }

  // shiftColumns({ shiftStart, shiftStep = 1 }) {
  //   const cells = {};
  //   const lastColumn = this.getLastColumn();
  //   for (let i = 0; i < lastColumn - (shiftStart - 1); i += 1) {
  //     const newColumnName = getColumnNameForNumber(lastColumn - i + shiftStep);
  //     this.columns[newColumnName] = this.columns[getColumnNameForNumber(lastColumn - i)];
  //     Object.entries(this.getCellsInColumn(lastColumn - i)).forEach((cell) => {
  //       const [cellName, cellValue] = cell;
  //       const { cellRow } = parseCellName(cellName);
  //       cells[`${newColumnName}${cellRow}`] = cellValue;
  //       delete this.cells[cellName];
  //     });
  //   }
  //   this.cells = { ...this.cells, ...cells };
  //   this.columns[getColumnNameForNumber(shiftStart + shiftStep)] = this.columns[getColumnNameForNumber(shiftStart)];
  //   this.columnCount = Object.keys(this.columns).length;
  // }

  getAreaForRange(range) {
    console.log(range);
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
      const { cellColumn: cellColumnCurrent, cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
      const { cellColumn: cellColumnShift, cellRow: cellRowShift } = parseCellName(cellNameShift);

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
}

export default TableDocument;
