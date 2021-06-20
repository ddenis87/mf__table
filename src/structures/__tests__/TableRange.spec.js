import { getRangeType } from "../TableRange";

describe('Table range', () => {
  it('getRangeType', () => expect(getRangeType('a1')).toBe('cell'));
})
