// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { StatusListItem } from './types'

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

export const statusList: StatusListItem[] = [
  {
    query: 'reopened',
    label: 'Heropend',
  },
  {
    query: 'done+external',
    label: 'Extern: afgehandeld',
  },
  {
    query: 'ingepland',
    label: 'Ingepland',
  },
  {
    query: 'reopen+requested',
    label: 'Verzoek tot heropenen',
  },
  {
    query: 'reaction+received',
    label: 'Reactie ontvangen',
  },
  {
    query: 'b',
    label: 'In behandeling',
  },
  {
    query: 's',
    label: 'Gesplitst',
  },
  {
    query: 'reaction+requested',
    label: 'Reactie gevraagd',
  },
  {
    query: 'm',
    label: 'Gemeld',
  },
  {
    query: 'i',
    label: 'Afwachting van behandeling',
  },
  {
    query: 'closure+requested',
    label: 'Extern: verzoek tot afhandeling',
  },
]
