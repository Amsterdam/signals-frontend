// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { ContentWrapper, StyledRow } from './styled'
import useFetch from '../../../hooks/useFetch'
import useLocationReferrer from '../../../hooks/useLocationReferrer'
import configuration from '../../../shared/services/configuration/configuration'
import { History } from '../components/History'
import { IncidentsDetail as IncidentsDetailComponent } from '../components/IncidentsDetail'
import { Map } from '../components/Map'
import { routes } from '../definitions'
import type { HistoryInstance } from '../types'
import type { MyIncidentDetail } from '../types'

export const Detail = () => {
  const { get, data, error } = useFetch<MyIncidentDetail>()
  const fetchResponseHistory = useFetch<HistoryInstance[]>()
  const [showMap, setShowMap] = useState(false)
  const navigate = useNavigate()
  const location = useLocationReferrer() as Location
  const locationPathArray = location.pathname.split('/')
  const token = locationPathArray[locationPathArray.length - 2]
  const uuid = locationPathArray[locationPathArray.length - 1]

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchResponseHistory.get, location.pathname, token, uuid])

  useEffect(() => {
    if (error) {
      navigate(routes.expired)
    }
  }, [error, navigate])

  if (!data) return null

  return (
    <StyledRow>
      <Helmet
        defaultTitle={configuration.language.siteTitle}
        titleTemplate={`${configuration.language.siteTitle} - %s`}
      >
        <title>{`Meldingsnummer: ${data._display}`}</title>
      </Helmet>
      {showMap ? (
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
    </StyledRow>
  )
}
