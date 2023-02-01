// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { createContext } from 'react'

import type { Context } from './types'

const initialContext: Context = {
  incident: undefined,
  update: () => {},
}

const IncidentDetailContext = createContext(initialContext)

export default IncidentDetailContext
