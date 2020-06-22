import { dateToISOString } from './index';

describe('dateToISOString', () => {
  it('should convert the date object in the yyyy-MM-dd format', () => {
    const date = new Date('2011-02-16');
    expect(dateToISOString(date)).toEqual('2011-02-16');
  });
});
