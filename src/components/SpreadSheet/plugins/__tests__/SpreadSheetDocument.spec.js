import { createNewDocument, getAreasFromTemplate, getParametersFromArea } from '../SpreadSheetDocument';
import str from '../SpreadSheetDocumentData';

describe('Create new document', () => {
  const returnDocument = {
    rowCount: 1000,
    rows: {},
    columnCount: 26,
    columns: {},
    cells: {},
    styles: [],
    cellWidth: 94,
    cellHeight: 22,
  };
  const options = {
    rowCount: 100,
    columnCount: 10,
    cellWidth: 90,
    cellHeight: 20,
  };
  const returnDocumentOptions = {
    rowCount: 100,
    rows: {},
    columnCount: 10,
    columns: {},
    cells: {},
    styles: [],
    cellWidth: 90,
    cellHeight: 20,
  };
  it('Create new document without parametrs', () => expect(createNewDocument()).toStrictEqual(returnDocument));
  it('Create new document with parametrs', () => expect(createNewDocument(options)).toStrictEqual(returnDocumentOptions));
});

describe('Get areas and parametres from template', () => {
  const template = {
    namedRanges: [
      {name:"row2",range:"6:6"},
      {name:"row2Volume21",range:"E6"},
      {name:"row3",range:"7:7"},
      {name:"row3Volume21",range:"E7"},
      {name:"row3Volume23",range:"G7"},
      {name:"row2IndicatorName",range:"B6:C6"},
      {name:"row3Volume22",range:"F7"},
      {name:"row1",range:"5:5"},
      {name:"row3AnalyticalCode",range:"D7"},
      {name:"row1AnalyticalCode",range:"D5"},
      {name:"row2AnalyticalCode",range:"D6"},
      {name:"row2Volume22",range:"F6"},
      {name:"row3IndicatorName",range:"C7"},
      {name:"row1Volume22",range:"F5"},
      {name:"row2Volume23",range:"G6"},
      {name:"row1IndicatorName",range:"A5:C5"},
      {name:"row1Volume21",range:"E5"},
      {name:"row1Volume23",range:"G5"}
    ]
  };
  const returnAreas = [
    {name:"row2",range:"6:6", parameters: [{name:"row2Volume21",range:"E6"}, {name:"row2IndicatorName",range:"B6:C6"}, {name:"row2AnalyticalCode",range:"D6"}, {name:"row2Volume22",range:"F6"}, {name:"row2Volume23",range:"G6"}]},
    {name:"row3",range:"7:7", parameters: [{name:"row3Volume21",range:"E7"}, {name:"row3Volume23",range:"G7"}, {name:"row3Volume22",range:"F7"}, {name:"row3AnalyticalCode",range:"D7"}, {name:"row3IndicatorName",range:"C7"}]},
    {name:"row1", range:"5:5", parameters: [
      {name:"row1AnalyticalCode", range:"D5"},
      {name:"row1Volume22", range:"F5"},
      {name:"row1IndicatorName", range:"A5:C5"},
      {name:"row1Volume21", range:"E5"},
      {name:"row1Volume23", range:"G5"}
    ]},
  ];
  const returnParameters = [
    {name:"row1AnalyticalCode", range:"D5"},
    {name:"row1Volume22", range:"F5"},
    {name:"row1IndicatorName", range:"A5:C5"},
    {name:"row1Volume21", range:"E5"},
    {name:"row1Volume23", range:"G5"}
  ];
  it('Get areas from template', () => expect(getAreasFromTemplate(JSON.stringify(template))).toStrictEqual(returnAreas));
  it('Get parameters from area', () => expect(getParametersFromArea(getAreasFromTemplate(JSON.stringify(template)), 'row1')).toStrictEqual(returnParameters));
})