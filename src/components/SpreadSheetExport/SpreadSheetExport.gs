
const SET_COLUMN_NAME = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
    {name: "Export sheet JSON", functionName: "exportJSON"},
    {name: "Export sheet JSON Range", functionName: "openDialog"},
  ];
  ss.addMenu("Export JSON", menuEntries);

}

function openDialog(e) {
  var fieldsBorders = 'sheets(data(rowData/values/userEnteredFormat/borders))'

  var currSsId = SpreadsheetApp.getActiveSpreadsheet().getId();
  // var activeSheet = SpreadsheetApp.getActiveSheet();
  // var name = activeSheet.getName();

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getRange("D5");

  var data = Sheets.Spreadsheets.get(currSsId, {
      ranges: ["D8"],
      fields: fieldsBorders
  });

  Logger.log(data);

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
    cellsMerge: [],
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

  // cells
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      if (values[i][j] != "") objectToJSON.cells[`${getColumnNameForNumber(j + 1)}${i + 1}`] = {value: values[i][j]};
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

    if ((cellNameEndRow - cellNameStartRow) > 0) objectToJSON.cells[cellNameStart.toLowerCase()].rowspan = (cellNameEndRow - cellNameStartRow) + 1;
    if ((cellNameEndColumn - cellNameStartColumn) > 0) objectToJSON.cells[cellNameStart.toLowerCase()].colspan = (cellNameEndColumn - cellNameStartColumn) + 1;
  }

  // var fieldsBorders = 'sheets(data(rowData/values/userEnteredFormat/borders))'

  // var currSsId = SpreadsheetApp.getActiveSpreadsheet().getId();
  // var activeSheet = SpreadsheetApp.getActiveSheet();
  // var name = activeSheet.getName();

  displayText_(buildJson(objectToJSON));
};

function displayText_(text) {
  var output = HtmlService.createHtmlOutput("<textarea style='width:100%;' rows='20'>" + text + "</textarea>");
  output.setWidth(600)
  output.setHeight(500);
  SpreadsheetApp.getUi()
      .showModalDialog(output, 'Exported JSON');
};

function buildJson(object) {
  return Utilities.jsonStringify(object);
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

