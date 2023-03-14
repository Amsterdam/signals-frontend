// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { useMemo, useState } from 'react'

import { useSelector } from 'react-redux'

import type { DepartmentDetails } from 'types/api/incident'

import type { DashboardFilter } from './containers/Dashboard/components/Filter/types'
import { IncidentManagementContext } from './context'
import type { IncidentManagementContextModel } from './context'
import { makeSelectDistricts } from './selectors'

interface Props {
  children: React.ReactNode
}

export const IncidentManagementProvider = ({ children }: Props) => {
  const districts = useSelector(makeSelectDistricts)

  const [dashboardFilter, setDashboardFilter] =
    useState<Partial<DashboardFilter> | null>(null)
  const [dashboardFiltersActive, setDashboardFiltersActive] = useState(false)
  const [departments, setDepartments] = useState<DepartmentDetails[] | null>(
    null
  )

  const value = useMemo<IncidentManagementContextModel>(
    () => ({
      dashboardFilter,
      dashboardFiltersActive,
      departments,
      districts,
      setDashboardFilter,
      setDashboardFiltersActive,
      setDepartments,
    }),
    [dashboardFilter, dashboardFiltersActive, departments, districts]
  )

  return (
    <IncidentManagementContext.Provider value={value}>
      {children}
    </IncidentManagementContext.Provider>
  )
}
