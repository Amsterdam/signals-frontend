// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const controls = {
  locatie,
  extra_afval_rolcontainer: {
    meta: {
      ifOneOf: {
        subcategory: ['rolcontainer-is-kapot'],
      },
      label: 'Wat is het probleem met de rolcontainer?',
      shortLabel: 'Probleem rolcontainer',
      pathMerge: 'extra_properties',
      values: {
        kapot: 'De rolcontainer is kapot en moet vervangen worden',
        vol: 'De rolcontainer is vol en moet worden geleegd',
        oneens:
          'Ik ben het er niet mee eens dat ik verplicht een rolcontainer krijg',
        anders: 'Iets anders',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_afval_rolcontainer_kapot: {
    meta: {
      ifOneOf: {
        extra_afval_rolcontainer: 'kapot',
      },
      value:
        'U kunt in een ander formulier [een nieuwe rolcontainer aanvragen](https://formulieren.amsterdam.nl/TriplEforms/DirectRegelen/formulier/nl-NL/evAmsterdam/Rolcontainer.aspx).',
      type: 'alert',
    },
    options: {
      validators: ['isBlocking'],
    },
    render: QuestionFieldType.PlainText,
  },
  extra_afval_rolcontainer_oneens: {
    meta: {
      ifOneOf: {
        extra_afval_rolcontainer: 'oneens',
      },
      value:
        'U kunt hier geen melding over doen. Kijk op [onze website](https://www.amsterdam.nl/afval-hergebruik/ondergrondse-afvalcontainers/) of u nog bezwaar kunt maken tegen de rolcontainer. Kies uw stadsdeel en klik op ‘Rolcontainers gfe/t voor huizen met een tuin’.',
      type: 'alert',
    },
    options: {
      validators: ['isBlocking'],
    },
    render: QuestionFieldType.PlainText,
  },
}
export default controls
