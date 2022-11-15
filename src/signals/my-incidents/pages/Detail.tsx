// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useEffect, useRef } from 'react'

import { FormTitle, Link, Paragraph, Row } from '@amsterdam/asc-ui'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import useFetch from '../../../hooks/useFetch'
import useLocationReferrer from '../../../hooks/useLocationReferrer'
import configuration from '../../../shared/services/configuration/configuration'
import { routes } from '../definitions'
import { useMyIncidents } from '../hooks'
import type { MyIncident } from '../types'
import { StyledHeading, StyledImg, Wrapper } from './styled'

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
    const token = location.pathname.split('/').at(-2)
    const uuid = location.pathname.split('/').at(-1)

    // TODO: Sanitize get request
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

        <FormTitle>Foto</FormTitle>
        {data?._links?.['sia:attachments']?.map((attachment) => (
          <StyledImg src={attachment.href} />
        ))}

        <FormTitle>Locatie</FormTitle>
        <Paragraph strong>{data?.location?.address_text}</Paragraph>
        <Link variant="inline" href={'/maps.google.com'}>
          Bekijk op kaart
        </Link>

        {/* hier moeten dynamisch extra properties worden ingeladen ? */}

        {/*<FormTitle>Gebeurt het vaker?</FormTitle>*/}
        {/*<Paragraph strong>*/}
        {/*</Paragraph>*/}
      </Wrapper>
    </Row>
  )
}
