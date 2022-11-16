// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useEffect, useMemo, useRef } from 'react'

import { Link, Paragraph, Row } from '@amsterdam/asc-ui'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import useFetch from '../../../hooks/useFetch'
import useLocationReferrer from '../../../hooks/useLocationReferrer'
import configuration from '../../../shared/services/configuration/configuration'
import { routes } from '../definitions'
import { useMyIncidents } from '../hooks'
import type { MyIncident } from '../types'
import { StyledHeading, StyledImg, Wrapper, FormTitle } from './styled'

export const Detail = () => {
  const { get, data, error } = useFetch<MyIncident>()
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
    <Row>
      <Wrapper>
        <Helmet
          defaultTitle={configuration.language.siteTitle}
          titleTemplate={`${configuration.language.siteTitle} - %s`}
        >
          <title>{`Mijn Meldingen: ${incidentDisplay.current}`}</title>
        </Helmet>

        <header>
          <StyledHeading>{`Mijn Meldingen: ${incidentDisplay.current}`}</StyledHeading>
        </header>

        <FormTitle>Omschrijving</FormTitle>
        <Paragraph strong>{data?.text}</Paragraph>

        {data?._links?.['sia:attachments'] && <FormTitle>Foto</FormTitle>}
        {data?._links?.['sia:attachments']?.map((attachment) => (
          <StyledImg style={{ marginBottom: '24px' }} src={attachment.href} />
        ))}

        <FormTitle>Locatie</FormTitle>
        <Paragraph strong style={{ marginBottom: 0 }}>
          {data?.location?.address_text}
        </Paragraph>
        <Link
          style={{ color: 'red', display: 'block', marginBottom: '24px' }}
          variant="inline"
          href={'/'}
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
      </Wrapper>
    </Row>
  )
}
