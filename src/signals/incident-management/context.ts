// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { createContext } from 'react'

import type { StandardTextsAdminValue } from './containers/StandardTextsAdmin/types'
import type { Definition } from './definitions/types'

const initialContext = {
  districts: undefined,
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

const IncidentManagementContext = createContext<{
  districts?: Definition[]
  standardTexts: StandardTextsAdminValue
}>(initialContext)

export default IncidentManagementContext
