function getCellFormula(cellName) {
  return this.cells[cellName].formula || null;
}

class TableFormula {
  constructor(formula = '') {
    this.formula = formula;
  }

  compute() {
    const operandsSet = this.getOperandsSet;

  }

  getCellFormula(cellName) {
    return this.cells[cellName].formula || null;
  }
  
  getCellParameter(cellName, parametarCell) {
    return this.cells[cellName][parametarCell] || null;
  }

  getOperandsSet() {
    return this.formula.replace(/[+-/*)(% ]/g, '').split('$').splice(1);
  }
  
}

export default TableFormula;
