const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const FONT_FAMILY = ['Arial', 'arial,sans,sans-serif'];
const FONTS_FAMILY = { 'Times New Roman': "'Times New Roman, Times, sans-serif'" };
const FONT_SIZE = 0;
const FONT_WEIGHT = 'normal';
const FONT_STYLE = 'normal';
const FONT_COLOR = '#000000';

const BACKGROUND_COLOR = '#ffffff';

const ALIGNMENT_H = {
  left: 'flex-start', center: 'center', right: 'flex-end', defaultValue: () => 'general',
};
const ALIGNMENT_V = {
  top: 'flex-start', middle: 'center', bottom: 'flex-end', defaultValue: () => 'bottom',
};

const FORMAT_NUMBER = ['#,##0.00', '#,##0.0', '#,##0.000', '###0', '0'];
const FORMAT_DATE_STRING = ['dd.MM.yyyy', 'dd"."mm"."yy', 'dd"."mm', 'd" "mmm" "yyyy" г."', 'dd" "mmm" "yyyy" г."', 'dd" "mmmm" "yyyy" г."', 'd" "mmmm" "yyyy" г."'];
const FORMAT_DATE = {
  d: 'numeric',
  dd: '2-digit',
  m: 'numeric',
  mm: '2-digit',
  mmm: 'short',
  mmmm: 'long',
  y: '2-digit',
  yy: '2-digit',
  yyy: 'numeric',
  yyyy: 'numeric',
};

const exportDocument = {
  // type: 'document',
  version: '1.2',
  // sheetsList: [],
  sheets: [],
  styles: [],
  namedAreas: []
};

function onOpen() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const menuEntries = [
    { name: 'Export JSON Range Data', functionName: 'exportJSON' },
    { name: 'Export JSON Range', functionName: 'openPromt' },
    { name: 'Export All lists - Document', functionName: 'exportJSONDocument' },
    { name: 'Export All lists - Template', functionName: 'exportJSONTemplate' },
  ];
  ss.addMenu('Export JSON', menuEntries);
}

function exportJSONDocument() { exportAllSheetsJSON('document'); }
function exportJSONTemplate() { exportAllSheetsJSON('template'); }

function openPromt() {
  const ui = SpreadsheetApp.getUi();
  const rezult = ui.prompt(
    'Ввдедите количество строк:столбцов',
    ui.ButtonSet.OK_CANCEL,
  );
  const button = rezult.getSelectedButton();
  const value = rezult.getResponseText();
  if (button === ui.Button.OK) {
    const [row, column] = value.split(':');
    if (+row && +column) {
      exportJSON(row, column, true);
    } else {
      ui.alert('Введено не корректное значение', ui.ButtonSet.OK);
    }
  }
}

function exportAllSheetsJSON(type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets().slice(2);

  // type document
  exportDocument.type = type;

  // sheet lists
  // ss.getSheets().forEach((sheet) => {
  //   const sheetId = sheet.getSheetId();
  //   const sheetNameView = sheet.getSheetName();
  //   const sheetName = sheetNameView.replace(/(^|\s)\S/g, (a) => a.toUpperCase()).replace(/[ ]/g, '');
  //   // console.log(sheetName);
  //   // const sheetNameView = sheet.getSheetName();
  //   exportDocument.sheetsList.push({ name: sheetName, nameView: sheetNameView });
  // });

  sheets.forEach((sheet) => {
    // const sheetId = sheet.getSheetId();
    // console.log('ID', sheetId);
    const sheetNameView = sheet.getSheetName();
    const sheetName = sheetNameView.replace(/(^|\s)\S/g, (a) => a.toUpperCase()).replace(/[ ]/g, '');
    const range = sheet.getDataRange();
    const values = range.getValues();
    const rowCount = values.length;
    const columnCount = values[0].length;
    const namedRanges = getNamedAreas(sheet, sheetName); // for find cell parameters

    const cellsAndStyles = getCells(sheet, rowCount, columnCount, values, sheetName, namedRanges);

    const sheetData = {
      name: sheetName,
      nameView: sheetNameView,
      editAccess: 'closedExceptOpen',
      rows: getRows(sheet, rowCount),
      rowCount,
      columns: getColumns(sheet, columnCount),
      columnCount,
      cells: cellsAndStyles.cells,
    };
    exportDocument.sheets.push(sheetData);
    exportDocument.styles.push(...cellsAndStyles.styles);
    exportDocument.namedAreas.push(...namedRanges);
  
    // exportDocument.sheets[sheetName] = {
    //   editAccess: 'closedExceptOpen',
    //   rows: getRows(sheet, rowCount),
    //   rowCount,
    //   columns: getColumns(sheet, columnCount),
    //   columnCount,
    //   cells: cellsAndStyles.cells,
    //   // styles: cellsAndStyles.styles,
    // };
    // exportDocument.styles.push(...cellsAndStyles.styles);
    // exportDocument.namedAreas.push(...namedRanges);
  });
  displayText_(buildJson(exportDocument));
  // console.log(exportDocument);
}

function getNamedAreas(sheet, sheetName) {
  const namedRanges = sheet.getNamedRanges();
  const namedAreas = [];
  namedRanges.forEach((namedRange) => {
    namedAreas.push({ name: `${namedRange.getName()}`, range: `${sheetName}!${namedRange.getRange().getA1Notation()}` });
  });
  return namedAreas;
}

