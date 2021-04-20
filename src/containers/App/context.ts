// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import type { KeyValuePair } from './types'

interface AppContextValue {
  loading: boolean
  sources: KeyValuePair<string>[] | null
}

const initialContext: AppContextValue = { loading: false, sources: null }

const AppContext = React.createContext(initialContext)

export default AppContext
