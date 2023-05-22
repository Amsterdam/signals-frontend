// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import {
  falsyOrNumber,
  inPast,
} from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const ICON_SIZE = 40

export const controls = {
  locatie,
  dateTime: {
    meta: {
      ifOneOf: {
        subcategory: ['asbest-accu', 'handhaving-op-afval'],
      },
      label: 'Wanneer was het?',
      ignoreVisibility: true,
      canBeNull: true,
    },
    options: {
      validators: [falsyOrNumber, inPast],
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
