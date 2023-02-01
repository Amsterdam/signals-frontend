// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const civieleConstructies = {
  locatie,
  extra_brug: {
    meta: {
      ifAllOf: {
        subcategory: 'bruggen',
      },
      label: 'Wat is de naam of het nummer van de brug?',
      shortLabel: 'Naam brug',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
}

export default civieleConstructies
