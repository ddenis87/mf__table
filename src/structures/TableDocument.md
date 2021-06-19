## TableDocument (Class)
------------
### Properties
| # | Name | Type | Default | Description |
| - | ---- | ---- | ------- | ----------- |
| 1 | template | Boolean | false | ? isTemplate
| 2 | methodName | String | null |
| 3 | rows | Object | {} |
| 4 | rowCount | Number | ROW_COUNT |
| 5 | columns | Object | {} |
| 6 | columnCount | Number | COLUMNS_COUNT |
| 7 | cells | Object | {} |
| 8 | styles | Object | [] |
| 9 | scripts | Object | {} |
| 10 | namedAreas | Object | [] |
| 11 | cellWidth | Number | CELL_WIDTH |
| 12 | cellHeight | Number | CELL_HEIGHT |
| ? | documentTemplate | TableDocument | null |
| ? | documentSetting | TableDocument | null |

### Static function

| # | Function | Parameters type | Return type | Description |
| - | -------- | ----------------| ----------- | ----------- |
| 1 | fillingFormula(operandsValues, formula) | Object, String| String |
| 2 | getColumnNameForNumber(number) | Number | String (a...) |
| 3 | getColumnNumberForName(name) | String | Number (1...) |
| 4 | getParseAtSymbolDigit(str) | String | Object - { parthSymbol, parthDigit } |
| 5 | getCellNameShift(cellName, rangeCells, shiftColumn = 1, shiftRow = 1) | | |
| 6 | getObjectOfJSON(data) | String JSON format or Object | Object |
| 7 | getOperandsSet(formula) | String | String |
| 8 | getOperandsValues(operandsSet) | Array | Object |
| 9 | parseCellName(cellName) | String | Object - { cellColumn, cellRow } | del ?
| 10 | getRangeType(range) | String | String |
| 11 | getRangeSize(range) | String | Array |
| 12 | getRangeOfCellArea(cells) | Array or Object | Array |
| 13 | getRangeLength(range) | Array or String | Number |

### Methods

| Methods | Parameters type | Return type | Description |
| ------- | --------------- | ----------- | ----------- |
| buildDocument(data, template, settings) |
| calculateCellValue(cellName) | Scring | Number |
| executeAction(cellName) | String | - |
| getCellByName(cellName) | String (a1) | object |
| getCellParameter(cellName, parameterCell) | string, string | parameter type |
| getScript(scriptName) | String | String |

#