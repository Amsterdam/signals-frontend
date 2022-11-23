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
import { useMyIncidents } from '../hooks'
import type { MyIncident } from '../types'
import { ContentWrapper, Wrapper, StyledRow } from './styled'

export const Detail = () => {
  const { get, data, error } = useFetch<MyIncident>()
  const [showMap, setShowMap] = useState(false)
  const history = useHistory()
  const location = useLocationReferrer() as Location
  const { incidentsDetail, setIncidentsDetail } = useMyIncidents()
  const incidentDisplay = useRef<string>()
  const locationPathArray = location.pathname.split('/')
  const token = locationPathArray[locationPathArray.length - 2]
  const uuid = locationPathArray[locationPathArray.length - 1]

  useEffect(() => {
    data && setIncidentsDetail(data)
    incidentDisplay.current = data?._display
  }, [data, setIncidentsDetail])

  useEffect(() => {
    get(
      `${configuration.MY_SIGNALS_ENDPOINT}/${uuid}`,
      {},
      {},
      { Authorization: `Token ${token}` }
    )
  }, [get, location.pathname, token, uuid])

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
        {showMap && incidentsDetail?.location ? (
          <Map
            close={() => setShowMap(false)}
            location={incidentsDetail.location}
          />
        ) : (
          <ContentWrapper>
            <IncidentsDetailComponent
              incidentsDetail={incidentsDetail}
              token={token}
              setShowMap={setShowMap}
            />
            <History incident={incidentsDetail} />
          </ContentWrapper>
        )}
      </Wrapper>
    </StyledRow>
  )
}
