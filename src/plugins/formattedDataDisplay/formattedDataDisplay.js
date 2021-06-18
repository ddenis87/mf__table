function formattedDataDisplay(
  value,
  {
    valueType = 'string',
    formatString = '',
    valuePrefix = '',
    valueSuffix = '',
  } = {},
) {
  let formattedValue = '';
  const FORMAT_STRING_MAP = {};
  formatString.split('$').forEach((item) => {
    const [itemKey, itemValue] = item.split('=');
    if (itemValue) FORMAT_STRING_MAP[itemKey] = itemValue;
  });
  const FORMAT_STRING_MAP_KEYS = Object.keys(FORMAT_STRING_MAP);
  const TYPES = {
    string: () => {
      if (value === undefined) return '';
      const newValue = `${value}`.replace(/\n/g, '<br/>');
      return newValue;
    },
    number: () => {
      let fValue = value;
      if (fValue === undefined) fValue = 0;
      const formattedOption = {};
      const formattedOptionKey = {
        type: 'style',
        minFD: 'minimumFractionDigits',
        currency: 'currency',
        currencyView: 'currencyDisplay',
        group: 'useGrouping',
      };
      Object.entries(FORMAT_STRING_MAP).forEach((item) => {
        const [itemKey, itemValue] = item;
        if (Object.keys(formattedOptionKey).includes(itemKey)) {
          let newItemValue = itemValue;
          if (itemValue === 'false') newItemValue = false;
          formattedOption[formattedOptionKey[itemKey]] = newItemValue;
        }
      });
      const formatted = new Intl.NumberFormat('ru-RU', formattedOption);
      let newValue = formatted.format(fValue);
      if (FORMAT_STRING_MAP_KEYS.includes('positive')
        && FORMAT_STRING_MAP.positive === 'true'
        && fValue > 0) newValue = `+${newValue}`;
      if (FORMAT_STRING_MAP_KEYS.includes('color')) {
        newValue = `<span style="color: ${(fValue < 0) ? 'red' : 'green'}">${newValue}</span>`;
      }
      return newValue;
    },
    date: () => {
      if (!value) return '';
      const prepareValue = value.split('.').reverse().join('-');
      const formattedOption = {};
      const formattedOptionKey = {
        d: 'day',
        m: 'month',
        y: 'year',
      };
      Object.entries(FORMAT_STRING_MAP).forEach((item) => {
        const [itemKey, itemValue] = item;
        if (Object.keys(formattedOptionKey).includes(itemKey)) {
          formattedOption[formattedOptionKey[itemKey]] = itemValue;
        }
      });
      const formatted = new Intl.DateTimeFormat('ru-RU', formattedOption);
      const newValue = formatted.format(new Date(prepareValue));
      return newValue;
    },
    boolean: () => {
      let valueTrue = 'Да';
      let valueFalse = 'Нет';
      if (FORMAT_STRING_MAP_KEYS.includes('true')) valueTrue = FORMAT_STRING_MAP.true;
      if (FORMAT_STRING_MAP_KEYS.includes('false')) valueFalse = FORMAT_STRING_MAP.false;
      let newValue = valueFalse;
      if (value === true || value === 1) newValue = valueTrue;
      return newValue;
    },
  };
  formattedValue = (TYPES[valueType]) ? TYPES[valueType]() : value;
  return `${valuePrefix}${formattedValue}${valueSuffix}`;
}

export default formattedDataDisplay;
