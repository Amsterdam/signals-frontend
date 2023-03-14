// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

import type { DepartmentDetails } from 'types/api/incident'

import type { DashboardFilter } from './containers/Dashboard/components/Filter/types'
import type { Definition } from './definitions/types'

export interface IncidentManagementContextModel {
  dashboardFilter: Partial<DashboardFilter> | null
  dashboardFiltersActive: boolean
  departments: DepartmentDetails[] | null
  districts?: Definition[]
  setDashboardFilter: Dispatch<SetStateAction<Partial<DashboardFilter> | null>>
  setDashboardFiltersActive: Dispatch<SetStateAction<boolean>>
  setDepartments: Dispatch<SetStateAction<DepartmentDetails[] | null>>
}

const initialContext = {
  dashboardFilter: null,
  dashboardFiltersActive: false,
  departments: null,
  districts: undefined,
  setDashboardFilter: (dashboardFilter: any) => dashboardFilter,
  setDashboardFiltersActive: (boolean: any) => boolean,
  setDepartments: (state: any) => state,
}

export const IncidentManagementContext =
  createContext<IncidentManagementContextModel>(initialContext)

IncidentManagementContext.displayName = 'IncidentManagementContext'

export const useIncidentManagement = (): IncidentManagementContextModel => {
  const context = useContext(IncidentManagementContext)

  if (!context) {
    throw new Error(
      'No IncidentManagement context available. You might still need to wrap the application with the IncidentManagementProvider component.'
    )
  }

  return context
}
