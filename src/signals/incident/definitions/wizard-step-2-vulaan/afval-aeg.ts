// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2025 Gemeente Amsterdam

import { format } from 'date-fns/format'
import { nl } from 'date-fns/locale/nl'
import { subDays } from 'date-fns/subDays'

import { capitalize } from 'shared/services/date-utils'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

const getFormattedDate = (date: Date) =>
  capitalize(format(date, 'EEEE d MMMM', { locale: nl }))

const formatDate = (offset: number) => {
  const date = subDays(new Date(), offset)

  return getFormattedDate(date)
}

export const controls = {
  locatie,
  extra_wanneer: {
    meta: {
      ifOneOf: {
        subcategory: [
          'grofvuil',
          'huisafval',
          'puin-sloopafval',
          'bruin-en-witgoed',
          'overig-afval',
        ],
      },
      label: 'Sinds wanneer ligt het afval daar?',
      shortLabel: 'Wanneer',
      pathMerge: 'extra_properties',
      values: {
        today: 'Vandaag',
        oneDayAgo: formatDate(1),
        twoDaysAgo: formatDate(2),
        threeDaysAgo: formatDate(3),
        fourDaysAgo: formatDate(4),
        fiveDaysAgo: formatDate(5),
        sixDaysAgo: formatDate(6),
      },
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },
  extra_wanneer_kerstbomen: {
    meta: {
      ifOneOf: {
        subcategory: ['kerstbomen'],
      },
      label: 'Sinds wanneer liggen de kerstbomen daar?',
      shortLabel: 'Wanneer',
      pathMerge: 'extra_properties',
      values: {
        today: 'Vandaag',
        oneDayAgo: formatDate(1),
        twoDaysAgo: formatDate(2),
        threeDaysAgo: formatDate(3),
        fourDaysAgo: formatDate(4),
        fiveDaysAgo: formatDate(5),
        sixDaysAgo: formatDate(6),
      },
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },
  extra_afval: {
    meta: {
      ifOneOf: {
        subcategory: ['grofvuil', 'huisafval', 'puin-sloopafval'],
      },
      label: 'Waar komt het afval vandaan, denkt u?',
      shortLabel: 'Waar vandaan',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
}
export default controls