function getRows(sheet, rowCount) {
  const frozenRows = sheet.getFrozenRows();
  const rows = {};
  // rowsFixed
  for (var i = 0; i < frozenRows; i++) {
    rows[i + 1] = { height: sheet.getRowHeight(i + 1), isFrozen: true };
  }
  // rows, rowsGroup
  for (var i = frozenRows; i < rowCount; i++) {
    rows[i + 1] = { height: sheet.getRowHeight(i + 1) };
    const rowGroupDepth = sheet.getRowGroupDepth(i + 1);
    if (rowGroupDepth > 0) {
      const rowParent = sheet.getRowGroup(i + 1, rowGroupDepth).getControlIndex();
      if (!rows[rowParent].isGroup) {
        rows[rowParent].isGroup = true;
        rows[rowParent].isOpen = true; // false if grouping close
      }
      rows[i + 1].level = rowGroupDepth;
    }
  }
  return rows;
}

function getColumns(sheet, columnCount) {
  const frozenColumns = sheet.getFrozenColumns();
  const columns = {};
  for (var i = 0; i < frozenColumns; i++) {
    columns[getColumnNameForNumber(i + 1)] = { width: sheet.getColumnWidth(i + 1), isFrozen: true };
  }
  // column, columnGroup
  for (var i = frozenColumns; i < columnCount; i++) {
    columns[getColumnNameForNumber(i + 1)] = { width: sheet.getColumnWidth(i + 1) };
    const columnGroupDepth = sheet.getColumnGroupDepth(i + 1);
    if (columnGroupDepth > 0) {
      const columnParent = sheet.getColumnGroup(i + 1, columnGroupDepth).getControlIndex();
      const columnParentName = getColumnNameForNumber(columnParent);
      if (!columns[columnParentName].isGroup) {
        columns[columnParentName].isGroup = true;
        columns[columnParentName].isOpen = true; // false if grouping close
      }
      columns[columnParentName].level = columnGroupDepth;
    }
  }
  return columns;
}

function getBorders(sheet) {
  const fieldsBorders = 'sheets(data(rowData/values/userEnteredFormat/borders))';
  const currSsId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const name = sheet.getName();
  const data = Sheets.Spreadsheets.get(currSsId, {
    ranges: name,
    fields: fieldsBorders,
  });
  console.log(data);
  const dataRowArray = data.sheets[0].data[0].rowData;
  const dataBordersArray = [];
  dataRowArray.forEach((item) => {
    dataBordersArray.push(item.values);
  });
  return dataBordersArray;
}

function getCells(sheet, countRow, countColumn, values, sheetName, namedAreas) {
  const range = sheet.getDataRange();
  const cells = {};
  const styles = [];

  const bordersCells = getBorders(sheet);
  for (var i = 0; i < countRow; i++) {
    for (let j = 0; j < countColumn; j++) {
      const cellName = range.getCell(i + 1, j + 1).getA1Notation();
      const cellNameLower = cellName.toLowerCase();
      
      cells[cellNameLower] = {};
      cellRange = sheet.getRange(cellName);
      // cell type
      // if (cellName === 'B7') console.log(sheetName, cellRange.getNumberFormat());
      const cellType = getCellType(cellRange);
      if (cellType) {
        cells[cellNameLower].type = cellType.type;
        if (cellType.format) cells[cellNameLower].formatString = cellType.format;
      }

      // cell value
      const cellValue = (values[i] && values[i][j] && values[i][j] != '') && values[i][j];
      if (cellValue) {
        cells[cellNameLower] = { ...cells[cellNameLower], ...getCellValue(cellValue) };
      }

      // formula cell
      let formula = cellRange.getFormula(); // поправить если в формуле несколько ссылок и на разные листы
      if (formula) {
        // console.log(cellName, formula);
        if (formula.includes('!')) {
          const [sheetName, formul] = formula.split('!');
          // const sheet = exportDocument.sheetsList.find((sheetItem) => sheetName.includes(sheetItem.nameView)) || { name: undefined };
          const sheet = exportDocument.sheets.find((sheetItem) => sheetName.includes(sheetItem.nameView)) || { name: undefined };
          formula = `='${sheet.name}'!${formul}`;
          // const formulaSplit = formula.split('!');
          // const sheetNameView = formulaSplit[0].slice(1).replace(/\'/g,'')
          // const cellName = formulaSplit[1];
          // const sheet = exportDocument.sheetsList.find((sheetItem) => sheetItem.nameView === sheetNameView) || { sheetName: undefined };
          // formula = `='${sheet.name}'!${cellName}`;
        }
        cells[cellNameLower].formula = formula;
        cells[cellNameLower].value = 0;
        cells[cellNameLower].isEditable = false;
      }

      // cell styles
      const cellStyles = getCellStyle(sheet, (bordersCells[i]) ? bordersCells[i][j] : null, cellName, sheetName);
      if (cellStyles) {
        cells[cellNameLower].style = `${cellNameLower} ${cells[cellNameLower].style || ''}`;
        styles.push(cellStyles);
      }

      // for tempalte
      const cellParameterIndex = namedAreas.findIndex((namedArea) => {
        // console.log(namedArea);
        return (namedArea.range.split('!')[1].split(':')[0] === cellName);
      });
      if (cellParameterIndex > -1) {
        cells[cellNameLower].parameter = namedAreas[cellParameterIndex].name; // .split('!')[1];
        namedAreas.splice(cellParameterIndex, 1);
      }
    }
  }

  // cell colspan, rowspan
  const cellsMerge = range.getMergedRanges();
  for (var i = 0; i < cellsMerge.length; i++) {
    const [cellNameStart, cellNameEnd] = cellsMerge[i].getA1Notation().split(':');
    const cellNameStartRow = +cellNameStart.replace(/[A-z]/g, '');
    const cellNameStartColumn = +getColumnNumberForName(cellNameStart.replace(/[0-9]/g, '').toLowerCase());

    const cellNameEndRow = +cellNameEnd.replace(/[A-z]/g, '');
    const cellNameEndColumn = +getColumnNumberForName(cellNameEnd.replace(/[0-9]/g, '').toLowerCase());

    if (((cellNameEndRow - cellNameStartRow) > 0 || (cellNameEndColumn - cellNameStartColumn) > 0)
      && !cells[cellNameStart.toLowerCase()]) cells[cellNameStart.toLowerCase()] = {};
    if ((cellNameEndRow - cellNameStartRow) > 0) cells[cellNameStart.toLowerCase()].rowspan = (cellNameEndRow - cellNameStartRow) + 1;
    if ((cellNameEndColumn - cellNameStartColumn) > 0) cells[cellNameStart.toLowerCase()].colspan = (cellNameEndColumn - cellNameStartColumn) + 1;
  }

  return { cells, styles };
}

