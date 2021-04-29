// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { createContext } from 'react'

import { initialState } from './reducer'

interface ContextType {
  state: typeof initialState
  dispatch?: (action: Record<string, unknown>) => void
}

export default createContext<ContextType>({ state: initialState })
