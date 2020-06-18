import { dateToString, dateToTime } from 'shared/services/date-formatter';

export const string2date = value => {
  if (!value) return '';

  const date = new Date(value);
  return date ? dateToString(date) : `[${value}]`;
};

export const string2time = value => {
  if (!value) return '';

  const date = new Date(value);
  return date ? dateToTime(date) : `[${value}]`;
};
