function formattedDataDisplay(
  value,
  {
    valueType = 'string',
    formatString = null,
    valuePrefix = '',
    valueSuffix = '',
  } = {},
) {
  let formattedValue = '';
  const formatStringArray = (formatString) ? formatString.split('#') : [];
  const TYPES = {
    string: () => value,
    number: () => {
      const formattedOption = {};
      // const numberFormatString = {
      //   // '+0.0': () => (value > 0) ? '+' : '',
      //   '0,00': function() { formattedOption.minimumFractionDigits = 2 },
      // };

      const formatted = new Intl.NumberFormat('ru', formattedOption);
      const newValue = (formatStringArray.includes('+0,0')) ? `/+${formatted.format(value).toString()}` : formatted.format(value);
      // console.log(formatStringArray.includes('+0,0'));
      // const newValue = formatted.format(value);
      return newValue;
    },
    date: () => value.split('-').reverse().join('.'),
  };
  formattedValue = TYPES[valueType]();
  // console.log(valueType, formatString);
  return `${valuePrefix}${formattedValue}${valueSuffix}`;
}

export default formattedDataDisplay;
