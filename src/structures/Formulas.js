const REG_OPERATORS = /[+-/*)(% ]/g;

const FUNCTION_FORMULA = {
  SUM: 'calculateSUM',
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
    this.operands = this.formula.replace(REG_OPERATORS, '').split('$').splice(1);
  }

  matchOperands(functionName = 'this.getCellValueForFormula') {
    this.operands.forEach((operand) => {
      this.operandsFunction[operand] = `${functionName}('${operand}')`;
    });
  }

  translateFormulaForCalculation() {
    Object.entries(this.operandsFunction).forEach((element) => {
      const [operand, operandValue] = element;
      this.translateFormula = this.translateFormula.replace(`$${operand}`, operandValue);
    });
  }

  getFormulaForCalculation() {
    if (this.formula[0] === '=') {
      const [functionName, functionParameters] = this.formula.slice(1, -1).split('(');
      return `this.${FUNCTION_FORMULA[functionName]}('${functionParameters}','${this.cellName}')`;
    }
    this.highlightOperands();
    this.matchOperands();
    this.translateFormulaForCalculation();
    return this.translateFormula;
  }
}

export default Formulas;
