import display from '@/plugins/formattingView/formattingView';

describe('formattingView', () => {
  describe('Value', () => {
    it('Value null', () => expect(display.formate(null)).toBe(''));
  });
  describe('Type String (default)', () => {
    it('Value      - text -> text', () => expect(display.formate('text')).toBe('text'));
    it('Prefix     - text -> ~text', () => expect(display.formate('text', { prefix: '~' })).toBe('~text'));
    it('Suffix     - text -> text*', () => expect(display.formate('text', { suffix: '*' })).toBe('text*'));
    it('Line break - Hello \n world -> Hello <br/> world', () => expect(display.formate('Hello \n world')).toBe('Hello <br/> world'));
  });
  describe('Type Number', () => {
    const type = { type: 'number' };
    it('Value 0   - ""  -> ""', () => expect(display.formate('', { ...type })).toBe(''));
    it('Value 1   - 35  -> 35', () => expect(display.formate('35', { ...type })).toBe('35'));
    it('Value 2   - -35 -> -35', () => expect(display.formate('-35', { ...type })).toBe('-35'));
    // it('Value 3   - ""  -> 0', () => expect(display.formate('', { ...type })).toBe('0'));
    it('Separator - 3.5 -> 3,5', () => expect(display.formate('3.14', { ...type })).toBe('3,14'));

    describe('Format string:', () => {
      const formatString_1 = { formatString: 'positive=true' };
      const formatString_2 = { formatString: 'positive=true$minFD=2' };
      const formatString_3 = { formatString: 'group=false' };
      const formatString_4 = { formatString: 'type=currency$currency=RUB' };
      const formatString_5 = { formatString: 'type=currency$currency=RUB$currencyView=code' };
      const formatString_6 = { formatString: 'color=true' };
      it('"positive=true"                                - 35   -> +35', () => expect(display.formate('35', { ...type, ...formatString_1 })).toBe('+35'));
      it('"positive=true$minFD=2"                        - 35   -> +35,00', () => expect(display.formate(35, { ...type, ...formatString_2 })).toBe('+35,00'));
      it('"positive=true$minFD=2"                        - 3500 -> +3 500,00', () => expect(display.formate('3500', { ...type, ...formatString_2 })).toBe('+3\xa0500,00'));
      it('"group=false"                                  - 3500 -> 3500', () => expect(display.formate('3500', { ...type, ...formatString_3 })).toBe('3500'));
      it('"type=currency$currency=RUB"                   - 35   -> 35,00 ₽', () => expect(display.formate('35', { ...type, ...formatString_4 })).toBe('35,00\xa0₽'));
      it('"type=currency$currency=RUB$currencyView=code" - 35   -> 35,00 RUB', () => expect(display.formate('35', { ...type, ...formatString_5 })).toBe('35,00\xa0RUB'));
      it('"color=true" positive                          - 35   -> <span style="color: green">35</span>', () => expect(display.formate('35', { ...type, ...formatString_6 })).toBe('<span style="color: green">35</span>'));
      it('"color=true" minus                             - -35   -> <span style="color: red">-35</span>', () => expect(display.formate('-35', { ...type, ...formatString_6 })).toBe('<span style="color: red">-35</span>'));
    });
  });
  
  // describe('Type Date', () => {
  //   const type = { valueType: 'date' };
  //   it('Value 1   - 12.04.2021 -> 12.04.2021', () => expect(formattingView('12.04.2021', { ...type })).toBe('12.04.2021'));
  //   it('Value 2   - 2021-04-12 -> 12.04.2021', () => expect(formattingView('2021-04-12', { ...type })).toBe('12.04.2021'));
  //   it('Value 3   - hello      -> hello', () => expect(formattingView('hello', { ...type })).toBe('hello'));
  //   describe('Format string:', () => {
  //     const formatString_1 = { formatString: 'd=2-digit$m=short$y=numeric' };
  //     const formatString_2 = { formatString: 'd=2-digit$m=long' };
  //     const formatString_3 = { formatString: 'd=numeric$m=numeric$y=2-digit' };
  //     it('"d=2-digit$m=short$y=numeric"                  - 12.04.2021 -> 12 апр. 2021 г.', () => expect(formattingView('2021-04-12', { ...type, ...formatString_1 })).toBe('12 апр. 2021 г.'));
  //     it('"d=2-digit$m=long"                             - 12.04.2021 -> 12 апреля', () => expect(formattingView('2021-04-12', { ...type, ...formatString_2 })).toBe('12 апреля'));
  //     it('"d=numeric$m=numeric$y=2-digit"                - 01.04.2021 -> 01.04.21', () => expect(formattingView('2021-04-01', { ...type, ...formatString_3 })).toBe('01.04.21'));
  //   });
  // });
  // describe('Type Boolean', () => {
  //   const type = { valueType: 'boolean' };
  //   it('Value 1   - true  -> Да', () => expect(formattingView(true, { ...type })).toBe('Да'));
  //   it('Value 2   - false -> Нет', () => expect(formattingView(false, { ...type })).toBe('Нет'));
  //   it('Value 3   - 1 -> Да', () => expect(formattingView(1, { ...type })).toBe('Да'));
  //   it('Value 4   - 0 -> Нет', () => expect(formattingView(0, { ...type })).toBe('Нет'));
  //   describe('Format string:', () => {
  //     const formatString_1 = { formatString: 'true=Так точно$false=Отнюдь' };
  //     it('"true=Так точно$false=Отнюдь"                  - true  -> Так точно', () => expect(formattingView(true, { ...type, ...formatString_1 })).toBe('Так точно'));
  //     it('"true=Так точно$false=Отнюдь"                  - false -> Отнюдь', () => expect(formattingView(false, { ...type, ...formatString_1 })).toBe('Отнюдь'));
  //   });
  // });
});
