import formattedDataDisplay from '@/plugins/formattedDataDisplay/formattedDataDisplay';

describe('FormattedDataDisplay', () => {
  describe('Type String (default)', () => {
    it('Value', () => expect(formattedDataDisplay('Format')).toBe('Format'));
    it('Prefix', () => expect(formattedDataDisplay('Format', { valuePrefix: '$' })).toBe('$Format'));
    it('Suffix', () => expect(formattedDataDisplay('Format', { valueSuffix: '$' })).toBe('Format$'));
  })
  describe('Type Number', () => {
    const type = { valueType: 'number' };
    const prefix = { valuePrefix: '~' };
    const suffix = { valueSuffix: '*' };

    it('Value       -  35', () => expect(formattedDataDisplay('35', { ...type })).toBe('35'));
    it('Value minus - -35', () => expect(formattedDataDisplay('-35', { ...type })).toBe('-35'));
    it('Value ""    -  ""  -> 0', () => expect(formattedDataDisplay('', { ...type })).toBe('0'));
    it('Prefix      -  35  -> ~35', () => expect(formattedDataDisplay('35', { ...type, ...prefix })).toBe('~35'));
    it('Suffix      -  35  -> 35*', () => expect(formattedDataDisplay('35', { ...type, ...suffix })).toBe('35*'));
    it('Separator   -  3.5 -> 3,5', () => expect(formattedDataDisplay('3.14', { ...type })).toBe('3,14'));
  });
  describe('Type Number, format string:', () => {
    const type = { valueType: 'number' };
    it('Format string: "+0,0"', expect(formattedDataDisplay('35', { ...type, formatString: '+0,0' })).toBe('+35'));
  });
  describe('Type Date', () => {
    const type = { valueType: 'date' };
    it('Value 1 - 12.05.2021', () => expect(formattedDataDisplay('12.05.2021', { ...type })).toBe('12.05.2021'));
    it('Value 2 - 2021-05-12', () => expect(formattedDataDisplay('2021-05-12', { ...type })).toBe('12.05.2021'));
  });
  describe('Type Date, format string:', () => {

  })
});