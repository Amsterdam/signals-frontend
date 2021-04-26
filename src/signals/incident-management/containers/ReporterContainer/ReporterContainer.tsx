// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import LoadingIndicator from 'components/LoadingIndicator'
import IncidentList from './components/IncidentList'
import Header from './components/Header'
import { useReporter } from './hooks'

const Wrapper = styled.article`
  margin: 0 ${themeSpacing(11)};
`

const StyledHeader = styled(Header)`
  margin-top: ${themeSpacing(6)};
`

const Content = styled.div`
  margin-top: ${themeSpacing(6)};
  display: flex;
  border-top: 1px solid ${themeColor('tint', 'level3')};
`

const StyledIncidentList = styled(IncidentList)`
  width: 50%;
  margin: 0;
  padding: 0;
`

const Incident = styled.div`
  width: 50%;
  border-left: 1px solid ${themeColor('tint', 'level3')};
`

const ReporterContainer: React.FunctionComponent = () => {
  const {
    reporter,
    isLoading,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
  } = useReporter()

  return (
    <Wrapper data-testid="reporterContainer">
      {reporter.email && reporter.incidents && (
        <StyledHeader
          id={reporter.originalIncidentId}
          email={reporter.email}
          count={reporter.incidents.count}
        />
      )}

      {selectedIncident && reporter.incidents && selectedIncidentId && (
        <Content>
          <StyledIncidentList
            list={reporter.incidents.results}
            selectedIncidentId={selectedIncidentId}
            setSelectedIncidentId={setSelectedIncidentId}
          />

          {/* TODO SIG-3675 */}
          <Incident>
            {selectedIncidentId === selectedIncident?.id && (
              <>
                {selectedIncident?.id} {selectedIncident?.text}
              </>
            )}
          </Incident>
        </Content>
      )}

      {isLoading && <LoadingIndicator />}
    </Wrapper>
  )
}

export default ReporterContainer
