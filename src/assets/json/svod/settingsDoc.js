const settings = [
  {
    header: {                             // ключ в файле данных
      templateSectionName:'title|header', // section in template
      baseSection:'header',               // serializationDataSection -- base section
      methodName:'put',                   // method insert
      presentationType:'unit',            // serializationDataSection -- base section array (multiple) or object (unit)
      parameters: {                       // parameters
        headerName: 'hName'
      },
      nestedData: ['year']                // deserializeArea|serializationDataSection -- nested sections
    }
  },
  {
    year: {
      templateSectionName:'column|header',
      baseSection:'column',               // serializationDataSection -- base section
      methodName:'join',
      nested:'header',                    // serializationDataSection -- nested in base section
      presentationType:'multiple',
      parameters: {
        columnYear:'columnYear'
      }
    }
  },
  {
    string: {
      templateSectionName: 'title|string',
      baseSection: 'string',
      methodName: 'put',
      presentationType: 'multiple',
      parameters: {
        stringTitleIndicator: 'stringTitleIndicator'
      },
      nestedData: ['columns']
    }
  },
  {
    columns: {
      templateSectionName: 'column|string',
      baseSection: 'column',
      methodName: 'join',
      nested: 'string',
      presentationType: 'multiple',
      parameters: {
        indicator: 'indicator'
      }
    }
  }
]