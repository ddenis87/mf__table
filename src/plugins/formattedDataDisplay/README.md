## FormattedDataDisplay (Function)
------------

### Description
A function that returns a formatted value. You can pass a value type, format string, prefix, suffix to the function.

### Parameters
| Parameter | Type | Default | Discription |
| ------------ | ------------ | ------------ | ------------ |
| value | String |   | Formatted value |
| formattedOption | Object | {} | See section formattedOption |

#### formattedOption
| Parameter | Type | Default | Discription |
| --- | --- | --- | --- |
| valueType | String | 'string' | Variantes: <br> <li>string</li> <li>number</li> <li>date</li> <li>boolean</li> |
| valuePrefix | String | undefined | Symbol(s) inserting before formatted value |
| valueSuffix | String | undefined | Symbol(s) inserting after formatted value |
| formatString | String | undefined | See section formatString |

#### formatString

Key values are specified through '='. Keys are listed with '$' without spaces.

> Format string keys depend on value type.

| valueType | Key | Description | Default |
|---------------|-------|-----------------|-----------|
| number | | | |
|  | type | Numeric value type: <br> <li>decimal</li> <li>percent</li> <li>currency</li> | decimal |
|  | positive | Add '+' on positive value: <br> <li>true</li> <li>false</li> | false |
|  | minFD | Minimum number of decimal places (0 - 20) | 0 |
|  | maxFD | Maximum number of decimal places (minFD - 20) | 20 |
|  | minID | Minimum number of characters for integer part (1 - 21) | 21 |
|  | group | Grouping values by triads: <br>  <li>true</li> <li>false</li> | true |
| date | | | |
|  | d | Day format: <br> <li>2-digit</li> <li>numeric</li> | numeric |
|  | m | Month format: <br> <li>2-digit</li> <li>numeric</li> <li>narrow</li> <li>short</li> <li>long</li> | numeric |
|  | y | Year format: <br> <li>2-digit</li> <li>numeric</li> | numeric |
| boolean | | | |
|  | true | Expression for 'TRUE' | Да |
|  | false | Expression for 'FALSE' | Нет |

------------

### Return
Formatted value in string type.

### Examples
```javascript
formattedDataDisplay('text')  // 'text'
formattedDataDisplay(35, { valueType: 'number', formatString: 'positive=true$minFD=2' })  // '+35,00'
formattedDataDisplay('2021-04-01', { valueType: 'date', formatString: 'd=numeric$m=numeric$y=2-digit' })  // '01.04.21'
```
