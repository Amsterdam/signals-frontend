// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { createContext } from 'react'

import type { FeatureCollection } from 'geojson'

export const NO_DATA: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

const WfsDataContext = createContext(NO_DATA)

interface WfsDataProviderProps {
  value: FeatureCollection
  children: ReactNode
}

export const WfsDataProvider = ({ value, children }: WfsDataProviderProps) => (
  <WfsDataContext.Provider value={value}>{children}</WfsDataContext.Provider>
)

export default WfsDataContext
