## TableDocument (Class)
------------

### Static function

| Function | Parameters type | Return type | Description |
| -------- | ----------------| ----------- | ----------- |
| getOperandsSetFormula(formula) | string | array |
| getColumnNumberForName(name) | string | number (1...) |
| getColumnNameForNumber(number) | number | string (a...) |
| getObjectOfJSON(data) | string JSON format or object | object |
| getParseNameSymbolDigit(str) | string | object - { parthSymbol, parthDigit } |

### Methods

| Methods | Parameters type | Return type | Description |
| ------- | --------------- | ----------- | ----------- |
|
| getCellByName(cellName) | string (a1) | object |
| getCellParameter(cellName, parameterCell) | string, string | parameter type |