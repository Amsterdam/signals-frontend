// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { createContext } from 'react'
import type { Definition } from 'signals/incident-management/definitions/types'

interface AppContextValue {
  loading: boolean
  sources: Array<Definition>
}

const initialContext: AppContextValue = { loading: false, sources: [] }

const AppContext = createContext(initialContext)

export default AppContext
