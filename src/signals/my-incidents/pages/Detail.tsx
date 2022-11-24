// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect, useRef, useState } from 'react'

import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import useFetch from '../../../hooks/useFetch'
import useLocationReferrer from '../../../hooks/useLocationReferrer'
import configuration from '../../../shared/services/configuration/configuration'
import { History } from '../components/History/History'
import { IncidentsDetail as IncidentsDetailComponent } from '../components/IncidentsDetail'
import { Map } from '../components/Map'
import { routes } from '../definitions'
import type { HistoryInstance, MyIncident } from '../types'
import { ContentWrapper, Wrapper, StyledRow } from './styled'

export const Detail = () => {
  const { get, data, error } = useFetch<MyIncident>()
  const fetchResponseHistory = useFetch<HistoryInstance[]>()
  const [showMap, setShowMap] = useState(false)
  const history = useHistory()
  const location = useLocationReferrer() as Location
  const incidentDisplay = useRef<string>()
  const locationPathArray = location.pathname.split('/')
  const token = locationPathArray[locationPathArray.length - 2]
  const uuid = locationPathArray[locationPathArray.length - 1]

  useEffect(() => {
    incidentDisplay.current = data?._display
  }, [data])

  useEffect(() => {
    get(
      `${configuration.MY_SIGNALS_ENDPOINT}/${uuid}`,
      {},
      {},
      { Authorization: `Token ${token}` }
    )
  }, [get, location.pathname, token, uuid])

  useEffect(() => {
    fetchResponseHistory.get(
      `${configuration.MY_SIGNALS_ENDPOINT}/${uuid}/history`,
      {},
      {},
      { Authorization: `Token ${token}` }
    )
    /**
     * Dont include fetchResponseHistory, as it will update each time data is
     * fetched and go infinite.
     */
  }, [fetchResponseHistory.get, location.pathname, token, uuid])

  useEffect(() => {
    if (error) {
      history.push(routes.expired)
    }
  }, [error, history])

  return (
    <StyledRow>
      <Wrapper>
        <Helmet
          defaultTitle={configuration.language.siteTitle}
          titleTemplate={`${configuration.language.siteTitle} - %s`}
        >
          <title>{`Meldingsnummer: ${incidentDisplay.current}`}</title>
        </Helmet>
        {showMap && data?.location ? (
          <Map close={() => setShowMap(false)} location={data.location} />
        ) : (
          <ContentWrapper>
            <IncidentsDetailComponent
              incidentsDetail={data}
              token={token}
              setShowMap={setShowMap}
            />
            <History incident={data} fetchResponse={fetchResponseHistory} />
          </ContentWrapper>
        )}
      </Wrapper>
    </StyledRow>
  )
}
