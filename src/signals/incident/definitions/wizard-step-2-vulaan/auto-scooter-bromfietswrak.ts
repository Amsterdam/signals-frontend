// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

const autoScooterBromfietswrak = {
  locatie,
  auto_scooter_bromfietswrak: {
    meta: {
      label: 'Wat weet u over hoe het wrak eruit ziet?',
      shortLabel: 'Extra informatie',
      subtitle: 'Bijvoorbeeld: kenteken, merk, kleur',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
}

export default autoScooterBromfietswrak
