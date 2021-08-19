import {
  getColumnNameForNumber,
  getColumnNumberForName,
  getParseAtSymbolDigit,
} from '../../helpers/spreadSheet';

const REG_OPERATORS = /[+-/*)(%: ]/g;
// const REG_OPERANDS = /\w+\d+/g;
const FUNCTION_FORMULA = {
  SUM: 'calculateSum', // sum
  SUMGROUP: 'calculateSumGroup', // sum
};

class Formulas {
  constructor(formula = '', cellName = '') {
    this.cellName = cellName;
    this.formula = formula;
    this.translateFormula = formula;
  }

  cellName = '';

  formula = '';

  operands = [];

  operandsFunction = {};

  translateFormula = '';

  hasOperandsInclude(operand) {
    return (this.formula.includes(`$${operand}`));
  }

  highlightOperands() {
    console.log(this.formula.slice(1).replace(REG_OPERATORS, '$').split('$'));

    // this.operands = this.formula.replace(REG_OPERATORS, '').split('$').splice(1);
    this.operands = this.formula.slice(1).replace(REG_OPERATORS, '$').split('$');
    // console.log(...this.operands);
  }

  matchOperands(functionName = 'this.getCellValueForFormula') {
    this.operands.forEach((operand) => {
      // console.log(operand);
      if (+operand) this.operandsFunction[operand] = operand;
      else this.operandsFunction[operand] = `${functionName}('${operand}')`;
    });
    // console.log(this.operandsFunction);
  }

  moveFormula(cellNameCurrent, cellNameTemplate) {
    this.highlightOperands();
    const { parthSymbol: currentColumn, parthDigit: currentRow } = getParseAtSymbolDigit(cellNameCurrent);
    const { parthSymbol: templateColumn, parthDigit: templateRow } = getParseAtSymbolDigit(cellNameTemplate);
    const deltaColumn = getColumnNumberForName(currentColumn) - getColumnNumberForName(templateColumn);
    const deltaRow = currentRow - templateRow;
    const operandsShift = new Map();
    // console.log(cellNameCurrent, cellNameTemplate);
    // console.log(this.operands);
    this.operands.forEach((operand) => {
      if (+operand) {
        operandsShift.set(operand, operand);
        return;
      }
      const { parthSymbol: operandColumn, parthDigit: operandRow } = getParseAtSymbolDigit(operand);
      const shiftColumn = getColumnNumberForName(operandColumn) + deltaColumn;
      const shiftRow = operandRow + deltaRow;
      operandsShift.set(operand, `${getColumnNameForNumber(shiftColumn)}${shiftRow}`);
    });
    // console.log(operandsShift);
    operandsShift.forEach((value, key) => {
      // const [key, value] = shiftOperand;
      // console.log(key, value);
      this.formula = this.formula.replace(key, value);
    });
    // this.operands = operandsShift;
    // console.log(this.formula);
    return this.formula;
  }

  translateFormulaForCalculation() {
    Object.entries(this.operandsFunction).forEach((element) => {
      const [operand, operandValue] = element;
      this.translateFormula = this.translateFormula.replace(`$${operand}`, operandValue);
    });
    // console.log(this.translateFormula);
  }

  getFormulaForCalculation() {
    if (this.formula.includes('SUM')) {
      let [functionName, functionParameters] = this.formula.slice(1, -1).split('(');
      functionName = (functionParameters.split(':').length === 1) ? `${functionName}` : functionName;
      functionParameters = functionParameters.toLowerCase();
      console.log(functionName);
      return `this.${FUNCTION_FORMULA[functionName]}('${functionParameters}','${this.cellName}')`;
    }
    // if (this.formula.includes('=')) {
    //   this.formula = this.formula.replace('=', '');
    // }
    this.highlightOperands();
    this.matchOperands();
    this.translateFormulaForCalculation();
    // console.log(this.translateFormula);
    return this.translateFormula.replace('=', '');
  }

  // returnFormulaFunction() {
  //   const [functionName, functionParameters] = this.formula.slice(1, -1).split('(');
  //   // console.log(functionName, functionParameters);
  //   return `this.${FUNCTION_FORMULA[functionName]}('${functionParameters}','${this.cellName}')`;
  // }
}

export default Formulas;
