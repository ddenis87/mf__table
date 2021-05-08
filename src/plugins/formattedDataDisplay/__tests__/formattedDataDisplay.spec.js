import formattedDataDisplay from '@/plugins/formattedDataDisplay/formattedDataDisplay';

describe('FormattedDataDisplay', () => {
  describe('Type String (default)', () => {
    it('Value  - text -> text', () => expect(formattedDataDisplay('text')).toBe('text'));
    it('Prefix - text -> ~text', () => expect(formattedDataDisplay('text', { valuePrefix: '~' })).toBe('~text'));
    it('Suffix - text -> text*', () => expect(formattedDataDisplay('text', { valueSuffix: '*' })).toBe('text*'));
  })
  describe('Type Number', () => {
    const type = { valueType: 'number' };
    const prefix = { valuePrefix: '~' };
    const suffix = { valueSuffix: '*' };

    it('Value       -  35  -> 35', () => expect(formattedDataDisplay('35', { ...type })).toBe('35'));
    it('Value minus -  -35 -> -35', () => expect(formattedDataDisplay('-35', { ...type })).toBe('-35'));
    it('Value ""    -  ""  -> 0', () => expect(formattedDataDisplay('', { ...type })).toBe('0'));
    it('Prefix      -  35  -> ~35', () => expect(formattedDataDisplay('35', { ...type, ...prefix })).toBe('~35'));
    it('Suffix      -  35  -> 35*', () => expect(formattedDataDisplay('35', { ...type, ...suffix })).toBe('35*'));
    it('Separator   -  3.5 -> 3,5', () => expect(formattedDataDisplay('3.14', { ...type })).toBe('3,14'));
  });
  describe('Type Number, format string:', () => {
    const type = { valueType: 'number' };
    const formatString_1 = { formatString: 'positive=true' };
    const formatString_2 = { formatString: 'positive=true$minFD=2' };
    const formatString_3 = { formatString: 'type=currency$currency=RUB' };
    const formatString_4 = { formatString: 'type=currency$currency=RUB$currencyView=code' };
    const formatString_5 = { formatString: 'minFD=2' };
    it('Format string: "positive=true"                                - 35   -> +35', () => expect(formattedDataDisplay('35', { ...type, ...formatString_1 })).toBe('+35'));
    it('Format string: "positive=true$minFD=2"                        - 35   -> +35,00', () => expect(formattedDataDisplay('35', { ...type, ...formatString_2 })).toBe('+35,00'));
    it('Format string: "positive=true$minFD=2"                        - 3500 -> +3 500,00', () => expect(formattedDataDisplay('3500', { ...type, ...formatString_2 })).toBe(`+3\xa0500,00`));
    it('Format string: "type=currency$currency=RUB"                   - 35   -> 35,00 ₽', () => expect(formattedDataDisplay('35', { ...type, ...formatString_3 })).toBe('35,00\xa0₽'));
    it('Format string: "type=currency$currency=RUB$currencyView=code" - 35   -> 35,00 RUB', () => expect(formattedDataDisplay('35', { ...type, ...formatString_4 })).toBe('35,00\xa0RUB'));
    
    // it('Format string: 35 -> 35,00 ₽', () => expect(formattedDataDisplay('35', { ...type, ...formatString_3 })).toBe('35,00 RUB'));
    
  });
  describe('Type Date', () => {
    const type = { valueType: 'date' };
    it('Value 1 - 12.05.2021', () => expect(formattedDataDisplay('12.05.2021', { ...type })).toBe('12.05.2021'));
    it('Value 2 - 2021-05-12', () => expect(formattedDataDisplay('2021-05-12', { ...type })).toBe('12.05.2021'));
  });
  describe('Type Date, format string:', () => {

  })
});