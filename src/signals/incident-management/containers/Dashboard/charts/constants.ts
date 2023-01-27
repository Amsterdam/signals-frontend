// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
export const timeFormatLocale = {
  dateTime: '%a %e %B %Y %X',
  date: '%d-%m-%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: [
    'zondag',
    'maandag',
    'dinsdag',
    'woensdag',
    'donderdag',
    'vrijdag',
    'zaterdag',
  ],
  shortDays: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
  months: [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ],
  shortMonths: [
    'jan',
    'feb',
    'mrt',
    'apr',
    'mei',
    'jun',
    'jul',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec',
  ],
}

export /** Mock data */
const mockValues = [
  { date: '01 Jan 2012 23:00:00', amount: 48 },
  { date: '02 Jan 2012 23:00:00', amount: 34 },
  { date: '03 Jan 2012 23:00:00', amount: 44 },
  { date: '04 Jan 2012 23:00:00', amount: 40 },
  { date: '05 Jan 2012 23:00:00', amount: 48 },
  { date: '06 Jan 2012 23:00:00', amount: 45 },
  {
    date: '07 Jan 2012 23:00:00',
    amount: 50,
    image: '/assets/images/area-chart-tooltip.svg',
  },
]
