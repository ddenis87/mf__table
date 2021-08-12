## TableDocument (Class)
------------
#### Description
This class is intended for creating and working with the tabular section of the document.  

**This class usage a next helpers:**  
* <small>[TableDocumentHelpers.md](https://git.digitatl.ru/DDenis87/mf__table/-/blob/main/src/structures/TableDocumentHelpers.md)</small>
* <small>[TableDocumentHelpers.js](https://git.digitatl.ru/DDenis87/mf__table/-/blob/main/src/structures/TableDocumentHelpers.js)</small>
### Properties

| # | Name | Type | Default | Description |
| - | ---- | ---- | ------- | ----------- |
| | editAccess | undefined,
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
| |    version | String | null
|| JSONString | String | null
---

### Methods

|#|Name|Parameters|Default|Return|Note|
|-|----|----------|-------|------|----|
||actionCell|
|||cellName
||addArea|
|||cellName: String <br>areaName: String <br>shiftType: SHIFT_TYPE| <br> <br>VERTICAL||
||buildDocument|
|||data: JSON, Object <br>template: JSON, Object <br>setting: JSON, Object 
|?|calculateCellValue|
|||cellName: String || Number
|?|calculateSUM
|||
||deleteArea
|||range: String <br>shiftType: SHIFT_TYPE| <br>null
||deleteRange
|||range: String <br>deleteMode: DELETE_MODE| <br>null||*If mode is set, it also removes row or column, otherwise removes only cells.*
||deserialize
|||
||deserializeArea
|||
||editingCell
|||
||executeAction
|||cellName: String 
||fillArea
|||dataArea <br>parameters
||getAreaCopy
|||||TableDocument
||getAreaForRange
|||||TableDocument
||getAreaHeight
|||
||getAreaRange
|||
||getAreaValue
|||
||getAreaWidth
|||
||getCell
|||cellName:  String||Object
||getCellParameter
|||cellName: String <br>cellParameter: String ||Value parameter
||getCellStyles
|||cellName: String || Object
||getCellType
|||
||getCellValueForFormula
|||
||getCellsInRange|
|||range: String <br>returnFormat: RETURN_FORMAT ||Object, Array
||getColumn
|||
||getColumnKeysInRange|
|||range: String || Array
||getColumnType
|||
||getDocument|
|||JSONFormat|false|JSON, Object
|?|getFormularsCellsSet||||getCellKeysWithFormulars
||getLastColumn
||||Number
||getLastColumnInRow
|||numberRow: Number|||Number
||getLastRow
||||Number
||getListNamedAreasForRange
|||
||getNamedArea
|||
||getNamedAreas
|||
||getRangeByAreaName
|||areaName: String ||String
||getRangeByCellName|
|||cellName: String <br>areaName: String <br>rangeType: RANGE_TYPE | <br>null <br>ROW| String
||getRangeToEdge|
|||rangeFrom: String ||String
||getRow
|||
||getRowType
|||
||getRowKeysInRange|
|||range: String || Array
||getSectionSettings
|||
||getScripts
|||
||getStyles
|||
||hasEditing
|||
||hasEditingCell
|||
||hasEditingSheet
|||
||hasNamedArea
|||
||insertArea
|||
||updateCell
|||
||updateColumn
|||
||updateNamedArea
|||
||updateRow
|||
||updateStyles
|||
||setRowGroup
|||
||setColumnGroup
|||
||joinArea
|||
||putArea
|||
||recalculateFormulas
|||
||serializationDataSection
|||
||setTableDocumentTemplate
|||
||setTableDocumentSettings
|||
||validateCellValue
|||

---
---
---