// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'
import locatie from './locatie'

export const ICON_SIZE = 40

export const controls = {
  locatie,
  extra_afval: {
    meta: {
      ifOneOf: {
        subcategory: ['grofvuil', 'huisafval', 'puin-sloopafval'],
      },
      label: 'Waar komt het afval vandaan, denkt u?',
      shortLabel: 'Waar vandaan',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
}

export default controls
