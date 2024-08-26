// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2024 Gemeente Amsterdam
import { inPast } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const overlastOpHetWater = {
  locatie,
  dateTime: {
    meta: {
      label: 'Wanneer heeft u de overlast?',
    },
    options: {
      validators: [inPast, 'required'],
    },
    render: QuestionFieldType.DateTimeInput,
  },
  extra_boten_drijfkracht: {
    meta: {
      ifOneOf: {
        subcategory: 'overlast-op-het-water-gezonken-boot',
      },
      values: {
        ja: 'Ja, de boot ligt volledig onder water',
        nee: 'Nee, de boot kan nog drijven',
      },
      label: 'Ligt de boot volledig onder water of kan hij nog drijven?',
      shortLabel: 'Drijfkracht',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_boten_vast: {
    meta: {
      ifOneOf: {
        subcategory: 'overlast-op-het-water-gezonken-boot',
      },
      values: {
        ja: 'Ja, de boot ligt vast',
        nee: 'Nee, de boot kan wegdrijven',
      },
      label:
        'Ligt de boot nog vast? Of kan de boot wegdrijven zodat hij de vaarweg blokkeert?',
      shortLabel: 'Boot vast',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_boten_lekken: {
    meta: {
      ifOneOf: {
        subcategory: 'overlast-op-het-water-gezonken-boot',
      },
      values: {
        ja: 'Ja, boot lekt vloeistof',
        nee: 'Nee, boot lekt geen vloeistof',
        weetniet: 'Weet ik niet',
      },
      label: 'Lekt de boot olie of een andere vloeistof?',
      shortLabel: 'Lekt vloeistof',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },
}

export default overlastOpHetWater
