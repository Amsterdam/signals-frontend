import { string2date, string2time } from './string-parser';

describe('The string parser service', () => {
  it('should return the correct date value', () => {
    expect(string2date('1970-07-21T11:55:00')).toEqual('21-07-1970');
  });

  it('should return the correct time value', () => {
    expect(string2time('1970-07-21T11:55:00')).toEqual('11:55');
  });
});
