// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import { inPast } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const verkeersoverlast = {
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
}

export default verkeersoverlast
