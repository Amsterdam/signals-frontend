// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import {
  falsyOrNumberOrNow,
  inPast,
} from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const controls = {
  locatie,
  dateTime: {
    meta: {
      label: 'Wanneer was het?',
      canBeNull: true,
    },
    options: {
      validators: [falsyOrNumberOrNow, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
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
