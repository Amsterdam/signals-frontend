// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { dateToString, dateToISOString, capitalize, formatWeekOrWorkdays } from '.';

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

describe('format work/calendar days', () => {
  it('should return week and calendar days in singular and plural', () => {
    const calendarday = formatWeekOrWorkdays(1, true);
    expect(calendarday).toBe('dag');

    const calendardays = formatWeekOrWorkdays(5, true);
    expect(calendardays).toBe('dagen');

    const workday = formatWeekOrWorkdays(1, false);
    expect(workday).toBe('werkdag');

    const workdays = formatWeekOrWorkdays(5, false);
    expect(workdays).toBe('werkdagen');
  });
});
