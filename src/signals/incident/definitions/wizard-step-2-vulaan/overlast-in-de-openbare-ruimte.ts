// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'

import dateTime from './dateTime'
import locatie from './locatie'

export const overlastInDeOpenbareRuimte = {
  locatie,
  dateTime,
  extra_auto_scooter_bromfietswrak: {
    meta: {
      ifAllOf: {
        subcategory: 'auto-scooter-bromfietswrak',
      },
      label:
        'Wat weet u over hoe het wrak eruit ziet? Weet u waar het wrak ligt?',
      shortLabel: 'Extra informatie',
      subtitle: 'Bijvoorbeeld: kenteken, merk, kleur, roest, zonder wielen',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_fietswrak: {
    meta: {
      ifAllOf: {
        subcategory: 'fietswrak',
      },
      label:
        'Wat weet u over hoe het wrak eruit ziet? Weet u waar het wrak ligt?',
      subtitle: 'Bijvoorbeeld: merk, kleur, roest, zonder wielen',
      shortLabel: 'Extra informatie',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
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
