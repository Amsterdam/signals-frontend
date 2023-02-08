// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { Dispatch } from 'react'
import { createContext } from 'react'

import type { Option } from './containers/Dashboard/components/Filter/types'
import type { Definition } from './definitions/types'

const initialContext = {
  districts: undefined,
  setDashboardFilter: () => {},
}

const IncidentManagementContext = createContext<{
  setDashboardFilter: Dispatch<{ [key: string]: Option }>
  dashboardFilter?: { [key: string]: Option }
  districts?: Definition[]
  departmentsWithResponsibleCategories?: {
    list: Array<{
      name: string
      code: string
      category_names: string[]
    }>
  }
}>(initialContext)

export default IncidentManagementContext
