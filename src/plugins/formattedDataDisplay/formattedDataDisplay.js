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
  // console.log(FORMAT_STRING_MAP);
  const TYPES = {
    string: () => value,
    number: () => {
      const formattedOption = {};
      const formattedOptionKey = {
        type: 'style',
        minFD: 'minimumFractionDigits',
        currency: 'currency',
        currencyView: 'currencyDisplay',
      };
      Object.entries(FORMAT_STRING_MAP).forEach((item) => {
        const [itemKey, itemValue] = item;
        if (Object.keys(formattedOptionKey).includes(itemKey)) {
          formattedOption[formattedOptionKey[itemKey]] = itemValue;
        }
      });
      const formatted = new Intl.NumberFormat('ru', formattedOption);
      let newValue = formatted.format(value);
      if (FORMAT_STRING_MAP_KEYS.includes('positive')
        && FORMAT_STRING_MAP.positive === 'true'
        && value > 0) newValue = `+${newValue}`;
      if (FORMAT_STRING_MAP_KEYS.includes('color')) {
        newValue = `<span style="color: ${(value < 0) ? 'red' : 'green'}">${newValue}</span>`;
      }
      return newValue;
    },
    date: () => value.split('-').reverse().join('.'),
  };
  formattedValue = TYPES[valueType]();
  // if (Object.keys(FORMAT_STRING_MAP).includes('positive')
  //   && FORMAT_STRING_MAP['positive'] === 'true') formattedValue = `+${formattedValue}`;
  return `${valuePrefix}${formattedValue}${valueSuffix}`;
}

export default formattedDataDisplay;
