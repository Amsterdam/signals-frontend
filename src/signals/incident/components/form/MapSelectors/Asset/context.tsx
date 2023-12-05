// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import { createContext } from 'react'
import type { ReactNode } from 'react'

import type { AssetSelectValue } from './types'

export const initialValue: AssetSelectValue = {
  coordinates: { lat: 0, lng: 0 },
  message: undefined,
  meta: {
    endpoint: '',
    featureTypes: [],
    featureStatusTypes: [],
    extraProperties: [],
    maxNumberOfAssets: undefined,
  },
  selection: undefined,
  selectableFeatures: undefined,
  addressLoading: false,
  fetchLocation: /* istanbul ignore next */ () => {},
  setLocation: /* istanbul ignore next */ () => {},
  setMessage: /* istanbul ignore next */ () => {},
  setItem: /* istanbul ignore next */ () => {},
  removeItem: /* istanbul ignore next */ () => {},
  setSelectableFeatures: /* istanbul ignore next */ () => {},
  setAddressLoading: /* istanbul ignore next */ () => {},
}

const AssetSelectContext = createContext(initialValue)

interface AssetSelectProviderProps {
  value: AssetSelectValue
  children: ReactNode
}

export const AssetSelectProvider = ({
  value,
  children,
}: AssetSelectProviderProps) => (
  <AssetSelectContext.Provider value={value}>
    {children}
  </AssetSelectContext.Provider>
)

export default AssetSelectContext
