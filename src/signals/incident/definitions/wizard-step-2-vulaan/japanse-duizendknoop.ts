// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

const japanseDuizendknoop = {
  locatie,

  extra_japanse_duizendknoop_onveilig: {
    meta: {
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
      label: 'Zorgt de plant voor een onveilige situatie in het verkeer?',
      shortLabel: 'Onveilige situatie in het verkeer',
      subtitle:
        'Bijvoorbeeld door slecht zicht of omdat de plant over de rijweg of het fietspad hangt?',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_japanse_duizendknoop_onveilig_uitleg: {
    meta: {
      ifAllOf: {
        extra_japanse_duizendknoop_onveilig: 'ja',
      },
      label: 'Wat is er onveilig aan de situatie?',
      shortLabel: 'Wat is er onveilig aan de situatie?',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
}

export default japanseDuizendknoop
