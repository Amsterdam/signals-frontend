// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { dateToString } from 'shared/services/date-utils';
import format from 'date-fns/format';

export const string2date = value => {
  if (!value) return '';

  try {
    const date = new Date(value);

    return dateToString(date);
  } catch {
    return `[${value}]`;
  }
};

export const string2time = value => {
  if (!value) return '';

  try {
    const date = new Date(value);
    return format(date, 'HH:mm', date);
  } catch {
    return `[${value}]`;
  }
};