function getCellType(range) {
  // const cellName = cellNameA1;
  // const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // const range = sheet.getRange(cellName);
  const formatCell = range.getNumberFormat();
  // if(cellName === 'h10') console.log(cellName, formatCell);
  if (FORMAT_NUMBER.includes(formatCell)) {
    var format = `minFD=${(formatCell === '0') ? '0' : formatCell.split('.')[formatCell.split('.').length - 1].length}`; // ??? просто цифра без десятков последний length - 1
    return { type: 'number', format };
  }
  if (FORMAT_DATE_STRING.includes(formatCell)) {
    const [day, month, year] = formatCell.replace(/ /g, '.').replace(/"/g, '').split('.');
    var format = `d=${FORMAT_DATE[day]}$m=${FORMAT_DATE[month]}$y=${FORMAT_DATE[year]}`;
    return { type: 'date', format };
  }
  return null;
}

function getCellValue(cellValue) {
  if (!['$','!'].includes(cellValue[0])) return { value: cellValue };
  let cellProperty = {};
  if (cellValue[0] === '$') {
    const {img, action, value} = JSON.parse(cellValue.slice(1));
    cellProperty = {
      noSelect: true,
      isEditable: false,
      style: ' no-print ',
    };
    if (img) cellProperty.image = img;
    if (action) cellProperty.action = action;
    if (value) cellProperty.value = value;
    return cellProperty;
  }
  if (cellValue[0] === '!') {
    const [type, source, rmv, value] = cellValue.slice(1).split('|');
    if (type === 'LIST') cellProperty.type = `choice.${source}`;
    if (type === 'FIELD') {
      cellProperty.type = `field.${source}`;
      cellProperty.relatedModelView = rmv;
      cellProperty.isEditable = true;
      if (value) cellProperty.value = value;
    }
    return cellProperty;
  }
}

function getCellStyle(sheet, borders, cellNameA1, sheetName) {
  const range = sheet.getRange(cellNameA1);
  const cellStyle = {
    name: `${sheetName}|${cellNameA1.toLowerCase()}`,
    list: {},
  };
  let cellBorders = {};
  if (borders && borders.userEnteredFormat) cellBorders = getCellBorders(borders);

  if (range.getFontFamily() && !FONT_FAMILY.includes(range.getFontFamily())) cellStyle.list.fontFamily = `'${range.getFontFamily().replace(/["']/g,'')}', sans-serif`;
  if (range.getFontWeight() && range.getFontWeight() != FONT_WEIGHT) cellStyle.list.fontWeight = range.getFontWeight();
  if (range.getFontStyle() && range.getFontStyle() != FONT_STYLE) cellStyle.list.fontStyle = range.getFontStyle();
  if (range.getFontSize() && range.getFontSize() != FONT_SIZE) cellStyle.list.fontSize = `${range.getFontSize()}pt`;
  if (range.getFontColor() && range.getFontColor() != FONT_COLOR) cellStyle.list.color = range.getFontColor();
  if (range.getFontLine() === 'underline') {
    cellStyle.list.textDecoration = range.getFontLine();
    cellStyle.list.textUnderlinePosition = 'under';
  }
  if (range.getBackgrounds() && range.getBackgrounds() != BACKGROUND_COLOR) cellStyle.list.backgroundColor = range.getBackgrounds()[0][0];
  if (range.getHorizontalAlignment() && range.getHorizontalAlignment() != ALIGNMENT_H.defaultValue()) {
    cellStyle.list.textAlign = range.getHorizontalAlignment();
    cellStyle.list.justifyContent = ALIGNMENT_H[range.getHorizontalAlignment()];
  }
  if (range.getVerticalAlignment() && range.getVerticalAlignment() != ALIGNMENT_V.defaultValue()) cellStyle.list.alignItems = ALIGNMENT_V[range.getVerticalAlignment()];
  
  if (range.getWrap() == true && range.getWrapStrategy() == 'WRAP') { cellStyle.list.wordBreak = 'break-word'; cellStyle.list.whiteSpace = 'pre-line'; }

  if (range.getTextRotation().getDegrees() == 90) {
    cellStyle.list.writingMode = 'vertical-rl';
    cellStyle.list.transform = 'rotate(180deg)';
  }
  cellStyle.list = { ...cellStyle.list, ...cellBorders };
  return cellStyle;
}

function getCellBorders(bordersAll) {
  const borders = bordersAll.userEnteredFormat.borders;
  const cellBorders = {};
  if (borders.top) {
    cellBorders.borderTop = getBorderProperties(borders, 'top');
  }

  if (borders.left) {
    cellBorders.borderLeft = getBorderProperties(borders, 'left');
  }

  if (borders.bottom) {
    cellBorders.borderBottom = getBorderProperties(borders, 'bottom');
  }

  if (borders.right) {
    cellBorders.borderRight = getBorderProperties(borders, 'right');
  }
  return cellBorders;
}

function getBorderProperties(cellBorders, direction) {
  if (!cellBorders[direction]) return null;
  const colors = cellBorders[direction].colorStyle.rgbColor;
  const color = `rgba(${(colors?.red || 0) * 100}%, ${(colors?.green || 0) * 100}%, ${(colors?.blue || 0) * 100}%)`;
  const width = `${cellBorders[direction].width}px`;
  const style = cellBorders[direction].style.split('_')[0].toLowerCase();
  return `${width} ${style} ${color}`;
}

// function getCellStyles(cellNameA1, i, j, bordersCells, range, sheet) {
//   let cellNameTop = null;
//   let borderCellTop = null;
//   let cellNameLeft = null;
//   let borderCellLeft = null;
//   if (i > 0) {
//     cellNameTop = (range.getCell(i, j + 1).getMergedRanges().length) ? range.getCell(i, j + 1).getMergedRanges()[0].getA1Notation().split(':')[0] : range.getCell(i, j + 1).getA1Notation();
//     const cellNameTopRow = +cellNameTop.replace(/[A-z]/g, '');
//     const cellNameTopColumn = +getColumnNumberForName(cellNameTop.replace(/[0-9]/g, '').toLowerCase());
//     borderCellTop = (bordersCells[cellNameTopRow - 1]) ? bordersCells[cellNameTopRow - 1][cellNameTopColumn - 1] : null;
//   }
//   if (j > 0) {
//     cellNameLeft = (range.getCell(i + 1, j).getMergedRanges().length) ? range.getCell(i + 1, j).getMergedRanges()[0].getA1Notation().split(':')[0] : range.getCell(i + 1, j).getA1Notation();
//     const cellNameLeftRow = +cellNameLeft.replace(/[A-z]/g, '');
//     const cellNameLeftColumn = +getColumnNumberForName(cellNameLeft.replace(/[0-9]/g, '').toLowerCase());
//     borderCellLeft = (bordersCells[cellNameLeftRow - 1]) ? bordersCells[cellNameLeftRow - 1][cellNameLeftColumn - 1] : null;
//   }
//   const styleCell = getCellStyle(
//     cellNameA1,
//     (bordersCells[i]) ? bordersCells[i][j] : null,
//     borderCellTop,
//     borderCellLeft,
//     sheet,
//   );

//   if (styleCell) return styleCell;
// }

// function getCellStyle(cellNameA1, borderCell, borderCellTop, borderCellLeft, sheet) {
//   const styleCell = {
//     name: cellNameA1.toLowerCase(),
//     list: {},
//   };
//   // const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   const range = sheet.getRange(styleCell.name);

//   if (borderCell && borderCell.userEnteredFormat) {
//     // Logger.log(borderCell);
//     styleCell.list = getBorderCell(borderCell, cellNameA1, borderCellTop, borderCellLeft);
//   }
//   if (range.getFontFamily() && !FONT_FAMILY.includes(range.getFontFamily())) styleCell.list.fontFamily = `'${range.getFontFamily()}', sans-serif`;
//   if (range.getFontWeight() && range.getFontWeight() != FONT_WEIGHT) styleCell.list.fontWeight = range.getFontWeight();
//   if (range.getFontStyle() && range.getFontStyle() != FONT_STYLE) styleCell.list.fontStyle = range.getFontStyle();
//   if (range.getFontSize() && range.getFontSize() != FONT_SIZE) styleCell.list.fontSize = `${range.getFontSize()}pt`;
//   if (range.getFontColor() && range.getFontColor() != FONT_COLOR) styleCell.list.color = range.getFontColor();
//   if (range.getFontLine() === 'underline') {
//     styleCell.list.textDecoration = range.getFontLine();
//     styleCell.list.textUnderlinePosition = 'under';
//   }
//   if (range.getBackgrounds() && range.getBackgrounds() != BACKGROUND_COLOR) styleCell.list.backgroundColor = range.getBackgrounds()[0][0];
//   if (range.getHorizontalAlignment() && range.getHorizontalAlignment() != ALIGNMENT_H.defaultValue()) {
//     styleCell.list.textAlign = range.getHorizontalAlignment();
//     styleCell.list.justifyContent = ALIGNMENT_H[range.getHorizontalAlignment()];
//   }
//   if (range.getVerticalAlignment() && range.getVerticalAlignment() != ALIGNMENT_V.defaultValue()) styleCell.list.alignItems = ALIGNMENT_V[range.getVerticalAlignment()];
  
//   if (range.getWrap() == true && range.getWrapStrategy() == 'WRAP') { styleCell.list.wordBreak = 'break-word'; styleCell.list.whiteSpace = 'pre-line'; }

//   // if (range.getTextRotation().getDegrees() == 90) { styleCell.list.writingMode = 'tb-rl'; styleCell.list.transform = 'rotate(180deg)'; };
//   if (range.getTextRotation().getDegrees() == 90) {
//     styleCell.list.writingMode = 'vertical-rl';
//     styleCell.list.transform = 'rotate(180deg)';
//   }
//   if (Object.keys(styleCell.list).length) return styleCell;
//   return null;
// }

// function getNamedAreas(sheet) {
//   const namedRanges = sheet.getNamedRanges();
//   for (let i = 0; i < namedRanges.length; i++) {
//     namedAreas.push({ name: namedRanges[i].getName(), range: namedRanges[i].getRange().getA1Notation() });
//   }
//   return namedAreas;
// }

function testFunction(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // var imen = sheet.getNamedRanges();
  // Logger.log(imen.length);
  // var name = '';
  // for (let i = 0; i < imen.length; i++) {
  //   name = imen[i].getName();
  //   Logger.log(name);
  //   Logger.log(imen[i].getRange().getA1Notation());
  // }
  // var ss = SpreadsheetApp.getActiveSpreadsheet();
  // var sheet = ss.getSheets()[0];

  const cell = sheet.getRange('B5');
  Logger.log(cell.getBackgroundObject().asRgbColor().asHexString());
}

function getNamedRanges() {
  const namedRanges = [];
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const imen = sheet.getNamedRanges();
  for (let i = 0; i < imen.length; i++) {
    namedRanges.push({ name: imen[i].getName(), range: imen[i].getRange().getA1Notation() });
    // namedRanges[imen[i].getName()] = imen[i].getRange().getA1Notation();
  }
  return namedRanges;
}

// function getCellType(cellNameA1) {
//   const cellName = cellNameA1.toLowerCase();
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   const range = sheet.getRange(cellName);
//   const formatCell = range.getNumberFormat();
//   if(cellName === 'h10') console.log(cellName, formatCell);
//   if (FORMAT_NUMBER.includes(formatCell)) {
//     var format = `minFD=${formatCell.split('.')[formatCell.split('.').length - 1].length - 1}`; // ??? просто цифра без десятков последний length - 1
//     return { type: 'number', format };
//   }
//   if (FORMAT_DATE_STRING.includes(formatCell)) {
//     const [day, month, year] = formatCell.replace(/ /g, '.').replace(/"/g, '').split('.');
//     var format = `d=${FORMAT_DATE[day]}$m=${FORMAT_DATE[month]}$y=${FORMAT_DATE[year]}`;
//     return { type: 'date', format };
//   }
//   return null;
// }

function getBordersCell() {
  const fieldsBorders = 'sheets(data(rowData/values/userEnteredFormat/borders))';
  const currSsId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const activeSheet = SpreadsheetApp.getActiveSheet();
  const name = activeSheet.getName();

  const data = Sheets.Spreadsheets.get(currSsId, {
    ranges: name,
    fields: fieldsBorders,
  });
  const dataRowArray = data.sheets[0].data[0].rowData;
  const dataBordersArray = [];
  dataRowArray.forEach((item) => {
    dataBordersArray.push(item.values);
  });
  return dataBordersArray;
}

function getBorderCell(borders, cellNameA1, borderCellTop, borderCellLeft) {
  const cellRow = +cellNameA1.replace(/[A-z]/g, '');
  const cellColumn = cellNameA1.replace(/[0-9]/g, '');
  const styleCell = {
    list: {},
  };
  const dataBorder = borders.userEnteredFormat.borders;
  let colorBorder = {};
  
  // if top cell
  // if (cellRow === 1) {
  if (dataBorder.top) {
    colorBorder = dataBorder.top.colorStyle.rgbColor;
    styleCell.list.borderTop = `${dataBorder.top.width}px `
        + `${dataBorder.top.style.split('_')[0].toLowerCase()} `
        + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
  }
  // }
  // if left cell
  // if (cellColumn === 'A') {
  if (dataBorder.left) {
    colorBorder = dataBorder.left.colorStyle.rgbColor;
    styleCell.list.borderLeft = `${dataBorder.left.width}px `
        + `${dataBorder.left.style.split('_')[0].toLowerCase()} `
        + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
  }
  // }

  // border right & bottom  
  if (dataBorder.bottom) {
    colorBorder = dataBorder.bottom.colorStyle.rgbColor;
    styleCell.list.borderBottom = `${dataBorder.bottom.width}px `
        + `${dataBorder.bottom.style.split('_')[0].toLowerCase()} `
        + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
  }
  if (dataBorder.right) {
    colorBorder = dataBorder.right.colorStyle.rgbColor;
    console.log(colorBorder)
    styleCell.list.borderRight = `${dataBorder.right.width}px `
        + `${dataBorder.right.style.split('_')[0].toLowerCase()} `
        + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
  }

  if (dataBorder.top) {
    colorBorder = dataBorder.top.colorStyle.rgbColor;
    // Logger.log(cellNameA1 + ' - ' + borderCellTop);
    if (!borderCellTop) {
      styleCell.list.borderTop = `${dataBorder.top.width}px `
          + `${dataBorder.top.style.split('_')[0].toLowerCase()} `
          + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
    } else if (!Object.keys(borderCellTop).length) {
      styleCell.list.borderTop = `${dataBorder.top.width}px `
              + `${dataBorder.top.style.split('_')[0].toLowerCase()} `
              + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
    } else if (!borderCellTop.userEnteredFormat && !borderCellTop.userEnteredFormat.borders.bottom) {
      styleCell.list.borderTop = `${dataBorder.top.width}px `
              + `${dataBorder.top.style.split('_')[0].toLowerCase()} `
              + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
    }
  }

  if (dataBorder.left) {
    colorBorder = dataBorder.left.colorStyle.rgbColor;
    // Logger.log(cellNameA1 + ' - ' + borderCellLeft);
    if (!borderCellLeft) {
      styleCell.list.borderLeft = `${dataBorder.left.width}px `
          + `${dataBorder.left.style.split('_')[0].toLowerCase()} `
          + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
    } else if (!Object.keys(borderCellLeft).length) {
      styleCell.list.borderLeft = `${dataBorder.left.width}px `
            + `${dataBorder.left.style.split('_')[0].toLowerCase()} `
            + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
    } else if (!borderCellLeft.userEnteredFormat && !borderCellLeft.userEnteredFormat.borders.right) {
      styleCell.list.borderLeft = `${dataBorder.left.width}px `
              + `${dataBorder.left.style.split('_')[0].toLowerCase()} `
              + `rgba(${(colorBorder?.red || 0) * 100}%, ${(colorBorder?.green || 0) * 100}%, ${(colorBorder?.blue || 0) * 100}%)`;
    }
  }
  return styleCell.list;
}

function getStylesCell(cellNameA1, borderCell, borderCellTop, borderCellLeft) {
  const styleCell = {
    name: cellNameA1.toLowerCase(),
    list: {},
  };
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(styleCell.name);

  if (borderCell && borderCell.userEnteredFormat) {
    // Logger.log(borderCell);
    styleCell.list = getBorderCell(borderCell, cellNameA1, borderCellTop, borderCellLeft);
  }
  if (range.getFontFamily() && !FONT_FAMILY.includes(range.getFontFamily())) styleCell.list.fontFamily = `'${range.getFontFamily()}', sans-serif`;
  if (range.getFontWeight() && range.getFontWeight() != FONT_WEIGHT) styleCell.list.fontWeight = range.getFontWeight();
  if (range.getFontStyle() && range.getFontStyle() != FONT_STYLE) styleCell.list.fontStyle = range.getFontStyle();
  if (range.getFontSize() && range.getFontSize() != FONT_SIZE) styleCell.list.fontSize = `${range.getFontSize()}pt`;
  if (range.getFontColor() && range.getFontColor() != FONT_COLOR) styleCell.list.color = range.getFontColor();
  if (range.getFontLine() === 'underline') {
    styleCell.list.textDecoration = range.getFontLine();
    styleCell.list.textUnderlinePosition = 'under';
  }
  if (range.getBackgrounds() && range.getBackgrounds() != BACKGROUND_COLOR) styleCell.list.backgroundColor = range.getBackgrounds()[0][0];
  if (range.getHorizontalAlignment() && range.getHorizontalAlignment() != ALIGNMENT_H.defaultValue()) {
    styleCell.list.textAlign = range.getHorizontalAlignment();
    styleCell.list.justifyContent = ALIGNMENT_H[range.getHorizontalAlignment()];
  }
  if (range.getVerticalAlignment() && range.getVerticalAlignment() != ALIGNMENT_V.defaultValue()) styleCell.list.alignItems = ALIGNMENT_V[range.getVerticalAlignment()];
  
  if (range.getWrap() == true && range.getWrapStrategy() == 'WRAP') { styleCell.list.wordBreak = 'break-word'; styleCell.list.whiteSpace = 'pre-line'; }

  // if (range.getTextRotation().getDegrees() == 90) { styleCell.list.writingMode = 'tb-rl'; styleCell.list.transform = 'rotate(180deg)'; };
  if (range.getTextRotation().getDegrees() == 90) {
    styleCell.list.writingMode = 'vertical-rl';
    styleCell.list.transform = 'rotate(180deg)';
  }
  if (Object.keys(styleCell.list).length) return styleCell;
  return null;
}

function exportJSON(row = null, column = null, template = false) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let range = null;
  if (row === null || column === null) {
    range = sheet.getDataRange();
  } else {
    range = sheet.getRange(1, 1, row, column);
  }
  const values = range.getValues();
  const countRow = (row) || values.length;
  const countColumn = (column) || values[0].length;
  // 
  // var range = sheet.getRange(1, 1, sheet.getMaxRows() - 990, sheet.getMaxColumns() - 16);

  Logger.log(sheet.getMaxColumns());
  Logger.log(sheet.getMaxRows());
  const objectToJSON = {
    type: (template) ? 'template' : 'document',
    version: '1.0',
    editAccess: 'closedExceptOpen',
    rows: {},
    columns: {},
    cells: {},
    styles: [],
    namedAreas: [],
  };
  // rowsFixed
  for (var i = 0; i < sheet.getFrozenRows(); i++) {
    objectToJSON.rows[i + 1] = { height: sheet.getRowHeight(i + 1), fixed: true };
  }
  // rows, rowsGroup
  for (var i = sheet.getFrozenRows(); i < countRow; i++) {
    objectToJSON.rows[i + 1] = { height: sheet.getRowHeight(i + 1) };

    if (sheet.getRowGroupDepth(i + 1) > 0) {
      // console.log(i + 1);
      // console.log(sheet.getRowGroupDepth(i + 1));
      // console.log(sheet.getRowGroup(i + 1, sheet.getRowGroupDepth(i + 1)));
      const rowParent = sheet.getRowGroup(i + 1, sheet.getRowGroupDepth(i + 1)).getControlIndex();
      if (!objectToJSON.rows[rowParent].isGroup) {
        objectToJSON.rows[rowParent].isGroup = true;
        objectToJSON.rows[rowParent].isOpen = true;
      }
      // objectToJSON.rows[rowParent].rowGroup += 1;
      objectToJSON.rows[i + 1].level = sheet.getRowGroupDepth(i + 1); //sheet.getRowGroup(i + 1, sheet.getRowGroupDepth(i + 1)).getControlIndex();
    }
  }

  // columnsFixed
  for (var i = 0; i < sheet.getFrozenColumns(); i++) {
    objectToJSON.columns[getColumnNameForNumber(i + 1)] = { width: sheet.getColumnWidth(i + 1), fixed: true };
  }
  // column, columnGroup
  for (var i = sheet.getFrozenColumns(); i < countColumn; i++) {
    objectToJSON.columns[getColumnNameForNumber(i + 1)] = { width: sheet.getColumnWidth(i + 1) };
    if (sheet.getColumnGroupDepth(i + 1) > 0) {
      const columnParent = sheet.getColumnGroup(i + 1, sheet.getColumnGroupDepth(i + 1)).getControlIndex();
      const columnName = getColumnNameForNumber(columnParent);
      if (!objectToJSON.columns[columnName].columnGroup) objectToJSON.columns[columnName].columnGroup = 1;
      objectToJSON.columns[columnName].columnGroup += 1;
      objectToJSON.columns[getColumnNameForNumber(i + 1)].parent = getColumnNameForNumber(sheet.getColumnGroup(i + 1, sheet.getColumnGroupDepth(i + 1)).getControlIndex());
    }
  }
  // get all borders
  const bordersCells = getBordersCell();
  // get all namedAreas
  const namedAreas = getNamedRanges();
  // Logger.log(bordersCells);
  // cells, styles
  for (var i = 0; i < countRow; i++) {
    for (let j = 0; j < countColumn; j++) {
      const cellName = range.getCell(i + 1, j + 1).getA1Notation();
      console.log(sheet.getRange(cellName).getFormula());
      let cellNameTop = null;
      let borderCellTop = null;
      let cellNameLeft = null;
      let borderCellLeft = null;
      if (i > 0) {
        cellNameTop = (range.getCell(i, j + 1).getMergedRanges().length) ? range.getCell(i, j + 1).getMergedRanges()[0].getA1Notation().split(':')[0] : range.getCell(i, j + 1).getA1Notation();
        const cellNameTopRow = +cellNameTop.replace(/[A-z]/g, '');
        const cellNameTopColumn = +getColumnNumberForName(cellNameTop.replace(/[0-9]/g, '').toLowerCase());
        borderCellTop = (bordersCells[cellNameTopRow - 1]) ? bordersCells[cellNameTopRow - 1][cellNameTopColumn - 1] : null;
      }
      if (j > 0) {
        cellNameLeft = (range.getCell(i + 1, j).getMergedRanges().length) ? range.getCell(i + 1, j).getMergedRanges()[0].getA1Notation().split(':')[0] : range.getCell(i + 1, j).getA1Notation();
        const cellNameLeftRow = +cellNameLeft.replace(/[A-z]/g, '');
        const cellNameLeftColumn = +getColumnNumberForName(cellNameLeft.replace(/[0-9]/g, '').toLowerCase());
        borderCellLeft = (bordersCells[cellNameLeftRow - 1]) ? bordersCells[cellNameLeftRow - 1][cellNameLeftColumn - 1] : null;
      }

      const parameter = namedAreas.find((namedArea) => namedArea.range.split(':')[0] === cellName);
      const styleCell = getStylesCell(
        cellName,
        (bordersCells[i]) ? bordersCells[i][j] : null,
        borderCellTop,
        borderCellLeft,
      );
      const typeCell = getCellType(cellName);
      if ((values[i] && values[i][j] && values[i][j] != '') || styleCell || typeCell || parameter) objectToJSON.cells[cellName.toLowerCase()] = {};
      
      // formula cell
      const formula = sheet.getRange(cellName).getFormula();
      if (formula) objectToJSON.cells[cellName.toLowerCase()].formula = formula;

      // parameter name cell
      if (parameter) {
        objectToJSON.cells[cellName.toLowerCase()].parameter = parameter.name.replace(/_/g, ''); // ???? убрать replace
        objectToJSON.cells[cellName.toLowerCase()].isEditable = true;
        namedAreas.splice(namedAreas.findIndex((namedArea) => namedArea.range.split(':')[0] === cellName), 1);
      }

      // style cell
      if (styleCell) {
        objectToJSON.cells[cellName.toLowerCase()].style = cellName.toLowerCase();
        objectToJSON.styles.push(styleCell);
      }

      // type cell
      if (typeCell) {
        if (typeCell.type) {
          objectToJSON.cells[cellName.toLowerCase()].type = typeCell.type;
          if (typeCell.type === 'date' && values[i][j] != '') {
            const dateNow = new Date(values[i][j]);
            const dd = (+dateNow.getDate() < 10) ? `0${dateNow.getDate()}` : dateNow.getDate();
            const mm = (+dateNow.getMonth() < 9) ? `0${+dateNow.getMonth() + 1}` : +dateNow.getMonth() + 1;
            const yyyy = dateNow.getFullYear();
            objectToJSON.cells[cellName.toLowerCase()].value = `${yyyy}-${mm}-${dd}`;
          //   Logger.log(values[i][j]);
          //   objectToJSON.cells[cellName.toLowerCase()].value = values[i][j].split('.').reverse().join('-');
          }
        }
        if (typeCell.format) objectToJSON.cells[cellName.toLowerCase()].formatString = typeCell.format;
        // objectToJSON.cells[cellName.toLowerCase()].type = typeCell;
      }
      
      // value cell
      if (values[i] && values[i][j] && values[i][j] != '') {
        if (values[i][j].toString().includes('!')) {
          const [type, source, rmv] = values[i][j].slice(1).split('|');
          if (type === 'LIST') objectToJSON.cells[cellName.toLowerCase()].type = `choice.${source}`;
          if (type === 'FIELD') {
            objectToJSON.cells[cellName.toLowerCase()].type = `field.${source}`;
            objectToJSON.cells[cellName.toLowerCase()].relatedModelView = rmv;
          }
          // objectToJSON.cells[cellName.toLowerCase()].type = `${(type === 'LIST') ? 'choice' : 'field'}.${source}`;
        } else if (values[i][j][0] === '$') {
          const {img, action, value} = JSON.parse(values[i][j].slice(1));
          objectToJSON.cells[cellName.toLowerCase()].scripts = {};
          if (action) objectToJSON.cells[cellName.toLowerCase()].scripts.action = action;
          if (value) objectToJSON.cells[cellName.toLowerCase()].value = value;
          if (img) objectToJSON.cells[cellName.toLowerCase()].image = img;
          objectToJSON.cells[cellName.toLowerCase()].noSelect = true;
          objectToJSON.cells[cellName.toLowerCase()].isEditable = false;
          objectToJSON.cells[cellName.toLowerCase()].style += ' no-print ';
        } else {
          objectToJSON.cells[cellName.toLowerCase()].value = values[i][j];
        }
      }
      
      // if (bordersCells[i] && bordersCells[i][j].userEnteredFormat) {
      //   // Logger.log(borderCell);
      //   var pseudoBorder = 
      //   styleCell.list = get(bordersCells[i][j], cellNameA1, borderCellTop, borderCellLeft);
      // };

      // if (values[i][j] != "") {
      //   if (typeCell) {
      //     if (typeCell.type && typeCell.type === 'date' && typeCell.format) {
      //       const formatOption = getFormatOptionDate(typeCell.format);
      //       const formatter = new Intl.DateTimeFormat("ru-RU", formatOption);
      //       objectToJSON.cells[cellName.toLowerCase()].value = formatter.format(values[i][j]);
      //     } else {
      //       objectToJSON.cells[cellName.toLowerCase()].value = values[i][j];
      //     }
      //   } else {
      //     objectToJSON.cells[cellName.toLowerCase()].value = values[i][j];
      //   }
      // }
    }
  }
  
  // cell colspan, rowspan
  const cellsMerge = range.getMergedRanges();
  for (var i = 0; i < cellsMerge.length; i++) {
    const [cellNameStart, cellNameEnd] = cellsMerge[i].getA1Notation().split(':');
    const cellNameStartRow = +cellNameStart.replace(/[A-z]/g, '');
    const cellNameStartColumn = +getColumnNumberForName(cellNameStart.replace(/[0-9]/g, '').toLowerCase());

    const cellNameEndRow = +cellNameEnd.replace(/[A-z]/g, '');
    const cellNameEndColumn = +getColumnNumberForName(cellNameEnd.replace(/[0-9]/g, '').toLowerCase());

    if (((cellNameEndRow - cellNameStartRow) > 0 || (cellNameEndColumn - cellNameStartColumn) > 0)
      && !objectToJSON.cells[cellNameStart.toLowerCase()]) objectToJSON.cells[cellNameStart.toLowerCase()] = {};
    if ((cellNameEndRow - cellNameStartRow) > 0) objectToJSON.cells[cellNameStart.toLowerCase()].rowspan = (cellNameEndRow - cellNameStartRow) + 1;
    if ((cellNameEndColumn - cellNameStartColumn) > 0) objectToJSON.cells[cellNameStart.toLowerCase()].colspan = (cellNameEndColumn - cellNameStartColumn) + 1;
  }

  // getNamedRanges
  namedAreas.forEach((namedArea) => {
    objectToJSON.namedAreas.push({
      name: namedArea.name.replace(/_/g, ''),
      range: namedArea.range,
    })
  })
  // objectToJSON.namedAreas = getNamedRanges();
  displayText_(buildJson(objectToJSON));
}

