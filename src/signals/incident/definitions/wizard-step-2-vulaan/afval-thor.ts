// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import { inPast } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const controls = {
  locatie,
  dateTime: {
    meta: {
      label: 'Wanneer is of was de overlast?',
      canBeNull: true,
    },
    options: {
      validators: [inPast, 'required'],
    },
    render: QuestionFieldType.DateTimeInput,
  },
  extra_afval_handhaving: {
    meta: {
      label: 'Welk afval is verkeerd neergezet?',
      subtitle:
        'U helpt ons door zoveel mogelijk informatie te geven over het soort afval: huisafval, bedrijfsafval, grofvuil of dozen en papier.',
      shortLabel: 'Welk afval',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
  extra_afval_handhaving_owner: {
    meta: {
      label:
        'Weet u wie de eigenaar is van het verkeerd geplaatste afval? Bijvoorbeeld omdat u dat ziet aan een adressticker of iets anders?',
      shortLabel: 'Welke eigenaar',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_afval_handhaving_owner_confirmation: {
    meta: {
      ifOneOf: {
        extra_afval_handhaving_owner: 'ja',
      },
      value:
        'Wij willen graag telefonisch contact met u hierover. Als u dat goed vindt, vul dan uw telefoonnummer in op de volgende pagina.',
      type: 'info',
    },
    render: QuestionFieldType.PlainText,
  },
}
export default controls
