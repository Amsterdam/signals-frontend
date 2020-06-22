import { dateToString } from 'shared/services/date-utils';
import format from 'date-fns/format';

export const string2date = value => {
  if (!value) return '';

  const date = new Date(value);
  return date ? dateToString(date) : `[${value}]`;
};

export const string2time = value => {
  if (!value) return '';

  const date = new Date(value);
  return date ? format(date, 'HH:mm', date) : `[${value}]`;
};
