import formattedDataDisplay from '@/plugins/formattedDataDisplay/formattedDataDisplay';

describe('FormattedDataDisplay', () => {
  describe('Type String (default)', () => {
    it('Value     - text -> text', () => expect(formattedDataDisplay('text')).toBe('text'));
    it('Prefix    - text -> ~text', () => expect(formattedDataDisplay('text', { valuePrefix: '~' })).toBe('~text'));
    it('Suffix    - text -> text*', () => expect(formattedDataDisplay('text', { valueSuffix: '*' })).toBe('text*'));
  })
  describe('Type Number', () => {
    const type = { valueType: 'number' };
    const prefix = { valuePrefix: '~' };
    const suffix = { valueSuffix: '*' };
    it('Value 1   - 35  -> 35', () => expect(formattedDataDisplay('35', { ...type })).toBe('35'));
    it('Value 2   - -35 -> -35', () => expect(formattedDataDisplay('-35', { ...type })).toBe('-35'));
    it('Value 3   - ""  -> 0', () => expect(formattedDataDisplay('', { ...type })).toBe('0'));
    it('Separator - 3.5 -> 3,5', () => expect(formattedDataDisplay('3.14', { ...type })).toBe('3,14'));

    describe('Format string:', () => {
      const formatString_1 = { formatString: 'positive=true' };
      const formatString_2 = { formatString: 'positive=true$minFD=2' };
      const formatString_3 = { formatString: 'group=false' };
      const formatString_4 = { formatString: 'type=currency$currency=RUB' };
      const formatString_5 = { formatString: 'type=currency$currency=RUB$currencyView=code' };
      it('"positive=true"                                - 35   -> +35', () => expect(formattedDataDisplay('35', { ...type, ...formatString_1 })).toBe('+35'));
      it('"positive=true$minFD=2"                        - 35   -> +35,00', () => expect(formattedDataDisplay(35, { ...type, ...formatString_2 })).toBe('+35,00'));
      it('"positive=true$minFD=2"                        - 3500 -> +3 500,00', () => expect(formattedDataDisplay('3500', { ...type, ...formatString_2 })).toBe(`+3\xa0500,00`));
      it('"group=false"                                  - 3500 -> 3500', () => expect(formattedDataDisplay('3500', { ...type, ...formatString_3 })).toBe(`3500`));
      it('"type=currency$currency=RUB"                   - 35   -> 35,00 ₽', () => expect(formattedDataDisplay('35', { ...type, ...formatString_4 })).toBe('35,00\xa0₽'));
      it('"type=currency$currency=RUB$currencyView=code" - 35   -> 35,00 RUB', () => expect(formattedDataDisplay('35', { ...type, ...formatString_5 })).toBe('35,00\xa0RUB'));    
    });
  });
  
  describe('Type Date', () => {
    const type = { valueType: 'date' };
    it('Value 1   - 12.04.2021 -> 12.04.2021', () => expect(formattedDataDisplay('12.04.2021', { ...type })).toBe('12.04.2021'));
    it('Value 2   - 2021-04-12 -> 12.04.2021', () => expect(formattedDataDisplay('2021-04-12', { ...type })).toBe('12.04.2021'));
    describe('Format string:', () => {
      const formatString_1 = { formatString: 'd=2-digit$m=short$y=numeric' };
      const formatString_2 = { formatString: 'd=2-digit$m=long' };
      const formatString_3 = { formatString: 'd=numeric$m=numeric$y=2-digit' };
      it('"d=2-digit$m=short$y=numeric"                  - 12.04.2021 -> 12 апр. 2021 г.', () => expect(formattedDataDisplay('2021-04-12', { ...type, ...formatString_1 })).toBe('12 апр. 2021 г.'));
      it('"d=2-digit$m=long"                             - 12.04.2021 -> 12 апреля', () => expect(formattedDataDisplay('2021-04-12', { ...type, ...formatString_2 })).toBe('12 апреля'));
      it('"d=numeric$m=numeric$y=2-digit"                - 01.04.2021 -> 01.04.21', () => expect(formattedDataDisplay('2021-04-01', { ...type, ...formatString_3 })).toBe('01.04.21'));
    });
  });
  describe('Type Boolean', () => {
    const type = { valueType: 'boolean' };
    it('Value 1   - true  -> Да', () => expect(formattedDataDisplay(true, { ...type })).toBe('Да'));
    it('Value 2   - false -> Нет', () => expect(formattedDataDisplay(false, { ...type })).toBe('Нет'));
    it('Value 3   - 1 -> Да', () => expect(formattedDataDisplay(1, { ...type })).toBe('Да'));
    it('Value 4   - 0 -> Нет', () => expect(formattedDataDisplay(0, { ...type })).toBe('Нет'));
    describe('Format string:', () => {
      const formatString_1 = { formatString: 'true=Так точно$false=Отнюдь' };
      it('"true=Так точно$false=Отнюдь"                  - true  -> Так точно', () => expect(formattedDataDisplay(true, { ...type, ...formatString_1 })).toBe('Так точно'));
      it('"true=Так точно$false=Отнюдь"                  - false -> Отнюдь', () => expect(formattedDataDisplay(false, { ...type, ...formatString_1 })).toBe('Отнюдь'));
    });
  });
});