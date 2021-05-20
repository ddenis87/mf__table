
const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const FONT_FAMILY = ['Arial', 'arial,sans,sans-serif'];
const FONTS_FAMILY = { 'Times New Roman': "'Times New Roman, Times, sans-serif'" }
const FONT_SIZE = 0;
const FONT_WEIGHT = 'normal';
const FONT_STYLE = 'normal';
const FONT_COLOR = '#000000';

const ALIGNMENT_H = { left: 'flex-start', center: 'center', right: 'flex-end', defaultValue: () => 'general' };
const ALIGNMENT_V = { top: 'flex-start', middle: 'center', bottom: 'flex-end', defaultValue: () => 'bottom' };

const FORMAT_NUMBER = ['#,##0.00','#,##0.0'];
const FORMAT_DATE_STRING = ['dd.MM.yyyy','dd"."mm"."yy','dd"."mm','d" "mmm" "yyyy" г."','dd" "mmm" "yyyy" г."','dd" "mmmm" "yyyy" г."','d" "mmmm" "yyyy" г."'];
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
  yyyy: 'numeric'
};

function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
    {name: "Export sheet JSON", functionName: "exportJSON"},
    {name: "Export sheet JSON Range", functionName: "openDialog"},
  ];
  ss.addMenu("Export JSON", menuEntries);

}

function openDialog(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var imen = sheet.getNamedRanges();
  Logger.log(imen.length);
  var name = '';
  for (let i = 0; i < imen.length; i++) {
    name = imen[i].getName();
    Logger.log(name);
    Logger.log(imen[i].getRange().getA1Notation());
  }
  
  // var range = sheet.getRange(1, 2);
  // var mergedRanges = range.getMergedRanges();
  // for (var i = 0; i < mergedRanges.length; i++) {
  //   Logger.log(mergedRanges[i].getA1Notation());
  //   // Logger.log(mergedRanges[i].getDisplayValue());
  // }
  // var fieldsBorders = 'sheets(data(rowData/values/userEnteredFormat/borders))'
  // var currSsId = SpreadsheetApp.getActiveSpreadsheet().getId();
  // var activeSheet = SpreadsheetApp.getActiveSheet();
  // // var name = activeSheet.getName();

  // var data = Sheets.Spreadsheets.get(currSsId, {
  //     ranges: ["A20"],
  //     fields: fieldsBorders
  // });
  // Logger.log('A20 - ' + data);
  // var data = Sheets.Spreadsheets.get(currSsId, {
  //     ranges: ["B25"],
  //     fields: fieldsBorders
  // });
  // Logger.log('B25 - ' + data);
  // var data = Sheets.Spreadsheets.get(currSsId, {
  //     ranges: ["A26"],
  //     fields: fieldsBorders
  // });
  // Logger.log('A26 - ' + data);
};

function getNamedRanges() {
  var namedRanges = {};
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var imen = sheet.getNamedRanges();
  for (let i = 0; i < imen.length; i++) {
    namedRanges[imen[i].getName()] = imen[i].getRange().getA1Notation();
  }
  return namedRanges;
};