function displayText_(text) {
  const output = HtmlService.createHtmlOutput(`<textarea style='width:100%;' rows='20'>${text}</textarea>`);
  output.setWidth(1000);
  output.setHeight(500);
  SpreadsheetApp.getUi()
    .showModalDialog(output, 'Exported JSON');
}

function buildJson(object) {
  return Utilities.jsonStringify(object);
}

function getFormatOptionDate(formatString) {
  const [day, month, year] = formatString.split('.');
  return {
    day: FORMAT_DATE[day],
    month: FORMAT_DATE[month],
    year: FORMAT_DATE[year],
  };
}

function getColumnNameForNumber(columnNumber) {
  if (columnNumber > 702) return 'Infinity';
  if (columnNumber <= SET_COLUMN_NAME.length) {
    const columnName = SET_COLUMN_NAME[columnNumber - 1];
    return columnName;
  }
  if ((columnNumber % SET_COLUMN_NAME.length) === 0) {
    const columnName = `${SET_COLUMN_NAME[
      ((columnNumber - SET_COLUMN_NAME.length) / SET_COLUMN_NAME.length) - 1
    ]}${SET_COLUMN_NAME[SET_COLUMN_NAME.length - 1]}`;
    return columnName;
  }
  const columnName = `${SET_COLUMN_NAME[
    (Math.floor(columnNumber / SET_COLUMN_NAME.length)) - 1
  ]}${SET_COLUMN_NAME[(columnNumber % SET_COLUMN_NAME.length) - 1]}`;
  return columnName;
}

function getColumnNumberForName(columnName) {
  if (columnName.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === columnName) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === columnName[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === columnName[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
}
