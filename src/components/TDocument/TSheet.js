import TCell from './TCell';

class TSheet {
  constructor(options = {}) {
    Object.entries(options).forEach((property) => {
      const [propertyName, propertyValue] = property;
      this[propertyName] = propertyValue;
    });

    Object.entries(this.cells).forEach((cell) => {
      const [cellName, cellValue] = cell;
      this.cells[cellName] = new TCell(cellValue);
    });
  }
}

export default TSheet;
