// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { Dispatch } from 'react'
import { createContext } from 'react'

import type { Option } from './containers/Dashboard/components/Filter/types'
import type { Definition } from './definitions/types'
import type { DepartmentDetails } from '../../types/api/incident'

const initialContext = {
  districts: undefined,
  setDashboardFilter: () => {},
}

const IncidentManagementContext = createContext<{
  setDashboardFilter: Dispatch<{ [key: string]: Option } | null>
  dashboardFilter?: { [key: string]: Option }
  districts?: Definition[]
  departmentsWithResponsibleCategories?: {
    departments: DepartmentDetails[]
    isLoading: boolean
  }
}>(initialContext)

export default IncidentManagementContext
