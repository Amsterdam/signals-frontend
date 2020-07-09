import { dateToString, dateToISOString, capitalize } from '.';

describe('dateToISOString', () => {
  it('should convert the date object in the yyyy-MM-dd format', () => {
    const date = new Date('2011-02-16');
    expect(dateToISOString(date)).toEqual('2011-02-16');
  });
});

describe('dateToString', () => {
  it('should convert the date object in the dd-MM-yyyy format', () => {
    const date = new Date('2011-02-16');
    expect(dateToString(date)).toEqual('16-02-2011');
  });
});


describe('capitalize', () => {
  it('should capitalize the first letter of the string', () => {
    expect(capitalize('test')).toEqual('Test');
    expect(capitalize('123')).toEqual('123');
    expect(capitalize('TEST')).toEqual('TEST');
    expect(capitalize('tEST')).toEqual('TEST');
  });
});
