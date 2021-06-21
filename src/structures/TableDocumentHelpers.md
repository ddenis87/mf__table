## TableDocumentHelpers
---
### Regular
|#|Name|Value|
|-|----|-----|
|1|REG_SYMBOLS|/[A-Z]/gi
|2|REG_DIGITS|/[0-9]/g

### Enums
|#|Name|Vaues|
|-|----|-----|
||RANGE_TYPE|CELL, RANGE, COLUMN, ROW
||SHIFT_TYPE|VERTICAL, HORIZONTAL

### Function
|#|Name|Parameters|Default|Return|
|-|----|----------|-------|------|
||getColumnNameForNumber|||
|||number: Number||String: 'columnName'
||getColumnNumberForName|||
|||name: String||Number: 'columnNumber'
||getParseAtSymbolDigit|||
|||str: String||Object: { parthSymbol, parthDigit }|
||getRangeLength
|||range: String <br>isCompute: Boolean|<br>false|isCompute = false: Array <br>isCompute = true: Number
||getRangeShift||||
|||range: String <br>shiftType: SHIFT_TYPE <br>step: Number| <br>VERTICAL <br>1 | String: 'rangeShift'
||getRangeSplit
|||range: String ||Array: [rangeFrom, rangeTo]
||getRangeType
|||range: String||RANGE_TYPE

#### [Tests](https://git.digitatl.ru/DDenis87/mf__table/-/blob/main/src/structures/__tests__/TableDocumentHelpers.spec.js)

**When use:**  
<small>[class TableDocument](https://git.digitatl.ru/DDenis87/mf__table/-/blob/main/src/structures/TableDocument.js)</small>
---

