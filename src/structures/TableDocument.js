const CELL_WIDTH = 94;
const CELL_HEIGHT = 22;
// const CELL_TYPE_DEFAULT = 'string';
const ROW_COUNT = 1000;
const COLUMNS_COUNT = 26;
const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function getColumnNameForNumber(columnNumber) {
  if (columnNumber > 702) return 'Infinity';
  const settLength = SET_COLUMN_NAME.length;
  if (columnNumber <= settLength) {
    const columnName = SET_COLUMN_NAME[columnNumber - 1];
    return columnName;
  }
  if ((columnNumber % settLength) === 0) {
    const columnName = `${SET_COLUMN_NAME[
      ((columnNumber - settLength) / settLength) - 1
    ]}${SET_COLUMN_NAME[settLength - 1]}`;
    return columnName;
  }
  const columnName = `${SET_COLUMN_NAME[
    (Math.floor(columnNumber / settLength)) - 1
  ]}${SET_COLUMN_NAME[(columnNumber % settLength) - 1]}`;
  return columnName;
}

function getColumnNumberForName(columnName) {
  if (columnName.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === columnName) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === columnName[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === columnName[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
}

function parseCellName(cellName) {
  return {
    cellColumn: cellName.replace(/[0-9]/g, ''),
    cellRow: +cellName.replace(/[A-z]/g, ''),
  };
}

function getRangeType(range) {
  const [v1, v2] = `${range}`.toLowerCase().split(':');
  if (!v2) return 'cell';
  if (+v1 && +v2) return 'row';
  if (v1.match(/[0-9]/) && v1.match(/[A-z]/)
    && v2.match(/[0-9]/) && v2.match(/[A-z]/)) return 'range';
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
      const { cellColumn: fromCellColumn, cellRow: fromCellRow } = parseCellName(v1);
      const { cellColumn: toCellColumn, cellRow: toCellRow } = parseCellName(v2);
      return [
        [fromCellRow, getColumnNumberForName(fromCellColumn)],
        [toCellRow, getColumnNumberForName(toCellColumn)],
      ];
    },
  };
  return rangeSize[rangeType]();
}

// function getCellShift(cellName, range, step = 1) {
//   const directionRange = getRangeType(range);
//   // if (['cell', 'range'].includes(directionRange)) return cellName;
//   const [rangeFrom] = getRangeSize(range);
//   const { cellColumn, cellRow } = parseCellName(cellName);
//   if (directionRange === 'row') return `${cellColumn}${+cellRow - +rangeFrom + step}`;
//   if (directionRange === 'column') return `${getColumnNameForNumber(+getColumnNumberForName(cellColumn) - +rangeFrom + step)}${cellRow}`;
//   // if (directionRange === 'range') return
//   return cellName;
// }
// function replaceCellName(cellName, position, direction = 'row') {
//   const { cellColumn, cellRow } = parseCellName(cellName);
//   const replaceFunctions = {
//     cell: () => cellName,
//     row: () => `${cellColumn}${position}`,
//     column: () => `${getColumnNameForNumber(position)}${cellRow}`,
//     range: () => cellName,
//   };
//   return replaceFunctions[direction]();
// }

