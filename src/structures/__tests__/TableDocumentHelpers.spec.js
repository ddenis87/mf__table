import { getRangeType, getRangeSplit, getRangeLength, getRangeShift } from "../TableDocumentHelpers";

describe('TableDocumentHelpers', () => {
  describe('getRangeType', () => {
    it('"a1"    ->  cell', () => expect(getRangeType('a1')).toBe('cell'));
    it('"b"     ->  column', () => expect(getRangeType('b')).toBe('column'));
    it('"3"     ->  row', () => expect(getRangeType('3')).toBe('row'));
    it('"2:5"   ->  row', () => expect(getRangeType('2:5')).toBe('row'));
    it('"d:e"   ->  column', () => expect(getRangeType('d:e')).toBe('column'));
    it('"a1:d3" ->  range', () => expect(getRangeType('a1:d3')).toBe('range'));
  });

  describe('getRangeSplit', () => {
    it('"a1"    -> ["a1":"a1"]', () => expect(getRangeSplit('a1')).toEqual(['a1','a1']));
    it('"3"     -> ["3":"3"]', () => expect(getRangeSplit('3')).toEqual(['3','3']));
    it('"2:5"   -> ["2":"5"]', () => expect(getRangeSplit('2:5')).toEqual(['2','5']));
    it('"a1:d3" -> ["a1":"d3"]', () => expect(getRangeSplit('a1:d3')).toEqual(['a1','d3']));
  });

  describe('getRangeLength', () => {
    describe('isCompute = false', () => {
      it('"a1"    -> [1:1]', () => expect(getRangeLength('a1')).toEqual([1,1]));
      it('"b"     -> [1:0]', () => expect(getRangeLength('b')).toEqual([1,0]));
      it('"b:d"   -> [3:0]', () => expect(getRangeLength('b:d')).toEqual([3,0]));
      it('"3:6"   -> [0:4]', () => expect(getRangeLength('3:6')).toEqual([0,4]));
      it('"a1:d3" -> [4:3]', () => expect(getRangeLength('a1:d3')).toEqual([4,3]));
    });
    describe('isCompute = true', () => {
      it('"a1"    -> 1', () => expect(getRangeLength('a1', true)).toBe(1));
      it('"b"     -> 1', () => expect(getRangeLength('b', true)).toBe(1));
      it('"b:d"   -> 3', () => expect(getRangeLength('b:d', true)).toBe(3));
      it('"3:6"   -> 4', () => expect(getRangeLength('3:6', true)).toBe(4));
      it('"a3:d6" -> NaN', () => expect(getRangeLength('a3:d6', true)).toBe(NaN));
    });
  });

  describe('getRangeShift', () => {
    describe('shiftType = SHIFT_TYPE.VERTICAL, step = 1', () => {
      it('"2"     -> "3"', () => expect(getRangeShift('2')).toBe('3'));
      it('"2:5"   -> "3:6"', () => expect(getRangeShift('2:5')).toBe('3:6'));
      it('"b"     -> "c"', () => expect(getRangeShift('b')).toBe('c'));
      it('"a:c"   -> "b:d"', () => expect(getRangeShift('a:c')).toBe('b:d'));
      it('"a1"    -> "a2"', () => expect(getRangeShift('a1')).toBe('a2'));
      it('"a1:c1" -> "a2:c2"', () => expect(getRangeShift('a1:c1')).toBe('a2:c2'));
    });
    describe('shiftType = SHIFT_TYPE.HORIZONTAL, step = 1', () => {
      it('"a1"    -> "b1"', () => expect(getRangeShift('a1', 'horizontal')).toBe('b1'));
      it('"a1:c1" -> "b1:d1"', () => expect(getRangeShift('a1:c1', 'horizontal')).toBe('b1:d1'));
    });
  });
})
