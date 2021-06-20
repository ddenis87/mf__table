import { getRangeType, getRangeSplit, getRangeLength } from "../TableDocumentHelpers";

describe('TableDocumentHelpers', () => {
  describe('getRangeType', () => {
    it('getRangeType: "a1"    ->  cell', () => expect(getRangeType('a1')).toBe('cell'));
    it('getRangeType: "b"     ->  column', () => expect(getRangeType('b')).toBe('column'));
    it('getRangeType: "3"     ->  row', () => expect(getRangeType('3')).toBe('row'));
    it('getRangeType: "2:5"   ->  row', () => expect(getRangeType('2:5')).toBe('row'));
    it('getRangeType: "d:e"   ->  column', () => expect(getRangeType('d:e')).toBe('column'));
    it('getRangeType: "a1:d3" ->  range', () => expect(getRangeType('a1:d3')).toBe('range'));
  });

  describe('getRangeSplit', () => {
    it('getRangeSplit: "a1"    -> ["a1":"a1"]', () => expect(getRangeSplit('a1')).toEqual(['a1','a1']));
    it('getRangeSplit: "3"     -> ["3":"3"]', () => expect(getRangeSplit('3')).toEqual(['3','3']));
    it('getRangeSplit: "2:5"   -> ["2":"5"]', () => expect(getRangeSplit('2:5')).toEqual(['2','5']));
    it('getRangeSplit: "a1:d3" -> ["a1":"d3"]', () => expect(getRangeSplit('a1:d3')).toEqual(['a1','d3']));
  });

  describe('getRangeLength', () => {
    describe('isCompute = false', () => {
      it('getRangeLength: "a1"    -> [1:1]', () => expect(getRangeLength('a1')).toEqual([1,1]));
      it('getRangeLength: "b"     -> [1:0]', () => expect(getRangeLength('b')).toEqual([1,0]));
      it('getRangeLength: "b:d"   -> [3:0]', () => expect(getRangeLength('b:d')).toEqual([3,0]));
      it('getRangeLength: "3:6"   -> [0:4]', () => expect(getRangeLength('3:6')).toEqual([0,4]));
      it('getRangeLength: "a1:d3" -> [4:3]', () => expect(getRangeLength('a1:d3')).toEqual([4,3]));
    });
    describe('isCompute = true', () => {
      it('getRangeLength: "a1"    -> 1', () => expect(getRangeLength('a1', true)).toEqual(1));
      it('getRangeLength: "b"     -> 1', () => expect(getRangeLength('b', true)).toEqual(1));
      it('getRangeLength: "b:d"   -> 3', () => expect(getRangeLength('b:d', true)).toEqual(3));
      it('getRangeLength: "3:6"   -> 4', () => expect(getRangeLength('3:6', true)).toEqual(4));
    });
  });
})
