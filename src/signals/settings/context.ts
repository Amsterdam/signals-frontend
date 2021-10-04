// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { createContext } from 'react'

import { initialState } from './reducer'

import type { State } from './reducer'
import type { Actions } from './actions'

interface ContextType {
  state: State
  dispatch: (action: Actions) => void
}

export default createContext<ContextType>({
  state: initialState,
  dispatch: () => {},
})
