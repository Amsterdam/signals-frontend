// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2025 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const fietswrak = {
  locatie,
  extra_fietswrak: {
    meta: {
      ifAllOf: {
        subcategory: 'fietswrak',
      },
      label: 'Hoe ziet het wrak eruit? Waar staat of ligt het wrak precies?',
      subtitle:
        'Bijvoorbeeld: merk, kleur, roest, zonder wielen, waar in het rek. Het helpt ons als u een foto toevoegt op de vorige pagina, zodat we de juiste fiets kunnen vinden.',
      shortLabel: 'Extra informatie',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
}

export default fietswrak
