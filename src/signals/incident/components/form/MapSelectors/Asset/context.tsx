// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { createContext } from 'react'
import type { AssetSelectValue } from './types'

export const initialValue: AssetSelectValue = {
  selection: [],
  location: [0, 0],
  meta: {
    name: '',
    endpoint: '',
    featureTypes: [],
    wfsFilter: '',
    icons: [],
    extraProperties: [],
  },
  message: undefined,
  update: /* istanbul ignore next */ () => {},
  edit: /* istanbul ignore next */ () => {},
  close: /* istanbul ignore next */ () => {},
  setMessage: /* istanbul ignore next */ () => {},
}

const AssetSelectContext = createContext(initialValue)

interface AssetSelectProviderProps {
  value: AssetSelectValue
}

export const AssetSelectProvider: FunctionComponent<AssetSelectProviderProps> =
  ({ value, children }) => (
    <AssetSelectContext.Provider value={value}>
      {children}
    </AssetSelectContext.Provider>
  )

export default AssetSelectContext
