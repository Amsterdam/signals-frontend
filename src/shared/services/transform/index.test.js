import { formatWeekOrWorkdays } from '.';

describe('transform service', () => {
  it('should transform week and calendar days in singular and plural', () => {
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
