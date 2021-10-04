// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import format from 'date-fns/format'
import nl from 'date-fns/locale/nl'

export const formatDate = (date: Date): string =>
  format(date, 'dd MMMM yyyy, HH:mm', {
    locale: nl,
  }) + ' uur'
