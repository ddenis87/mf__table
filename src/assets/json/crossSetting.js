const JSONSetting = {
  header: {
    templateSectionName: 'title|header',
    methodName: 'put',
    parameters: {
      headerName: 'headerName',
    },
  },
  year: {
    templateSectionName: 'column|header',
    methodName: 'join',
    parameters: {
      columnYear: 'columnYear',
    },
  },
  string: {
    templateSectionName: 'title|string',
    methodName: 'put',
    parameters: {
      stringTitleIndicator: 'stringTitleIndicator',
    },
  },
  columns: {
    templateSectionName: 'column|string',
    methodName: 'join',
    parameters: {
      indicator: 'indicator',
    },
  },
};

export default JSONSetting;
