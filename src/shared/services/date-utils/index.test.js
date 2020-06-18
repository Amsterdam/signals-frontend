import { dateToString, dateToISOString } from './index';

describe('dateToString', () => {
  it('should convert the date object in the dd-MM-yyyy format', () => {
    const date = new Date('2011-02-16');
    expect(dateToString(date)).toEqual('16-02-2011');
  });
});

describe('dateToISOString', () => {
  it('should convert the date object in the yyyy-MM-dd format', () => {
    const date = new Date('2011-02-16');
    expect(dateToISOString(date)).toEqual('2011-02-16');
  });
});

describe('dateToTime', () => {
  it('should convert the date object in the yyyy-MM-dd format', () => {
    const date = new Date('2011-02-16T20:02');
    expect(dateToISOString(date)).toEqual('20:02');
  });
});