function getTypeCell(cellNameA1) {
  var cellName = cellNameA1.toLowerCase();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getRange(cellName);
  var formatCell = range.getNumberFormat();
  if (FORMAT_NUMBER.includes(formatCell)) {
    var format = `minFD=${formatCell.split('.')[formatCell.split('.').length - 1].length}`;
    return {type: 'number', format: format};
  }
  if (FORMAT_DATE_STRING.includes(formatCell)) {
    var [ day, month, year ] = formatCell.replace(/ /g,'.').replace(/"/g,'').split('.');
    var format = `d=${FORMAT_DATE[day]}$m=${FORMAT_DATE[month]}$y=${FORMAT_DATE[year]}`;
    return { type: 'date', format: format };
  };
  return null;
};

function getBordersCell() {
  var fieldsBorders = 'sheets(data(rowData/values/userEnteredFormat/borders))'
  var currSsId = SpreadsheetApp.getActiveSpreadsheet().getId();
  var activeSheet = SpreadsheetApp.getActiveSheet();
  var name = activeSheet.getName();

  var data = Sheets.Spreadsheets.get(currSsId, {
      ranges: name,
      fields: fieldsBorders
  });
  var dataRowArray = data.sheets[0].data[0].rowData;
  var dataBordersArray = [];
  dataRowArray.forEach(item => {
    dataBordersArray.push(item.values);
  });
  return dataBordersArray;
};

function getBorderCell(borders, cellNameA1, borderCellTop, borderCellLeft) {
  var cellRow = +cellNameA1.replace(/[A-z]/g, '');
  var cellColumn = cellNameA1.replace(/[0-9]/g, '');
  var styleCell = {
    list: {},
  };
  var dataBorder = borders.userEnteredFormat.borders;
  var colorBorder = {};
  
  // if top cell
  if (cellRow === 1) {
    if (dataBorder.top) {
      colorBorder = dataBorder.top.colorStyle.rgbColor;
      styleCell.list.borderTop
        = `${dataBorder.top.width}px ` +
        `${dataBorder.top.style.split('_')[0].toLowerCase()} ` +
        `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
    }
  }
  // if left cell
  if (cellColumn === 'A') {
    if (dataBorder.left) {
      colorBorder = dataBorder.left.colorStyle.rgbColor;
      styleCell.list.borderLeft
        = `${dataBorder.left.width}px ` +
        `${dataBorder.left.style.split('_')[0].toLowerCase()} ` +
        `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
    }
  }

  // border left & bottom  
  if (dataBorder.bottom) {
    colorBorder = dataBorder.bottom.colorStyle.rgbColor;
    styleCell.list.borderBottom
      = `${dataBorder.bottom.width}px ` +
        `${dataBorder.bottom.style.split('_')[0].toLowerCase()} ` +
        `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
  }
  if (dataBorder.right) {
    colorBorder = dataBorder.right.colorStyle.rgbColor;
    styleCell.list.borderRight
      = `${dataBorder.right.width}px ` +
        `${dataBorder.right.style.split('_')[0].toLowerCase()} ` +
        `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
  }

  if (dataBorder.top) {
    colorBorder = dataBorder.top.colorStyle.rgbColor;
    // Logger.log(cellNameA1 + ' - ' + borderCellTop);
    if (!borderCellTop) {
      styleCell.list.borderTop
        = `${dataBorder.top.width}px ` +
          `${dataBorder.top.style.split('_')[0].toLowerCase()} ` +
          `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
    } else {
      if (!Object.keys(borderCellTop).length) {
        styleCell.list.borderTop
            = `${dataBorder.top.width}px ` +
              `${dataBorder.top.style.split('_')[0].toLowerCase()} ` +
              `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
      } else {
        if (!borderCellTop.userEnteredFormat && !borderCellTop.userEnteredFormat.borders.bottom) {
          styleCell.list.borderTop
            = `${dataBorder.top.width}px ` +
              `${dataBorder.top.style.split('_')[0].toLowerCase()} ` +
              `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
        }
      }
    }
  }

  if (dataBorder.left) {
    colorBorder = dataBorder.left.colorStyle.rgbColor;
    // Logger.log(cellNameA1 + ' - ' + borderCellLeft);
    if (!borderCellLeft) {
      styleCell.list.borderLeft
        = `${dataBorder.left.width}px ` +
          `${dataBorder.left.style.split('_')[0].toLowerCase()} ` +
          `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
    } else {
      if (!Object.keys(borderCellLeft).length) {
        styleCell.list.borderLeft
          = `${dataBorder.left.width}px ` +
            `${dataBorder.left.style.split('_')[0].toLowerCase()} ` +
            `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
      } else {
        if (!borderCellLeft.userEnteredFormat && !borderCellLeft.userEnteredFormat.borders.right) {
          styleCell.list.borderLeft
            = `${dataBorder.left.width}px ` +
              `${dataBorder.left.style.split('_')[0].toLowerCase()} ` +
              `rgba(${(colorBorder.red || 0) * 100}%, ${(colorBorder.green || 0) * 100}%, ${(colorBorder.blue || 0) * 100}%)`;
        }
      }
    }
  }
  return styleCell.list;
};

function getStylesCell(cellNameA1, borderCell, borderCellTop, borderCellLeft) {
  var styleCell = {
    name: cellNameA1.toLowerCase(),
    list: {},
  };
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getRange(styleCell.name);

  // if (borderCell && borderCell.userEnteredFormat) {
  //   // Logger.log(borderCell);
  //   styleCell.list = getBorderCell(borderCell, cellNameA1, borderCellTop, borderCellLeft);
  // };
  if (range.getFontFamily() && !FONT_FAMILY.includes(range.getFontFamily())) styleCell.list.fontFamily = `'${range.getFontFamily()}', sans-serif`;
  if (range.getFontWeight() && range.getFontWeight() != FONT_WEIGHT) styleCell.list.fontWeight = range.getFontWeight();
  if (range.getFontStyle() && range.getFontStyle() != FONT_STYLE) styleCell.list.fontStyle = range.getFontStyle();
  if (range.getFontSize() && range.getFontSize() != FONT_SIZE) styleCell.list.fontSize = `${range.getFontSize()}pt`;
  if (range.getFontColor() && range.getFontColor() != FONT_COLOR) styleCell.list.color = range.getFontColor();

  if (range.getHorizontalAlignment() && range.getHorizontalAlignment() != ALIGNMENT_H.defaultValue()) {
    styleCell.list.textAlign = range.getHorizontalAlignment();
    styleCell.list.justifyContent = ALIGNMENT_H[range.getHorizontalAlignment()];
  }
  if (range.getVerticalAlignment() && range.getVerticalAlignment() != ALIGNMENT_V.defaultValue()) styleCell.list.alignItems = ALIGNMENT_V[range.getVerticalAlignment()];
  
  if (range.getWrap() == true && range.getWrapStrategy() == 'WRAP') { styleCell.list.wordWrap = 'break-word'; styleCell.list.whiteSpace = 'unset'; }; 

  // if (range.getTextRotation().getDegrees() == 90) { styleCell.list.writingMode = 'tb-rl'; styleCell.list.transform = 'rotate(180deg)'; };
  if (range.getTextRotation().getDegrees() == 90) {
    styleCell.list.writingMode = 'vertical-rl';
    styleCell.list.transform = 'rotate(180deg)';
    var tbBottom = '';
    // var tbTop = '';
    var tbRight = '';
    // var tbLeft = '';
    if (styleCell.list.borderBottom) { tbBottom = styleCell.list.borderBottom; delete styleCell.list.borderBottom; }
    if (styleCell.list.borderRight) { tbRight = styleCell.list.borderRight; delete styleCell.list.borderRight; }
    if (styleCell.list.borderTop) { styleCell.list.borderBottom = styleCell.list.borderTop; }
    if (styleCell.list.borderLeft) { styleCell.list.borderRight = styleCell.list.borderLeft; }
    if (tbBottom != '') styleCell.list.borderTop = tbBottom;
    if (tbRight != '') styleCell.list.borderLeft = tbRight;
  };

  if (Object.keys(styleCell.list).length) return styleCell;
  return null;
};

function exportJSON() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();
  Logger.log(sheet.getMaxColumns());
  Logger.log(sheet.getMaxRows());
  var objectToJSON = {
    rows: {},
    columns: {},
    cells: {},
    styles: [],
    namedRanges: {},
  };
  // rowsFixed
  for (var i = 0; i < sheet.getFrozenRows(); i++) {
    objectToJSON.rows[i + 1] = {height: sheet.getRowHeight(i + 1), fixed: true};
  }
  // rows, rowsGroup
  for (var i = sheet.getFrozenRows(); i < values.length; i++) {
    objectToJSON.rows[i + 1] = {height: sheet.getRowHeight(i + 1)};
    if (sheet.getRowGroupDepth(i + 1) > 0) {
      var rowParent = sheet.getRowGroup(i + 1, sheet.getRowGroupDepth(i + 1)).getControlIndex();
      if (!objectToJSON.rows[rowParent].rowGroup) objectToJSON.rows[rowParent].rowGroup = 1;
      objectToJSON.rows[rowParent].rowGroup += 1;
      objectToJSON.rows[i + 1].parent = sheet.getRowGroup(i + 1, sheet.getRowGroupDepth(i + 1)).getControlIndex();
    }
  }

  // columnsFixed
  for (var i = 0; i < sheet.getFrozenColumns(); i++) {
    objectToJSON.columns[getColumnNameForNumber(i + 1)] = {width: sheet.getColumnWidth(i + 1), fixed: true};
  }
  // column, columnGroup
  for (var i = sheet.getFrozenColumns(); i < values[0].length; i++) {
    objectToJSON.columns[getColumnNameForNumber(i + 1)] = {width: sheet.getColumnWidth(i + 1)};
    if (sheet.getColumnGroupDepth(i + 1) > 0) {
      var columnParent = sheet.getColumnGroup(i + 1, sheet.getColumnGroupDepth(i + 1)).getControlIndex();
      var columnName = getColumnNameForNumber(columnParent);
      if (!objectToJSON.columns[columnName].columnGroup) objectToJSON.columns[columnName].columnGroup = 1;
      objectToJSON.columns[columnName].columnGroup += 1;
      objectToJSON.columns[getColumnNameForNumber(i + 1)].parent = getColumnNameForNumber(sheet.getColumnGroup(i + 1, sheet.getColumnGroupDepth(i + 1)).getControlIndex());
    }
  }
  // get all borders
  var bordersCells = getBordersCell();
  // Logger.log(bordersCells);
  // cells, styles
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      var cellName = range.getCell(i + 1, j + 1).getA1Notation();
      var cellNameTop = null;
      var borderCellTop = null;
      var cellNameLeft = null;
      var borderCellLeft = null;
      if (i > 0) {
        cellNameTop = (range.getCell(i, j + 1).getMergedRanges().length) ? range.getCell(i, j + 1).getMergedRanges()[0].getA1Notation().split(":")[0] : range.getCell(i, j + 1).getA1Notation();
        var cellNameTopRow = +cellNameTop.replace(/[A-z]/g, '');
        var cellNameTopColumn = +getColumnNumberForName(cellNameTop.replace(/[0-9]/g, '').toLowerCase());
        borderCellTop = (bordersCells[cellNameTopRow - 1]) ? bordersCells[cellNameTopRow - 1][cellNameTopColumn - 1] : null;
      }
      if (j > 0) {
        cellNameLeft = (range.getCell(i + 1, j).getMergedRanges().length) ? range.getCell(i + 1, j).getMergedRanges()[0].getA1Notation().split(":")[0] : range.getCell(i + 1, j).getA1Notation();
        var cellNameLeftRow = +cellNameLeft.replace(/[A-z]/g, '');
        var cellNameLeftColumn = +getColumnNumberForName(cellNameLeft.replace(/[0-9]/g, '').toLowerCase());
        borderCellLeft = (bordersCells[cellNameLeftRow - 1]) ? bordersCells[cellNameLeftRow - 1][cellNameLeftColumn - 1] : null;
      }

      var styleCell = getStylesCell(
        cellName,
        (bordersCells[i]) ? bordersCells[i][j] : null,
        borderCellTop,
        borderCellLeft);
      var typeCell = getTypeCell(cellName);
      if (values[i][j] != "" || styleCell || typeCell) objectToJSON.cells[cellName.toLowerCase()] = {value: values[i][j]};
      if (styleCell) {
        objectToJSON.cells[cellName.toLowerCase()].style = cellName.toLowerCase();
        objectToJSON.styles.push(styleCell);
      }
      if (typeCell)  {
        if (typeCell.type) {
          objectToJSON.cells[cellName.toLowerCase()].type = typeCell.type;
          if (typeCell.type === 'date' && values[i][j] != "") {
            let dateNow = new Date(values[i][j]);
            let dd = (+dateNow.getDate() < 10) ? '0' + dateNow.getDate() : dateNow.getDate();
            let mm = (+dateNow.getMonth() < 9) ? '0' + (+dateNow.getMonth() + 1) : +dateNow.getMonth() + 1;
            let yyyy = dateNow.getFullYear();
            objectToJSON.cells[cellName.toLowerCase()].value = yyyy + '-' + mm + '-' + dd;
          //   Logger.log(values[i][j]);
          //   objectToJSON.cells[cellName.toLowerCase()].value = values[i][j].split('.').reverse().join('-');
          }
        }
        if (typeCell.format) objectToJSON.cells[cellName.toLowerCase()].formatString = typeCell.format;
        // objectToJSON.cells[cellName.toLowerCase()].type = typeCell;
      }

      if (bordersCells[i] && bordersCells[i][j].userEnteredFormat) {
        // Logger.log(borderCell);
        styleCell.list = get(bordersCells[i][j], cellNameA1, borderCellTop, borderCellLeft);
      };

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
  var cellsMerge = range.getMergedRanges();
  for (var i = 0; i < cellsMerge.length; i++) {
    var [cellNameStart, cellNameEnd] = cellsMerge[i].getA1Notation().split(':');
    var cellNameStartRow = +cellNameStart.replace(/[A-z]/g, '');
    var cellNameStartColumn = +getColumnNumberForName(cellNameStart.replace(/[0-9]/g, '').toLowerCase());

    var cellNameEndRow = +cellNameEnd.replace(/[A-z]/g, '');
    var cellNameEndColumn = +getColumnNumberForName(cellNameEnd.replace(/[0-9]/g, '').toLowerCase());

    if (((cellNameEndRow - cellNameStartRow) > 0 || (cellNameEndColumn - cellNameStartColumn) > 0)
      && !objectToJSON.cells[cellNameStart.toLowerCase()]) objectToJSON.cells[cellNameStart.toLowerCase()] = {};
    if ((cellNameEndRow - cellNameStartRow) > 0) objectToJSON.cells[cellNameStart.toLowerCase()].rowspan = (cellNameEndRow - cellNameStartRow) + 1;
    if ((cellNameEndColumn - cellNameStartColumn) > 0) objectToJSON.cells[cellNameStart.toLowerCase()].colspan = (cellNameEndColumn - cellNameStartColumn) + 1;
  }

  // getNamedRanges
  objectToJSON.namedRanges = getNamedRanges();
  displayText_(buildJson(objectToJSON));
};

function displayText_(text) {
  var output = HtmlService.createHtmlOutput("<textarea style='width:100%;' rows='20'>" + text + "</textarea>");
  output.setWidth(1000)
  output.setHeight(500);
  SpreadsheetApp.getUi()
      .showModalDialog(output, 'Exported JSON');
};

function buildJson(object) {
  return Utilities.jsonStringify(object);
};

function getFormatOptionDate(formatString) {
  const [ day, month, year ] = formatString.split('.');
  return {
    day: FORMAT_DATE[day],
    month: FORMAT_DATE[month],
    year: FORMAT_DATE[year],
  }
};

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
};

function getColumnNumberForName(columnName) {
  if (columnName.length === 1) return SET_COLUMN_NAME.findIndex((item) => item === columnName) + 1;
  const indexFirst = SET_COLUMN_NAME.findIndex((item) => item === columnName[0]) + 1;
  const indexSecond = SET_COLUMN_NAME.findIndex((item) => item === columnName[1]) + 1;
  return (indexFirst * SET_COLUMN_NAME.length) + indexSecond;
};

