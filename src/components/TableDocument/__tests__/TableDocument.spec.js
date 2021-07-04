import TableDocument from "../TableDocument";
import rowTemplateV3 from '@/assets/json/rowTemplateV3.json';

describe('Class TableDocument', () => {
  const tableDocument = new TableDocument({ JSONString: rowTemplateV3 });
  console.log(tableDocument);
  describe('Range function', () => {
    describe('getRange(cellName)', () => {
      it('c3', () => expect(tableDocument.getRange('c3')).toBe('3'));
    });
  })
})