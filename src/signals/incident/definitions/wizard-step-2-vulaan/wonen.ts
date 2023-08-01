// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { leegstand } from './wonen-leegstand'
import { onderhuur } from './wonen-onderhuur'
import { overig } from './wonen-overig'
import { vakantieverhuur } from './wonen-vakantieverhuur'
import { verhuurderschap } from './wonen-verhuurschap'
import { woningdelen } from './wonen-woningdelen'
import { woningkwaliteit } from './wonen-woningkwaliteit'

export const controls = {
  ...leegstand,
  ...onderhuur,
  ...vakantieverhuur,
  ...verhuurderschap,
  ...woningdelen,
  ...woningkwaliteit,
}

const wonen = {
  ...overig,
  ...controls,
}

export default wonen
