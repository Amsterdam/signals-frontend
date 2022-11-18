// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useEffect, useMemo, useRef, useState } from 'react'

import { Link, Paragraph } from '@amsterdam/asc-ui'
import { useHistory } from 'react-router-dom'

import useFetch from '../../../hooks/useFetch'
import useLocationReferrer from '../../../hooks/useLocationReferrer'
import configuration from '../../../shared/services/configuration/configuration'
import { Map } from '../components/Map'
import { routes } from '../definitions'
import { useMyIncidents } from '../hooks'
import type { MyIncident } from '../types'
import { BasePage } from './BasePage'
import { StyledImg, FormTitle } from './styled'

export const Detail = () => {
  const { get, data, error } = useFetch<MyIncident>()
  const [showMap, setShowMap] = useState(false)
  const history = useHistory()
  const location = useLocationReferrer() as Location
  const { incidentsDetail, setIncidentsDetail } = useMyIncidents()
  const incidentDisplay = useRef<string>()

  useEffect(() => {
    data && setIncidentsDetail(data)
    incidentDisplay.current = data?._display
  }, [data, setIncidentsDetail])

  useEffect(() => {
    const locationPathArray = location.pathname.split('/')
    const token = locationPathArray[locationPathArray.length - 2]
    const uuid = locationPathArray[locationPathArray.length - 1]
    get(
      `${configuration.MY_SIGNALS_ENDPOINT}/${uuid}`,
      {},
      {},
      { Authorization: `Token ${token}` }
    )
  }, [])

  useEffect(() => {
    if (error) {
      history.push(routes.expired)
    }
  }, [error, history])

  const answersGebeurtHetVaker = useMemo(() => {
    return data?.extra_properties?.find(
      (property) => property.id === 'extra_personen_overig_vaker_momenten'
    )?.answer
  }, [data?.extra_properties])

  if (!incidentsDetail) {
    return null
  }

  return (
    <BasePage
      pageInfo={{
        documentTitle: `Meldingsnummer: ${incidentDisplay.current}`,
        dataTestId: 'IncidentNumber',
        pageTitle: showMap
          ? undefined
          : `Meldingsnummer: ${incidentDisplay.current}`,
      }}
    >
      {showMap && incidentsDetail.location ? (
        <Map location={incidentsDetail.location} />
      ) : (
        <>
          <FormTitle>Omschrijving</FormTitle>
          <Paragraph strong>{data?.text}</Paragraph>

          {data?._links?.['sia:attachments'] && <FormTitle>Foto</FormTitle>}
          {data?._links?.['sia:attachments']?.map((attachment) => (
            <StyledImg
              key={attachment.href}
              style={{ marginBottom: '24px' }}
              src={attachment.href}
            />
          ))}

          <FormTitle>Locatie</FormTitle>
          <Paragraph strong style={{ marginBottom: 0 }}>
            {data?.location?.address_text}
          </Paragraph>
          <Link
            style={{ marginBottom: '24px' }}
            variant="inline"
            onClick={() => setShowMap(true)}
          >
            Bekijk op kaart (coming soon)
          </Link>

          {/* hier moeten dynamisch extra properties worden ingeladen ? */}

          {answersGebeurtHetVaker && (
            <>
              <FormTitle>Gebeurt het vaker?</FormTitle>
              <Paragraph strong>{answersGebeurtHetVaker}</Paragraph>
            </>
          )}
        </>
      )}
    </BasePage>
  )
}
