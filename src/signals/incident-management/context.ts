// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'

import type { DashboardFilter } from './containers/Dashboard/components/Filter/types'
import type { Definition } from './definitions/types'
import type { DepartmentDetails } from '../../types/api/incident'

export interface IncidentManagementContextType {
  setDashboardFilter: Dispatch<SetStateAction<DashboardFilter> | null>
  dashboardFilter: DashboardFilter | null
  dashboardFiltersActive: boolean
  setDashboardFiltersActive: Dispatch<SetStateAction<boolean>>
  districts?: Definition[]
  departmentsWithResponsibleCategories?: {
    departments: DepartmentDetails[]
    isLoading: boolean
  }
  departments: DepartmentDetails[] | null
  setDepartments: Dispatch<SetStateAction<DepartmentDetails[]> | null>
}

const initialContext = {
  dashboardFiltersActive: false,
  districts: undefined,
  setDashboardFilter: (dashboardFilter: any) => dashboardFilter,
  setDashboardFiltersActive: (boolean: any) => boolean,
  dashboardFilter: null,
  departments: null,
  setDepartments: (state: any) => state,
}

const IncidentManagementContext =
  createContext<IncidentManagementContextType>(initialContext)

export default IncidentManagementContext
