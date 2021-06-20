## TableDocument (Class)
------------
### Properties

| # | Name | Type | Default | Description |
| - | ---- | ---- | ------- | ----------- |
| 1 | cellHeight | Number | CELL_HEIGHT |
| 2 | cells | Object | {} |
| 3 | cellWidth | Number | CELL_WIDTH |
| 4 | columnCount | Number | 26 |
| 5 | columns | Object | {} |
| 6 | documentSetting | TableDocument | null |
| 7 | documentTemplate | TableDocument | null |
| 8 | methodName | String | null | ? methodInsert
| 9 | namedAreas | Object | [] |
| 10 | rowCount | Number | 1000 |
| 11 | rows | Object | {} |
| 12 | scripts | Object | {} |
| 13 | styles | Object | [] |
| 14 | template | Boolean | false | ? isTemplate
---

### Methods Range(s)

|#|Function| |Name|Type|Value|Note|
|-|--------|-|----|----|-----|----|
|1|**deleteRange** |||||*If mode is set, it also removes row or column, otherwise removes only cells.*
|||**Parameters:**
||||range|String|'a1', 'b', '3', '2:5', 'd:e', 'a1:d3'
||||mode|CONST|DELETE_MODE.ROW <br>DELETE_MODE.COLUMN, <br>null (default)
||||
|2|**getRangeByAreaName**
|||**Return:**
|||||String|'2:2', '3:5', 'b:e', 'a1:d3'
|||**Parameters:**
||||areaName|String|any
|
|3|**getRangeByCellName**
|||**Return:**
|||||String|'a1', '3', 'c', '3:5', 'b:e', 'a1:d3'
|||**Parameters:**
||||cellName|String|any
||||areaName|String|any <br>null (default)
||||rangeType|CONST|RANGE_TYPE.ROW (default) <br>RANGE_TYPE.COLUMN <br>RANGE_TYPE.CELL
|
|4|**getRangeSplit** *(Helper)*
|||**Return:**
|||||Array|['2', '5'], ['b', 'b'], ['c3', 'd5']
|||**Parameters:**
||||range|String|'a1', 'b', '3', '2:5', 'd:e', 'a1:d3'
|
|5|**getRangeType** *(Helper)*
|||**Return:**
|||||CONST|RANGE_TYPE.CELL <br>RANGE_TYPE.ROW <br>RANGE_TYPE.COLUMN <br>RANGE_TYPE.RANGE
|||**Parameters:**
||||range|String|'a1', 'b', '3', '2:5', 'd:e', 'a1:d3'
|
|6|**getRangeLength** *(Helper)*
|||**Return:**
|||||Array|[0, 1], [1, 1], [1, 5]
|||||Number
|||**Parameters:**
||||range|String|'a1', 'b', '3', '2:5', 'd:e', 'a1:d3'
||||isCompute|Boolean| false (default), true
|
|7|**getRangeToEdge**
|||**Return:**
|||||String|'${rangeFrom}:maxRow', <br>'${rangeFrom}:maxColumn', <br>'${rangeFrom}:maxColumnRow)'
|||**Parameters:**
||||rangeFrom|String|any
|
|8|**getRangeShift** *(Helper)*
|||**Return:**
|||||String|2, '3:5', 'a2:d5', 'b1:e4'
|||**Parameters:**
||||range|String|1, '2:4', 'a1:d4', 'a1:d4'
||||shift|CONST|SHIFT_TYPE.VERTICAL (default) <br>SHIFT_TYPE.HORIZONTAL
||||step = 1|Number

---
---
---
### Methods Area(s)
| # | Methods | Parameters | Return type | Description |
| - | ------- | --------------- | ----------- | ----------- |
||deleteArea
|| fillArea | 1.dataArea - String  <br>2.parameters - String | - | - |
|| getAreaCopy
|| getAreaForRange(range)
|| getNamedArea(areaName)
|| insertArea(numberColumn, numberRow, area, shift = null)
|| joinArea(dataArea, area, parameters)
|| putArea(dataArea, area, parameters)
---
### Methods Cell(s)
| # | Methods | Parameters type | Return type | Description |
| - | ------- | --------------- | ----------- | ----------- |
| 1 | calculateCellValue(cellName) | String | Number ||
| 2 | executeCellAction(cellName) | String | - | |
| 3 | getCell(cellName) | String | Object |
| 4 | getCellValue(cellName) | | |
| 5 | getCellParameter(cellName, cellParameter) | string, string | parameter type |
| 6 | getCellStyles(cellName) | String | Object |
| 7 | getCellsInRange(range, returnFormat = RETURN_FORMAT.ENTRIES) | String  <br>('a1', 'b', '2:5', 'd:e', 'a1:d3') ||

### V

| # | Methods | Parameters type | Return type | Description |
| - | ------- | --------------- | ----------- | ----------- |
|  | buildDocument(data, template, settings) | | | |
|  | getDocument(JSONFormat = false) |||
|  | getFormularsCellsSet() |||
|  | getLastColumn() | - | Number |
|  | getLastColumnInRow(numberRow) | - | Number |
|  | getLastRow() | - | Number |
|  | getScript(scriptName) | String | String |
|  | recalculateFormulas() | - | - |

### Helper function

| # | Function | Parameters | Return type | Description |
| - | -------- | ----------------| ----------- | ----------- |
| 1 | fillingFormula(operandsValues, formula) | Object, String| String |
| 2 | getColumnNameForNumber(number) | Number | String (a...) |Y
| 3 | getColumnNumberForName(name) | String | Number (1...) |Y
| 4 | getParseAtSymbolDigit(str) | String | Object - { parthSymbol, parthDigit } |Y
| 5 | getCellNameShift(cellName, rangeCells, shiftColumn = 1, shiftRow = 1) | | |
| 6 | getObjectOfJSON(data) | String JSON format or Object | Object |
| 7 | getOperandsSet(formula) | String | String |
| 8 | getOperandsValues(operandsSet) | Array | Object |
