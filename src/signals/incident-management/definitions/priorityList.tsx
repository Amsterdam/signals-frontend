// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { Priority } from './types'

const priorityList: Priority[] = [
  {
    key: 'high',
    value: 'Hoog',
    info: 'melding met spoed oppakken',
    icon: 'PriorityHigh',
  },
  { key: 'normal', value: 'Normaal' },
  {
    key: 'low',
    value: 'Laag',
    info: 'interne melding zonder servicebelofte',
  },
]

export default priorityList
