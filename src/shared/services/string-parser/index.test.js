import { string2date, string2time } from '.';

describe('The string parser service', () => {
  it('should return the correct date value', () => {
    expect(string2date('1970-07-21T11:55:00')).toEqual('21-07-1970');
  });

  it('should return the correct time value', () => {
    expect(string2time('1970-07-21T11:55:00')).toEqual('11:55');
    expect(string2time('1970-07-21T08:05:00')).toEqual('08:05');
  });
});
