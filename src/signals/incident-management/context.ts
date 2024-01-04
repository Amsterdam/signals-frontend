// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { createContext, useContext } from 'react'

import type { User } from 'containers/App/types'

import type { StandardTextsAdminValue } from './containers/StandardTextsAdmin/types'
import type { Definition } from './definitions/types'

const initialContext = {
  districts: undefined,
  users: null,
  standardTexts: {
    page: 1,
    setPage: () => {},
    statusFilter: null,
    setStatusFilter: () => {},
    activeFilter: null,
    setActiveFilter: () => {},
    searchQuery: '',
    setSearchQuery: () => {},
  },
}

interface IncidentManagementContext {
  districts?: Definition[]
  standardTexts: StandardTextsAdminValue
  users?: User | null
  referrer?: string
}

export const IncidentManagementContext =
  createContext<IncidentManagementContext>(initialContext)

export const useIncidentManagementContext = (): IncidentManagementContext => {
  const context = useContext(IncidentManagementContext)

  if (context === null) {
    throw new Error(
      'Missing IncidentManagementContext provider. You have to wrap the application with the IncidentManagement provider component.'
    )
  }

  return context
}
