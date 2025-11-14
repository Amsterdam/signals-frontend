// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import { inPast } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const overlastInDeOpenbareRuimte = {
  locatie,
  dateTime: {
    meta: {
      label: 'Wanneer is of was de overlast?',
    },
    options: {
      validators: [inPast, 'required'],
    },
    render: QuestionFieldType.DateTimeInput,
  },
  extra_parkeeroverlast: {
    meta: {
      ifAllOf: {
        subcategory: 'parkeeroverlast',
      },
      label: 'Wat weet u over de auto, bus of motor?',
      shortLabel: 'Extra informatie',
      subtitle: 'Bijvoorbeeld: kenteken, merk en kleur',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
}

export default overlastInDeOpenbareRuimte
