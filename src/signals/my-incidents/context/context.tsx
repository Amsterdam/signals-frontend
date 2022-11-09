// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { createContext, useContext } from 'react'

import type { MyIncidentsValue } from '../types'

export const MyIncidentsContext = createContext<MyIncidentsValue | null>(null)

export const useMyIncidentContext = (): MyIncidentsValue => {
  const context = useContext(MyIncidentsContext)

  if (context === null) {
    throw new Error(
      'Missing MyIncidentsContext provider. You have to wrap the application with the MyIncidentsProvider component.'
    )
  }

  return context
}
