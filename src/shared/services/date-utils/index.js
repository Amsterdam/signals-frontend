import format from 'date-fns/format';

export const dateToISOString = date =>
  date &&
    `${String(date.getFullYear())}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const dateToString = date => date && format(date, 'dd-MM-yyyy', date);
export const capitalize = value => value && (value[0].toUpperCase() + value.substring(1));
