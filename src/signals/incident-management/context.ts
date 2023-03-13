// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { Dispatch, SetStateAction as SetStateActionReact } from 'react'
import { createContext } from 'react'

import type { DashboardFilter } from './containers/Dashboard/components/Filter/types'
import type { Definition } from './definitions/types'
import type { DepartmentDetails } from '../../types/api/incident'

type SetStateAction<S> = (prevState: S) => S

export interface IncidentManagementContextType {
  setDashboardFilter: Dispatch<SetStateAction<DashboardFilter> | null>
  dashboardFilter: DashboardFilter | null
  dashboardFiltersActive: boolean
  setDashboardFiltersActive: Dispatch<SetStateActionReact<boolean>>
  districts?: Definition[]
  departmentsWithResponsibleCategories?: {
    departments: DepartmentDetails[]
    isLoading: boolean
  }
}

const initialContext = {
  dashboardFiltersActive: false,
  districts: undefined,
  setDashboardFilter: (state: any) => state,
  setDashboardFiltersActive: (boolean: any) => boolean,
  dashboardFilter: null,
}

const IncidentManagementContext =
  createContext<IncidentManagementContextType>(initialContext)

export default IncidentManagementContext
