// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
/* istanbul ignore file */
import { createContext, useContext } from 'react'

import type { StandardTextsAdminValue } from './types'

export const StandardTextsAdminContext =
  createContext<StandardTextsAdminValue | null>(null)

export const useStandardTextAdminContext = (): StandardTextsAdminValue => {
  const context = useContext(StandardTextsAdminContext)

  if (context === null) {
    throw new Error(
      'Missing StandardTextsAdminContext provider. You have to wrap the application with the MyIncidentsProvider component.'
    )
  }

  return context
}
