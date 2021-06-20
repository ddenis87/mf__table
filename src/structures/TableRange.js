function getRangeType(range) {
  const [v1, v2] = `${range}`.toLowerCase().split(':');
  if (!v2) {
    if (!v1.match(REG_DIGITS)) return 'column';
    if (!v1.match(REG_SYMBOLS)) return 'row';
    return 'cell';
  }
  if (+v1 && +v2) return 'row';
  if (v1.match(REG_DIGITS) && v1.match(REG_SYMBOLS)
    && v2.match(REG_DIGITS) && v2.match(REG_SYMBOLS)) return 'range';
  if (getColumnNumberForName(v1) && getColumnNumberForName(v2)) return 'column';
  return undefined;
};

//   getRangeOfCellArea: (cells) => {
//     const cellsEntries = (Array.isArray(cells)) ? cells : Object.entries(cells);
//     const rows = [];
//     const columns = [];
//     cellsEntries.forEach((cell) => {
//       const [cellName] = cell;
//       const { cellColumn, cellRow } = parseCellName(cellName);
//       rows.push(cellRow);
//       columns.push(getColumnNumberForName(cellColumn));
//     });
//     return [[Math.min(...rows), Math.max(...rows)], [Math.min(...columns), Math.max(...columns)]];
//   },
  
//   getRangeSplit: (range) => {
//     let splitRange = range.toString();
//     if (splitRange.includes(':')) splitRange = splitRange.split(':');
//     else splitRange = [splitRange, splitRange];
//     return splitRange;
//   },
  
//   getRangeLength: (range, isCompute = false) => {
//     const rangeType = getRangeType(range);
//     let [r1, r2] = getRangeSplit(range);
//     if (!r2 && [RANGE_TYPE.COLUMN, RANGE_TYPE.ROW].includes(rangeType)) r2 = r1;
//     const rangeLength = {
//       [RANGE_TYPE.CELL]: () => [1, 1],
//       [RANGE_TYPE.ROW]: () => [0, (+r2 - +r1) + 1],
//       [RANGE_TYPE.COLUMN]: () => {
//         r1 = getColumnNumberForName(r1);
//         r2 = getColumnNumberForName(r2);
//         return [(+r2 - +r1) + 1, 0];
//       },
//       [RANGE_TYPE.RANGE]: () => {
//         const { parthSymbol: columnFrom, parthDigit: rowFrom } = getParseAtSymbolDigit(r1);
//         const { parthSymbol: columnTo, parthDigit: rowTo } = getParseAtSymbolDigit(r2);
//         return [
//           (+getColumnNumberForName(columnTo) - +getColumnNumberForName(columnFrom)) + 1,
//           (+rowTo - +rowFrom) + 1,
//         ];
//       },
//     };
//     const rezult = rangeLength[rangeType]();
//     return (isCompute) ? rezult[1] - rezult[0] : rezult;
//   },

//   getRangeShift: (range, shiftType = SHIFT_TYPE.VERTICAL, step = 1) => {
//     const [, rangeTo] = getRangeSplit(range);
//     const { parthSymbol, parthDigit } = getParseAtSymbolDigit(rangeTo);
//     const rangeShift = {
//       [SHIFT_TYPE.VERTICAL]: () => `${parthSymbol}${parthDigit + step}`,
//       // [SHIFT_TYPE.HORIZONTAL]: () => `${rangeFrom}:${getColumnNameForNumber(+getColumnNumberForName(parthSymbol) + step)}${parthDigit}`,
//     };
//     console.log(rangeShift[shiftType]);
//     return rangeShift[shiftType]();
//   },
// };
export default getRangeType;
