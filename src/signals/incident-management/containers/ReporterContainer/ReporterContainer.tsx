// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { CompactPager } from '@amsterdam/asc-ui'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import LoadingIndicator from 'components/LoadingIndicator'

import Header from './components/Header'
import IncidentDetail from './components/IncidentDetail'
import IncidentList from './components/IncidentList'
import { useFetchReporter, PAGE_SIZE } from './useFetchReporter'

const Wrapper = styled.article`
  margin: ${themeSpacing(11)};
  margin-top: 0;
  overflow-wrap: anywhere;
`

const StyledHeader = styled(Header)`
  margin-top: ${themeSpacing(6)};
`

const Content = styled.div`
  margin-top: ${themeSpacing(6)};
  display: grid;
  grid-template-columns: 49fr 51fr;
  border-top: 1px solid ${themeColor('tint', 'level4')};
`

const StyledIncidentList = styled(IncidentList)`
  margin: 0;
  padding: 0;
  border-right: 1px solid ${themeColor('tint', 'level4')};
`

const StyledCompactPager = styled(CompactPager)`
  max-width: 180px;
  margin-top: ${themeSpacing(6)};
`

const NotPermittedMessage = styled.p`
  background-color: ${themeColor('tint', 'level3')};
  margin: ${themeSpacing(6)} ${themeSpacing(8)} auto;
  padding: ${themeSpacing(4)};
`

const ReporterContainer: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>()

  const { incident, incidents, selectIncident, currentPage, setCurrentPage } =
    useFetchReporter(id as string)

  const header = incident.data?.reporter?.email && incidents.data?.count && (
    <StyledHeader
      id={id as string}
      email={incident.data.reporter.email}
      count={incidents.data.count}
    />
  )

  const loadingIncidator = (incident.isLoading || incidents.isLoading) && (
    <LoadingIndicator />
  )

  const pagination = incidents?.data?.count &&
    incidents.data.count / PAGE_SIZE > 1 && (
      <StyledCompactPager
        collectionSize={incidents.data.count}
        pageSize={PAGE_SIZE}
        page={currentPage}
        onPageChange={setCurrentPage}
      />
    )

  return (
    <Wrapper data-testid="reporter-container">
      {header}

      <Content>
        {incidents.data && incident.id && (
          <div data-testid="incident-list">
            <StyledIncidentList
              list={incidents.data.list}
              selectedIncidentId={incident.id}
              selectIncident={selectIncident}
            />
            {pagination}
          </div>
        )}

        {incident.canView &&
          incident.data &&
          incident.data.id === incident.id && (
            <IncidentDetail incident={incident.data} />
          )}

        {incident.canView === false && (
          <NotPermittedMessage>
            Je hebt geen toestemming om meldingen in deze subcategorie te
            bekijken
          </NotPermittedMessage>
        )}
      </Content>

      {loadingIncidator}
    </Wrapper>
  )
}

export default ReporterContainer