function getCellNameShift(cellName, rangeCells, shiftColumn = 1, shiftRow = 1) {
  const [rangeRow, rangeColumn] = rangeCells;
  const { cellColumn, cellRow } = parseCellName(cellName);
  const cellColumnShift = getColumnNameForNumber(+getColumnNumberForName(cellColumn) - +rangeColumn[0] + shiftColumn);
  const cellRowShift = +cellRow - +rangeRow[0] + shiftRow;
  return `${cellColumnShift}${cellRowShift}`;
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

// function getRangeShift(area = {}, fromCellName) {
//   const {
//     rows, columns, cells, namedAreas,
//   } = area;
//   let shiftRows = {};
//   let shiftColumns = {};
//   let shiftCells = {};
//   let shiftNamedAreas = [];
//   console.log(rows);
//   console.log(columns);
//   console.log(cells);
//   console.log(namedAreas);
//   console.log(getRangeType(namedAreas[0].range));
//   const rangeType = getRangeType(namedAreas[0].range);
//   if (rangeType === 'cell') {
//     const { cellColumn, cellRow } = parseCellName(fromCellName);
//     shiftRows[position] = { ...rows[i + 1] };
//     shiftColumns[getColumnNameForNumber(position)] = { ...columns[getColumnNameForNumber(i + 1)] };
//     console.log(fromCellName);
//   }
//   if (rangeType === 'range') {
//     shiftRows = { ...rows };
//     shiftColumns = { ...columns };
//     shiftCells = { ...cells };
//     shiftNamedAreas = [...namedAreas];
//     return {
//       shiftRows, shiftColumns, shiftCells, shiftNamedAreas,
//     };
//   }
//   return {
//     shiftRows, shiftColumns, shiftCells, shiftNamedAreas,
//   };
// }
// function getNamedAreaType(rangeFrom, rangeTo) {
//   if (rangeFrom && !rangeTo) return 'cell';
//   if (+rangeFrom && +rangeTo) return 'row|column';
//   return 'cell|range';
//   // console.log(rangeFrom, rangeTo);
// }

// function getRangeNamedArea(namedArea, direction = 'row') {
//   const [rangeFrom, rangeTo] = namedArea.range.toLowerCase().split(':');
//   const range = {
//     row: () => [rangeFrom, rangeTo],
//     column: () => [
//       getColumnNumberForName(rangeFrom),
//       getColumnNumberForName(rangeTo),
//     ],
//     join: () => [rangeFrom, rangeTo],
//   };
//   return range[direction]();
// }

// function getShiftCells(cells = [], shiftRow) {
//   const shiftCells = {};
//   cells.forEach((cell) => {
//     const [cellName, cellValue] = cell;
//     shiftCells[replaceCellRow(cellName, shiftRow)] = cellValue;
//   });
//   return shiftCells;
// }
// function getNamedAreaShiftRow(namedArea, position) {
//   const {
//     rows, columns, cells, styles, namedAreas,
//   } = namedArea;
//   console.log(namedArea);
//   const shiftRows = {};
//   let shiftColumns = {};
//   const shiftCells = {};
//   let shiftStyles = [];
//   const shiftNamedAreas = [];
//   const cellsInRange = Object.entries(cells);
//   const rangeCells = getRangeCells(cellsInRange);
//   cellsInRange.forEach((cell) => {
//     const [cellNameCurrent] = cell;
//     const cellNameShift = getCellShift(cellNameCurrent, rangeCells, undefined, position);
//     const { cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
//     const { cellRow: cellRowShift } = parseCellName(cellNameShift);

//     shiftCells[cellNameShift] = { ...cells[cellNameCurrent] };
//     shiftRows[cellRowShift] = { ...rows[cellRowCurrent] };

//     const cellCurrentNamedArea = namedAreas.find((item) => item.range.split(':')[0].toLowerCase().includes(cellNameCurrent));
//     if (!cellCurrentNamedArea) return;
//     shiftNamedAreas.push({
//       name: cellCurrentNamedArea.name,
//       range: cellNameShift,
//     });
//   });
//   shiftColumns = { ...columns };
//   shiftStyles = [...styles];
//   return {
//     shiftRows, shiftColumns, shiftCells, shiftNamedAreas, shiftStyles,
//   };
// }

// function getRangeShift(area = {}, fromPosition = 1, direction) { // на переделку
//   const {
//     rows, columns, cells, namedAreas,
//   } = area;
//   let shiftRows = {};
//   let shiftColumns = [];
//   let shiftCells = {};
//   let shiftNamedAreas = [];
//   const rangeType = getRangeType(namedAreas[0].range);
//   if (['range', 'cell'].includes(rangeType)) {
//     shiftRows = { ...rows };
//     shiftColumns = { ...columns };
//     shiftCells = { ...cells };
//     shiftNamedAreas = [...namedAreas];
//     return {
//       shiftRows, shiftColumns, shiftCells, shiftNamedAreas,
//     };
//   }
//   let range = null;
//   if (rangeType === 'row') { range = `${fromPosition}:${fromPosition + Object.keys(rows).length - 1}`; }
//   if (rangeType === 'column') { range = `${getColumnNameForNumber(fromPosition)}:${getColumnNameForNumber(fromPosition + Object.keys(columns).length - 1)}`; }
//   shiftNamedAreas.push({
//     name: namedAreas[0].name,
//     range,
//   });

//   const [rangeFrom, rangeTo] = getRangeSize(namedAreas[0].range);
//   const rangeLength = +rangeTo - +rangeFrom + 1;
//   console.log(rangeLength, namedAreas[0].range, rangeType);
//   for (let i = 0; i < rangeLength; i += 1) {
//     const position = fromPosition + i;
//     // if (rangeType === 'cell') {
//     //   shiftRows[position] = { ...rows[i + 1] };
//     //   shiftColumns[getColumnNameForNumber(position)] = { ...columns[getColumnNameForNumber(i + 1)] };
//     // }
//     if (rangeType === 'row') shiftRows[position] = { ...rows[i + 1] };
//     if (rangeType === 'column') shiftColumns[getColumnNameForNumber(position)] = { ...columns[getColumnNameForNumber(i + 1)] };

//     const cellsRange = Object.entries(cells).filter((cell) => { // ???????
//       const { cellColumn, cellRow } = parseCellName(cell[0]);
//       const rez = (direction === 'row') ? (cellRow === i + 1)
//         : (getColumnNumberForName(cellColumn) === i + 1);
//       return rez;
//     });
//     cellsRange.forEach((cell) => { // вынести в фун-цию getNamedAreasCells
//       const [cellName, cellValue] = cell;

//       shiftCells[replaceCellName(cellName, position, rangeType)] = { ...cellValue };

//       const cellNamedArea = namedAreas.find((item) => item.range.split(':')[0].toLowerCase().includes(cellName));
//       if (!cellNamedArea) return;
//       const [namedAreaRange] = cellNamedArea.range.split(':'); // ???
//       const shiftRange = replaceCellName(namedAreaRange, position, rangeType);
//       shiftNamedAreas.push({
//         name: cellNamedArea.name,
//         range: shiftRange.toLowerCase(),
//       });
//     });
//   }
//   if (rangeType === 'row') shiftColumns = { ...columns };
//   if (rangeType === 'column') shiftRows = { ...rows };
//   return {
//     shiftRows, shiftColumns, shiftCells, shiftNamedAreas,
//   };
// }

class TableDocument {
  constructor({
    template = false,
    rangeType = null,
    rows = {},
    rowCount = ROW_COUNT,
    columns = {},
    columnCount = COLUMNS_COUNT,
    cells = {},
    styles = [],
    namedAreas = [],
    cellWidth = CELL_WIDTH,
    cellHeight = CELL_HEIGHT,
    JSONString = null,
  } = {}) {
    if (JSONString) {
      const JSONStringParse = JSON.parse(JSONString);
      ({
        template: this.template = false,
        rangeType: this.rangeType = null,
        rows: this.rows = {},
        rowCount: this.rowCount = ROW_COUNT,
        columns: this.columns = {},
        columnCount: this.columnCount = COLUMNS_COUNT,
        cells: this.cells = {},
        styles: this.styles = [],
        namedAreas: this.namedAreas = [],
        cellWidth: this.cellWidth = CELL_WIDTH,
        cellHeight: this.cellHeight = CELL_HEIGHT,
      } = JSONStringParse);
      return;
    }
    this.template = template;
    this.rangeType = rangeType;
    this.rows = rows;
    this.rowCount = rowCount;
    this.columns = columns;
    this.columnCount = columnCount;
    this.cells = cells;
    this.styles = styles;
    this.namedAreas = namedAreas;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  buildDocument(template, data) {
    // console.log(this.rowCount);
    const documentData = (typeof data === 'string') ? JSON.parse(data) : data;
    const documentTemplate = (typeof template === 'string') ? JSON.parse(template) : template;
    const areaHeader = documentTemplate.getNamedArea('header');
    console.log(areaHeader);
    const headerValue = documentData.find((item) => Object.keys(item).includes('header'))?.header[0] || {};
    if (areaHeader) this.putArea(headerValue, areaHeader);

    documentData.forEach((element) => {
      const [areaName, areaValue] = Object.entries(element)[0];
      if (['header', 'footer'].includes(areaName)) return;
      console.log(areaName);
      const area = documentTemplate.getNamedArea(areaName);
      console.log(area);
      areaValue.forEach((value) => {
        if (area.rangeType === 'row') this.putArea(value, area);
        if (area.rangeType === 'column') this.joinArea(value, area);
      });
    });

    console.log('footer');
  //   const areaFooter = documentTemplate.getNamedArea('footer', direction);
  //   console.log(areaFooter);
  //   if (areaFooter) this.insertNamedArea(areaFooter, [], direction);
  }

  // buildDocument(documentTemplate, documentData) {
  //   console.log(this.rows);
  //   const data = (typeof documentData === 'string') ? JSON.parse(documentData) : documentData;
  //   console.log(data);
  //   const { direction } = documentTemplate;
  //   console.log('getNamedArea header');
  //   const areaHeader = documentTemplate.getNamedArea('header', direction);
  //   console.log(areaHeader);
  //   const headerValue = data.find((item) => Object.keys(item).includes('header'))?.header[0] || {};
  //   console.log(headerValue);
  //   if (areaHeader) this.insertNamedArea(areaHeader, headerValue, direction);

  //   data.forEach((element) => {
  //     const [areaName, areaValue] = Object.entries(element)[0];
  //     if (['header', 'footer'].includes(areaName)) return;
  //     console.log(areaName);
  //     const namedArea = documentTemplate.getNamedArea(areaName, direction);
  //     console.log(namedArea);
  //     if (areaName.includes('|')) {
  //       this.insertNamedAreaJoin(namedArea, areaValue);
  //       return;
  //     }
  //     areaValue.forEach((value) => {
  //       // if (areaName.includes('|')) this.insertNamedAreaJoin(namedArea, areaValue);
  //       // else
  //       this.insertNamedArea(namedArea, value, direction);
  //     });
  //   });

  //   console.log('footer');
  //   const areaFooter = documentTemplate.getNamedArea('footer', direction);
  //   console.log(areaFooter);
  //   if (areaFooter) this.insertNamedArea(areaFooter, [], direction);
  // }

  getCellByName(cellName) {
    let cell = {};
    if (Object.keys(this.cells).includes(cellName)) {
      cell = this.cells[cellName];
    }
    return cell;
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

  getDocumentData(JSONFormat = false) {
    let documentData = [];
    const directionTemplate = this.direction;
    // let namedAreas = [];
    if (directionTemplate === 'row') {
      // namedAreas = this.namedAreas.filter((namedArea) => getRangeType(namedArea.range) === 'row');
      // console.log(this.getDocumentDataRow());
      documentData = [...documentData, ...this.getDocumentDataRow()];
    }
    if (directionTemplate === 'column') {
      // namedAreas = this.namedAreas.filter((namedArea) => getRangeType(namedArea.range) === 'column');
      documentData = [...documentData, ...this.getDocumentDataColumn()];
    }
    if (directionTemplate === 'join') {
      documentData = [...documentData, ...this.getDocumentDataRow()];
      documentData = [...documentData, ...this.getDocumentDataColumn()];
      // documentData = [...documentData, ...this.getDocumentDataJoin()];
    //   namedAreas = this.namedAreas.filter((namedArea) => ['row', 'column', 'range'].includes(getRangeType(namedArea.range)));
    }

    documentData = documentData.filter((item) => Object.entries(item)[0][1].length);
    return (JSONFormat) ? JSON.stringify(documentData) : documentData;
  }

  getDocumentDataJoin() {
    const namedAreas = this.namedAreas.filter((namedArea) => getRangeType(namedArea.range) === 'range');
    const documentData = [];
    namedAreas.forEach((namedArea) => {
      // const valueArea = {};
      const { range } = namedArea;
      if (documentData.length === 0 || !Object.keys(documentData[documentData.length - 1]).includes(namedArea.name)) {
        documentData.push({ [namedArea.name]: [] });
      }
      console.log(this.getCellsInRange(range, 'range'));
      const cells = this.getCellsInRange(range, 'range');
      const [rangeFrom, rangeTo] = getRangeSize(range);
      let pos = 0;

      for (let i = rangeFrom[0]; i <= rangeTo[0]; i += 1) {
        const data = [];
        for (let j = rangeFrom[1]; j <= rangeTo[1]; j += 1) {
          const [, cellValue] = cells[pos];
          data.push({ [cellValue.areaName]: cellValue.value });
          pos += 1;
        }
        documentData[documentData.length - 1][namedArea.name].push(data);
      }
      // this.getCellsInRange(range, 'range').forEach((cell) => {
      //   const [, cellValue] = cell;
      //   if (!Object.keys(cell).includes('areaName') && cellValue.areaName) valueArea[cellValue.areaName] = cellValue.value;
      //   documentData[documentData.length - 1][namedArea.name].push({
      //     [cellValue.areaName]: cellValue.value,
      //   });
      // });
      // if (Object.keys(valueArea).length) documentData[documentData.length - 1][namedArea.name].push({ ...valueArea });
    });
    return documentData;
  }

  getDocumentDataColumn() {
    const namedAreas = this.namedAreas.filter((namedArea) => getRangeType(namedArea.range) === 'column');
    const documentData = [];
    namedAreas.forEach((namedArea) => {
      const valueArea = {};
      const { range } = namedArea;
      if (documentData.length === 0 || !Object.keys(documentData[documentData.length - 1]).includes(namedArea.name)) {
        documentData.push({ [namedArea.name]: [] });
      }
      this.getCellsInRange(range, 'column').forEach((cell) => {
        const [, cellValue] = cell;
        if (!Object.keys(cell).includes('areaName') && cellValue.areaName) valueArea[cellValue.areaName] = cellValue.value;
      });
      if (Object.keys(valueArea).length) documentData[documentData.length - 1][namedArea.name].push({ ...valueArea });
    });
    return documentData;
  }

  getDocumentDataRow() {
    const namedAreas = this.namedAreas.filter((namedArea) => getRangeType(namedArea.range) === 'row');
    console.log(namedAreas);
    const documentData = [];
    namedAreas.forEach((namedArea) => {
      const valueArea = {};
      const { range } = namedArea;
      if (documentData.length === 0 || !Object.keys(documentData[documentData.length - 1]).includes(namedArea.name)) {
        documentData.push({ [namedArea.name]: [] });
      }
      console.log(this.getCellsInRange(range, 'row'));
      this.getCellsInRange(range, 'row').forEach((cell) => {
        const [, cellValue] = cell;
        if (!Object.keys(cell).includes('areaName') && cellValue.areaName) valueArea[cellValue.areaName] = cellValue.value;
      });
      if (Object.keys(valueArea).length) documentData[documentData.length - 1][namedArea.name].push({ ...valueArea });
    });
    return documentData;
  }
  // getDocumentData(JSONFormat = false) {
  //   let documentData = [];
  //   const directionTemplate = this.direction;
  //   let namedAreas = [];
  //   if (directionTemplate === 'row') {
  //     namedAreas = this.namedAreas.filter((namedArea) => getRangeType(namedArea.range) === 'row');
  //   }
  //   if (directionTemplate === 'column') {
  //     namedAreas = this.namedAreas.filter((namedArea) => getRangeType(namedArea.range) === 'column');
  //   }
  //   if (directionTemplate === 'join') {
  //     namedAreas = this.namedAreas.filter((namedArea) => ['row', 'column', 'range'].includes(getRangeType(namedArea.range)));
  //   }
  //   console.log(namedAreas);
  //   console.log(this);
  //   namedAreas.forEach((namedArea) => {
  //     if (documentData.length === 0 || !Object.keys(documentData[documentData.length - 1]).includes(namedArea.name)) {
  //       documentData.push({ [namedArea.name]: [] });
  //     }
  //     const { range } = namedArea;
  //     // const valueArea = {};
  //     console.log(this.getCellsInRange(range, directionTemplate));
  //     const rangeSize = getRangeSize(range);
  //     const valueArea = (rangeSize[0].length === 2) ? [] : {};
  //     this.getCellsInRange(range, directionTemplate).forEach((cell) => {
  //       const [, cellValue] = cell;
  //       if (!Object.keys(cell).includes('areaName') && cellValue.areaName) {
  //         if (rangeSize[0].length === 2) {
  //           // const [, cellValue] = cell;
  //           // if (cellValue.areaName)
  //           console.log([cellValue.areaName], cellValue.value);
  //           valueArea.push({ [cellValue.areaName]: cellValue.value });
  //         } else {
  //           // const [, cellValue] = cell;
  //           // if (cellValue.areaName)
  //           valueArea[cellValue.areaName] = cellValue.value;
  //         }
  //       }
  //     });
  //     if (Object.keys(valueArea).length
  //       || valueArea.length) documentData[documentData.length - 1][namedArea.name].push({ ...valueArea });
  //   });
  //   documentData = documentData.filter((item) => Object.entries(item)[0][1].length);
  //   console.log(documentData);
  //   return (JSONFormat) ? JSON.stringify(documentData) : documentData;
  // }

  getIncludeCellInNamedArea(cellColumn, cellRow) {
    let inRow = false;
    let inColumn = false;
    const namedAreas = this.namedAreas
      .filter((namedArea) => ['column', 'row'].includes(getRangeType(namedArea.range)));
    namedAreas.forEach((namedArea) => {
      const rangeType = getRangeType(namedArea.range);
      const [rangeFrom, rangeTo] = getRangeSize(namedArea.range);
      if (rangeType === 'row' && (cellRow >= rangeFrom && cellRow <= rangeTo)) inRow = true;
      if (rangeType === 'column' && (getColumnNumberForName(cellColumn) >= rangeFrom && getColumnNumberForName(cellColumn) <= rangeTo)) inColumn = true;
    });
    return (inRow && inColumn);
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
        return (condition[rangeType]()); // не включать ячейки входящие в пересечение областей????
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

  // getCellsInRange(range, direction) {
  //   const rangeType = getRangeType(range);
  //   if (rangeType === 'cell') return Object.entries(this.cells).filter((cell) => cell[0] === range);
  //   const [rangeFrom, rangeTo] = getRangeSize(range);
  //   if (['column', 'row'].includes(rangeType)) {
  //     const setRange = [];
  //     for (let n = rangeFrom; n <= rangeTo; n += 1) setRange.push(n);
  //     return Object.entries(this.cells).filter((cell) => {
  //       const [cellName] = cell;
  //       const { cellColumn, cellRow } = parseCellName(cellName);
  //       const condition = {
  //         row: () => setRange.includes(cellRow),
  //         column: () => setRange.includes(getColumnNumberForName(cellColumn)),
  //         join: () => {
  //           const condit = (rangeType === 'row') ? setRange.includes(cellRow)
  //             : setRange.includes(getColumnNumberForName(cellColumn));
  //           return (condit && !this.getIncludeCellInNamedArea(cellColumn, cellRow));
  //         },
  //       };
  //       return (condition[direction]());
  //     });
  //   }
  //   if (rangeType === 'range') {
  //     const setRange = [];
  //     console.log(rangeType);
  //     console.log(rangeFrom, rangeTo);
  //     for (let n = rangeFrom[0]; n <= rangeTo[0]; n += 1) setRange.push(n);
  //     for (let n = rangeFrom[1]; n <= rangeTo[1]; n += 1) setRange.push(getColumnNameForNumber(n));
  //     console.log(setRange);
  //     return Object.entries(this.cells).filter((cell) => {
  //       const [cellName] = cell;
  //       const { cellColumn, cellRow } = parseCellName(cellName);
  //       return (setRange.includes(cellRow) && setRange.includes(cellColumn));
  //     });
  //   }
  //   return Object.entries({});
  // }

  getCellStyles(cellName) {
    const cellStyle = this.styles.find((item) => item.name === cellName);
    if (!cellStyle) return null;
    return cellStyle;
  }

  // getCellNamedArea(cellName, position, direction) {
  //   const cellNamedArea = this.namedAreas.find((item) => item.range.split(':')[0].toLowerCase().includes(cellName));
  //   if (!cellNamedArea) return null;
  //   const [rangeFrom] = cellNamedArea.range.split(':');
  //   const shiftRange = replaceCellName(rangeFrom, position, direction);
  //   return {
  //     name: cellNamedArea.name,
  //     range: shiftRange.toLowerCase(),
  //   };
  // }

  getNamedAreaCellShift(cellNameCurrent, cellNameShift, areaName) {
    const cellNamedArea = this.namedAreas.find((namedArea) => namedArea.range.split(':')[0].toLowerCase() === cellNameCurrent
      && namedArea.name !== areaName);
    if (!cellNamedArea) return null;
    return {
      name: cellNamedArea.name,
      range: cellNameShift,
    };
  }

  // getRangeOfCellArea() {
  //   const rows = [];
  //   const columns = [];
  //   Object.entries(this.cells).forEach((cell) => {
  //     const [cellName] = cell;
  //     const { cellColumn, cellRow } = parseCellName(cellName);
  //     rows.push(cellRow);
  //     columns.push(getColumnNumberForName(cellColumn));
  //   });
  //   return [[Math.min(...rows), Math.max(...rows)], [Math.min(...columns), Math.max(...columns)]];
  // }
  // getCellNamedAreaShift(currentCellName, positionCellName, currentNamedArea) {
  //   const cellNamedArea = this.namedAreas.find((item) => (item.range.split(':')[0].toLowerCase().includes(currentCellName) && ![currentNamedArea, '|'].includes(item.name)));
  //   if (!cellNamedArea) return null;
  //   return {
  //     name: cellNamedArea.name,
  //     range: positionCellName.toLowerCase(),
  //   };
  // }

  // insertNamedAreaJoin(area, value) {
  //   const cells = {};
  //   const namedAreas = [];
  //   const rowCount = value.length;
  //   const columnCount = value[0].length;
  //   console.log(area.namedAreas, value, rowCount, columnCount);
  //   const rangeFrom = area.namedAreas[0].range.split(':')[0];
  //   const { cellColumn: rangeFromColumn, cellRow: rangeFromRow } = parseCellName(rangeFrom);
  //   const rangeTo = replaceCellName(replaceCellName(rangeFrom, +rangeFromRow + rowCount - 1, 'row'), +getColumnNumberForName(rangeFromColumn) + columnCount - 1, 'column');
  //   namedAreas.push({
  //     name: area.namedAreas[0].name,
  //     range: `${rangeFrom}:${rangeTo}`,
  //   });
  //   for (let row = 0; row < rowCount; row += 1) {
  //     for (let column = 0; column < columnCount; column += 1) {
  //       Object.entries(value[row][column]).forEach((item) => {
  //         const [areaName, areaValue] = item;
  //         const namedArea = area.namedAreas.find((element) => element.name === areaName);
  //         // console.log(namedArea, areaName, areaValue);
  //         if (!namedArea) return;
  //         const cellName = namedArea.range.toLowerCase().split(':')[0];
  //         const { cellColumn, cellRow } = parseCellName(cellName);
  //         const cellNameShift = replaceCellName(replaceCellName(cellName, +cellRow + row, 'row'), +getColumnNumberForName(cellColumn) + column, 'column');
  //         // console.log(cellNameShift);
  //         cells[cellNameShift] = { ...area.cells[cellName] };
  //         cells[cellNameShift].value = areaValue;
  //         cells[cellNameShift].areaName = areaName;
  //         // namedAreas.push({
  //         //   name: areaName,
  //         //   range: `${cellNameShift}:${cellNameShift}`,
  //         // });
  //       });
  //     }
  //   }
  //   area.styles.forEach((style) => {
  //     if (this.styles.findIndex((item) => item.name === style.name) > -1) return;
  //     this.styles.push(style);
  //   });
  //   this.cells = { ...this.cells, ...cells };
  //   this.namedAreas = [...this.namedAreas, ...namedAreas];
  // }

  // getNamedAreaByName(areaName, direction = 'row') {
  //   if (!areaName) return null;
  //   const namedArea = this.namedAreas.find((item) => item.name === areaName);
  //   if (!namedArea) return null;
  //   const rows = {};
  //   const columns = {};
  //   const cells = {};
  //   const styles = [];
  //   const namedAreas = [namedArea];
  //   const [rangeFrom, rangeTo] = getRangeNamedArea(namedArea, direction);
  //   let startPosition = 1;
  //   // проверить чем является шапка, строками, столбцами, ячейкой или диапазоном
  //   // if (areaName === 'header')
  //   const namedAreaType = getNamedAreaType(rangeFrom, rangeTo);
  //   // console.log(direction);
  //   // console.log(rangeFrom, rangeTo);
  //   if (namedAreaType === 'cell') {
  //     const { cellColumn, cellRow } = parseCellName(rangeFrom);
  //     rows[cellRow] = this.rows[cellRow];
  //     columns[cellColumn] = this.columns[cellColumn];
  //     cells[rangeFrom] = this.cells[rangeFrom];
  //     styles.push(this.styles.find((item) => item.name === rangeFrom));
  //     namedAreas.push(this.namedAreas.find((item) => item.range.toLowerCase() === rangeFrom));
  //   }
  //   if (namedAreaType === 'row|column') {
  //     for (let i = +rangeFrom; i <= +rangeTo; i += 1) {
  //       if (direction === 'row') {
  //         rows[startPosition] = this.rows[i]; // ???
  //       }
  //       if (direction === 'column') {
  //         columns[getColumnNameForNumber(startPosition)] = this.columns[getColumnNameForNumber(i)];
  //       }

  //       this.getCellsInRange(i, direction).forEach((cell) => {
  //         const [cellName] = cell;
  //         const { cellColumn, cellRow } = parseCellName(cellName);
  //         cells[replaceCellName(cellName, startPosition, direction)] = this.cells[cellName];

  //         if (direction === 'row') {
  //           if (!Object.keys(columns).includes(cellColumn)) columns[cellColumn] = this.columns[cellColumn];
  //         }
  //         if (direction === 'column') {
  //           if (!Object.keys(rows).includes(cellRow)) rows[cellRow] = this.rows[cellRow];
  //           // console.log(rows);
  //         }

  //         const cellStyles = this.getCellStyles(cellName);
  //         if (cellStyles) styles.push(cellStyles);

  //         const cellNamedArea = this.getCellNamedArea(cellName, startPosition, direction);
  //         if (cellNamedArea) namedAreas.push(cellNamedArea);
  //       });

  //       startPosition += 1;
  //     }
  //   }
  //   // console.log(rows);
  //   return new TableDocument({
  //     rows,
  //     rowCount: Object.keys(rows).length,
  //     columns,
  //     columnCount: Object.keys(columns).length,
  //     cells,
  //     styles,
  //     namedAreas,
  //     cellWidth: this.cellWidth,
  //     cellHeight: this.cellHeight,
  //   });
  // }

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

  getNamedArea(areaName) {
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = []; // ???? добавлять саму именованную область
    // const [rangeFrom, rangeTo] = range.split(':');
    // const namedAreas = [{
    //   name: areaName,
    //   range: `1:${+rangeTo - +rangeFrom + 1}`,
    // }];
    const range = this.getNamedAreaRange(areaName);
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

      // const cellNamedArea = this.getNamedAreaCellShift(cellNameCurrent, cellNameShift, areaName);
      // if (cellNamedArea) namedAreas.push(cellNamedArea);
    });
    return new TableDocument({
      rangeType: getRangeType(range),
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      columnCount: Object.keys(columns).length,
      cells,
      styles,
      namedAreas,
    });
  }

  // getNamedArea(areaName, direction) {
  //   const namedArea = this.namedAreas.find((item) => item.name === areaName);
  //   if (!namedArea) return null;
  //   const rows = {};
  //   const columns = {};
  //   const cells = {};
  //   const styles = [];
  //   const namedAreas = [{
  //     name: namedArea.name,
  //     range: namedArea.range.toLowerCase(),
  //   }];
  //   const range = namedArea.range.toLowerCase();

  //   this.getCellsInRange(range, direction).forEach((cell) => {
  //     const [cellName] = cell;
  //     const cellNameShift = getCellShift(cellName, range);
  //     const { cellColumn, cellRow } = parseCellName(cellName);
  //     const {
  //       cellColumn: cellColumnShift,
  //       cellRow: cellRowShift,
  //     } = parseCellName(cellNameShift);
  //     cells[cellNameShift] = this.cells[cellName];

  //     columns[cellColumnShift] = this.columns[cellColumn];
  //     rows[cellRowShift] = this.rows[cellRow];

  //     const cellStyles = this.getCellStyles(cellName);
  //     if (cellStyles) styles.push(cellStyles);

  //     const cellNamedArea = this.getCellNamedAreaShift(cellName, cellNameShift, namedArea.name);
  //     if (cellNamedArea) namedAreas.push(cellNamedArea);
  //   });

  //   return new TableDocument({
  //     direction,
  //     rows,
  //     rowCount: Object.keys(rows).length,
  //     columns,
  //     columnCount: Object.keys(columns).length,
  //     cells,
  //     styles,
  //     namedAreas,
  //   });
  // }

  getLastRow() {
    const rows = [0];
    Object.keys(this.rows).forEach((row) => rows.push(+row));
    return Math.max(...rows);
  }

  getLastColumn() {
    const columns = [0];
    Object.keys(this.columns).forEach((column) => columns.push(+getColumnNumberForName(column)));
    return Math.max(...columns);
  }

  getAreaCopy() {
    const {
      rows, columns, cells, styles, namedAreas,
    } = JSON.parse(JSON.stringify({
      rows: this.rows,
      columns: this.columns,
      cells: this.cells,
      styles: this.styles,
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
      namedAreas,
    });
  }

  // getAreaCopy() {
  //   const rows = {};
  //   const columns = {};
  //   const cells = {};
  //   const styles = [];
  //   const namedAreas = [];

  //   Object.keys(this.rows).forEach((rowName) => { rows[rowName] = { ...this.rows[rowName] }; });
  //   Object.keys(this.columns).forEach((columnName) => { columns[columnName] = { ...this.columns[columnName] }; });
  //   Object.keys(this.cells).forEach((cellName) => { cells[cellName] = { ...this.cells[cellName] }; });
  //   this.styles.forEach((style) => { styles.push({ ...style }); });
  //   this.namedAreas.forEach((namedArea) => { namedAreas.push({ ...namedArea }); });

  //   return new TableDocument({
  //     rangeType: this.rangeType,
  //     rows,
  //     rowCount: Object.keys(rows).length,
  //     columns,
  //     columnCount: Object.keys(columns).length,
  //     cells,
  //     styles,
  //     namedAreas,
  //   });
  // }

  fillArea(dataArea) {
    Object.entries(this.cells).forEach((cell) => {
      const [, cellValue] = cell;
      const parameterName = cellValue?.parameter || null;
      if (!parameterName || !dataArea[parameterName]) return;
      cellValue.value = dataArea[parameterName];
    });
  }

  shiftArea(position) {
    const rows = {};
    const columns = {};
    const cells = {};
    const styles = [];
    const namedAreas = [];
    const rangeCellArea = getRangeOfCellArea(this.cells);
    const positions = {
      row: () => [undefined, position],
      column: () => [position, undefined],
      // cell: () => [1, 1],
      // range: () => [1, 1],
    };
    const [positionColumn, positionRow] = positions[this.rangeType]();
    Object.entries(this.cells).forEach((cell) => {
      const [cellNameCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea, positionColumn, positionRow);
      // console.log(rangeCells, cellNameCurrent, cellNameShift, position);
      const { cellColumn: cellColumnCurrent, cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
      const { cellColumn: cellColumnShift, cellRow: cellRowShift } = parseCellName(cellNameShift);
      cells[cellNameShift] = this.cells[cellNameCurrent];

      columns[cellColumnShift] = this.columns[cellColumnCurrent];
      rows[cellRowShift] = this.rows[cellRowCurrent];

      // в namedArea добавляем параметры ячеек
      // const cellNamedArea = this.getNamedAreaCellShift(cellNameCurrent, cellNameShift, '');
      // if (cellNamedArea) namedAreas.push(cellNamedArea);
    });
    this.styles.forEach((style) => {
      const { name, list } = style;
      styles.push({
        name,
        list,
      });
    });
    return new TableDocument({
      rangeType: this.rangeType,
      rows,
      rowCount: Object.keys(rows).length,
      columns,
      cells,
      styles,
      namedAreas,
    });
  }

  putArea(dataArea, area) {
    const areaCopy = area.getAreaCopy();
    const numberNewRow = this.getLastRow() + 1;
    areaCopy.fillArea(dataArea);
    this.insertArea(1, numberNewRow, areaCopy);
  }

  insertArea(numberColumn, numberRow, area) {
    const {
      rows: areaRow, columns: areaColumn, cells: areaCells, styles: areaStyle, namedAreas: areaNamedArea,
    } = area;
    const rangeCellArea = getRangeOfCellArea(areaCells);

    Object.entries(areaCells).forEach((cell) => {
      const [cellNameCurrent] = cell;
      const cellNameShift = getCellNameShift(cellNameCurrent, rangeCellArea, numberColumn, numberRow);
      const { cellColumn: cellColumnCurrent, cellRow: cellRowCurrent } = parseCellName(cellNameCurrent);
      const { cellColumn: cellColumnShift, cellRow: cellRowShift } = parseCellName(cellNameShift);

      this.cells[cellNameShift] = areaCells[cellNameCurrent];

      this.columns[cellColumnShift] = areaColumn[cellColumnCurrent];
      this.rows[cellRowShift] = areaRow[cellRowCurrent];
    });
    this.styles = [...this.styles, ...areaStyle];
    this.namedAreas = [...this.namedAreas, areaNamedArea];

    this.rowCount = this.getLastRow();
    this.columnCount = this.getLastColumn();
  }

  insertAreaV20(area) {
    console.log(area);
    this.cells = { ...this.cells, ...area.cells };
    this.rows = { ...this.rows, ...area.rows };
    this.columns = { ...this.columns, ...area.columns };
    this.styles = [...this.styles, ...area.styles];

    this.rowCount = Object.keys(this.rows).length;
    this.columnCount = Object.keys(this.columns).length;
  }

  joinArea(dataArea, area) {
    const numberNewColumn = this.getLastColumn() + 1;
    const areaCopy = area.getAreaCopy();
    areaCopy.fillArea(dataArea);
    const areaShift = areaCopy.shiftArea(numberNewColumn);
    console.log(areaShift);
    this.insertAreaV20(numberNewColumn, areaShift);
  }
  // insertNamedArea(area, value, direction) {
  //   const rangeType = getRangeType(area.namedAreas[0].range);
  //   const namedArea = area.namedAreas[0];
  //   const position = {
  //     row: () => Object.keys(this.rows).length + 1,
  //     column: () => Object.keys(this.columns).length + 1,
  //     cell: () => 1, // ????
  //     range: () => 1, // ????
  //   };
  //   const startPosition = position[rangeType]();
  //   console.log(rangeType, getRangeShift(area, startPosition, direction));
  //   const {
  //     shiftRows, shiftColumns, shiftCells, shiftNamedAreas,
  //   } = getRangeShift(area, startPosition, direction);
  //   Object.entries(shiftCells).forEach((cell) => {
  //     const [cellName, cellValue] = cell;
  //     const namedAreaCell = shiftNamedAreas.find((item) => item.range.split(':')[0] === cellName && item.name !== namedArea.name);
  //     if (namedAreaCell) {
  //       if (value[namedAreaCell.name]) cellValue.value = value[namedAreaCell.name];
  //       cellValue.areaName = namedAreaCell.name;
  //     }
  //   });

  //   this.rows = { ...this.rows, ...shiftRows };
  //   this.cells = { ...this.cells, ...shiftCells };
  //   this.columns = { ...this.columns, ...shiftColumns };
  //   this.namedAreas = [...this.namedAreas, ...shiftNamedAreas];

  //   area.styles.forEach((style) => {
  //     if (this.styles.findIndex((item) => item.name === style.name) > -1) return;
  //     this.styles.push(style);
  //   });

  //   this.rowCount = Object.keys(this.rows).length;
  //   this.columnCount = Object.keys(this.columns).length;
  // }

  checkEditAccess(cellName) {
    if (!Object.keys(this.cells).includes(cellName)) return true;
    if (Object.keys(this.cells[cellName]).includes('areaName')) return true;
    return true;
  }

  editingCell(cellName, cellValue) { // проверять существует строка/столбец
    // получать максимальный из имеющихся, сравнивать
    // если пусстое значение и больше ничего нет, то удалять ячейку из набора
    const cellValues = (Object.keys(this.cells).includes(cellName)) ? this.cells[cellName] : {};
    cellValues.value = cellValue;
    if (!cellValue && !Object.keys(this.cells).includes(cellName)) return;
    this.cells = { ...this.cells, [cellName]: cellValues };
  }

  shiftRows({ shiftStart, shiftBefore = false, shiftStep = 1 }) {
    console.log(shiftBefore);
    const lastRow = Math.max(...Object.keys(this.rows));
    for (let i = 0; i < lastRow - shiftStart; i += 1) {
      console.log(lastRow - i, ' - ', this.rows[lastRow - i]);
      this.rows[lastRow - i + shiftStep] = this.rows[lastRow - i];
      delete this.rows[lastRow - i];

      Object.entries(this.getCellsInRow(lastRow - i)).forEach((cell) => {
        const [cellName, cellValue] = cell;
        this.cells[`${cellName.replace(/[0-9]/g, '')}${lastRow - i + shiftStep}`] = cellValue;
        delete this.cells[cellName];
      });
    }
    this.rows[shiftStart + 1] = this.rows[shiftStart];
    this.rowCount = Object.keys(this.rows).length;
  }
}

export default TableDocument;
