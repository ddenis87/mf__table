const FORMATE_NUMBER_KEY = {
  type: 'style',
  minFD: 'minimumFractionDigits',
  currency: 'currency',
  currencyView: 'currencyDisplay',
  group: 'useGrouping',
};

const FORMATE_DATE_KEY = {
  d: 'day',
  m: 'month',
  y: 'year',
};

export default {
  formate(
    value,
    {
      type = 'string',
      formatString = null,
      // prefix: null,
      // suffix: null,
      representations = new Map(),
    },
  ) {
    if ([null, undefined].includes(value)) return null;
    const FUNCTION_TYPE = {
      string: (v) => this.formatString(v),
      number: (v, f) => this.formatNumber(v, f),
      date: (v, f) => this.formatDate(v, f),
      boolean: (v) => v,
      field: (v, f, r) => r.get(v) || '<#ССЫЛКА>',
      choice: (v) => v,
    };
    const typeClear = type.split('.')[0];
    const formatMap = (formatString) ? new Map(formatString.split('$').map((item) => item.split('='))) : new Map();
    // console.log(representation);
    return FUNCTION_TYPE[typeClear](value, formatMap, representations);
  },

  formatString(value) {
    return value.toString().replace(/\n/g, '<br/>');
  },

  formatNumber(value, formatMap) {
    if (value === 0) return value;
    if (!+value) return NaN;
    if (!formatMap.size) return value;
    const formatOptions = {};
    formatMap.forEach((keyValue, key) => {
      if (FORMATE_NUMBER_KEY[key]) formatOptions[FORMATE_NUMBER_KEY[key]] = keyValue;
    });
    const formatFunction = new Intl.NumberFormat('ru-RU', formatOptions);
    let formatValue = formatFunction.format(value);
    if (formatMap.has('positive') && value > 0) formatValue = `+${formatValue}`;
    if (formatMap.has('color')) {
      formatValue = `<span style="color: ${(value < 0) ? 'red' : 'green'}">${formatValue}</span>`;
    }
    return formatValue;
  },

  formatDate(value, formatMap) {
    if (new Date(value).toString() === 'Invalid Date') return null;
    const formatOptions = {};
    formatMap.forEach((keyValue, key) => {
      if (FORMATE_DATE_KEY[key]) formatOptions[FORMATE_DATE_KEY[key]] = keyValue;
    });
    const formatFunction = new Intl.DateTimeFormat('ru-RU', formatOptions);
    const formatValue = formatFunction.format(new Date(value));
    return formatValue;
  },

  formatBoolean(value, formatMap) {
    let formatValue = value;
    if (formatMap.has(value)) formatValue = formatMap.get(value);
    return formatValue;
  },
};
