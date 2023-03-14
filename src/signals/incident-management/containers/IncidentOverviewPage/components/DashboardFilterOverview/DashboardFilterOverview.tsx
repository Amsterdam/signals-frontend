// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect, useMemo } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'

import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'containers/IncidentOverviewTitle'
import dataLists from 'signals/incident-management/definitions'
import type { IncidentList } from 'types/api/incident-list'

import { useIncidentManagement } from '../../../../context'
import { DASHBOARD_URL } from '../../../../routes'
import type { Filter } from '../../../Dashboard/components/Filter/types'
import FilterTagList from '../../../FilterTagList/FilterTagList'
import {
  PageHeaderItem,
  PaginationWrapper,
  NavWrapper,
  NoResults,
  TitleRow,
  StyledBackLink,
} from '../../styled'
import List from '../List'
import Sort from '../Sort'

interface Props {
  activeFilter: Filter
  clearFiltersAction: () => void
  pagination: JSX.Element | null
  applyFilterAction: (payload: any) => {
    type: string
    payload: any
  }
  orderingChangedAction: (ordering: any) => {
    type: string
    payload: any
  }
  canRenderList: boolean
  incidents: {
    count: number
    loadingIncidents: boolean
    results: IncidentList
  }
}

export const DashboardFilterOverview = ({
  activeFilter,
  clearFiltersAction,
  pagination,
  applyFilterAction,
  orderingChangedAction,
  canRenderList,
  incidents,
}: Props) => {
  const { dashboardFilter } = useIncidentManagement()

  const validDashboardFilterOptions = useMemo(
    () =>
      dashboardFilter &&
      Object.fromEntries(
        Object.entries(dashboardFilter)
          .filter(
            ([k, v]) => (v?.value || k === 'status') && k !== 'department'
          )
          .map(([k, v]) =>
            k === 'punctuality' || k === 'status'
              ? [k, v?.value]
              : [k, [v?.value]]
          )
      ),
    [dashboardFilter]
  )

  useEffect(() => {
    applyFilterAction({ options: validDashboardFilterOptions })
  }, [applyFilterAction, validDashboardFilterOptions])

  return (
    <div data-testid="incident-management-dashboard-filter-overview">
      <Row>
        <StyledBackLink
          to={{
            pathname: DASHBOARD_URL,
          }}
        >
          Terug naar dashboard
        </StyledBackLink>

        <TitleRow>
          <PageHeader />
        </TitleRow>

        <Column span={12}>
          <PageHeaderItem>
            <FilterTagList
              tags={activeFilter.options}
              onClear={clearFiltersAction}
            />
          </PageHeaderItem>
        </Column>

        <NavWrapper>
          {pagination}
          <Sort onChangeOrdering={orderingChangedAction} />
        </NavWrapper>
      </Row>

      <Row>
        <Column span={12}>
          {incidents.loadingIncidents && <LoadingIndicator size={100} />}

          {canRenderList && (
            <List
              incidents={incidents.results}
              isLoading={incidents.loadingIncidents}
              {...dataLists}
            />
          )}

          {incidents.count === 0 && <NoResults>Geen meldingen</NoResults>}
        </Column>

        <PaginationWrapper>{pagination}</PaginationWrapper>
      </Row>
    </div>
  )
}
